import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { request as https } from 'node:https';
import { API, LIMITS, SubmissionError } from './contract.mjs';

const executeFile = promisify(execFile);
function systemFailure(error, sent = false) {
  const code = String(error?.code ?? '');
  if (code === 'ENOENT') return new SubmissionError('missing', 'GitHub CLI is unavailable in this environment.');
  if (error?.name === 'AbortError' || code === 'ABORT_ERR') return new SubmissionError('cancelled', 'Operation cancelled.', { sent });
  if (/EACCES|EPERM|4551|CERT|TLS|SSL|UNABLE_TO_VERIFY|SELF_SIGNED/.test(code)) {
    return new SubmissionError('security', 'Execution, TLS or access control blocked this operation; return control without a fallback.', { sent });
  }
  return new SubmissionError('transport', 'Transport or process failed; diagnostic contents were withheld.', { sent });
}

function allowedRoute(method, path) {
  if (typeof path !== 'string' || !['GET', 'POST', 'PATCH'].includes(method)) return false;
  if (method === 'GET' && path === '/user') return true;
  if (!path.startsWith(API)) return false;
  const suffix = path.slice(API.length);
  const [pathname, query] = suffix.split('?');
  if (suffix.split('?').length > 2) return false;
  const id = '[1-9][0-9]*';
  if (method === 'POST') return query === undefined && new RegExp(`^(?:/issues|/issues/${id}/(?:comments|labels))$`).test(pathname);
  if (method === 'PATCH') return query === undefined && new RegExp(`^/issues/${id}$`).test(pathname);
  if (query === undefined) return pathname === '' || new RegExp(`^/issues/(?:${id}|comments/${id})$`).test(pathname);
  if (!new RegExp(`^(?:/labels|/issues|/issues/${id}/(?:comments|labels))$`).test(pathname)) return false;
  const params = new URLSearchParams(query);
  const keys = [...params.keys()];
  if (new Set(keys).size !== keys.length || keys.some(k => !['per_page', 'page', 'creator', 'state', 'sort', 'direction', 'since'].includes(k))) return false;
  if (params.get('per_page') !== '30' || !/^[123]$/.test(params.get('page') ?? '')) return false;
  if (pathname === '/issues') {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}$/.test(params.get('creator') ?? '') || params.get('state') !== 'all' || params.get('sort') !== 'created' || params.get('direction') !== 'desc') return false;
  } else if (keys.some(k => ['creator', 'state', 'sort', 'direction'].includes(k))) return false;
  return !params.has('since') || /^(?:\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z)$/.test(params.get('since'));
}

