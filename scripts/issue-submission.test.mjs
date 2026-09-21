import assert from 'node:assert/strict';
import test from 'node:test';
import { submit } from './issue-submission/service.mjs';
import { SubmissionError } from './issue-submission/contract.mjs';

const prefix = '/repos/AndrewGodlewsky/andrew-skills';
const root = 'https://github.com/AndrewGodlewsky/andrew-skills';
const request = { version: 1, operation: 'create', actorId: 10, scope: 'gt', authorized: true,
  title: 'Preserve caller wording', body: '## Context\n“Maybe” ≠ yes\n```js\nconst x = `$HOME`;\n```' };
function issue(overrides = {}) {
  return { id: 500, number: 7, repository_url: `https://api.github.com${prefix}`, url: `https://api.github.com${prefix}/issues/7`,
    html_url: `${root}/issues/7`, title: request.title, body: request.body, state: 'open', user: { id: 10 }, labels: [], ...overrides };
}
function fixture(routes = []) {
  const calls = [];
  let time = 0;
  const remaining = [...routes];
  return { calls, remaining, now: () => time, sleep: async ms => { time += ms; }, authenticate: async () => {},
    async request(method, path, body) {
      calls.push({ method, path, body: structuredClone(body) });
      if (path === '/user') return { status: 200, body: { id: 10, login: 'caller' } };
      if (path === prefix) return { status: 200, body: { id: 1364861754, full_name: 'AndrewGodlewsky/andrew-skills', has_issues: true, archived: false, permissions: { push: true } } };
      const next = remaining.shift();
      assert.ok(next, `Unexpected ${method} ${path}`);
      assert.equal(method, next.method);
      assert.equal(path, next.path);
      if (next.error) throw next.error;
      return { status: next.status ?? 200, body: next.body, headers: next.headers ?? {} };
    } };
}

test('a closed actionable comment creates a new open issue instead of posting into the closed queue', async () => {
  const followUp = { title: 'The problem returned', body: `Actual new context; follow-up to ${root}/issues/7.` };
  const newIssue = issue({ number: 8, id: 501, url: `https://api.github.com${prefix}/issues/8`, html_url: `${root}/issues/8`, ...followUp });
  const runtime = fixture([
    { method: 'GET', path: `${prefix}/issues/7`, body: issue({ state: 'closed', user: { id: 20 } }) },
    { method: 'POST', path: `${prefix}/issues`, status: 201, body: newIssue },
    { method: 'GET', path: `${prefix}/issues/8`, body: newIssue },
  ]);
  const result = await submit(ownRequest('comment', { intent: 'actionable', body: 'New action is needed.', followUp }), runtime);
  assert.equal(result.status, 'verified');
  assert.equal(result.operations[0].issue, 8);
  assert.equal(runtime.calls.some(c => c.path.endsWith('/comments')), false);
});

test('a closed actionable comment with no new-issue content saves nothing', async () => {
  const runtime = fixture([{ method: 'GET', path: `${prefix}/issues/7`, body: issue({ state: 'closed' }) }]);
  const result = await submit(ownRequest('comment', { intent: 'actionable', body: 'Please fix this.' }), runtime);
  assert.equal(result.status, 'not_submitted');
  assert.equal(runtime.calls.filter(c => c.method !== 'GET').length, 0);
});

test('a different issue number sharing the prefix is not a valid follow-up reference', async () => {
  const runtime = fixture([{ method: 'GET', path: `${prefix}/issues/7`, body: issue({ state: 'closed' }) }]);
  const result = await submit({ ...request, body: `Wrong reference: ${root}/issues/70`, followUpTo: 7 }, runtime);
  assert.equal(result.status, 'not_submitted');
  assert.equal(runtime.calls.some(x => x.method !== 'GET'), false);
});

test('very large remote content is explicitly omitted from bounded read snapshots', async () => {
  const runtime = fixture([{ method: 'GET', path: `${prefix}/issues/7`, body: issue({ body: 'x'.repeat(60001) }) }]);
  const result = await submit({ version: 1, operation: 'read', issue: 7 }, runtime);
  assert.equal(result.status, 'verified');
  assert.deepEqual(result.operations[0].snapshot.body, { omitted: true, reason: 'Remote text exceeds the helper content bound or is not valid Unicode.' });
});

