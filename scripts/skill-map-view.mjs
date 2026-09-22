import { reverseImpact } from './skill-map.mjs';

export const escapeHtml = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const h = escapeHtml;
const label = id => id.replace(/^(skill|file):/, '');
const short = (value, length = 29) => value.length > length ? `${value.slice(0, length - 1)}…` : value;
const status = node => !node.present ? 'Missing target' : node.kind === 'skill' ? ({ reviewed: 'Reviewed', pending: 'Review needed', stale: 'Stale review', invalid: 'Invalid review' }[node.review] ?? 'Review needed') : 'Resource';
const pill = (text, warning = false) => `<span class="badge${warning ? ' warning' : ''}">${h(text)}</span>`;

export function viewState(map, search = new URLSearchParams()) {
  const expanded = search.get('expanded') === '1';
  const eligible = map.nodes.filter(node => expanded || node.kind === 'skill');
  let selected = search.get('selected') ?? `skill:${search.get('skill') ?? 'grill-me'}`;
  if (!eligible.some(node => node.id === selected)) selected = eligible.find(node => node.present)?.id ?? '';
  return { selected, expanded, view: search.get('view') === 'table' ? 'table' : 'graph', q: (search.get('q') ?? '').slice(0, 200), allPaths: search.get('paths') === 'all' };
}

export function viewUrl(state, changes = {}) {
  const next = { ...state, ...changes };
  const query = new URLSearchParams({ view: next.view, selected: next.selected, expanded: next.expanded ? '1' : '0' });
  if (next.q) query.set('q', next.q);
  if (next.allPaths) query.set('paths', 'all');
  return `/?${query}`;
}

function selectLink(id, state, title = label(id), className = '') {
  return `<a class="${className}" href="${h(viewUrl(state, { selected: id, view: 'graph', expanded: state.expanded || id.startsWith('file:') }))}#graph-heading">${h(title)}</a>`;
}

function sourceLink(item, fingerprint) {
  const url = `/source?${new URLSearchParams({ path: item.path, snapshot: fingerprint })}${item.line ? `#L${item.line}` : ''}`;
  return `<a href="${h(url)}">${h(item.path)}${item.line ? `:${item.line}` : ''}</a>`;
}

function evidence(edge, fingerprint) {
  if (!edge.evidence.length) return '<p class="muted">Discovered skill entry point.</p>';
  return `<details class="evidence"><summary>Source evidence (${edge.evidence.length})</summary>${edge.evidence.map(item => `<div>${sourceLink(item, fingerprint)} ${pill(item.status ?? 'current', item.status && item.status !== 'current')}<blockquote>${h(item.excerpt)}</blockquote></div>`).join('')}</details>`;
}

// Collapse strongly connected components before assigning columns. Cycles stay
// visible without repeatedly pushing their members to a later column.
export function layoutGraph(nodes, edges) {
  const ids = new Set(nodes.map(node => node.id)), adjacency = new Map(nodes.map(node => [node.id, []]));
  for (const edge of edges) if (ids.has(edge.from) && ids.has(edge.to)) adjacency.get(edge.from).push(edge.to);
  const indices = new Map(), low = new Map(), stack = [], active = new Set(), components = [];
  let index = 0;
  function visit(id) {
    indices.set(id, index); low.set(id, index++); stack.push(id); active.add(id);
    for (const target of adjacency.get(id)) {
      if (!indices.has(target)) { visit(target); low.set(id, Math.min(low.get(id), low.get(target))); }
      else if (active.has(target)) low.set(id, Math.min(low.get(id), indices.get(target)));
    }
    if (low.get(id) === indices.get(id)) {
      const group = []; let member;
      do { member = stack.pop(); active.delete(member); group.push(member); } while (member !== id);
      components.push(group.sort());
    }
  }
  for (const id of [...ids].sort()) if (!indices.has(id)) visit(id);
  const membership = new Map(components.flatMap((group, n) => group.map(id => [id, n])));
  const ranks = components.map(() => 0);
  for (let pass = 0; pass < components.length; pass++) for (const edge of edges) {
    const a = membership.get(edge.from), b = membership.get(edge.to);
    if (a !== undefined && b !== undefined && a !== b) ranks[b] = Math.max(ranks[b], ranks[a] + 1);
  }
  const columns = new Map(), positions = new Map();
  for (const node of [...nodes].sort((a, b) => a.id.localeCompare(b.id, 'en'))) {
    const rank = ranks[membership.get(node.id)];
    if (!columns.has(rank)) columns.set(rank, []);
    columns.get(rank).push(node);
  }
  for (const [rank, column] of columns) column.forEach((node, row) => positions.set(node.id, { x: 24 + rank * 310, y: 30 + row * 100 }));
  const cycles = components.filter(group => group.length > 1 || edges.some(edge => edge.from === group[0] && edge.to === group[0]));
  return { positions, width: Math.max(570, columns.size * 310 + 20), height: Math.max(150, ...[...columns.values()].map(column => column.length * 100 + 25)), cycles };
}

