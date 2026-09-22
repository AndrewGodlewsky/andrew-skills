import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, existsSync, writeFileSync, symlinkSync } from 'node:fs';
import { tmpdir, release } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { test as nodeTest } from 'node:test';
import { metadata, entry } from './fixtures/releases.mjs';
import { createCopy, inspectCopy } from './export-filesystem.mjs';
import { skillContentIdentity } from './release-catalog.mjs';

const supported = process.platform === 'win32' || /microsoft/i.test(release());
const test = (name, fn) => nodeTest(name, { skip: !supported }, fn);

function fixture(t) {
  const parent = resolve(tmpdir());
  const home = mkdtempSync(join(parent, 'gt-export-test-'));
  t.after(() => {
    assert.equal(dirname(home), parent);
    assert.ok(home.startsWith(join(parent, 'gt-export-test-')));
    rmSync(home, { recursive: true, force: true });
  });
  const files = new Map([
    ['SKILL.md', { mode: '100644', data: Buffer.from('---\nname: example\ndescription: Explain a design.\n---\nExplain the design.\n') }],
    ['release.yaml', { mode: '100644', data: Buffer.from('version: "1.0.0"\nnotes: "Initial release."\nperiod: 1\nhistory: []\n') }],
    ['assets/sample.bin', { mode: '100644', data: Buffer.from([0, 255, 13, 10]) }],
    ['.link-probe', { mode: '100644', data: Buffer.from('Ordinary tracked resource.') }],
    ['scripts/example.mjs', { mode: '100755', data: Buffer.from('throw new Error("Historical scripts must not execute during export");\n') }],
  ]);
  const record = { repository: 'https://github.com/AndrewGodlewsky/andrew-skills', skill: 'example', version: '1.0.0',
    notes: 'Initial release.', period: 1, history: [], sourceCommit: '1'.repeat(40), sourceTree: '2'.repeat(40), skillPath: 'skills/example',
    contentIdentity: skillContentIdentity(files) };
  return { record, files, target: { environment: process.platform === 'win32' ? 'windows' : 'wsl', home }, portabilityReviewed: true };
}

test('export creates a complete personal copy by publishing its root instructions last', t => {
  const input = fixture(t);
  const destination = join(realpathSync.native(input.target.home), '.copilot/skills/example-v1-0-0');
  const stages = [];
  const result = createCopy({ ...input, onProgress(stage) {
    stages.push(stage);
    if (stage === 'reserved' || stage === 'resources-written') assert.equal(existsSync(join(destination, 'SKILL.md')), false);
  } });
  assert.equal(result.publication, 'complete');
  assert.equal(result.destination, destination);
  assert.deepEqual(stages, ['locked', 'staged', 'reserved', 'resources-written', 'published']);
  assert.deepEqual(readFileSync(join(destination, 'assets/sample.bin')), Buffer.from([0, 255, 13, 10]));
  assert.equal(readFileSync(join(destination, '.link-probe'), 'utf8'), 'Ordinary tracked resource.');
  const report = inspectCopy({ target: input.target, personalName: 'example-v1-0-0' });
  assert.equal(report.publication, 'complete');
  assert.equal(report.integrity, 'matches-receipt');
  assert.equal(report.provenance, 'unverified-receipt');
});

