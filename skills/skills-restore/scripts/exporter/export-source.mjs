import { createHash } from 'node:crypto';
import { posix } from 'node:path';
import { parseRelease } from './release-validation.mjs';
import { skillContentIdentity } from './release-catalog.mjs';

export const PROTOCOL_VERSION = 1;
export const EXPORTER_VERSION = '1.1.0';
export const REPOSITORY = 'https://github.com/AndrewGodlewsky/andrew-skills';

export function requireExport(condition, message) {
  if (!condition) throw new Error(`Export stopped: ${message}`);
}

export const sha256 = data => createHash('sha256').update(data).digest('hex');

export function validateSourcePath(path) {
  requireExport(typeof path === 'string' && path.length <= 220 && path.split('/').every(part =>
    part && part !== '.' && part !== '..' && part.length <= 100 && /^[\x20-\x7e]+$/.test(part) &&
    !/[<>:"\\|?*]/.test(part) && !/[. ]$/.test(part) && !/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part) &&
    !['.git', '.gt-export.json'].includes(part.toLowerCase())), `unsafe or reserved source path: ${path}`);
  requireExport(path === 'SKILL.md' || !path.split('/').some(part => part.toLowerCase() === 'skill.md'),
    `nested or ambiguously named SKILL.md is unsupported: ${path}`);
}

function checkPortability(files, sourceName) {
  const names = new Map();
  for (const [path, file] of files) {
    validateSourcePath(path);
    const segments = path.split('/');
    for (let i = 1; i <= segments.length; i++) {
      const prefix = segments.slice(0, i).join('/');
      requireExport(!names.has(prefix.toLowerCase()) || names.get(prefix.toLowerCase()) === prefix,
        `case-colliding source path: ${path}`);
      names.set(prefix.toLowerCase(), prefix);
      if (i < segments.length) requireExport(!files.has(prefix), `file/directory path collision: ${prefix}`);
    }
    requireExport(['100644', '100755'].includes(file.mode), `unsupported source mode: ${path}`);
    requireExport(!file.data.subarray(0, 150).toString().startsWith('version https://git-lfs.github.com/spec/v1'),
      `LFS pointer payload is unsupported: ${path}`);
    // Binary resources are copied as bytes; author review covers dependencies static text checks cannot prove.
    if (file.data.includes(0)) continue;
    let text;
    try { text = new TextDecoder('utf8', { fatal: true, ignoreBOM: true }).decode(file.data); } catch { continue; }
    const escapedName = sourceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    requireExport(!new RegExp(`(?:^|[\\s\"'\x60(])/(?:gt:[a-z0-9-]+|${escapedName})(?=[^a-z0-9-]|$)`, 'm').test(text) &&
      !/\$\{?(?:CLAUDE_|COPILOT_)?PLUGIN_(?:ROOT|DATA)|(?:^|[\s"'`(])(?:[A-Za-z]:[\\/]|~[\\/]|\/[^\s"'`()\/]+\/)|\\\\[^\s]+\\/m.test(text),
      `known plugin/self/absolute-path dependency prevents portability: ${path}`);
    const links = [...text.matchAll(/!?\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\)/g)];
    const dependencyText = links.reduce((remaining, link) => remaining.replace(link[0], ''), text);
    for (const match of dependencyText.matchAll(/(?:^|[\s"'`(])((?:\.\.\/|\.\/)[^\s"'`()<>\[\],;]+)/gm)) {
      const dependency = posix.normalize(posix.join(posix.dirname(path), match[1]));
      requireExport(!dependency.startsWith('../') && files.has(dependency), `missing or outside quoted resource dependency: ${path}: ${match[1]}`);
    }
    for (const link of links) {
      const target = link[1] ?? link[2];
      if (/^(?:https?:|mailto:|#)/i.test(target)) continue;
      const decoded = decodeURIComponent(target.split('#')[0]);
      requireExport(!/\\|^[a-z][a-z\d+.-]*:|^\//i.test(decoded), `resource must be relative: ${path}: ${target}`);
      const resource = posix.normalize(posix.join(posix.dirname(path), decoded));
      requireExport(!resource.startsWith('../') && files.has(resource), `missing or outside resource: ${path}: ${target}`);
    }
  }
}

export function fileManifest(files) {
  return [...files].sort(([a], [b]) => Buffer.compare(Buffer.from(a), Buffer.from(b)))
    .map(([path, file]) => ({ path, sha256: sha256(file.data), sourceMode: file.mode }));
}

export function prepareSource(record, sourceFiles, { portabilityReviewed = false } = {}) {
  requireExport(portabilityReviewed === true, 'author/source portability review is required before creation');
  requireExport(record && record.repository === REPOSITORY && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.skill) &&
    record.skillPath === `skills/${record.skill}` && /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(record.sourceCommit) &&
    /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(record.sourceTree), 'invalid exact source record');
  checkPortability(sourceFiles, record.skill);
  requireExport(skillContentIdentity(sourceFiles) === record.contentIdentity, 'source integrity does not match the catalog');
  const release = parseRelease(sourceFiles.get('release.yaml')?.data ?? Buffer.alloc(0));
  requireExport(release.version === record.version && release.notes === record.notes, 'source metadata differs from the catalog');
  const personalName = `${record.skill}-v${record.version.replaceAll('.', '-')}`;
  requireExport(personalName.length <= 64, 'personal name exceeds 64 characters; names are never truncated');
  const original = sourceFiles.get('SKILL.md')?.data;
  requireExport(original, 'root SKILL.md is required');
  const text = new TextDecoder('utf8', { fatal: true, ignoreBOM: true }).decode(original);
  const header = /^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  requireExport(header, 'unsupported frontmatter boundary');
  const fields = new Set();
  for (const line of header[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const match = /^([a-z][a-z-]*):[ \t]*(.*)$/.exec(line);
    requireExport(match && ['name', 'description', 'user-invocable', 'disable-model-invocation', 'argument-hint', 'license'].includes(match[1]),
      'unsupported or ambiguous frontmatter header');
    requireExport(!fields.has(match[1]), `duplicate frontmatter field: ${match[1]}`);
    fields.add(match[1]);
    requireExport(match[2].trim() && !/^[>|[\]{&*!]/.test(match[2]), 'unsupported frontmatter value');
    const raw = match[2].trim();
    if (['user-invocable', 'disable-model-invocation'].includes(match[1])) {
      requireExport(['true', 'false'].includes(raw), 'invocation flags must be plain booleans');
    } else {
      let value = raw;
      if (raw.startsWith('"')) { try { value = JSON.parse(raw); } catch { requireExport(false, 'invalid quoted header value'); } }
      else if (raw.startsWith("'")) {
        requireExport(/^'(?:[^']|'')*'$/.test(raw), 'invalid quoted header value');
        value = raw.slice(1, -1).replaceAll("''", "'");
      } else requireExport(!/^(?:true|false|null|~|[-+]?\d+(?:\.\d+)?)$/i.test(raw) && !/\s#|:\s/.test(raw), 'ambiguous plain header value');
      requireExport(typeof value === 'string' && value.trim() && (match[1] !== 'description' || value.length <= 1024), 'invalid header string');
    }
  }
  requireExport(fields.has('description') && text.slice(header[0].length).trim(), 'description and instruction body are required');
  requireExport(!(/^user-invocable:[ \t]*false[ \t]*\r?$/m.test(header[1]) &&
    /^disable-model-invocation:[ \t]*true[ \t]*\r?$/m.test(header[1])), 'at least one invocation route is required');
  const names = [...header[1].matchAll(/^name:[ \t]*(.*?)[ \t]*\r?$/gm)];
  requireExport(names.length === 1, 'a single unambiguous frontmatter name is required');
  const raw = names[0][1];
  const name = raw.startsWith('"') ? JSON.parse(raw) : raw.startsWith("'")
    ? (/^'(?:[^']|'')*'$/.test(raw) ? raw.slice(1, -1).replaceAll("''", "'") : null) : raw;
  requireExport(name === record.skill, 'frontmatter name does not match the source folder');
  const offset = header[0].indexOf(header[1]) + names[0].index;
  const line = names[0][0];
  const content = text.slice(0, offset) + `name: ${personalName}` + (line.endsWith('\r') ? '\r' : '') + text.slice(offset + line.length);
  const files = new Map([...sourceFiles].map(([path, file]) => [path, { mode: file.mode, data: Buffer.from(file.data) }]));
  files.set('SKILL.md', { mode: sourceFiles.get('SKILL.md').mode, data: Buffer.from(content) });
  return { personalName, files, sourceFiles: fileManifest(sourceFiles), installedFiles: fileManifest(files) };
}