export function graphProjection(map, state) {
  const edges = state.expanded ? map.edges.filter(edge => edge.from === state.selected || edge.to === state.selected) : map.edges.filter(edge => edge.kind === 'skill');
  const connected = new Set(edges.flatMap(edge => [edge.from, edge.to]));
  connected.add(state.selected);
  return { edges, nodes: map.nodes.filter(node => connected.has(node.id)),
    isolated: state.expanded ? [] : map.nodes.filter(node => node.kind === 'skill' && !connected.has(node.id)) };
}

function graph(map, state, impact) {
  const model = graphProjection(map, state), layout = layoutGraph(model.nodes, model.edges);
  const highlighted = new Set(impact.callers.flatMap(caller => caller.paths.flatMap(path => path.map(edge => edge.id))));
  const arrows = model.edges.map((edge, i) => {
    const a = layout.positions.get(edge.from), b = layout.positions.get(edge.to);
    let path;
    if (edge.from === edge.to) path = `M${a.x + 80},${a.y} C${a.x + 40},${a.y - 32} ${a.x + 180},${a.y - 32} ${a.x + 145},${a.y}`;
    else if (a.x === b.x) path = `M${a.x + 220},${a.y + 36} C${a.x + 265 + i % 3 * 10},${a.y + 36} ${b.x + 265 + i % 3 * 10},${b.y + 36} ${b.x + 220},${b.y + 36}`;
    else path = `M${a.x + 220},${a.y + 36} C${a.x + 262},${a.y + 36} ${b.x - 42},${b.y + 36} ${b.x},${b.y + 36}`;
    return `<path class="edge${edge.conditional ? ' conditional' : ''}${highlighted.has(edge.id) ? ' highlighted' : ''}${edge.status !== 'current' ? ' stale' : ''}" d="${path}" marker-end="url(#arrow)"><title>${h(`${label(edge.from)} → ${label(edge.to)}: ${edge.condition} (${edge.status})`)}</title></path>`;
  }).join('');
  const boxes = model.nodes.map(node => {
    const point = layout.positions.get(node.id), selected = node.id === state.selected;
    const name = node.kind === 'resource' ? node.label.split('/').at(-1) : node.label;
    const subtitle = node.kind === 'resource' ? short(node.label.replace(/\/[^/]+$/, ''), 32) : status(node);
    return `<a href="${h(viewUrl(state, { selected: node.id, view: 'graph' }))}#graph-heading" tabindex="0" aria-label="Select ${h(node.label)}" class="graph-node${selected ? ' selected' : ''}${!node.present ? ' missing' : ''}"><title>${h(node.label)} — ${h(status(node))}</title><rect x="${point.x}" y="${point.y}" width="220" height="72" rx="8"/><text x="${point.x + 14}" y="${point.y + 28}">${h(short(name, 25))}</text><text class="node-status" x="${point.x + 14}" y="${point.y + 51}">${h(subtitle)}</text></a>`;
  }).join('');
  return `<div class="graph-scroll" tabindex="0" aria-label="Scrollable dependency graph"><svg class="graph" viewBox="0 0 ${layout.width} ${layout.height}" role="group" aria-label="${state.expanded ? 'Selected resource neighborhood' : 'Skill dependency graph'}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z"/></marker></defs>${arrows}${boxes}</svg></div>
    ${layout.cycles.length ? `<p class="notice">Cycle present: ${layout.cycles.map(group => group.map(label).map(h).join(' ↔ ')).join('; ')}. Review the path; a cycle alone is not a failure.</p>` : ''}
    ${model.isolated.length ? `<section class="separated"><h3>Other skills</h3><p class="muted">No inter-skill links recorded. Review status distinguishes an audited standalone skill from incomplete data.</p><div class="chips">${model.isolated.map(node => selectLink(node.id, state, `${node.label} · ${status(node)}`)).join('')}</div></section>` : ''}`;
}

