// Uses the real CLI with a deterministic localhost provider to observe prompt loading.
// This tests client routing, not model quality or authenticated Copilot service behavior.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';

const root = process.argv[2];
if (!root || !path.isAbsolute(root)) throw new Error('Supply absolute compatibility experiment root');
const runName = process.argv[3] ?? 'activation';
if (!/^[a-z0-9-]+$/.test(runName)) throw new Error('Invalid run name');
const lane = path.join(root, runName);
if (fs.existsSync(lane)) throw new Error('Preserve prior activation evidence');
fs.mkdirSync(lane);
const results = [];
let current;
function save() { fs.writeFileSync(path.join(lane, 'results.json'), JSON.stringify(results, null, 2)); }
const server = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString();
  if (req.url.endsWith('/models')) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ object: 'list', data: [{ id: 'wf-observer', object: 'model', owned_by: 'local-test' }] }));
    return;
  }
  const data = body ? JSON.parse(body) : {};
  // Preserve only fixture markers; never save headers, credentials, or unrelated instructions.
  const messages = JSON.stringify(data.messages ?? data.input ?? []);
  current.requests.push({ url: req.url, instructions: [...new Set(messages.match(/Report marker wf-[a-z]+-[0-9.]+/g) ?? [])], resourceMarkers: [...new Set(messages.match(/wf-[a-z]+-resource-[0-9.]+/g) ?? [])], toolResults: data.messages?.filter(m => m.role === 'tool').map(m => typeof m.content === 'string' ? m.content.replace(/ Available skills:.*$/, ' Available skill list omitted.') : m.content) });
  save();
  const base = { id: 'wf-response', created: 0, model: 'wf-observer' };
  if (current.requests.length === 1) {
    const call = { id: 'wf-skill-call', type: 'function', function: { name: 'skill', arguments: JSON.stringify({ skill: current.command.slice(1) }) } };
    if (data.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.end(`data: ${JSON.stringify({ ...base, object: 'chat.completion.chunk', choices: [{ index: 0, delta: { role: 'assistant', tool_calls: [{ index: 0, ...call }] }, finish_reason: 'tool_calls' }] })}\n\ndata: [DONE]\n\n`);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ...base, object: 'chat.completion', choices: [{ index: 0, message: { role: 'assistant', content: null, tool_calls: [call] }, finish_reason: 'tool_calls' }] }));
    }
    return;
  }
  if (data.stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.end(`data: ${JSON.stringify({ ...base, object: 'chat.completion.chunk', choices: [{ index: 0, delta: { role: 'assistant', content: 'Fixture observer completed.' }, finish_reason: null }] })}\n\ndata: ${JSON.stringify({ ...base, object: 'chat.completion.chunk', choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] })}\n\ndata: [DONE]\n\n`);
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ...base, object: 'chat.completion', choices: [{ index: 0, message: { role: 'assistant', content: 'Fixture observer completed.' }, finish_reason: 'stop' }], usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } }));
  }
});
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const env = { ...process.env,
  COPILOT_HOME: path.join(root, 'local-r3', 'config'), COPILOT_CACHE_HOME: path.join(root, 'local-r3', 'cache'),
  COPILOT_AUTO_UPDATE: 'false', COPILOT_OFFLINE: 'true',
  COPILOT_PROVIDER_BASE_URL: `http://127.0.0.1:${server.address().port}/v1`,
  COPILOT_PROVIDER_TYPE: 'openai', COPILOT_PROVIDER_WIRE_API: 'completions',
  COPILOT_MODEL: 'wf-observer',
};
for (const key of ['COPILOT_PROVIDER_API_KEY', 'COPILOT_PROVIDER_BEARER_TOKEN', 'COPILOT_PROVIDER_HEADERS', 'GH_TOKEN', 'GITHUB_TOKEN', 'COPILOT_GITHUB_TOKEN']) delete env[key];
try {
  for (const command of ['/wf-alpha', '/extra:wf-alpha', '/extra/wf-alpha']) {
    current = { command, requests: [] };
    results.push(current);
    const args = ['-p', command, '--no-custom-instructions', '--disable-builtin-mcps', '--no-remote', '--no-remote-export', '--no-eager-powershell-resolution', '--stream', 'off', '--deny-tool', 'shell', '--deny-tool', 'write'];
    const child = spawn(path.join(root, 'runtime', 'copilot.exe'), args, { cwd: lane, env, windowsHide: true });
    let stdout = '', stderr = '';
    child.stdout.on('data', d => { stdout += d; });
    child.stderr.on('data', d => { stderr += d; });
    const timer = setTimeout(() => child.kill(), 45000);
    const status = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', resolve); });
    clearTimeout(timer);
    Object.assign(current, { status, stdout, stderr });
    save();
    console.log(JSON.stringify(current));
    if (/access (?:is )?denied|permission denied|os error 4551|security policy|authentication failed|unauthorized|firewall/i.test(stdout + stderr)) throw new Error('Security stop: review captured error before proceeding');
    if (status !== 0) break;
  }
} finally { server.close(); }
