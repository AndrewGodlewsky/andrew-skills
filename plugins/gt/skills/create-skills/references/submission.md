# Submit one complete review handoff

Resolve and invoke the intended enabled GT create-issue dependency. It supplies
its own helper protocol and host/runtime prerequisites. The destination is fixed
to AndrewGodlewsky/andrew-skills, including when called from another checkout.
Submission authority must describe this workflow's actual intent; a JSON flag is
not consent. Use existing authority when it covers the content and destination.

Prepare visibly separate Intent recap, Interview record, Specification,
Implementation attempt and Verification sections. Include the specification,
explicit unresolved intent, every produced file intended for review,
missing-file/build limitations and actual passed/failed/unrun evidence.
No package is acceptable if explicitly explained; a missing statement of intended
behavior is not. Preserve uncertain behavior as uncertain rather than inventing
requirements to fill the specification. Generated files cannot replace intent.

Read [local tools](tools.md) before using the bundled `prepare` command to produce
bounded issue/comment content. Its output is a local delivery plan, not a sent
issue. Inspect its summary/manifest before writing. The dependency receives the
prepared content unchanged and the appropriate existing `new-skill` label when
available. A label failure never causes content to be resubmitted.

`prepare` accepts JSON with nonempty `title`, `specification`, `implementation`,
`verification` and `intent` strings, required `interview` as described in the
[intent capture guide](intent-capture.md), plus optional `packageDirectory`.
Omitted records and empty absence explanations fail preparation. The directory is
read with the same bounds as checking; structural failures do not prevent copying
its produced regular files into the handoff. Text uses UTF-8/LF; binary entries
become required manual attachments. Limit: 32 comments. Oversized input returns
a limitation without truncation or sending anything. If the filesystem cannot
be safely read, preserve the specification and describe unavailable artifacts;
honor security stops rather than bypassing the reader.

`next` accepts `{plan, actorId, authorized, history, attachments}`. Obtain the actor
from the dependency's read result and use `authorized: true` only for real existing
authority. Start with an empty history only for a genuinely fresh submission.
The returned `ready.request` is the next JSON request for **create-issue**, not
an instruction to call GitHub independently. Append `{request, result}` to history
after that invocation. Repeatedly calculate the next action; only the dependency
performs writes. Keep the transcript in the active workflow, not a hidden cache.

If `recoveryRequest` is returned, invoke the dependency read-only and append
`reconciliation: {request, result}` to the original history record. Preserve its
original result. A `present` result may allow the remaining never-attempted parts
to proceed; uncertain results cannot. If results were lost entirely, preserve
the request with a null result and ask the dependency to reconcile; do not reset
the transcript to make `next` offer another create. A separately discovered
candidate can be recorded as `known: {issue, comment}` on that history entry;
this only targets read-only verification, not proof of the earlier write. The
dependency must observe expected content before continuing. Invalid or conflicting
evidence requires resolution, not replay.
For binaries, `attachments` contains one record per required path with the exact
verified `sha256`, the same GitHub ZIP attachment `url` and `verified: true`.
Use one ZIP for all binary resources; its canonical URL must fit 2,048 characters.
The preparer reserves space for the final index before creation. Supply those
assertions only after actual permitted download/hash verification, not user
assurances alone. An unavailable check leaves `attachment_pending`.

`next` uses no labels in its content operations. After delivery, the dependency
may add the appropriate existing label with its separate supported operation.
Keep that result distinct from the content transcript. Local commands perform
no network calls and cannot enforce that the model invoked the enabled dependency;
actual client composition still needs observation.

For short text, all content fits one body. For long text, use the plan's summary
and numbered comments. Each body/comment stays within 60,000 UTF-8 bytes, including
framing, and each helper JSON request within 256 KiB. Canonical text uses LF;
hashes refer to that explicit representation. Use informational comments for
content parts. Read the issue before each new part; stop if state/author/expected
body has changed. A closed target must not create a follow-up issue automatically.

Keep results and exact attempted content in the active conversation. Pace writes
at least one second apart across calls. Verify each known issue/comment identity
through the dependency, then update the issue body from a fresh base with an index
of verified part URLs. Verify that replacement, too. The helper's comparison is
not atomic compare-and-swap; surface conflicts without overwriting them.

An acknowledged, uncertain or previously verified attempt permits read-only
reconciliation only. Never replay the batch, discard evidence, infer absence from
bounded searches, or offer a manual resend after possible delivery. Known
never-attempted parts are distinct: continue them only after uncertainty is resolved
and scope/authority still applies. Preserve a partial outcome when recovery is
inconclusive. The local plan is content, not a hidden transport receipt or ledger.

For essential binaries, prepare a ZIP and manifest and guide the user to attach
it to the same issue in GitHub's browser interface. Upload itself publishes data;
the user's submission authority must cover those files. Prefer text where it
fully represents the resource. Verify availability and exact binary hashes with
permitted tools, or report attachment verification unavailable. Never claim a
local path or unreadable URL delivered the resource. Do not add an upload service,
push a branch or omit required resources to make the plan fit.

Report intent/interview delivery, specification delivery, declared package delivery,
unresolved requirements, check quality and label status separately. A specification
with explicit gaps and an accurately described failed build can be fully delivered. An advertised but undelivered attachment keeps the
whole handoff partial. Offer personal installation only after all declared content
and the final index are verified. Stop on the dependency's security result;
retain its meanings for missing tools, unavailable dependencies and manual handoff.
