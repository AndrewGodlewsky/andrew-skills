const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

export function parseRelease(source, path = 'release.yaml') {
  const content = typeof source === 'string' ? source : new TextDecoder('utf-8', { fatal: true }).decode(source);
  const fields = new Map();
  for (const line of content.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const match = /^(version|notes):[ \t]*(.*?)[ \t]*$/.exec(line);
    check(match, `${path}: only version and notes with single-line quoted strings are supported`);
    const [, key, raw] = match;
    check(!fields.has(key), `${path}: duplicate ${key}`);
    let value;
    if (raw.startsWith('"')) {
      try { value = JSON.parse(raw); } catch { throw new Error(`${path}: invalid quoted ${key}`); }
    } else {
      check(/^'(?:[^']|'')*'$/.test(raw), `${path}: ${key} must be a quoted string`);
      value = raw.slice(1, -1).replaceAll("''", "'");
    }
    check(typeof value === 'string' && value.trim().length > 0, `${path}: ${key} must be a nonempty string`);
    fields.set(key, value);
  }
  check(fields.has('version') && fields.has('notes'), `${path}: version and notes are required`);
  check(versionPattern.test(fields.get('version')), `${path}: version must use stable x.y.z numbering`);
  return Object.fromEntries(fields);
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

function snapshotInfo(files, legacyAllowed) {
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
    if (metadata) {
      skill.release = parseRelease(metadata.data, `skills/${name}/release.yaml`);
      releaseCount++;
    } else {
      check(legacyAllowed, `skills/${name}/release.yaml is required`);
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
export function validateReleaseChange(beforeFiles, afterFiles, { baseCommit, currentMainCommit } = {}) {
  if (baseCommit !== undefined || currentMainCommit !== undefined) {
    check(baseCommit && currentMainCommit && baseCommit === currentMainCommit,
      'Stale comparison base: revalidate the prospective change against current main');
  }
  const before = snapshotInfo(beforeFiles, true);
  const after = snapshotInfo(afterFiles, false);
  const changedSkills = [];
  const addedSkills = [];
  const removedSkills = [];
  for (const [name, skill] of after.skills) {
    const previous = before.skills.get(name);
    if (!previous || before.legacy) {
      check(skill.release.version === '1.0.0', `${name}: new and baseline skills must start at 1.0.0`);
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
  return { baseline: before.legacy, changedSkills, addedSkills, removedSkills, pluginVersion: after.version };
}
