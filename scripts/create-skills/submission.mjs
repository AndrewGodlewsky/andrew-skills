import { sha256, readPackage } from './package.mjs';

const repository = 'AndrewGodlewsky/andrew-skills';
const urlRoot = `https://github.com/${repository}/issues/`;
export const submissionLimits = Object.freeze({ body: 60000, chunk: 44000, parts: 32, input: 16 * 1024 * 1024 });
const bytes = value => Buffer.byteLength(value, 'utf8');
const lf = value => value.replaceAll('\r\n', '\n');
function requireText(value, label, max = submissionLimits.input) {
  if (typeof value !== 'string' || !value.trim() || !value.isWellFormed() || bytes(value) > max) throw new Error(`Invalid or oversized ${label}.`);
  return lf(value);
}
function split(text) {
  const chunks = []; let part = '', size = 0;
  for (const char of text) {
    const count = bytes(char);
    if (size + count > submissionLimits.chunk) { chunks.push(part); part = ''; size = 0; }
    part += char; size += count;
  }
  if (part) chunks.push(part);
  return chunks;
}
function fenced(text) {
  let width = 3;
  for (const match of text.matchAll(/`+/g)) width = Math.max(width, match[0].length + 1);
  if (width > 1024) throw new Error('Embedded fence is too long for readable issue serialization.');
  const fence = '`'.repeat(width);
  return `${fence}\n${text}\n${fence}`;
}
function assertBody(text) { requireText(text, 'body', submissionLimits.body); }

export function prepareSubmission(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected a preparation object.');
  for (const key of Object.keys(input)) if (!['title', 'specification', 'implementation', 'verification', 'packageDirectory'].includes(key)) throw new Error(`Unknown preparation field: ${key}`);
  const title = requireText(input.title, 'title', 1024);
  const sections = [
    ['Specification', requireText(input.specification, 'specification')],
    ['Implementation attempt', requireText(input.implementation, 'implementation')],
    ['Verification', requireText(input.verification, 'verification')],
  ];
  const manifest = [], attachments = [];
  if (input.packageDirectory !== undefined) {
    requireText(input.packageDirectory, 'package directory', 4096);
    const pkg = readPackage(input.packageDirectory);
    for (const [path, file] of pkg.files) {
      let text;
      try { text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(file.data); if (text.includes('\0')) text = undefined; }
      catch { text = undefined; }
      if (text === undefined) {
        const record = { path, mode: file.mode, bytes: file.data.length, sha256: sha256(file.data), representation: 'binary-exact' };
        manifest.push(record); attachments.push(record);
      } else {
        const canonical = lf(text);
        manifest.push({ path, mode: file.mode, bytes: bytes(canonical), sha256: sha256(canonical), representation: 'UTF-8-LF' });
        // Even an empty file must be represented rather than silently dropped.
        const fragments = split(canonical); if (!fragments.length) fragments.push('');
        fragments.forEach((fragment, index) => sections.push([`File ${JSON.stringify(path)} — fragment ${index + 1}/${fragments.length}`, fenced(fragment)]));
      }
    }
  }
  const intro = '## Review handoff\n\nSpecification, implementation attempt and verification are independent. Delivery status does not imply check success or marketplace acceptance.\n\n';
  const manifestText = manifest.length ? `## File manifest\n\nText hashes use UTF-8 with LF line endings. Binary hashes use exact bytes.\n\n${fenced(JSON.stringify(manifest, null, 2))}\n\n` : '## Files\n\nNo package files supplied; see the implementation attempt.\n\n';
  const documents = sections.flatMap(([name, text]) => {
    if (bytes(text) <= 50000) return [`## ${name}\n\n${text}`];
    if (name.startsWith('File ')) throw new Error('File fragment framing exceeds its bound.');
    return split(text).map((chunk, index, all) => `## ${name} — continuation ${index + 1}/${all.length}\n\n${chunk}`);
  });
  const compact = intro + manifestText + documents.join('\n\n');
  if (bytes(compact) <= 55000 && !attachments.length) {
    return { version: 1, title, initialBody: compact, parts: [], attachments, manifest, summary: intro + manifestText };
  }
  const packed = []; let current = '';
  for (const document of documents) {
    if (bytes(current + '\n\n' + document) > 54000 && current) { packed.push(current); current = ''; }
    current += (current ? '\n\n' : '') + document;
  }
  if (current) packed.push(current);
  if (packed.length > submissionLimits.parts) throw new Error('Handoff exceeds 32 comment parts; preserve it locally and report the size limitation.');
  const parts = packed.map((body, index) => {
    const text = `# Handoff part ${index + 1}/${packed.length}\n\n${body}`; assertBody(text);
    return { body: text, sha256: sha256(text) };
  });
  const summary = intro + manifestText + `## Contents\n\n${parts.length} numbered text part(s); ${attachments.length} binary resource(s) require a manual ZIP attachment.\n\n`;
  // Reserve the final index before creating anything. Canonical issue/comment
  // URLs have bounded numeric IDs; one manual ZIP carries all binary resources.
  if (bytes(summary) + parts.length * 160 + (attachments.length ? 2200 : 0) + 512 > submissionLimits.body) throw new Error('Manifest leaves insufficient space for the verified delivery index.');
  const initialBody = summary + 'Delivery: supplemental content pending verification.'; assertBody(initialBody);
  return { version: 1, title, initialBody, parts, attachments, manifest, summary };
}

const stable = value => JSON.stringify(value, function (key, v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v;
});
const positiveId = value => Number.isSafeInteger(value) && value > 0;

// Stateless next-action calculation. Only the enabled create-issue skill executes
// returned requests. Evidence is supplied by the caller, never stored here.
export function nextSubmission({ plan, actorId, authorized, history = [], attachments = [] }) {
  if (!positiveId(actorId) || authorized !== true) throw new Error('Observed actor and existing submission authority are required.');
  if (plan?.version !== 1 || !Array.isArray(plan.parts) || plan.parts.length > submissionLimits.parts || !Array.isArray(plan.attachments)) throw new Error('Invalid delivery plan.');
  requireText(plan.title, 'title', 1024); assertBody(plan.initialBody); assertBody(plan.summary);
  for (const part of plan.parts) { assertBody(part.body); if (sha256(part.body) !== part.sha256) throw new Error('Changed delivery part.'); }
  if (!Array.isArray(history) || history.length > 256 || !Array.isArray(attachments)) throw new Error('Invalid operation evidence.');
  let cursor = 0;
  const mutation = fields => ({ version: 1, actorId, scope: 'gt', authorized: true, ...fields });
  function action(request) {
    if (bytes(JSON.stringify(request)) > 262144) throw new Error('Serialized helper request exceeds 256 KiB.');
    const record = history[cursor++];
    if (!record) return { next: { status: 'ready', request, minimumWriteIntervalMs: 1000 } };
    if (stable(record.request) !== stable(request)) throw new Error('Evidence differs from the expected request; preserve it and resolve the mismatch, never restart.');
    const result = record.result ?? { repository, actor: { id: actorId }, status: 'uncertain',
      operations: [{ operation: request.operation, status: request.operation === 'read' ? 'not_submitted' : 'uncertain', detail: 'No helper result was captured.' }] };
    if (!result || result.repository !== repository || result.actor?.id !== actorId || !Array.isArray(result.operations)) return { next: { status: 'uncertain', request, detail: 'Missing or invalid helper result; preserve attempted request, reconcile through create-issue without replay.' } };
    if (result.operations.some(x => x.status === 'security_stop')) return { next: { status: 'security_stop', result } };
    let op = result.operations.find(x => x.operation === request.operation);
    if (!op || !['verified', 'present'].includes(op.status)) {
      if (request.operation === 'read') return { next: { status: result.status, result } };
      // Any attempted write with no verified outcome is handed back for the
      // dependency's read-only recovery, not automatically retried.
      const attempt = { operation: request.operation, status: ['acknowledged', 'verified'].includes(op?.status) ? op.status : 'uncertain' };
      if (positiveId(op?.issue ?? request.issue)) attempt.issue = op?.issue ?? request.issue;
      if (positiveId(op?.comment)) attempt.comment = op.comment;
      for (const key of ['issue', 'comment']) if (record.known?.[key] !== undefined) {
        if (!positiveId(record.known[key]) || (attempt[key] && attempt[key] !== record.known[key])) throw new Error('Conflicting known operation identity.');
        attempt[key] = record.known[key];
      }
      if (request.title ?? request.changes?.title) attempt.title = request.title ?? request.changes.title;
      if (request.body ?? request.changes?.body) attempt.body = request.body ?? request.changes.body;
      const recoveryRequest = { version: 1, operation: 'reconcile', actorId, attempt };
      const recovered = record.reconciliation;
      if (!recovered) return { next: { status: op?.status ?? 'uncertain', request, result, recoveryRequest,
        recovery: 'Reconcile through create-issue; append reconciliation to this evidence record without replacing the original result.' } };
      if (stable(recovered.request) !== stable(recoveryRequest)) throw new Error('Reconciliation request differs from the attempted content.');
      const recovery = recovered.result;
      if (recovery?.repository !== repository || recovery.actor?.id !== actorId || !Array.isArray(recovery.operations)) throw new Error('Invalid reconciliation evidence.');
      if (recovery.operations.some(x => x.status === 'security_stop')) return { next: { status: 'security_stop', result: recovery } };
      const observed = recovery.operations.find(x => x.operation === 'reconcile' && x.attemptedOperation === request.operation);
      if (observed?.status !== 'present') return { next: { status: 'uncertain', result: recovery, recoveryRequest } };
      op = observed;
    }
    if (request.operation !== 'read' && op.verifiedLink !== true) throw new Error('Operation lacks verified link evidence.');
    if (request.operation === 'create' && (!positiveId(op.issue) || op.url !== `${urlRoot}${op.issue}`)) throw new Error('Invalid created issue identity.');
    if (request.issue && op.issue !== request.issue) throw new Error('Operation targets a different issue.');
    if (request.operation === 'comment' && (!positiveId(op.comment) || op.url !== `${urlRoot}${op.issue}#issuecomment-${op.comment}`)) throw new Error('Invalid comment identity.');
    return { op };
  }
  let result = action(mutation({ operation: 'create', title: plan.title, body: plan.initialBody }));
  if (result.next) return result.next;
  const issue = result.op.issue, urls = [];
  function freshRead() {
    const observed = action({ version: 1, operation: 'read', actorId, issue });
    if (observed.next) return observed;
    const snapshot = observed.op.snapshot;
    if (snapshot?.state !== 'open' || snapshot.authorId !== actorId || typeof snapshot.body !== 'string' || lf(snapshot.body) !== plan.initialBody) return { next: { status: 'conflict', issue, detail: 'Issue state, author or body changed or was omitted; resolve from a fresh read.' } };
    return observed;
  }
  for (const part of plan.parts) {
    result = freshRead(); if (result.next) return result.next;
    result = action(mutation({ operation: 'comment', issue, body: part.body, intent: 'informational' }));
    if (result.next) return result.next;
    urls.push(result.op.url);
  }
  if (plan.attachments.length) {
    const allVerified = plan.attachments.every(expected => attachments.some(actual => actual.path === expected.path && actual.sha256 === expected.sha256
      && actual.verified === true && typeof actual.url === 'string' && actual.url.length <= 2048 && !/[\s<>()[\]]/.test(actual.url)
      && /^https:\/\/(?:github\.com\/user-attachments\/|(?:user-images|private-user-images)\.githubusercontent\.com\/)/.test(actual.url)));
    if (!allVerified) return { status: 'attachment_pending', issue, expected: plan.attachments, detail: 'Verify the manual ZIP and each binary hash; do not claim whole-handoff completion.' };
    if (new Set(attachments.map(x => x.url)).size !== 1) throw new Error('Use one verified ZIP for this handoff’s binary resources.');
  }
  if (attachments.length !== plan.attachments.length) throw new Error('Unexpected or duplicate attachment evidence.');
  if (plan.parts.length || plan.attachments.length) {
    result = freshRead(); if (result.next) return result.next;
    const body = plan.summary + 'Delivery: all declared content verified.\n\n'
      + urls.map((url, index) => `- [Part ${index + 1}](${url})`).join('\n')
      + (attachments.length ? `\n\n[Verified binary ZIP](${attachments[0].url}); per-file hashes are in the manifest.` : '');
    assertBody(body);
    result = action(mutation({ operation: 'replace', issue, base: { body: plan.initialBody }, changes: { body } }));
    if (result.next) return result.next;
  }
  if (history.length !== cursor) throw new Error('Unexpected remaining operation evidence; resolve it before declaring completion.');
  return { status: 'delivered', issue, url: `${urlRoot}${issue}`, detail: 'Declared content delivered; build/check quality remains separate.' };
}
