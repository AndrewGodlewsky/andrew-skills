import assert from 'node:assert/strict';
import test from 'node:test';
import { buildReleaseCatalog, validateCatalogCandidate, skillContentIdentity } from './release-catalog.mjs';
import { boundary, metadata, entry } from './fixtures/releases.mjs';
const repository = 'https://github.com/AndrewGodlewsky/andrew-skills';
const sha = number => number.toString(16).padStart(40, '0');
function files(pluginVersion, skills = {}, marker = true) {
  const contents = {
    'plugin.json': JSON.stringify({ name: 'gt', version: pluginVersion }),
    '.claude-plugin/marketplace.json': JSON.stringify({ name: 'andrew-skills', plugins: [{ name: 'gt', source: './', version: pluginVersion }] }),
  };
  if (marker) contents['release-baseline.json'] = boundary(sha(1));
  for (const [name, release] of Object.entries(skills)) {
    contents[`skills/${name}/SKILL.md`] = `Explain ${name}.`;
    if (release) contents[`skills/${name}/release.yaml`] = release;
  }
  return new Map(Object.entries(contents).map(([path, data]) => [path, { mode: '100644', data: Buffer.from(data) }]));
}
const first = () => files('0.1.1', { explain: metadata() });
const second = () => files('0.1.2', { explain: metadata('1.0.1', 'Correction.', [entry()]) });
function history(...bundles) {
  const development = files('0.1.0', { explain: 'version: "3.2.1"\nnotes: "Development."\n' }, false);
  return [development, ...bundles].map((files, index) => ({ commit: sha(index + 1), firstParent: index ? sha(index) : null, files }));
}
const build = (snapshots, options = {}) => buildReleaseCatalog({ repository, headCommit: snapshots.at(-1).commit, snapshots, ...options });

test('explicit baseline ignores development history and preserves exact unchanged sources deterministically', () => {
  const snapshots = history(first(), second(), second());
  const catalog = build(snapshots);
  assert.equal(catalog.formatVersion, 2);
  assert.equal(catalog.baselineCommit, sha(2));
  assert.deepEqual(catalog.records.map(r => [r.version, r.sourceCommit]), [['1.0.0', sha(2)], ['1.0.1', sha(3)]]);
  assert.equal(catalog.active[0].sourceCommit, sha(3));
  assert.equal(catalog.records[0].skillPath, 'skills/explain');
  assert.equal(catalog.records[0].repository, repository);
  assert.match(catalog.records[0].contentIdentity, /^sha256:[a-f0-9]{64}$/);
  assert.deepEqual(build(snapshots), catalog);
});

test('retirement, rename, empty intervals and returning labels preserve periods and exact publications', () => {
  const returning = metadata('1.0.0', 'Returned.', [entry(), entry('1.0.1', 'Correction.')], 2);
  const snapshots = history(first(), second(), files('0.1.3', { renamed: metadata() }), files('0.1.4'), files('0.1.4'), files('0.1.5', { explain: returning }));
  const catalog = build(snapshots);
  assert.deepEqual(catalog.records.map(r => [r.skill, r.version, r.period, r.sourceCommit]), [
    ['explain', '1.0.0', 1, sha(2)], ['explain', '1.0.1', 1, sha(3)], ['renamed', '1.0.0', 1, sha(4)], ['explain', '1.0.0', 2, sha(7)],
  ]);
  assert.equal(catalog.active[0].sourceCommit, sha(7));
  assert.equal(catalog.baselineCommit, sha(2));
  assert.notEqual(catalog.records[0].contentIdentity, catalog.records[3].contentIdentity);
  const base = snapshots.slice(0, -1), prior = build(base);
  assert.doesNotThrow(() => validateCatalogCandidate(prior, base.at(-1).files, snapshots.at(-1).files, { baseCommit: sha(6), currentMainCommit: sha(6) }));
  for (const invalid of [metadata(), metadata('1.0.0', 'Returned.', [entry()], 2), metadata('1.0.0', 'Returned.', [entry(), entry('1.0.1', 'Revised')], 2)]) {
    assert.throws(() => build([...base, { ...snapshots.at(-1), files: files('0.1.5', { explain: invalid }) }]), /returning history/);
  }
});

test('post-baseline metadata loss, invented releases, revisions and resets fail without partial results', () => {
  for (const invalid of [files('0.1.2', { explain: null }), files('0.1.2', { explain: metadata('1.0.1', 'x', [entry('1.0.0', 'Rewritten')]) }), files('0.1.2', { explain: metadata('1.0.2', 'x', [entry(), entry('1.0.1')]) })]) {
    assert.throws(() => build(history(first(), invalid)), /release.yaml|append|patch/);
  }
  const reset = files('0.1.3', { explain: metadata('1.0.0', 'Reset') });
  assert.throws(() => build(history(first(), second(), reset)), /note-only|one patch/);
  const changed = first(); changed.get('skills/explain/SKILL.md').data = Buffer.from('Changed bytes.');
  assert.throws(() => build(history(first(), changed)), /one patch/);
  const missing = second(); missing.delete('release-baseline.json'); assert.throws(() => build(history(first(), missing)), /boundary/);
  const altered = second(); altered.get('release-baseline.json').data = Buffer.from(boundary(sha(2))); assert.throws(() => build(history(first(), altered)), /boundary/);
});