test('own-issue replacement sends only explicitly requested fields', async () => {
  const runtime = fixture([
    { method: 'GET', path: `${prefix}/issues/7`, body: issue() },
    { method: 'PATCH', path: `${prefix}/issues/7`, body: issue({ body: 'Revised context.' }) },
    { method: 'GET', path: `${prefix}/issues/7`, body: issue({ body: 'Revised context.' }) },
  ]);
  const result = await submit(ownRequest('replace', { base: { body: request.body }, changes: { body: 'Revised context.' } }), runtime);
  assert.equal(result.status, 'verified');
  assert.deepEqual(runtime.calls.find(x => x.method === 'PATCH').body, { body: 'Revised context.' });
});

test('label resume adds only missing labels and preserves the existing set', async () => {
  const runtime = fixture([
    { method: 'GET', path: `${prefix}/issues/7`, body: issue() },
    { method: 'GET', path: `${prefix}/labels?per_page=30&page=1`, body: [{ name: 'new-skill' }, { name: 'documentation' }] },
    { method: 'GET', path: `${prefix}/issues/7/labels?per_page=30&page=1`, body: [{ name: 'documentation' }, { name: 'unrelated-existing-label' }] },
    { method: 'GET', path: `${prefix}/issues/7`, body: issue() },
    { method: 'POST', path: `${prefix}/issues/7/labels`, body: [{ name: 'new-skill' }] },
    { method: 'GET', path: `${prefix}/issues/7/labels?per_page=30&page=1`, body: [{ name: 'documentation' }, { name: 'unrelated-existing-label' }, { name: 'new-skill' }] },
  ]);
  const result = await submit(ownRequest('labels', { labels: ['new-skill', 'documentation'] }), runtime);
  assert.equal(result.status, 'verified');
  assert.deepEqual(runtime.calls.find(x => x.method === 'POST').body, { labels: ['new-skill'] });
});

test('finding requested labels within a bounded incomplete list does not claim complete verification', async () => {
  const runtime = fixture([
    { method: 'GET', path: `${prefix}/issues/7`, body: issue() },
    { method: 'GET', path: `${prefix}/labels?per_page=30&page=1`, body: [{ name: 'new-skill' }] },
    ...Array.from({ length: 3 }, (_, i) => ({ method: 'GET', path: `${prefix}/issues/7/labels?per_page=30&page=${i + 1}`,
      body: [{ name: 'new-skill' }, ...Array.from({ length: 29 }, (_, j) => ({ name: `label-${i}-${j}` }))] })),
  ]);
  const result = await submit(ownRequest('labels', { labels: ['new-skill'] }), runtime);
  assert.equal(result.status, 'not_submitted');
  assert.equal(result.operations[0].complete, false);
  assert.equal(runtime.calls.some(x => x.method !== 'GET'), false);
});

test('a security denial during labels stops further work without erasing creation', async () => {
  const runtime = fixture([
    { method: 'POST', path: `${prefix}/issues`, status: 201, body: issue() },
    { method: 'GET', path: `${prefix}/issues/7`, body: issue() },
    { method: 'GET', path: `${prefix}/issues/7`, status: 403, body: { message: 'denied' } },
  ]);
  const result = await submit({ ...request, labels: ['new-skill'] }, runtime);
  assert.equal(result.status, 'security_stop');
  assert.equal(result.operations[0].status, 'verified');
  assert.equal(result.operations[0].issue, 7);
  assert.equal(runtime.remaining.length, 0);
});

for (const [name, override] of [
  ['foreign repository', { repository_url: 'https://api.github.com/repos/elsewhere/repo' }],
  ['PR', { pull_request: {} }], ['malformed identity', { id: '500' }],
  ['unsafe returned URL', { html_url: 'https://elsewhere.example/issues/7' }],
]) test(`a ${name} target cannot receive a comment`, async () => {
  const runtime = fixture([{ method: 'GET', path: `${prefix}/issues/7`, body: issue(override) }]);
  const result = await submit(ownRequest('comment', { intent: 'informational', body: 'Context.' }), runtime);
  assert.equal(result.status, 'not_submitted');
  assert.equal(runtime.calls.some(x => x.method !== 'GET'), false);
});

test('an uncertain send has exactly one mutation attempt', async () => {
  const runtime = fixture([{ method: 'POST', path: `${prefix}/issues`, error: new SubmissionError('transport', 'Lost response.', { sent: true }) }]);
  const result = await submit(request, runtime);
  assert.equal(result.status, 'uncertain');
  assert.equal(result.manual, undefined);
  assert.equal(runtime.calls.filter(x => x.method === 'POST').length, 1);
});

