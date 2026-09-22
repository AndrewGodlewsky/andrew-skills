import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeSkillMap, expectedCopy, inventorySkills, readSkillMapFiles, reverseImpact, scanCandidates, sourceDigest } from './skill-map.mjs';

const collection = entries => new Map(Object.entries(entries).map(([path, content]) => [path, Buffer.from(content)]));
const records = () => ({ schemaVersion: 1, edges: [], provenance: [], exclusions: [], reviews: {} });
const skill = (name, content) => [`skills/${name}/SKILL.md`, content];
const edge = (from, to, excerpt = `Invoke ${to}.`) => ({ id: `${from}-${to}`, from: `skill:${from}`, to: `skill:${to}`,
  kind: 'skill', conditional: false, condition: 'During this workflow', evidence: [{ path: `skills/${from}/SKILL.md`, excerpt }] });
// Test fixtures explicitly attest only their tiny reviewed instruction strings.
function review(files, data) {
  for (const node of analyzeSkillMap(files, data).nodes.filter(node => node.kind === 'skill' && node.present)) {
    data.reviews[node.label] = { digest: node.sourceDigest, reviewer: 'Fixture reviewer', note: 'Reviewed this fixture.' };
  }
  return analyzeSkillMap(files, data);
}

test('new standalone skills are discovered but never implicitly reviewed', () => {
  const files = collection(Object.fromEntries([skill('alpha', 'Explain the input.')])), data = records();
  assert.equal(analyzeSkillMap(files, data).nodes.find(n => n.id === 'skill:alpha').review, 'pending');
  assert.equal(review(files, data).nodes.find(n => n.id === 'skill:alpha').reviewedSkillIndependent, true);
  files.set('skills/beta/SKILL.md', Buffer.from('Summarize the input.'));
  const changed = analyzeSkillMap(files, data);
  assert.equal(changed.nodes.find(n => n.id === 'skill:beta').review, 'pending');
  assert.equal(changed.ready, false);
});

test('new dependencies, changed conditions and context outside quotes invalidate review', () => {
  const files = collection(Object.fromEntries([skill('alpha', 'Invoke beta.\nOnly after selection.'), skill('beta', 'Explain.')])), data = records();
  data.edges.push(edge('alpha', 'beta'));
  assert.equal(review(files, data).ready, true);
  files.set('skills/alpha/SKILL.md', Buffer.from('Invoke beta.\nDo not follow this instruction unless approved.'));
  const changed = analyzeSkillMap(files, data);
  assert.equal(changed.edges.find(e => e.id === 'alpha-beta').evidence[0].status, 'current');
  assert.equal(changed.nodes.find(n => n.id === 'skill:alpha').review, 'stale');
  review(files, data);
  data.edges[0].condition = 'When publishing';
  assert.equal(analyzeSkillMap(files, data).nodes.find(n => n.id === 'skill:alpha').review, 'stale');
});

test('renaming and deleting targets retain unresolved edges; no guessed rename', () => {
  const files = collection(Object.fromEntries([skill('alpha', 'Invoke beta.'), skill('beta', 'Explain.')])), data = records();
  data.edges.push(edge('alpha', 'beta')); review(files, data);
  files.delete('skills/beta/SKILL.md'); files.set('skills/beta-new/SKILL.md', Buffer.from('Explain.'));
  const map = analyzeSkillMap(files, data);
  assert.equal(map.nodes.find(n => n.id === 'skill:beta').present, false);
  assert.equal(map.edges.find(e => e.id === 'alpha-beta').to, 'skill:beta');
  assert.ok(map.diagnostics.some(d => d.code === 'missing-target'));
  assert.ok(map.diagnostics.some(d => d.code === 'orphaned-review'));
});

