import { requireText } from './review-handoff.mjs';

// Validate presence/provenance, not the truth or completeness of agent summaries.
export function intentSections(input) {
  const intent = requireText(input.intent, 'intent recap', 8000);
  const record = input.interview;
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error('An interview record or explicit absence explanation is required.');
  for (const key of Object.keys(record)) if (!['status', 'text'].includes(key)) throw new Error(`Unknown interview field: ${key}`);
  const states = { recorded: 'Recorded exchanges; summaries and exact quotes are labeled below.', none: 'No interview was needed; supplied requirements are preserved below.', unavailable: 'Interview history unavailable; limitations and surviving requirements are preserved below.' };
  if (typeof record.status !== 'string' || !Object.hasOwn(states, record.status)) throw new Error('Interview status must be recorded, none or unavailable.');
  const text = requireText(record.text, 'interview text or absence explanation');
  return { recap: `## Intent recap\n\n${intent}\n\n`, interview: `${states[record.status]}\n\n${text}` };
}
