import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { posix, resolve } from 'node:path';
import { readPackage, checkPackage } from './create-skills/package.mjs';

test('distributed creator has valid metadata and every inline resource pointer resolves within its package', () => {
  const pkg = readPackage(resolve('skills/create-skills'));
  assert.equal(checkPackage(pkg).status, 'passed');
  for (const [path, file] of pkg.files) {
    if (!path.endsWith('.md')) continue;
    const body = file.data.toString('utf8');
    for (const match of body.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1]; if (/^(https?:|#)/.test(target)) continue;
      const resource = posix.normalize(posix.join(posix.dirname(path), target.split('#')[0]));
      assert.ok(!resource.startsWith('../') && pkg.files.has(resource), `${path}: ${target}`);
    }
  }
});

test('bundled Matt notice matches the pinned reviewed MIT source', () => {
  const pkg = readPackage(resolve('skills/create-skills'));
  const notice = checkPackage(pkg).manifest.find(x => x.path === 'assets/matt-pocock-license.txt');
  assert.equal(notice.sha256, '4981c5f6a90eb3a969dacabb9350f5a75695ff3910b39b6534952908dfdc5ff7');
  assert.match(readFileSync('skills/create-skills/release.yaml', 'utf8'), /version: "1\.0\.0"/);
});
