// Throwaway policy sketch. All identities, permissions and responses are fixtures.
// Question: can callers retain their own content while receiving useful, bounded
// submission results? This is not the production helper or a security boundary.
export const repository = 'AndrewGodlewsky/andrew-skills';
export const manualUrl = `https://github.com/${repository}/issues/new`;

export function initialState() {
  return { phase: 'prepared', writes: [], results: [], payload: null };
}

export function step(state, fixture, action) {
  const next = structuredClone(state);
  const result = (operation, status, detail) => next.results.push({ operation, status, detail });
  const finish = (phase) => { next.phase = phase; return next; };
  const { request: r, world: w } = fixture;
  if (action === 'check') {
    if (!['uncertain', 'acknowledged'].includes(state.phase)) return state;
    if (!w.toolsAvailable) {
      result('read-only check', 'unavailable', 'Selected environment lacks tooling. Prior uncertainty remains; no lookup was made and no manual resubmission is offered.');
      return next;
    }
    if (w.reconciliation === 'identity-readback') {
      result('read-only check', 'verified', 'The acknowledged identity is present with the supplied content. No second write.');
      return finish('verified');
    }
    result('read-only check', 'inconclusive', 'Bounded fixture lookup ended. Matching text or no match cannot prove this attempt succeeded or failed. Return to caller; no new submission or manual resubmit link.');
    return next;
  }
  if (action !== 'submit') return state;
  if (state.phase !== 'prepared') {
    result('repeat', 'no additional write', `Prior result remains ${state.phase}. Reuse known evidence; uncertain writes need reconciliation.`);
    return next;
  }
  if (!r.gtWork || r.destination !== undefined) {
    result('scope', 'not submitted', 'Only GT work for the fixed repository is supported; destination arguments are not accepted.');
    return finish('blocked');
  }
  if (w.securityStop) {
    result('access', 'security stop', 'Simulated permission denial. Stop and return control; no alternate account, environment or manual bypass.');
    return finish('stopped');
  }
  if (w.priorUncertain) {
    result('previous attempt', 'outcome uncertain', 'An earlier write may have succeeded. Reconcile before considering any submission, including manual.');
    return finish('uncertain');
  }
  if (!r.authorization) {
    result('authorization', 'not submitted', 'Return missing authorization to the calling agent. It owns any human question.');
    return finish('blocked');
  }
  const operation = r.operation;
  if (!['create', 'comment', 'replace', 'organize'].includes(operation)) {
    result('operation', 'not submitted', 'This sketch only supports creation, new comments, explicit title/body replacement and additive organization.');
    return finish('blocked');
  }
  const hasText = value => typeof value === 'string' && value.trim().length > 0;
  const actionableClosed = w.issue?.state === 'closed' && r.actionable;
  if ((operation === 'create' || actionableClosed) && (!hasText(r.title) || !hasText(r.body)) ||
      operation === 'comment' && !actionableClosed && !hasText(r.comment) ||
      operation === 'replace' && !hasText(r.title) && !hasText(r.body)) {
    result('content', 'not submitted', 'Return missing caller-authored content; do not draft it or interview the human.');
    return finish('blocked');
  }
  next.payload = actionableClosed || operation === 'create'
    ? { title: r.title, body: r.body }
    : operation === 'comment' ? { body: r.comment }
      : operation === 'replace' ? Object.fromEntries(['title', 'body'].filter(k => r[k] !== undefined).map(k => [k, r[k]]))
        : {};
  if (!w.toolsAvailable) {
    result('prerequisites', 'prepared; not submitted', `Missing Node/gh in the selected environment. Caller retains payload and organization; manual destination: ${manualUrl}`);
    return finish('prepared-only');
  }
  if (operation !== 'create' && (!w.issue || w.issue.repository !== repository || w.issue.pullRequest)) {
    result('target', 'not submitted', 'Target issue identity could not be validated in the fixed repository.');
    return finish('blocked');
  }
  const owns = issue => w.actorId !== undefined && issue?.authorId === w.actorId;
  if (['replace', 'organize'].includes(operation) && !owns(w.issue)) {
    result(operation, 'not submitted', 'The active account did not author this issue. Admin privileges do not override the skill boundary.');
    return finish('blocked');
  }
  if (operation === 'replace' && w.interveningEdit) {
    result('replace', 'conflict; not submitted', 'Fresh read differs from the caller’s base. Return current content to caller; do not knowingly overwrite it. No atomic guarantee modeled.');
    return finish('blocked');
  }
  const actualOperation = actionableClosed ? 'create' : operation;
  if (actualOperation !== 'organize') {
    next.writes.push({ operation: actualOperation, repository, target: actualOperation === 'create' ? 'NEW-FIXTURE' : w.issue.id, payload: next.payload });
    if (w.response === 'lost') {
      result(actualOperation, 'outcome uncertain', 'Request sent; no definitive response or identity. No replay, receipt, marker or claim that it failed.');
      return finish('uncertain');
    }
    if (w.response === 'acknowledged') {
      result(actualOperation, 'acknowledged; verification incomplete', 'Fixture response returned identity ACK-FIXTURE. Preserve it and verify that identity; no verified URL yet.');
      return finish('acknowledged');
    }
    result(actualOperation, 'verified (simulated)', actualOperation === 'create' ? 'NEW-FIXTURE is open; title/body preserved exactly.' : 'Requested caller content is present at the validated target.');
    if (actionableClosed) result('closed issue', 'unchanged', 'A new open issue carries the caller’s reference. No reopening or unrequested backlink comment.');
  }
  // Organization is a separate, additive step. Existing comments do not grant
  // permission to label someone else's issue.
  const targetOwn = actualOperation === 'create' || owns(w.issue);
  for (const label of r.labels ?? []) {
    if (!targetOwn) result('label', 'incomplete', `${label}: another author’s issue; no write.`);
    else if (w.issue?.labels?.includes(label) && actualOperation !== 'create') result('label', 'already present', `${label}: skipped; other labels preserved.`);
    else if (!w.catalog.includes(label)) result('label', 'incomplete', `${label}: absent from repository catalog; runtime does not create labels.`);
    else if (!w.canOrganize) result('label', 'incomplete', `${label}: selected actor lacks organization capability; no label request attempted.`);
    else {
      next.writes.push({ operation: 'add-label', label });
      result('label', 'verified (simulated)', label);
    }
  }
  for (const edge of r.relationships ?? []) {
    const other = w.related?.[edge.other];
    if (!targetOwn || !owns(other) || other?.repository !== repository || other?.pullRequest) result(edge.kind, 'incomplete', 'Both ends must be validated own-authored issues in the fixed repository.');
    else if (w.existingEdges?.includes(edge.kind)) result(edge.kind, 'already present', 'Requested edge observed; no write.');
    else if (edge.kind === 'parent' && w.conflictingParent) result(edge.kind, 'conflict', 'Existing different parent; no automatic reparenting.');
    else if (!w.canOrganize) result(edge.kind, 'incomplete', 'Selected actor lacks native relationship capability; no request attempted.');
    else {
      next.writes.push({ operation: `add-${edge.kind}`, other: edge.other });
      result(edge.kind, 'verified (simulated)', edge.other);
    }
  }
  return finish(next.results.some(x => ['incomplete', 'conflict'].includes(x.status)) ? 'partial' : 'verified');
}
