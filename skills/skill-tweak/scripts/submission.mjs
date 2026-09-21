import { requireText, prepareHandoff } from './review-handoff.mjs';
import { intentSections } from './intent-record.mjs';
export { nextSubmission, submissionLimits } from './review-handoff.mjs';

export function prepareSubmission(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected a preparation object.');
  for (const key of Object.keys(input)) if (!['title', 'report', 'intent', 'interview'].includes(key)) throw new Error(`Unknown preparation field: ${key}`);
  const { recap, interview } = intentSections(input);
  return prepareHandoff({ title: input.title,
    intro: '## Skill feedback\n\nFeedback for maintainer review; delivery does not approve the proposed change.\n\n' + recap,
    sections: [['Incident report', requireText(input.report, 'report')], ['Interview record', interview]],
  });
}
