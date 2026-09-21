import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { validateSkill } from './skill-package-validation.mjs';
import { readReleaseCatalog } from './release-catalog-reader.mjs';
import { validateCatalogCandidate } from './release-catalog.mjs';
import { readGitFiles, readWorkingFiles, readWorkingGitFiles, requireAncestor, resolveCommit } from './release-snapshots.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const schema = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';

const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

function text(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function source(files, path) {
  const file = files.get(path);
  check(file && ['100644', '100755'].includes(file.mode), `${path}: required regular file is missing or unsupported`);
  return new TextDecoder('utf-8', { fatal: true }).decode(file.data);
}

export function validateFiles(files) {
  check(!files.has('skills'), 'skills must be a directory');
  const plugin = JSON.parse(source(files, 'plugin.json'));
  check(object(plugin), 'Plugin manifest must be an object');
  check(plugin.$schema === schema, 'Expected Agent Plugins 1.0 schema');
  check(plugin.name === 'gt', 'Plugin name must be gt');
  check(typeof plugin.version === 'string' && versionPattern.test(plugin.version), 'Use an x.y.z plugin version');
  check(text(plugin.description), `${plugin.name}: description is required`);
  const marketplace = JSON.parse(source(files, '.claude-plugin/marketplace.json'));
  check(object(marketplace) && marketplace.name === 'andrew-skills', 'Marketplace name must be andrew-skills');
  check(object(marketplace.owner) && text(marketplace.owner.name), 'Marketplace owner.name is required');
  check(Array.isArray(marketplace.plugins) && marketplace.plugins.length === 1, 'Marketplace must list exactly one plugin');
  const entry = marketplace.plugins[0];
  check(object(entry) && entry.name === plugin.name, 'Marketplace plugin name must match the root manifest');
  check(entry.source === './', 'Marketplace source must point to the repository root (./)');
  check(entry.version === plugin.version, 'Marketplace and plugin versions must match');
  check(text(entry.description), 'Marketplace plugin description is required');
  const allowed = new Set(['$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions']);
  for (const key of Object.keys(plugin)) check(allowed.has(key), `${plugin.name}: unsupported manifest field ${key}`);
  for (const key of ['homepage', 'repository', 'license']) {
    check(!Object.hasOwn(plugin, key) || typeof plugin[key] === 'string', `${plugin.name}: ${key} must be a string`);
  }
  if (Object.hasOwn(plugin, 'author')) {
    check(object(plugin.author), `${plugin.name}: author must be an object`);
    for (const [key, value] of Object.entries(plugin.author)) {
      check(['name', 'email', 'url'].includes(key) && typeof value === 'string', `${plugin.name}: invalid author.${key}`);
    }
  }
  if (Object.hasOwn(plugin, 'keywords')) {
    check(Array.isArray(plugin.keywords) && plugin.keywords.every(value => typeof value === 'string'), `${plugin.name}: keywords must be strings`);
  }
  if (Object.hasOwn(plugin, 'extensions')) {
    check(object(plugin.extensions) && Object.values(plugin.extensions).every(object), `${plugin.name}: extensions must contain objects`);
  }
  for (const [path, file] of files) {
    check(['100644', '100755'].includes(file.mode), `${path}: unsupported file mode ${file.mode}`);
  }
  const skills = [...new Set([...files.keys()].filter(path => path.startsWith('skills/')).map(path => path.split('/')[1]))].sort();
  for (const skill of skills) validateSkill(files, skill);
  return `Validated marketplace, ${plugin.name} ${plugin.version}, and ${skills.length} skill(s).`;
}

export function validate(root = repositoryRoot) {
  return validateFiles(readWorkingFiles(root));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values } = parseArgs({ options: {
      base: { type: 'string' }, candidate: { type: 'string' }, 'current-main': { type: 'string' },
    } });
    check(!values['current-main'] || values.base, '--current-main requires --base');
    const baseCommit = values.base ? resolveCommit(repositoryRoot, values.base) : undefined;
    const candidateCommit = values.candidate ? resolveCommit(repositoryRoot, values.candidate) : undefined;
    const currentMainCommit = values['current-main']
      ? (/^[0-9a-f]{40,64}$/.test(values['current-main']) ? values['current-main'] : resolveCommit(repositoryRoot, values['current-main']))
      : baseCommit;
    check(baseCommit === currentMainCommit, 'Stale comparison base: revalidate against current main');
    if (baseCommit) requireAncestor(repositoryRoot, baseCommit, candidateCommit ?? resolveCommit(repositoryRoot, 'HEAD'));
    const candidate = candidateCommit ? readGitFiles(repositoryRoot, candidateCommit)
      : (baseCommit ? readWorkingGitFiles(repositoryRoot) : readWorkingFiles(repositoryRoot));
    console.log(validateFiles(candidate));
    if (baseCommit) {
      const catalog = readReleaseCatalog(repositoryRoot, { ref: baseCommit });
      const result = validateCatalogCandidate(catalog, readGitFiles(repositoryRoot, baseCommit), candidate, { baseCommit, currentMainCommit });
      console.log(`Published history checked: ${catalog.records.length} release record(s); baseline ${catalog.baselineCommit ?? 'not established'}.`);
      console.log(`Release comparison passed: ${JSON.stringify(result)}`);
    } else {
      console.log('Release metadata checked; version transitions need --base <published-ref>.');
    }
  } catch (error) {
    console.error(`Validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
