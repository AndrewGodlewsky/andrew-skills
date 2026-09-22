import assert from 'node:assert/strict';
import test from 'node:test';
import { once } from 'node:events';
import { get } from 'node:http';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { analyzeSkillMap } from './skill-map.mjs';
import { createSkillMapServer, loadSnapshot } from './skill-map-server.mjs';
import { graphProjection, layoutGraph, renderMarkdown, renderPage, viewState } from './skill-map-view.mjs';

function fixture() {
  const files = new Map(Object.entries({
    'skills/alpha/SKILL.md': 'Invoke beta.\nInvoke missing.\nExample <script>alert(1)</script>',
    'skills/beta/SKILL.md': 'Invoke gamma.', 'skills/gamma/SKILL.md': 'Invoke beta.',
    'skills/isolated/SKILL.md': 'Explain.'
  }).map(([path, text]) => [path, Buffer.from(text)]));
  const edge = (from, to) => ({ id: `${from}-${to}`, from: `skill:${from}`, to: `skill:${to}`, kind: 'skill',
    conditional: from === 'alpha', condition: from === 'alpha' ? 'Only when requested' : 'Always',
    evidence: [{ path: `skills/${from}/SKILL.md`, excerpt: `Invoke ${to}.` }] });
  const records = { schemaVersion: 1, edges: [edge('alpha', 'beta'), edge('alpha', 'missing'), edge('beta', 'gamma'), edge('gamma', 'beta')], provenance: [], exclusions: [], reviews: {} };
  return { files, records, map: analyzeSkillMap(files, records) };
}

test('incomplete, isolated, missing and cyclic relationships remain navigable with unique callers', () => {
  const { map } = fixture(), search = new URLSearchParams({ selected: 'skill:gamma' });
  const html = renderPage(map, search);
  assert.match(html, /Incomplete preview/);
  assert.match(html, /isolated · Review needed/);
  assert.match(html, /missing — Missing target/);
  assert.match(html, /Cycle present: beta ↔ gamma/);
  assert.match(html, /<strong>2<\/strong><span>skills to review/);
  assert.match(html, /1 direct<br>1 through a path/);
  assert.match(html, /Only when requested/);
  assert.match(html, /skills%2Falpha%2FSKILL.md.*#L1/);
  const model = graphProjection(map, viewState(map, search));
  const layout = layoutGraph(model.nodes, model.edges);
  assert.deepEqual(layout.cycles, [['skill:beta', 'skill:gamma']]);
  assert.ok([...layout.positions.values()].every(p => Number.isFinite(p.x) && Number.isFinite(p.y)));
  assert.doesNotMatch(html, /style=/);
  const table = renderPage(map, new URLSearchParams({ view: 'table', selected: 'skill:gamma' }));
  assert.equal((table.match(/scope="row"/g) ?? []).length, 5);
  assert.match(table, /tr class="selected"[^>]+skill%3Agamma/);
  assert.match(table, /class="row-link"/);
});

test('real simple and expanded views use the same audited evidence and complete inventory', () => {
  const { map } = loadSnapshot();
  const simple = graphProjection(map, viewState(map));
  assert.equal(simple.nodes.length + simple.isolated.length, map.nodes.filter(n => n.kind === 'skill').length);
  assert.ok(simple.edges.every(e => e.kind === 'skill'));
  const html = renderPage(map, new URLSearchParams({ expanded: '1', selected: 'file:scripts/intent-record.mjs' }));
  assert.match(html, /<strong>4<\/strong><span>skills to review/);
  for (const name of ['create-skills', 'help', 'skill-steal', 'skill-tweak']) assert.match(html, new RegExp(`class="caller-title"[^]*?>${name}<`));
  assert.match(html, /source/);
  assert.match(html, /Source evidence/);
  const table = renderPage(map, new URLSearchParams({ view: 'table', expanded: '1' }));
  assert.equal((table.match(/scope="row"/g) ?? []).length, map.nodes.length);
  const text = renderPage(map, new URLSearchParams({ expanded: '1' }), { textOnly: true });
  assert.equal((text.match(/class="edge-detail"/g) ?? []).length, map.edges.length);
  assert.doesNotMatch(text, /<svg/);
  const md = renderMarkdown(map);
  assert.equal(md, renderMarkdown(loadSnapshot().map));
  assert.match(md, /```mermaid\nflowchart LR/);
  assert.match(md, /Saved output cannot detect later edits/);
  assert.equal((md.match(/^### /gm) ?? []).length, map.edges.length);
});

test('query values are escaped, unknown selection resolves safely and filtering preserves selection', () => {
  const { map } = fixture();
  const html = renderPage(map, new URLSearchParams({ view: 'table', q: '<img src=x onerror=alert(1)>', selected: 'skill:gamma' }));
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /&lt;img/);
  assert.match(html, /value="skill:gamma"/);
  assert.match(html, /No entries match/);
  assert.equal(viewState(map, new URLSearchParams({ selected: 'unknown' })).selected, 'skill:alpha');
});

test('HTTP refresh observes local edits, exposes escaped evidence and stays read-only', async t => {
  const state = fixture();
  const root = mkdtempSync(join(tmpdir(), 'skill-map-view-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [path, bytes] of state.files) { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), bytes); }
  mkdirSync(join(root, 'docs/skill-map'), { recursive: true });
  writeFileSync(join(root, 'docs/skill-map/relationships.json'), JSON.stringify(state.records));
  const server = createSkillMapServer({ snapshot: () => loadSnapshot(root) });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const first = await fetch(`${base}/data.json`), original = await first.json();
  assert.equal(first.headers.get('cache-control'), 'no-store');
  assert.match(first.headers.get('content-security-policy'), /default-src 'none'/);
  writeFileSync(join(root, 'skills/alpha/SKILL.md'), 'Invoke beta.\nChanged context <script>alert(1)</script>');
  const second = await (await fetch(`${base}/data.json`)).json();
  assert.notEqual(second.fingerprint, original.fingerprint);
  const source = await (await fetch(`${base}/source?path=skills/alpha/SKILL.md&snapshot=${original.fingerprint}`)).text();
  assert.match(source, /Source snapshot changed/);
  assert.match(source, /id="L1"/);
  assert.match(source, /&lt;script&gt;/);
  assert.doesNotMatch(source, /<script>/);
  assert.equal((await fetch(`${base}/source?path=../../outside`)).status, 404);
  assert.equal((await fetch(`${base}/`, { method: 'POST' })).status, 405);
  const foreignHostStatus = await new Promise((resolve, reject) => get(`${base}/`, { headers: { Host: 'example.com' } }, response => { response.resume(); resolve(response.statusCode); }).on('error', reject));
  assert.equal(foreignHostStatus, 403);
  assert.equal((await fetch(`${base}/viewer.mjs`)).status, 200);
  assert.equal((await fetch(`${base}/unknown`)).status, 404);
  const before = JSON.stringify([...loadSnapshot(root).files]);
  for (const route of ['/', '/text?expanded=1', '/map.md']) assert.equal((await fetch(`${base}${route}`)).status, 200);
  assert.equal(JSON.stringify([...loadSnapshot(root).files]), before);
});

test('load errors remain explicit rather than serving an old successful snapshot', async t => {
  const server = createSkillMapServer({ snapshot: () => { throw new Error('Malformed <records>'); } });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  const response = await fetch(`http://127.0.0.1:${server.address().port}/`);
  assert.equal(response.status, 500);
  assert.match(await response.text(), /Malformed &lt;records&gt;/);
});
