// Disposable compatibility experiment; does not publish or implement a version manager.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = process.argv[2];
const mode = process.argv[3] ?? 'local';
if (!root || !path.isAbsolute(root)) throw new Error('Supply an absolute disposable test directory');
const cli = path.join(root, 'runtime', 'copilot.exe');
const runName = process.argv[4] ?? mode;
if (!/^[a-z0-9-]+$/.test(runName)) throw new Error('Run name must be a single directory name');
const lane = path.join(root, runName);
const config = path.join(lane, 'config');
const cache = path.join(lane, 'cache');
const output = path.join(lane, 'results.json');
if (fs.existsSync(output)) throw new Error('Use a fresh run name to preserve prior evidence');
const results = [];
fs.mkdirSync(lane, { recursive: true });
const env = { ...process.env, COPILOT_HOME: config, COPILOT_CACHE_HOME: cache, COPILOT_AUTO_UPDATE: 'false' };
function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2));
}
function record(label, data) {
  results.push({ label, ...data });
  write(output, { platform: os.platform(), osRelease: os.release(), cli, results });
  console.log(JSON.stringify({ label, ...data }));
}
function run(args, jsonSkills = false) {
  const r = spawnSync(cli, args, { cwd: lane, env, encoding: 'utf8', timeout: 60000, windowsHide: true });
  let stdout = r.stdout ?? '';
  const stderr = r.stderr ?? '';
  const security = /access (?:is )?denied|permission denied|os error 4551|security policy|authentication failed|unauthorized|firewall/i.test(stdout + stderr + (r.error?.message ?? ''));
  if (jsonSkills && r.status === 0) stdout = JSON.parse(stdout).filter(s => s.name.includes('wf-'));
  record(args.join(' '), { status: r.status, stdout, stderr, error: r.error?.message });
  if (security) throw new Error('Security stop: review the captured error before proceeding');
  if (r.error) throw r.error;
  return { status: r.status, stdout, stderr };
}
function digest(folder) {
  const files = {};
  function walk(current) {
    for (const ent of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) walk(full);
      else files[path.relative(folder, full).replaceAll('\\', '/')] = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
    }
  }
  walk(folder);
  return files;
}
function skill(base, name, version) {
  write(path.join(base, name, 'SKILL.md'), `---\nname: ${name}\ndescription: Disposable compatibility fixture ${version}.\nmetadata:\n  version: "${version}"\n---\n\nReport marker ${name}-${version}. Read [resource](resources/marker.txt) and report its marker.\n`);
  write(path.join(base, name, 'resources', 'marker.txt'), `${name}-resource-${version}\n`);
  write(path.join(base, name, 'release-notes.md'), `Fixture ${version}. This is synthetic test content.\n`);
}
function plugin(folder, names, version) {
  write(path.join(folder, 'plugin.json'), { name: path.basename(folder), version, description: 'Disposable compatibility fixture' });
  for (const name of names) skill(path.join(folder, 'skills'), name, version);
}
function inventory() { return run(['skill', 'list', '--json'], true).stdout; }
function moveEvidence(from, to) {
  const allowed = fs.realpathSync(lane) + path.sep;
  if (!fs.realpathSync(from).startsWith(allowed) || !path.resolve(to).startsWith(allowed)) throw new Error('Move outside disposable lane');
  fs.renameSync(from, to);
}

run(['--version']);
if (mode === 'local') {
  const market = path.join(lane, 'market');
  const bundle = path.join(market, 'bundle');
  const extra = path.join(market, 'extra');
  plugin(bundle, ['wf-alpha', 'wf-beta'], '1.0.0');
  plugin(extra, ['wf-alpha'], '2.0.0');
  write(path.join(market, '.claude-plugin', 'marketplace.json'), {
    name: 'wf-local', owner: { name: 'Compatibility experiment' },
    plugins: [{ name: 'bundle', source: './bundle', version: '1.0.0' }, { name: 'extra', source: './extra', version: '2.0.0' }],
  });
  run(['plugin', 'marketplace', 'add', market]);
  run(['plugin', 'install', 'bundle@wf-local']);
  const initial = inventory();
  const alpha = initial.find(s => s.name === 'wf-alpha');
  const beta = initial.find(s => s.name === 'wf-beta');
  if (!alpha || !beta) throw new Error('Fixture skills not discovered');
  record('initial-directory-hashes', { alpha: digest(alpha.path), beta: digest(beta.path) });
  const personal = path.join(config, 'skills', 'wf-alpha');
  fs.cpSync(alpha.path, personal, { recursive: true, errorOnExist: true, force: false });
  record('retained-complete-snapshot', { hashes: digest(personal) });
  inventory();
  plugin(bundle, ['wf-alpha', 'wf-beta'], '2.0.0');
  record('source-mutated-before-update', { discovered: inventory() });
  run(['plugin', 'marketplace', 'update', 'wf-local']);
  run(['plugin', 'update', '--all']);
  inventory();
  record('after-update-hashes', { personal: digest(personal), pluginAlpha: digest(alpha.path), pluginBeta: digest(beta.path) });
  run(['plugin', 'install', 'extra@wf-local']);
  inventory();
  // Retain collision evidence without overwriting an existing personal directory.
  try { fs.cpSync(path.join(extra, 'skills', 'wf-alpha'), personal, { recursive: true, errorOnExist: true, force: false }); }
  catch (error) {
    record('collision-copy-refused', { code: error.code, message: error.message });
    if (error.code !== 'ERR_FS_CP_EEXIST' && !(error.errno === 80 && error.message.includes('The file exists.'))) throw error;
  }
  // Rename within this disposable lane to simulate clearing a hold, preserving evidence.
  moveEvidence(personal, path.join(lane, 'retained-alpha-evidence'));
  inventory();
  moveEvidence(path.join(lane, 'retained-alpha-evidence'), personal);
  // Retirement: personal directory exists before removing the owning plugin.
  run(['plugin', 'uninstall', 'bundle@wf-local']);
  inventory();
  record('after-retirement-personal-hashes', { hashes: digest(personal) });
} else if (mode === 'external') {
  const market = path.join(lane, 'market');
  const catalog = path.join(market, 'marketplace.json');
  const releases = [
    ['0.1.2', '0c2f8d05932a21dcf6eb267406a751c634931896'],
    ['0.1.3', 'b144bd105bf125b78bf95b6fc229e2cb9d4ff493'],
    ['0.1.2', '0c2f8d05932a21dcf6eb267406a751c634931896'],
  ];
  for (let i = 0; i < releases.length; i++) {
    const [version, sha] = releases[i];
    write(catalog, { name: 'wf-external', owner: { name: 'Compatibility experiment' }, plugins: [
      { name: 'gt', version, source: { source: 'github', repo: 'AndrewGodlewsky/andrew-skills', sha } },
    ] });
    if (i === 0) {
      run(['plugin', 'marketplace', 'add', market]);
      run(['plugin', 'install', 'gt@wf-external']);
    } else {
      run(['plugin', 'marketplace', 'update', 'wf-external']);
      run(['plugin', 'update', 'gt@wf-external']);
    }
    run(['plugin', 'list']);
    const installed = path.join(config, 'installed-plugins', 'wf-external', 'gt');
    if (fs.existsSync(installed)) record('external-installed-hashes', { requestedSha: sha, files: digest(installed) });
  }
} else throw new Error('Unknown mode');
