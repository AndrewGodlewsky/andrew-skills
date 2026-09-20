import { existsSync, readFileSync } from 'node:fs';
import { createCopy } from '../export-filesystem.mjs';

const input = JSON.parse(readFileSync(process.argv[2], 'utf8'));
input.files = new Map(input.files.map(([name, file]) => [name, { mode: file.mode, data: Buffer.from(file.data, 'base64') }]));
try {
  const result = createCopy({ ...input, onProgress(phase) {
    if (phase !== process.argv[3]) return;
    process.send({ phase });
    const deadline = Date.now() + 45000;
    while (!existsSync(process.argv[4])) {
      if (Date.now() > deadline) throw new Error('Test controller did not release the worker.');
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20);
    }
  } });
  process.send({ result });
} catch (error) {
  process.send({ error: error.message, outcome: error.exportOutcome });
  process.exitCode = 1;
}
