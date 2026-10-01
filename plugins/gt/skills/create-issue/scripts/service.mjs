import { API, LIMITS, REPOSITORY, WEBSITE, validateRequest, SubmissionError } from './contract.mjs';
import { Session, issueRecord, commentRecord, sameText } from './api.mjs';

export async function submit(input, runtime, { signal } = {}) {
  const output = { version: 1, repository: REPOSITORY, status: 'not_submitted', operations: [] };
  let session;
  let request;
  try {
    request = validateRequest(input);
    session = new Session(runtime, signal);
    await session.start(request.actorId);
    output.actor = session.actor;
    if (request.operation === 'reconcile' || request.previous) await reconcile(request, session, output);
    else if (request.operation === 'read') {
      const observed = request.issue ? await session.issue(request.issue) : null;
      output.operations.push({ operation: 'read', status: 'verified', detail: 'Read only; no new material saved.',
        ...(observed ? { issue: observed.number, url: observed.html_url, snapshot: { ...snapshotFields(observed, ['title', 'body']),
          authorId: observed.user.id, state: observed.state } } : {}) });
    } else if (request.operation === 'create') {
      if (request.followUpTo) { await session.issue(request.followUpTo); requireReference(request.body, request.followUpTo); }
      await createIssue(request, session, output);
    } else if (request.operation === 'comment') await addComment(request, session, output);
    else if (request.operation === 'replace') await replaceIssue(request, session, output);
    else if (request.operation === 'labels') await addLabels(request.issue, request.labels, session, output);
  } catch (error) {
    output.operations.push(failure('preflight', error, session?.writeSent));
    if (request?.previous || request?.operation === 'reconcile') {
      output.operations.push({ operation: 'reconcile', status: 'uncertain', detail: 'Earlier outcome remains unresolved; preflight failure is not proof that the earlier write failed.' });
    } else if (error?.code === 'missing' && request?.operation === 'create') {
      output.manual = { status: 'not_submitted', url: `${WEBSITE}/issues/new`, title: request.title, body: request.body, labels: request.labels ?? [] };
    }
  }
  const states = output.operations.map(x => x.status);
  output.status = states.includes('security_stop') ? 'security_stop' : states.includes('uncertain') ? 'uncertain' :
    states.includes('acknowledged') ? 'acknowledged' : states.includes('conflict') ? 'conflict' :
      states.every(s => s === 'verified' || s === 'present') && states.length ? 'verified' :
        states.some(s => s === 'verified' || s === 'present') ? 'partial' : states[0] ?? 'not_submitted';
  return output;
}

function failure(operation, error, sent = false) {
  const known = error instanceof SubmissionError;
  const code = known ? error.code : 'unexpected';
  return { operation, status: code === 'security' ? 'security_stop' : code === 'rejected' ? 'rejected' : sent || error?.sent ? 'uncertain' : 'not_submitted',
    detail: known ? error.message : 'Operation could not be completed; no diagnostic contents were exposed.' };
}

async function createIssue(request, session, output) {
  const operation = { operation: 'create', status: 'not_submitted' };
  output.operations.push(operation);
  try {
    const reply = await session.call('POST', `${API}/issues`, { title: request.title, body: request.body });
    operation.status = 'acknowledged';
    const created = issueRecord(reply);
    Object.assign(operation, { issue: created.number, url: created.html_url, verifiedLink: false });
    const observed = await session.issue(created.number);
    if (observed.id !== created.id || observed.user.id !== session.actor.id || observed.state !== 'open' ||
        !sameText(observed.title, request.title) || !sameText(observed.body, request.body)) {
      operation.detail = 'Acknowledged identity, but current content/author/state differs; reconcile without replay.';
      return;
    }
    Object.assign(operation, { status: 'verified', verifiedLink: true, detail: 'Created issue and supplied content verified.' });
  } catch (error) {
    if (operation.status === 'acknowledged') {
      operation.detail = 'Creation acknowledged; verification incomplete. Do not recreate.';
      if (error?.code === 'security') output.operations.push(failure('verification', error));
    } else mutationFailure(operation, error, session, output);
  }
  if (operation.status === 'verified' && request.labels) await addLabels(operation.issue, request.labels, session, output);
}

