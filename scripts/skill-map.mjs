import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, posix, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { guidance } from './build-create-skills.mjs';
import { submissionGuidance } from './build-skill-steal.mjs';

const textExtensions = new Set(['.md', '.mjs', '.js', '.json', '.yaml', '.yml', '.txt', '.py', '.sh', '.ps1']);
const hash = value => createHash('sha256').update(value).digest('hex');
const stable = value => JSON.stringify(value);
const sorted = values => [...values].sort();
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const safePath = path => typeof path === 'string' && path.length > 0 && !path.includes('\\')
  && !path.includes(':') && !path.startsWith('/') && path.split('/').every(part => part && part !== '.' && part !== '..');
const owner = path => /^skills\/([^/]+)\//.exec(path)?.[1];
const fileId = path => `file:${path}`;
const skillId = name => `skill:${name}`;
const validId = id => typeof id === 'string' && (id.startsWith('file:') ? safePath(id.slice(5)) : /^skill:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id));
const text = (files, path) => files.get(path)?.toString('utf8').replaceAll('\r\n', '\n');
export const sourceDigest = (files, path) => hash(normalizedBytes(path, files.get(path)));

function normalizedBytes(path, bytes) {
  if (!bytes) return Buffer.from('<missing>');
  return textExtensions.has(extname(path)) ? Buffer.from(bytes.toString('utf8').replaceAll('\r\n', '\n')) : bytes;
}

export function readSkillMapFiles(root) {
  const files = new Map();
  function visit(path) {
    const absolute = join(root, path), stat = lstatSync(absolute);
    if (stat.isSymbolicLink()) throw new Error(`${path}: skill map requires regular files, not links`);
    if (stat.isDirectory()) for (const name of readdirSync(absolute).sort()) visit(`${path}/${name}`);
    else if (stat.isFile()) files.set(path, readFileSync(absolute));
    else throw new Error(`${path}: unsupported source type`);
  }
  for (const path of ['skills', 'scripts', 'exporter', 'CONTRIBUTING.md']) if (existsSync(join(root, path))) visit(path);
  return files;
}

export function inventorySkills(files) {
  return sorted(new Set([...files.keys()].map(owner).filter(Boolean)));
}

