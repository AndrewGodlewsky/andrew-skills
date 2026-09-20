import assert from 'node:assert/strict';
import test from 'node:test';
import { buildReleaseCatalog, validateCatalogCandidate, skillContentIdentity } from './release-catalog.mjs';

const repository = 'https://github.com/AndrewGodlewsky/andrew-skills';
const sha = number => number.toString(16).padStart(40, '0');
function files(pluginVersion, skills = {}) {
  const contents = {
    'plugin.json': JSON.stringify({ name: 'gt', version: pluginVersion }),
    '.claude-plugin/marketplace.json': JSON.stringify({ name: 'andrew-skills',
      plugins: [{ name: 'gt', source: './', version: pluginVersion }] }),
  };
  for (const [name, version] of Object.entries(skills)) {
    contents[`skills/${name}/SKILL.md`] = `Explain ${name}.`;
    if (version) contents[`skills/${name}/release.yaml`] = `version: "${version}"\nnotes: "Release ${version}."\n`;
  }
  return new Map(Object.entries(contents).map(([path, data]) => [path, { mode: '100644', data: Buffer.from(data) }]));
}
function history(...bundles) {
  return bundles.map((files, index) => ({ commit: sha(index + 1), firstParent: index ? sha(index) : null, files }));
}
function build(snapshots, options = {}) {
  return buildReleaseCatalog({ repository, headCommit: snapshots.at(-1).commit, snapshots, ...options });
}

test('baseline ignores old history and unchanged skills retain their first published exact records', () => {
  const snapshots = history(files('0.1.0', { explain: null }), files('0.1.1', { explain: '1.0.0', other: '1.0.0' }),
    files('0.1.1', { explain: '1.0.0', other: '1.0.0' }));
  const catalog = build(snapshots);
  assert.equal(catalog.formatVersion, 1);
  assert.equal(catalog.baselineCommit, sha(2));
  assert.equal(catalog.records.length, 2);
  assert.equal(catalog.records[0].sourceCommit, sha(2));
  assert.equal(catalog.records[0].repository, repository);
  assert.equal(catalog.records[0].skillPath, 'skills/explain');
  assert.match(catalog.records[0].contentIdentity, /^sha256:[a-f0-9]{64}$/);
  assert.deepEqual(catalog.active, catalog.records);
  assert.deepEqual(build(snapshots), catalog);
});

test('retirement, rename, empty intervals and returning labels preserve publication order', () => {
  const snapshots = history(files('0.1.1', { explain: '1.0.0' }), files('0.1.2', { explain: '1.0.1' }),
    files('0.1.3', { renamed: '1.0.0' }), files('0.1.4'), files('0.1.4'), files('0.1.5', { explain: '1.0.0' }));
  const catalog = build(snapshots);
  assert.deepEqual(catalog.records.map(({ skill, version, sourceCommit }) => [skill, version, sourceCommit]), [
    ['explain', '1.0.0', sha(1)], ['explain', '1.0.1', sha(2)], ['renamed', '1.0.0', sha(3)], ['explain', '1.0.0', sha(6)],
  ]);
  assert.equal(catalog.active[0].sourceCommit, sha(6));
  assert.equal(catalog.baselineCommit, sha(1));
  assert.equal(catalog.records[0].contentIdentity, catalog.records[3].contentIdentity);
});

test('post-baseline lost metadata and invalid version mappings fail instead of resetting history', () => {
  for (const invalid of [files('0.1.2', { explain: null }), files('0.1.2', { explain: '1.0.3' })]) {
    assert.throws(() => build(history(files('0.1.1', { explain: '1.0.0' }), invalid)), /release.yaml|required|patch/);
  }
  const changed = files('0.1.2', { explain: '1.0.0' });
  changed.get('skills/explain/SKILL.md').data = Buffer.from('Changed bytes.');
  assert.throws(() => build(history(files('0.1.1', { explain: '1.0.0' }), changed)), /one patch/);
});

test('a supplied prior catalog detects rewritten history and conflicting exact records', () => {
  const snapshots = history(files('0.1.1', { explain: '1.0.0' }), files('0.1.2', { explain: '1.0.1' }));
  const prior = build(snapshots.slice(0, 1));
  assert.deepEqual(build(snapshots, { previousCatalog: prior }), build(snapshots));
  const tampered = structuredClone(prior);
  tampered.records[0].notes = 'Overwritten history.';
  assert.throws(() => build(snapshots, { previousCatalog: tampered }), /conflict|rewritten/);
  assert.throws(() => build(snapshots, { previousCatalog: { ...prior, headCommit: sha(9) } }), /rewritten|missing/);
  assert.throws(() => build(snapshots, { previousCatalog: { ...prior, repository: 'https://example.com/other' } }), /repository/);
});

test('complete first-parent lineage is required even before a baseline exists', () => {
  const snapshots = history(files('0.1.0', { explain: null }), files('0.1.0', { explain: null }));
  assert.equal(build(snapshots).baselineCommit, null);
  assert.throws(() => build(snapshots.slice(1)), /incomplete/);
  assert.throws(() => buildReleaseCatalog({ repository, headCommit: sha(3), snapshots }), /pinned head/);
  assert.throws(() => build([snapshots[0], { ...snapshots[1], commit: sha(1) }]), /duplicate/);
});