// Injection is a module-only testing seam. The shipped CLI exposes none of it.
export function createRuntime({ execute = executeFile, httpsRequest = https, env = process.env } = {}) {
  let token;
  let attempted = false;
  const credentialEnv = { ...env };
  for (const key of Object.keys(credentialEnv)) {
    if (['GH_HOST', 'GH_REPO', 'GH_DEBUG', 'GH_FORCE_TTY'].includes(key.toUpperCase())) delete credentialEnv[key];
  }
  credentialEnv.GH_PROMPT_DISABLED = '1';
  credentialEnv.GH_NO_UPDATE_NOTIFIER = '1';
  credentialEnv.GH_NO_EXTENSION_UPDATE_NOTIFIER = '1';
  return {
    redact(value) { return token ? value.replaceAll(token, '[redacted credential]') : value; },
    async authenticate({ timeoutMs = LIMITS.requestMs, signal } = {}) {
      if (attempted) throw new SubmissionError('security', 'Credential acquisition cannot be repeated in one operation.');
      attempted = true;
      if (Object.entries(env).some(([key, value]) => value && /^(HTTPS?_PROXY|ALL_PROXY)$/i.test(key))) {
        throw new SubmissionError('security', 'Proxy configuration requires a reviewed transport integration; do not bypass the configured proxy.');
      }
      const deadline = Date.now() + timeoutMs;
      const capture = async args => {
        const left = deadline - Date.now();
        if (left <= 0) throw new SubmissionError('timeout', 'Credential acquisition timed out.');
        try {
          return await execute(process.platform === 'win32' ? 'gh.exe' : 'gh', args,
            { shell: false, windowsHide: true, encoding: 'utf8', maxBuffer: 65536, timeout: left, signal, env: credentialEnv });
        } catch (error) {
          if (Number.isInteger(error?.code)) throw new SubmissionError('security', 'GitHub CLI authentication or execution was rejected; return control without a fallback.');
          throw systemFailure(error);
        }
      };
      const version = await capture(['--version']);
      const match = /^gh version (\d+)\.(\d+)\.(\d+)(?:\s|$)/.exec(version.stdout);
      if (!match || Number(match[1]) < 2 || Number(match[1]) === 2 && Number(match[2]) < 90) {
        throw new SubmissionError('missing', 'GitHub CLI 2.90.0 or newer is required; no automatic upgrade.');
      }
      const captured = await capture(['auth', 'token', '--hostname', 'github.com']);
      const value = captured.stdout.trim();
      if (!value || value.length > 4096 || /\s|[^\x21-\x7e]/.test(value)) throw new SubmissionError('security', 'No usable credential was returned; no automatic login or fallback.');
      token = value;
    },
    async request(method, path, body, { timeoutMs = LIMITS.requestMs, signal } = {}) {
      if (!allowedRoute(method, path)) throw new SubmissionError('security', 'Unsupported fixed-repository route.');
      if (!token) throw new SubmissionError('security', 'No selected authenticated credential.');
      const bytes = body === undefined ? undefined : Buffer.from(JSON.stringify(body), 'utf8');
      if (bytes && bytes.length > LIMITS.input) throw new SubmissionError('input', 'Request body exceeds its bound.');
      return new Promise((resolve, reject) => {
        let settled = false;
        let sent = false;
        let req;
        let timer;
        let received;
        const finish = (error, value) => {
          if (settled) return;
          settled = true; clearTimeout(timer);
          if (error) reject(error); else resolve(value);
        };
        try {
          req = httpsRequest({ protocol: 'https:', hostname: 'api.github.com', port: 443, method, path,
            rejectUnauthorized: true, signal,
            headers: { 'User-Agent': 'gt-create-issue', Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2026-03-10', Authorization: `Bearer ${token}`,
              ...(bytes ? { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': bytes.length } : {}) } }, response => {
            const chunks = [];
            let size = 0;
            const headers = {};
            for (const key of ['retry-after', 'x-ratelimit-remaining', 'x-ratelimit-reset']) {
              if (typeof response.headers[key] === 'string') headers[key] = response.headers[key];
            }
            received = { status: response.statusCode, headers, invalidBody: true };
            const incomplete = () => finish(null, { status: response.statusCode, headers, invalidBody: true });
            // An error body cannot undo a received denial/redirect. Do not wait
            // for arbitrary content before stopping on these response codes.
            if (response.statusCode >= 300 && response.statusCode < 400 || [401, 403].includes(response.statusCode)) {
              incomplete(); response.destroy(); req.destroy(); return;
            }
            response.on('data', chunk => {
              size += chunk.length;
              if (size > LIMITS.response) { incomplete(); response.destroy(); req.destroy(); return; }
              chunks.push(chunk);
            });
            response.once('aborted', incomplete);
            response.once('error', incomplete);
            response.once('close', () => { if (!response.readableEnded) incomplete(); });
            response.once('end', () => {
              if (settled) return;
              try {
                const value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
                finish(null, { status: response.statusCode, headers, body: value });
              } catch { incomplete(); }
            });
          });
          req.once('error', error => received ? finish(null, received) : finish(systemFailure(error, sent)));
          timer = setTimeout(() => {
            if (received) finish(null, received);
            else finish(new SubmissionError('timeout', 'Request deadline exceeded.', { sent }));
            req.destroy();
          }, Math.min(timeoutMs, LIMITS.requestMs));
          sent = method !== 'GET';
          req.end(bytes);
        } catch (error) { finish(systemFailure(error, sent)); }
      });
    },
  };
}
