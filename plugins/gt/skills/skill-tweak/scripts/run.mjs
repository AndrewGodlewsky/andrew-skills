import { readSync } from 'node:fs';
import { prepareSubmission, nextSubmission, submissionLimits } from './submission.mjs';

try {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !['prepare', 'next'].includes(args[0])) throw new Error('Usage: node run.mjs prepare | next (UTF-8 JSON on stdin; no network or file writes).');
  const chunks = []; let size = 0;
  for (;;) {
    const chunk = Buffer.alloc(65536), count = readSync(0, chunk, 0, chunk.length, null);
    if (!count) break;
    size += count; if (size > submissionLimits.input) throw new Error('JSON input exceeds 16 MiB.');
    chunks.push(chunk.subarray(0, count));
  }
  const input = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
  console.log(JSON.stringify(args[0] === 'prepare' ? prepareSubmission(input) : nextSubmission(input)));
} catch (error) {
  console.log(JSON.stringify({ status: ['EACCES', 'EPERM'].includes(error.code) ? 'security_stop' : 'failed', diagnostics: [error.message] }));
  process.exitCode = 1;
}
