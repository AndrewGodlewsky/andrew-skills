import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, rmSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { artifactPaths, buildSkillMap } from './build-skill-map.mjs';
import { loadSnapshot } from './skill-map-server.mjs';
import { reverseImpact } from './skill-map.mjs';

function workspace(t) {
  const root = mkdtempSync(join(tmpdir(), 'skill-map-workflow-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, content) => { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), content); };
  const records = { schemaVersion: 1, edges: [], provenance: [], exclusions: [], reviews: {} };
  const save = () => write('docs/skill-map/relationships.json', JSON.stringify(records, null, 2) + '\n');
  // Only these tiny authored fixtures are attested here. Production has no
  // auto-review API; real review records must follow source inspection.
  const review = () => {
    save();
    for (const node of loadSnapshot(root).map.nodes.filter(node => node.kind === 'skill' && node.present)) {
      records.reviews[node.label] = { digest: node.sourceDigest, reviewer: 'Fixture author', note: 'Reviewed fixture instructions and explicit test relationships.' };
    }
    save();
  };
  save();
  return { root, write, records, save, review };
}
function contents(root) {
  const result = [];
  function visit(path = '') {
    for (const entry of readdirSync(join(root, path), { withFileTypes: true })) {
      const name = path ? `${path}/${entry.name}` : entry.name;
      if (entry.isDirectory()) visit(name);
      else result.push([name, readFileSync(join(root, name)).toString('base64'), statSync(join(root, name)).mtimeMs]);
    }
  }
  visit(); return result.sort((a, b) => a[0].localeCompare(b[0]));
}
const dependency = (from, to) => ({ id: `${from}-${to}`, from: `skill:${from}`, to: `skill:${to}`, kind: 'skill',
  conditional: true, condition: 'When requested', evidence: [{ path: `skills/${from}/SKILL.md`, excerpt: `Invoke ${to}.` }] });

test('author workflow discovers additions, requires review, preserves impact and rejects stale context/renames/deletions', t => {
  const w = workspace(t);
  w.write('skills/standalone/SKILL.md', 'Explain the input.');
  let result = buildSkillMap({ root: w.root });
  assert.equal(result.ready, false);
  assert.equal(result.map.nodes.find(n => n.id === 'skill:standalone').review, 'pending');
  assert.match(readFileSync(join(w.root, artifactPaths[1]), 'utf8'), /standalone.*Review needed/);
  w.review(); buildSkillMap({ root: w.root });
  assert.equal(buildSkillMap({ root: w.root, check: true }).ready, true);

  w.write('skills/caller/SKILL.md', 'Invoke standalone.\nOnly when requested.');
  result = buildSkillMap({ root: w.root });
  assert.ok(result.diagnostics.some(d => d.code === 'unclassified-candidate'));
  w.records.edges.push(dependency('caller', 'standalone')); w.review();
  result = buildSkillMap({ root: w.root });
  assert.equal(result.ready, true);
  assert.deepEqual(reverseImpact(result.map, 'skill:standalone').callers.map(c => c.id), ['skill:caller']);
  w.write('skills/caller/SKILL.md', 'Invoke standalone.\nOnly after explicit selection.');
  assert.ok(buildSkillMap({ root: w.root, check: true }).diagnostics.some(d => d.code === 'stale-review'));
  w.review(); buildSkillMap({ root: w.root });
  renameSync(join(w.root, 'skills/standalone'), join(w.root, 'skills/renamed'));
  result = buildSkillMap({ root: w.root });
  assert.ok(result.diagnostics.some(d => d.code === 'missing-target'));
  assert.ok(result.diagnostics.some(d => d.code === 'orphaned-review'));
  assert.ok(result.map.nodes.find(n => n.id === 'skill:renamed').review === 'pending');
  w.records.edges = [dependency('caller', 'renamed')];
  delete w.records.reviews.standalone;
  w.write('skills/caller/SKILL.md', 'Invoke renamed.'); w.review();
  assert.equal(buildSkillMap({ root: w.root }).ready, true);
  rmSync(join(w.root, 'skills/renamed/SKILL.md'));
  assert.ok(buildSkillMap({ root: w.root }).diagnostics.some(d => d.code === 'missing-instructions'));
});

test('checking missing/tampered artifacts never writes; repeated generation and CRLF stay deterministic', t => {
  const w = workspace(t); w.write('skills/one/SKILL.md', 'Explain.\n'); w.review();
  const beforeMissing = contents(w.root);
  assert.equal(buildSkillMap({ root: w.root, check: true }).ready, false);
  assert.deepEqual(contents(w.root), beforeMissing);
  buildSkillMap({ root: w.root });
  const first = artifactPaths.map(p => readFileSync(join(w.root, p)));
  buildSkillMap({ root: w.root });
  artifactPaths.forEach((p, i) => assert.deepEqual(readFileSync(join(w.root, p)), first[i]));
  w.write('skills/one/SKILL.md', 'Explain.\r\n');
  for (const path of artifactPaths) w.write(path, readFileSync(join(w.root, path), 'utf8').replaceAll('\n', '\r\n'));
  assert.equal(buildSkillMap({ root: w.root, check: true }).ready, true);
  w.write(artifactPaths[0], '{"nodes":[]}\n');
  w.write(artifactPaths[1], 'Stale presentation\n');
  const before = contents(w.root), result = buildSkillMap({ root: w.root, check: true });
  assert.equal(result.diagnostics.filter(d => d.code === 'stale-artifact').length, 2);
  assert.deepEqual(contents(w.root), before);
  const reviewed = JSON.stringify(w.records);
  w.write('skills/one/SKILL.md', 'Changed.'); buildSkillMap({ root: w.root });
  assert.equal(readFileSync(join(w.root, 'docs/skill-map/relationships.json'), 'utf8'), JSON.stringify(w.records, null, 2) + '\n');
  assert.equal(JSON.stringify(w.records), reviewed);
});

test('shared-source edits invalidate both consumers and copies until rebuilt and reviewed', t => {
  const w = workspace(t);
  w.write('scripts/shared.txt', 'Shared guidance.\n');
  w.write('scripts/builder.mjs', '// Copies maintained guidance.\n');
  for (const name of ['one', 'two']) {
    w.write(`skills/${name}/SKILL.md`, 'Read [guidance](guide.txt).');
    w.write(`skills/${name}/guide.txt`, 'Shared guidance.\n');
    w.records.edges.push({ id: `${name}-guide`, from: `file:skills/${name}/SKILL.md`, to: `file:skills/${name}/guide.txt`, kind: 'resource',
      conditional: false, condition: 'Read before answering', evidence: [{ path: `skills/${name}/SKILL.md`, excerpt: 'Read [guidance](guide.txt).' }] });
    w.records.provenance.push({ copy: `skills/${name}/guide.txt`, sources: ['scripts/shared.txt'], builder: 'scripts/builder.mjs', transform: 'copy', excerpt: '// Copies maintained guidance.' });
  }
  w.review(); assert.equal(buildSkillMap({ root: w.root }).ready, true);
  w.write('scripts/shared.txt', 'Changed shared guidance.\n');
  let result = buildSkillMap({ root: w.root, check: true });
  assert.equal(result.diagnostics.filter(d => d.code === 'stale-copy').length, 2);
  assert.equal(result.diagnostics.filter(d => d.code === 'stale-review').length, 2);
  assert.deepEqual(reverseImpact(result.map, 'file:scripts/shared.txt', { expanded: true }).callers.map(c => c.id), ['skill:one', 'skill:two']);
  for (const name of ['one', 'two']) w.write(`skills/${name}/guide.txt`, 'Changed shared guidance.\n');
  w.review(); buildSkillMap({ root: w.root });
  assert.equal(buildSkillMap({ root: w.root, check: true }).ready, true);
});

test('cycles and conditional edges pass; ambiguous evidence and invalid records fail without rewriting checks', t => {
  const w = workspace(t);
  for (const [a, b] of [['one', 'two'], ['two', 'one']]) { w.write(`skills/${a}/SKILL.md`, `Invoke ${b}.`); w.records.edges.push(dependency(a, b)); }
  w.review(); assert.equal(buildSkillMap({ root: w.root }).ready, true);
  assert.equal(buildSkillMap({ root: w.root, check: true }).ready, true);
  w.write('skills/one/SKILL.md', 'Invoke two.\nInvoke two.');
  assert.ok(buildSkillMap({ root: w.root }).diagnostics.some(d => d.code === 'ambiguous-evidence'));
  w.records.edges.push(null); w.save();
  const before = contents(w.root);
  assert.ok(buildSkillMap({ root: w.root, check: true }).diagnostics.some(d => d.code === 'invalid-record'));
  assert.deepEqual(contents(w.root), before);
  w.write('docs/skill-map/relationships.json', '{bad json');
  assert.throws(() => buildSkillMap({ root: w.root, check: true }), SyntaxError);
});

test('unsupported output targets fail before either artifact is overwritten', t => {
  const w = workspace(t); w.write('skills/one/SKILL.md', 'Explain.'); w.review();
  buildSkillMap({ root: w.root });
  rmSync(join(w.root, artifactPaths[1])); mkdirSync(join(w.root, artifactPaths[1]));
  const before = contents(w.root);
  assert.throws(() => buildSkillMap({ root: w.root }), /regular files and directories/);
  assert.deepEqual(contents(w.root), before);
});
