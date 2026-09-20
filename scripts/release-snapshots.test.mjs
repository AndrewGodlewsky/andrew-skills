import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
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

test('Git snapshots read stored blobs and modes without checking out a historical tree', () => {
  const commit = resolveCommit(repository, 'HEAD');
  const beforeHead = commit;
  const files = readGitFiles(repository, commit);
  const manifest = files.get('plugin.json');
  assert.equal(manifest.mode, '100644');
  assert.equal(JSON.parse(manifest.data.toString('utf8')).name, 'gt');
  const stored = execFileSync('git', ['--no-optional-locks', '-C', repository, 'show', `${commit}:plugin.json`]);
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