async function reconcile(request, session, output) {
  const previous = request.previous;
  const kind = previous?.operation ?? request.operation;
  const original = kind === 'create' && request.operation === 'comment' ? request.followUp : request;
  const attempt = request.attempt ?? { operation: kind, issue: previous.issue ?? request.issue,
    comment: previous.comment, since: previous.since, status: previous.status,
    title: original?.title ?? request.changes?.title, body: original?.body ?? request.changes?.body, labels: original?.labels };
  const result = { operation: 'reconcile', attemptedOperation: attempt.operation, status: 'uncertain',
    detail: 'Read-only reconciliation; attribution of an earlier write remains unproven. Do not replay.' };
  output.operations.push(result);
  try {
    if (attempt.issue && attempt.operation !== 'comment') {
      const observed = await session.issue(attempt.issue);
      Object.assign(result, { issue: observed.number, url: observed.html_url, verifiedLink: true });
      if (attempt.operation !== 'labels') {
        const fields = ['title', 'body'].filter(k => attempt[k] !== undefined);
        if (!fields.length) { result.detail = 'Identity is present, but no expected content was supplied. No new material saved or write attribution established.'; return; }
        if (observed.user.id !== session.actor.id || fields.some(k => !sameText(observed[k] ?? '', attempt[k]))) return;
        if (attempt.operation === 'create' && observed.state !== 'open') { result.detail = 'Known issue is closed; actionable follow-up is not fulfilled by this lookup.'; return; }
        result.status = 'present';
      } else if (attempt.labels?.length) {
        const listing = await session.list(`${API}/issues/${attempt.issue}/labels`);
        const names = new Set(listing.values.map(x => x?.name));
        result.complete = listing.complete;
        if (listing.complete && attempt.labels.every(x => names.has(x))) result.status = 'present';
      }
      return;
    }
    if (attempt.operation === 'comment') {
      await session.issue(attempt.issue);
      if (attempt.comment) {
        const observed = commentRecord(await session.get(`${API}/issues/comments/${attempt.comment}`), attempt.issue, attempt.comment);
        Object.assign(result, { issue: attempt.issue, comment: observed.id, url: observed.html_url, verifiedLink: true });
        if (attempt.body !== undefined && observed.user.id === session.actor.id && sameText(observed.body, attempt.body)) result.status = 'present';
        return;
      }
    }
    const suffix = attempt.since ? `${attempt.operation === 'create' ? '&' : '?'}since=${encodeURIComponent(attempt.since)}` : '';
    const path = attempt.operation === 'create'
      ? `${API}/issues?creator=${encodeURIComponent(session.actor.login)}&state=all&sort=created&direction=desc${suffix}`
      : `${API}/issues/${attempt.issue}/comments${suffix}`;
    const listing = await session.list(path);
    const candidates = [];
    for (const value of listing.values) {
      if (attempt.operation === 'create' && Object.hasOwn(value, 'pull_request')) continue;
      const item = attempt.operation === 'create' ? issueRecord(value) : commentRecord(value, attempt.issue);
      if (item.user.id !== session.actor.id) continue;
      if (attempt.body !== undefined && !sameText(item.body ?? '', attempt.body)) continue;
      if (attempt.title !== undefined && !sameText(item.title, attempt.title)) continue;
      candidates.push(attempt.operation === 'create' ? { issue: item.number, url: item.html_url } : { comment: item.id, issue: attempt.issue, url: item.html_url });
    }
    Object.assign(result, { candidates, complete: listing.complete });
    result.detail = 'Bounded lookup ended. Matching text or no candidate is inconclusive attribution; no write or manual resubmission.';
  } catch (error) {
    if (error?.code === 'security') output.operations.push(failure('reconciliation-read', error));
    result.detail = 'Read-only reconciliation could not complete; prior uncertainty remains. No replay or manual resubmission.';
  }
}

function requireReference(body, number) {
  const url = `${WEBSITE}/issues/${number}`;
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!new RegExp(`${escaped}(?![0-9A-Za-z_/-])`).test(body) && !new RegExp(`(^|[^0-9A-Za-z_])#${number}(?![0-9A-Za-z_])`).test(body)) {
    throw new SubmissionError('input', 'Caller must include the relevant fixed-repository issue reference in the new body.');
  }
}
function snapshotFields(value, fields) {
  return Object.fromEntries(fields.map(key => {
    const text = value[key] ?? '';
    return [key, typeof text === 'string' && text.isWellFormed() && Buffer.byteLength(text) <= LIMITS[key] ? text :
      { omitted: true, reason: 'Remote text exceeds the helper content bound or is not valid Unicode.' }];
  }));
}
function requireAuthor(issue, session) {
  if (issue.user.id !== session.actor.id) throw new SubmissionError('ownership', 'Only the authenticated author may change this issue’s title, body or labels.');
}

async function addComment(request, session, output) {
  const target = await session.issue(request.issue);
  if (target.state === 'closed' && request.intent === 'actionable') {
    if (!request.followUp) throw new SubmissionError('input', 'Actionable closed-issue follow-up requires caller-supplied new-issue content and authorization.');
    requireReference(request.followUp.body, request.issue);
    await createIssue(request.followUp, session, output);
    return;
  }
  const operation = { operation: 'comment', issue: request.issue, status: 'not_submitted' };
  output.operations.push(operation);
  try {
    const reply = await session.call('POST', `${API}/issues/${request.issue}/comments`, { body: request.body });
    operation.status = 'acknowledged';
    const created = commentRecord(reply, request.issue);
    Object.assign(operation, { comment: created.id, url: created.html_url, verifiedLink: false });
    const observed = commentRecord(await session.get(`${API}/issues/comments/${created.id}`), request.issue, created.id);
    if (observed.user.id !== session.actor.id || !sameText(observed.body, request.body)) {
      operation.detail = 'Acknowledged comment differs from expected current content/author; do not repost.'; return;
    }
    Object.assign(operation, { status: 'verified', verifiedLink: true, detail: 'New comment and supplied content verified.' });
  } catch (error) { mutationFailure(operation, error, session, output); }
}

