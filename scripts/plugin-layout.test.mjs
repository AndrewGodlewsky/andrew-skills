import assert from 'node:assert/strict';
import test from 'node:test';
import { resolvePluginLayout } from './plugin-layout.mjs';
import { validateFiles } from './validate.mjs';
import { validateReleaseChange } from './release-validation.mjs';
import { buildReleaseCatalog, validateCatalogCandidate } from './release-catalog.mjs';
import { boundary, entry, metadata } from './fixtures/releases.mjs';

const sha = n => String(n).padStart(40, '0');
const repository = 'https://github.com/AndrewGodlewsky/andrew-skills';
function snapshot(n, { nested = false, changed = false, empty = false, returned = false } = {}) {
  const prefix = nested ? 'plugins/gt/' : '';
  const version = `0.1.${n}`;
  const contents = {
    [`${prefix}plugin.json`]: JSON.stringify({ $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', name: 'gt', version, description: 'Fixture' }),
    '.claude-plugin/marketplace.json': JSON.stringify({ name: 'andrew-skills', owner: { name: 'Fixture' }, plugins: [{ name: 'gt', source: nested ? './plugins/gt' : './', version, description: 'Fixture' }] }),
  };
  if (n > 1) contents['release-baseline.json'] = boundary(sha(1));
  if (!empty) {
    contents[`${prefix}skills/example/SKILL.md`] = '---\nname: example\ndescription: Explain input.\nuser-invocable: true\ndisable-model-invocation: true\n---\nRead [resource](example.txt).\n';
    contents[`${prefix}skills/example/example.txt`] = changed ? 'Changed resource.' : 'Original resource.';
    contents[`${prefix}skills/example/release.yaml`] = returned ? metadata('1.0.0', 'Returned.', [entry()], 2) : changed ? metadata('1.0.1', 'Changed.', [entry()]) : metadata();
  }
  return { commit: sha(n), firstParent: n === 1 ? null : sha(n - 1), files: new Map(Object.entries(contents).map(([path, data]) => [path, { mode: '100644', data: Buffer.from(data) }])) };
}
const build = (snapshots, previousCatalog) => buildReleaseCatalog({ repository, snapshots, headCommit: snapshots.at(-1).commit, previousCatalog });

test('relocation preserves exact prior catalog records and later changes use the new path', () => {
  const history = [snapshot(1), snapshot(2)];
  const previous = build(history);
  const moved = snapshot(3, { nested: true });
  assert.match(validateFiles(moved.files), /1 skill/);
  assert.deepEqual(validateReleaseChange(history[1].files, moved.files).changedSkills, []);
  history.push(moved);
  const migrated = build(history, previous);
  assert.deepEqual(migrated.records, previous.records);
  assert.deepEqual(migrated.active, previous.active);
  history.push(snapshot(4, { nested: true, changed: true }));
  const later = build(history, previous);
  assert.equal(later.records[0].skillPath, 'skills/example');
  assert.equal(later.active[0].skillPath, 'plugins/gt/skills/example');
  assert.equal(later.active[0].sourceCommit, sha(4));
  assert.equal(later.active[0].version, '1.0.1');
});

test('a changed release during migration records its nested path', () => {
  const history = [snapshot(1), snapshot(2), snapshot(3, { nested: true, changed: true })];
  assert.equal(build(history).active[0].skillPath, 'plugins/gt/skills/example');
});

test('candidate history uses canonical Git identities for relocated CRLF working files', () => {
  const history = [snapshot(1), snapshot(2)], catalog = build(history);
  const before = history[1].files, after = snapshot(3, { nested: true }).files;
  for (const [path, file] of before) if (path.startsWith('skills/')) {
    const moved = after.get(`plugins/gt/${path}`);
    file.identity = moved.identity = `canonical:${path}`;
    moved.data = Buffer.from(file.data.toString().replaceAll('\n', '\r\n'));
  }
  assert.deepEqual(validateCatalogCandidate(catalog, before, after, { baseCommit: sha(2), currentMainCommit: sha(2) }).changedSkills, []);
  after.get('plugins/gt/skills/example/example.txt').identity = 'different-blob';
  assert.throws(() => validateCatalogCandidate(catalog, before, after, { baseCommit: sha(2), currentMainCommit: sha(2) }), /changed content/);
});

test('empty collections, retirement and return retain the baseline and periods across layouts', () => {
  const history = [snapshot(1), snapshot(2), snapshot(3, { empty: true }), snapshot(4, { nested: true, empty: true }), snapshot(5, { nested: true, returned: true })];
  const catalog = build(history);
  assert.equal(catalog.baselineCommit, sha(2));
  assert.equal(catalog.active[0].period, 2);
  assert.equal(catalog.records.length, 2);
});

test('conflicting roots, missing manifests and unsafe sources fail even without skills', () => {
  for (const inactive of ['plugin.json', 'skills', 'skills/stray/SKILL.md']) {
    const { files } = snapshot(3, { nested: true, empty: true });
    files.set(inactive, { mode: '100644', data: Buffer.from('{}') });
    assert.throws(() => resolvePluginLayout(files), /Ambiguous/);
  }
  for (const source of ['../outside', './skills', './plugins/gt/../other', { path: 'plugins/gt' }]) {
    const { files } = snapshot(3, { nested: true });
    files.set('.claude-plugin/marketplace.json', { mode: '100644', data: Buffer.from(JSON.stringify({ plugins: [{ source }] })) });
    assert.throws(() => resolvePluginLayout(files), /Marketplace source/);
  }
  const { files } = snapshot(3, { nested: true });
  files.delete('plugins/gt/plugin.json');
  assert.throws(() => resolvePluginLayout(files), /Missing/);
});

test('nested packages retain resource and mode validation and require a bundle patch', () => {
  const before = snapshot(2).files;
  const after = snapshot(3, { nested: true }).files;
  const path = 'plugins/gt/skills/example/example.txt';
  after.get(path).mode = '120000';
  assert.throws(() => validateFiles(after), /unsupported file mode/);
  after.delete(path);
  assert.throws(() => validateFiles(after), /resource/);
  const unbumped = snapshot(2, { nested: true }).files;
  assert.throws(() => validateReleaseChange(before, unbumped), /plugin version must be 0.1.3/);
  const unsupported = snapshot(3, { nested: true }).files;
  unsupported.set('plugins/gt/extra-link', { mode: '120000', data: Buffer.from('../outside') });
  assert.throws(() => validateReleaseChange(before, unsupported), /unsupported file mode/);
});
