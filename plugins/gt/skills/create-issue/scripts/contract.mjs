export const REPOSITORY = 'AndrewGodlewsky/andrew-skills';
export const REPOSITORY_ID = 1364861754;
export const API = `/repos/${REPOSITORY}`;
export const WEBSITE = `https://github.com/${REPOSITORY}`;
export const LIMITS = Object.freeze({ input: 262144, response: 2097152, title: 1024, body: 60000,
  labels: 10, label: 128, requestMs: 15000, operationMs: 120000, attempts: 3, pages: 3, pageSize: 30 });

export class SubmissionError extends Error {
  constructor(code, message, { sent = false, status } = {}) {
    super(message); this.code = code; this.sent = sent; this.status = status;
  }
}
export function requireValue(ok, message) {
  if (!ok) throw new SubmissionError('input', message);
}
export const positiveId = value => Number.isSafeInteger(value) && value > 0;
export function record(value, allowed, name) {
  requireValue(value !== null && typeof value === 'object' && !Array.isArray(value) &&
    [Object.prototype, null].includes(Object.getPrototypeOf(value)), `${name} must be an object.`);
  requireValue(Object.keys(value).every(key => allowed.includes(key)), `${name} contains unsupported fields.`);
}
export function textValue(value, max, name, empty = false) {
  requireValue(typeof value === 'string' && value.isWellFormed() && !value.includes('\0') &&
    (empty || value.trim().length > 0) && Buffer.byteLength(value, 'utf8') <= max, `${name} is missing or exceeds its text limit.`);
}
function content(value, name, { optional = false, empty = false } = {}) {
  record(value, ['title', 'body'], name);
  if (optional) requireValue(Object.keys(value).length > 0, `${name} must include a title or body.`);
  for (const key of ['title', 'body']) {
    if (!optional || Object.hasOwn(value, key)) textValue(value[key], LIMITS[key], `${name}.${key}`, empty && key === 'body');
  }
}
function labels(value) {
  requireValue(Array.isArray(value) && value.length > 0 && value.length <= LIMITS.labels, 'labels must be a bounded nonempty array.');
  for (const label of value) textValue(label, LIMITS.label, 'label');
  requireValue(new Set(value.map(x => x.toLowerCase())).size === value.length, 'Duplicate label names are not accepted.');
}
function evidence(value) {
  record(value, ['status', 'operation', 'issue', 'comment', 'since'], 'previous');
  requireValue(['uncertain', 'acknowledged', 'verified'].includes(value.status), 'Invalid previous status.');
  if (value.operation !== undefined) requireValue(['create', 'comment', 'replace', 'labels'].includes(value.operation), 'Invalid previous operation.');
  for (const key of ['issue', 'comment']) if (value[key] !== undefined) requireValue(positiveId(value[key]), 'Invalid previous identity.');
  if (value.since !== undefined) requireValue(typeof value.since === 'string' &&
    /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(value.since) && Number.isFinite(Date.parse(value.since)), 'Invalid reconciliation timestamp.');
}
export function validateRequest(input) {
  const common = ['version', 'operation', 'actorId', 'scope', 'authorized', 'previous'];
  const fields = { create: ['title', 'body', 'labels', 'followUpTo'], comment: ['issue', 'body', 'intent', 'followUp'],
    replace: ['issue', 'changes', 'base'], labels: ['issue', 'labels'], read: ['issue'],
    reconcile: ['attempt'] };
  requireValue(input && Object.hasOwn(fields, input.operation), 'Unsupported operation.');
  record(input, [...common, ...fields[input.operation]], 'request');
  requireValue(input.version === 1, 'Unsupported request version.');
  requireValue(Buffer.byteLength(JSON.stringify(input), 'utf8') <= LIMITS.input, 'Request exceeds its byte limit.');
  if (input.actorId !== undefined) requireValue(positiveId(input.actorId), 'Invalid actorId.');
  if (input.issue !== undefined) requireValue(positiveId(input.issue), 'Invalid issue number.');
  if (input.operation !== 'read') requireValue(positiveId(input.actorId), 'Supply the expected actorId established by a read.');
  if (input.operation !== 'read' && input.operation !== 'reconcile') {
    requireValue(input.scope === 'gt' && input.authorized === true, 'GT relevance and existing workflow authorization are required.');
  }
  if (input.previous !== undefined) evidence(input.previous);
  if (input.operation === 'create') {
    content({ title: input.title, body: input.body }, 'content');
    if (input.followUpTo !== undefined) requireValue(positiveId(input.followUpTo), 'Invalid follow-up issue.');
  }
  if (['comment', 'replace', 'labels'].includes(input.operation)) requireValue(positiveId(input.issue), 'An issue number is required.');
  if (input.operation === 'comment') {
    textValue(input.body, LIMITS.body, 'body');
    requireValue(['informational', 'actionable'].includes(input.intent), 'Comment intent is required.');
    if (input.followUp !== undefined) {
      record(input.followUp, ['title', 'body', 'labels'], 'followUp');
      content({ title: input.followUp.title, body: input.followUp.body }, 'followUp');
      if (input.followUp.labels !== undefined) labels(input.followUp.labels);
    }
  }
  if (input.operation === 'replace') {
    content(input.changes, 'changes', { optional: true });
    content(input.base, 'base', { optional: true, empty: true });
    requireValue(Object.keys(input.changes).sort().join() === Object.keys(input.base).sort().join(), 'Base must cover exactly the replaced fields.');
  }
  if (input.labels !== undefined) labels(input.labels);
  if (input.operation === 'labels') labels(input.labels);
  if (input.operation === 'reconcile') {
    record(input.attempt, ['operation', 'issue', 'comment', 'title', 'body', 'labels', 'since', 'status'], 'attempt');
    requireValue(['create', 'comment', 'replace', 'labels'].includes(input.attempt.operation), 'Invalid attempted operation.');
    const a = input.attempt;
    evidence(Object.fromEntries(['status', 'issue', 'comment', 'since'].filter(k => a[k] !== undefined).map(k => [k, a[k]])));
    if (a.operation !== 'create') requireValue(positiveId(a.issue), 'Attempted target issue is required.');
    if (a.title !== undefined) textValue(a.title, LIMITS.title, 'attempt.title');
    if (a.body !== undefined) textValue(a.body, LIMITS.body, 'attempt.body');
    if (a.labels !== undefined) labels(a.labels);
  }
  return structuredClone(input);
}

export function decodeInput(bytes) {
  requireValue(bytes.length <= LIMITS.input, 'Request exceeds its byte limit.');
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new SubmissionError('input', 'Input must be one valid UTF-8 JSON request.'); }
}