test('changed exclusions and new inventory references cannot inherit a prior classification', () => {
  const files = collection(Object.fromEntries([skill('alpha', 'Recommend beta, but do not invoke it.'), skill('beta', 'Explain.')])), data = records();
  const candidate = scanCandidates(files, ['alpha', 'beta'])[0];
  data.exclusions.push({ candidate: candidate.id, reason: 'Recommendation only', sourceDigest: candidate.sourceDigest });
  assert.equal(review(files, data).ready, true);
  files.set('skills/alpha/SKILL.md', Buffer.from('Invoke beta.'));
  assert.ok(analyzeSkillMap(files, data).diagnostics.some(d => d.code === 'stale-exclusion'));
  const other = collection(Object.fromEntries([skill('alpha', 'Invoke future-skill.')])), plain = records();
  review(other, plain);
  other.set('skills/future-skill/SKILL.md', Buffer.from('Explain.'));
  const changed = analyzeSkillMap(other, plain);
  assert.ok(changed.candidates.some(c => c.target === 'skill:future-skill' && c.status === 'pending'));
  assert.equal(changed.nodes.find(n => n.id === 'skill:alpha').review, 'stale');
});

test('scanner keeps evidence for aliases, absent namespaced targets, imports and example links', () => {
  const files = collection({ 'skills/alpha/SKILL.md': 'Use GT Grill Me. /gt:missing-skill\n[Example](missing.md)',
    'skills/alpha/run.mjs': "import { x } from './helper.mjs';", 'skills/alpha/run.py': 'from .helper import run' });
  const cs = scanCandidates(files, ['alpha', 'grill-me']);
  for (const target of ['skill:grill-me', 'skill:missing-skill', 'file:skills/alpha/missing.md', 'file:skills/alpha/helper.mjs', 'file:skills/alpha/helper.py']) {
    assert.ok(cs.some(c => c.target === target), target);
  }
  assert.ok(cs.every(c => c.occurrences[0].line >= 1 && c.sourceDigest.length === 64));
});

test('stale or ambiguous quotes and malformed records are diagnostics, not hidden edges', () => {
  const files = collection(Object.fromEntries([skill('alpha', 'Invoke beta.\nInvoke beta.'), skill('beta', 'Explain.')])), data = records();
  data.edges.push(edge('alpha', 'beta'));
  let map = analyzeSkillMap(files, data);
  assert.ok(map.diagnostics.some(d => d.code === 'ambiguous-evidence'));
  files.set('skills/alpha/SKILL.md', Buffer.from('The instruction was removed.'));
  map = analyzeSkillMap(files, data);
  assert.ok(map.edges.some(e => e.id === 'alpha-beta' && e.status === 'stale'));
  data.edges.push({ ...edge('alpha', 'beta'), id: 'escape', to: 'file:../../outside' });
  data.edges.push(null);
  assert.equal(analyzeSkillMap(files, data).diagnostics.filter(d => d.code === 'invalid-record').length, 2);
});

test('diamond paths, conditional edges and cycles preserve unique caller counts', () => {
  const map = { edges: [['alpha','beta'],['alpha','delta'],['beta','gamma'],['delta','gamma'],['gamma','beta'],['gamma','gamma']]
    .map(([from,to]) => ({ ...edge(from,to), condition: `${from} chooses ${to}` })) };
  const impact = reverseImpact(map, 'skill:gamma');
  assert.deepEqual(impact.callers.map(c => c.id), ['skill:alpha','skill:beta','skill:delta']);
  assert.equal(impact.callers.find(c => c.id === 'skill:alpha').paths.length, 2);
  assert.equal(impact.callers.find(c => c.id === 'skill:alpha').direct, false);
  assert.equal(impact.callers.find(c => c.id === 'skill:beta').direct, true);
  assert.ok(impact.cycleEdges.includes('gamma-gamma'));
  assert.equal(impact.truncated, false);
  assert.equal(reverseImpact(map, 'skill:gamma', { maxPaths: 1 }).truncated, true);
});

