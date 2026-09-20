import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { readReleaseCatalog } from './release-catalog-reader.mjs';
import { readGitFiles, resolveCommit } from './release-snapshots.mjs';
import { skillContentIdentity } from './release-catalog.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('Git reader pins one complete head and verifies exact source folder objects without history writes', () => {
  const head = resolveCommit(root, 'HEAD');
  const catalog = readReleaseCatalog(root, { ref: head });
  assert.equal(catalog.headCommit, head);
  for (const record of catalog.records) {
    assert.match(record.sourceTree, /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/);
    const tree = execFileSync('git', ['--no-optional-locks', '-C', root, 'rev-parse', `${record.sourceCommit}:${record.skillPath}`],
      { env: { ...process.env, GIT_NO_REPLACE_OBJECTS: '1' } }).toString().trim();
    assert.equal(record.sourceTree, tree);
    const prefix = `${record.skillPath}/`;
    const folder = new Map([...readGitFiles(root, record.sourceCommit)].filter(([path]) => path.startsWith(prefix))
      .map(([path, file]) => [path.slice(prefix.length), file]));
    assert.equal(record.contentIdentity, skillContentIdentity(folder));
  }
  assert.deepEqual(readReleaseCatalog(root, { ref: head, previousCatalog: catalog }), catalog);
  assert.equal(resolveCommit(root, 'HEAD'), head);
});

test('missing commit and unsupported repository identity fail instead of yielding a partial catalog', () => {
  assert.throws(() => readReleaseCatalog(root, { ref: 'f'.repeat(40) }));
  assert.throws(() => readReleaseCatalog(root, { ref: 'HEAD', repository: 'file:///tmp/other' }), /repository origin/);
});
