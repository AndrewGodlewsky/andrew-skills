# create-issue recovery — Round 1: duplicates and interrupted submissions

Issue: [Define duplicate prevention and uncertain submission recovery](https://github.com/AndrewGodlewsky/andrew-skills/issues/29).

**Status: owner answers recorded.** Local receipts were rejected. The owner wants GitHub's current issues as the source of truth, permits adding material to the user's own issues, and accepts bounded read-only retries and narrow organization resumption. The earlier no-comment/no-update proposal is superseded for the user's own issues; exact update and relationship boundaries are in [Round 2](skill-submission-recovery-round-2.md). Original recommendations and answers are preserved below.

## What is already settled

- The calling agent supplies the title/body and manages any human conversation.
- All creation, lookup and relationship operations stay within AndrewGodlewsky/andrew-skills.
- One issue per problem is preferred, but similar wording does not prove two reports are the same problem.
- A created issue stays created even if labels or links are incomplete. Report missing organization separately.
- Do not blindly submit again after a timeout, switch accounts/tools after a denial, or claim a manual handoff was submitted.
- This capability does not accept proposals, close duplicates or act as a maintainer triage workflow.

This round decides how to make those rules useful without turning the skill into a large issue-management system.

## 1. Similar issues are a decision for the calling agent

**Recommendation:** Do a limited related-issue lookup before a new submission and return likely matches to the calling agent. Include a short explanation of the overlap and whether each issue is open or closed. Do not treat a matching title, body or topic alone as proof that a new report should be discarded.

If the caller's existing context clearly establishes a distinct problem, new occurrence or intentionally separate proposal, proceed under that intent. If the relationship is ambiguous, ask the caller to decide whether the existing issue is sufficient or a new issue is needed. The caller decides whether to involve the human; the shared skill does not automatically interrupt the user for every match.

When the caller chooses the existing issue, return its verified link without posting a comment, changing its content or reopening it. Preserve the proposed material for the caller. If it contains genuinely new evidence, returning an existing link does not mean that evidence was added to GitHub. Do not silently lose that distinction.

**Example:** An existing issue asks for clearer restore instructions. A new caller has a different request concerning export filenames. The topics overlap, but the caller can still create a separate issue. If a previously fixed behavior has returned, the old closed issue is relevant context, not an automatic reason to reject or reopen anything.

**Question:** Should we use this advisory lookup, leaving reuse versus a distinct new issue to the calling agent and keeping updates/comments/reopening outside this skill?

### Your answer
I think this is fine as an idea, but we need to add a caveat to this: the user can only edit the issues that they submitted. If they didn't submit an issue, I don't want a user being able to change something else that someone else submitted through this skill. That would be my only additional requirement for this idea, but other than that, it's fine if this happens. And the main reason I think this would be helpful is if a skill doesn't work for some reason. They end up submitting an issue just saying, "Hey, this didn't work how I thought it was going to work." Later on, they have another example of that same skill that doesn't work. That can be put into a single issue. But I don't want to make too many rules around what should go into issues and what shouldn't, like when issues are duplicate or not. We can let the model choose from previous issues they've submitted 
<!-- Answer here. -->

## 2. Keep a small local submission receipt

**Recommendation:** Before attempting creation, save a small local receipt for that submission. It records a submission identifier, fixed repository, acting account, a fingerprint of the prepared content, intended organization and the current attempt state. Add the GitHub issue identity when known. Never store credentials; avoid storing a second full copy of the issue body in the receipt. The caller retains the prepared content.

The receipt lets the same caller resume after an interruption and recognize an issue already created by this attempt. Reusing it requires the same submission content and identity; a mismatch is reported instead of quietly turning into another write. A changed draft does not silently edit an already-created issue.

Keep receipts in a documented user-local state location for the active Windows/WSL environment, outside both the installed skill and the current project. No database service or automatic cross-machine synchronization. Keep the body unchanged: no hidden tracking marker is appended to the issue.

If a receipt cannot be saved before the write, return the limitation rather than starting an unrecorded automatic submission. Any actual permission/security denial still follows the user's stop rules. If saving a result fails after a write, report the known result or uncertainty; that failure must never cause another creation attempt.

**Tradeoff:** This adds a small amount of local state and a writable-location prerequisite. It helps recover this attempt but does not deduplicate unrelated callers or different machines. A crash after GitHub accepts an issue but before its identity is saved can still leave an uncertain result. We must not promise exactly-once delivery.

**Question:** Is that small local receipt worthwhile, or would you prefer no saved state and accept that recovery depends on what remains in the conversation?

### Your answer
I don't think I like this idea at all. I feel this is just going to clutter the user's desktop, and I'm not sure under what scenarios they would actually need this. Because ultimately, if they need to know the issue, they should just be looking at the list of issues attached to the repo that they created. Because I want to make sure that they'll always have the latest information
<!-- Answer here. -->

## 3. Retry checks briefly; stop on an uncertain creation

**Recommendation:** Automatically retry temporary read-only lookup/verification failures within a small bounded budget, respecting rate-limit guidance and the active user's security stops. Do not turn this into ongoing background monitoring or repeatedly hold the conversation open.

If GitHub returns a usable created-issue identity but verification fails, retry verification of that same issue; never send another create request. If a create request times out without an identity, use the receipt and bounded lookup to look for evidence. Matching text alone remains a candidate, not proof of this attempt's identity. Report what was found and return the uncertainty to the calling agent when it cannot be resolved.

A search with no match is not proof that nothing was created: results can be incomplete or the receipt may be lost. In an unresolved case, the caller must reconcile the outcome before resuming automatic submission. A new manual submission is not a safe automatic fallback for that case either.

Confirmed input rejection goes back to the caller for correction. An operation known not to have sent a create request can be resumed after its prerequisites are fixed. These must remain distinct from a request that might have reached GitHub. A cancellation after sending is also potentially uncertain.

**Question:** Is this balance right: short automatic retries for checks, but no automatic second create request when the first might have succeeded?

### Your answer
Yeah, I think this is fine. Ultimately, I might have to fine-tune this when I'm testing this out, but for right now, let's go with this. 
<!-- Answer here. -->

## 4. Resume only the missing organization on a known issue

**Recommendation:** When the calling workflow resumes a known submission, read its current labels and relationships and apply only the originally requested, still-missing operations that are available and authorized. If a maintainer has already completed them, report them as present and do nothing further.

This is a narrow continuation of the original submission, not permission to edit arbitrary issues. Do not replace other labels, move a child away from its existing parent, remove blockers, change the title/body, or reopen/close an issue. If the current state conflicts with the request, return that conflict to the caller. A different authenticated account also requires returning to the caller rather than silently continuing the original attempt under another identity.

If an actual permission/security denial occurred, resumption must respect the user's required go-ahead; a receipt is not permission to bypass it. There is no scheduled retry or automatic maintainer notification.

**Example:** The issue was created and labeled, but adding its requested parent link was interrupted. On a later authorized resume, read the relationship. If it is already correct, return success. If absent, apply just that link when permitted. If it points to another parent, report the conflict.

**Question:** Should this skill support that narrow resume operation, or should every incomplete label/link be handed off for separate maintainer work?

### Your answer
I think that's fine if the skill supports that. 
<!-- Answer here. -->

## Proposed outcome language

These are meanings for the caller, not a finalized function schema. The result always distinguishes issue creation from organization.

| Outcome | What it means |
| --- | --- |
| Created and verified | The issue was read back in this repository; report its link and organization results. |
| Created, organization incomplete | The issue exists; list the labels/relationships still missing or uncertain. |
| Creation acknowledged, verification incomplete | GitHub acknowledged creation, but readback is incomplete; preserve that evidence and identify any returned link as unverified. |
| Existing issue selected | The caller chose an existing verified issue; no new issue, comment or content update was made. |
| Not submitted | A prerequisite/input/authorization is missing, or a confirmed pre-send cancellation/rejection prevented creation. Prepared material remains available to the caller. |
| Outcome uncertain | A request might have succeeded; report known evidence and what must be reconciled. Do not equate this with failure or suggest a fresh submission as if nothing happened. |

If an issue exists and a later step is denied, the security stop accompanies that known result rather than erasing it. A complete, unrelated duplicate created simultaneously by another caller cannot be ruled out by local receipts or a preflight lookup; do not automatically close either issue.

## Remaining implementation details

After your answers, specify the small state/outcome table and representative examples. Exact receipt schema/location/retention, local concurrency protection, lookup bounds and retry budgets should be concrete implementation requirements and tests, not new user-facing configuration unless needed. No production helper, stored submission receipts or test issues are created by this review round.
