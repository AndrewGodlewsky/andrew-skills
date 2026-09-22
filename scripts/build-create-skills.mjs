import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const normalize = value => value.replaceAll('\r\n', '\n');
export function guidance(source) {
  const text = normalize(source);
  function excerpt(start, end) {
    if (text.split(start).length !== 2 || text.split(end).length !== 2) throw new Error('Canonical guidance anchors must exist exactly once.');
    const begin = text.indexOf(start), finish = text.indexOf(end, begin + start.length);
    if (finish < 0) throw new Error('Canonical guidance anchors are out of order.');
    return text.slice(begin, finish).trim();
  }
  const result = '# GT package rules\n\nGenerated from the canonical authoring guide; edit its source, then rebuild.\nThese are repository adoption rules. Failed/unrun checks do not block issue intake.\n\n'
    + excerpt('## Skill standard', '## Complete examples') + '\n\n## Release metadata\n\n'
    + excerpt('The supported metadata format is deliberately small:', 'A skill absent from a published main snapshot')
    + '\n';
  for (const link of result.matchAll(/\]\(([^)]+)\)/g)) if (!/^(https?:|#)/.test(link[1])) throw new Error('Generated guidance contains a repository-only link.');
  return result;
}

export function buildBundle({ base = root, output = join(base, 'skills/create-skills'), check = false } = {}) {
  const maintained = ['package.mjs', 'run.mjs', 'submission.mjs', 'install.mjs'];
  const files = new Map(maintained.map(name => [`scripts/${name}`, normalize(readFileSync(join(base, 'scripts/create-skills', name), 'utf8')).replaceAll("from '../", "from './")]));
  for (const name of ['skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs']) files.set(`scripts/${name}`, normalize(readFileSync(join(base, 'scripts', name), 'utf8')));
  files.set('references/intent-capture.md', normalize(readFileSync(join(base, 'scripts/intent-capture.md'), 'utf8')));
  files.set('references/issue-prose.md', normalize(readFileSync(join(base, 'scripts/issue-prose.md'), 'utf8')));
  files.set('references/package-rules.md', guidance(readFileSync(join(base, 'CONTRIBUTING.md'), 'utf8')));
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
      if (!existsSync(target) || readFileSync(target, 'utf8') !== data) throw new Error(`Stale creator bundle: ${path}`);
    } else { mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, data); }
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length && args[0] !== '--check')) throw new Error('Usage: node scripts/build-create-skills.mjs [--check]');
  buildBundle({ check: args.includes('--check') });
  console.log('Creator bundle ' + (args.includes('--check') ? 'verified.' : 'built.'));
}