// Candidates are deliberately lexical, never inferred dependencies. All occurrences
// for a source/target are reviewed together against the entire source digest.
export function scanCandidates(files, names, paths = [...files.keys()].filter(owner)) {
  const found = new Map();
  function add(path, target, offset, length, kind) {
    const content = text(files, path), id = hash(stable([path, target]));
    if (!found.has(id)) found.set(id, { id, path, target, kind, sourceDigest: sourceDigest(files, path), occurrences: [] });
    const line = content.slice(0, offset).split('\n').length;
    const excerpt = content.slice(offset, offset + length);
    if (!found.get(id).occurrences.some(item => item.offset === offset && item.excerpt === excerpt)) {
      found.get(id).occurrences.push({ line, offset, excerpt });
    }
  }
  for (const path of sorted(paths)) {
    if (!textExtensions.has(extname(path)) || !files.has(path)) continue;
    const content = text(files, path);
    for (const name of names) {
      const pattern = name.split('-').join('[- \\t]+');
      const re = new RegExp(`(?<![a-z0-9_-])${pattern}(?![a-z0-9_-])`, 'gi');
      for (const match of content.matchAll(re)) add(path, skillId(name), match.index, match[0].length, 'skill');
    }
    for (const match of content.matchAll(/(?:[/$]gt:|skills\/)([a-z0-9]+(?:-[a-z0-9]+)*)(?=\b|\/)/g)) {
      add(path, skillId(match[1]), match.index, match[0].length, 'skill');
    }
    const references = [
      ...[...content.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)].map(m => [m, m[1], 'relative']),
      ...[...content.matchAll(/(?:from\s*|import\s*\(|import\s*)['"](\.{1,2}\/[^'"]+)['"]/g)].map(m => [m, m[1], 'relative']),
      ...[...content.matchAll(/`([^`\n]+)`/g)].filter(m => /^(?:references|scripts|assets|templates)\/[\w./-]+$/.test(m[1])).map(m => [m, m[1], 'package']),
    ];
    for (const [match, reference, base] of references) {
      const target = reference.split('#')[0];
      if (!target || /^[a-z]+:|^\/|[<>$*{}]/i.test(target)) continue;
      const root = base === 'package' && owner(path) ? `skills/${owner(path)}` : posix.dirname(path);
      const resolved = posix.normalize(posix.join(root, target));
      if (safePath(resolved)) add(path, fileId(resolved), match.index, match[0].length, 'resource');
    }
    // Bare filenames in code spans are candidates only when they identify a
    // present bundled resource. Output filenames such as CONTEXT.md are not edges.
    for (const match of content.matchAll(/`([A-Za-z0-9_-]+\.[A-Za-z0-9]+)`/g)) {
      const target = posix.join(posix.dirname(path), match[1]);
      if (files.has(target) && target !== path) add(path, fileId(target), match.index, match[0].length, 'resource');
    }
    if (extname(path) === '.py') for (const match of content.matchAll(/^from\s+\.(\w+)\s+import\s+/gm)) {
      add(path, fileId(posix.join(posix.dirname(path), `${match[1]}.py`)), match.index, match[0].length, 'resource');
    }
  }
  return [...found.values()].sort((a, b) => a.path.localeCompare(b.path, 'en') || a.target.localeCompare(b.target, 'en'));
}

function locateEvidence(files, evidence) {
  const content = text(files, evidence.path);
  if (content === undefined) return { ...evidence, status: 'missing', line: null };
  const offset = content.indexOf(evidence.excerpt);
  const status = offset < 0 ? 'stale' : content.indexOf(evidence.excerpt, offset + 1) >= 0 ? 'ambiguous' : 'current';
  return { ...evidence, status, line: offset < 0 ? null : content.slice(0, offset).split('\n').length };
}

export function expectedCopy(files, record) {
  const read = path => {
    if (!files.has(path)) throw new Error(`Missing source: ${path}`);
    return text(files, path);
  };
  const source = read(record.sources[0]);
  const manifest = () => JSON.stringify({ schemaVersion: 1, files: Object.fromEntries(record.sources
    .filter(path => posix.basename(path) !== 'export-launcher.mjs')
    .map(path => [posix.basename(path), hash(Buffer.from(read(path)))])) }, null, 2) + '\n';
  switch (record.transform) {
    case 'copy': return source;
    case 'local-imports': return source.replaceAll("from '../", "from './");
    case 'steal-imports': return source.replaceAll("from '../create-skills/", "from './");
    case 'package-rules': return guidance(source);
    case 'steal-tools': return 'Generated from shared creator guidance; edit the maintained source or builder, then rebuild.\n\n'
      + source.replace('preparation and installation commands', 'preparation commands');
    case 'steal-submission': return 'Generated from shared creator guidance; edit the maintained source or builder, then rebuild.\n\n' + submissionGuidance(source);
    case 'export-manifest': return manifest();
    case 'export-launcher': return source.replace('__MANIFEST_HASH__', hash(Buffer.from(manifest())));
    default: throw new Error(`Unsupported provenance transform: ${record.transform}`);
  }
}

export function analyzeSkillMap(files, records) {
  const diagnostics = [], nodes = new Map(), edges = [], provenance = [];
  const report = (code, subject, message) => diagnostics.push({ code, subject, message });
  const names = inventorySkills(files), sourcePaths = new Set([...files.keys()].filter(owner));
  const node = id => {
    if (!nodes.has(id)) {
      const kind = id.startsWith('skill:') ? 'skill' : 'resource', path = id.slice(kind === 'skill' ? 6 : 5);
      const present = kind === 'skill' ? names.includes(path) && files.has(`skills/${path}/SKILL.md`) : files.has(path);
      nodes.set(id, { id, kind, label: path, present, ...(kind === 'resource' ? { owner: owner(path) ?? null } : {}) });
    }
    return nodes.get(id);
  };
  if (!records || records.schemaVersion !== 1 || !Array.isArray(records.edges) || !Array.isArray(records.provenance)
      || !Array.isArray(records.exclusions) || !records.reviews || typeof records.reviews !== 'object' || Array.isArray(records.reviews)) {
    throw new Error('Invalid skill-map record envelope (expected schemaVersion 1, edges, provenance, exclusions, reviews)');
  }
  for (const name of names) {
    node(skillId(name));
    const path = `skills/${name}/SKILL.md`;
    if (!files.has(path)) report('missing-instructions', name, `${path} is missing`);
    node(fileId(path));
    edges.push({ id: `entry:${name}`, from: skillId(name), to: fileId(path), kind: 'entry', condition: 'Skill entry instructions', evidence: [], status: 'current' });
  }
  const edgeIds = new Set();
  for (const record of records.edges) {
    if (!record || !nonempty(record.id) || /^(entry|source):/.test(record.id) || edgeIds.has(record.id) || !validId(record.from) || !validId(record.to)
        || !['skill', 'resource'].includes(record.kind) || !nonempty(record.condition)
        || typeof record.conditional !== 'boolean' || !Array.isArray(record.evidence) || !record.evidence.length
        || record.evidence.some(item => !item || !safePath(item.path) || !nonempty(item.excerpt))
        || (record.kind === 'skill' && (!record.from.startsWith('skill:') || !record.to.startsWith('skill:')))
        || (record.kind === 'resource' && !record.to.startsWith('file:'))) {
      report('invalid-record', record?.id ?? '<edge>', 'Invalid or duplicate dependency record'); continue;
    }
    edgeIds.add(record.id);
    const evidence = record.evidence.map(item => locateEvidence(files, item));
    for (const item of evidence) {
      sourcePaths.add(item.path);
      if (item.status !== 'current') report(`${item.status}-evidence`, record.id, item.path);
    }
    for (const id of [record.from, record.to]) if (!node(id).present) report('missing-target', record.id, id);
    edges.push({ ...record, evidence, status: evidence.every(item => item.status === 'current') ? 'current' : 'stale' });
  }
  const copies = new Set();
  for (const record of records.provenance) {
    if (!record || !safePath(record.copy) || copies.has(record.copy) || !safePath(record.builder)
        || !Array.isArray(record.sources) || !record.sources.length || record.sources.some(path => !safePath(path))
        || !nonempty(record.transform) || !nonempty(record.excerpt)) {
      report('invalid-record', record?.copy ?? '<provenance>', 'Invalid or duplicate provenance record'); continue;
    }
    copies.add(record.copy);
    const evidence = locateEvidence(files, { path: record.builder, excerpt: record.excerpt });
    if (evidence.status !== 'current') report(`${evidence.status}-evidence`, record.copy, record.builder);
    let status = 'current';
    try {
      if (text(files, record.copy) !== expectedCopy(files, record)) status = 'stale';
    } catch (error) { status = 'invalid'; report('invalid-provenance', record.copy, error.message); }
    if (status === 'stale') report('stale-copy', record.copy, 'Generated copy differs from maintained inputs');
    provenance.push({ ...record, status, evidence });
    for (const path of new Set([record.copy, record.builder, ...record.sources])) {
      sourcePaths.add(path);
      if (!node(fileId(path)).present) report('missing-target', record.copy, path);
    }
    for (const path of new Set([...record.sources, record.builder])) edges.push({
      id: `source:${record.copy}:${path}`, from: fileId(record.copy), to: fileId(path), kind: 'source',
      condition: path === record.builder ? 'Generated by this builder' : 'Generated from this maintained source',
      evidence: [evidence], status: status === 'current' && evidence.status === 'current' ? 'current' : 'stale',
    });
  }
  // Follow explicitly declared provenance transitively; sources may themselves
  // be generated copies, with cycles handled by the visited set below.
  for (const id of nodes.keys()) if (id.startsWith('file:')) sourcePaths.add(id.slice(5));
  const candidates = scanCandidates(files, names, [...sourcePaths]);
  const exclusions = new Map();
  for (const exclusion of records.exclusions) {
    if (!exclusion || !nonempty(exclusion.candidate) || !nonempty(exclusion.reason) || !/^[a-f0-9]{64}$/.test(exclusion.sourceDigest)
        || exclusions.has(exclusion.candidate)) { report('invalid-record', exclusion?.candidate ?? '<exclusion>', 'Invalid or duplicate exclusion'); continue; }
    exclusions.set(exclusion.candidate, exclusion);
  }
  for (const candidate of candidates) {
    const declaring = edges.filter(edge => edge.to === candidate.target && edge.evidence.some(item => item.path === candidate.path));
    const exclusion = exclusions.get(candidate.id);
    if (declaring.length && exclusion) { candidate.status = 'conflict'; report('conflicting-classification', candidate.id, candidate.path); }
    else if (declaring.length) { candidate.status = 'dependency'; candidate.edges = declaring.map(edge => edge.id); }
    else if (exclusion) {
      candidate.status = exclusion.sourceDigest === candidate.sourceDigest ? 'excluded' : 'stale';
      candidate.reason = exclusion.reason;
      if (candidate.status === 'stale') report('stale-exclusion', candidate.id, candidate.path);
    } else { candidate.status = 'pending'; report('unclassified-candidate', candidate.id, `${candidate.path} -> ${candidate.target}`); }
  }
  const candidateIds = new Set(candidates.map(candidate => candidate.id));
  for (const id of exclusions.keys()) if (!candidateIds.has(id)) report('orphaned-exclusion', id, 'Candidate no longer exists');

  function scope(name) {
    const paths = new Set([...files.keys()].filter(path => owner(path) === name));
    const pending = [...paths];
    while (pending.length) {
      const path = pending.pop();
      for (const edge of edges) {
        const isSource = edge.from === fileId(path) && edge.to.startsWith('file:');
        const isSkillEvidence = edge.from === skillId(name);
        const dependencies = [...(isSource ? [edge.to.slice(5)] : []), ...((isSource || isSkillEvidence) ? edge.evidence.map(item => item.path) : [])];
        for (const dependency of dependencies) if (!paths.has(dependency)) { paths.add(dependency); pending.push(dependency); }
      }
    }
    return sorted(paths);
  }
  const scopes = {};
  for (const name of names) {
    const paths = scope(name);
    scopes[name] = paths;
    const relevantCandidates = candidates.filter(item => paths.includes(item.path));
    const relevantEdges = edges.filter(edge => edge.from === skillId(name) || (edge.from.startsWith('file:') && paths.includes(edge.from.slice(5))));
    const digest = hash(stable({ sources: paths.map(path => [path, sourceDigest(files, path)]),
      candidates: relevantCandidates.map(item => item.id),
      edges: relevantEdges.map(({ id, from, to, kind, condition, conditional, evidence }) => ({ id, from, to, kind, condition, conditional, evidence: evidence.map(({ path, excerpt }) => ({ path, excerpt })) })),
      exclusions: relevantCandidates.filter(item => exclusions.has(item.id)).map(item => exclusions.get(item.id)),
    }));
    const review = records.reviews[name];
    let status = !review ? 'pending' : !nonempty(review.reviewer) || !nonempty(review.note) || !/^[a-f0-9]{64}$/.test(review.digest) ? 'invalid' : review.digest === digest ? 'reviewed' : 'stale';
    if (status === 'reviewed' && relevantCandidates.some(item => !['dependency', 'excluded'].includes(item.status))) status = 'pending';
    Object.assign(node(skillId(name)), { review: status, sourceDigest: digest, sourcePaths: paths,
      reviewedEmpty: status === 'reviewed' && !edges.some(edge => edge.kind === 'skill' && edge.from === skillId(name)) });
    if (status !== 'reviewed') report(`${status}-review`, name, 'Explicit semantic review against current sources and records is required');
  }
  for (const name of Object.keys(records.reviews)) if (!names.includes(name)) report('orphaned-review', name, 'Skill no longer exists');
  for (const edge of edges) {
    const sourceOwner = edge.from.startsWith('skill:') ? edge.from.slice(6) : owner(edge.from.slice(5));
    if (sourceOwner && nodes.get(skillId(sourceOwner))?.review !== 'reviewed' && edge.status === 'current') edge.status = 'unreviewed';
  }
  return { schemaVersion: 1, source: 'current working files',
    fingerprint: hash(stable({ sources: sorted(sourcePaths).map(path => [path, sourceDigest(files, path)]), records })),
    nodes: [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id, 'en')), edges, provenance, candidates,
    diagnostics, ready: diagnostics.length === 0 };
}

// Enumerate simple paths, not walks: every diamond route stays available while
// cycles cannot recurse forever. Bound output explicitly rather than silently
// claiming complete path coverage in a dense graph.
export function reverseImpact(map, target, { expanded = false, maxPaths = 10000 } = {}) {
  if (!Number.isInteger(maxPaths) || maxPaths < 1) throw new Error('maxPaths must be a positive integer');
  const edges = map.edges.filter(edge => expanded || edge.kind === 'skill');
  const callers = new Map(), cycles = new Set();
  let pathCount = 0, truncated = false;
  function visit(current, path, seen) {
    for (const edge of edges.filter(item => item.to === current)) {
      if (seen.has(edge.from)) { cycles.add(edge.id); continue; }
      if (pathCount >= maxPaths) { truncated = true; return; }
      pathCount++;
      const next = [edge, ...path];
      if (edge.from.startsWith('skill:') && edge.from !== target) {
        if (!callers.has(edge.from)) callers.set(edge.from, { id: edge.from, direct: false, paths: [] });
        const caller = callers.get(edge.from);
        caller.direct ||= next.length === 1;
        caller.paths.push(next.map(({ id, from, to, condition, status }) => ({ id, from, to, condition, status })));
      }
      visit(edge.from, next, new Set([...seen, edge.from]));
    }
  }
  const roots = expanded && target.startsWith('skill:')
    ? [target, ...map.nodes.filter(node => node.kind === 'resource' && node.owner === target.slice(6)).map(node => node.id)] : [target];
  for (const root of roots) visit(root, [], new Set([target, root]));
  return { target, callers: [...callers.values()].sort((a, b) => a.id.localeCompare(b.id, 'en')),
    roots, cycleEdges: sorted(cycles), truncated, maxPaths };
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--impact' || !validId(args[1]))) {
    throw new Error('Usage: node scripts/skill-map.mjs [--impact skill:NAME|file:PATH]');
  }
  const records = JSON.parse(readFileSync(join(root, 'docs/skill-map/relationships.json'), 'utf8'));
  const map = analyzeSkillMap(readSkillMapFiles(root), records);
  console.log(JSON.stringify(args.length ? reverseImpact(map, args[1], { expanded: args[1].startsWith('file:') }) : map, null, 2));
}
