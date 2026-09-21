import assert from 'node:assert/strict';
import test from 'node:test';
import { submit } from './issue-submission/service.mjs';
import { prepareSubmission, nextSubmission } from './create-skills/submission.mjs';

const repo = 'AndrewGodlewsky/andrew-skills', api = `/repos/${repo}`, web = `https://github.com/${repo}`;
function server({ loseCommentReadback = false, denyLabel = false } = {}) {
  let time = 0, issue, lost = false;
  const comments = new Map(), calls = [];
  return { calls, comments, now: () => time, sleep: async ms => { time += ms; }, authenticate: async () => {},
    async request(method, path, body) {
      calls.push({ method, path, body: structuredClone(body) });
      if (path === '/user') return { status: 200, body: { id: 10, login: 'contributor' } };
      if (path === api) return { status: 200, body: { id: 1364861754, full_name: repo, has_issues: true, archived: false, permissions: { push: !denyLabel } } };
      if (method === 'POST' && path === `${api}/issues`) {
        issue = { id: 500, number: 7, repository_url: `https://api.github.com${api}`, url: `https://api.github.com${api}/issues/7`, html_url: `${web}/issues/7`, state: 'open', user: { id: 10 }, labels: [], ...body };
        return { status: 201, body: structuredClone(issue) };
      }
      if (path === `${api}/issues/7` && method === 'PATCH') { Object.assign(issue, body); return { status: 200, body: structuredClone(issue) }; }
      if (path === `${api}/issues/7` && method === 'GET') return { status: 200, body: structuredClone(issue) };
      if (method === 'POST' && path === `${api}/issues/7/comments`) {
        const id = 900 + comments.size;
        const comment = { id, issue_url: `https://api.github.com${api}/issues/7`, url: `https://api.github.com${api}/issues/comments/${id}`, html_url: `${web}/issues/7#issuecomment-${id}`, user: { id: 10 }, body: body.body };
        comments.set(id, comment); return { status: 201, body: comment };
      }
      const match = path.match(/\/issues\/comments\/(\d+)$/);
      if (method === 'GET' && match) {
        if (loseCommentReadback && !lost) { lost = true; return { status: 404, body: {} }; }
        return { status: 200, body: comments.get(Number(match[1])) };
      }
      throw new Error(`Unexpected ${method} ${path}`);
    },
  };
}

for (const lost of [false, true]) test(`real helper composition delivers parts and final index${lost ? ' after read-only recovery' : ''}`, async () => {
  const runtime = server({ loseCommentReadback: lost });
  const plan = prepareSubmission({ title: 'Create sample', specification: 'Detailed specification.\n'.repeat(6000), implementation: 'Build failed: recorded fixture limitation.', verification: 'Check failed; no claim of adoption readiness.' });
  const actor = (await submit({ version: 1, operation: 'read' }, runtime)).actor.id;
  const state = { plan, actorId: actor, authorized: true, history: [] };
  let result;
  for (let i = 0; i < 100; i++) {
    result = nextSubmission(state);
    if (result.status === 'delivered') break;
    if (result.recoveryRequest) {
      state.history.at(-1).reconciliation = { request: result.recoveryRequest, result: await submit(result.recoveryRequest, runtime) };
    } else {
      assert.equal(result.status, 'ready', JSON.stringify(result));
      await runtime.sleep(result.minimumWriteIntervalMs);
      state.history.push({ request: result.request, result: await submit(result.request, runtime) });
    }
  }
  assert.equal(result.status, 'delivered');
  assert.equal(runtime.calls.filter(x => x.method === 'POST' && x.path === `${api}/issues`).length, 1);
  assert.equal(runtime.comments.size, plan.parts.length);
  assert.equal(runtime.calls.filter(x => x.method === 'POST' && x.path.endsWith('/comments')).length, plan.parts.length);
  const final = runtime.calls.find(x => x.method === 'PATCH').body.body;
  assert.match(final, /all declared content verified/);
  assert.equal([...final.matchAll(/issuecomment-/g)].length, plan.parts.length);
});

test('label capability failure after a real content submission does not require replay', async () => {
  const runtime = server({ denyLabel: true });
  const plan = prepareSubmission({ title: 'New skill', specification: 'Defined behavior.', implementation: 'None produced.', verification: 'Not run.' });
  const state = { plan, actorId: 10, authorized: true, history: [] };
  const next = nextSubmission(state);
  state.history.push({ request: next.request, result: await submit(next.request, runtime) });
  assert.equal(nextSubmission(state).status, 'delivered');
  const labels = await submit({ version: 1, operation: 'labels', issue: 7, actorId: 10, scope: 'gt', authorized: true, labels: ['new-skill'] }, runtime);
  assert.notEqual(labels.status, 'verified');
  assert.equal(nextSubmission(state).status, 'delivered');
  assert.equal(runtime.calls.filter(x => x.method === 'POST').length, 1);
});
