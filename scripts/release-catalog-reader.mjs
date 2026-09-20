import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { buildReleaseCatalog } from './release-catalog.mjs';
import { readFirstParentCommits, readGitFiles, readGitSkillTrees, readRepositoryOrigin, resolveCommit } from './release-snapshots.mjs';

function repositoryIdentity(origin) {
  const githubSsh = /^git@github\.com:([^\s]+)$/.exec(origin);
  const url = new URL(githubSsh ? `https://github.com/${githubSsh[1]}` : origin);
  if (!['https:', 'ssh:'].includes(url.protocol) || url.password || (url.username && url.protocol !== 'ssh:') || url.search || url.hash) {
    throw new Error('Release catalog unavailable: use a credential-free HTTPS or SSH repository origin');
  }
  return url.toString().replace(/\/$/, '').replace(/\.git$/, '');
}

export function readReleaseCatalog(root, { ref = 'origin/main', repository, previousCatalog } = {}) {
  const headCommit = resolveCommit(root, ref);
  const origin = repositoryIdentity(repository ?? readRepositoryOrigin(root));
  const lineage = readFirstParentCommits(root, headCommit);
  function* snapshots() {
    for (const entry of lineage) yield { ...entry,
      files: readGitFiles(root, entry.commit, { allowUnsupportedModes: true }), skillTrees: readGitSkillTrees(root, entry.commit) };
  }
  return buildReleaseCatalog({ repository: origin, headCommit, snapshots: snapshots(), previousCatalog });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values } = parseArgs({ options: { ref: { type: 'string' }, repository: { type: 'string' } } });
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    console.log(JSON.stringify(readReleaseCatalog(root, values), null, 2));
  } catch (error) {
    console.error(`Catalog generation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