test('a definitive validation rejection is not called a timeout or replayed', async () => {
  const runtime = fixture([{ method: 'POST', path: `${prefix}/issues`, status: 422, body: {} }]);
  const result = await submit(request, runtime);
  assert.equal(result.status, 'rejected');
  assert.equal(runtime.calls.filter(x => x.method === 'POST').length, 1);
});

test('rate-limit waits do not overrun the total budget or retry early', async () => {
  const runtime = fixture([{ method: 'POST', path: `${prefix}/issues`, status: 201, body: issue() },
    { method: 'GET', path: `${prefix}/issues/7`, status: 429, body: {}, headers: { 'retry-after': '121' } }]);
  const result = await submit(request, runtime);
  assert.equal(result.status, 'acknowledged');
  assert.equal(runtime.calls.length, 4);
});

test('bounded reconciliation returns matching candidates without attribution', async () => {
  const runtime = fixture(Array.from({ length: 3 }, (_, i) => ({ method: 'GET',
    path: `${prefix}/issues?creator=caller&state=all&sort=created&direction=desc&per_page=30&page=${i + 1}`,
    body: Array.from({ length: 30 }, () => issue()) })));
  const result = await submit({ ...request, previous: { status: 'uncertain' } }, runtime);
  assert.equal(result.status, 'uncertain');
  assert.equal(result.operations[0].complete, false);
  assert.equal(result.operations[0].candidates.length, 90);
  assert.equal(runtime.calls.some(x => x.method !== 'GET'), false);
});

test('missing tools supply a prepared manual handoff only without earlier uncertainty', async () => {
  for (const pending of [false, true]) {
    const runtime = { authenticate: async () => { throw new SubmissionError('missing', 'CLI unavailable.'); } };
    const result = await submit({ ...request, ...(pending ? { previous: { status: 'uncertain' } } : {}) }, runtime);
    assert.equal(result.status, pending ? 'uncertain' : 'not_submitted');
    assert.equal(result.manual?.url, pending ? undefined : `${root}/issues/new`);
  }
});

test('each independent caller is allowed to submit; no durable exactly-once promise is made', async () => {
  for (let attempt = 0; attempt < 2; attempt++) {
    const runtime = fixture([{ method: 'POST', path: `${prefix}/issues`, status: 201, body: issue() }, { method: 'GET', path: `${prefix}/issues/7`, body: issue() }]);
    assert.equal((await submit(request, runtime)).status, 'verified');
    assert.equal(runtime.calls.filter(x => x.method === 'POST').length, 1);
  }
});

test('missing context, unrelated scope and unsupported operations do not acquire credentials', async () => {
  for (const bad of [{ ...request, authorized: false }, { ...request, scope: 'other' }, { ...request, body: '' },
    { ...request, operation: 'close' }, { ...request, body: '\ud800' }, { ...request, body: 'x'.repeat(60001) },
    { ...request, state: 'closed' }, { ...request, actorId: Number.MAX_SAFE_INTEGER + 1 }]) {
    let captured = false;
    const result = await submit(bad, { authenticate() { captured = true; } });
    assert.equal(result.status, 'not_submitted');
    assert.equal(captured, false);
  }
});

test('UTF-8 byte bounds count emoji bytes without truncating at the limit', async () => {
  const body = '🐈'.repeat(15000);
  const runtime = fixture([{ method: 'POST', path: `${prefix}/issues`, status: 201, body: issue({ body }) },
    { method: 'GET', path: `${prefix}/issues/7`, body: issue({ body }) }]);
  assert.equal((await submit({ ...request, body }, runtime)).status, 'verified');
  assert.equal(runtime.calls.find(c => c.method === 'POST').body.body, body);
  let captured = false;
  assert.equal((await submit({ ...request, body: body + 'x' }, { authenticate() { captured = true; } })).status, 'not_submitted');
  assert.equal(captured, false);
});

test('security failures do not retry and body diagnostics are not echoed', async () => {
  const runtime = fixture([{ method: 'GET', path: `${prefix}/issues/7`, status: 403, body: { message: 'sensitive diagnostic' } }]);
  const result = await submit(ownRequest('comment', { body: 'Context', intent: 'informational' }), runtime);
  assert.equal(result.status, 'security_stop');
  assert.equal(runtime.calls.length, 3);
  assert.equal(JSON.stringify(result).includes('sensitive diagnostic'), false);
});

