import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const runtimePaths = ['plugin.json', '.claude-plugin/marketplace.json', 'skills'];

function git(root, args, input) {
  return execFileSync('git', ['--no-optional-locks', '-C', root, ...args], {
    maxBuffer: 64 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'], input,
  });
}

export function resolveCommit(root, ref) {
  return git(root, ['rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`]).toString('utf8').trim();
}

export function requireAncestor(root, base, candidate) {
  try {
    git(root, ['merge-base', '--is-ancestor', base, candidate]);
  } catch (error) {
    if (error.status === 1) throw new Error('Candidate does not contain the comparison base; refresh it against current main');
    throw error;
  }
}

export function readGitFiles(root, ref) {
  const commit = resolveCommit(root, ref);
  const listing = git(root, ['ls-tree', '-r', '-z', '--full-tree', commit, '--', ...runtimePaths]).toString('utf8');
  const files = new Map();
  for (const record of listing.split('\0').filter(Boolean)) {
    const match = /^([0-7]{6}) (\w+) ([0-9a-f]+)\t([\s\S]+)$/.exec(record);
    if (!match) throw new Error('Unrecognized Git tree record');
    const [, mode, type, id, path] = match;
    if (type !== 'blob' || !['100644', '100755'].includes(mode)) {
      throw new Error(`${path}: unsupported Git file mode ${mode}`);
    }
    files.set(path, { mode, identity: id, data: git(root, ['cat-file', 'blob', id]) });
  }
  return files;
}

export function readIndexModes(root) {
  const listing = git(root, ['ls-files', '--stage', '-z', '--', ...runtimePaths]).toString('utf8');
  const modes = new Map();
  for (const record of listing.split('\0').filter(Boolean)) {
    const match = /^([0-7]{6}) [0-9a-f]+ (\d)\t([\s\S]+)$/.exec(record);
    if (!match || match[2] !== '0') throw new Error('Resolve runtime-file index conflicts before release validation');
    modes.set(match[3], match[1]);
  }
  return modes;
}

export function readWorkingFiles(root, indexModes = new Map()) {
  const files = new Map();
  function visit(path) {
    const absolute = join(root, path);
    const stat = lstatSync(absolute);
    if (stat.isSymbolicLink()) throw new Error(`${path}: use regular files/directories, not links`);
    if (path === 'skills' && !stat.isDirectory()) throw new Error('skills must be a directory');
    if (stat.isDirectory()) {
      if (/^skills\/[^/]+$/.test(path) && !existsSync(join(absolute, 'SKILL.md'))) {
        throw new Error(`${path}/SKILL.md is required`);
      }
      for (const name of readdirSync(absolute).sort()) visit(`${path}/${name}`);
    } else if (stat.isFile()) {
      const mode = process.platform === 'win32'
        ? (indexModes.get(path) ?? '100644')
        : ((stat.mode & 0o111) ? '100755' : '100644');
      files.set(path, { mode, data: readFileSync(absolute) });
    } else {
      throw new Error(`${path}: unsupported file type`);
    }
  }
  const catalogDirectory = lstatSync(join(root, '.claude-plugin'));
  if (!catalogDirectory.isDirectory() || catalogDirectory.isSymbolicLink()) {
    throw new Error('.claude-plugin must be a regular directory');
  }
  visit('plugin.json');
  visit('.claude-plugin/marketplace.json');
  if (readdirSync(root).includes('skills')) visit('skills');
  return files;
}

export function readWorkingGitFiles(root) {
  const files = readWorkingFiles(root, readIndexModes(root));
  const attributes = git(root, ['check-attr', '-z', 'filter', '--', ...files.keys()]).toString('utf8').split('\0');
  for (let i = 0; i < attributes.length - 1; i += 3) {
    if (!['unspecified', 'unset'].includes(attributes[i + 2])) {
      throw new Error(`${attributes[i]}: local release comparison does not execute Git clean filters; use a committed snapshot`);
    }
  }
  for (const [path, file] of files) {
    // No -w: compute Git's canonical identity without storing objects or changing the index.
    file.identity = git(root, ['hash-object', `--path=${path}`, '--stdin'], file.data).toString('utf8').trim();
  }
  return files;
}
