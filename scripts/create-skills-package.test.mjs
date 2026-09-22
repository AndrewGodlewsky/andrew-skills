import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, symlinkSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkDirectory, readPackage, limits } from './create-skills/package.mjs';
import { buildBundle, guidance } from './build-create-skills.mjs';
import { metadata, entry } from './fixtures/releases.mjs';

export function fixture(t) {
  const home = mkdtempSync(join(tmpdir(), 'gt-creator-'));
  t.after(() => rmSync(home, { recursive: true, force: true }));
  const root = join(home, 'sample'); mkdirSync(root);
  writeFileSync(join(root, 'SKILL.md'), '---\nname: sample\ndescription: Explain supplied text.\nuser-invocable: true\ndisable-model-invocation: true\n---\nExplain the supplied text.\n');
  writeFileSync(join(root, 'release.yaml'), 'version: "1.0.0"\nnotes: "Explain supplied text."\nperiod: 1\nhistory: []\n');
  return { home, root };
}
test('a standalone package reports content identity and does not execute scripts', t => {
  const { root } = fixture(t);
  writeFileSync(join(root, 'never-run.mjs'), 'throw new Error("must not run");');
  const result = checkDirectory(root);
  assert.equal(result.status, 'passed'); assert.equal(result.manifest.length, 3);
  assert.match(result.identity, /^[a-f0-9]{64}$/);
  const before = result.identity;
  writeFileSync(join(root, 'never-run.mjs'), 'process.exit(3);');
  assert.notEqual(checkDirectory(root).identity, before);
});

