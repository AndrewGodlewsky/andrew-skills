import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function buildBundle({ base = root, output = join(base, 'skills/skill-tweak'), check = false } = {}) {
  const files = new Map();
  for (const name of ['run.mjs', 'submission.mjs']) files.set(`scripts/${name}`, readFileSync(join(base, 'scripts/skill-tweak', name), 'utf8').replaceAll("from '../", "from './"));
  for (const name of ['review-handoff.mjs', 'intent-record.mjs']) files.set(`scripts/${name}`, readFileSync(join(base, 'scripts', name), 'utf8'));
  files.set('references/intent-capture.md', readFileSync(join(base, 'scripts/intent-capture.md'), 'utf8'));
  files.set('references/issue-prose.md', readFileSync(join(base, 'scripts/issue-prose.md'), 'utf8'));
  const scripts = join(output, 'scripts');
  if (existsSync(scripts)) {
    if (lstatSync(scripts).isSymbolicLink() || !lstatSync(scripts).isDirectory()) throw new Error('Bundle scripts must be a real directory.');
    for (const entry of readdirSync(scripts, { withFileTypes: true })) {
      if (!entry.isFile() || !files.has(`scripts/${entry.name}`)) throw new Error(`Unexpected bundle entry: ${entry.name}`);
    }
  }
  for (const [path, source] of files) {
    const target = join(output, path), data = source.replaceAll('\r\n', '\n');
    if (existsSync(target) && (!lstatSync(target).isFile() || lstatSync(target).isSymbolicLink())) throw new Error(`Unsupported bundle target: ${path}`);
    if (check) {
      if (!existsSync(target) || readFileSync(target, 'utf8') !== data) throw new Error(`Stale tweak bundle: ${path}`);
    } else { mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, data); }
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length && args[0] !== '--check')) throw new Error('Usage: node scripts/build-skill-tweak.mjs [--check]');
  buildBundle({ check: args.includes('--check') });
  console.log('Tweak bundle ' + (args.includes('--check') ? 'verified.' : 'built.'));
}
