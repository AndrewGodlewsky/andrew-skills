import { closeSync, constants, fchmodSync, fstatSync, linkSync, lstatSync, mkdirSync, openSync, unlinkSync, writeSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { homedir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { checkPackage, readPackage, regularDirectory } from './package.mjs';

function sameFile(a, b) { return a.dev === b.dev && a.ino === b.ino; }
function exists(path) {
  try { return lstatSync(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

export function installPackage(request, { home = homedir() } = {}) {
  let destination, pendingFile; const written = []; const createdDirectories = [];
  try {
    if (!request || typeof request !== 'object' || Array.isArray(request)) throw new Error('Expected installation request.');
    for (const key of Object.keys(request)) if (!['packageDirectory', 'approved', 'expectedIdentity'].includes(key)) throw new Error(`Unknown installation field: ${key}`);
    if (request.approved !== true) return { status: 'not_installed', detail: 'Personal installation requires the user’s explicit yes.' };
    if (typeof request.packageDirectory !== 'string' || !/^[a-f0-9]{64}$/.test(request.expectedIdentity ?? '')) throw new Error('Selected package and checked input identity are required.');
    const pkg = readPackage(request.packageDirectory);
    const report = checkPackage(pkg);
    if (report.identity !== request.expectedIdentity) return { status: 'conflict', detail: 'Draft bytes changed since checking; review and check again before installation.', report };
    if (report.status !== 'passed') return { status: 'not_installed', detail: 'Package has structural defects; issue submission remains valid.', report };
    const userHome = regularDirectory(resolve(home));
    const homeStat = lstatSync(userHome);
    function guardedDirectory(path, create = false) {
      const rel = relative(userHome, path);
      if (rel === '..' || rel.startsWith('..\\') || rel.startsWith('../') || resolve(userHome, rel) !== path) throw new Error('Destination escapes the selected home.');
      if (!sameFile(homeStat, lstatSync(userHome))) throw new Error('User home changed during installation.');
      if (!exists(path)) {
        if (!create) throw new Error('Destination parent disappeared.');
        regularDirectory(dirname(path));
        mkdirSync(path); createdDirectories.push(path);
      }
      return regularDirectory(path);
    }
    const copilot = join(userHome, '.copilot'), skills = join(copilot, 'skills');
    guardedDirectory(copilot, true); guardedDirectory(skills, true);
    destination = join(skills, pkg.name);
    if (exists(destination)) return { status: 'conflict', destination, detail: 'Personal destination already exists; nothing replaced.', written, createdDirectories };
    mkdirSync(destination); createdDirectories.push(destination);
    const destinationStat = lstatSync(destination);
    // Publish SKILL.md last so discovery does not see a known incomplete copy.
    const files = [...pkg.files].sort(([a], [b]) => a === 'SKILL.md' ? 1 : b === 'SKILL.md' ? -1 : a.localeCompare(b));
    for (const [path, file] of files) {
      guardedDirectory(destination);
      if (!sameFile(destinationStat, lstatSync(destination))) throw new Error('Destination changed during installation.');
      let parent = destination;
      for (const segment of path.split('/').slice(0, -1)) { parent = join(parent, segment); guardedDirectory(parent, true); }
      guardedDirectory(parent);
      const published = join(destination, ...path.split('/'));
      const target = path === 'SKILL.md' ? join(destination, `.gt-create-skills-${randomUUID()}.tmp`) : published;
      pendingFile = target;
      const fd = openSync(target, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (constants.O_NOFOLLOW ?? 0), file.mode === '100755' ? 0o755 : 0o644);
      let opened;
      try {
        opened = fstatSync(fd);
        if (!opened.isFile() || opened.nlink !== 1 || !sameFile(opened, lstatSync(target))) throw new Error('Destination file identity changed.');
        let offset = 0;
        while (offset < file.data.length) {
          const count = writeSync(fd, file.data, offset, file.data.length - offset);
          if (!count) throw new Error('Incomplete file write.');
          offset += count;
        }
        if (process.platform !== 'win32') fchmodSync(fd, file.mode === '100755' ? 0o755 : 0o644);
        guardedDirectory(parent);
        if (!sameFile(opened, lstatSync(target))) throw new Error('Destination file identity changed.');
      } finally { closeSync(fd); }
      if (path === 'SKILL.md') {
        // Atomic no-replace publication: a competing root is never overwritten,
        // and interruption during the write leaves no partial discoverable root.
        guardedDirectory(destination);
        if (!sameFile(destinationStat, lstatSync(destination)) || !sameFile(opened, lstatSync(target))) throw new Error('Publication path changed.');
        linkSync(target, published);
        if (!sameFile(opened, lstatSync(published)) || !sameFile(opened, lstatSync(target))) throw new Error('Published file identity changed.');
        unlinkSync(target);
      }
      pendingFile = undefined;
      written.push(path);
    }
    const installed = readPackage(destination);
    // Windows does not preserve POSIX executable bits; verify content directly.
    for (const [path, file] of pkg.files) if (!installed.files.get(path)?.data.equals(file.data)) throw new Error(`Installed bytes differ: ${path}`);
    if (installed.files.size !== pkg.files.size) throw new Error('Unexpected installed files.');
    return { status: 'installed', destination, identity: report.identity, written, discovery: 'not_verified', behavior: 'not_verified' };
  } catch (error) {
    return { status: ['EACCES', 'EPERM'].includes(error.code) ? 'security_stop' : destination && createdDirectories.includes(destination) ? 'partial' : 'not_installed',
      destination, written, createdDirectories, pendingFile, detail: error.message,
      cleanup: 'No automatic deletion or retry. Inspect task-owned partial files and preserve unrelated content.' };
  }
}
