import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { closeSync, fsyncSync, fstatSync, lstatSync, linkSync, mkdirSync, mkdtempSync, openSync,
  readFileSync, readdirSync, realpathSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, parse, relative, resolve } from 'node:path';
import { release } from 'node:os';
import { EXPORTER_VERSION, PROTOCOL_VERSION, REPOSITORY, prepareSource, requireExport, sha256, validateSourcePath } from './export-source.mjs';

export const isSecurityError = error => ['EACCES', 'EPERM'].includes(error.code) ||
  /access (?:is )?denied|unauthorizedaccess|authentication|security.policy|4551/i.test(error.message);

export function checkedPath(path, { missing = false, windowsAttributes = true } = {}) {
  const absolute = resolve(path);
  const root = parse(absolute).root;
  let current = root;
  const existing = [root];
  for (const segment of relative(root, absolute).split(/[\\/]/).filter(Boolean)) {
    current = join(current, segment);
    const stat = lstatSync(current, { throwIfNoEntry: false });
    if (!stat) {
      requireExport(missing, `required path is missing: ${current}`);
      break;
    }
    requireExport(!stat.isSymbolicLink(), `linked or redirected path is unsupported: ${current}`);
    existing.push(current);
  }
  if (process.platform === 'win32' && windowsAttributes) {
    execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
      "$ErrorActionPreference='Stop'; [Console]::InputEncoding=[Text.UTF8Encoding]::new(); $items=ConvertFrom-Json ([Console]::In.ReadToEnd()); foreach ($p in $items) { if (((Get-Item -LiteralPath $p -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw ('Unsupported reparse point: ' + $p) } }"],
    { input: JSON.stringify(existing), encoding: 'utf8', windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
  }
  return absolute;
}

export function targetPaths(target) {
  requireExport(target && ['windows', 'wsl'].includes(target.environment) && typeof target.home === 'string' &&
    isAbsolute(target.home), 'explicit Windows/WSL target and absolute home are required');
  requireExport((target.environment === 'windows') === (process.platform === 'win32'), 'target environment does not match this process');
  requireExport(target.environment !== 'wsl' || (process.platform === 'linux' && /microsoft/i.test(release())), 'WSL requires a process running inside the selected WSL distribution');
  requireExport(!target.home.startsWith('\\\\'), 'network/extended Windows paths are unsupported');
  const home = realpathSync.native(checkedPath(target.home));
  requireExport(lstatSync(home).isDirectory(), 'target home must already be a directory');
  return { home: realpathSync.native(home), skills: join(home, '.copilot', 'skills'), work: join(home, '.copilot', 'gt-export-work') };
}

