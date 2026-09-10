import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const schema = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
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

function inside(root, path) {
  const child = relative(root, path);
  return child !== '' && !isAbsolute(child) && child !== '..' && !child.startsWith(`..${sep}`);
}

function json(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function directories(path) {
  const entries = readdirSync(path, { withFileTypes: true });
  check(!entries.some(entry => entry.isSymbolicLink()), `${path}: use real folders, not symlinks`);
  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
}

function headerValue(raw, path) {
  if (raw === 'true' || raw === 'false') return raw === 'true';
  if (raw.startsWith('"')) return JSON.parse(raw);
  if (raw.startsWith("'")) {
    check(/^'(?:[^']|'')*'$/.test(raw), `${path}: invalid single-quoted value`);
    return raw.slice(1, -1).replaceAll("''", "'");
  }
  check(text(raw) && !/^[>|[\]{&*!]/.test(raw) && !/\s#|:\s/.test(raw),
    `${path}: use a single-line string; quote values containing YAML punctuation`);
  return raw;
}

function validateSkill(skillRoot, name) {
  const path = resolve(skillRoot, 'SKILL.md');
  const source = readFileSync(path, 'utf8').replaceAll('\r\n', '\n');
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  check(match, `${path}: expected YAML frontmatter followed by instructions`);
  const fields = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const field = line.match(/^([a-z][a-z-]*):\s*(.*?)\s*$/);
    check(field, `${path}: unsupported header line: ${line}`);
    check(!Object.hasOwn(fields, field[1]), `${path}: duplicate field ${field[1]}`);
    fields[field[1]] = headerValue(field[2], path);
  }
  check(name.length <= 64 && namePattern.test(name) && fields.name === name,
    `${path}: name must match the folder and use kebab-case (up to 64 characters)`);
  check(text(fields.description) && fields.description.length <= 1024,
    `${path}: description must contain 1–1024 characters`);
  for (const flag of ['disable-model-invocation', 'user-invocable']) {
    check(!Object.hasOwn(fields, flag) || typeof fields[flag] === 'boolean',
      `${path}: ${flag} must be true or false`);
  }
  check(text(match[2]), `${path}: instruction body is empty`);
  for (const link of match[2].matchAll(/!?\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\)/g)) {
    const target = link[1] ?? link[2];
    if (/^(?:https?:|mailto:|#)/i.test(target)) continue;
    check(!/^[a-z][a-z\d+.-]*:|^[/\\]/i.test(target), `${path}: resource must use a relative path: ${target}`);
    const resource = resolve(skillRoot, decodeURIComponent(target.split('#')[0]));
    check(inside(skillRoot, resource), `${path}: resource must stay inside its skill folder: ${target}`);
    check(statSync(resource).isFile(), `${path}: resource is not a file: ${target}`);
  }
}

export function validate(root = repositoryRoot) {
  const plugin = json(resolve(root, 'plugin.json'));
  check(object(plugin), 'Plugin manifest must be an object');
  check(plugin.$schema === schema, 'Expected Agent Plugins 1.0 schema');
  check(plugin.name === 'gt', 'Plugin name must be gt');
  check(typeof plugin.version === 'string' && versionPattern.test(plugin.version), 'Use an x.y.z plugin version');
  check(text(plugin.description), `${plugin.name}: description is required`);
  const marketplace = json(resolve(root, '.claude-plugin/marketplace.json'));
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
  const skillsRoot = resolve(root, 'skills');
  const skills = directories(skillsRoot);
  check(skills.length > 0, 'Plugin must contain skills');
  for (const skill of skills) validateSkill(resolve(skillsRoot, skill), skill);
  return `Validated marketplace, ${plugin.name} ${plugin.version}, and ${skills.length} skill(s).`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(validate());
  } catch (error) {
    console.error(`Validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
