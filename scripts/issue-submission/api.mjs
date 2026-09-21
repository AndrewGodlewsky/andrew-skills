import { setTimeout as pause } from 'node:timers/promises';
import { API, LIMITS, REPOSITORY, REPOSITORY_ID, WEBSITE, SubmissionError, positiveId } from './contract.mjs';

function responseCheck(condition) {
  if (!condition) throw new SubmissionError('response', 'Response identity or shape could not be verified.');
}
export function issueRecord(value, number) {
  responseCheck(value && positiveId(value.id) && positiveId(value.number) && (!number || value.number === number) &&
    !Object.hasOwn(value, 'pull_request') && value.repository_url === `https://api.github.com${API}` &&
    value.url === `https://api.github.com${API}/issues/${value.number}` && value.html_url === `${WEBSITE}/issues/${value.number}` &&
    positiveId(value.user?.id) && ['open', 'closed'].includes(value.state) &&
    typeof value.title === 'string' && (value.body === null || typeof value.body === 'string'));
  return value;
}
export function commentRecord(value, issue, id) {
  responseCheck(value && positiveId(value.id) && (!id || value.id === id) && positiveId(value.user?.id) &&
    value.issue_url === `https://api.github.com${API}/issues/${issue}` &&
    value.url === `https://api.github.com${API}/issues/comments/${value.id}` &&
    value.html_url === `${WEBSITE}/issues/${issue}#issuecomment-${value.id}` && typeof value.body === 'string');
  return value;
}
export const sameText = (a, b) => typeof a === 'string' && typeof b === 'string' && a.replaceAll('\r\n', '\n') === b.replaceAll('\r\n', '\n');

export class Session {
  constructor(runtime, signal) {
    this.runtime = runtime;
    this.now = runtime.now ?? Date.now;
    this.sleep = runtime.sleep ?? ((ms, signal) => pause(ms, undefined, { signal }));
    this.signal = signal;
    this.deadline = this.now() + LIMITS.operationMs;
    this.lastWrite = -Infinity;
    this.writeSent = false;
  }
  remaining() {
    if (this.signal?.aborted) throw new SubmissionError('cancelled', 'Operation cancelled.');
    const remaining = this.deadline - this.now();
    if (remaining <= 0) throw new SubmissionError('timeout', 'Operation time budget exhausted.');
    return remaining;
  }
  async wait(ms) {
    if (ms >= this.remaining()) throw new SubmissionError('rate_limit', 'Required delay exceeds the operation budget.');
    try { await this.sleep(ms, this.signal); }
    catch { throw new SubmissionError('cancelled', 'Operation cancelled.'); }
    this.remaining();
  }
  async start(expectedActor) {
    await this.runtime.authenticate({ timeoutMs: Math.min(LIMITS.requestMs, this.remaining()), signal: this.signal });
    const actor = await this.get('/user');
    responseCheck(positiveId(actor?.id) && typeof actor.login === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}$/.test(actor.login));
    this.actor = { id: actor.id, login: actor.login };
    if (expectedActor !== undefined && actor.id !== expectedActor) throw new SubmissionError('identity', 'Authenticated actor differs from the expected actor; no mutation performed.');
    const repo = await this.get(API);
    responseCheck(repo?.id === REPOSITORY_ID && repo.full_name === REPOSITORY && repo.has_issues === true && repo.archived === false);
    this.canLabel = repo.permissions?.push === true || repo.permissions?.triage === true || repo.permissions?.maintain === true || repo.permissions?.admin === true;
  }
  async call(method, path, body) {
    const write = method !== 'GET';
    if (write && this.now() - this.lastWrite < 1000) await this.wait(1000 - (this.now() - this.lastWrite));
    for (let attempt = 0; attempt < (write ? 1 : LIMITS.attempts); attempt++) {
      const timeoutMs = Math.min(LIMITS.requestMs, this.remaining());
      let response;
      try {
        if (write) { this.writeSent = true; this.lastWrite = this.now(); }
        response = await this.runtime.request(method, path, body, { timeoutMs, signal: this.signal });
      } catch (error) {
        const failure = error instanceof SubmissionError ? error : new SubmissionError('transport', 'Request failed without a definitive response.', { sent: write });
        if (!write && ['transport', 'timeout'].includes(failure.code) && attempt + 1 < LIMITS.attempts) { await this.wait(250 * 2 ** attempt); continue; }
        throw failure;
      }
      responseCheck(response && Number.isInteger(response.status));
      const status = response.status;
      if (status >= 300 && status < 400) throw new SubmissionError('security', 'Redirect refused; fixed destination must be reviewed.', { sent: write, status });
      if (status === 401 || status === 403) throw new SubmissionError('security', 'Authentication or permission denial; stop and return control.', { sent: write, status });
      if (status === 429 || status >= 500) {
        if (!write && attempt + 1 < LIMITS.attempts) {
          const headers = response.headers ?? {};
          const seconds = Number(headers['retry-after']);
          const reset = Number(headers['x-ratelimit-reset']);
          const delay = Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 :
            headers['x-ratelimit-remaining'] === '0' && Number.isFinite(reset) ? Math.max(0, reset * 1000 - this.now()) : status === 429 ? 60000 : 250 * 2 ** attempt;
          await this.wait(delay); continue;
        }
        throw new SubmissionError(write ? 'ambiguous' : 'unavailable', 'Server or rate-limit response did not complete the operation.', { sent: write, status });
      }
      if (status >= 400) throw new SubmissionError([404, 410, 422].includes(status) ? 'rejected' : 'ambiguous', 'GitHub rejected or could not establish this operation.', { sent: write, status });
      if (write && status !== (method === 'POST' && path.endsWith('/labels') || method === 'PATCH' ? 200 : 201)) {
        throw new SubmissionError('ambiguous', 'Unexpected mutation response; reconcile before another write.', { sent: true, status });
      }
      if (!write && status !== 200) throw new SubmissionError('response', 'Unexpected read response.');
      if (response.invalidBody) throw new SubmissionError('response', 'Response body could not be decoded or exceeded its bound.', { sent: write, status });
      return response.body;
    }
  }
  get(path) { return this.call('GET', path); }
  issue(number) { return this.get(`${API}/issues/${number}`).then(value => issueRecord(value, number)); }
  async list(path) {
    const values = [];
    for (let page = 1; page <= LIMITS.pages; page++) {
      const body = await this.get(`${path}${path.includes('?') ? '&' : '?'}per_page=${LIMITS.pageSize}&page=${page}`);
      responseCheck(Array.isArray(body) && body.length <= LIMITS.pageSize);
      values.push(...body);
      if (body.length < LIMITS.pageSize) return { values, complete: true };
    }
    return { values, complete: false };
  }
}
