// Maintainer template. Run the generated exporter/run.mjs from a trusted complete bundle.
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync, lstatSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const expectedManifestHash = '__MANIFEST_HASH__';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
try {
  if (![22, 24].includes(Number(process.versions.node.split('.')[0]))) throw new Error('Use latest patched Node 22 or 24 LTS; ask Andrew for setup.');
  const bundle = dirname(fileURLToPath(import.meta.url));
  const manifestBytes = readFileSync(join(bundle, 'bundle.json'));
  if (hash(manifestBytes) !== expectedManifestHash) throw new Error('Exporter bundle changed or is incomplete; use a trusted complete bundle.');
  const manifest = JSON.parse(manifestBytes);
  if (manifest.schemaVersion !== 1) throw new Error('Unsupported exporter bundle schema.');
  const sources = new Map();
  for (const [name, digest] of Object.entries(manifest.files)) {
    if (!/^[a-z-]+\.mjs$/.test(name)) throw new Error('Unsafe bundle filename.');
    const path = join(bundle, name);
    if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink()) throw new Error('Bundle modules must be regular files.');
    const bytes = readFileSync(path);
    if (hash(bytes) !== digest) throw new Error(`Incomplete or changing exporter bundle: ${name}`);
    sources.set(name, bytes);
  }
  // Verified module bytes are loaded from memory, including during read-only inspection.
  // No update can change a dependency after this point.
  const urls = new Map();
  const loading = new Set();
  function moduleUrl(name) {
    if (urls.has(name)) return urls.get(name);
    if (!sources.has(name) || loading.has(name)) throw new Error('Incomplete or cyclic exporter bundle.');
    loading.add(name);
    const text = sources.get(name).toString('utf8').replace(/from '(\.\/[a-z-]+\.mjs)'/g,
      (_, dependency) => `from '${moduleUrl(dependency.slice(2))}'`);
    const url = `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`;
    loading.delete(name);
    urls.set(name, url);
    return url;
  }
  const cli = await import(moduleUrl('export-cli.mjs'));
  const argv = process.argv.slice(2);
  const { command, target } = cli.argumentsFor(argv);
  let frozenAt;
  let runner = cli;
  if (command !== 'inspect') {
    const filesystem = await import(moduleUrl('export-filesystem.mjs'));
    const paths = filesystem.targetPaths(target);
    filesystem.ensureDirectory(paths.work);
    filesystem.checkedPath(paths.work);
    frozenAt = mkdtempSync(join(paths.work, 'code-'));
    for (const [name, bytes] of sources) writeFileSync(join(frozenAt, name), bytes, { flag: 'wx', mode: 0o600 });
    writeFileSync(join(frozenAt, 'bundle.json'), manifestBytes, { flag: 'wx', mode: 0o600 });
    runner = await import(pathToFileURL(join(frozenAt, 'export-cli.mjs')));
  }
  const result = runner.runCommand(argv);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  // Do not dump subprocess commands, environment, credential-helper output or data-module stacks.
  const childError = error.spawnargs || error.cmd || error.stderr;
  const securityStop = ['EACCES', 'EPERM'].includes(error.code) || /access (?:is )?denied|authentication|security.policy|4551/i.test(`${error.message}\n${error.stderr ?? ''}`);
  console.error(JSON.stringify({ error: childError ? 'Required system tool failed; ask Andrew to check the tool or access policy.' : error.message,
    securityStop, ...(error.exportOutcome ? { outcome: error.exportOutcome } : {}) }, null, 2));
  process.exitCode = 1;
}
