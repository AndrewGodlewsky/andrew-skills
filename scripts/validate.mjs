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
  const catalog = json(resolve(root, '.claude-plugin/marketplace.json'));
  check(object(catalog) && text(catalog.name) && namePattern.test(catalog.name), 'Invalid marketplace name');
  check(object(catalog.owner) && text(catalog.owner.name), 'Marketplace owner.name is required');
  check(Array.isArray(catalog.plugins) && catalog.plugins.length > 0, 'Marketplace must contain plugins');
  const listed = new Set();
  let skillCount = 0;
  for (const entry of catalog.plugins) {
    check(object(entry) && text(entry.name) && namePattern.test(entry.name) && entry.name.length <= 64,
      'Plugin entry requires a kebab-case name (up to 64 characters)');
    check(!listed.has(entry.name), `Duplicate plugin: ${entry.name}`);
    listed.add(entry.name);
    check(entry.source === `./plugins/${entry.name}`, `${entry.name}: source must match its plugin folder`);
    check(text(entry.description), `${entry.name}: catalog description is required`);
    check(typeof entry.version === 'string' && versionPattern.test(entry.version), `${entry.name}: use an x.y.z version`);
    const pluginRoot = resolve(root, entry.source);
    const plugin = json(resolve(pluginRoot, 'plugin.json'));
    check(object(plugin), `${entry.name}: manifest must be an object`);
    check(plugin.$schema === schema, `${entry.name}: expected Agent Plugins 1.0 schema`);
    check(plugin.name === entry.name, `${entry.name}: manifest name mismatch`);
    check(plugin.version === entry.version, `${entry.name}: catalog and manifest versions differ`);
    check(text(plugin.description), `${entry.name}: description is required`);
    const allowed = new Set(['$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions']);
    for (const key of Object.keys(plugin)) check(allowed.has(key), `${entry.name}: unsupported manifest field ${key}`);
    for (const key of ['homepage', 'repository', 'license']) {
      check(!Object.hasOwn(plugin, key) || typeof plugin[key] === 'string', `${entry.name}: ${key} must be a string`);
    }
    if (Object.hasOwn(plugin, 'author')) {
      check(object(plugin.author), `${entry.name}: author must be an object`);
      for (const [key, value] of Object.entries(plugin.author)) {
        check(['name', 'email', 'url'].includes(key) && typeof value === 'string', `${entry.name}: invalid author.${key}`);
      }
    }
    if (Object.hasOwn(plugin, 'keywords')) {
      check(Array.isArray(plugin.keywords) && plugin.keywords.every(value => typeof value === 'string'), `${entry.name}: keywords must be strings`);
    }
    if (Object.hasOwn(plugin, 'extensions')) {
      check(object(plugin.extensions) && Object.values(plugin.extensions).every(object), `${entry.name}: extensions must contain objects`);
    }
    const skillsRoot = resolve(pluginRoot, 'skills');
    const skills = directories(skillsRoot);
    check(skills.length > 0, `${entry.name}: plugin must contain skills`);
    for (const skill of skills) validateSkill(resolve(skillsRoot, skill), skill);
    skillCount += skills.length;
  }
  const actual = directories(resolve(root, 'plugins'));
  check(actual.length === listed.size && actual.every(name => listed.has(name)), 'Every plugin folder must have exactly one catalog entry');
  return `Validated ${listed.size} plugin(s) and ${skillCount} skill(s).`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(validate());
  } catch (error) {
    console.error(`Validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