function sharedFixture() {
  const files = collection({ 'skills/alpha/SKILL.md': 'Read [guide](guide.md).', 'skills/beta/SKILL.md': 'Read [guide](guide.md).',
    'skills/alpha/guide.md': 'Explain.', 'skills/beta/guide.md': 'Explain.', 'scripts/guide.md': 'Explain.', 'scripts/build.mjs': 'Copy the guide.' });
  const data = records();
  for (const name of ['alpha','beta']) {
    data.edges.push({ id: `${name}-guide`, from:`file:skills/${name}/SKILL.md`, to:`file:skills/${name}/guide.md`, kind:'resource', conditional:false, condition:'Before starting', evidence:[{path:`skills/${name}/SKILL.md`,excerpt:'Read [guide](guide.md).'}] });
    data.provenance.push({copy:`skills/${name}/guide.md`,sources:['scripts/guide.md'],builder:'scripts/build.mjs',transform:'copy',excerpt:'Copy the guide.'});
  }
  return { files, data };
}

test('shared-source drift invalidates both consumers and reports copy drift independently', () => {
  const {files,data} = sharedFixture();
  assert.equal(review(files,data).ready,true);
  files.set('scripts/guide.md',Buffer.from('Explain more.'));
  const map=analyzeSkillMap(files,data);
  assert.equal(map.diagnostics.filter(d=>d.code==='stale-copy').length,2);
  assert.equal(map.nodes.filter(n=>n.kind==='skill'&&n.review==='stale').length,2);
  const impact=reverseImpact(map,'file:scripts/guide.md',{expanded:true});
  assert.deepEqual(impact.callers.map(c=>c.id),['skill:alpha','skill:beta']);
  assert.ok(impact.callers.every(c=>c.paths[0].some(e=>e.from.includes('/guide.md'))));
  files.delete('scripts/guide.md');
  assert.ok(analyzeSkillMap(files,data).diagnostics.some(d=>d.code==='missing-target'));
});

test('expanded skill impact includes consumers of its maintained resources without inventing a skill invocation', () => {
  const {files,data}=sharedFixture();
  files.set('skills/alpha/maintained.md',Buffer.from('Explain.'));
  data.provenance[1].sources=['skills/alpha/maintained.md'];
  const map=review(files,data);
  assert.deepEqual(reverseImpact(map,'skill:alpha').callers,[]);
  assert.deepEqual(reverseImpact(map,'skill:alpha',{expanded:true}).callers.map(c=>c.id),['skill:beta']);
});

test('adapted copies do not inherit removed runtime dependencies from their maintained source', () => {
  const map={nodes:[],edges:[
    {id:'a-entry',from:'skill:alpha',to:'file:original',kind:'entry'},
    {id:'b-entry',from:'skill:beta',to:'file:adapted',kind:'entry'},
    {id:'use',from:'file:original',to:'file:old-guide',kind:'resource'},
    {id:'source',from:'file:adapted',to:'file:original',kind:'source'},
    {id:'build',from:'file:adapted',to:'file:builder',kind:'build'},
    {id:'import',from:'file:builder',to:'file:transform',kind:'resource'},
  ]};
  assert.deepEqual(reverseImpact(map,'file:old-guide',{expanded:true}).callers.map(c=>c.id),['skill:alpha']);
  assert.deepEqual(reverseImpact(map,'file:original',{expanded:true}).callers.map(c=>c.id),['skill:alpha','skill:beta']);
  assert.deepEqual(reverseImpact(map,'file:transform',{expanded:true}).callers.map(c=>c.id),['skill:beta']);
});

