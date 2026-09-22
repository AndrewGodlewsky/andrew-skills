// THROWAWAY #53 prototype: overview graph linked to a full dependency table.
// Run from the repository root: node docs/prototypes/skill-map/server.mjs
import { createServer } from 'node:http';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const read = path => readFileSync(resolve(root, path), 'utf8').replaceAll('\r\n', '\n');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const declarations = [
  ['create-skills', 'grill-me', 'For the interview', 'Resolve and invoke the selected enabled **GT grill-me** skill for the interview,', false],
  ['create-skills', 'create-issue', 'For submission', '4. Read [submission and recovery](references/submission.md). Resolve the intended\n   enabled GT **create-issue** model-invocable dependency', true],
  ['skill-tweak', 'grill-me', 'For the interview', '3. **Interview through GT Grill Me.** Resolve and invoke the selected enabled\n   **GT grill-me** skill', false],
  ['skill-tweak', 'create-issue', 'When submitting; draft-only work does not require it', '5. **Check submission readiness and show the draft.** If publication is intended,\n   resolve the enabled GT create-issue dependency', true],
  ['skill-steal', 'grill-me', 'When intent is unclear or adaptation could change behavior', '3. When intent is unclear or compatibility work could change behavior, read\n   [clarification and dependencies](references/clarification.md) and invoke the\n   selected enabled GT **grill-me**.', true],
  ['skill-steal', 'create-issue', 'When submitting the review handoff', 'and deliver one handoff through the selected enabled GT **create-issue**.', true],
  ['grill-with-docs', 'grilling', 'Required before the composed workflow starts', 'Before starting, resolve and invoke both enabled dependencies, `grilling` and\n`domain-modeling`', false],
  ['grill-with-docs', 'domain-modeling', 'Required before the composed workflow starts', 'Before starting, resolve and invoke both enabled dependencies, `grilling` and\n`domain-modeling`', false],
];
const resources = ['intent-capture.md', 'intent-record.mjs', 'review-handoff.mjs'];
const sourceFiles = new Set(declarations.map(([caller]) => `skills/${caller}/SKILL.md`));
sourceFiles.add('skills/skills-update/SKILL.md');
for (const caller of ['create-skills', 'skill-tweak']) sourceFiles.add(`scripts/build-${caller}.mjs`);
for (const resource of resources) sourceFiles.add(`scripts/${resource}`);

function evidence(path, quote) {
  const source = read(path);
  const offset = source.indexOf(quote);
  const unique = offset >= 0 && source.indexOf(quote, offset + quote.length) < 0;
  return { path, quote, line: offset < 0 ? null : source.slice(0, offset).split('\n').length, current: unique };
}
function snapshot() {
  const names = readdirSync(resolve(root, 'skills'), { withFileTypes: true }).filter(item => item.isDirectory()).map(item => item.name).sort();
  const digest = createHash('sha256');
  for (const name of names) digest.update(`skills/${name}/SKILL.md\0${read(`skills/${name}/SKILL.md`)}\0`);
  for (const path of [...sourceFiles].filter(path => path.startsWith('scripts/')).sort()) digest.update(`${path}\0${read(path)}\0`);
  const edges = declarations.map(([from, to, condition, quote, conditional], index) => ({
    id: `skill-${index}`, from, to, condition, conditional, kind: 'skill', evidence: evidence(`skills/${from}/SKILL.md`, quote),
  }));
  for (const caller of ['create-skills', 'skill-tweak']) {
    for (const resource of resources) {
      const path = `scripts/build-${caller}.mjs`;
      const line = read(path).split('\n').find(line => line.includes(resource));
      edges.push({ id: `${caller}-${resource}`, from: caller, to: `scripts/${resource}`, condition: 'Packaged by the bundle builder', conditional: false, kind: 'resource', evidence: evidence(path, line ?? resource) });
    }
  }
  return {
    capturedAt: new Date().toISOString(), fingerprint: digest.digest('hex').slice(0, 16),
    skills: names.map(id => ({ id, label: id, kind: 'skill', review: 'Package review needed' })),
    resources: resources.map(name => ({ id: `scripts/${name}`, label: name, kind: 'resource', review: 'Sample build evidence' })),
    edges,
    exclusion: evidence('skills/skills-update/SKILL.md', 'Do not invoke restore, export or inspect\npersonal copies automatically'),
  };
}

createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:43853');
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'GET') { response.writeHead(405).end(); return; }
  if (url.pathname === '/') {
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(readFileSync(resolve(here, 'prototype.html')));
  } else if (url.pathname === '/data') {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(snapshot()));
  } else if (url.pathname === '/source' && sourceFiles.has(url.searchParams.get('path'))) {
    const path = url.searchParams.get('path');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(`<!doctype html><html lang="en"><meta charset="utf-8"><title>${escape(path)}</title><style>body{font:15px/1.6 ui-monospace,monospace;padding:24px;background:#faf9f6;color:#22352f}h1{font-size:20px}pre{white-space:pre-wrap}.line{display:block}.line:target{background:#ffe4a1}a{color:#67786e;margin-right:20px}</style><h1>${escape(path)}</h1><p>Live working file. The quoted evidence in the prototype reflects its last page load.</p><pre>${read(path).split('\n').map((line, index) => `<span class="line" id="L${index + 1}"><a href="#L${index + 1}">${String(index + 1).padStart(3)}</a>${escape(line)}</span>`).join('')}</pre></html>`);
  } else { response.writeHead(404).end('Not found'); }
}).listen(43853, '127.0.0.1', () => console.log('Throwaway skill-map prototype: http://127.0.0.1:43853/?variant=A'));
