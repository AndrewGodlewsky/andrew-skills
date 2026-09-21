# Prepare, review and deliver feedback

Use the bundled [entry point](../scripts/run.mjs) with Node 22+:
`node <absolute-entry-point> prepare` or `next`. Each takes one UTF-8 JSON object
on stdin and prints JSON. Use a structured process API with an argument array,
`shell: false` and captured stdout/stderr. If only shell tools exist, write JSON
as data in an authorized temporary file and use a fixed Node launcher with
`input: readFileSync(requestPath)`. Never interpolate report text into shell code.
These local commands do not contact GitHub or establish submission authority.

`prepare` requires nonempty `title`, `report`, `intent` and an `interview` object
from the [intent capture guide](intent-capture.md). `report` follows the
[issue template](../templates/issue.md); keep the recap and interview separate
rather than duplicating them in `report`. Missing intent or interview information
must be explicitly represented; omitted inputs fail preparation.

The result is a local delivery plan. Short submissions fit in `initialBody`;
long ones keep the intent recap there and include numbered `parts`. Each part
has exact `body` and `sha256`. Text is UTF-8/LF. Limits: 60,000 bytes per body or
comment, 32 comments, 16 MiB input, and 256 KiB per dependency request. Oversized
content fails without truncation or sending anything. Preserve it locally and
report the limitation; do not omit distinct intent to fit. This text-only
workflow creates no attachments or transcript share links.

Preview the exact title, initial body, all parts, requested labels and destination
before publication, together with `summary` and the final index format:
`Delivery: all declared content verified.` followed by links labeled `Part N`.
URLs are populated only after the dependency returns verified identities.
The approval covers these planned comments and the deterministic index update.
Review edits against the approved plan; changed content requires the workflow's
applicable approval before sending. Do not revise an attempted plan to restart it.

## Delivery through create-issue

Resolve the enabled dependency and obtain its observed actor ID as described in
SKILL.md. Only that dependency performs GitHub operations. Call `next` with
`{plan, actorId, authorized, history}`; set `authorized: true` only for applicable
real approval. Start with `history: []` only for a genuinely fresh submission.
Invoke the dependency with the exact `ready.request` and append `{request, result}`
to history after each invocation. Keep this evidence in the active workflow.
Pace writes at least one second apart across calls. Labels are a separate
supported dependency operation after content delivery, never a reason to replay it.

The planner reads the issue before each new part and before the final index
replacement. It requires the original expected body, an open issue and the
observed author. A changed target returns `conflict`; inspect the fresh state and
resolve it without overwriting someone else's edits. The comparison is not atomic.
The dependency verifies each operation's content and link before progress advances.

An acknowledged, uncertain or lost result requires read-only recovery of that
attempt. Invoke a returned `recoveryRequest` through the dependency, then append
`reconciliation: {request, result}` to the original history record, preserving its
original result. If the result was lost entirely, retain the request with
`result: null`. A separately discovered candidate can be recorded as
`known: {issue, comment}` on that entry; it only targets read-only verification.
Do not discard evidence, infer absence from bounded searches or replay a write.
A verified `present` result permits remaining never-attempted parts to continue;
inconclusive recovery leaves the handoff partial or uncertain. Security results
halt; a closed issue does not authorize a replacement issue.

When every part is verified, the planner replaces the body from a fresh base with
the recap, summary and verified part links. Completion also requires verification
of that replacement. Return `delivered` only as content delivery, separately from
unresolved requirements and label status. Report partial delivery accurately and
preserve exact content plus operation evidence if canceled or blocked after any
possible write. The local helper cannot prove that the model used the enabled
dependency or that the record faithfully captures the user's meaning.
