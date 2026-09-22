import assert from 'node:assert/strict';
import test from 'node:test';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, posix } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { buildBundle, submissionGuidance } from './build-skill-steal.mjs';
import { checkPackage, readPackage } from './create-skills/package.mjs';
import { metadata, entry } from './fixtures/releases.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'gt-steal-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const output = join(root, 'isolated bundle');
  cpSync(resolve('skills/skill-steal'), output, { recursive: true });
  const run = (command, input) => spawnSync(process.execPath,
    [join(output, 'scripts/run.mjs'), ...command],
    { cwd: root, shell: false, input: input === undefined ? undefined : JSON.stringify(input), encoding: 'utf8' });
  const json = (command, input, status = 0) => {
    const result = run(command, input);
    assert.equal(result.status, status, result.error?.message ?? result.stderr + result.stdout);
    return JSON.parse(result.stdout);
  };
  return { root, output, run, json };
}
const request = {
  title: 'Import meeting notes', intent: 'Preserve the existing notes format.',
  interview: { status: 'none', text: 'The supplied source and request fully define the intended behavior.' },
  specification: 'Read supplied notes and return the bundled summary format; do not send anything.',
  implementation: 'Separate GT draft, original unchanged; no behavior changes intended.',
  verification: 'Structural check recorded separately; model behavior not executed.',
};

test('standalone importer checks the cumulative schema and rejects invalid histories', t => {
  const { root, json } = fixture(t), draft = join(root, 'sample');
  mkdirSync(draft);
  writeFileSync(join(draft, 'SKILL.md'), '---\nname: sample\ndescription: Explain.\nuser-invocable: true\ndisable-model-invocation: true\n---\nExplain text.\n');
  for (const valid of [metadata(), metadata('1.0.1', 'More.', [entry()]), metadata('1.0.0', 'Returned.', [entry()], 2)]) {
    writeFileSync(join(draft, 'release.yaml'), valid);
    assert.equal(json(['check', draft]).status, 'passed');
  }
  for (const invalid of [metadata('1.0.1'), metadata('1.0.0', 'Duplicate.', [entry()]), metadata('1.0.0', 'Skipped period.', [entry()], 3)]) {
    writeFileSync(join(draft, 'release.yaml'), invalid);
    assert.equal(json(['check', draft], undefined, 1).status, 'failed');
  }
});

