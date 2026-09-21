# create-issue recovery — Round 2: updating the user's own issues

Issue: [Define duplicate prevention and uncertain submission recovery](https://github.com/AndrewGodlewsky/andrew-skills/issues/29).

**Status: owner answers recorded; recovery policy settled.** Comments may be added to anyone's issue, but edits and native relationships remain subject to strict own-authorship rules. New issues are the default; actionable follow-up on a closed issue requires a new open issue. See the [recovery contract](skill-submission-recovery-contract.md). Recommendations and owner answers below are preserved as history; the owner's corrections take precedence.

## Changes based on your notes

There will be **no persistent local submission receipts or tracking cache**. The agent will read the user's current issues on GitHub. It can decide whether additional supplied material fits one of that user's earlier issues or calls for a new issue; we do not need a long set of duplicate-classification rules.

Only issues submitted by the current user are eligible for changes through this skill. The implementation should compare the authenticated GitHub account with the issue's actual author, using stable account identity rather than a caller's claim. Assignment, collaborator access or repository ownership is not a substitute for having authored the issue. This applies even if GitHub would otherwise permit the write. The skill cannot establish a different human identity behind a shared account, so shared credentials are not a way to assert personal authorship.

The issue need not have been created through this skill: a user's earlier manually created issue can also be relevant. Keep all operations in AndrewGodlewsky/andrew-skills, preserve existing authorization, and read fresh state before updating anything.

## 1. How should additional material be added?

**Recommendation:** Add a new comment by default when the calling agent has another example, observation or piece of evidence for the user's own issue. This keeps the original description and existing discussion intact. The caller supplies the actual comment content.

Also allow changing that user's issue title or description when the caller explicitly requests that operation and supplies the intended replacement based on the current issue. Do not treat “add another example” as permission to rewrite the whole issue. Recheck for intervening edits and return a conflict instead of knowingly overwriting newer content. Do not edit/delete other people's comments, close/reopen issues, or change ownership/assignment.

If the issue is closed, show that state to the calling agent. It can choose a follow-up comment or a new issue based on the new material; the skill does not silently reopen it. Locked or otherwise unavailable writes are reported under the existing stop rules, not worked around.

**Example:** A user reported that `grill-me` asked a confusing question. A week later, another example appears. The agent finds that user's issue and supplies a follow-up comment describing the second example. A different user's similar issue can be read as context, but this capability does not comment on or edit it under this proposed strict boundary.

GitHub exposes separate comment-creation and issue-update operations; this proposed policy deliberately narrows when the skill uses them. Availability still depends on the selected identity and credentials. [Comment API](https://docs.github.com/en/rest/issues/comments#create-an-issue-comment), [issue update API](https://docs.github.com/en/rest/issues/issues#update-an-issue).

**Question:** Does “new comment by default, explicit title/description edits when requested, only on the user's own issue” match what you want? If you prefer comments only, we can keep replacement edits out of the first version.

### Your answer
Yes, I like your recommendations here. I think all those are fine. The only thing I would add is that if an issue is closed and a user wants to add a comment to it, that's fine. We should open another sub-issue or a related issue to that comment or to that closed issue, because I will not be looking at closed issues. If they actually need something to happen with that closed issue, a new issue needs to be created. But I'm fine with everything else you're suggesting here. 
<!-- Answer here. -->

## 2. What if a relationship involves someone else's issue?

A native parent/child or blocking relationship affects how both issues are organized. This creates an edge case for your rule against changing other people's issues.

**Recommendation:** Require both issues to have been submitted by the current user before this skill creates a native parent/child or blocking link. If either issue belongs to someone else, return the proposed relationship for a maintainer to handle separately. Do not automatically post a comment or change either issue as a workaround.

The caller can still refer to a relevant issue in its own supplied text. A normal reference is not a claim that a native parent/child or blocker relationship has been created. The skill does not insert that reference itself without caller-supplied content.

**Example:** The current user creates two related issues: the skill can link them, subject to GitHub permissions. But if the intended parent is your planning issue and a teammate authored the child, this strict rule leaves the native link to a separate maintainer workflow. That is more restrictive than simply checking the author of the issue whose endpoint is being changed.

**Question:** Should both ends of a native relationship be the user's own issues, or do you want a narrow exception allowing their own issue to be linked to someone else's issue?

### Your answer
Nope. The user can only edit or modify issues that they created. No exceptions. I am fine about allowing users to comment on other users' issues, but they should not be allowed to modify or edit them in any way. Just add additional comments. I don't particularly want the agents to be looking too hard at issues that have already been submitted. I want them to, more or less by default, create new issues, as opposed to trying to find other similar issues to edit or add context to. 
<!-- Answer here. -->

## Recovery without local records

Your accepted retry policy stays in place. Keep evidence in the current operation/conversation and consult live GitHub state:

- If creation returned an issue identity, verify that issue instead of creating another.
- If a comment returned an identity, verify that comment instead of posting it again.
- If a write timed out without an identity, inspect the user's relevant issues/comments using bounded reads. Similar wording alone does not prove which request created a result. Return uncertainty when unresolved; do not automatically repeat the write.
- Resume missing organization only from an explicitly identified issue and requested intent, with fresh authorship/state checks. A previous conversation is not assumed to retain everything forever.
- Report created issues, added comments, updated content and missing organization separately. A link to an old issue does not mean the new material was saved there.

When evidence has been lost, the agent may have to reconcile with the user rather than guarantee recovery. This is the honest tradeoff of avoiding persistent receipts and body markers, and does not change your decision to keep GitHub authoritative.
