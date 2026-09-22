import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { installPackage } from './create-skills/install.mjs';
import { checkDirectory } from './create-skills/package.mjs';

function setup(t) {
  const base = fs.mkdtempSync(join(tmpdir(), 'gt-personal-'));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const home = join(base, 'user'), root = join(base, 'meeting-actions');
  fs.mkdirSync(home); fs.mkdirSync(root); fs.mkdirSync(join(root, 'references'));
  fs.writeFileSync(join(root, 'SKILL.md'), '---\nname: meeting-actions\ndescription: Extract explicit commitments.\nuser-invocable: true\ndisable-model-invocation: true\n---\nRead [format](references/format.md) and extract supplied actions.\n');
  fs.writeFileSync(join(root, 'release.yaml'), 'version: "1.0.0"\nnotes: "Extract explicit actions."\nperiod: 1\nhistory: []\n');
  fs.writeFileSync(join(root, 'references/format.md'), 'Action | Owner | Due\n');
  const request = { packageDirectory: root, expectedIdentity: checkDirectory(root).identity, approved: true };
  return { home, root, request, destination: join(home, '.copilot/skills/meeting-actions') };
}
test('declined installation performs no filesystem writes', t => {
  const { home, request } = setup(t);
  assert.equal(installPackage({ ...request, approved: false }, { home }).status, 'not_installed');
  assert.deepEqual(fs.readdirSync(home), []);
});
test('ordinary-name installation copies all resources, verifies bytes and preserves collisions', t => {
  const { home, root, request, destination } = setup(t);
  const result = installPackage(request, { home });
  assert.equal(result.status, 'installed', JSON.stringify(result));
  assert.equal(result.destination, fs.realpathSync.native(destination));
  assert.equal(result.written.at(-1), 'SKILL.md');
  assert.equal(result.discovery, 'not_verified');
  assert.deepEqual(fs.readFileSync(join(destination, 'references/format.md')), fs.readFileSync(join(root, 'references/format.md')));
  fs.writeFileSync(join(destination, 'owner-file.txt'), 'preserve');
  assert.equal(installPackage(request, { home }).status, 'conflict');
  assert.equal(fs.readFileSync(join(destination, 'owner-file.txt'), 'utf8'), 'preserve');
});
test('changed input and missing resources prevent installation but do not erase artifacts', t => {
  const { home, root, request } = setup(t);
  fs.writeFileSync(join(root, 'references/format.md'), 'changed');
  assert.equal(installPackage(request, { home }).status, 'conflict');
  fs.rmSync(join(root, 'references/format.md'));
  request.expectedIdentity = checkDirectory(root).identity;
  assert.equal(installPackage(request, { home }).status, 'not_installed');
  assert.deepEqual(fs.readdirSync(home), []);
});
test('a redirected destination parent is not followed', t => {
  const { home, root, request } = setup(t);
  fs.symlinkSync(root, join(home, '.copilot'), process.platform === 'win32' ? 'junction' : 'dir');
  const result = installPackage(request, { home });
  assert.equal(result.status, 'not_installed');
  assert.match(result.detail, /Unsupported directory/);
  assert.equal(fs.existsSync(join(root, 'skills')), false);
});
test('an interrupted write preserves a visible partial destination without publishing SKILL.md', t => {
  const { home, request, destination } = setup(t);
  const original = fs.writeSync;
  fs.writeSync = () => { throw Object.assign(new Error('simulated disk failure'), { code: 'EIO' }); };
  syncBuiltinESMExports();
  let result;
  try { result = installPackage(request, { home }); }
  finally { fs.writeSync = original; syncBuiltinESMExports(); }
  assert.equal(result.status, 'partial');
  assert.equal(fs.existsSync(destination), true);
  assert.equal(fs.existsSync(join(destination, 'SKILL.md')), false);
  assert.equal(installPackage(request, { home }).status, 'conflict');
});
test('simulated permission denial remains a security stop and never selects another home', t => {
  const { home, request } = setup(t);
  const original = fs.mkdirSync;
  fs.mkdirSync = () => { throw Object.assign(new Error('simulated denied mkdir'), { code: 'EACCES' }); };
  syncBuiltinESMExports();
  let result;
  try { result = installPackage(request, { home }); }
  finally { fs.mkdirSync = original; syncBuiltinESMExports(); }
  assert.equal(result.status, 'security_stop');
  assert.deepEqual(fs.readdirSync(home), []);
});
test('request data cannot choose another home or bypass a missing approval', t => {
  const { home, request } = setup(t);
  assert.equal(installPackage({ ...request, home: 'elsewhere' }, { home }).status, 'not_installed');
  assert.equal(installPackage({ ...request, approved: undefined }, { home }).status, 'not_installed');
  assert.deepEqual(fs.readdirSync(home), []);
});

test('failure while writing root instructions does not expose a truncated discoverable skill', t => {
  const { home, request, destination } = setup(t);
  const original = fs.writeSync;
  fs.writeSync = (fd, data, ...args) => {
    if (data.toString('utf8').startsWith('---')) {
      original(fd, data, 0, 4);
      throw Object.assign(new Error('simulated root-write interruption'), { code: 'EIO' });
    }
    return original(fd, data, ...args);
  };
  syncBuiltinESMExports();
  let result;
  try { result = installPackage(request, { home }); }
  finally { fs.writeSync = original; syncBuiltinESMExports(); }
  assert.equal(result.status, 'partial');
  assert.equal(fs.existsSync(join(destination, 'SKILL.md')), false);
  assert.ok(result.pendingFile.endsWith('.tmp'));
});

test('atomic publication preserves a competing root instruction file', t => {
  const { home, request, destination } = setup(t);
  const original = fs.linkSync;
  fs.linkSync = (source, target) => { fs.writeFileSync(target, 'owner-created root', { flag: 'wx' }); return original(source, target); };
  syncBuiltinESMExports();
  let result;
  try { result = installPackage(request, { home }); }
  finally { fs.linkSync = original; syncBuiltinESMExports(); }
  assert.equal(result.status, 'partial');
  assert.equal(fs.readFileSync(join(destination, 'SKILL.md'), 'utf8'), 'owner-created root');
});
