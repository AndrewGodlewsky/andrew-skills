import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareSubmission, nextSubmission } from './create-skills/submission.mjs';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sha256 } from './create-skills/package.mjs';
const repository = 'AndrewGodlewsky/andrew-skills';
const issueUrl = `https://github.com/${repository}/issues/88`;
const input = { title: 'New skill', specification: 'Complete specification.', implementation: 'No package built: unavailable runtime.', verification: 'Structural check not run; no generated package.' };
function reply(request, plan) {
  const op = { operation: request.operation, status: 'verified', issue: 88, url: issueUrl, verifiedLink: true };
  if (request.operation === 'read') op.snapshot = { state: 'open', authorId: 7, body: plan.initialBody };
  if (request.operation === 'comment') { op.comment = 901; op.url += '#issuecomment-901'; }
  return { repository, actor: { id: 7 }, status: 'verified', operations: [op] };
}
function state(plan) { return { plan, actorId: 7, authorized: true, history: [] }; }
function step(s) {
  const next = nextSubmission(s);
  assert.equal(next.status, 'ready');
  s.history.push({ request: next.request, result: reply(next.request, s.plan) });
  return next.request;
}
test('a complete specification with absent package and unrun checks is submittable', () => {
  const plan = prepareSubmission(input); assert.equal(plan.parts.length, 0);
  assert.match(plan.initialBody, /## Specification/); assert.match(plan.initialBody, /## Implementation attempt/);
  const s = state(plan); assert.equal(step(s).operation, 'create');
  assert.equal(nextSubmission(s).status, 'delivered');
});
test('large Unicode specifications are split without dropping source characters', () => {
  const text = '🧪 café\n'.repeat(15000);
  const plan = prepareSubmission({ ...input, specification: text });
  assert.ok(plan.parts.length > 1);
  for (const part of plan.parts) assert.ok(Buffer.byteLength(part.body) <= 60000);
  const captured = plan.parts.map(x => x.body).join('\n');
  assert.equal([...captured.matchAll(/🧪/g)].length, 15000);
  const s = state(plan), kinds = [];
  for (let i = 0; i < 100 && nextSubmission(s).status !== 'delivered'; i++) kinds.push(step(s).operation);
  assert.equal(nextSubmission(s).status, 'delivered');
  assert.equal(kinds.filter(x => x === 'comment').length, plan.parts.length);
  assert.equal(kinds.at(-1), 'replace');
});
test('lost comment response yields read-only reconciliation, then continues without replay', () => {
  const s = state(prepareSubmission({ ...input, specification: 'a'.repeat(60000) }));
  step(s); step(s);
  const next = nextSubmission(s);
  const result = reply(next.request, s.plan); result.operations[0].status = 'acknowledged'; result.operations[0].verifiedLink = false;
  s.history.push({ request: next.request, result });
  const recovery = nextSubmission(s);
  assert.equal(recovery.recoveryRequest.operation, 'reconcile');
  const observed = { ...result.operations[0], operation: 'reconcile', attemptedOperation: 'comment', status: 'present', verifiedLink: true };
  s.history.at(-1).reconciliation = { request: recovery.recoveryRequest, result: { ...result, operations: [observed] } };
  const after = nextSubmission(s); assert.equal(after.status, 'ready'); assert.equal(after.request.operation, 'read');
  assert.notDeepEqual(after.request, next.request);
});
test('changed body, closed target and changed actor stop before further comments', () => {
  for (const patch of [{ body: 'edited' }, { state: 'closed' }, { authorId: 99 }]) {
    const s = state(prepareSubmission({ ...input, specification: 'a'.repeat(60000) }));
    step(s); const read = step(s); assert.equal(read.operation, 'read');
    Object.assign(s.history.at(-1).result.operations[0].snapshot, patch);
    assert.equal(nextSubmission(s).status, 'conflict');
  }
});
test('security results, mismatched evidence and unknown destinations never advance delivery', () => {
  const s = state(prepareSubmission(input)); step(s);
  s.history[0].result.operations.push({ status: 'security_stop' });
  assert.equal(nextSubmission(s).status, 'security_stop');
  s.history[0].result.operations.pop(); s.history[0].result.repository = 'elsewhere/repo';
  assert.equal(nextSubmission(s).status, 'uncertain');
  s.history[0].request.body += 'changed';
  assert.throws(() => nextSubmission(s), /Evidence differs/);
});
test('preflight rejects excessive comments, invalid Unicode and unauthorized next action', () => {
  assert.throws(() => prepareSubmission({ ...input, specification: 'a'.repeat(1500000) }), /32 comment/);
  assert.throws(() => prepareSubmission({ ...input, specification: '\ud800' }), /Invalid/);
  assert.throws(() => nextSubmission({ ...state(prepareSubmission(input)), authorized: false }), /authority/);
});

test('file fragments preserve BOM, Unicode, LF content and embedded fences with a verifiable manifest', t => {
  const base = mkdtempSync(join(tmpdir(), 'gt-fragments-')); t.after(() => rmSync(base, { recursive: true, force: true }));
  const root = join(base, 'sample'); mkdirSync(root);
  const content = '\ufeff```sample\r\n' + 'é🧪\r\n'.repeat(13000) + '```\r\n';
  writeFileSync(join(root, 'source.txt'), content);
  const plan = prepareSubmission({ ...input, packageDirectory: root });
  const canonical = content.replaceAll('\r\n', '\n');
  assert.equal(plan.manifest[0].sha256, sha256(canonical));
  const fragments = [];
  for (const part of plan.parts) {
    for (const match of part.body.matchAll(/## File "source.txt" — fragment \d+\/\d+\n\n(`{3,})\n([\s\S]*?)\n\1(?=\n|$)/g)) fragments.push(match[2]);
  }
  assert.equal(fragments.join(''), canonical);
});

test('binary resource delivery remains pending until matching attachment hash evidence exists', t => {
  const base = mkdtempSync(join(tmpdir(), 'gt-binary-')); t.after(() => rmSync(base, { recursive: true, force: true }));
  const root = join(base, 'sample'); mkdirSync(root);
  writeFileSync(join(root, 'image.bin'), Buffer.from([0, 255, 1]));
  const s = state(prepareSubmission({ ...input, packageDirectory: root }));
  while (nextSubmission(s).status === 'ready') step(s);
  assert.equal(nextSubmission(s).status, 'attachment_pending');
  const item = s.plan.attachments[0];
  s.attachments = [{ ...item, verified: true, url: 'https://example.com/file.zip' }];
  assert.equal(nextSubmission(s).status, 'attachment_pending');
  s.attachments[0].url = 'https://github.com/user-attachments/files/123/package.zip';
  while (nextSubmission(s).status === 'ready') step(s);
  assert.equal(nextSubmission(s).status, 'delivered');
});

test('a missing process result never causes create to be repeated, even after a candidate is found', () => {
  const s = state(prepareSubmission(input));
  const first = nextSubmission(s);
  s.history.push({ request: first.request, result: null });
  assert.equal(nextSubmission(s).recoveryRequest.operation, 'reconcile');
  s.history[0].known = { issue: 88 };
  const recoveryRequest = nextSubmission(s).recoveryRequest;
  assert.equal(recoveryRequest.attempt.issue, 88);
  s.history[0].reconciliation = { request: recoveryRequest, result: { repository, actor: { id: 7 }, operations: [{ operation: 'reconcile', attemptedOperation: 'create', issue: 88, url: issueUrl, status: 'present', verifiedLink: true }] } };
  assert.equal(nextSubmission(s).status, 'delivered');
});