test('Skill Steal metadata, transitive resource links and generated bundle are complete', () => {
  buildBundle({ check: true });
  const pkg = readPackage(resolve('skills/skill-steal'));
  assert.equal(checkPackage(pkg).status, 'passed');
  for (const [path, file] of pkg.files) {
    if (!path.endsWith('.md')) continue;
    for (const match of file.data.toString('utf8').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      if (/^(https?:|#)/.test(match[1])) continue;
      const target = posix.normalize(posix.join(posix.dirname(path), match[1].split('#')[0]));
      assert.ok(!target.startsWith('../') && pkg.files.has(target), `${path}: ${target}`);
    }
  }
});

test('copied package checks and prepares an import with a template without modifying or executing source', t => {
  const { root, json } = fixture(t);
  const source = join(root, 'original-notes'), draft = join(root, 'meeting-notes');
  mkdirSync(join(source, 'templates'), { recursive: true });
  writeFileSync(join(source, 'SKILL.md'), '---\nname: original-notes\ndescription: Summarize notes.\n---\nRead [format](templates/summary.md); return decisions and actions.\n');
  writeFileSync(join(source, 'templates/summary.md'), '## Decisions\n## Actions\n');
  writeFileSync(join(source, 'never-run.mjs'), 'throw new Error("Imported code must not execute");\n');
  const before = readPackage(source);
  cpSync(source, draft, { recursive: true, errorOnExist: true, force: false });
  writeFileSync(join(draft, 'SKILL.md'), readFileSync(join(source, 'SKILL.md'), 'utf8')
    .replace('name: original-notes', 'name: meeting-notes')
    .replace('description: Summarize notes.', 'description: Summarize notes.\nuser-invocable: true\ndisable-model-invocation: true'));
  writeFileSync(join(draft, 'release.yaml'), 'version: "1.0.0"\nnotes: "Import notes format."\nperiod: 1\nhistory: []\n');
  const checked = json(['check', draft]);
  assert.equal(checked.status, 'passed');
  const prepared = json(['prepare'], { ...request, packageDirectory: draft });
  assert.deepEqual(prepared.manifest.map(x => x.path).sort(), ['SKILL.md', 'never-run.mjs', 'release.yaml', 'templates/summary.md']);
  const template = prepared.manifest.find(x => x.path === 'templates/summary.md');
  assert.equal(template.sha256, createHash('sha256').update(readFileSync(join(source, template.path))).digest('hex'));
  assert.ok(prepared.initialBody.includes('## Decisions\n## Actions'));
  assert.deepEqual(readPackage(source).files, before.files);
  assert.equal(existsSync(join(source, 'release.yaml')), false);
});

test('failed structural checks remain submittable with explicit evidence', t => {
  const { root, json } = fixture(t), draft = join(root, 'partial-notes');
  mkdirSync(draft);
  writeFileSync(join(draft, 'SKILL.md'), '---\nname: partial-notes\ndescription: Summarize notes.\nuser-invocable: true\ndisable-model-invocation: true\n---\nRead [format](missing.md).\n');
  writeFileSync(join(draft, 'release.yaml'), 'version: "1.0.0"\nnotes: "Partial draft."\nperiod: 1\nhistory: []\n');
  const checked = json(['check', draft], undefined, 1);
  assert.equal(checked.status, 'failed');
  const prepared = json(['prepare'], { ...request, packageDirectory: draft, verification: JSON.stringify(checked) });
  assert.equal(prepared.manifest.length, 2);
  assert.ok(prepared.initialBody.includes('missing.md'));
  assert.equal(json(['next'], { plan: prepared, actorId: 7, authorized: true }).request.operation, 'create');
});

test('shareable-only and specification-only inputs keep withheld files out of delivery', t => {
  const { root, json } = fixture(t), source = join(root, 'private-source'), draft = join(root, 'shareable-draft');
  mkdirSync(source); mkdirSync(draft);
  const secret = 'PRIVATE-FIXTURE-MUST-NOT-BE-SENT';
  writeFileSync(join(source, 'private.txt'), secret);
  writeFileSync(join(draft, 'SKILL.md'), 'Partial reviewed content.');
  for (const packageDirectory of [draft, undefined]) {
    const plan = json(['prepare'], { ...request, packageDirectory, implementation: 'Required private file withheld; incomplete package.' });
    assert.ok(!JSON.stringify(plan).includes(secret));
    assert.ok(!plan.manifest.some(x => x.path === 'private.txt'));
  }
  assert.equal(readFileSync(join(source, 'private.txt'), 'utf8'), secret);
});

test('copied entry point preserves literal text, requires intent evidence, and exposes no install command', t => {
  const { output, json, run } = fixture(t);
  const plan = json(['prepare'], { ...request, specification: 'Keep $(echo injected), `$HOME`, and café literally.' });
  assert.ok(plan.initialBody.includes('$(echo injected), `$HOME`, and café'));
  assert.equal(json(['prepare'], { ...request, interview: undefined }, 1).status, 'failed');
  assert.equal(json(['next'], { plan, actorId: 7, authorized: false }, 1).status, 'failed');
  assert.equal(json(['install'], {}, 1).status, 'failed');
  assert.equal(existsSync(join(output, 'scripts/install.mjs')), false);
  assert.equal(run(['--help']).status, 0);
  assert.equal(json(['prepare', 'extra'], request, 1).status, 'failed');
});

test('uncertain submission produces reconciliation rather than another create', t => {
  const { json } = fixture(t);
  const plan = json(['prepare'], request);
  const state = { plan, actorId: 7, authorized: true, history: [] };
  const first = json(['next'], state);
  state.history.push({ request: first.request, result: null });
  const next = json(['next'], state);
  assert.equal(next.status, 'uncertain');
  assert.equal(next.recoveryRequest.operation, 'reconcile');
  assert.notEqual(next.status, 'ready');
});

test('generated rules, shared code and guidance reject drift and unexpected runtime modules', t => {
  const { output } = fixture(t);
  for (const path of ['references/package-rules.md', 'references/tools.md', 'references/submission.md', 'scripts/review-handoff.mjs']) {
    writeFileSync(join(output, path), 'stale');
    assert.throws(() => buildBundle({ output, check: true }), /Stale/);
    buildBundle({ output });
  }
  writeFileSync(join(output, 'scripts/install.mjs'), '');
  assert.throws(() => buildBundle({ output, check: true }), /Unexpected/);
  const source = readFileSync(resolve('skills/create-skills/references/submission.md'), 'utf8');
  assert.throws(() => submissionGuidance(source.replaceAll('intent-capture.md', 'moved.md')), /guidance changed/);
});
