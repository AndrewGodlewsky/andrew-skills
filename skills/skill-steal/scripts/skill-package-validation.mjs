import { posix } from 'node:path';
import { parseRelease } from './release-validation.mjs';

const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function check(condition, message) { if (!condition) throw new Error(message); }
function text(value) { return typeof value === 'string' && value.trim().length > 0; }
function source(files, path) {
  const file = files.get(path);
  check(file && ['100644', '100755'].includes(file.mode), `${path}: required regular file is missing or unsupported`);
  return new TextDecoder('utf-8', { fatal: true }).decode(file.data);
}

function headerValue(raw, path) {
  if (raw === 'true' || raw === 'false') return raw === 'true';
  if (raw.startsWith('"')) return JSON.parse(raw);
  if (raw.startsWith("'")) {
    check(/^'(?:[^']|'')*'$/.test(raw), `${path}: invalid single-quoted value`);
    return raw.slice(1, -1).replaceAll("''", "'");
  }
  check(!/^(?:null|~|true|false|[-+]?(?:\d[\d_]*(?:\.[\d_]*)?|\.[\d_]+)(?:e[-+]?\d+)?|0[xob][0-9a-f_]+|[-+]?\.(?:inf|nan))$/i.test(raw),
    `${path}: expected a string; quote numeric, boolean or null text`);
  check(text(raw) && !/^[>|[\]{&*!]/.test(raw) && !/\s#|:\s/.test(raw),
    `${path}: use a single-line string; quote values containing YAML punctuation`);
  return raw;
}

export function validateSkill(files, name) {
  const skillRoot = `skills/${name}/`;
  const releasePath = `${skillRoot}release.yaml`;
  parseRelease(source(files, releasePath), releasePath);
  const path = `${skillRoot}SKILL.md`;
  const body = source(files, path).replaceAll('\r\n', '\n');
  const match = body.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  check(match, `${path}: expected YAML frontmatter followed by instructions`);
  const fields = {};
  const allowedFields = new Set(['name', 'description', 'user-invocable', 'disable-model-invocation', 'argument-hint', 'license']);
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const field = line.match(/^([a-z][a-z-]*):\s*(.*?)\s*$/);
    check(field, `${path}: unsupported header line: ${line}`);
    check(allowedFields.has(field[1]), `${path}: unsupported header field ${field[1]}`);
    check(!Object.hasOwn(fields, field[1]), `${path}: duplicate field ${field[1]}`);
    fields[field[1]] = headerValue(field[2], path);
  }
  check(name.length <= 64 && namePattern.test(name) && fields.name === name,
    `${path}: name must match the folder and use kebab-case (up to 64 characters)`);
  check(text(fields.description) && fields.description.length <= 1024,
    `${path}: description must contain 1–1024 characters`);
  for (const flag of ['disable-model-invocation', 'user-invocable']) {
    check(typeof fields[flag] === 'boolean', `${path}: ${flag} is required and must be true or false`);
  }
  check(fields['user-invocable'] || !fields['disable-model-invocation'], `${path}: at least one invocation route must remain available`);
  for (const key of ['argument-hint', 'license']) {
    check(!Object.hasOwn(fields, key) || text(fields[key]), `${path}: ${key} must be a nonempty string`);
  }
  check(text(match[2]), `${path}: instruction body is empty`);
  for (const link of match[2].matchAll(/!?\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\)/g)) {
    const target = link[1] ?? link[2];
    if (/^(?:https?:|mailto:|#)/i.test(target)) continue;
    check(!/^[a-z][a-z\d+.-]*:|^[/\\]/i.test(target), `${path}: resource must use a relative path: ${target}`);
    const decoded = decodeURIComponent(target.split('#')[0]);
    check(!/\\|^[a-z][a-z\d+.-]*:|^\//i.test(decoded), `${path}: resource must use a relative path: ${target}`);
    const resource = posix.normalize(posix.join(skillRoot, decoded));
    check(resource.startsWith(skillRoot), `${path}: resource must stay inside its skill folder: ${target}`);
    check(files.has(resource), `${path}: resource is not a file: ${target}`);
  }
}

