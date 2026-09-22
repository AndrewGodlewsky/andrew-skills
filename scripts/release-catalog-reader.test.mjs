import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync, mkdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { readReleaseCatalog, repositoryIdentity } from './release-catalog-reader.mjs';
import { readGitFiles } from './release-snapshots.mjs';
import { validateCatalogCandidate, skillContentIdentity } from './release-catalog.mjs';
import { releaseRepository, boundary } from './fixtures/releases.mjs';

test('trusted origins have one credential-free identity', () => {
  for (const origin of ['https://github.com/AndrewGodlewsky/andrew-skills.git', 'git@github.com:AndrewGodlewsky/andrew-skills.git', 'ssh://git@github.com/AndrewGodlewsky/andrew-skills.git']) assert.equal(repositoryIdentity(origin), 'https://github.com/AndrewGodlewsky/andrew-skills');
  assert.throws(() => repositoryIdentity('https://token@github.com/AndrewGodlewsky/andrew-skills'), /credential-free/);
});

for (const publication of ['merge', 'squash']) test(`${publication}: prospective migration, accepted publication and later release retain exact source identities`, t => {
  const repo = releaseRepository(t, { publication });
  mkdirSync(join(repo.root, 'scripts'));
  for (const module of ['validate', 'release-validation', 'release-catalog', 'release-catalog-reader', 'release-snapshots', 'skill-package-validation']) {
    copyFileSync(new URL(`./${module}.mjs`, import.meta.url), join(repo.root, 'scripts', `${module}.mjs`));
  }
  // Exercise the actual CLI argument paths used by PR, main-push and manual CI.
  for (const args of [
    ['--base', repo.development, '--candidate', repo.candidate, '--current-main', repo.development],
    ['--base', repo.development, '--candidate', repo.baseline],
    ['--base', repo.baseline, '--candidate', repo.next, '--current-main', repo.baseline],
  ]) {
    const output = execFileSync(process.execPath, [join(repo.root, 'scripts/validate.mjs'), ...args],
      { cwd: repo.root, encoding: 'utf8', windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    assert.match(output, /Release comparison passed/);
  }
  const prior = readReleaseCatalog(repo.root, { ref: repo.development, migrationParent: repo.development });
  // Same comparison path used for a PR candidate, main push and manual comparison.
  for (const candidate of [repo.candidate, repo.baseline]) {
    const result = validateCatalogCandidate(prior, readGitFiles(repo.root, repo.development), readGitFiles(repo.root, candidate), { baseCommit: repo.development, currentMainCommit: repo.development });
    assert.equal(result.baseline, true);
  }
  const catalog = readReleaseCatalog(repo.root);
  assert.equal(catalog.baselineCommit, repo.baseline);
  assert.deepEqual(catalog.records.map(record => [record.version, record.sourceCommit]), [['1.0.0', repo.baseline], ['1.1.0', repo.next]]);
  assert.equal(catalog.active[0].sourceCommit, repo.next);
  assert.ok(!catalog.records.some(record => [repo.oldBaseline, repo.development, repo.draft, repo.candidate].includes(record.sourceCommit)));
  for (const record of catalog.records) {
    assert.equal(record.sourceTree, repo.git('rev-parse', `${record.sourceCommit}:${record.skillPath}`));
    const prefix = record.skillPath + '/';
    const folder = new Map([...readGitFiles(repo.root, record.sourceCommit)].filter(([path]) => path.startsWith(prefix)).map(([path, file]) => [path.slice(prefix.length), file]));
    assert.equal(record.contentIdentity, skillContentIdentity(folder));
  }
  assert.deepEqual(readReleaseCatalog(repo.root, { previousCatalog: catalog }), catalog);
  const baseline = readReleaseCatalog(repo.root, { ref: repo.baseline });
  assert.doesNotThrow(() => validateCatalogCandidate(baseline, readGitFiles(repo.root, repo.baseline), readGitFiles(repo.root, repo.next), { baseCommit: repo.baseline, currentMainCommit: repo.baseline }));
  assert.throws(() => validateCatalogCandidate(prior, readGitFiles(repo.root, repo.development), readGitFiles(repo.root, repo.baseline), { baseCommit: repo.development, currentMainCommit: repo.baseline }), /Stale/);
  for (const ref of [repo.oldBaseline, repo.development]) assert.throws(() => readReleaseCatalog(repo.root, { ref }), /predates.*boundary/);
  const altered = readGitFiles(repo.root, repo.next);
  altered.get('release-baseline.json').data = Buffer.from(boundary(repo.next));
  assert.throws(() => validateCatalogCandidate(catalog, readGitFiles(repo.root, repo.head), altered, { baseCommit: repo.head, currentMainCommit: repo.head }), /boundary/);
  assert.equal(repo.git('rev-parse', 'HEAD'), repo.head);
});

test('missing objects, shallow history, grafts and unsupported identity fail without a partial catalog', t => {
  const repo = releaseRepository(t);
  assert.throws(() => readReleaseCatalog(repo.root, { ref: 'f'.repeat(40) }));
  assert.throws(() => readReleaseCatalog(repo.root, { repository: 'file:///tmp/other' }), /repository origin/);
  const shallow = join(repo.root, '.git/shallow');
  writeFileSync(shallow, repo.development + '\n');
  assert.throws(() => readReleaseCatalog(repo.root), /complete history|shallow/); unlinkSync(shallow);
  const graft = join(repo.root, '.git/info/grafts');
  writeFileSync(graft, repo.development + '\n');
  assert.throws(() => readReleaseCatalog(repo.root), /grafts/); unlinkSync(graft);
  const blob = repo.git('rev-parse', `${repo.baseline}:skills/grill-me/example.txt`);
  const object = join(repo.root, '.git/objects', blob.slice(0, 2), blob.slice(2));
  const bytes = readFileSync(object); unlinkSync(object);
  assert.throws(() => readReleaseCatalog(repo.root));
  writeFileSync(object, bytes);
  assert.equal(readReleaseCatalog(repo.root).records.length, 2);
});
