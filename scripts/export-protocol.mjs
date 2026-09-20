import { execFileSync } from 'node:child_process';
import { lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { readReleaseCatalog, repositoryIdentity } from './release-catalog-reader.mjs';
import { readFirstParentCommits, readGitFiles, readGitSkillTrees, readRepositoryOrigin, resolveCommit } from './release-snapshots.mjs';
import { checkedPath, createCopy, ensureDirectory, isSecurityError, targetPaths } from './export-filesystem.mjs';
import { EXPORTER_VERSION, PROTOCOL_VERSION, REPOSITORY, prepareSource, requireExport, sha256 } from './export-source.mjs';

function git(root, args, input) {
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (key.startsWith('GIT_')) delete env[key];
  Object.assign(env, { GIT_NO_REPLACE_OBJECTS: '1', GIT_NO_LAZY_FETCH: '1', GIT_TERMINAL_PROMPT: '0' });
  return execFileSync('git', ['--no-optional-locks', '-C', root, '-c', 'core.hooksPath=/dev/null',
    '-c', 'maintenance.auto=false', '-c', 'gc.auto=0', ...args],
  { input, env, windowsHide: true, maxBuffer: 256 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] });
}

export function checkRuntime() {
  requireExport([22, 24].includes(Number(process.versions.node.split('.')[0])), 'use latest patched Node 22 or 24 LTS; ask Andrew for setup');
  let version;
  try { version = execFileSync('git', ['--version'], { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (error) { if (isSecurityError(error)) throw error; throw new Error('Export stopped: Git 2.43 or later is required; ask Andrew for setup'); }
  const match = /^git version (\d+)\.(\d+)/.exec(version);
  requireExport(match && (Number(match[1]) > 2 || (Number(match[1]) === 2 && Number(match[2]) >= 43)), 'Git 2.43 or later is required; ask Andrew for setup');
}

function cachePath(target, cache) {
  const paths = targetPaths(target);
  requireExport(typeof cache === 'string' && dirname(resolve(cache)) === paths.work && /^cache-[a-zA-Z0-9]+$/.test(resolve(cache).split(/[\\/]/).at(-1)), 'cache must be an exporter-owned cache directory in this target home');
  return checkedPath(cache);
}

function verifiedCache(target, cache) {
  const root = cachePath(target, cache);
  checkedPath(join(root, 'verified.json'));
  const saved = JSON.parse(readFileSync(join(root, 'verified.json'), 'utf8'));
  requireExport(saved.protocolVersion === PROTOCOL_VERSION && saved.repository === REPOSITORY &&
    /^[a-f0-9]{40}$/.test(saved.headCommit), 'unknown or invalid verified-cache schema');
  const objects = checkedPath(join(root, 'objects.git'));
  function verifyPaths(path) {
    checkedPath(path);
    const stat = lstatSync(path);
    requireExport(stat.isDirectory() || stat.isFile(), 'cache contains unsupported filesystem entries');
    if (stat.isDirectory()) for (const name of readdirSync(path)) verifyPaths(join(path, name));
  }
  verifyPaths(objects);
  requireExport(readFileSync(join(objects, 'config'), 'utf8') === '[core]\nrepositoryformatversion = 0\nbare = true\n' &&
    readFileSync(join(objects, 'HEAD'), 'utf8') === 'ref: refs/heads/unused\n', 'cache configuration changed');
  // An owned cache has no alternates, grafts, shallow marker or replacement refs.
  for (const path of ['objects/info/alternates', 'info/grafts', 'shallow']) requireExport(!lstatSync(join(objects, path), { throwIfNoEntry: false }), 'cache redirects or truncates history');
  git(objects, ['fsck', '--full', '--no-reflogs', '--no-dangling', saved.headCommit]);
  const catalog = readReleaseCatalog(objects, { ref: saved.headCommit, repository: REPOSITORY });
  requireExport(sha256(JSON.stringify(catalog)) === saved.catalogHash, 'verified cache no longer matches its catalog');
  return { root, objects, catalog, saved };
}

export function acquireCatalog({ target, checkout, offlineCache }) {
  checkRuntime();
  requireExport(!(checkout && offlineCache), 'choose a trusted checkout or an explicit offline cache');
  if (offlineCache) {
    const cached = verifiedCache(target, offlineCache);
    return { protocolVersion: PROTOCOL_VERSION, cache: cached.root, freshness: 'offline; head may be stale', catalog: cached.catalog };
  }
  const paths = targetPaths(target);
  let headCommit;
  let packed;
  if (checkout) {
    const source = checkedPath(checkout);
    requireExport(repositoryIdentity(readRepositoryOrigin(source)) === REPOSITORY, 'trusted checkout must have the GT repository origin');
    headCommit = resolveCommit(source, 'origin/main');
    readFirstParentCommits(source, headCommit);
    packed = git(source, ['pack-objects', '--stdout', '--revs'], `${headCommit}\n`);
  } else {
    const remote = git(paths.home, ['ls-remote', '--exit-code', REPOSITORY, 'refs/heads/main']).toString('utf8');
    const match = /^([a-f0-9]{40})\trefs\/heads\/main\s*$/.exec(remote);
    requireExport(match, 'remote main did not resolve to one full commit');
    headCommit = match[1];
  }
  ensureDirectory(paths.work);
  checkedPath(paths.work);
  const cache = mkdtempSync(join(paths.work, 'cache-'));
  const objects = join(cache, 'objects.git');
  // Initialize only a private object database. No user checkout, branch or commit is written.
  for (const path of [objects, join(objects, 'objects'), join(objects, 'objects/pack'), join(objects, 'objects/info'), join(objects, 'refs')]) mkdirSync(path, { mode: 0o700 });
  writeFileSync(join(objects, 'HEAD'), 'ref: refs/heads/unused\n', { flag: 'wx', mode: 0o600 });
  writeFileSync(join(objects, 'config'), '[core]\nrepositoryformatversion = 0\nbare = true\n', { flag: 'wx', mode: 0o600 });
  if (packed) git(objects, ['index-pack', '--stdin'], packed);
  else git(objects, ['fetch', '--no-write-fetch-head', '--no-tags', '--no-recurse-submodules', REPOSITORY, headCommit]);
  git(objects, ['fsck', '--full', '--no-reflogs', '--no-dangling', headCommit]);
  const catalog = readReleaseCatalog(objects, { ref: headCommit, repository: REPOSITORY });
  const freshness = checkout ? 'local-checkout-head; remote freshness unverified' : 'remote main pinned at retrieval';
  const saved = { protocolVersion: PROTOCOL_VERSION, repository: REPOSITORY, headCommit, catalogHash: sha256(JSON.stringify(catalog)), retrievedAt: new Date().toISOString(), freshness };
  writeFileSync(join(cache, 'verified.json'), JSON.stringify(saved, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  return { protocolVersion: PROTOCOL_VERSION, cache, freshness, catalog };
}

function sourceSelection(target, cache, skill, commit) {
  const verified = verifiedCache(target, cache);
  const candidates = verified.catalog.records.filter(record => record.skill === skill && record.sourceCommit === commit);
  requireExport(candidates.length === 1, 'choose one exact catalog skill and full source commit');
  const record = candidates[0];
  requireExport(readGitSkillTrees(verified.objects, commit).get(skill) === record.sourceTree, 'source tree does not match the catalog');
  const files = new Map([...readGitFiles(verified.objects, commit)].filter(([path]) => path.startsWith(`${record.skillPath}/`))
    .map(([path, file]) => [path.slice(record.skillPath.length + 1), file]));
  return { ...verified, record, files };
}

export function makePlan({ target, cache, skill, commit }) {
  checkRuntime();
  const selection = sourceSelection(target, cache, skill, commit);
  // Planning exposes static eligibility and the exact reviewed bytes; it is not the author's semantic attestation.
  const prepared = prepareSource(selection.record, selection.files, { portabilityReviewed: true });
  const paths = targetPaths(target);
  return { protocolVersion: PROTOCOL_VERSION, exporterVersion: EXPORTER_VERSION,
    target: { environment: target.environment, home: paths.home }, cache: selection.root,
    headCommit: selection.catalog.headCommit, catalogHash: selection.saved.catalogHash, freshness: 'cached head; may be stale',
    source: selection.record, personalName: prepared.personalName, destination: join(paths.skills, prepared.personalName),
    sourceFiles: prepared.sourceFiles, installedFiles: prepared.installedFiles, portabilityReviewRequired: true };
}

export function executePlan({ target, plan, portabilityReviewed }) {
  checkRuntime();
  requireExport(plan?.protocolVersion === PROTOCOL_VERSION && plan.exporterVersion === EXPORTER_VERSION, 'unsupported plan protocol or exporter version');
  const current = makePlan({ target, cache: plan.cache, skill: plan.source?.skill, commit: plan.source?.sourceCommit });
  requireExport(isDeepStrictEqual(current, plan), 'plan differs from the current verified source, target or protocol; plan again');
  const { record, files } = sourceSelection(target, plan.cache, plan.source.skill, plan.source.sourceCommit);
  return createCopy({ record, files, target, portabilityReviewed });
}
