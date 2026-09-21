# Preserve the requester's intent

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
as reconstructed exact quotations. If no interview was needed, state that and
retain the initial supplied requirements. Missing history or unclear desired
behavior may accompany a useful submission; record the gap for maintainer follow-up
rather than requiring its resolution during intake. The maintainer owns final
interpretation, implementation and repository-standard checks.

During the existing specification or draft review, show a short intent recap:
what the requester needs and why, including consequential interpretations and
unresolved decisions. Ask them to confirm or correct that understanding, with the
interview record alongside it. Preserve their corrections; unanswered review
questions remain explicit. Use the workflow's existing submission authority;
this is not a second approval stage. Record approval of the exact outgoing draft
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
- `none`: no interview was needed; `text` explains why and preserves the supplied
  requirements. This does not mean that questions were asked but went unanswered.
- `unavailable`: interview history cannot be recovered; `text` explains the gap
  and preserves any surviving requirements or clearly labeled summaries.

For example, `{"status":"recorded","text":"Question summary: Draft or send?\nAnswer: Unanswered.\nAgent recommendation: Draft only; not a user decision."}`.
Never substitute an absence state for available exchanges. The helper checks
presence and supported states; the agent must check fidelity, privacy and whether
distinct requirements have been preserved. It cannot verify those from text alone.

The intent recap stays in the issue body. The interview is independently readable
in the body or numbered comments linked from it. Summarize repetition without
dropping distinct intent to fit a limit; preserve the local content and report a
size limitation if bounded delivery cannot hold it. Content delivery and the
completeness of the requirements are separate outcomes.
