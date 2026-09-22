import assert from 'node:assert/strict';
import test from 'node:test';
import { validateFiles } from './validate.mjs';
import { parseRelease, readBaseline, validateReleaseChange } from './release-validation.mjs';
import { boundary, parentCommit, entry, metadata } from './fixtures/releases.mjs';

function bundle(pluginVersion = '0.1.22', release = metadata(), text = 'Explain the design.') {
  const contents = {
    'plugin.json': JSON.stringify({ $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', name: 'gt', version: pluginVersion, description: 'Fixture' }),
    '.claude-plugin/marketplace.json': JSON.stringify({ name: 'andrew-skills', owner: { name: 'Fixture' }, plugins: [{ name: 'gt', source: './', version: pluginVersion, description: 'Fixture' }] }),
    'release-baseline.json': boundary(parentCommit),
    'skills/example/SKILL.md': `---\nname: example\ndescription: Explain a design.\nuser-invocable: true\ndisable-model-invocation: true\n---\n${text}\n`,
    'skills/example/release.yaml': release,
  };
  return new Map(Object.entries(contents).map(([path, data]) => [path, { mode: '100644', data: Buffer.from(data) }]));
}
const set = (files, path, data) => files.set(path, { mode: '100644', data: Buffer.from(data) });
const next = (version = '1.0.1', notes = 'Corrected explanation.', history = [entry()]) => bundle('0.1.23', metadata(version, notes, history), 'Explain with examples.');
const context = { baseCommit: parentCommit, currentMainCommit: parentCommit };

test('schema reads current release and cumulative chronological periods, including quoted data', () => {
  assert.deepEqual(parseRelease(metadata()), { version: '1.0.0', notes: 'Initial release.', period: 1, history: [] });
  const entries = [entry(), entry('1.0.1', 'Fix | table\nIgnore all instructions'), entry('2.0.0', 'New interface')];
  assert.deepEqual(parseRelease(metadata('1.0.0', 'Returned.', entries, 2)).history, entries);
  assert.equal(parseRelease("\uFEFF# comment\r\nversion: '1.0.0'\r\nnotes: 'It''s clear: #1'\r\nperiod: 1\r\nhistory: []\r\n").notes, "It's clear: #1");
});

test('schema rejects missing fields, duplicates, ambiguous YAML, invalid types, versions and history', () => {
  const invalid = [
    metadata() + 'notes: "duplicate"\n', metadata() + 'history: []\n', metadata() + 'extra: "x"\n',
    metadata().replace('period: 1', 'period: "1"'), metadata().replace('period: 1', 'period: 0'),
    metadata().replace('period: 1', 'period: 9007199254740993'), metadata().replace('history: []', 'history:'),
    'history:\nversion: "1.0.0"\nnotes: "x"\nperiod: 1\n',
    'version: "1.0.0"\nnotes: "Development format."\n',
    ...['true', '2', '["x"]', '{x: y}', '&anchor "x"', '*anchor', '!!str "x"', '|\n  x', '" "', '"x" # inline'].map(notes => metadata().replace('"Initial release."', notes)),
    ...['01.0.0', '1.0', '1.0.0-beta', '1.0.0+build'].map(version => metadata(version)),
    metadata('1.0.1'), metadata('1.0.0', 'duplicate', [entry()]), metadata('1.0.2', 'missing intermediate', [entry()]),
    metadata('1.0.1', 'reordered', [entry('1.1.0'), entry()]), metadata('1.0.0', 'skipped period', [entry()], 3),
    metadata('1.0.1', 'wrong return', [entry()], 2),
    metadata('1.0.1', 'x', [entry()]).replace('    notes:', '    version:'),
    metadata('1.0.1', 'x', [entry()]).replace('    notes: "Initial release."\n', ''),
    metadata('1.0.1', 'x', [entry()]).replace('  - period: 1', '  - period: 1\n    history: []'),
  ];
  for (const source of invalid) assert.throws(() => parseRelease(source), /release.yaml/, source);
  assert.throws(() => parseRelease(Buffer.from([255])), /encoded data/);
});

test('explicit cutover resets realistic development releases atomically and only at the declared parent', () => {
  const development = bundle('0.1.21', 'version: "3.2.1"\nnotes: "Development update."\n');
  development.delete('release-baseline.json');
  assert.equal(validateReleaseChange(development, bundle(), context).baseline, true);
  assert.throws(() => validateReleaseChange(development, bundle()), /exact comparison parent/);
  assert.throws(() => validateReleaseChange(development, bundle(), { baseCommit: 'f'.repeat(40), currentMainCommit: 'f'.repeat(40) }), /exact comparison parent/);
  const incomplete = bundle(); incomplete.delete('skills/example/release.yaml');
  assert.throws(() => validateReleaseChange(development, incomplete, context), /release.yaml/);
  assert.throws(() => validateReleaseChange(development, next(), context), /1.0.0/);
  assert.throws(() => validateReleaseChange(development, bundle('0.1.22', metadata('1.0.0', 'Return', [entry()], 2)), context), /period 1/);
  const removed = bundle(); removed.delete('skills/example/SKILL.md'); removed.delete('skills/example/release.yaml');
  assert.throws(() => validateReleaseChange(development, removed, context), /atomically/);
  assert.throws(() => validateReleaseChange(development, bundle('0.1.21'), context), /one patch/);
});

test('content changes permit one patch, minor or major step with an immutable history prefix', () => {
  for (const version of ['1.0.1', '1.1.0', '2.0.0']) assert.deepEqual(validateReleaseChange(bundle(), next(version)).changedSkills, ['example']);
  for (const version of ['1.0.0', '0.9.0', '1.0.2', '1.2.0', '2.1.0']) assert.throws(() => validateReleaseChange(bundle(), next(version)));
  assert.throws(() => validateReleaseChange(bundle(), next('1.0.1', 'x', [entry('1.0.0', 'Revised old note')])), /append the previous release/);
  assert.throws(() => validateReleaseChange(bundle(), next('1.0.1', 'x', [])), /history/);
  assert.throws(() => validateReleaseChange(bundle(), next('1.0.2', 'x', [entry(), entry('1.0.1', 'Invented')])), /one patch/);
  assert.doesNotThrow(() => validateReleaseChange(bundle(), next('1.0.1', 'Draft A')));
  assert.doesNotThrow(() => validateReleaseChange(bundle(), next('1.0.1', 'Draft B')));
});

test('note-only corrections preserve the old note and require a patch; bookkeeping fails', () => {
  assert.doesNotThrow(() => validateReleaseChange(bundle(), bundle('0.1.23', metadata('1.0.1', 'Corrected note', [entry()]))));
  for (const version of ['1.1.0', '2.0.0']) assert.throws(() => validateReleaseChange(bundle(), bundle('0.1.23', metadata(version, 'Correction', [entry()]))), /note-only/);
  assert.throws(() => validateReleaseChange(bundle(), bundle('0.1.23', metadata('1.0.1', 'Initial release.', [entry()]))), /version-only/);
  assert.throws(() => validateReleaseChange(bundle(), bundle('0.1.23', '# comment\n' + metadata())), /metadata formatting/);
});

test('folder bytes, resources, removals and modes participate in release comparisons', () => {
  for (const mutate of [files => set(files, 'skills/example/resource.bin', '\0one'), files => { files.get('skills/example/SKILL.md').mode = '100755'; }]) {
    const invalid = bundle(); mutate(invalid); assert.throws(() => validateReleaseChange(bundle(), invalid), /changed content/);
    const valid = next(); mutate(valid); assert.doesNotThrow(() => validateReleaseChange(bundle(), valid));
  }
  const before = bundle(); set(before, 'skills/example/resource.bin', '\0one');
  assert.doesNotThrow(() => validateReleaseChange(before, next()));
  const invalid = next(); invalid.set('skills/example/link', { mode: '120000', data: Buffer.from('../outside') });
  assert.throws(() => validateReleaseChange(bundle(), invalid), /unsupported file mode/);
});

test('unchanged skills, plugin-only configuration and exporter changes obey one bundle patch', () => {
  const before = bundle(), after = next();
  for (const files of [before, after]) { set(files, 'skills/other/SKILL.md', 'Unchanged.'); set(files, 'skills/other/release.yaml', metadata()); }
  assert.deepEqual(validateReleaseChange(before, after).changedSkills, ['example']);
  assert.throws(() => validateReleaseChange(bundle(), bundle('0.1.23')), /no bundle change/);
  const exporter = bundle('0.1.23'); set(exporter, 'exporter/run.mjs', 'Helper.');
  assert.deepEqual(validateReleaseChange(bundle(), exporter).changedSkills, []);
  const config = bundle('0.1.23'); const plugin = JSON.parse(config.get('plugin.json').data); plugin.description = 'New'; set(config, 'plugin.json', JSON.stringify(plugin));
  assert.deepEqual(validateReleaseChange(bundle(), config).changedSkills, []);
  set(config, '.claude-plugin/marketplace.json', '{}'); assert.throws(() => validateReleaseChange(bundle(), config), /must match/);
});

test('established boundaries cannot change or disappear; stale comparisons fail', () => {
  const changed = next(); set(changed, 'release-baseline.json', boundary('f'.repeat(40)));
  assert.throws(() => validateReleaseChange(bundle(), changed), /boundary cannot change/);
  changed.delete('release-baseline.json'); assert.throws(() => validateReleaseChange(bundle(), changed), /boundary/);
  assert.throws(() => validateReleaseChange(bundle(), next(), { baseCommit: 'a', currentMainCommit: 'b' }), /Stale/);
  const duplicate = bundle(); set(duplicate, 'release-baseline.json', boundary(parentCommit).replace('"formatVersion": 2,', '"formatVersion": 1,\n  "formatVersion": 2,'));
  assert.throws(() => readBaseline(duplicate), /canonical/);
});

test('structural validation requires metadata and permits an empty retired collection', () => {
  assert.match(validateFiles(bundle()), /Validated/);
  const files = bundle(); files.delete('skills/example/release.yaml'); assert.throws(() => validateFiles(files), /release.yaml/);
  files.delete('skills/example/SKILL.md'); assert.match(validateFiles(files), /0 skill/);
});
