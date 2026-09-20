import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { parseRelease, validateReleaseChange } from './release-validation.mjs';

export const CATALOG_FORMAT_VERSION = 1;
const commitPattern = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/;

function check(condition, message) {
  if (!condition) throw new Error(`Release catalog unavailable: ${message}`);
}

function skillFolders(files) {
  check(!files.has('skills'), 'skills must be a directory');
  const skills = new Map();
  for (const [path, file] of files) {
    if (!path.startsWith('skills/')) continue;
    const [, name, ...parts] = path.split('/');
    check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) && name.length <= 64 && parts.length &&
      parts.every(part => part && part !== '.' && part !== '..' && !/[\\\0]/.test(part)),
    `unsupported skill path ${path}`);
    check(['100644', '100755'].includes(file.mode) && Buffer.isBuffer(file.data), `unsupported regular file ${path}`);
    if (!skills.has(name)) skills.set(name, new Map());
    skills.get(name).set(parts.join('/'), file);
  }
  return new Map([...skills].sort(([a], [b]) => Buffer.compare(Buffer.from(a), Buffer.from(b))));
}

// Each field is its UTF-8/byte length as ASCII decimal, a colon, then its exact bytes.
export function skillContentIdentity(files) {
  const hash = createHash('sha256').update('gt-skill-folder-v1\0');
  const field = value => {
    const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value, 'utf8');
    hash.update(`${bytes.length}:`).update(bytes);
  };
  for (const [path, file] of [...files].sort(([a], [b]) => Buffer.compare(Buffer.from(a), Buffer.from(b)))) {
    check(path && path.split('/').every(part => part && part !== '.' && part !== '..' && !/[\\\0]/.test(part)),
      `unsupported relative source path ${path}`);
    check(['100644', '100755'].includes(file.mode) && Buffer.isBuffer(file.data), `unsupported regular file ${path}`);
    field(path); field(file.mode); field(file.data);
  }
  return `sha256:${hash.digest('hex')}`;
}

function releases(files, skillTrees) {
  const folders = skillFolders(files);
  if (skillTrees) for (const skill of skillTrees.keys()) check(folders.has(skill), `${skill}: SKILL.md is required`);
  return [...folders].map(([skill, folder]) => {
    check(folder.has('SKILL.md'), `${skill}: SKILL.md is required`);
    check(folder.has('release.yaml'), `${skill}: release.yaml is required`);
    return { skill, skillPath: `skills/${skill}`, ...parseRelease(folder.get('release.yaml').data),
      contentIdentity: skillContentIdentity(folder) };
  });
}

const exactBytes = files => new Map([...files].map(([path, { mode, data }]) => [path, { mode, data }]));

export function buildReleaseCatalog({ repository, headCommit, snapshots, previousCatalog }) {
  check(typeof repository === 'string' && repository.trim(), 'repository identity is required');
  check(commitPattern.test(headCommit), 'head must be a full commit ID');
  const catalog = { formatVersion: CATALOG_FORMAT_VERSION, repository, headCommit, baselineCommit: null, records: [], active: [] };
  if (previousCatalog) {
    check(previousCatalog.formatVersion === CATALOG_FORMAT_VERSION, 'unsupported prior catalog format');
    check(previousCatalog.repository === repository, 'prior catalog repository mismatch');
  }
  let priorVerified = !previousCatalog;
  function verifyPrior(commit) {
    if (commit === previousCatalog?.headCommit) {
      check(isDeepStrictEqual({ ...catalog, headCommit: commit }, previousCatalog), 'prior catalog conflicts with preserved history');
      priorVerified = true;
    }
  }
  const seen = new Set();
  let previous;
  for (const snapshot of snapshots) {
    check(commitPattern.test(snapshot.commit), 'snapshot must have a full commit ID');
    check(!seen.has(snapshot.commit), 'duplicate commit in first-parent history');
    seen.add(snapshot.commit);
    check(snapshot.firstParent === (previous?.commit ?? null), 'incomplete or reordered first-parent history');
    let current;
    if (!catalog.baselineCommit) {
      try { current = releases(snapshot.files, snapshot.skillTrees); } catch { current = []; }
      if (!current.length || current.some(release => release.version !== '1.0.0')) {
        verifyPrior(snapshot.commit);
        previous = snapshot;
        continue;
      }
      validateReleaseChange(exactBytes(snapshot.files), exactBytes(snapshot.files));
      catalog.baselineCommit = snapshot.commit;
    } else {
      current = releases(snapshot.files, snapshot.skillTrees);
      validateReleaseChange(exactBytes(previous.files), exactBytes(snapshot.files));
    }
    const activeByName = new Map(catalog.active.map(record => [record.skill, record]));
    catalog.active = current.map(release => {
      const existing = activeByName.get(release.skill);
      if (existing && existing.contentIdentity === release.contentIdentity) {
        if (snapshot.skillTrees) check(snapshot.skillTrees.get(release.skill) === existing.sourceTree,
          `${release.skill}: unchanged source conflicts with its Git tree identity`);
        return existing;
      }
      const record = { ...release, repository, sourceCommit: snapshot.commit };
      if (snapshot.skillTrees) {
        const sourceTree = snapshot.skillTrees.get(release.skill);
        check(commitPattern.test(sourceTree), `${release.skill}: missing complete Git tree identity`);
        record.sourceTree = sourceTree;
      }
      catalog.records.push(record);
      return record;
    });
    verifyPrior(snapshot.commit);
    previous = snapshot;
  }
  check(previous?.commit === headCommit, 'history does not reach the pinned head');
  check(priorVerified, 'previously cataloged head is missing or history was rewritten');
  return catalog;
}

export function validateCatalogCandidate(catalog, baseFiles, candidateFiles, { baseCommit, currentMainCommit }) {
  check(catalog.formatVersion === CATALOG_FORMAT_VERSION, 'unsupported catalog format');
  check(catalog.headCommit === baseCommit, 'catalog must describe the comparison base');
  check(baseCommit === currentMainCommit, 'Stale comparison base: revalidate against current main');
  if (catalog.baselineCommit) {
    const baseReleases = releases(baseFiles);
    check(baseReleases.length === catalog.active.length && baseReleases.every(release => catalog.active.some(record =>
      record.skill === release.skill && record.version === release.version && record.notes === release.notes &&
      record.contentIdentity === release.contentIdentity)), 'comparison base conflicts with catalog active records');
  }
  return validateReleaseChange(baseFiles, candidateFiles, { baseCommit, currentMainCommit });
}
