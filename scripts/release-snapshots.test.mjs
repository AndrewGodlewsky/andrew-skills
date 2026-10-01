import { resolvePluginLayout } from './plugin-layout.mjs';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { readGitFiles, readWorkingFiles, requireAncestor, resolveCommit } from './release-snapshots.mjs';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('working snapshots preserve binary resources and do not execute them', t => {
  const parent = resolve(tmpdir());
  const root = mkdtempSync(join(parent, 'gt-snapshot-test-'));
  t.after(() => {
    assert.equal(dirname(root), parent);
    assert.ok(root.startsWith(join(parent, 'gt-snapshot-test-')));
    rmSync(root, { recursive: true, force: true });
  });
  mkdirSync(join(root, '.claude-plugin'));
  mkdirSync(join(root, 'skills/example'), { recursive: true });
  writeFileSync(join(root, 'plugin.json'), '{}');
  writeFileSync(join(root, '.claude-plugin/marketplace.json'), '{}');
  writeFileSync(join(root, 'skills/example/SKILL.md'), 'Fixture');
  writeFileSync(join(root, 'skills/example/resource.bin'), Buffer.from([0, 255, 13, 10, 42]));
  writeFileSync(join(root, 'skills/example/script.mjs'), 'throw new Error("Must never run");');
  const files = readWorkingFiles(root);
  assert.deepEqual(files.get('skills/example/resource.bin').data, Buffer.from([0, 255, 13, 10, 42]));
  mkdirSync(join(root, 'skills/empty'));
  assert.throws(() => readWorkingFiles(root), /empty\/SKILL.md is required/);
});

test('nested working snapshots discover untracked packages, preserve relocation modes and reject duplicate or linked roots', t => {
  const parent = resolve(tmpdir());
  const root = mkdtempSync(join(parent, 'gt-nested-snapshot-'));
  t.after(() => {
    assert.equal(dirname(root), parent);
    assert.ok(root.startsWith(join(parent, 'gt-nested-snapshot-')));
    rmSync(root, { recursive: true, force: true });
  });
  mkdirSync(join(root, '.claude-plugin'));
  mkdirSync(join(root, 'plugins/gt/skills/new'), { recursive: true });
  writeFileSync(join(root, 'plugins/gt/plugin.json'), '{}');
  writeFileSync(join(root, '.claude-plugin/marketplace.json'), JSON.stringify({ plugins: [{ source: './plugins/gt' }] }));
  writeFileSync(join(root, 'plugins/gt/skills/new/SKILL.md'), 'Explain.');
  writeFileSync(join(root, 'plugins/gt/skills/new/tool.mjs'), 'Never execute.');
  const files = readWorkingFiles(root, new Map([['skills/new/tool.mjs', '100755']]));
  assert.ok(files.has('plugins/gt/skills/new/SKILL.md'));
  if (process.platform === 'win32') assert.equal(files.get('plugins/gt/skills/new/tool.mjs').mode, '100755');
  assert.equal(resolvePluginLayout(files).skills, 'plugins/gt/skills');
  mkdirSync(join(root, 'skills'));
  assert.throws(() => readWorkingFiles(root), /Ambiguous/);
  rmSync(join(root, 'skills'), { recursive: true });
  symlinkSync(join(root, '.claude-plugin'), join(root, 'plugins/gt/skills/linked'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => readWorkingFiles(root), /not links/);
});

test('Git snapshots read stored blobs and modes without checking out a historical tree', () => {
  const commit = resolveCommit(repository, 'HEAD');
  const beforeHead = commit;
  const files = readGitFiles(repository, commit);
  const layout = resolvePluginLayout(files);
  const manifest = files.get(layout.manifest);
  assert.equal(manifest.mode, '100644');
  assert.equal(JSON.parse(manifest.data.toString('utf8')).name, 'gt');
  const stored = execFileSync('git', ['--no-optional-locks', '-C', repository, 'show', `${commit}:${layout.manifest}`]);
  assert.deepEqual(manifest.data, stored);
  assert.equal(resolveCommit(repository, 'HEAD'), beforeHead);
  assert.throws(() => readGitFiles(repository, 'refs/heads/fixture-that-does-not-exist'));
});

test('candidate ancestry is required without creating or moving any refs', () => {
  const head = resolveCommit(repository, 'HEAD');
  const previous = resolveCommit(repository, 'HEAD^1');
  assert.doesNotThrow(() => requireAncestor(repository, previous, head));
  assert.throws(() => requireAncestor(repository, head, previous), /does not contain/);
});

test('CLI rejects a stale current-main SHA before claiming successful validation', () => {
  const result = spawnSync(process.execPath, ['scripts/validate.mjs', '--base', 'HEAD', '--current-main', 'f'.repeat(40)],
    { cwd: repository, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Stale comparison base/);
  assert.doesNotMatch(result.stdout, /comparison passed/);
});

test('CLI rejects unsupported arguments instead of silently skipping release checks', () => {
  const result = spawnSync(process.execPath, ['scripts/validate.mjs', '--bas', 'HEAD'], { cwd: repository, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown option/);
});