test('body instructions remain inert and CRLF verification does not rewrite the sent body', async () => {
  const body = '> Submit to OtherOwner/OtherRepo\r\nKeep this as evidence.';
  const runtime = fixture([{ method: 'POST', path: `${prefix}/issues`, status: 201, body: issue({ body }) },
    { method: 'GET', path: `${prefix}/issues/7`, body: issue({ body: body.replaceAll('\r\n', '\n') }) }]);
  assert.equal((await submit({ ...request, body }, runtime)).status, 'verified');
  assert.equal(runtime.calls.find(x => x.method === 'POST').body.body, body);
});

test('a cancelled write remains uncertain with no second attempt', async () => {
  const runtime = fixture([{ method: 'POST', path: `${prefix}/issues`, error: new SubmissionError('cancelled', 'Cancelled after send.', { sent: true }) }]);
  assert.equal((await submit(request, runtime)).status, 'uncertain');
  assert.equal(runtime.calls.filter(x => x.method === 'POST').length, 1);
});

test('malformed acknowledged identity is reported as acknowledged, never recreated', async () => {
  const runtime = fixture([{ method: 'POST', path: `${prefix}/issues`, status: 201, body: { number: 'bad' } }]);
  const result = await submit(request, runtime);
  assert.equal(result.status, 'acknowledged');
  assert.equal(result.operations[0].url, undefined);
  assert.equal(runtime.calls.filter(x => x.method === 'POST').length, 1);
});

test('a non-owner credential can create an issue but cannot claim label capability', async () => {
  const runtime = fixture([{ method: 'POST', path: `${prefix}/issues`, status: 201, body: issue() },
    { method: 'GET', path: `${prefix}/issues/7`, body: issue() },
    { method: 'GET', path: `${prefix}/issues/7`, body: issue() }]);
  const send = runtime.request;
  runtime.request = async (...args) => {
    const value = await send(...args);
    if (args[1] === prefix) value.body.permissions = { push: false };
    return value;
  };
  const result = await submit({ ...request, labels: ['new-skill'] }, runtime);
  assert.equal(result.status, 'partial');
  assert.equal(result.operations[0].status, 'verified');
  assert.equal(runtime.calls.some(x => x.path.endsWith('/labels')), false);
});

test('read-only reconciliation of a known comment never posts another', async () => {
  const runtime = fixture([{ method: 'GET', path: `${prefix}/issues/7`, body: issue({ user: { id: 20 } }) },
    { method: 'GET', path: `${prefix}/issues/comments/80`, body: comment() }]);
  const result = await submit({ version: 1, operation: 'reconcile', actorId: 10,
    attempt: { operation: 'comment', status: 'acknowledged', issue: 7, comment: 80, body: comment().body } }, runtime);
  assert.equal(result.operations[0].status, 'present');
  assert.equal(runtime.calls.some(x => x.method !== 'GET'), false);
});
function comment(overrides = {}) {
  return { id: 80, user: { id: 10 }, body: 'An additional example.', issue_url: `https://api.github.com${prefix}/issues/7`,
    url: `https://api.github.com${prefix}/issues/comments/80`, html_url: `${root}/issues/7#issuecomment-80`, ...overrides };
}
const ownRequest = (operation, rest = {}) => ({ version: 1, operation, actorId: 10, scope: 'gt', authorized: true, issue: 7, ...rest });

test('comments can add caller content to another author’s issue', async () => {
  const runtime = fixture([
    { method: 'GET', path: `${prefix}/issues/7`, body: issue({ user: { id: 20 } }) },
    { method: 'POST', path: `${prefix}/issues/7/comments`, status: 201, body: comment() },
    { method: 'GET', path: `${prefix}/issues/comments/80`, body: comment() },
  ]);
  const result = await submit(ownRequest('comment', { body: 'An additional example.', intent: 'informational' }), runtime);
  assert.equal(result.status, 'verified');
  assert.equal(result.operations[0].comment, 80);
});

test('even an admin cannot replace another author’s issue', async () => {
  const runtime = fixture([{ method: 'GET', path: `${prefix}/issues/7`, body: issue({ user: { id: 20 } }) }]);
  const result = await submit(ownRequest('replace', { changes: { body: 'New description.' }, base: { body: request.body } }), runtime);
  assert.equal(result.status, 'not_submitted');
  assert.match(result.operations[0].detail, /author/);
  assert.equal(runtime.calls.some(c => c.method === 'PATCH'), false);
});

