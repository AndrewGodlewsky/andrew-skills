// Hash-only restoration experiment using already published archives; executes no fixture code.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = process.argv[2];
if (!root || !path.isAbsolute(root)) throw new Error('Supply the absolute extracted-snapshots directory');
const oldSha = '9d2f1ae187231d8199c64b5b762e1bdf2244733d';
const newSha = 'fa0fa64bdc967915dc8399e803be67759e1e62b8';
const older = path.join(root, 'older', `skills-${oldSha}`, 'skills');
const newer = path.join(root, 'newer', `skills-${newSha}`, 'skills');
const installed = path.join(root, 'installed');
if (fs.existsSync(installed)) throw new Error('Preserve prior evidence; use a fresh experiment directory');
function hashes(folder) {
  const files = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Unexpected fixture symlink');
      if (entry.isDirectory()) walk(full);
      else files[path.relative(folder, full).replaceAll('\\', '/')] = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
    }
  }
  walk(folder);
  return files;
}
fs.mkdirSync(installed);
for (const name of ['docx', 'pptx']) fs.cpSync(path.join(newer, name), path.join(installed, name), { recursive: true, errorOnExist: true, force: false });
const before = { docx: hashes(path.join(installed, 'docx')), pptx: hashes(path.join(installed, 'pptx')) };
const oldDocx = hashes(path.join(older, 'docx'));
const oldPptx = hashes(path.join(older, 'pptx'));
assert.notDeepEqual(before.docx, oldDocx);
assert.notDeepEqual(before.pptx, oldPptx);
const from = fs.realpathSync(path.join(installed, 'docx'));
const backup = path.resolve(root, 'new-docx-evidence');
const allowed = fs.realpathSync(root) + path.sep;
if (!from.startsWith(allowed) || !backup.startsWith(allowed)) throw new Error('Move outside experiment directory');
fs.renameSync(from, backup);
fs.cpSync(path.join(older, 'docx'), path.join(installed, 'docx'), { recursive: true, errorOnExist: true, force: false });
const after = { docx: hashes(path.join(installed, 'docx')), pptx: hashes(path.join(installed, 'pptx')) };
assert.deepEqual(after.docx, oldDocx);
assert.deepEqual(after.pptx, before.pptx);
const result = {
  repository: 'https://github.com/anthropics/skills', oldSha, newSha,
  result: 'PASS: complete old docx folder restored; every installed pptx file unchanged',
  scope: 'Filesystem retrieval and replacement only; no client activation and no fixture code execution',
  counts: { restoredDocx: Object.keys(after.docx).length, unchangedPptx: Object.keys(after.pptx).length },
  before, after, oldDocx, oldPptx,
};
fs.writeFileSync(path.join(root, 'results.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify({ result: result.result, counts: result.counts, oldSha, newSha }));
