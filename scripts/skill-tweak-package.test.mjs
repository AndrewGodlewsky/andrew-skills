import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, posix } from 'node:path';
import { spawnSync } from 'node:child_process';
import { buildBundle } from './build-skill-tweak.mjs';
import { readPackage, checkPackage } from './create-skills/package.mjs';

test('tweak package has valid metadata and self-contained resource links', () => {
  const pkg = readPackage(resolve('skills/skill-tweak'));
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

test('copied tweak planner runs outside checkout, preserves literal input and rejects omission', t => {
  const root = mkdtempSync(join(tmpdir(), 'gt-tweak-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const output = join(root, 'copied bundle'); buildBundle({ output }); buildBundle({ output, check: true });
  const run = (command, input) => spawnSync(process.execPath, [join(output, 'scripts/run.mjs'), command], { cwd: root, shell: false, input: JSON.stringify(input), encoding: 'utf8' });
  const input = { title: 'Keep `$HOME` literally', report: 'Unexpected result: $(echo injected).', intent: 'Review before sending.', interview: { status: 'none', text: 'Initial request supplied requirements; no interview needed.' } };
  const prepared = run('prepare', input);
  assert.equal(prepared.status, 0, prepared.stderr + prepared.stdout);
  const plan = JSON.parse(prepared.stdout);
  assert.ok(plan.initialBody.includes('$(echo injected)'));
  assert.ok(!plan.initialBody.includes('No package files supplied'));
  const next = run('next', { plan, actorId: 7, authorized: true, history: [] });
  assert.equal(next.status, 0, next.stderr + next.stdout);
  assert.equal(JSON.parse(next.stdout).request.operation, 'create');
  const missing = run('prepare', { ...input, interview: undefined });
  assert.equal(missing.status, 1);
  assert.equal(JSON.parse(missing.stdout).status, 'failed');
  const shared = join(output, 'scripts/review-handoff.mjs');
  writeFileSync(shared, readFileSync(shared, 'utf8') + '\n// stale\n');
  assert.throws(() => buildBundle({ output, check: true }), /Stale/);
  buildBundle({ output });
  writeFileSync(join(output, 'references/intent-capture.md'), 'stale');
  assert.throws(() => buildBundle({ output, check: true }), /Stale/);
});
