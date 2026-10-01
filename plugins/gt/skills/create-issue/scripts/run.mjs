import { pathToFileURL } from 'node:url';
import { LIMITS, REPOSITORY, SubmissionError, decodeInput } from './contract.mjs';
import { createRuntime } from './runtime.mjs';
import { submit } from './service.mjs';

export async function readInput(stream, signal) {
  const chunks = [];
  let size = 0;
  for await (const chunk of stream) {
    if (signal?.aborted) throw new SubmissionError('cancelled', 'Input reading cancelled.');
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += bytes.length;
    if (size > LIMITS.input) throw new SubmissionError('input', 'Request exceeds its byte limit.');
    chunks.push(bytes);
  }
  return decodeInput(Buffer.concat(chunks));
}

export async function main({ args = process.argv.slice(2), input = process.stdin, output = process.stdout, runtime = createRuntime(), signal } = {}) {
  let result;
  try {
    if (args.length) {
      if (args.length === 1 && args[0] === '--help') {
        output.write('GT issue submission helper: send one UTF-8 JSON request on stdin. Read the create-issue helper reference or the authored helper README. No route or credential arguments are accepted.\n');
        return 0;
      }
      throw new SubmissionError('input', 'No command arguments are accepted; supply a bounded JSON request on stdin.');
    }
    if (Number(process.versions.node.split('.')[0]) < 22) throw new SubmissionError('missing', 'Node.js 22 or newer is required.');
    const request = await readInput(input, signal);
    result = await submit(request, runtime, { signal });
  } catch (error) {
    result = { version: 1, repository: REPOSITORY, status: 'not_submitted', operations: [{ operation: 'input', status: 'not_submitted',
      detail: error instanceof SubmissionError ? error.message : 'Input processing failed; diagnostic contents were withheld.' }] };
  }
  // Credential redaction also covers malicious server content returned by read.
  output.write(runtime.redact(JSON.stringify(result)) + '\n');
  return ['verified', 'present'].includes(result.status) ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const controller = new AbortController();
  const cancel = () => { controller.abort(); process.stdin.destroy(); };
  process.once('SIGINT', cancel);
  process.once('SIGTERM', cancel);
  const inputDeadline = setTimeout(cancel, LIMITS.operationMs);
  try { process.exitCode = await main({ signal: controller.signal }); }
  catch { process.exitCode = 1; } // Reporting failure must never cause another mutation.
  finally { clearTimeout(inputDeadline); process.removeListener('SIGINT', cancel); process.removeListener('SIGTERM', cancel); }
}