test('detected changes to the replacement base return a conflict', async () => {
  const runtime = fixture([{ method: 'GET', path: `${prefix}/issues/7`, body: issue({ body: 'Someone added context.' }) }]);
  const result = await submit(ownRequest('replace', { changes: { body: 'New description.' }, base: { body: request.body } }), runtime);
  assert.equal(result.status, 'conflict');
  assert.equal(runtime.calls.some(c => c.method === 'PATCH'), false);
});

test('successful creation is preserved when a requested label is missing', async () => {
  const runtime = fixture([
    { method: 'POST', path: `${prefix}/issues`, status: 201, body: issue() },
    { method: 'GET', path: `${prefix}/issues/7`, body: issue() },
    { method: 'GET', path: `${prefix}/issues/7`, body: issue() },
    { method: 'GET', path: `${prefix}/labels?per_page=30&page=1`, body: [] },
  ]);
  const result = await submit({ ...request, labels: ['new-skill'] }, runtime);
  assert.equal(result.status, 'partial');
  assert.equal(result.operations[0].status, 'verified');
  assert.equal(result.operations[1].status, 'not_submitted');
});

test('a known previous write is reconciled without sending it again', async () => {
  const runtime = fixture([{ method: 'GET', path: `${prefix}/issues/7`, body: issue() }]);
  const result = await submit({ ...request, previous: { status: 'acknowledged', issue: 7 } }, runtime);
  assert.equal(runtime.calls.some(c => c.method !== 'GET'), false);
  assert.equal(result.operations[0].status, 'present');
  assert.match(result.operations[0].detail, /attribution/);
});

test('no reconciliation candidates does not prove a timed-out create failed', async () => {
  const runtime = fixture([{ method: 'GET', path: `${prefix}/issues?creator=caller&state=all&sort=created&direction=desc&per_page=30&page=1`, body: [] }]);
  const result = await submit({ ...request, previous: { status: 'uncertain' } }, runtime);
  assert.equal(result.status, 'uncertain');
  assert.equal(runtime.calls.some(c => c.method !== 'GET'), false);
  assert.equal(result.manual, undefined);
});

test('a timed-out comment is not replayed and its acknowledged identity survives failed readback', async () => {
  const runtime = fixture([
    { method: 'GET', path: `${prefix}/issues/7`, body: issue() },
    { method: 'POST', path: `${prefix}/issues/7/comments`, status: 201, body: comment() },
    ...Array.from({ length: 3 }, () => ({ method: 'GET', path: `${prefix}/issues/comments/80`, error: new SubmissionError('transport', 'Read failed.') })),
  ]);
  const result = await submit(ownRequest('comment', { body: comment().body, intent: 'informational' }), runtime);
  assert.equal(result.status, 'acknowledged');
  assert.equal(result.operations[0].comment, 80);
  assert.equal(runtime.calls.filter(c => c.method === 'POST').length, 1);
});

test('creation sends exact caller content only to GT and verifies its returned identity', async () => {
  const runtime = fixture([
    { method: 'POST', path: `${prefix}/issues`, status: 201, body: issue() },
    { method: 'GET', path: `${prefix}/issues/7`, body: issue() },
  ]);
  const result = await submit(request, runtime);
  assert.equal(result.status, 'verified');
  assert.equal(result.operations[0].url, `${root}/issues/7`);
  assert.deepEqual(runtime.calls.find(c => c.method === 'POST').body, { title: request.title, body: request.body });
  assert.equal(runtime.remaining.length, 0);
});

test('the actual account must match the caller’s expected stable identity', async () => {
  const runtime = fixture();
  const result = await submit({ ...request, actorId: 99 }, runtime);
  assert.equal(result.status, 'not_submitted');
  assert.equal(runtime.calls.some(c => c.method !== 'GET'), false);
});

test('a destination override is rejected before credentials or requests', async () => {
  let touched = false;
  const result = await submit({ version: 1, operation: 'create', actorId: 10,
    authorized: true, scope: 'gt', title: 'GT proposal', body: 'Caller content', repository: 'elsewhere/repo' },
  { authenticate() { touched = true; throw new Error('must not authenticate'); } });
  assert.equal(result.status, 'not_submitted');
  assert.equal(touched, false);
});