test('prior catalogs detect rewritten history, mixed identities and discarded format 1', () => {
  const snapshots = history(first(), second()); const prior = build(snapshots.slice(0, 2));
  assert.deepEqual(build(snapshots, { previousCatalog: prior }), build(snapshots));
  const tampered = structuredClone(prior); tampered.records[0].notes = 'Overwritten.';
  assert.throws(() => build(snapshots, { previousCatalog: tampered }), /conflict/);
  assert.throws(() => build(snapshots, { previousCatalog: { ...prior, headCommit: sha(9) } }), /rewritten|missing/);
  assert.throws(() => build(snapshots, { previousCatalog: { ...prior, repository: 'https://example.com/other' } }), /repository/);
  assert.throws(() => build(snapshots, { previousCatalog: { ...prior, formatVersion: 1 } }), /unsupported prior/);
});

test('pre-boundary requests fail explicitly; only the exact proposed migration parent can be validated', () => {
  const snapshots = history();
  assert.throws(() => build(snapshots), /predates.*boundary/);
  const catalog = build(snapshots, { migrationParent: sha(1) });
  assert.equal(catalog.baselineCommit, null); assert.deepEqual(catalog.records, []);
  assert.throws(() => build(snapshots, { migrationParent: sha(9) }), /predates/);
  assert.doesNotThrow(() => validateCatalogCandidate(catalog, snapshots[0].files, first(), { baseCommit: sha(1), currentMainCommit: sha(1) }));
  const wrong = first(); wrong.get('release-baseline.json').data = Buffer.from(boundary(sha(9)));
  assert.throws(() => build(history(wrong)), /accepted first parent/);
});

test('candidate validation binds all publication history to the comparison base and rejects stale bases', () => {
  const snapshots = history(first()), catalog = build(snapshots);
  assert.doesNotThrow(() => validateCatalogCandidate(JSON.parse(JSON.stringify(catalog)), snapshots[1].files, snapshots[1].files,
    { baseCommit: sha(2), currentMainCommit: sha(2) }));
  assert.deepEqual(validateCatalogCandidate(catalog, snapshots[1].files, second(), { baseCommit: sha(2), currentMainCommit: sha(2) }).changedSkills, ['explain']);
  assert.throws(() => validateCatalogCandidate(catalog, snapshots[1].files, second(), { baseCommit: sha(2), currentMainCommit: sha(3) }), /Stale/);
  const altered = first(); altered.get('skills/explain/SKILL.md').data = Buffer.from('Altered base.');
  assert.throws(() => validateCatalogCandidate(catalog, altered, second(), { baseCommit: sha(2), currentMainCommit: sha(2) }), /base conflicts/);
});

test('complete first-parent lineage is required and generation never returns partial results', () => {
  const snapshots = history(first(), second());
  assert.throws(() => build(snapshots.slice(1)), /incomplete/);
  assert.throws(() => buildReleaseCatalog({ repository, headCommit: sha(9), snapshots }), /pinned head/);
  assert.throws(() => build([snapshots[0], { ...snapshots[1], commit: sha(1) }]), /duplicate/);
  let result; function* missing() { yield snapshots[0]; throw new Error('Required Git object unavailable'); }
  assert.throws(() => { result = buildReleaseCatalog({ repository, headCommit: sha(2), snapshots: missing() }); }, /unavailable/);
  assert.equal(result, undefined);
  assert.throws(() => buildReleaseCatalog({ repository, headCommit: sha(2), snapshots }), /pinned head/);
});

test('folder identity covers binary bytes, paths, modes and ordering; invalid resources fail', () => {
  const folder = new Map([['SKILL.md', { mode: '100644', data: Buffer.from('Instructions.\r\n') }], ['example.bin', { mode: '100644', data: Buffer.from([0, 255, 1]) }]]);
  const identity = skillContentIdentity(folder);
  assert.equal(skillContentIdentity(new Map([...folder].reverse())), identity);
  for (const mutate of [files => files.set('SKILL.md', { mode: '100644', data: Buffer.from('Instructions.\n') }), files => files.set('SKILL.md', { ...files.get('SKILL.md'), mode: '100755' }), files => { files.set('other.bin', files.get('example.bin')); files.delete('example.bin'); }]) {
    const changed = new Map(folder); mutate(changed); assert.notEqual(skillContentIdentity(changed), identity);
  }
  assert.throws(() => skillContentIdentity(new Map([['../escape', folder.get('SKILL.md')]])), /unsupported/);
  for (const mode of ['120000', '160000']) {
    const invalid = second(); invalid.set('skills/explain/link', { mode, data: Buffer.from('../outside') });
    assert.throws(() => build(history(first(), invalid)), /unsupported/);
  }
  const snapshots = history(first(), files('0.1.2')); snapshots[2].skillTrees = new Map([['empty', sha(99)]]);
  assert.throws(() => build(snapshots), /empty.*SKILL.md/);
});