test('candidate validation binds the full published catalog to current main', () => {
  const snapshots = history(files('0.1.1', { explain: '1.0.0' }));
  const catalog = build(snapshots);
  const candidate = files('0.1.2', { explain: '1.0.1' });
  assert.deepEqual(validateCatalogCandidate(catalog, snapshots[0].files, candidate,
    { baseCommit: sha(1), currentMainCommit: sha(1) }).changedSkills, ['explain']);
  assert.throws(() => validateCatalogCandidate(catalog, snapshots[0].files, candidate,
    { baseCommit: sha(1), currentMainCommit: sha(2) }), /Stale/);
  assert.throws(() => validateCatalogCandidate(catalog, files('0.1.1', { explain: null }), candidate,
    { baseCommit: sha(1), currentMainCommit: sha(1) }), /release.yaml/);
});

test('folder identity covers exact binary bytes, paths and modes independent of insertion order', () => {
  const folder = new Map([['SKILL.md', { mode: '100644', data: Buffer.from('Instructions.\r\n') }],
    ['example.bin', { mode: '100644', data: Buffer.from([0, 255, 1]) }]]);
  const identity = skillContentIdentity(folder);
  assert.equal(skillContentIdentity(new Map([...folder].reverse())), identity);
  const bytes = new Map(folder);
  bytes.set('SKILL.md', { mode: '100644', data: Buffer.from('Instructions.\n') });
  assert.notEqual(skillContentIdentity(bytes), identity);
  const modes = new Map(folder);
  modes.set('SKILL.md', { ...folder.get('SKILL.md'), mode: '100755' });
  assert.notEqual(skillContentIdentity(modes), identity);
  const renamed = new Map(folder);
  renamed.delete('example.bin');
  renamed.set('other.bin', folder.get('example.bin'));
  assert.notEqual(skillContentIdentity(renamed), identity);
  assert.throws(() => skillContentIdentity(new Map([['../escape', folder.get('SKILL.md')]])), /unsupported/);
});

test('generation errors do not expose a partial catalog and a pinned head ignores later snapshots', () => {
  const snapshots = history(files('0.1.1', { explain: '1.0.0' }), files('0.1.2', { explain: '1.0.1' }));
  let result;
  function* unavailable() { yield snapshots[0]; throw new Error('Required Git object is unavailable'); }
  assert.throws(() => { result = buildReleaseCatalog({ repository, headCommit: sha(2), snapshots: unavailable() }); }, /unavailable/);
  assert.equal(result, undefined);
  const pinned = snapshots.slice(0, 1);
  const catalog = build(pinned);
  assert.throws(() => buildReleaseCatalog({ repository, headCommit: sha(1), snapshots }), /pinned head/);
  snapshots.push(...history(files('0.1.3', { explain: '1.0.2' })));
  assert.deepEqual(build(pinned), catalog);
});

test('unsupported and empty Git skill trees cannot become valid post-baseline records', () => {
  const baseline = files('0.1.1', { explain: '1.0.0' });
  const unsupported = files('0.1.2', { explain: '1.0.1' });
  unsupported.set('skills/explain/link', { mode: '120000', data: Buffer.from('../outside') });
  assert.throws(() => build(history(baseline, unsupported)), /unsupported/);
  const snapshots = history(baseline, files('0.1.2'));
  snapshots[1].skillTrees = new Map([['empty', sha(99)]]);
  assert.throws(() => build(snapshots), /empty.*SKILL.md/);
});

test('inert legacy links and submodule placeholders stay unnumbered and fail after the baseline', () => {
  for (const mode of ['120000', '160000']) {
    const legacy = files('0.1.0', { explain: null });
    legacy.set('skills/explain/legacy-resource', { mode, data: Buffer.from(mode === '120000' ? '../outside' : '') });
    const snapshots = history(legacy, files('0.1.1', { explain: '1.0.0' }));
    assert.equal(build(snapshots).baselineCommit, sha(2));
    const invalid = files('0.1.2', { explain: '1.0.1' });
    invalid.set('skills/explain/legacy-resource', legacy.get('skills/explain/legacy-resource'));
    assert.throws(() => build([...snapshots, { commit: sha(3), firstParent: sha(2), files: invalid }]), /unsupported/);
  }
});

test('the first complete all-1.0.0 snapshot is the baseline and later invalid metadata cannot erase it', () => {
  const partial = files('0.1.0', { explain: '1.0.0', other: null });
  const invalid = files('0.1.0', { explain: '1.0.0' });
  invalid.get('skills/explain/release.yaml').data = Buffer.from('notes: false');
  const snapshots = history(partial, invalid, files('0.1.0', { explain: '2.0.0' }), files('0.1.1', { explain: '1.0.0' }));
  assert.equal(build(snapshots).baselineCommit, sha(4));
  const lost = { commit: sha(5), firstParent: sha(4), files: invalid };
  assert.throws(() => build([...snapshots, lost]), /quoted|version|notes/);
});
