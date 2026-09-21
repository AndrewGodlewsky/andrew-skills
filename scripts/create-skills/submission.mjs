import { sha256, readPackage } from './package.mjs';
import { requireText, bytes, lf, split, fenced, prepareHandoff } from '../review-handoff.mjs';
import { intentSections } from '../intent-record.mjs';
export { nextSubmission, submissionLimits } from '../review-handoff.mjs';

export function prepareSubmission(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected a preparation object.');
  for (const key of Object.keys(input)) if (!['title', 'specification', 'implementation', 'verification', 'packageDirectory', 'intent', 'interview'].includes(key)) throw new Error(`Unknown preparation field: ${key}`);
  const title = requireText(input.title, 'title', 1024);
  const { recap, interview } = intentSections(input);
  const sections = [
    ['Specification', requireText(input.specification, 'specification')],
    ['Implementation attempt', requireText(input.implementation, 'implementation')],
    ['Verification', requireText(input.verification, 'verification')],
    ['Interview record', interview],
  ];
  const manifest = [], attachments = [];
  if (input.packageDirectory !== undefined) {
    requireText(input.packageDirectory, 'package directory', 4096);
    const pkg = readPackage(input.packageDirectory);
    for (const [path, file] of pkg.files) {
      let text;
      try { text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(file.data); if (text.includes('\0')) text = undefined; }
      catch { text = undefined; }
      if (text === undefined) {
        const record = { path, mode: file.mode, bytes: file.data.length, sha256: sha256(file.data), representation: 'binary-exact' };
        manifest.push(record); attachments.push(record);
      } else {
        const canonical = lf(text);
        manifest.push({ path, mode: file.mode, bytes: bytes(canonical), sha256: sha256(canonical), representation: 'UTF-8-LF' });
        // Even an empty file must be represented rather than silently dropped.
        const fragments = split(canonical); if (!fragments.length) fragments.push('');
        fragments.forEach((fragment, index) => sections.push([`File ${JSON.stringify(path)} — fragment ${index + 1}/${fragments.length}`, fenced(fragment)]));
      }
    }
  }
  const intro = '## Review handoff\n\nIntent, specification, implementation attempt and verification are independent. Delivery status does not imply resolved requirements, check success or marketplace acceptance.\n\n' + recap;
  return prepareHandoff({ title, sections, intro, manifest, attachments,
    fileNotice: '## Files\n\nNo package files supplied; see the implementation attempt.\n\n' });
}
