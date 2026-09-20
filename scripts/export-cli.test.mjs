import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir, release } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';

const supported = process.platform === 'win32' || /microsoft/i.test(release());
test('the distributed entry point lists, plans, creates and inspects using one fixed bundle', { skip: !supported }, t => {
  const parent = resolve(tmpdir());
  const home = mkdtempSync(join(parent, 'gt-cli-test-'));
  t.after(() => { assert.equal(dirname(home), parent); assert.ok(home.startsWith(join(parent, 'gt-cli-test-'))); rmSync(home, { recursive: true, force: true }); });
  const target = ['--environment', process.platform === 'win32' ? 'windows' : 'wsl', '--home', home];
  function run(command, ...args) {
    return JSON.parse(execFileSync(process.execPath, [resolve('exporter/run.mjs'), command, ...target, ...args], { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }));
  }
  assert.equal(run('inspect', '--name', 'grill-me-v1-0-0').publication, 'not-created');
  assert.deepEqual(readdirSync(home), []);
  const listing = run('list', '--checkout', resolve('.'));
  const record = listing.catalog.records.find(r => r.skill === 'grill-me');
  const plan = run('plan', '--cache', listing.cache, '--skill', record.skill, '--commit', record.sourceCommit);
  const planPath = join(home, 'plan.json');
  writeFileSync(planPath, JSON.stringify(plan));
  assert.throws(() => run('export', '--plan', planPath), /Command failed/);
  const created = run('export', '--plan', planPath, '--portability-reviewed');
  assert.equal(created.publication, 'complete');
  assert.equal(created.activation, 'not-verified');
  assert.equal(run('inspect', '--name', plan.personalName).integrity, 'matches-receipt');
  assert.equal(readFileSync(join(created.destination, 'release.yaml'), 'utf8').includes('1.0.0'), true);
  const frozen = readdirSync(join(home, '.copilot/gt-export-work')).filter(name => name.startsWith('code-'));
  assert.ok(frozen.length >= 3);
  assert.ok(readFileSync(join(home, '.copilot/gt-export-work', frozen[0], 'export-cli.mjs')).length > 0);
  const damaged = join(home, 'damaged-bundle');
  cpSync(resolve('exporter'), damaged, { recursive: true });
  writeFileSync(join(damaged, 'export-source.mjs'), 'throw new Error("Must not execute an unverified module");');
  assert.throws(() => execFileSync(process.execPath, [join(damaged, 'run.mjs'), 'inspect', ...target, '--name', plan.personalName],
    { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }), error => /Incomplete or changing exporter bundle/.test(error.stderr));
});
