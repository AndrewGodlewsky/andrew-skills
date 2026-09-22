import { isDeepStrictEqual } from 'node:util';

const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
export const BASELINE_PATH = 'release-baseline.json';

function check(condition, message) {
  if (!condition) throw new Error(message);
}

export function parseRelease(source, path = 'release.yaml') {
  const content = typeof source === 'string' ? source : new TextDecoder('utf-8', { fatal: true }).decode(source);
  const fields = new Map();
  const history = [];
  let entry;
  let inHistory = false;
  let historyBlock = false;
  for (const line of content.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (/^history: *(?:\[\])? *$/.test(line)) {
      check(!fields.has('history'), `${path}: duplicate history`);
      fields.set('history', history);
      inHistory = !line.includes('[]');
      historyBlock = inHistory;
      entry = undefined;
      continue;
    }
    const item = /^  - period: ([1-9]\d*) *$/.exec(line);
    if (item) {
      check(inHistory, `${path}: history entries require a history block`);
      entry = new Map([['period', Number(item[1])]]);
      history.push(entry);
      continue;
    }
    const match = /^(    )?(version|notes|period): *(.*?) *$/.exec(line);
    check(match, `${path}: unsupported metadata structure; use version, notes, period and history`);
    const [, indent, key, raw] = match;
    const target = indent ? entry : fields;
    check(target && (!indent || inHistory), `${path}: unexpected history field`);
    if (!indent) { inHistory = false; entry = undefined; }
    check(!target.has(key), `${path}: duplicate ${key}`);
    let value;
    if (key === 'period') {
      check(/^[1-9]\d*$/.test(raw), `${path}: period must be a positive safe integer`);
      value = Number(raw);
    } else if (raw.startsWith('"')) {
      try { value = JSON.parse(raw); } catch { throw new Error(`${path}: invalid quoted ${key}`); }
    } else {
      check(/^'(?:[^']|'')*'$/.test(raw), `${path}: ${key} must be a quoted string`);
      value = raw.slice(1, -1).replaceAll("''", "'");
    }
    if (key !== 'period') check(typeof value === 'string' && value.trim().length > 0, `${path}: ${key} must be a nonempty string`);
    target.set(key, value);
  }
  check(['version', 'notes', 'period', 'history'].every(key => fields.has(key)), `${path}: version, notes, period and history are required`);
  check(!historyBlock || history.length > 0, `${path}: empty history must use []`);
  const result = { ...Object.fromEntries(fields), history: history.map(item => Object.fromEntries(item)) };
  let previous;
  for (const release of [...result.history, releaseEntry(result)]) {
    check(Object.keys(release).length === 3 && typeof release.notes === 'string' && release.notes.trim(), `${path}: every release requires period, version and nonempty notes`);
    check(Number.isSafeInteger(release.period) && release.period > 0, `${path}: period must be a positive safe integer`);
    check(typeof release.version === 'string' && versionPattern.test(release.version), `${path}: version must use stable x.y.z numbering`);
    if (!previous) check(release.period === 1 && release.version === '1.0.0', `${path}: history must begin with period 1 version 1.0.0`);
    else if (release.period === previous.period) check(nextVersions(previous.version).includes(release.version), `${path}: history requires one patch, minor or major step in chronological order without duplicate releases`);
    else check(release.period === previous.period + 1 && release.version === '1.0.0', `${path}: a new period must follow the previous period and start at 1.0.0`);
    previous = release;
  }
  return result;
}

export const releaseEntry = ({ period, version, notes }) => ({ period, version, notes });

export function readBaseline(files) {
  const file = files.get(BASELINE_PATH);
  if (!file) return null;
  check(file.mode === '100644', 'Publication boundary must be a regular non-executable file');
  const source = new TextDecoder('utf8', { fatal: true }).decode(file.data).replaceAll('\r\n', '\n');
  const value = JSON.parse(source);
  check(value && value.formatVersion === 2 && /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(value.parentCommit), 'Invalid publication boundary');
  check(source === JSON.stringify({ formatVersion: 2, parentCommit: value.parentCommit }, null, 2) + '\n', 'Publication boundary must use the exact canonical schema');
  return value;
}

function nextVersions(version) {
  const [major, minor, patch] = version.split('.').map(BigInt);
  return [`${major}.${minor}.${patch + 1n}`, `${major}.${minor + 1n}.0`, `${major + 1n}.0.0`];
}

function sameFiles(left, right) {
  return left.size === right.size && [...left].every(([path, file]) => {
    const other = right.get(path);
    return other && file.mode === other.mode && (file.identity && other.identity
      ? file.identity === other.identity : file.data.equals(other.data));
  });
}

function sortedJson(value) {
  if (Array.isArray(value)) return value.map(sortedJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, sortedJson(value[key])]));
  }
  return value;
}

