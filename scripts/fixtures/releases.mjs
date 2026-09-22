import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

export const parentCommit = '0'.repeat(39) + '1';
export const boundary = parent => JSON.stringify({ formatVersion: 2, parentCommit: parent }, null, 2) + '\n';
export const entry = (version = '1.0.0', notes = 'Initial release.', period = 1) => ({ period, version, notes });
export function metadata(version = '1.0.0', notes = 'Initial release.', history = [], period = 1) {
  return `version: ${JSON.stringify(version)}\nnotes: ${JSON.stringify(notes)}\nperiod: ${period}\nhistory:` +
    (history.length ? '\n' + history.map(item => `  - period: ${item.period}\n    version: ${JSON.stringify(item.version)}\n    notes: ${JSON.stringify(item.notes)}\n`).join('') : ' []\n');
}

// All Git writes here are confined to a new disposable test repository.
export function releaseRepository(t, { later = true, publication = 'squash' } = {}) {
  const parent = resolve(tmpdir());
  const root = mkdtempSync(join(parent, 'gt-history-fixture-'));
  t.after(() => {
    assert.equal(dirname(root), parent);
    assert.ok(root.startsWith(join(parent, 'gt-history-fixture-')));
    rmSync(root, { recursive: true, force: true });
  });
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (key.startsWith('GIT_')) delete env[key];
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { env, encoding: 'utf8', windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  const write = (path, data) => { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), data); };
  const manifests = version => {
    write('plugin.json', JSON.stringify({ $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', name: 'gt', version, description: 'Fixture' }));
    write('.claude-plugin/marketplace.json', JSON.stringify({ name: 'andrew-skills', owner: { name: 'Fixture' }, plugins: [{ name: 'gt', source: './', version, description: 'Fixture' }] }));
  };
  const commit = message => { git('add', '.'); git('commit', '-m', message); return git('rev-parse', 'HEAD'); };
  git('init', '-b', 'main');
  git('config', 'user.name', 'Release Fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'core.autocrlf', 'false');
  git('config', 'commit.gpgsign', 'false');
  git('remote', 'add', 'origin', 'https://github.com/AndrewGodlewsky/andrew-skills');
  manifests('0.1.20');
  write('skills/grill-me/SKILL.md', '---\nname: grill-me\ndescription: Explain supplied text.\nuser-invocable: true\ndisable-model-invocation: true\n---\nRead [the example](example.txt) and explain the supplied text.\n');
  write('skills/grill-me/example.txt', 'Development resource.\n');
  write('skills/grill-me/release.yaml', 'version: "1.0.0"\nnotes: "Discarded old baseline."\n');
  const oldBaseline = commit('Old development baseline');
  manifests('0.1.21');
  write('skills/grill-me/release.yaml', 'version: "3.2.1"\nnotes: "Discarded development update."\n');
  const development = commit('Development');
  git('checkout', '-b', 'migration');
  manifests('0.1.22');
  write('release-baseline.json', boundary(development));
  write('skills/grill-me/release.yaml', metadata());
  write('skills/grill-me/example.txt', 'Baseline resource.\n');
  const draft = commit('Migration draft');
  write('skills/grill-me/example.txt', 'Finished baseline resource.\n');
  const candidate = commit('Finished migration');
  git('checkout', 'main');
  if (publication === 'merge') git('merge', '--no-ff', 'migration', '-m', 'Publish baseline');
  else { git('merge', '--squash', 'migration'); git('commit', '-m', 'Publish baseline'); }
  const baseline = git('rev-parse', 'HEAD');
  let next;
  if (later) {
    manifests('0.1.23');
    write('skills/grill-me/release.yaml', metadata('1.1.0', 'Explain more.', [entry()]));
    write('skills/grill-me/example.txt', 'Later resource.\n');
    next = commit('Publish next release');
    write('README.md', 'Unchanged skill publication.\n');
    commit('Repository documentation');
  }
  const head = git('rev-parse', 'HEAD');
  git('update-ref', 'refs/remotes/origin/main', head);
  return { root, git, write, manifests, commit, oldBaseline, development, draft, candidate, baseline, next, head };
}
