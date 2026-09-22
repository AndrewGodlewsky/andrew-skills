import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { analyzeSkillMap, readSkillMapFiles } from './skill-map.mjs';
import { escapeHtml as h, renderMarkdown, renderPage } from './skill-map-view.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repository = resolve(here, '..');

export function loadSnapshot(root = repository) {
  const files = readSkillMapFiles(root);
  const records = JSON.parse(readFileSync(join(root, 'docs/skill-map/relationships.json'), 'utf8'));
  return { map: analyzeSkillMap(files, records), files };
}

export function createSkillMapServer({ snapshot = () => loadSnapshot(), assets = join(here, 'skill-map-ui') } = {}) {
  return createServer((request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'self'; script-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
    function send(code, type, content) { response.writeHead(code, { 'Content-Type': `${type}; charset=utf-8` }); response.end(content); }
    if (request.method !== 'GET') { response.setHeader('Allow', 'GET'); send(405, 'text/plain', 'Read-only viewer: GET only.'); return; }
    const expected = `127.0.0.1:${response.socket.localPort}`;
    if (![expected, `localhost:${response.socket.localPort}`].includes(request.headers.host)) { send(403, 'text/plain', 'Use the loopback viewer URL.'); return; }
    try {
      const url = new URL(request.url, `http://${expected}`);
      if (url.pathname === '/viewer.css' || url.pathname === '/viewer.mjs') {
        send(200, url.pathname.endsWith('.css') ? 'text/css' : 'text/javascript', readFileSync(join(assets, url.pathname.slice(1)))); return;
      }
      if (!['/', '/text', '/data.json', '/map.md', '/source'].includes(url.pathname)) { send(404, 'text/plain', 'Not found.'); return; }
      const { map, files } = snapshot();
      if (url.pathname === '/data.json') { send(200, 'application/json', JSON.stringify(map, null, 2) + '\n'); return; }
      if (url.pathname === '/map.md') {
        response.setHeader('Content-Disposition', 'attachment; filename="map.md"');
        send(200, 'text/markdown', renderMarkdown(map)); return;
      }
      if (url.pathname === '/source') {
        const path = url.searchParams.get('path');
        const allowed = map.nodes.some(node => node.id === `file:${path}`) || map.edges.some(edge => edge.evidence.some(item => item.path === path));
        if (!allowed || !files.has(path)) { send(404, 'text/plain', 'This source is missing or is not part of the analyzed map.'); return; }
        const bytes = files.get(path);
        let source;
        try { if (bytes.includes(0)) throw new Error('binary'); source = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replaceAll('\r\n', '\n'); }
        catch { send(415, 'text/plain', 'Binary source: inspect this resource with an appropriate local viewer.'); return; }
        const changed = url.searchParams.has('snapshot') && url.searchParams.get('snapshot') !== map.fingerprint;
        send(200, 'text/html', `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${h(path)}</title><link rel="stylesheet" href="/viewer.css"><main><a href="/">Back to skill map</a><h1 class="source-title">${h(path)}</h1><p>${changed ? '<strong>Source snapshot changed since this evidence link was opened. Refresh the map before relying on the old line location.</strong>' : 'Current working source.'} Snapshot ${h(map.fingerprint.slice(0, 16))}.</p><pre class="source-code">${source.split('\n').map((line, i) => `<span id="L${i + 1}"><a href="#L${i + 1}" aria-label="Line ${i + 1}">${i + 1}</a>${h(line)}</span>`).join('')}</pre></main></html>`); return;
      }
      send(200, 'text/html', renderPage(map, url.searchParams, { textOnly: url.pathname === '/text' }));
    } catch (error) {
      send(500, 'text/html', `<!doctype html><html lang="en"><meta charset="utf-8"><title>Skill map could not load</title><h1>Skill map could not load</h1><p>${h(error.message)}</p><p>Correct the source or record error, then refresh. No files were changed.</p><a href="/">Try again</a></html>`);
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--port' || !/^\d+$/.test(args[1]) || Number(args[1]) > 65535)) {
    throw new Error('Usage: node scripts/skill-map-server.mjs [--port 43854]');
  }
  const port = args.length ? Number(args[1]) : 43854;
  const server = createSkillMapServer();
  server.on('error', error => { console.error(`Skill-map viewer: ${error.message}`); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Skill-map viewer: http://127.0.0.1:${server.address().port}/`));
}
