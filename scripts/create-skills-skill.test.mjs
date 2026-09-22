import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
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
  const notice = pkg.files.get('assets/matt-pocock-license.txt').data.toString('utf8');
  // The reviewed CRLF source hashes to 4981c5f6...; Git checks it out as LF
  // on Linux. Normalize line endings only, retaining every license character.
  const normalized = notice.replace(/\r\n/g, '\n');
  assert.equal(createHash('sha256').update(normalized).digest('hex'),
    '0e7ac423bf2c6e223b7c5b156f8cf72da49d748e56a1641402c31f22ad07dbb5');
});
