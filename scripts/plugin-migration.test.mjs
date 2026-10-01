import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { release } from 'node:os';
import test from 'node:test';
import { releaseRepository, metadata, entry } from './fixtures/releases.mjs';
import { readReleaseCatalog } from './release-catalog-reader.mjs';
import { readGitFiles, readWorkingGitFiles } from './release-snapshots.mjs';
import { validateFiles } from './validate.mjs';
import { acquireCatalog, makePlan, executePlan } from './export-protocol.mjs';
import { inspectCopy } from './export-filesystem.mjs';

function migrate(fixture) {
  mkdirSync(join(fixture.root, 'plugins/gt'), { recursive: true });
  for (const name of ['skills', 'plugin.json']) renameSync(join(fixture.root, name), join(fixture.root, 'plugins/gt', name));
  const manifests = version => {
    const plugin = JSON.parse(readFileSync(join(fixture.root, 'plugins/gt/plugin.json')));
    const marketplace = JSON.parse(readFileSync(join(fixture.root, '.claude-plugin/marketplace.json')));
    plugin.version = version;
    Object.assign(marketplace.plugins[0], { version, source: './plugins/gt' });
    fixture.write('plugins/gt/plugin.json', JSON.stringify(plugin));
    fixture.write('.claude-plugin/marketplace.json', JSON.stringify(marketplace));
  };
  manifests('0.1.23');
  return manifests;
}

test('Git history spans the move without rewriting prior records, modes or the baseline', t => {
  const f = releaseRepository(t, { later: false });
  const previous = readReleaseCatalog(f.root);
  const baseline = readGitFiles(f.root, f.head).get('release-baseline.json').data;
  const manifests = migrate(f);
  assert.match(validateFiles(readWorkingGitFiles(f.root)), /1 skill/);
  f.write('plugins/gt/skills/untracked/SKILL.md', '---\nname: untracked\ndescription: Explain.\nuser-invocable: true\ndisable-model-invocation: true\n---\nExplain.\n');
  f.write('plugins/gt/skills/untracked/release.yaml', metadata());
  assert.match(validateFiles(readWorkingGitFiles(f.root)), /2 skill/);
  // Leave the extra fixture unpublished while testing a pure relocation.
  renameSync(join(f.root, 'plugins/gt/skills/untracked'), join(f.root, 'untracked-fixture'));
  const moved = f.commit('Publish package relocation');
  const migrated = readReleaseCatalog(f.root, { ref: moved, previousCatalog: previous });
  assert.deepEqual(migrated.records, previous.records);
  assert.deepEqual(migrated.active, previous.active);
  assert.deepEqual(readGitFiles(f.root, moved).get('release-baseline.json').data, baseline);
  manifests('0.1.24');
  f.write('plugins/gt/skills/grill-me/example.txt', 'Nested resource.\n');
  f.write('plugins/gt/skills/grill-me/release.yaml', metadata('1.0.1', 'Nested update.', [entry()]));
  const changed = f.commit('Publish nested skill update');
  const catalog = readReleaseCatalog(f.root, { ref: changed, previousCatalog: previous });
  assert.equal(catalog.active[0].skillPath, 'plugins/gt/skills/grill-me');
  assert.equal(catalog.active[0].sourceTree, f.git('rev-parse', `${changed}:plugins/gt/skills/grill-me`));
});

test('Restore retains old caches and receipts, rejects old plans and exports either layout from a standalone bundle',
  { skip: !(process.platform === 'win32' || /microsoft/i.test(release())) }, t => {
    const f = releaseRepository(t, { later: false });
    const home = join(f.root, 'personal-home');
    mkdirSync(home);
    const target = { environment: process.platform === 'win32' ? 'windows' : 'wsl', home };
    const old = acquireCatalog({ target, checkout: f.root });
    const original = old.catalog.active[0];
    const plan = makePlan({ target, cache: old.cache, skill: original.skill, commit: original.sourceCommit });
    assert.throws(() => executePlan({ target, plan: { ...plan, exporterVersion: '2.0.0' }, portabilityReviewed: true }), /regenerate/);
    const copy = executePlan({ target, plan, portabilityReviewed: true });
    assert.equal(copy.publication, 'complete');
    const receiptPath = join(copy.destination, '.gt-export.json');
    const receipt = JSON.parse(readFileSync(receiptPath));
    receipt.exporterVersion = '2.0.0';
    writeFileSync(receiptPath, JSON.stringify(receipt));
    assert.equal(inspectCopy({ target, personalName: plan.personalName }).integrity, 'matches-receipt');
    // Keep personal state outside tracked fixture content.
    f.write('.gitignore', 'personal-home/\nstandalone/\n');
    const manifests = migrate(f);
    f.commit('Publish relocation');
    manifests('0.1.24');
    f.write('plugins/gt/skills/grill-me/example.txt', 'New nested release.\n');
    f.write('plugins/gt/skills/grill-me/release.yaml', metadata('1.0.1', 'Nested update.', [entry()]));
    const changed = f.commit('Publish nested update');
    f.git('update-ref', 'refs/remotes/origin/main', changed);
    assert.deepEqual(acquireCatalog({ target, offlineCache: old.cache }).catalog, old.catalog);
    const fresh = acquireCatalog({ target, checkout: f.root });
    const newPlan = makePlan({ target, cache: fresh.cache, skill: original.skill, commit: changed });
    assert.equal(newPlan.source.skillPath, 'plugins/gt/skills/grill-me');
    assert.throws(() => executePlan({ target, plan: newPlan, portabilityReviewed: true }), /existing destination|recognizable copy/);
    const newHome = join(f.root, 'new-personal-home');
    mkdirSync(newHome);
    const newTarget = { ...target, home: newHome };
    const newCatalog = acquireCatalog({ target: newTarget, checkout: f.root });
    const isolatedPlan = makePlan({ target: newTarget, cache: newCatalog.cache, skill: original.skill, commit: changed });
    const newCopy = executePlan({ target: newTarget, plan: isolatedPlan, portabilityReviewed: true });
    assert.equal(newCopy.publication, 'complete');
    assert.equal(inspectCopy({ target: newTarget, personalName: newPlan.personalName }).integrity, 'matches-receipt');
    assert.equal(inspectCopy({ target, personalName: plan.personalName }).integrity, 'matches-receipt');
    const standalone = join(f.root, 'standalone');
    cpSync(resolve('plugins/gt/skills/skills-restore'), standalone, { recursive: true });
    for (const commit of [original.sourceCommit, changed]) {
      const output = execFileSync(process.execPath, [join(standalone, 'scripts/exporter/run.mjs'), 'plan', '--environment', target.environment,
        '--home', home, '--cache', fresh.cache, '--skill', original.skill, '--commit', commit], { cwd: home, encoding: 'utf8', windowsHide: true });
      assert.ok(output.includes(commit));
    }
  });
