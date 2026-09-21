import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareSubmission as creator } from './create-skills/submission.mjs';
import { prepareSubmission as tweak } from './skill-tweak/submission.mjs';

const base = { title: 'Preserve my intent', intent: 'Prepare a draft so I can review it before external action.',
  interview: { status: 'recorded', text: 'Initial request: Help prepare a message.\nQuestion summary: Draft or send?\nAnswer summary: Draft only.\nKey quote: "Show me the draft first."\nCorrection quote: "Include attachments in that review."\nCorrection supersedes draft-text-only review.\nQuestion summary: Which destination?\nAnswer: Unanswered.\nAgent recommendation: Team inbox; not a user answer.\nSensitive answer: [REDACTED secret].\nEarlier history: Unavailable; surviving summary is not an exact quote.' } };
const inputs = [
  ['creator', creator, { specification: 'Destination unresolved; draft review required.', implementation: 'No implementation: destination behavior remains unclear.', verification: 'Not run: no package.' }],
  ['tweak', tweak, { report: 'The user expected to review attachments; the agent sent immediately. Desired destination remains unresolved.' }],
];

for (const [name, prepare, fields] of inputs) {
  const input = { ...base, ...fields };
  test(`${name}: missing or invalid intent/record cannot silently prepare a handoff`, () => {
    for (const patch of [{ intent: undefined }, { intent: '' }, { intent: 'a'.repeat(8001) }, { interview: undefined },
      { interview: '' }, { interview: [] }, { interview: {} }, { interview: { status: 'recorded', text: '' } },
      { interview: { status: 'none', text: ' ' } }, { interview: { status: 'unavailable' } },
      { interview: { status: 'unknown', text: 'unknown' } }, { interview: { status: ['recorded'], text: 'unknown' } },
      { interview: { status: 'toString', text: 'unknown' } },
      { interview: { status: 'recorded', text: '\ud800' } }, { interview: { status: 'none', text: 'Supplied request', surprise: true } }]) {
      assert.throws(() => prepare({ ...input, ...patch }));
    }
  });
  test(`${name}: relevant exchanges, corrections, unanswered choices and redactions survive unchanged`, () => {
    const plan = prepare(input);
    assert.equal(plan.parts.length, 0);
    assert.ok(plan.initialBody.includes(base.intent));
    assert.ok(plan.initialBody.includes(base.interview.text));
    assert.equal((plan.initialBody.match(/## Interview record/g) ?? []).length, 1);
  });
  test(`${name}: explicit no-interview and unavailable-history explanations remain distinct valid intake`, () => {
    for (const status of ['none', 'unavailable']) {
      const text = status === 'none' ? 'No questions needed: initial request specified draft-only behavior.' : 'Original turns unavailable. Surviving summary: draft-only; exact wording unavailable.';
      const plan = prepare({ ...input, interview: { status, text } });
      assert.ok(plan.initialBody.includes(text));
      assert.match(plan.initialBody, status === 'none' ? /No interview was needed/ : /Interview history unavailable/);
    }
  });
  test(`${name}: long Unicode interview is delivered intact through bounded parts with recap in body`, () => {
    const text = 'Question / answer summary: café 🧪; qualified approval.\r\n'.repeat(6000);
    const plan = prepare({ ...input, interview: { status: 'recorded', text } });
    assert.ok(plan.parts.length > 1);
    assert.ok(plan.initialBody.includes(base.intent));
    assert.ok(plan.summary.includes(base.intent));
    for (const part of plan.parts) assert.ok(Buffer.byteLength(part.body) <= 60000);
    const delivered = plan.parts.map(x => x.body)
      .join('\n\n').replace(/# Handoff part \d+\/\d+\n\n/g, '')
      .replace(/\n\n## Interview record — continuation \d+\/\d+\n\n/g, '');
    assert.ok(delivered.includes(text.replaceAll('\r\n', '\n')), 'Every source character must survive in order.');
  });
  test(`${name}: excessive interviews return a limitation instead of truncating`, () => {
    assert.throws(() => prepare({ ...input, interview: { status: 'recorded', text: 'a'.repeat(1500000) } }), /32 comment/);
  });
}
