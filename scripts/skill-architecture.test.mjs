import assert from 'node:assert/strict';
import test from 'node:test';
import { validateFiles } from './validate.mjs';

const header = {
  name: 'explain-design',
  description: 'Explain a supplied design and its tradeoffs.',
  'user-invocable': 'true',
  'disable-model-invocation': 'true',
};

function collection(fields = header, body = 'Explain the supplied design.', resources = {}) {
  const files = {
    'plugin.json': JSON.stringify({
      $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
      name: 'gt', version: '0.1.4', description: 'Fixture collection',
    }),
    '.claude-plugin/marketplace.json': JSON.stringify({
      name: 'andrew-skills', owner: { name: 'Fixture owner' },
      plugins: [{ name: 'gt', source: './', version: '0.1.4', description: 'Fixture collection' }],
    }),
    'skills/explain-design/SKILL.md': `---\n${Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join('\n')}\n---\n${body}\n`,
    'skills/explain-design/release.yaml': 'version: "1.0.0"\nnotes: "Explain a supplied design."\nperiod: 1\nhistory: []\n',
    ...resources,
  };
  return new Map(Object.entries(files).map(([path, data]) => [path, { mode: '100644', data: Buffer.from(data) }]));
}

test('a skill explicitly declares all four required fields', () => {
  assert.match(validateFiles(collection()), /1 skill/);
  for (const key of Object.keys(header)) {
    const fields = { ...header };
    delete fields[key];
    assert.throws(() => validateFiles(collection(fields)), new RegExp(key));
  }
});

test('only the accepted optional string fields extend the four-field header', () => {
  assert.match(validateFiles(collection({ ...header, 'argument-hint': '"[design]"', license: 'MIT' })), /1 skill/);
  for (const key of ['user-invokeable', 'model', 'allowed-tools']) {
    assert.throws(() => validateFiles(collection({ ...header, [key]: 'true' })), /unsupported header field/);
  }
  for (const key of ['argument-hint', 'license']) {
    for (const value of ['" "', 'true', 'false', '42', 'null', '~', '["text"]', '{text: value}']) {
      assert.throws(() => validateFiles(collection({ ...header, [key]: value })), /string/);
    }
  }
});

test('valid invocation routes pass while the neither-route combination fails', () => {
  for (const [user, disabled] of [['true', 'true'], ['true', 'false'], ['false', 'false']]) {
    assert.match(validateFiles(collection({ ...header, 'user-invocable': user, 'disable-model-invocation': disabled })), /1 skill/);
  }
  assert.throws(() => validateFiles(collection({ ...header, 'user-invocable': 'false' })), /invocation route/);
});

test('required fields retain their string and boolean types', () => {
  for (const key of ['name', 'description']) {
    for (const value of ['true', 'false', '42', 'null', '~', '["text"]', '{text: value}', '" "']) {
      assert.throws(() => validateFiles(collection({ ...header, [key]: value })), /SKILL\.md/);
    }
  }
  for (const key of ['user-invocable', 'disable-model-invocation']) {
    for (const value of ['"true"', "'false'", 'null', '42', '[true]', '{}', 'yes']) {
      assert.throws(() => validateFiles(collection({ ...header, [key]: value })), /SKILL\.md/);
    }
  }
  assert.match(validateFiles(collection({ ...header, description: '"42"' })), /1 skill/);
});

test('headers reject duplicate keys and names that do not match their folder', () => {
  assert.throws(() => validateFiles(collection({ ...header, name: 'another-design' })), /name must match the folder/);
  assert.throws(() => validateFiles(collection({ ...header, description: 'Explain a design.\nname: explain-design' })), /duplicate field name/);
});

test('an instruction body is required without prescribing headings or workflow sections', () => {
  assert.throws(() => validateFiles(collection(header, '  \n\t')), /instruction body is empty/);
  assert.match(validateFiles(collection(header, 'Ask for the supplied design.')), /1 skill/);
});

test('supported inline links resolve bundled resources inside the skill folder', () => {
  const resources = {
    'skills/explain-design/templates/summary.md': 'Summarize the recommendation.',
    'skills/explain-design/notes with spaces.md': 'Optional context.',
    'skills/explain-design/example.png': Buffer.from([0, 1, 2]),
  };
  const body = [
    'Use [summary](templates/summary.md#result "Summary") and [context](<notes with spaces.md>).',
    'Inspect ![example](example.png). Read [encoded context](notes%20with%20spaces.md).',
    'See [a section](#result), [a reference](https://example.com) and [email](mailto:owner@example.com).',
  ].join('\n');
  assert.match(validateFiles(collection(header, body, resources)), /1 skill/);
  for (const target of ['missing.md', 'templates', '../other/SKILL.md', '../../plugin.json', '%2e%2e/outside.md',
    '/absolute.md', 'C:/outside.md', 'file:outside.md', '%2fabsolute.md', '..%5coutside.md']) {
    assert.throws(() => validateFiles(collection(header, `Read [resource](${target}).`, resources)), /resource/);
  }
});