export function ensureDirectory(path) {
  if (!lstatSync(path, { throwIfNoEntry: false })) {
    ensureDirectory(dirname(path));
    try { mkdirSync(path, { mode: 0o700 }); } catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
  checkedPath(path, { windowsAttributes: false });
  requireExport(lstatSync(path).isDirectory(), `required directory is occupied: ${path}`);
}

function identity(path) {
  checkedPath(path, { windowsAttributes: false });
  const stat = lstatSync(path);
  requireExport(stat.isDirectory(), `not a regular directory: ${path}`);
  return `${stat.dev}:${stat.ino}`;
}

function sameDirectory(path, expected) {
  requireExport(identity(path) === expected, `directory identity changed: ${path}`);
}

function writeExclusive(path, data, mode = '100644') {
  checkedPath(dirname(path), { windowsAttributes: false });
  const fd = openSync(path, 'wx', mode === '100755' ? 0o700 : 0o600);
  try {
    requireExport(fstatSync(fd).isFile(), `not a regular destination file: ${path}`);
    writeFileSync(fd, data);
    fsyncSync(fd);
  } finally { closeSync(fd); }
}

export function checkCopies(paths, record, personalName) {
  checkedPath(paths.skills, { missing: true });
  if (!lstatSync(paths.skills, { throwIfNoEntry: false })) return;
  requireExport(lstatSync(paths.skills).isDirectory(), 'personal skills root is not a directory');
  for (const name of readdirSync(paths.skills)) {
    const candidate = join(paths.skills, name);
    const matching = name.toLowerCase() === personalName.toLowerCase() ||
      new RegExp(`^${record.skill}-v\\d+-\\d+-\\d+$`, 'i').test(name);
    requireExport(!matching, `existing destination or recognizable copy: ${candidate}`);
    const stat = lstatSync(candidate);
    requireExport(!stat.isSymbolicLink(), `redirected personal package prevents collision verification: ${candidate}`);
    if (!stat.isDirectory()) continue;
    checkedPath(candidate);
    const receiptPath = join(candidate, '.gt-export.json');
    if (!lstatSync(receiptPath, { throwIfNoEntry: false })) continue;
    checkedPath(receiptPath);
    let receipt;
    try { receipt = JSON.parse(readFileSync(receiptPath, 'utf8')); }
    catch (error) { if (isSecurityError(error)) throw error; throw new Error(`Export stopped: malformed export receipt: ${receiptPath}`); }
    requireExport(receipt?.source && typeof receipt.source.repository === 'string' && typeof receipt.source.skill === 'string',
      `malformed export receipt: ${receiptPath}`);
    requireExport(!(receipt.source.repository === record.repository && receipt.source.skill === record.skill),
      `recognizable previous personal copy: ${candidate}`);
  }
}

function removeStage(stage, expectedIdentity, files) {
  checkedPath(stage);
  sameDirectory(stage, expectedIdentity);
  const parents = new Set();
  for (const path of files) {
    const absolute = resolve(stage, path);
    requireExport(relative(stage, absolute) && !relative(stage, absolute).startsWith('..'), 'private cleanup escaped stage');
    checkedPath(absolute);
    unlinkSync(absolute);
    let parent = dirname(absolute);
    while (parent !== stage) { parents.add(parent); parent = dirname(parent); }
  }
  for (const parent of [...parents].sort((a, b) => b.length - a.length)) rmdirSync(parent);
  rmdirSync(stage);
}

export function createCopy({ record, files, target, portabilityReviewed, onProgress = () => {} }) {
  const prepared = prepareSource(record, files, { portabilityReviewed });
  const paths = targetPaths(target);
  const destination = join(paths.skills, prepared.personalName);
  for (const path of prepared.files.keys()) requireExport(join(destination, path).length <= (process.platform === 'win32' ? 240 : 4000),
    `destination path is too long: ${path}`);
  checkCopies(paths, record, prepared.personalName);
  ensureDirectory(paths.work);
  ensureDirectory(paths.skills);
  checkedPath(paths.work); checkedPath(paths.skills);
  requireExport(lstatSync(paths.work).dev === lstatSync(paths.skills).dev, 'staging and destination must use the same filesystem');
  const skillsIdentity = identity(paths.skills);
  const lockKey = sha256(`${record.repository}\n${record.skill}\n${process.platform === 'win32' ? paths.home.toLowerCase() : paths.home}`);
  const lock = join(paths.work, `${lockKey}.lock`);
  try { mkdirSync(lock, { mode: 0o700 }); }
  catch (error) { if (error.code === 'EEXIST') throw new Error(`Export busy: lock exists at ${lock}; no lock is stolen`); throw error; }
  const lockIdentity = identity(lock);
  const operationId = randomUUID();
  let publication = 'not-created';
  let stage;
  let run;
  let securityStop = false;
  let failure;
  try {
    writeExclusive(join(lock, 'owner.json'), JSON.stringify({ schemaVersion: 1, operationId, source: record.skill, repository: record.repository }));
    onProgress('locked');
    run = mkdtempSync(join(paths.work, 'run-'));
    stage = join(run, 'stage');
    mkdirSync(stage, { mode: 0o700 });
    const stageIdentity = identity(stage);
    writeExclusive(join(run, 'operation.json'), JSON.stringify({ protocolVersion: PROTOCOL_VERSION, operationId, destination, source: record }));
    const receipt = { schemaVersion: 2, exporterVersion: EXPORTER_VERSION, operationId, createdAt: new Date().toISOString(),
      source: { repository: record.repository, skill: record.skill, version: record.version, commit: record.sourceCommit,
        path: record.skillPath, tree: record.sourceTree, contentIdentity: record.contentIdentity, period: record.period, history: record.history, notes: record.notes, files: prepared.sourceFiles },
      installed: { name: prepared.personalName, transform: 'frontmatter-name-v1', files: prepared.installedFiles } };
    const staged = new Map(prepared.files);
    staged.set('.gt-export.json', { mode: '100644', data: Buffer.from(JSON.stringify(receipt, null, 2) + '\n') });
    for (const [path, file] of staged) {
      requireExport(join(stage, path).length <= (process.platform === 'win32' ? 240 : 4000), `staging path is too long: ${path}`);
      ensureDirectory(dirname(join(stage, path)));
      writeExclusive(join(stage, path), file.data, file.mode);
      verifyFile(join(stage, path), file);
    }
    const probe = join(run, '.link-probe');
    linkSync(join(stage, 'SKILL.md'), probe);
    unlinkSync(probe);
    onProgress('staged');
    sameDirectory(paths.skills, skillsIdentity);
    checkCopies(paths, record, prepared.personalName);
    mkdirSync(destination, { mode: 0o700 });
    publication = 'incomplete';
    const destinationIdentity = identity(destination);
    onProgress('reserved');
    for (const [path, file] of staged) {
      if (path === 'SKILL.md') continue;
      sameDirectory(destination, destinationIdentity);
      ensureDirectory(dirname(join(destination, path)));
      writeExclusive(join(destination, path), file.data, file.mode);
      verifyFile(join(destination, path), file);
    }
    onProgress('resources-written');
    checkedPath(destination);
    sameDirectory(paths.skills, skillsIdentity);
    sameDirectory(destination, destinationIdentity);
    for (const [path, file] of staged) {
      if (path === 'SKILL.md') continue;
      checkedPath(join(destination, path));
      verifyFile(join(destination, path), file);
    }
    sameDirectory(stage, stageIdentity);
    checkedPath(join(stage, 'SKILL.md'));
    verifyFile(join(stage, 'SKILL.md'), prepared.files.get('SKILL.md'));
    linkSync(join(stage, 'SKILL.md'), join(destination, 'SKILL.md'));
    publication = 'complete';
    onProgress('published');
    removeStage(stage, stageIdentity, staged.keys());
    return { protocolVersion: PROTOCOL_VERSION, publication, operationId, destination, source: record,
      intendedCommand: `/${prepared.personalName}`, activation: 'not-verified', diagnostics: run };
  } catch (error) {
    failure = error;
    securityStop = isSecurityError(error);
    error.exportOutcome = { publication, operationId, destination: publication === 'not-created' ? null : destination, diagnostics: run, lock, securityStop };
    throw error;
  } finally {
    if (!securityStop) {
      try {
        sameDirectory(lock, lockIdentity);
        const owner = join(lock, 'owner.json');
        if (lstatSync(owner, { throwIfNoEntry: false })) unlinkSync(owner);
        rmdirSync(lock);
      } catch (error) {
        const outcome = { publication, operationId, destination, diagnostics: run, lock, securityStop: isSecurityError(error), cleanupError: error.message };
        if (failure) Object.assign(failure.exportOutcome, outcome);
        else { error.exportOutcome = outcome; throw error; }
      }
    }
  }
}

function verifyFile(path, file) {
  const stat = lstatSync(path);
  requireExport(stat.isFile() && !stat.isSymbolicLink() && readFileSync(path).equals(file.data) &&
    (process.platform === 'win32' || Boolean(stat.mode & 0o111) === (file.mode === '100755')), `file verification failed: ${path}`);
}

export function inspectCopy({ target, personalName }) {
  requireExport(typeof personalName === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*-v\d+-\d+-\d+$/.test(personalName) && personalName.length <= 64,
    'a canonical personal name is required for inspection');
  const paths = targetPaths(target);
  const destination = join(paths.skills, personalName);
  const sourceName = personalName.replace(/-v\d+-\d+-\d+$/, '');
  const key = sha256(`${REPOSITORY}\n${sourceName}\n${process.platform === 'win32' ? paths.home.toLowerCase() : paths.home}`);
  const lockPath = join(paths.work, `${key}.lock`);
  checkedPath(lockPath, { missing: true });
  const lock = lstatSync(lockPath, { throwIfNoEntry: false }) ? { path: lockPath, state: 'present; ownership and liveness unknown; never stolen' } : null;
  checkedPath(destination, { missing: true });
  if (!lstatSync(destination, { throwIfNoEntry: false })) return { publication: 'not-created', destination, lock };
  requireExport(lstatSync(destination).isDirectory(), 'destination is occupied by a non-directory');
  const root = join(destination, 'SKILL.md');
  if (!lstatSync(root, { throwIfNoEntry: false })) return { publication: 'incomplete', destination, lock, integrity: 'unverifiable' };
  checkedPath(root);
  const result = { publication: 'unverified', destination, lock, integrity: 'unverifiable', provenance: 'unverified-receipt', activation: 'not-verified' };
  const receiptPath = join(destination, '.gt-export.json');
  if (!lstatSync(receiptPath, { throwIfNoEntry: false })) return result;
  checkedPath(receiptPath);
  let receipt;
  try { receipt = JSON.parse(readFileSync(receiptPath, 'utf8')); } catch (error) { if (isSecurityError(error)) throw error; return result; }
  if (receipt?.schemaVersion !== 2 || receipt.exporterVersion !== EXPORTER_VERSION || receipt.installed?.name !== personalName || receipt.installed?.transform !== 'frontmatter-name-v1' ||
    receipt.source?.repository !== REPOSITORY || !Array.isArray(receipt.installed.files) ||
    typeof receipt.source.skill !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(receipt.source.skill) ||
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(receipt.source.version) ||
    `${receipt.source.skill}-v${receipt.source.version.replaceAll('.', '-')}` !== personalName ||
    receipt.source.path !== `skills/${receipt.source.skill}` ||
    !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(receipt.source.commit) ||
    !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(receipt.source.tree) ||
    !Array.isArray(receipt.source.files) || typeof receipt.exporterVersion !== 'string' || typeof receipt.operationId !== 'string') return result;
  const seen = new Set();
  for (const file of receipt.installed.files) {
    try { validateSourcePath(file?.path); } catch { return result; }
    if (seen.has(file.path) || !/^[a-f0-9]{64}$/.test(file.sha256) || !['100644', '100755'].includes(file.sourceMode)) return result;
    seen.add(file.path);
    const path = join(destination, file.path);
    checkedPath(path, { missing: true });
    const stat = lstatSync(path, { throwIfNoEntry: false });
    if (!stat?.isFile() || sha256(readFileSync(path)) !== file.sha256 ||
      (process.platform !== 'win32' && Boolean(stat.mode & 0o111) !== (file.sourceMode === '100755'))) return { ...result, integrity: 'modified' };
  }
  if (!seen.has('SKILL.md') || !seen.has('release.yaml')) return result;
  function inventory(path, prefix = '') {
    const observed = [];
    for (const name of readdirSync(path)) {
      const child = join(path, name);
      checkedPath(child);
      const stat = lstatSync(child);
      if (stat.isDirectory()) observed.push(...inventory(child, `${prefix}${name}/`));
      else observed.push(`${prefix}${name}`);
    }
    return observed;
  }
  if (inventory(destination).some(path => path !== '.gt-export.json' && !seen.has(path))) return { ...result, integrity: 'modified' };
  return { ...result, publication: 'complete', integrity: 'matches-receipt', source: receipt.source };
}