test('renamed or malformed prior receipts block another export and redirected discovery roots are rejected', t => {
  const input = fixture(t);
  const created = createCopy(input);
  assert.throws(() => createCopy(input), /existing destination/);
  const renamed = join(input.target.home, '.copilot/skills/personal-notes');
  renameSync(created.destination, renamed);
  assert.throws(() => createCopy(input), /recognizable previous personal copy/);
  writeFileSync(join(renamed, '.gt-export.json'), '{broken');
  assert.throws(() => createCopy(input), /malformed export receipt/);
  const redirected = fixture(t);
  const elsewhere = join(redirected.target.home, 'elsewhere');
  mkdirSync(elsewhere);
  symlinkSync(elsewhere, join(redirected.target.home, '.copilot'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => createCopy(redirected), /linked or redirected path/);
  assert.deepEqual(readdirSync(elsewhere), []);
});

test('real process interruption preserves locks and exposes partial or completed publication', async t => {
  for (const phase of ['locked', 'resources-written', 'published']) {
    const input = fixture(t);
    const inputFile = join(input.target.home, 'worker-input.json');
    writeFileSync(inputFile, JSON.stringify({ ...input, files: [...input.files].map(([name, file]) => [name, { mode: file.mode, data: file.data.toString('base64') }]) }));
    const child = fork(new URL('./fixtures/export-worker.mjs', import.meta.url), [inputFile, phase, join(input.target.home, 'resume')],
      { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe', 'ipc'] });
    const exited = new Promise(resolve => child.once('exit', resolve));
    t.after(async () => { if (child.exitCode === null && child.signalCode === null) child.kill(); await exited; });
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Worker timeout at ${phase}`)), 30000);
      child.once('message', message => { clearTimeout(timer); message.phase === phase ? resolve() : reject(new Error(JSON.stringify(message))); });
      child.once('error', error => { clearTimeout(timer); reject(error); });
      child.once('exit', () => { clearTimeout(timer); reject(new Error('Worker exited before its checkpoint')); });
    });
    if (phase === 'locked') {
      const files = new Map(input.files);
      files.set('release.yaml', { mode: '100644', data: Buffer.from(metadata('1.1.0', 'Next version.', [entry()])) });
      const record = { ...input.record, version: '1.1.0', notes: 'Next version.', history: [entry()], contentIdentity: skillContentIdentity(files) };
      assert.throws(() => createCopy({ ...input, files, record }), /Export busy/);
    }
    child.kill();
    await exited;
    const report = inspectCopy({ target: input.target, personalName: 'example-v1-0-0' });
    assert.equal(report.publication, phase === 'locked' ? 'not-created' : phase === 'published' ? 'complete' : 'incomplete');
    assert.match(report.lock.state, /liveness unknown/);
    assert.throws(() => createCopy(input), phase === 'locked' ? /Export busy/ : /existing destination/);
  }
});

test('interruptions preserve the publication boundary and occupied folders are never reused', t => {
  for (const phase of ['staged', 'resources-written', 'published']) {
    const input = fixture(t);
    const destination = join(input.target.home, '.copilot/skills/example-v1-0-0');
    let outcome;
    assert.throws(() => createCopy({ ...input, onProgress(at) {
      if (at === phase) throw new Error('cancelled by caller');
    } }), error => { outcome = error.exportOutcome; return /cancelled/.test(error.message); });
    assert.equal(outcome.publication, phase === 'staged' ? 'not-created' : phase === 'published' ? 'complete' : 'incomplete');
    assert.equal(existsSync(destination), phase !== 'staged');
    assert.equal(existsSync(join(destination, 'SKILL.md')), phase === 'published');
    assert.equal(existsSync(outcome.lock), false);
    if (phase !== 'staged') assert.throws(() => createCopy(input), /existing destination/);
    assert.equal(inspectCopy({ target: input.target, personalName: 'example-v1-0-0' }).publication, outcome.publication);
  }
});

test('a competing root instruction is preserved by atomic no-replace publication', t => {
  const input = fixture(t);
  const destination = join(input.target.home, '.copilot/skills/example-v1-0-0');
  assert.throws(() => createCopy({ ...input, onProgress(at) {
    if (at === 'resources-written') writeFileSync(join(destination, 'SKILL.md'), 'Competing instructions.', { flag: 'wx' });
  } }), error => error.code === 'EEXIST' && error.exportOutcome.publication === 'incomplete');
  assert.equal(readFileSync(join(destination, 'SKILL.md'), 'utf8'), 'Competing instructions.');
});

test('inspection never calls unrelated instructions a completed export or modifies files', t => {
  const input = fixture(t);
  const destination = join(input.target.home, '.copilot/skills/example-v1-0-0');
  mkdirSync(destination, { recursive: true });
  writeFileSync(join(destination, 'SKILL.md'), 'User instructions.');
  const before = readdirSync(destination);
  assert.equal(inspectCopy({ target: input.target, personalName: 'example-v1-0-0' }).publication, 'unverified');
  writeFileSync(join(destination, '.gt-export.json'), 'null');
  assert.equal(inspectCopy({ target: input.target, personalName: 'example-v1-0-0' }).integrity, 'unverifiable');
  assert.equal(readFileSync(join(destination, 'SKILL.md'), 'utf8'), 'User instructions.');
  assert.deepEqual(before, ['SKILL.md']);
  assert.equal(existsSync(join(input.target.home, '.copilot/gt-export-work')), false);
  assert.throws(() => createCopy(input), /existing destination/);
});
