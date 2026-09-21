# Preserve the requester's intent

## Invoke the selected GT interview skill

Create Skills and Skill Tweak must resolve and invoke **GT grill-me** through the
client's skill mechanism before completing intake. Use the client-supplied selected
GT installation identity, the same installation used for GT dependencies. Verify
that grill-me is exposed and enabled for model invocation, then read and follow its
SKILL.md using the client's supported skill-loading mechanism; no particular tool
name is required. A reference to its name, a file read alone, or reproducing its questions
does not establish that the client invoked the skill. Record the actual mechanism
and outcome available from the client; keep unverified invocation unverified.

Pass the user's initial request, known facts and sources, prior answers, relevant
examples, open topics and the interview record so far. The purpose is to understand
the user's proposal for maintainer review. Invoke the existing Grill Me unchanged:
it owns the questions, recommended answers, one-question-at-a-time pacing and
confirmation of shared understanding. The callers must not substitute their own
interview, impose a question quota, or introduce a separate interview mode. Treat
recommendations as recommendations rather than user decisions or maintainer approval.

An absent, disabled, shadowed or ambiguous GT grill-me, or a client unable to invoke
it, is an unavailable dependency. Identify that limitation and preserve the draft;
do not silently use a personal grill-me/grilling alias, an alternate installed copy,
copied instructions or a caller-led interview. Do not install, enable, change caches
or bypass host controls during intake. This also applies to draft-only requests:
existing material can be retained as a draft without claiming a completed interview.

After the user confirms the captured idea, return its recap, relevant exchanges,
corrections and remaining undecided topics to the caller. Record the confirmation
exchange. Explicitly leaving a decision to the maintainer is compatible with
confirmed understanding; silence is not confirmation. Complete initial context
avoids redundant questions, but not the confirmation. Pause or cancellation stops
the interview and retains the record without advancing to submission. The caller
continues its own drafting and publication-authority checks; understanding is not
permission to publish or implement. New substantive intent after confirmation goes
back through Grill Me for clarification and renewed confirmation; routine wording
edits continue through the caller's existing draft review.

## Preserve the record

Keep a readable record as the conversation develops, from the initial request
through review and later requirement changes. Retain the requested outcome and
why it matters, requirements, qualifications, corrections and consequential
approvals. Include operational exchanges only when they affect the result, such
as declining a check. Reuse available answers rather than asking them again.

Summarize relevant questions and answers in order. Keep grouped questions paired
with their replies; include the actual selected option text and any recommendation
needed to understand the choice. Label summaries and quote exact user wording for
key scope, behavior, external-action, approval and correction decisions. Preserve
earlier answers when corrected, marking what supersedes what. Keep agent defaults
and interpretations separate from user answers. Silence is an unanswered question,
not acceptance of a recommendation.

Label unanswered or deferred decisions, unresolved contradictions, redactions and
unavailable history distinctly. Preserve surviving summaries as summaries, never
as reconstructed exact quotations. If source material contains no interview, state
that and retain the initial supplied requirements; this does not waive the current
caller's Grill Me confirmation. Missing history or unclear desired
behavior may accompany a useful submission; record the gap for maintainer follow-up
rather than requiring its resolution during intake. The maintainer owns final
interpretation, implementation and repository-standard checks.

During the existing specification or draft review, show a short intent recap:
what the requester needs and why, including consequential interpretations and
unresolved decisions. Ask them to confirm or correct that understanding, with the
interview record alongside it. Preserve their corrections; unanswered review
questions remain explicit and cannot stand in for Grill Me's required confirmation.
Reuse its confirmed recap instead of asking the same understanding question again
unless intent changes. Use the workflow's existing submission authority; this is
not a second publication-approval stage. Record approval of the exact outgoing draft
in the submission evidence without recursively rewriting it to quote its own
publication approval. Material content changes still follow the workflow's review
rules.

Redact secrets, unrelated private details and identifying local paths before
preview or publication. Keep explicit redaction markers and useful sanitized
context. Hidden reasoning and protected instructions are never interview evidence.

## Preparation input

Both preparers require `intent`, a nonempty recap of at most 8,000 UTF-8 bytes,
and `interview`, an object with exactly `status` and nonempty `text`:

- `recorded`: `text` contains the ordered relevant exchanges, initial requirements,
  labeled quotes/summaries, corrections and any partial-history limitations.
- `none`: source material has no interview; `text` explains why and preserves the
  supplied requirements. Retained for historical or incomplete draft records,
  not as a way to bypass Grill Me in a newly completed intake. Questions asked
  but left unanswered belong in `recorded`.
- `unavailable`: interview history cannot be recovered; `text` explains the gap
  and preserves any surviving requirements or clearly labeled summaries.

For example, `{"status":"recorded","text":"Question summary: Draft or send?\nAnswer: Unanswered.\nAgent recommendation: Draft only; not a user decision."}`.
Never substitute an absence state for available exchanges. The helper checks
presence and supported states; the agent must check fidelity, privacy and whether
distinct requirements have been preserved. It cannot verify those from text alone.
For a new completed intake, use `recorded` even when Grill Me needed only the
confirmation exchange and no clarification questions.

The intent recap stays in the issue body. The interview is independently readable
in the body or numbered comments linked from it. Summarize repetition without
dropping distinct intent to fit a limit; preserve the local content and report a
size limitation if bounded delivery cannot hold it. Content delivery and the
completeness of the requirements are separate outcomes.
