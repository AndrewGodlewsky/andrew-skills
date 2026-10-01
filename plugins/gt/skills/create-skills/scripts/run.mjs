import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { checkDirectory } from './package.mjs';
import { prepareSubmission, nextSubmission, submissionLimits } from './submission.mjs';
import { readSync } from 'node:fs';
import { installPackage } from './install.mjs';

function input() {
  const chunks = []; let size = 0;
  for (;;) {
    const chunk = Buffer.alloc(65536); const count = readSync(0, chunk, 0, chunk.length, null);
    if (!count) break;
    size += count; if (size > submissionLimits.input) throw new Error('JSON input exceeds 16 MiB.');
    chunks.push(chunk.subarray(0, count));
  }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
}

export function main(args = process.argv.slice(2)) {
  if (args.length === 1 && args[0] === '--help') {
    console.log('Usage: node run.mjs check <package-directory> | prepare | next | install\nprepare/next/install take JSON on stdin. Only install writes files (current user scope). These commands never contact GitHub.');
    return;
  }
  if (args.length === 1 && ['prepare', 'next', 'install'].includes(args[0])) {
    const value = input();
    const result = args[0] === 'prepare' ? prepareSubmission(value) : args[0] === 'next' ? nextSubmission(value) : installPackage(value);
    console.log(JSON.stringify(result));
    if (args[0] === 'install' && result.status !== 'installed') process.exitCode = 1;
    return;
  }
  if (args.length !== 2 || args[0] !== 'check') throw new Error('Use --help for supported commands.');
  const result = checkDirectory(resolve(args[1]));
  console.log(JSON.stringify(result));
  process.exitCode = result.status === 'passed' ? 0 : 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { main(); } catch (error) { console.log(JSON.stringify({ status: ['EACCES', 'EPERM'].includes(error.code) ? 'security_stop' : 'failed', diagnostics: [error.message] })); process.exitCode = 1; }
}