function snapshotInfo(files, development = false) {
  const readJson = path => {
    check(files.has(path), `Missing ${path} in release snapshot`);
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(files.get(path).data));
  };
  const plugin = readJson('plugin.json');
  const marketplace = readJson('.claude-plugin/marketplace.json');
  check(plugin.name === 'gt' && typeof plugin.version === 'string' && versionPattern.test(plugin.version),
    'Release snapshot plugin must be gt with an x.y.z version');
  check(marketplace.name === 'andrew-skills' && marketplace.plugins?.length === 1 &&
    marketplace.plugins[0].name === 'gt' && marketplace.plugins[0].source === './' &&
    marketplace.plugins[0].version === plugin.version, 'Marketplace and plugin versions/identity must match');
  const skills = new Map();
  for (const [path, file] of files) {
    if (!path.startsWith('skills/') && !path.startsWith('exporter/') && !['plugin.json', '.claude-plugin/marketplace.json'].includes(path)) continue;
    check(['100644', '100755'].includes(file.mode), `${path}: unsupported file mode ${file.mode}`);
    if (!path.startsWith('skills/')) continue;
    const [, name, ...parts] = path.split('/');
    check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) && parts.length > 0 &&
      parts.every(part => part && part !== '.' && part !== '..' && !part.includes('\\')),
    `${path}: invalid skill resource path`);
    if (!skills.has(name)) skills.set(name, { files: new Map() });
    skills.get(name).files.set(parts.join('/'), file);
  }
  let releaseCount = 0;
  for (const [name, skill] of skills) {
    check(skill.files.has('SKILL.md'), `${name}: SKILL.md is required`);
    const metadata = skill.files.get('release.yaml');
    if (development) continue;
    if (metadata) {
      skill.release = parseRelease(metadata.data, `skills/${name}/release.yaml`);
      releaseCount++;
    } else {
      check(false, `skills/${name}/release.yaml is required`);
    }
  }
  check(releaseCount === 0 || releaseCount === skills.size, 'Partial metadata baseline is invalid');
  const version = plugin.version;
  delete plugin.version;
  delete marketplace.plugins[0].version;
  const config = JSON.stringify(sortedJson({
    plugin, marketplace,
    modes: [files.get('plugin.json').mode, files.get('.claude-plugin/marketplace.json').mode],
  }));
  const exporter = new Map([...files].filter(([path]) => path.startsWith('exporter/')));
  return { skills, version, config, exporter, legacy: skills.size > 0 && releaseCount === 0 };
}

// Snapshots contain repository-relative paths mapped to { mode, data: Buffer }.
// This public boundary is also reusable by the later Git-history catalog.
export function validateReleaseChange(beforeFiles, afterFiles, { baseCommit, currentMainCommit, publishedRecords } = {}) {
  if (baseCommit !== undefined || currentMainCommit !== undefined) {
    check(baseCommit && currentMainCommit && baseCommit === currentMainCommit,
      'Stale comparison base: revalidate the prospective change against current main');
  }
  const oldBoundary = readBaseline(beforeFiles);
  const boundary = readBaseline(afterFiles);
  check(boundary, 'An explicit publication boundary is required; development releases are unavailable');
  const baseline = !oldBoundary;
  if (baseline) check(baseCommit === boundary.parentCommit, 'Initial publication boundary must name the exact comparison parent');
  else check(isDeepStrictEqual(oldBoundary, boundary), 'Established publication boundary cannot change or be removed');
  const before = snapshotInfo(beforeFiles, baseline);
  const after = snapshotInfo(afterFiles, false);
  if (baseline) check(before.skills.size === after.skills.size && [...before.skills.keys()].every(name => after.skills.has(name)) && after.skills.size > 0,
    'Initial migration must reset every active skill atomically without removing or renaming skills');
  const changedSkills = [];
  const addedSkills = [];
  const removedSkills = [];
  for (const [name, skill] of after.skills) {
    const previous = before.skills.get(name);
    if (!previous || baseline) {
      check(skill.release.version === '1.0.0', `${name}: new and baseline skills must start at 1.0.0`);
      if (baseline) check(skill.release.period === 1 && skill.release.history.length === 0, `${name}: initial migration requires period 1 with empty history`);
      else {
        check(Array.isArray(publishedRecords), 'Published catalog records are required to validate a new or returning skill');
        const earlier = publishedRecords.filter(record => record.skill === name).map(releaseEntry);
        check(isDeepStrictEqual(skill.release.history, earlier) && skill.release.period === (earlier.at(-1)?.period ?? 0) + 1,
          `${name}: returning history must preserve every actual publication and start the next period`);
      }
      (previous ? changedSkills : addedSkills).push(name);
    } else if (!sameFiles(previous.files, skill.files)) {
      const contentOnly = files => new Map([...files].filter(([path]) => path !== 'release.yaml'));
      const contentChanged = !sameFiles(contentOnly(previous.files), contentOnly(skill.files)) ||
        previous.files.get('release.yaml').mode !== skill.files.get('release.yaml').mode;
      check(contentChanged || previous.release.notes !== skill.release.notes,
        `${name}: version-only bookkeeping or metadata formatting is not a substantive release`);
      const allowedVersions = nextVersions(previous.release.version);
      if (!contentChanged) check(skill.release.version === allowedVersions[0],
        `${name}: a note-only correction requires patch version ${allowedVersions[0]}`);
      check(allowedVersions.includes(skill.release.version),
        `${name}: changed content/notes requires one patch, minor or major step from ${previous.release.version}`);
      check(skill.release.period === previous.release.period && isDeepStrictEqual(skill.release.history, [...previous.release.history, releaseEntry(previous.release)]),
        `${name}: history must append the previous release exactly, without invented, missing or revised entries`);
      changedSkills.push(name);
    }
  }
  for (const name of before.skills.keys()) {
    if (!after.skills.has(name)) removedSkills.push(name);
  }
  const bundleChanged = changedSkills.length + addedSkills.length + removedSkills.length > 0 || before.config !== after.config || !sameFiles(before.exporter, after.exporter);
  const expectedPlugin = bundleChanged ? nextVersions(before.version)[0] : before.version;
  check(after.version === expectedPlugin,
    `plugin version must be ${expectedPlugin} (${bundleChanged ? 'one patch per bundle change' : 'no bundle change'})`);
  return { baseline, changedSkills, addedSkills, removedSkills, pluginVersion: after.version };
}