test('creator checker accepts cumulative history and rejects missing, duplicate and malformed entries', t => {
  const { root } = fixture(t);
  writeFileSync(join(root, 'release.yaml'), metadata('1.0.1', 'Explain more.', [entry()]));
  assert.equal(checkDirectory(root).status, 'passed');
  for (const invalid of [metadata('1.0.1'), metadata('1.0.0', 'Repeated', [entry()]), metadata() + 'history: []\n', metadata('1.0.1', 'x', [entry()]).replace('    notes:', '    other:')]) {
    writeFileSync(join(root, 'release.yaml'), invalid);
    assert.equal(checkDirectory(root).status, 'failed');
  }
});
test('missing release and invalid invocation report failed rather than passed', t => {
  const { root } = fixture(t);
  rmSync(join(root, 'release.yaml'));
  assert.match(checkDirectory(root).diagnostics[0], /release.yaml/);
  writeFileSync(join(root, 'release.yaml'), 'version: "1.0.0"\nnotes: "Initial."\nperiod: 1\nhistory: []\n');
  writeFileSync(join(root, 'SKILL.md'), readFileSync(join(root, 'SKILL.md'), 'utf8').replace('user-invocable: true', 'user-invocable: false'));
  assert.match(checkDirectory(root).diagnostics[0], /invocation route/);
});
test('a missing or escaping inline resource fails checking', t => {
  const { root } = fixture(t);
  const skill = readFileSync(join(root, 'SKILL.md'), 'utf8');
  for (const link of ['missing.md', '../outside.md', '%2e%2e/outside.md']) {
    writeFileSync(join(root, 'SKILL.md'), `${skill}\n[Read](${link})\n`);
    assert.equal(checkDirectory(root).status, 'failed');
  }
});
test('file and tree bounds are enforced before reading large content', t => {
  const { root } = fixture(t);
  writeFileSync(join(root, 'large.bin'), Buffer.alloc(limits.fileBytes + 1));
  assert.match(checkDirectory(root).diagnostics[0], /limit/);
  rmSync(join(root, 'large.bin'));
  let directory = root;
  for (let i = 0; i < limits.depth + 1; i++) { directory = join(directory, 'nested'); mkdirSync(directory); }
  assert.match(checkDirectory(root).diagnostics[0], /depth/);
});
test('redirected directories are rejected without reading their contents', t => {
  const { home, root } = fixture(t);
  const elsewhere = join(home, 'elsewhere'); mkdirSync(elsewhere);
  symlinkSync(elsewhere, join(root, 'redirect'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => readPackage(root), /Redirected/);
});
test('guidance requires unique ordered anchors and excludes repository-only links', () => {
  const source = readFileSync(new URL('../CONTRIBUTING.md', import.meta.url), 'utf8');
  assert.match(guidance(source), /four|Required/);
  assert.throws(() => guidance(source.replace('## Complete examples', '## Gone')), /anchors/);
  assert.throws(() => guidance(source + '\n## Skill standard'), /exactly once/);
  assert.throws(() => guidance(source.replace('## Skill standard', '## Skill standard\n[leak](README.md)')), /repository-only/);
});
test('bundled checker runs outside checkout and detects stale/unexpected outputs', t => {
  const { home, root } = fixture(t);
  const output = join(home, 'copied-bundle'); buildBundle({ output });
  buildBundle({ output, check: true });
  const child = spawnSync(process.execPath, [join(output, 'scripts/run.mjs'), 'check', root], { cwd: home, encoding: 'utf8' });
  assert.equal(child.status, 0, child.stderr + child.stdout);
  assert.equal(JSON.parse(child.stdout).status, 'passed');
  writeFileSync(join(output, 'references/package-rules.md'), 'stale');
  assert.throws(() => buildBundle({ output, check: true }), /Stale/);
  buildBundle({ output });
  writeFileSync(join(output, 'scripts/unexpected.mjs'), '');
  assert.throws(() => buildBundle({ output, check: true }), /Unexpected/);
});

test('packaged JSON commands preserve shell-looking content and install only in an isolated user home', t => {
  const { home, root } = fixture(t);
  const output = join(home, 'bundle'); buildBundle({ output });
  const personalHome = join(home, 'isolated-user'); mkdirSync(personalHome);
  const env = { ...process.env, HOME: personalHome, USERPROFILE: personalHome };
  const homeCheck = spawnSync(process.execPath, ['-e', 'process.stdout.write(require("node:os").homedir())'], { env, encoding: 'utf8' });
  assert.equal(homeCheck.stdout, personalHome, 'Refuse to exercise installation unless the child home is isolated.');
  const run = (command, input) => {
    const child = spawnSync(process.execPath, [join(output, 'scripts/run.mjs'), command], { env, cwd: home, shell: false, input: JSON.stringify(input), encoding: 'utf8' });
    assert.equal(child.status, 0, child.stderr + child.stdout); return JSON.parse(child.stdout);
  };
  const plan = run('prepare', { title: 'Keep `$HOME` literally', intent: 'Preserve the supplied sample behavior.', interview: { status: 'none', text: 'The initial request supplied these requirements; no questions were needed.' }, specification: 'No command execution: $(echo injected).', implementation: 'Generated sample.', verification: 'Structural result provided separately.', packageDirectory: root });
  assert.match(plan.initialBody, /\$\(echo injected\)/);
  const next = run('next', { plan, actorId: 7, authorized: true });
  assert.equal(next.request.operation, 'create');
  const installed = run('install', { packageDirectory: root, expectedIdentity: checkDirectory(root).identity, approved: true });
  assert.equal(installed.status, 'installed');
  // Windows runner TEMP may use an 8.3 alias; the installer canonicalizes home.
  assert.equal(installed.destination, join(realpathSync.native(personalHome), '.copilot', 'skills', 'sample'));
});

test('package file count and malformed metadata cannot be reported as a pass', t => {
  const { root } = fixture(t);
  writeFileSync(join(root, 'release.yaml'), 'version: 1.0.0\nnotes: unquoted\n');
  assert.equal(checkDirectory(root).status, 'failed');
  for (let i = 0; i < limits.files; i++) writeFileSync(join(root, `item-${i}.txt`), '');
  assert.match(checkDirectory(root).diagnostics[0], /limit/);
});
