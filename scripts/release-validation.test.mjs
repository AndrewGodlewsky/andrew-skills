import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { validate } from './validate.mjs';
import { parseRelease, validateReleaseChange } from './release-validation.mjs';

function fixture(t, files) {
  const parent = resolve(tmpdir());
  const root = mkdtempSync(join(parent, 'gt-release-test-'));
  t.after(() => {
    assert.equal(dirname(root), parent);
    assert.ok(root.startsWith(join(parent, 'gt-release-test-')));
    rmSync(root, { recursive: true, force: true });
  });
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

const plugin = version => JSON.stringify({
  $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
  name: 'gt', version, description: 'Fixture plugin',
});
const marketplace = version => JSON.stringify({
  name: 'andrew-skills', owner: { name: 'Fixture' },
  plugins: [{ name: 'gt', source: './', version, description: 'Fixture plugin' }],
});
const instructions = name => `---\nname: ${name}\ndescription: Explain a design.\n---\nExplain the supplied design.\n`;
const release = (version = '1.0.0', notes = 'Initial release.') =>
  `version: ${JSON.stringify(version)}\nnotes: ${JSON.stringify(notes)}\n`;
function bundle(version = '0.1.0') {
  return {
    'plugin.json': plugin(version),
    '.claude-plugin/marketplace.json': marketplace(version),
    'skills/explain-design/SKILL.md': instructions('explain-design'),
  };
}

function snapshot(files) {
  return new Map(Object.entries(files).map(([path, data]) => [path, { mode: '100644', data: Buffer.from(data) }]));
}

function releasedBundle(pluginVersion = '0.1.1', skillVersion = '1.0.0', notes = 'Initial release.') {
  return { ...bundle(pluginVersion), 'skills/explain-design/release.yaml': release(skillVersion, notes) };
}

test('repository validation requires release metadata beside every skill', t => {
  const root = fixture(t, bundle());
  assert.throws(() => validate(root), /release\.yaml/);
});

test('repository validation accepts authored release notes and rejects duplicate keys', t => {
  const root = fixture(t, { ...bundle(), 'skills/explain-design/release.yaml': release() });
  assert.match(validate(root), /Validated/);
  writeFileSync(join(root, 'skills/explain-design/release.yaml'), release() + 'notes: "Replacement"\n');
  assert.throws(() => validate(root), /duplicate notes/);
});

test('the first complete baseline starts active skills at 1.0.0 and bumps the plugin once', () => {
  const before = snapshot(bundle());
  assert.equal(validateReleaseChange(before, snapshot(releasedBundle())).baseline, true);
  assert.throws(() => validateReleaseChange(before, snapshot(releasedBundle('0.1.1', '1.1.0'))), /1\.0\.0/);
  assert.throws(() => validateReleaseChange(before, snapshot(releasedBundle('0.1.0'))), /plugin.*0\.1\.1/);
});

test('published skill changes require exactly one allowed version step', () => {
  const before = snapshot(releasedBundle());
  for (const version of ['1.0.1', '1.1.0', '2.0.0']) {
    const after = releasedBundle('0.1.2', version, 'Explain the recommendation more clearly.');
    after['skills/explain-design/SKILL.md'] += 'Include the recommendation.\n';
    assert.deepEqual(validateReleaseChange(before, snapshot(after)).changedSkills, ['explain-design']);
  }
  for (const version of ['1.0.0', '0.9.0', '1.0.2', '1.2.0', '2.1.0']) {
    const after = releasedBundle('0.1.2', version, 'Corrected explanation.');
    after['skills/explain-design/SKILL.md'] += 'Include the recommendation.\n';
    assert.throws(() => validateReleaseChange(before,
      snapshot(after)), /one patch, minor or major step/);
  }
});

test('note-only corrections require the next patch version', () => {
  const before = snapshot(releasedBundle());
  assert.deepEqual(validateReleaseChange(before,
    snapshot(releasedBundle('0.1.2', '1.0.1', 'Corrected note.'))).changedSkills, ['explain-design']);
  for (const version of ['1.1.0', '2.0.0', '1.0.0', '1.0.2']) {
    assert.throws(() => validateReleaseChange(before,
      snapshot(releasedBundle('0.1.2', version, 'Corrected note.'))), /note-only correction.*patch/);
  }
});

test('resource bytes, additions and modes are part of a skill release', () => {
  const before = snapshot(releasedBundle());
  const after = snapshot({ ...releasedBundle('0.1.2'), 'skills/explain-design/example.bin': '\0one' });
  assert.throws(() => validateReleaseChange(before, after), /changed content/);
  after.set('skills/explain-design/release.yaml', { mode: '100644', data: Buffer.from(release('1.0.1')) });
  assert.deepEqual(validateReleaseChange(before, after).changedSkills, ['explain-design']);
  const executable = snapshot(releasedBundle('0.1.2', '1.0.1'));
  executable.get('skills/explain-design/SKILL.md').mode = '100755';
  assert.deepEqual(validateReleaseChange(before, executable).changedSkills, ['explain-design']);
});

test('version-only bookkeeping and unnecessary plugin bumps are rejected', () => {
  const before = snapshot(releasedBundle());
  assert.throws(() => validateReleaseChange(before, snapshot(releasedBundle('0.1.2', '1.0.1'))), /version-only/);
  assert.throws(() => validateReleaseChange(before, snapshot(releasedBundle('0.1.2'))), /no bundle change/);
  assert.deepEqual(validateReleaseChange(before,
    snapshot({ ...releasedBundle(), 'README.md': 'New documentation' })).changedSkills, []);
});

test('instruction edits and resource removal need releases, but metadata formatting alone does not qualify', () => {
  const released = { ...releasedBundle(), 'skills/explain-design/example.md': 'An example.' };
  const before = snapshot(released);
  const edited = { ...released, 'skills/explain-design/SKILL.md': instructions('explain-design') + 'Give a recommendation.\n' };
  assert.throws(() => validateReleaseChange(before, snapshot(edited)), /changed content/);
  const removed = { ...released };
  delete removed['skills/explain-design/example.md'];
  assert.throws(() => validateReleaseChange(before, snapshot(removed)), /changed content/);
  Object.assign(removed, releasedBundle('0.1.2', '1.0.1', 'Removed the obsolete example.'));
  assert.deepEqual(validateReleaseChange(before, snapshot(removed)).changedSkills, ['explain-design']);
  const formatted = { ...released, 'skills/explain-design/release.yaml': '# New comment\n' + release() };
  assert.throws(() => validateReleaseChange(before, snapshot(formatted)), /metadata formatting/);
});

test('release snapshots reject unsupported Git file modes and malformed UTF-8 metadata', () => {
  const before = snapshot(releasedBundle());
  const after = snapshot(releasedBundle());
  after.set('skills/explain-design/link', { mode: '120000', data: Buffer.from('outside') });
  assert.throws(() => validateReleaseChange(before, after), /unsupported file mode/);
  assert.throws(() => parseRelease(Buffer.from([0xff])), /encoded data/);
});

test('several skill releases share one plugin patch and unchanged skills stay unchanged', () => {
  const twoSkills = {
    ...releasedBundle(), 'skills/other/SKILL.md': instructions('other'), 'skills/other/release.yaml': release(),
  };
  const before = snapshot(twoSkills);
  const after = { ...twoSkills, ...releasedBundle('0.1.2', '1.0.1', 'Fixed an explanation.') };
  assert.deepEqual(validateReleaseChange(before, snapshot(after)).changedSkills, ['explain-design']);
  after['skills/other/release.yaml'] = release('1.1.0', 'Added another example.');
  after['skills/other/example.md'] = 'A new example.';
  assert.deepEqual(validateReleaseChange(before, snapshot(after)).changedSkills, ['explain-design', 'other']);
});

test('retirement and return use published absence rather than previous version labels', () => {
  const before = snapshot(releasedBundle('0.1.1', '3.2.1'));
  const empty = { 'plugin.json': plugin('0.1.2'), '.claude-plugin/marketplace.json': marketplace('0.1.2') };
  assert.deepEqual(validateReleaseChange(before, snapshot(empty)).removedSkills, ['explain-design']);
  assert.deepEqual(validateReleaseChange(snapshot(empty), snapshot(releasedBundle('0.1.3'))).addedSkills, ['explain-design']);
  assert.throws(() => validateReleaseChange(snapshot(empty), snapshot(releasedBundle('0.1.3', '3.2.2'))), /1\.0\.0/);
});

test('structural validation allows a collection emptied after retirement', t => {
  const root = fixture(t, { 'plugin.json': plugin('0.1.2'), '.claude-plugin/marketplace.json': marketplace('0.1.2') });
  assert.match(validate(root), /0 skill/);
});

test('metadata rejects duplicate keys, nonstrings, unsupported YAML and invalid versions', () => {
  for (const source of [
    'version: "1.0.0"\nversion: "1.0.1"\nnotes: "x"',
    'version: "1.0.0"\nnotes: true', 'version: "1.0.0"\nnotes: 2',
    'version: "1.0.0"\nnotes: ["x"]', 'version: "1.0.0"\nnotes: { x: y }',
    'version: "1.0.0"\nnotes: &anchor "x"', 'version: "1.0.0"\nnotes: *anchor',
    'version: "1.0.0"\nnotes: !!str "x"', 'version: "1.0.0"\nnotes: |\n  x',
    'version: "1.0.0"\nnotes: " "', 'version: "1.0.0"',
    'version: "1.0.0"\nnotes: "x"\nextra: "y"',
    'version: "01.0.0"\nnotes: "x"', 'version: "1.0"\nnotes: "x"',
    'version: "1.0.0-beta"\nnotes: "x"', 'version: "1.0.0+build"\nnotes: "x"',
  ]) assert.throws(() => parseRelease(source), /release\.yaml/);
  assert.deepEqual(parseRelease('\uFEFF# comment\r\nversion: \'1.0.0\'\r\nnotes: \'It\'\'s clear: #1\'\r\n'),
    { version: '1.0.0', notes: "It's clear: #1" });
});

test('partial legacy baselines, lost metadata and mismatched manifests fail', () => {
  const partial = { ...releasedBundle(), 'skills/other/SKILL.md': instructions('other') };
  assert.throws(() => validateReleaseChange(snapshot(partial), snapshot(releasedBundle('0.1.2'))), /Partial metadata/);
  assert.throws(() => validateReleaseChange(snapshot(releasedBundle()), snapshot(bundle('0.1.2'))), /release\.yaml is required/);
  const mismatch = { ...releasedBundle(), '.claude-plugin/marketplace.json': marketplace('0.1.3') };
  assert.throws(() => validateReleaseChange(snapshot(releasedBundle()), snapshot(mismatch)), /must match/);
});

test('stale-main comparisons fail and fresh comparisons can reveal colliding release numbers', () => {
  const candidate = snapshot(releasedBundle('0.1.2', '1.0.1', 'Our fix.'));
  assert.throws(() => validateReleaseChange(snapshot(releasedBundle()), candidate,
    { baseCommit: 'old-main', currentMainCommit: 'new-main' }), /Stale comparison base/);
  assert.throws(() => validateReleaseChange(snapshot(releasedBundle('0.1.2', '1.0.1', 'Other fix.')), candidate,
    { baseCommit: 'new-main', currentMainCommit: 'new-main' }), /note-only correction.*patch/);
});

test('plugin-only configuration changes require a patch without inventing skill releases', () => {
  const before = snapshot(releasedBundle());
  const after = releasedBundle('0.1.2');
  const config = JSON.parse(after['plugin.json']);
  config.description = 'New collection description';
  after['plugin.json'] = JSON.stringify(config);
  assert.deepEqual(validateReleaseChange(before, snapshot(after)).changedSkills, []);
});

test('release arithmetic stays exact beyond JavaScript safe integers', () => {
  const before = snapshot(releasedBundle('0.1.1', '9007199254740993.0.0'));
  const after = snapshot(releasedBundle('0.1.2', '9007199254740993.0.1', 'Fixed note.'));
  assert.deepEqual(validateReleaseChange(before, after).changedSkills, ['explain-design']);
});
