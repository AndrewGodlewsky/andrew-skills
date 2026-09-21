import assert from 'node:assert/strict';
import test from 'node:test';
import { EventEmitter } from 'node:events';
import { PassThrough, Readable } from 'node:stream';
import { createRuntime } from './issue-submission/runtime.mjs';
import { main } from './issue-submission/run.mjs';

function transport(status, body, { stalled = false } = {}) {
  const captured = [];
  const runtime = createRuntime({ env: { GH_HOST: 'evil.example', GH_REPO: 'elsewhere/repo' },
    execute: async (_file, args) => ({ stdout: args[0] === '--version' ? 'gh version 2.90.0' : 'private-fixture-token' }),
    httpsRequest(options, receive) {
      const req = new EventEmitter();
      captured.push({ options });
      req.destroy = () => {};
      req.end = bytes => {
        captured.at(-1).body = bytes?.toString('utf8');
        queueMicrotask(() => {
          const response = new PassThrough();
          response.statusCode = status;
          response.headers = {};
          receive(response);
          if (!stalled) response.end(body === undefined ? '' : typeof body === 'string' ? body : JSON.stringify(body));
        });
      };
      return req;
    } });
  return { runtime, captured };
}

test('received creation acknowledgement survives a stalled response body', async () => {
  const { runtime } = transport(201, undefined, { stalled: true });
  await runtime.authenticate();
  const result = await runtime.request('POST', '/repos/AndrewGodlewsky/andrew-skills/issues', { title: 'GT', body: 'Context' }, { timeoutMs: 5 });
  assert.equal(result.status, 201);
  assert.equal(result.invalidBody, true);
});

for (const status of [301, 401, 403]) test(`received ${status} is preserved without waiting for a stalled body`, async () => {
  const { runtime } = transport(status, undefined, { stalled: true });
  await runtime.authenticate();
  const result = await runtime.request('GET', '/user', undefined, { timeoutMs: 5 });
  assert.equal(result.status, status);
});

test('CLI credentials stay in private capture and errors never expose captured output', async () => {
  const calls = [];
  const runtime = createRuntime({ env: {}, execute: async (file, args, options) => {
    calls.push({ file, args, options });
    return { stdout: args[0] === '--version' ? 'gh version 2.90.0 (2026-04-16)' : 'secret-fixture-token\n', stderr: '' };
  } });
  await runtime.authenticate({ timeoutMs: 15000 });
  assert.equal(calls.length, 2);
  assert.equal(calls[0].options.shell, false);
  assert.deepEqual(calls[1].args, ['auth', 'token', '--hostname', 'github.com']);
  assert.equal(runtime.redact('before secret-fixture-token after'), 'before [redacted credential] after');
  assert.equal(JSON.stringify(calls).includes('secret-fixture-token'), false);
});

test('runtime rejects unsupported routes before requesting the network', async () => {
  let network = false;
  const runtime = createRuntime({ env: {}, httpsRequest() { network = true; } });
  await assert.rejects(runtime.request('POST', '/repos/someone/else/issues', { title: 'x' }), /route/);
  assert.equal(network, false);
});

test('transport ignores routing environment variables and sends UTF-8 JSON with verified TLS', async () => {
  const { runtime, captured } = transport(201, { id: 1 });
  await runtime.authenticate();
  await runtime.request('POST', '/repos/AndrewGodlewsky/andrew-skills/issues', { title: '🐈', body: '“quoted”\n`$HOME`' });
  assert.equal(captured[0].options.hostname, 'api.github.com');
  assert.equal(captured[0].options.rejectUnauthorized, true);
  assert.deepEqual(JSON.parse(captured[0].body), { title: '🐈', body: '“quoted”\n`$HOME`' });
  assert.equal(captured[0].options.headers['Content-Length'], Buffer.byteLength(captured[0].body));
});

for (const [description, body] of [['malformed JSON', '{invalid'], ['oversized response', 'x'.repeat(2097153)]]) {
  test(`${description} preserves mutation acknowledgement without trusting its content`, async () => {
    const { runtime } = transport(201, body);
    await runtime.authenticate();
    const result = await runtime.request('POST', '/repos/AndrewGodlewsky/andrew-skills/issues', { title: 'GT', body: 'Context' });
    assert.equal(result.status, 201);
    assert.equal(result.invalidBody, true);
  });
}

test('missing and rejected authentication remain distinct without exposing stderr', async () => {
  for (const [code, expected] of [['ENOENT', 'missing'], [1, 'security'], ['EACCES', 'security']]) {
    const runtime = createRuntime({ env: {}, execute: async () => { throw Object.assign(new Error('sensitive fixture'), { code, stderr: 'secret fixture' }); } });
    await assert.rejects(runtime.authenticate(), error => error.code === expected && !error.message.includes('fixture'));
  }
});

test('configured proxy stops before credentials instead of silently bypassing it', async () => {
  let executed = false;
  const runtime = createRuntime({ env: { HTTPS_PROXY: 'http://corporate.invalid' }, execute: async () => { executed = true; } });
  await assert.rejects(runtime.authenticate(), error => error.code === 'security');
  assert.equal(executed, false);
});

test('an old CLI is not upgraded or asked for credentials', async () => {
  const commands = [];
  const runtime = createRuntime({ env: {}, execute: async (_file, args) => { commands.push(args); return { stdout: 'gh version 2.89.0' }; } });
  await assert.rejects(runtime.authenticate(), error => error.code === 'missing');
  assert.deepEqual(commands, [['--version']]);
});

test('credential acquisition cannot switch identities during one operation', async () => {
  const { runtime } = transport(200, {});
  await runtime.authenticate();
  await assert.rejects(runtime.authenticate(), error => error.code === 'security');
});

for (const [description, input] of [['invalid JSON', '{'], ['invalid UTF-8', Buffer.from([0xc0, 0xaf])],
  ['oversized JSON', ' '.repeat(262145)], ['route override', JSON.stringify({ version: 1, operation: 'read', host: 'evil' })]]) {
  test(`CLI rejects ${description} without credentials or files`, async () => {
    let auth = false;
    let output = '';
    const exit = await main({ args: [], input: Readable.from([input]), output: { write: text => { output += text; } },
      runtime: { authenticate: async () => { auth = true; }, redact: value => value } });
    assert.equal(exit, 1);
    assert.equal(JSON.parse(output).status, 'not_submitted');
    assert.equal(auth, false);
  });
}

test('CLI help never starts authentication and unknown flags are rejected', async () => {
  let touched = false;
  const runtime = { authenticate: async () => { touched = true; }, redact: value => value };
  const sink = { write() {} };
  assert.equal(await main({ args: ['--help'], runtime, output: sink }), 0);
  assert.equal(await main({ args: ['--host', 'evil'], runtime, output: sink }), 1);
  assert.equal(touched, false);
});
