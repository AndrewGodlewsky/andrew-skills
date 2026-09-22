import assert from 'node:assert/strict';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir, release } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { releaseRepository } from './fixtures/releases.mjs';
import { acquireCatalog, makePlan, executePlan } from './export-protocol.mjs';

const supported = process.platform === 'win32' || /microsoft/i.test(release());
test('list and plan bind a preserved published source in a private cache; altered plans fail', { skip: !supported }, t => {
  const parent = resolve(tmpdir());
  const home = mkdtempSync(join(parent, 'gt-protocol-test-'));
  t.after(() => { assert.equal(dirname(home), parent); assert.ok(home.startsWith(join(parent, 'gt-protocol-test-'))); rmSync(home, { recursive: true, force: true }); });
  const target = { environment: process.platform === 'win32' ? 'windows' : 'wsl', home };
  const fixture = releaseRepository(t);
  const listed = acquireCatalog({ target, checkout: fixture.root });
  assert.ok(listed.catalog.records.length >= 2);
  assert.equal(listed.freshness, 'local-checkout-head; remote freshness unverified');
  const record = listed.catalog.records.find(record => record.skill === 'grill-me');
  const planned = makePlan({ target, cache: listed.cache, skill: record.skill, commit: record.sourceCommit });
  assert.equal(planned.source.sourceTree, record.sourceTree);
  assert.equal(planned.destination, join(realpathSync.native(home), '.copilot/skills/grill-me-v1-0-0'));
  assert.throws(() => executePlan({ target, plan: { ...planned, destination: join(home, 'elsewhere') }, portabilityReviewed: true }), /plan differs/);
  const offline = acquireCatalog({ target, offlineCache: listed.cache });
  assert.equal(offline.catalog.headCommit, listed.catalog.headCommit);
  assert.equal(offline.freshness, 'offline; head may be stale');
});
