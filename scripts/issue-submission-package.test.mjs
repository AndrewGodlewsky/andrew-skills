import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { buildBundle, runtimeNames } from './build-issue-submission.mjs';
import { prepareSource } from './export-source.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'gt-submission-package-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

test('bundle is deterministic, checks without writing, and refuses unexpected entries', t => {
  const directory = fixture(t);
  const source = join(directory, 'source');
  const output = join(directory, 'bundle');
  mkdirSync(source);
  for (const name of runtimeNames) writeFileSync(join(source, name), 'example\r\n');
  assert.throws(() => buildBundle({ source, output, check: true }), /Missing/);
  buildBundle({ source, output });
  assert.equal(readFileSync(join(output, 'run.mjs'), 'utf8'), 'example\n');
  buildBundle({ source, output, check: true });
  writeFileSync(join(output, 'run.mjs'), 'stale');
  assert.throws(() => buildBundle({ source, output, check: true }), /Stale/);
  assert.equal(readFileSync(join(output, 'run.mjs'), 'utf8'), 'stale');
  buildBundle({ source, output });
  writeFileSync(join(output, 'unexpected.txt'), 'preserve me');
  assert.throws(() => buildBundle({ source, output, check: true }), /Unexpected/);
  assert.throws(() => buildBundle({ source, output }), /Unexpected/);
  assert.equal(readFileSync(join(output, 'unexpected.txt'), 'utf8'), 'preserve me');
});

test('the shipped helper matches sources and runs from an unrelated renamed package', t => {
  buildBundle({ check: true });
  const directory = fixture(t);
  const copied = join(directory, 'renamed dependency with spaces');
  cpSync(join(root, 'skills/create-issue'), copied, { recursive: true });
  assert.deepEqual(readdirSync(join(copied, 'scripts')).sort(), [...runtimeNames].sort());
  const run = args => spawnSync(process.execPath, [join(copied, 'scripts/run.mjs'), ...args], {
    cwd: directory, encoding: 'utf8', timeout: 5000, input: '{}', env: { ...process.env, GH_HOST: 'example.invalid', GH_REPO: 'other/repo' }
  });
  const help = run(['--help']);
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /stdin/);
  const invalid = run([]);
  assert.equal(invalid.status, 1, invalid.stderr);
  const result = JSON.parse(invalid.stdout);
  assert.equal(result.repository, 'AndrewGodlewsky/andrew-skills');
  assert.equal(result.status, 'not_submitted');
});

test('existing exporter conservatively refuses the fixed API paths without rewriting the destination', () => {
  const files = new Map();
  function collect(directory, prefix = '') {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = prefix + entry.name;
      if (entry.isDirectory()) collect(join(directory, entry.name), `${path}/`);
      else files.set(path, { mode: '100644', data: readFileSync(join(directory, entry.name)) });
    }
  }
  collect(join(root, 'skills/create-issue'));
  const record = { repository: 'https://github.com/AndrewGodlewsky/andrew-skills', skill: 'create-issue',
    skillPath: 'skills/create-issue', sourceCommit: 'a'.repeat(40), sourceTree: 'b'.repeat(40) };
  assert.throws(() => prepareSource(record, files, { portabilityReviewed: true }), /known plugin\/self\/absolute-path dependency prevents portability: scripts\/api.mjs/);
  assert.match(files.get('scripts/contract.mjs').data.toString(), /AndrewGodlewsky\/andrew-skills/);
});
