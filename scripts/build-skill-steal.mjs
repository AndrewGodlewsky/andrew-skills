import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { guidance } from './build-create-skills.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const normalize = value => value.replaceAll('\r\n', '\n');
function replaceOnce(source, before, after) {
  if (source.split(before).length !== 2) throw new Error('Shared creator guidance changed; review the Skill Steal adaptation.');
  return source.replace(before, after);
}

export function submissionGuidance(source) {
  let result = normalize(source);
  result = replaceOnce(result, '[intent capture guide](intent-capture.md)', '[clarification guide](clarification.md)');
  result = replaceOnce(result, 'Offer personal installation only after all declared content\nand the final index are verified. ', '');
  return result;
}

export function buildBundle({ base = root, output = join(base, 'skills/skill-steal'), check = false } = {}) {
  const read = path => normalize(readFileSync(join(base, path), 'utf8'));
  const files = new Map();
  files.set('scripts/run.mjs', read('scripts/skill-steal/run.mjs').replaceAll("from '../create-skills/", "from './"));
  for (const name of ['package.mjs', 'submission.mjs']) {
    files.set(`scripts/${name}`, read(`scripts/create-skills/${name}`).replaceAll("from '../", "from './"));
  }
  for (const name of ['skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs']) {
    files.set(`scripts/${name}`, read(`scripts/${name}`));
  }
  files.set('references/package-rules.md', guidance(read('CONTRIBUTING.md')));
  const notice = 'Generated from shared creator guidance; edit the maintained source or builder, then rebuild.\n\n';
  files.set('references/tools.md', notice + replaceOnce(read('skills/create-skills/references/tools.md'), 'preparation and installation commands', 'preparation commands'));
  files.set('references/submission.md', notice + submissionGuidance(read('skills/create-skills/references/submission.md')));
  const scripts = join(output, 'scripts');
  if (existsSync(scripts)) {
    if (lstatSync(scripts).isSymbolicLink() || !lstatSync(scripts).isDirectory()) throw new Error('Bundle scripts must be a real directory.');
    for (const entry of readdirSync(scripts, { withFileTypes: true })) {
      if (!entry.isFile() || !files.has(`scripts/${entry.name}`)) throw new Error(`Unexpected bundle entry: ${entry.name}`);
    }
  }
  for (const [path, data] of files) {
    const target = join(output, path);
    if (existsSync(target) && (!lstatSync(target).isFile() || lstatSync(target).isSymbolicLink())) throw new Error(`Unsupported bundle target: ${path}`);
    if (check) {
      if (!existsSync(target) || readFileSync(target, 'utf8') !== data) throw new Error(`Stale steal bundle: ${path}`);
    } else { mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, data); }
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length && args[0] !== '--check')) throw new Error('Usage: node scripts/build-skill-steal.mjs [--check]');
  buildBundle({ check: args.includes('--check') });
  console.log('Skill Steal bundle ' + (args.includes('--check') ? 'verified.' : 'built.'));
}