function edgeList(edges, map, state) {
  return edges.length ? edges.map(edge => `<article class="edge-detail"><div class="path">${selectLink(edge.from, state)} <span aria-label="relies on">→</span> ${selectLink(edge.to, state)}</div><p>${h(edge.condition)} ${pill(edge.kind)} ${edge.conditional ? pill('Conditional') : ''} ${edge.status !== 'current' ? pill(edge.status, true) : ''}</p>${evidence(edge, map.fingerprint)}</article>`).join('') : '<p class="empty">No dependencies recorded in this view.</p>';
}

function impactPanel(map, state, impact) {
  const selected = map.nodes.find(node => node.id === state.selected);
  if (!selected) return '<aside class="panel"><h2>No skills discovered</h2><p>Add a skill package to inspect its dependencies.</p></aside>';
  const direct = impact.callers.filter(caller => caller.direct).length;
  const outgoing = map.edges.filter(edge => edge.from === state.selected && (state.expanded || edge.kind === 'skill'));
  const resources = state.expanded && selected.kind === 'skill' ? map.nodes.filter(node => node.owner === selected.label) : [];
  return `<aside class="panel impact"><h2>Changing <span>${h(selected.label)}</span></h2>${pill(status(selected), selected.review && selected.review !== 'reviewed' || !selected.present)}
    <p class="muted">Potential review scope, not proven breakage.</p><div class="counts"><div><strong>${impact.callers.length}</strong><span>skills to review</span></div><p>${direct} direct<br>${impact.callers.length - direct} through a path</p></div>
    ${impact.truncated ? `<p class="notice">Path limit reached (${impact.maxPaths}). These results are incomplete; narrow the selected resource. Counts are lower bounds.</p>` : ''}
    ${impact.cycleEdges.length ? `<p class="notice">Cycles occur on the traversed routes. Callers are counted once and traversal stops at repeated nodes.</p>` : ''}
    <h3>Callers to review</h3>${impact.callers.length ? impact.callers.map(caller => {
      const paths = state.allPaths ? caller.paths : caller.paths.slice(0, 12);
      return `<article class="caller"><div class="caller-title">${selectLink(caller.id, state)} ${pill(caller.direct ? 'Direct' : 'Through a path')}</div><details${caller.paths.length === 1 ? ' open' : ''}><summary>${caller.paths.length} ${caller.paths.length === 1 ? 'path' : 'paths'} and conditions</summary>${paths.map(path => `<div class="path-detail"><p class="path">${[path[0].from, ...path.map(edge => edge.to)].map(id => selectLink(id, state)).join(' → ')}</p>${path.map(step => { const edge = map.edges.find(edge => edge.id === step.id); return `<p>${h(step.condition)}${step.status !== 'current' ? ` ${pill(step.status, true)}` : ''}</p>${edge ? evidence(edge, map.fingerprint) : ''}`; }).join('')}</div>`).join('')}${paths.length < caller.paths.length ? `<p>Showing ${paths.length} of ${caller.paths.length} paths. <a href="${h(viewUrl(state, { allPaths: true }))}#impact">Show all enumerated paths</a></p>` : ''}</details></article>`;
    }).join('') : `<p class="empty">No callers recorded.${!map.ready ? ' Review is incomplete; this does not establish independence.' : ''}</p>`}
    <section class="separated"><h3>What it relies on</h3>${selected.reviewedSkillIndependent && !state.expanded ? '<p class="empty">Reviewed: no skill-to-skill dependencies. Bundled resources can still be present.</p>' : edgeList(outgoing, map, state)}</section>
    ${resources.length ? `<details class="separated"><summary>Browse ${resources.length} package resources</summary><div class="resource-links">${resources.map(node => selectLink(node.id, state)).join('')}</div></details>` : ''}</aside>`;
}

