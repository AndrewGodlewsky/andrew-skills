import { constants, closeSync, fstatSync, lstatSync, openSync, readSync, readdirSync, realpathSync } from 'node:fs';
import { basename, dirname, join, parse, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { validateSkill } from './skill-package-validation.mjs';

export const limits = Object.freeze({ files: 100, fileBytes: 2 * 1024 * 1024, totalBytes: 8 * 1024 * 1024, depth: 12 });
export const rulesVersion = '2.0.0';
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const validName = name => typeof name === 'string' && name.length <= 64 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);
export function safeSegment(name) {
  return typeof name === 'string' && name.length > 0 && !/[<>:"/\\|?*\x00-\x1f]/.test(name)
    && !/[. ]$/.test(name) && !/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name);
}
export function regularDirectory(path) {
  const absolute = resolve(path);
  const root = parse(absolute).root;
  let current = root;
  for (const part of absolute.slice(root.length).split(/[\\/]/).filter(Boolean)) {
    current = join(current, part);
    const stat = lstatSync(current);
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Unsupported directory: ${current}`);
  }
  return realpathSync.native(absolute);
}
function identity(stat) { return `${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}`; }

// Reads bytes only. Scripts and imports in the selected package are never executed.
export function readPackage(root) {
  const absolute = resolve(root);
  regularDirectory(dirname(absolute));
  const base = regularDirectory(absolute);
  const name = basename(absolute);
  if (!validName(name)) throw new Error('Package directory must be a kebab-case skill name (up to 64 characters).');
  const files = new Map();
  const seen = new Set();
  let bytes = 0;
  let entries = 0;
  function visit(directory, prefix = '', depth = 0) {
    if (depth > limits.depth) throw new Error('Package directory depth exceeds limit.');
    const initial = lstatSync(directory);
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
      if (++entries > limits.files * 2) throw new Error('Package entry count exceeds limit.');
      if (!safeSegment(entry.name)) throw new Error(`Unsupported package path: ${entry.name}`);
      const relative = prefix + entry.name;
      const folded = relative.toLowerCase();
      if (seen.has(folded)) throw new Error(`Case-colliding package path: ${relative}`);
      seen.add(folded);
      const path = join(directory, entry.name);
      regularDirectory(directory);
      const before = lstatSync(path);
      if (before.isSymbolicLink()) throw new Error(`Redirected package entry: ${relative}`);
      if (before.isDirectory()) { visit(path, `${relative}/`, depth + 1); continue; }
      if (!before.isFile() || before.nlink !== 1) throw new Error(`Unsupported package entry: ${relative}`);
      if (files.size >= limits.files || before.size > limits.fileBytes || bytes + before.size > limits.totalBytes) throw new Error('Package file/byte limit exceeded.');
      const fd = openSync(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
      let data;
      try {
        const opened = fstatSync(fd);
        if (!opened.isFile() || identity(before) !== identity(opened)) throw new Error(`Package changed while reading: ${relative}`);
        // Bounded allocation and read even when another process grows the file.
        data = Buffer.alloc(before.size);
        let offset = 0;
        while (offset < data.length) {
          const count = readFileChunk(fd, data, offset);
          if (!count) throw new Error(`Package changed while reading: ${relative}`);
          offset += count;
        }
        if (identity(opened) !== identity(fstatSync(fd)) || identity(before) !== identity(lstatSync(path))) throw new Error(`Package changed while reading: ${relative}`);
      } finally { closeSync(fd); }
      bytes += data.length;
      files.set(relative, { data, mode: before.mode & 0o111 ? '100755' : '100644' });
    }
    regularDirectory(directory);
    if (identity(initial) !== identity(lstatSync(directory))) throw new Error('Package directory changed while reading.');
  }
  visit(base);
  return { name, root: base, files };
}

function readFileChunk(fd, data, offset) { return readSync(fd, data, offset, data.length - offset, offset); }

export function checkPackage(pkg) {
  const manifest = [...pkg.files].map(([path, file]) => ({ path, bytes: file.data.length, mode: file.mode, sha256: sha256(file.data) }));
  const files = new Map([...pkg.files].map(([path, file]) => [`skills/${pkg.name}/${path}`, file]));
  let status = 'passed';
  const diagnostics = [];
  try { validateSkill(files, pkg.name); }
  catch (error) { status = 'failed'; diagnostics.push(error.message); }
  return { version: 1, rulesVersion, name: pkg.name, status, diagnostics, manifest,
    identity: sha256(JSON.stringify(manifest)),
    coverage: 'GT header/release format and SKILL.md inline resource links. Transitive resources, dependencies, behavior and client invocation require separate review.' };
}

export function checkDirectory(root) {
  try { return checkPackage(readPackage(root)); }
  catch (error) {
    return { version: 1, rulesVersion, status: ['EACCES', 'EPERM'].includes(error.code) ? 'security_stop' : 'failed', diagnostics: [error.message] };
  }
}