async function replaceIssue(request, session, output) {
  const target = await session.issue(request.issue);
  requireAuthor(target, session);
  const operation = { operation: 'replace', issue: request.issue, status: 'not_submitted' };
  output.operations.push(operation);
  if (Object.keys(request.base).some(k => !sameText(target[k] ?? '', request.base[k]))) {
    Object.assign(operation, { status: 'conflict', detail: 'Current fields differ from the caller’s base; no overwrite.',
      current: snapshotFields(target, Object.keys(request.base)) }); return;
  }
  try {
    await session.call('PATCH', `${API}/issues/${request.issue}`, request.changes);
    Object.assign(operation, { status: 'acknowledged', url: target.html_url, verifiedLink: false });
    const observed = await session.issue(request.issue);
    if (observed.id !== target.id || observed.user.id !== session.actor.id || Object.keys(request.changes).some(k => !sameText(observed[k], request.changes[k]))) {
      operation.detail = 'Update acknowledged, but current fields or identity differ; reconcile without replay.'; return;
    }
    Object.assign(operation, { status: 'verified', verifiedLink: true, detail: 'Requested fields observed after update; no atomic concurrency guarantee.' });
  } catch (error) { mutationFailure(operation, error, session, output); }
}

function mutationFailure(operation, error, session, output) {
  if (operation.status === 'acknowledged' || [200, 201].includes(error?.status)) {
    Object.assign(operation, { status: 'acknowledged', detail: 'Write acknowledged; verification incomplete. Do not replay.' });
    if (error?.code === 'security') output.operations.push(failure('verification', error));
  } else Object.assign(operation, failure(operation.operation, error, session.writeSent));
}

async function addLabels(number, requested, session, output) {
  const operation = { operation: 'labels', issue: number, status: 'not_submitted', requested };
  output.operations.push(operation);
  let sent = false;
  try {
    const target = await session.issue(number);
    requireAuthor(target, session);
    if (!session.canLabel) { operation.detail = 'Organization permission was not established; issue content remains saved.'; return; }
    const catalog = await session.list(`${API}/labels`);
    if (catalog.values.some(x => typeof x?.name !== 'string')) throw new SubmissionError('response', 'Invalid label catalog response.');
    if (!catalog.complete) { Object.assign(operation, { complete: false, detail: 'Catalog visibility is incomplete; no label mutation attempted.' }); return; }
    const known = new Set(catalog.values.map(x => x.name.toLowerCase()));
    const absent = requested.filter(x => !known.has(x.toLowerCase()));
    if (absent.length) { Object.assign(operation, { missing: absent, detail: catalog.complete ? 'Requested labels are absent; runtime does not create them.' : 'Label catalog is incomplete; requested labels were not all confirmed.' }); return; }
    const current = await session.list(`${API}/issues/${number}/labels`);
    if (current.values.some(x => typeof x?.name !== 'string')) throw new SubmissionError('response', 'Invalid issue label response.');
    const existing = new Set(current.values.map(x => x.name.toLowerCase()));
    const missing = requested.filter(x => !existing.has(x.toLowerCase()));
    if (!current.complete) { Object.assign(operation, { complete: false, detail: 'Existing label visibility is incomplete; no mutation attempted.' }); return; }
    if (!missing.length) { Object.assign(operation, { status: 'present', detail: 'Requested labels already present; no write.' }); return; }
    // Recheck authorship immediately before a restricted write after catalog reads.
    const fresh = await session.issue(number);
    requireAuthor(fresh, session);
    if (fresh.id !== target.id) throw new SubmissionError('response', 'Target identity changed.');
    session.writeSent = false;
    sent = true;
    await session.call('POST', `${API}/issues/${number}/labels`, { labels: missing });
    operation.status = 'acknowledged';
    const observed = await session.list(`${API}/issues/${number}/labels`);
    if (!observed.complete) { Object.assign(operation, { complete: false, detail: 'Label write acknowledged, but bounded readback is incomplete.' }); return; }
    const names = new Set(observed.values.map(x => x?.name?.toLowerCase()));
    if (requested.some(x => !names.has(x.toLowerCase())) || [...existing].some(x => !names.has(x))) {
      operation.detail = 'Label write acknowledged, but requested/existing label readback is incomplete.'; return;
    }
    Object.assign(operation, { status: 'verified', detail: 'Requested labels observed; existing labels preserved.' });
  } catch (error) {
    if (sent) mutationFailure(operation, error, session, output);
    else Object.assign(operation, failure('labels', error));
  }
}