function table(map, state, impactFor) {
  const all = map.nodes.filter(node => node.kind === 'skill' || state.expanded);
  const matches = all.filter(node => node.label.toLowerCase().includes(state.q.toLowerCase()));
  return `<section class="panel"><h2 id="table-heading" tabindex="-1">All skills${state.expanded ? ' and resources' : ''}</h2><p class="muted">Choose a row to open it in the overview graph. Selection stays highlighted when you return.</p>
  <form method="get" class="search"><input type="hidden" name="view" value="table"><input type="hidden" name="selected" value="${h(state.selected)}"><input type="hidden" name="expanded" value="${state.expanded ? 1 : 0}"><label for="filter">Filter by name or path</label><input id="filter" name="q" value="${h(state.q)}" type="search"><button>Filter</button>${state.q ? `<a href="${h(viewUrl(state, { q: '' }))}">Clear filter</a>` : ''}</form>
  <p class="muted">${matches.length} of ${all.length} entries${state.q ? ' match this filter' : ''}.</p><div class="table-scroll"><table><thead><tr><th scope="col">Skill / resource</th><th scope="col">Relies on</th><th scope="col">Skills to review</th><th scope="col">Review</th></tr></thead><tbody>${matches.map(node => {
    const edges = map.edges.filter(edge => edge.from === node.id && (state.expanded || edge.kind === 'skill'));
    const callers = impactFor(node.id);
    return `<tr class="${node.id === state.selected ? 'selected' : ''}" data-href="${h(viewUrl(state, { selected: node.id, view: 'graph' }))}#graph-heading"><th scope="row">${selectLink(node.id, state, node.label, 'row-link')}${node.id === state.selected ? '<span class="selected-label">Selected</span>' : ''}</th><td>${edges.length ? `${edges.length} ${edges.length === 1 ? 'dependency' : 'dependencies'}<details><summary>Show targets</summary>${edges.map(edge => `<p>${selectLink(edge.to, state)}${edge.conditional ? ' (conditional)' : ''}</p>`).join('')}</details>` : 'None recorded'}</td><td>${callers.callers.length}${callers.truncated ? '+' : ''}</td><td>${pill(status(node), !node.present || node.review && node.review !== 'reviewed')}</td></tr>`;
  }).join('')}</tbody></table></div>${matches.length ? '' : '<p class="empty">No entries match. Clear the filter to see the complete inventory.</p>'}</section>`;
}

function coverage(map) {
  const unresolved = map.candidates.filter(candidate => !['dependency', 'excluded'].includes(candidate.status));
  const excluded = map.candidates.filter(candidate => candidate.status === 'excluded');
  return `<section class="panel coverage"><h2>Review and evidence</h2><details${map.diagnostics.length ? ' open' : ''}><summary>${map.diagnostics.length} findings</summary>${map.diagnostics.length ? `<ul>${map.diagnostics.map(item => `<li><strong>${h(item.code)}</strong>: ${h(item.subject)} — ${h(item.message)}</li>`).join('')}</ul>` : '<p>Recorded evidence and review match this source snapshot. Semantic review is still an author responsibility.</p>'}</details>
    <details${unresolved.length ? ' open' : ''}><summary>${unresolved.length} candidates need review</summary><p>Candidates are not asserted dependency edges.</p>${unresolved.map(candidate => `<p>${h(candidate.path)} → ${h(candidate.target)} ${pill(candidate.status, true)}</p>`).join('')}</details>
    <details><summary>${excluded.length} reviewed exclusions</summary>${excluded.map(candidate => `<article><p><strong>${h(candidate.path)}</strong> → ${h(label(candidate.target))}</p><p>${h(candidate.reason)}</p></article>`).join('')}</details></section>`;
}

