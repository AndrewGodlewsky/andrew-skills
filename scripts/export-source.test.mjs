import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareSource } from './export-source.mjs';
import { skillContentIdentity } from './release-catalog.mjs';

function source() {
  const text = "---\r\nname: 'example'\r\ndescription: Explain a design.\r\ndisable-model-invocation: true\r\n---\r\nRead [sample](assets/sample.bin).\r\n";
  const files = new Map([
    ['SKILL.md', { mode: '100644', data: Buffer.from(text) }],
    ['release.yaml', { mode: '100644', data: Buffer.from('version: "1.0.0"\nnotes: "Initial release."\nperiod: 1\nhistory: []\n') }],
    ['assets/sample.bin', { mode: '100644', data: Buffer.from([0, 255, 13, 10]) }],
  ]);
  const record = { repository: 'https://github.com/AndrewGodlewsky/andrew-skills', skill: 'example', version: '1.0.0',
    notes: 'Initial release.', period: 1, history: [], sourceCommit: '1'.repeat(40), sourceTree: '2'.repeat(40), skillPath: 'skills/example',
    contentIdentity: skillContentIdentity(files) };
  return { files, record, text };
}

test('a verified historical package changes only its frontmatter name and records both byte manifests', () => {
  const { files, record, text } = source();
  const result = prepareSource(record, files, { portabilityReviewed: true });
  assert.equal(result.personalName, 'example-v1-0-0');
  assert.equal(result.files.get('SKILL.md').data.toString(), text.replace("name: 'example'", "name: example-v1-0-0"));
  assert.deepEqual(result.files.get('assets/sample.bin').data, Buffer.from([0, 255, 13, 10]));
  assert.deepEqual(result.files.get('release.yaml').data, files.get('release.yaml').data);
  assert.equal(result.sourceFiles.length, 3);
  assert.equal(result.installedFiles.length, 3);
  assert.notEqual(result.sourceFiles.find(f => f.path === 'SKILL.md').sha256,
    result.installedFiles.find(f => f.path === 'SKILL.md').sha256);
});

test('BOM and instruction bytes survive the single-field adaptation, and nonregular source modes fail', () => {
  const { files, record, text } = source();
  files.get('SKILL.md').data = Buffer.from('\uFEFF' + text);
  record.contentIdentity = skillContentIdentity(files);
  const prepared = prepareSource(record, files, { portabilityReviewed: true });
  assert.equal(prepared.files.get('SKILL.md').data.toString(), '\uFEFF' + text.replace("name: 'example'", 'name: example-v1-0-0'));
  files.set('external', { mode: '120000', data: Buffer.from('../outside') });
  assert.throws(() => prepareSource(record, files, { portabilityReviewed: true }), /unsupported source mode/);
  files.set('external', { mode: '160000', data: Buffer.alloc(0) });
  assert.throws(() => prepareSource(record, files, { portabilityReviewed: true }), /unsupported source mode/);
});

test('self-contained Markdown resource links accept fragments and encoded filenames', () => {
  const { files, record } = source();
  files.set('details file.md', { mode: '100644', data: Buffer.from('# Section\nDetails.\n') });
  files.get('SKILL.md').data = Buffer.from('---\nname: example\ndescription: Explain a design.\n---\nRead [details](./details%20file.md#section).\n');
  record.contentIdentity = skillContentIdentity(files);
  assert.equal(prepareSource(record, files, { portabilityReviewed: true }).files.size, 4);
});

test('planning rejects unsafe, ambiguous or dependent packages before producing adapted files', () => {
  for (const path of ['../escape', 'CON.txt', 'trailing.', 'file:stream', '.gt-export.json', '.git/config',
    'nested/SKILL.md', 'C:/absolute', 'a'.repeat(256), 'folder/../../escape']) {
    const { files, record } = source();
    files.set(path, { mode: '100644', data: Buffer.from('data') });
    try { record.contentIdentity = skillContentIdentity(files); } catch { /* Invalid catalog paths must also fail export. */ }
    assert.throws(() => prepareSource(record, files, { portabilityReviewed: true }), /unsupported|unsafe|reserved|nested|path/);
  }
  for (const body of ['Run /gt:example.', 'Read [outside](../other/SKILL.md).', 'Read [outside](file:///tmp/secret).',
    'Use ${PLUGIN_ROOT}/shared/tool.mjs.', 'Read C:\\Users\\Someone\\secret.txt.',
    'Run `source ../other/setup.sh`.', 'Run `cat /mnt/shared/config.json`.', 'Read `/var/lib/tool/config.json`.']) {
    const { files, record } = source();
    files.get('SKILL.md').data = Buffer.from('---\nname: example\ndescription: Example.\n---\n' + body);
    record.contentIdentity = skillContentIdentity(files);
    assert.throws(() => prepareSource(record, files, { portabilityReviewed: true }), /portab|depend|relative|outside/);
  }
});

test('historical omitted flags are preserved but an explicit inaccessible invocation route is rejected', () => {
  const { files, record } = source();
  files.get('SKILL.md').data = Buffer.from('---\nname: example\ndescription: Explain a design.\nuser-invocable: false\ndisable-model-invocation: true\n---\nExplain it.');
  record.contentIdentity = skillContentIdentity(files);
  assert.throws(() => prepareSource(record, files, { portabilityReviewed: true }), /invocation route/);
});

test('source checks reject ambiguous headers, case collisions, LFS pointers and unreviewed portability', () => {
  for (const header of ['name: example\n"name": other', 'name: example\nname: example',
    'name: example\ndescription: x\ndescription: y', 'name: example\nallowed-tools: Bash']) {
    const { files, record } = source();
    files.get('SKILL.md').data = Buffer.from(`---\n${header}\n---\nExplain a design.`);
    record.contentIdentity = skillContentIdentity(files);
    assert.throws(() => prepareSource(record, files, { portabilityReviewed: true }), /header|frontmatter|unsupported|duplicate/);
  }
  const { files, record } = source();
  assert.throws(() => prepareSource(record, files), /review/);
  files.set('ASSETS/other.bin', { mode: '100644', data: Buffer.from('x') });
  record.contentIdentity = skillContentIdentity(files);
  assert.throws(() => prepareSource(record, files, { portabilityReviewed: true }), /case-colliding/);
  files.delete('ASSETS/other.bin');
  files.set('assets/large.bin', { mode: '100644', data: Buffer.from('version https://git-lfs.github.com/spec/v1\noid sha256:abc\nsize 3') });
  record.contentIdentity = skillContentIdentity(files);
  assert.throws(() => prepareSource(record, files, { portabilityReviewed: true }), /LFS/);
});
