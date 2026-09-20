import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir, release } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';

const supported = process.platform === 'win32' || /microsoft/i.test(release());
for (const delivery of ['checkout helper', 'standalone restore skill']) test(`${delivery} lists, plans, creates and inspects using one fixed bundle`, { skip: !supported }, t => {
  const parent = resolve(tmpdir());
  const home = mkdtempSync(join(parent, 'gt-cli-test-'));
  t.after(() => { assert.equal(dirname(home), parent); assert.ok(home.startsWith(join(parent, 'gt-cli-test-'))); rmSync(home, { recursive: true, force: true }); });
  const target = ['--environment', process.platform === 'win32' ? 'windows' : 'wsl', '--home', home];
  let entry = resolve('exporter/run.mjs');
  if (delivery === 'standalone restore skill') {
    const standalone = join(home, 'standalone-skill');
    cpSync(resolve('skills/skills-restore'), standalone, { recursive: true });
    entry = join(standalone, 'scripts/exporter/run.mjs');
  }
  function run(command, ...args) {
    // A caller's Git redirection must not change the bytes reviewed for this plan.
    const env = args.includes('--review-source') ? { ...process.env,
      GIT_DIR: join(home, 'unrelated.git'), GIT_OBJECT_DIRECTORY: join(home, 'unrelated-objects') } : process.env;
    return JSON.parse(execFileSync(process.execPath, [entry, command, ...target, ...args], { env, encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }));
  }
  const beforeInspect = readdirSync(home);
  assert.equal(run('inspect', '--name', 'grill-me-v1-0-0').publication, 'not-created');
  assert.deepEqual(readdirSync(home), beforeInspect);
  const listing = run('list', '--checkout', resolve('.'));
  const record = listing.catalog.records.find(r => r.skill === 'grill-me');
  const plan = run('plan', '--cache', listing.cache, '--skill', record.skill, '--commit', record.sourceCommit);
  const review = run('plan', '--cache', listing.cache, '--skill', record.skill, '--commit', record.sourceCommit, '--review-source');
  assert.deepEqual(review.plan, plan);
  assert.equal(review.protocolVersion, 1);
  assert.equal(review.files.length, plan.sourceFiles.length);
  for (const file of review.files) {
    const bytes = Buffer.from(file.content, file.encoding);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), plan.sourceFiles.find(entry => entry.path === file.path).sha256);
  }
  assert.match(review.files.find(file => file.path === 'SKILL.md').content, /name: grill-me\r?\n/);
  const planPath = join(home, 'plan.json');
  writeFileSync(planPath, JSON.stringify(plan));
  assert.throws(() => run('export', '--plan', planPath), /Command failed/);
  const created = run('export', '--plan', planPath, '--portability-reviewed');
  assert.equal(created.publication, 'complete');
  assert.equal(created.activation, 'not-verified');
  assert.equal(run('inspect', '--name', plan.personalName).integrity, 'matches-receipt');
  assert.equal(readFileSync(join(created.destination, 'release.yaml'), 'utf8').includes('1.0.0'), true);
  const frozen = readdirSync(join(home, '.copilot/gt-export-work')).filter(name => name.startsWith('code-'));
  assert.ok(frozen.length >= 3);
  assert.ok(readFileSync(join(home, '.copilot/gt-export-work', frozen[0], 'export-cli.mjs')).length > 0);
  const damaged = join(home, 'damaged-bundle');
  cpSync(dirname(entry), damaged, { recursive: true });
  writeFileSync(join(damaged, 'export-source.mjs'), 'throw new Error("Must not execute an unverified module");');
  assert.throws(() => execFileSync(process.execPath, [join(damaged, 'run.mjs'), 'inspect', ...target, '--name', plan.personalName],
    { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }), error => /Incomplete or changing exporter bundle/.test(error.stderr));
});