export function renderPage(map, search = new URLSearchParams(), { textOnly = false } = {}) {
  const state = viewState(map, search), skills = map.nodes.filter(node => node.kind === 'skill' && node.present);
  const cache = new Map();
  const impactFor = id => { if (!cache.has(id)) cache.set(id, reverseImpact(map, id, { expanded: state.expanded })); return cache.get(id); };
  const impact = impactFor(state.selected);
  const body = textOnly ? `<section class="panel"><h2>Complete dependency list</h2><p>Text fallback for this snapshot. Every dependency below retains its condition, status and source evidence.</p>${edgeList(map.edges.filter(edge => state.expanded || edge.kind === 'skill'), map, state)}</section>${table(map, state, impactFor)}`
    : state.view === 'table' ? table(map, state, impactFor)
      : `<div class="overview"><section class="panel"><div class="section-heading"><h2 id="graph-heading" tabindex="-1">${state.expanded ? 'Selected neighborhood' : 'How the skills connect'}</h2><a href="${h(viewUrl(state, { view: 'table' }))}">Browse all ${state.expanded ? 'entries' : 'skills'}</a></div><p class="muted">${state.expanded ? 'Direct links around your selection. Explore any node; the side panel traces complete caller paths. All resources are in the table.' : 'Choose a skill to see its callers. An arrow from A to B means A relies on B.'}</p><div class="selection">Selected <strong>${h(label(state.selected))}</strong></div><div class="legend"><span>→ Relies on</span><span>┄ Conditional</span><span>Green: selected / caller path</span><span>Amber: review needed</span></div>${graph(map, state, impact)}</section><div id="impact">${impactPanel(map, state, impact)}</div></div>`;
  const query = new URLSearchParams({ selected: state.selected, expanded: state.expanded ? '1' : '0' });
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GT skill dependencies</title><link rel="stylesheet" href="/viewer.css"><script type="module" src="/viewer.mjs"></script></head><body>
    <a class="skip" href="#main">Skip to map</a><header><div class="header-inner"><div><p class="brand">GT maintainer workspace</p><h1>Skill dependencies</h1><p>See what a skill relies on, and what to review before changing it.</p></div><a class="refresh" href="${h(viewUrl(state))}">Refresh working files</a></div></header>
    <main id="main"><div class="source-bar"><span>Current working files, including local edits</span><span>Snapshot <code>${h(map.fingerprint.slice(0, 16))}</code></span></div>
    <div class="${map.ready ? 'ready' : 'notice'}" role="status"><strong>${skills.length} skills discovered. ${map.ready ? 'Recorded review is current.' : `${map.diagnostics.length} findings need attention.`}</strong> ${map.ready ? 'Evidence matches this snapshot; this does not certify runtime behavior.' : 'Incomplete preview: inspect known links and resolve the findings below.'}</div>
    <form method="get" class="controls"><input type="hidden" name="view" value="${state.view}"><label for="selection">View a change to<select id="selection" name="selected" data-submit>${map.nodes.filter(node => state.expanded || node.kind === 'skill').map(node => `<option value="${h(node.id)}"${node.id === state.selected ? ' selected' : ''}>${h(node.label)}${!node.present ? ' (missing)' : ''}</option>`).join('')}</select></label><label class="check"><input type="checkbox" name="expanded" value="1"${state.expanded ? ' checked' : ''} data-submit>Include shared resources</label><button class="apply">Apply view</button></form>
    <nav class="tabs" aria-label="Skill map views"><a href="${h(viewUrl(state, { view: 'graph' }))}"${state.view === 'graph' && !textOnly ? ' aria-current="page"' : ''}>Overview graph</a><a href="${h(viewUrl(state, { view: 'table' }))}"${state.view === 'table' && !textOnly ? ' aria-current="page"' : ''}>All skills${state.expanded ? ' and resources' : ''}</a><a href="/text?${h(query)}"${textOnly ? ' aria-current="page"' : ''}>Text fallback</a></nav>
    ${body}${coverage(map)}<footer><p>Arrows show actual declared dependencies. No recorded link is not proof of independence when review is incomplete.</p><a href="/map.md">Markdown + Mermaid snapshot</a><a href="/data.json">JSON snapshot</a><p>Saved exports describe their source fingerprint. Refresh this viewer to inspect later working-file changes.</p></footer></main></body></html>`;
}

export function renderMarkdown(map) {
  const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('|', '&#124;').replaceAll('\n', '<br>').replaceAll('`', '&#96;');
  const source = item => `../../${item.path.split('/').map(encodeURIComponent).join('/')}${item.line ? `#L${item.line}` : ''}`;
  const skills = map.nodes.filter(node => node.kind === 'skill'), ids = new Map(skills.map((node, i) => [node.id, `n${i}`]));
  const mermaid = ['flowchart LR', ...skills.map(node => `  ${ids.get(node.id)}["${label(node.id).replaceAll(/[^a-zA-Z0-9 _-]/g, '_')}${!node.present ? ' (missing)' : ''}"]`),
    ...map.edges.filter(edge => edge.kind === 'skill').map(edge => `  ${ids.get(edge.from)} ${edge.conditional ? '-.->' : '-->'} ${ids.get(edge.to)}`)].join('\n');
  return `# GT skill dependency map\n\nSnapshot: \`${map.fingerprint}\`. Source: current working files when generated.\nSaved output cannot detect later edits. ${map.ready ? 'Recorded review is current for this snapshot.' : `Incomplete: ${map.diagnostics.length} findings.`}\n\nA → B means A relies on B; dashed arrows are conditional. Potential impact means review scope, not proven breakage.\n\n\`\`\`mermaid\n${mermaid}\n\`\`\`\n\n## All skills\n\n| Skill | Relies on | Callers to review | Review |\n| --- | --- | --- | --- |\n${skills.map(node => { const impact = reverseImpact(map, node.id); return `| ${escape(node.label)} | ${map.edges.filter(edge => edge.kind === 'skill' && edge.from === node.id).map(edge => escape(label(edge.to))).join(', ') || 'None recorded'} | ${impact.callers.map(caller => escape(label(caller.id))).join(', ') || 'None recorded'}${impact.truncated ? ' (incomplete)' : ''} | ${escape(status(node))} |`; }).join('\n')}\n\n## All declared dependencies and source provenance\n\n${map.edges.map(edge => `### ${escape(label(edge.from))} → ${escape(label(edge.to))}\n\n${escape(edge.kind)}; ${escape(edge.status)}. ${escape(edge.condition)}${edge.conditional ? ' (conditional)' : ''}\n\n${edge.evidence.map(item => `- [${escape(item.path)}${item.line ? `:${item.line}` : ''}](${source(item)}) (${escape(item.status)}): ${escape(item.excerpt)}`).join('\n') || 'Discovered skill entry instructions.'}\n`).join('\n')}\n## Findings\n\n${map.diagnostics.map(item => `- ${escape(item.code)}: ${escape(item.subject)} — ${escape(item.message)}`).join('\n') || 'No mechanical findings. Semantic review and runtime compatibility remain distinct.'}\n\n## Candidate classifications\n\n${map.candidates.filter(item => item.status !== 'dependency').map(item => `- ${escape(item.path)} → ${escape(item.target)}: ${escape(item.status)}. ${escape(item.reason ?? 'Needs semantic review; not an asserted edge.')}`).join('\n')}\n`;
}
