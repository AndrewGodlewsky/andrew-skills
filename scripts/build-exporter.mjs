import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const names = ['export-cli.mjs', 'export-filesystem.mjs', 'export-protocol.mjs', 'export-source.mjs',
  'release-catalog-reader.mjs', 'release-catalog.mjs', 'release-snapshots.mjs', 'release-validation.mjs'];
// Normalize the generated artifact regardless of checkout autocrlf; runtime bytes remain manifest-bound.
const source = name => Buffer.from(readFileSync(join(root, 'scripts', name), 'utf8').replaceAll('\r\n', '\n'));
const files = new Map(names.map(name => [name, source(name)]));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = Buffer.from(JSON.stringify({ schemaVersion: 1, files: Object.fromEntries([...files].map(([name, bytes]) => [name, hash(bytes)])) }, null, 2) + '\n');
files.set('bundle.json', manifest);
files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('__MANIFEST_HASH__', hash(manifest))));
const guide = Buffer.from(readFileSync(join(root, 'exporter/README.md'), 'utf8').replaceAll('\r\n', '\n'));
for (const directory of ['exporter', 'skills/skills-restore/scripts/exporter']) {
  const output = join(root, directory);
  if (!process.argv.includes('--check')) mkdirSync(output, { recursive: true });
  const bundled = directory === 'exporter' ? files : new Map([...files, ['README.md', guide]]);
  for (const [name, bytes] of bundled) {
    const path = join(output, name);
    if (process.argv.includes('--check')) {
      if (!existsSync(path) || !readFileSync(path).equals(bytes)) throw new Error(`Stale exporter bundle: ${directory}/${name}; run node scripts/build-exporter.mjs`);
    } else writeFileSync(path, bytes);
  }
}
console.log(process.argv.includes('--check') ? 'Exporter bundle matches maintained sources.' : 'Built self-contained exporter bundle.');
