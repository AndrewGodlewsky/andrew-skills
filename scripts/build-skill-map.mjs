import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadSnapshot } from './skill-map-server.mjs';
import { renderMarkdown } from './skill-map-view.mjs';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const artifactPaths = ['docs/skill-map/map.json', 'docs/skill-map/map.md'];

// A check must not create directories or follow a substituted output symlink.
function regularOutput(root, path) {
  const parts = path.split('/');
  for (let i = 1; i <= parts.length; i++) {
    const current = join(root, ...parts.slice(0, i));
    let stat;
    try { stat = lstatSync(current); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    if (stat.isSymbolicLink() || (i < parts.length ? !stat.isDirectory() : !stat.isFile())) {
      throw new Error(`${path}: output must use regular files and directories`);
    }
  }
}

export function buildSkillMap({ root = repository, check = false } = {}) {
  const { map } = loadSnapshot(root);
  const artifacts = new Map([
    [artifactPaths[0], JSON.stringify(map, null, 2) + '\n'],
    [artifactPaths[1], renderMarkdown(map)],
  ]);
  const diagnostics = [...map.diagnostics];
  for (const path of artifacts.keys()) regularOutput(root, path);
  for (const [path, content] of artifacts) {
    const target = join(root, path);
    if (check) {
      // These two artifacts are UTF-8 text. Tolerate checkout CRLF conversion,
      // while still comparing every semantic byte and never rewriting a file.
      if (!existsSync(target) || readFileSync(target, 'utf8').replaceAll('\r\n', '\n') !== content) {
        diagnostics.push({ code: 'stale-artifact', subject: path, message: 'Run node scripts/build-skill-map.mjs after reviewing dependencies' });
      }
    } else {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
  }
  return { map, diagnostics, ready: diagnostics.length === 0 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length > 1 || args.length && args[0] !== '--check') throw new Error('Usage: node scripts/build-skill-map.mjs [--check]');
    const check = args.includes('--check'), result = buildSkillMap({ check });
    console.log(`Skill map ${check ? 'checked' : 'generated'}: ${result.map.fingerprint.slice(0, 16)}; ${result.map.nodes.filter(node => node.kind === 'skill' && node.present).length} skills.`);
    for (const item of result.diagnostics) console.error(`${item.code}: ${item.subject} — ${item.message}`);
    if (!result.ready) {
      console.error('Skill map is not ready. The live viewer and generated incomplete preview remain inspectable.');
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(`Skill-map validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
