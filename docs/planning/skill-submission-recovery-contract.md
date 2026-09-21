# create-issue — reuse, updates and uncertain-result recovery

Decision: [Define duplicate prevention and uncertain submission recovery](https://github.com/AndrewGodlewsky/andrew-skills/issues/29), based on the owner's answers in [Rounds 1 and 2](skill-submission-recovery-notes.md).

**Status: owner-facing policy settled; implementation pending.** This refines the [caller contract](skill-submission-contract.md). It supersedes proposals for local receipts, routine similarity searches, banning all comments/edits, or allowing a closed-issue comment alone to stand for actionable follow-up.

**Later prototype scope amendment:** The owner accepted the prototype and selected “Keep the three labels; defer native relationships.” First-version organization and resumption therefore cover labels only. Native parent/child and blocker policies/examples below are retained for future scope, not first-release implementation or acceptance requirements. New open issues for actionable closed-issue follow-up use caller-supplied ordinary references. See the [review outcome](skill-submission-prototype-notes.md).

## Default to new issues; use known context sensibly

Prefer a new issue for a new submission. Do not spend substantial effort searching for similar issues or require a duplicate-classification interview. Use caller-provided references, conversation evidence and focused live reads where relevant. The model can choose a clearly relevant existing issue when the workflow has a reason to do so; mere similarity is not a reason to suppress a new report.

Distinguish reuse from retry recovery. Known evidence that this same request may already have been sent requires reconciliation before another write, even though new issues are the ordinary default. A fresh creation request is not a way to escape an uncertain previous attempt.

All issue/comment lookup and mutations remain confined to AndrewGodlewsky/andrew-skills. The caller supplies substantive content and existing authorization. Missing content or authorization goes back to the calling agent; the capability does not take over the human interview.

## Allowed operations and authorship

Determine the active GitHub actor and freshly read the target issue. Verify repository identity and reject pull requests. For ownership checks, compare stable account IDs with the issue's recorded author; do not use assignment, repository ownership, privileges, a caller-supplied name or an old conversation claim. If identity cannot be established, do not perform an ownership-restricted mutation.

| Operation | Contract boundary |
| --- | --- |
| Create a new issue | Authorized caller-supplied title/body, fixed repository; one issue per problem preferred. |
| Add a new comment | Allowed on any author's issue in this repository when authorized; caller supplies the comment. Read-only access to context does not itself authorize posting. |
| Replace title or body | Only on the actor's own issue, explicitly requested by the caller with intended replacement content based on current state. |
| Add labels or resume organization | Only on the actor's own issue, with agreed label policy, current permissions and requested intent. |
| Add native parent/child or blocker edge | Both issues must be authored by the actor and in this repository. Apply only explicit relationship intent with necessary GitHub permissions. |
| Edit/delete existing comments; close/reopen; assign; remove links; automatic reparenting | Not part of this capability. |

The ownership restriction has no maintainer/admin exception within this skill. Comment creation is a separately allowed operation; it does not authorize editing another person's issue or comments. A user's own issue may have been created manually or by a different workflow.

For an existing issue, prefer appending caller-supplied follow-up as a new comment. Do not silently convert that into a body replacement. Recheck current title/body before explicit replacements and report detected intervening edits rather than knowingly overwriting them. Do not claim an atomic compare-and-write guarantee unless the chosen API mechanism is verified to supply it; concurrent-update handling is an implementation acceptance requirement.

Each operation uses one selected identity. A changed identity is surfaced to the caller and all authorship/authorization checks are repeated; it is never an automatic retry mechanism. Shared credentials cannot prove which human originally authored an issue.

## Closed issues that need more work

An informational comment may be added to a closed issue. If the follow-up requires action, create a **new open issue**, because maintainers do not rely on closed-issue comments for their work queue. Do not reopen the old issue.

The caller supplies the new title/body and the relevant reference to the old issue or comment. If those inputs or creation authorization are missing, return that gap to the caller; posting a comment alone does not finish the actionable request. Prefer ensuring the new open issue exists before any optional additional comment on the old issue. Do not add a second copy of the same evidence merely for a backlink unless the caller requests it.

A new related issue with a caller-supplied reference is sufficient. Make it a native sub-issue only when explicitly intended, both issues are own-authored, GitHub permits it and the capability is verified. Native links to another author's issue are left for a separately authorized maintainer workflow. Do not fabricate a blocking relationship to a closed issue or claim that a plain reference created a native relationship.

Treat creation, any optional comment and organization as separate steps. If the new issue exists but a later step fails, report the open issue and the incomplete step. If only a closed-issue comment exists, report that the actionable follow-up still lacks its required open issue.

## GitHub is authoritative; no persistent tracking store

Do not create local submission receipts, a persistent recovery cache, a receipt directory or hidden tracking markers in issue bodies/comments. Use current GitHub state and evidence available in the active operation/conversation. The caller retains prepared content; do not claim it has been durably backed up.

Keep returned IDs, timestamps and observed results in memory while acting and return useful evidence to the caller. Lack of a local record is normal. Across sessions or machines, missing evidence can make recovery inconclusive. Neither text matching nor bounded searches supply an exactly-once guarantee. Independent callers can still create similar issues; this skill does not automatically close or merge them.

## Recovery state and result meanings

Track each create, comment, title/body update, label addition and relationship independently for the current operation. The following is a behavioral state table, not a required storage schema.

| Known state | Action and caller result |
| --- | --- |
| Missing prerequisite/input/authorization, or confirmed cancellation before send | **Not submitted** for that operation. Return the gap and supplied material; manual handoff is possible only if no unresolved write or security stop prevents it. |
| Write sent; no definitive outcome | **Outcome uncertain.** Perform bounded read-only reconciliation if allowed, then return the remaining uncertainty. Do not automatically replay the write. |
| GitHub acknowledged write and returned identity; readback incomplete | **Acknowledged, verification incomplete.** Preserve the identity/response evidence; verify the same issue/comment rather than creating/posting another. Mark any unverified link accordingly. |
| Desired change observed at the validated target | Report the verified issue/comment link or updated fields and observed organization. If recovering, distinguish “present now” from evidence that this particular attempt caused it. |
| Issue created/updated, but another step incomplete | Report the verified completed work and each missing, conflicting or uncertain operation. Do not erase creation evidence or recreate the issue to repair metadata. |
| Known issue selected without a write | **Existing issue selected.** Return the verified link; make clear that no new material was saved. |
| Definitive server rejection | Report the rejected operation accurately while preserving earlier successes. Return validation problems to the caller. Actual security/authentication/permission denials follow the active user's stop rules. |

Cancelling after a request is sent does not prove that it did not happen. A timeout, malformed response, service error or connection loss after sending may be ambiguous. Classify from evidence, not just an exit code. An error while reporting a result must never trigger another mutation.

## Bounded checks and resumption

Retry temporary **read-only** lookup/verification failures briefly within a documented finite budget, respecting rate-limit guidance and security stops. No background monitoring, unbounded polling or silent account/tool/environment switching. Implementation sets and tests the exact counts, elapsed-time limits and request timeouts; the owner may tune these after pilot testing.

If a known issue/comment identity exists, read that exact fixed-repository resource. Otherwise use bounded relevant reads of the actor's issues or recent comments on the known issue, plus available content/time evidence. Identical text or an empty search result is not conclusive attribution of a write. Report truncated or incomplete lookups. If uncertainty remains, hand it back to the caller rather than proposing an unqualified fresh submission.

Resume missing organization only on an explicitly identified own-authored issue with the requested intent available. Read current state first: skip requested labels/edges already present; apply only missing, authorized additions. Check both authors for native links. Report conflicting parents, changed content, unexpected actor or unavailable capabilities. Do not replace other labels, remove edges, reparent or change issue state as recovery.

An uncertain comment needs reconciliation just as an uncertain issue creation does. A later explicit retry after a conclusively rejected operation is different from replaying a possibly successful write; it remains under the caller's current intent and authorization. A security stop is not cleared by generic workflow authorization or a new tool choice.

## Examples for prototype review

- **New behavior report:** Caller supplies content with no known previous submission. Create a new issue; do not run an extensive search to find something to edit.
- **Known own open issue:** Caller supplies another example and a known issue reference. Add a comment by default. Replace the description only if explicitly requested with supplied replacement content.
- **Another user's open issue:** A requested follow-up comment is allowed. Title/body/label changes and native links affecting that issue are refused within this capability, even for an admin.
- **Closed report, problem returns:** Create a new open issue using caller-supplied context/reference. An optional comment on the old issue does not replace the open follow-up; the old issue stays closed.
- **Response lost after posting:** Read back the known issue/comment if possible. If evidence remains inconclusive, return uncertainty without a second POST, a local receipt or a hidden marker.
- **Label applied, parent link interrupted:** On authorized resume, verify current state and both authors. If the link is already correct, report it. If missing and permitted, add only that link. If the parent is another author's issue, report maintainer action instead.

## Implementation and closure boundary

The existing prototype and handoff tickets own concrete client examples and implementation. Add tests for comments on others' issues versus prohibited edits, stable author checks despite admin privileges, both ends of native relationships, actionable closed-issue follow-up, duplicate comments after timeout, current-state conflicts and no persistent receipt/marker side effects.

The previous research covers creation and metadata. The added comment and title/body operations need endpoint/permission/response verification in the implementation handoff, including whether concurrent updates can be guarded atomically. Keep the helper's public surface narrow: no arbitrary PATCH fields, comment editing, state changes or general endpoint passthrough.

This resolves the policy decision. It does not claim working code, exactly-once delivery, verified credentials for every contributor, or actual Copilot/WSL acceptance.
