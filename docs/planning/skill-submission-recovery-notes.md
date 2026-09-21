# create-issue recovery — working decisions

Decision issue: [Define duplicate prevention and uncertain submission recovery](https://github.com/AndrewGodlewsky/andrew-skills/issues/29). The owner discussion is complete; see the [recovery contract](skill-submission-recovery-contract.md). Implementation and observed client behavior remain pending.

## Owner direction from Round 1

- Use live GitHub issues as the source of truth. Do not introduce persistent local submission receipts or a local tracking cache. The receipt proposal was rejected, not merely deferred.
- Round 2 narrows the earlier consolidation idea: default to creating new issues, without extensive similarity searches. Reuse a known issue when the caller has a clear reason, rather than routinely mining older issues for one to update.
- New comments may be added to issues authored by anyone in this repository when authorized. This explicit permission does not allow edits to another author's issue, labels or relationships. Greater GitHub permissions do not override the own-authorship boundary.
- For an existing issue, add a comment by default. Explicit caller-requested title/body replacements are allowed only on the current user's own issue, with supplied replacement content and fresh-state conflict checks. Editing/deleting comments, closing/reopening and assigning issues remain outside this capability.
- Native parent/child and blocking relationships require both issues to be own-authored. Cross-author relationships are handed off to maintainers separately; a caller-supplied ordinary reference is not a native relationship.
- Comments on closed issues are allowed, but a follow-up that needs action must create a new open issue. Do not rely on a closed-issue comment for maintainer visibility or reopen the old issue. A new related issue works even when native linking is unavailable or prohibited.
- Short bounded retries of read-only checks are accepted. Do not automatically repeat a create request whose outcome is uncertain. The owner may tune operational values after testing.
- Narrow resumption of missing labels/relationships on a known submission is accepted, subject to current state, authorization and the authorship boundary. No background watcher or automatic reassignment of responsibility is implied.
- Existing fixed repository, caller content ownership, model-only invocation, partial-organization reporting and security stops still apply.

## Consequences for the design

Resolve the authenticated GitHub identity and read the target issue's current author/content before a mutation. Require author identity for edits/organization and for both ends of native relationships, but not for the separately allowed new-comment operation. Do not trust a supplied username, an old conversation claim, an assignee or collaborator/admin status as authorship. Callers supply all substantive new/comment/replacement content.

Do not make broad related-issue discovery a routine submission gate. Use known references, current conversation evidence and focused reads; uncertain-write reconciliation is a separate reason to inspect the current user's issues/comments. A missing local record is normal because there is no receipt store. If a previous write might have succeeded, use any available response identity and live GitHub evidence; return uncertainty when that evidence is insufficient. No matching search result does not prove that no write happened. Do not trade the rejected receipt for an unsolicited hidden issue-body marker.

The helper may retain response evidence in the current operation and return it to the caller. It does not promise recovery of conversation data that no longer exists or exactly-once delivery across independent callers.

## Review record and follow-up

- [Round 1](skill-submission-recovery-round-1.md): original proposals and owner answers.
- [Round 2](skill-submission-recovery-round-2.md): accepted explicit own-issue edits, comments on anyone's issues, strict authorship for native relationships, new-issue default and new open issues for actionable closed-issue follow-up.

The consolidated recovery contract records outcomes and examples. API support for comments/edits, authorship enforcement and concurrent edits still needs implementation-facing verification; prior organization research did not exercise these newly requested operations. No local receipt schema, retention policy or state-directory setup belongs in the handoff.