test('source and review fingerprints normalize CRLF text but preserve binary bytes and additions', () => {
  const {files,data}=sharedFixture();
  for (const [path, bytes] of files) files.set(path, Buffer.from(bytes.toString()+'\n'));
  const first=review(files,data);
  const changed=new Map([...files].map(([p,b])=>[p,Buffer.from(b.toString().replaceAll('\n','\r\n'))]));
  assert.deepEqual(analyzeSkillMap(changed,data), first);
  assert.equal(sourceDigest(collection({'LICENSE':'Terms.\r\n'}),'LICENSE'),sourceDigest(collection({'LICENSE':'Terms.\n'}),'LICENSE'));
  assert.notEqual(sourceDigest(collection({'a.txt':Buffer.from([255])}),'a.txt'),sourceDigest(collection({'a.txt':Buffer.from([254])}),'a.txt'));
  files.set('skills/alpha/asset.bin', Buffer.from([0,13,10,255]));
  const before=sourceDigest(files,'skills/alpha/asset.bin');
  files.set('skills/alpha/asset.bin',Buffer.from([0,10,255]));
  assert.notEqual(sourceDigest(files,'skills/alpha/asset.bin'), before);
  assert.equal(analyzeSkillMap(files,data).nodes.find(n=>n.id==='skill:alpha').review,'stale');
  assert.deepEqual(analyzeSkillMap(files,data),analyzeSkillMap(files,data));
});

test('repository reader includes untracked additions and performs no writes', () => {
  const root=mkdtempSync(join(tmpdir(),'gt-skill-map-'));
  try {
    mkdirSync(join(root,'skills/alpha'),{recursive:true});
    mkdirSync(join(root,'skills/empty'),{recursive:true});
    const path=join(root,'skills/alpha/SKILL.md');writeFileSync(path,'Explain.');
    const before=readFileSync(path);
    const map=analyzeSkillMap(readSkillMapFiles(root),records());
    assert.ok(map.nodes.some(n=>n.id==='skill:alpha'));
    assert.ok(map.nodes.some(n=>n.id==='skill:empty' && !n.present));
    assert.ok(map.diagnostics.some(d=>d.code==='missing-instructions'));
    assert.deepEqual(readFileSync(path),before);
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('provenance transforms use maintained guidance and reject unsupported transformations', () => {
  const files=collection({'scripts/source.mjs':"import x from '../shared.mjs';\r\n"});
  assert.equal(expectedCopy(files,{sources:['scripts/source.mjs'],transform:'local-imports'}),"import x from './shared.mjs';\n");
  assert.throws(()=>expectedCopy(files,{sources:['scripts/source.mjs'],transform:'guess'}),/Unsupported/);
});

test('repository audit covers every current skill with evidence and all known shared consumers', () => {
  const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
  const data=JSON.parse(readFileSync(join(root,'docs/skill-map/relationships.json'),'utf8'));
  const files=readSkillMapFiles(root), map=analyzeSkillMap(files,data);
  assert.deepEqual(map.diagnostics,[]);
  assert.deepEqual(map.nodes.filter(n=>n.kind==='skill').map(n=>n.label).sort(), inventorySkills(files));
  assert.deepEqual(reverseImpact(map,'skill:grill-me').callers.map(c=>c.id),['skill:create-skills','skill:skill-steal','skill:skill-tweak']);
  assert.deepEqual(reverseImpact(map,'file:scripts/intent-record.mjs',{expanded:true}).callers.map(c=>c.id),['skill:create-skills','skill:skill-steal','skill:skill-tweak']);
  assert.deepEqual(reverseImpact(map,'file:scripts/intent-capture.md',{expanded:true}).callers.map(c=>c.id),['skill:create-skills','skill:skill-tweak']);
  assert.ok(!map.edges.some(e=>e.from==='skill:skills-update'&&e.to==='skill:skills-restore'));
  const modified = new Map(files);
  modified.set('scripts/intent-capture.md', Buffer.concat([files.get('scripts/intent-capture.md'),Buffer.from('\nClarification changed.\n')]));
  const after=analyzeSkillMap(modified,data);
  assert.equal(after.nodes.find(n=>n.id==='skill:skill-steal').review,'reviewed');
  assert.equal(after.nodes.find(n=>n.id==='skill:create-skills').review,'stale');
  assert.equal(after.nodes.find(n=>n.id==='skill:skill-tweak').review,'stale');
});
