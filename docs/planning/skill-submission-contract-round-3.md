# Shared issue creation — Round 3: useful standards and boundaries

Issue: [Define the shared issue-creation and organization contract](https://github.com/AndrewGodlewsky/andrew-skills/issues/28).

**Status: owner answers recorded.** See the [working decisions](skill-submission-contract-notes.md) and [Round 4](skill-submission-contract-round-4.md). The original recommendations below are preserved alongside the answers; recommendations not expressly accepted remain proposals.

## What your last answer settled

This skill should create the issue and apply agreed organization itself when authorized. You want titles, descriptions and labels that make issues easy for you or another agent to review. The calling skill still owns the content and body layout. See the [working decisions](skill-submission-contract-notes.md).

My recommendation is a small repository-aware issue creator: check the supplied material, use the repository's existing conventions, create the requested issue or related issues, and give the caller an accurate result. It should not decide what maintainers accept or start doing the work described by an issue.

## 1. Check readability without taking over the writing

**Recommendation:** Check for a nonempty, understandable title and a description that makes the reason for the issue clear. Do not mandate headings, a completed specification, reproduction steps for every report, or a proposed solution. A brief idea or observation is enough when its meaning is clear.

If something essential is missing or genuinely ambiguous, return a short, specific request to the caller. Otherwise preserve the supplied title/body. Do not hold up understandable content for stylistic improvements.

For example, “Fix it” with an empty body needs clarification. “The restore instructions do not explain where to find my exported copy,” with the caller's short explanation, can be useful without a full bug report.

**Question:** Should the skill use this lightweight clarity check and ask the caller to repair missing essentials, while leaving readable supplied wording alone?

### Your answer
I think, for the most part, this skill will end up guiding the conversation when they're actually trying to submit the issue. I don't think it'll really be interacting with another human. It should be mostly interacting with the agent that's trying to write the description and get the skill created. If that agent decides that it needs to interact with the human, then that's fine. But I don't think this skill is really meant to do that. 
<!-- Answer here. -->

## 2. Choose useful existing labels

**Recommendation:** Accept valid labels requested by the caller and select existing descriptive labels when the purpose is clear from supplied context. Examples: `bug` for a supplied malfunction report, `enhancement` for a requested capability, and `documentation` for a documentation change. The label records the report's purpose; it does not certify the report as proven.

Use workflow labels such as `wayfinder:research` only when the calling workflow identifies that role. Do not infer `duplicate`, `invalid`, `wontfix`, priority, difficulty or maintainer acceptance. Do not create new labels automatically. If no existing label fits confidently, return the labeling question to the caller; do not use `question` merely because the agent is uncertain.

Put the agreed meanings and selection rules in one bundled reference owned by this shared skill. Validate against the repository's actual labels before applying them. Other skills should not need to memorize exact label names.

**Question:** May this skill choose existing descriptive labels under those rules, or should it apply only labels explicitly supplied by the caller?

### Your answer
Yeah, I think what we should go for labels is probably Enhancement-skill New-skill Inconsistent-skill And those would be for the three states of a change to a skill:
- a new skill proposed being added
- troubleshooting when a skill doesn't do what the user expects it to do
<!-- Answer here. -->

## 3. Support a single issue or an explicitly related set

**Recommendation:** Allow one issue or a small related set supplied by the caller, with a title/body for each. The caller must identify any intended parent/child or blocking relationships. The skill should validate those references, create the issues and apply the requested links; it should not invent a work breakdown or infer dependencies from similarity.

For example, a caller supplies “Research export behavior” and “Implement export behavior,” explicitly saying implementation is blocked by research. The shared skill handles the GitHub linkage. It does not decide that ordering itself. All referenced issues must be in this repository.

Return a result for each issue and relationship. A related set is not an all-or-nothing transaction: if only some steps complete, report those steps accurately. Detailed retry rules belong to the recovery ticket.

**Question:** Is support for caller-supplied related sets useful in the first version, or would you prefer one issue per call with optional links to issues that already exist?

### Your answer
Yeah, I think ultimately we should try and tend towards one issue per related problem, but I do want to give it the ability to link issues and create sub-issues and stuff like that (just in case that's something that's needed). 
<!-- Answer here. This also confirms whether “blocking skills” meant issues representing that work. -->

## 4. Keep projects optional until there is a concrete destination

**Recommendation:** Start with labels and the agreed issue relationships. Defer project placement until you identify a particular GitHub Project and how these issues should appear there. If added later, bind it to an approved project identity and keep it optional for callers who only need issue creation.

This avoids inventing a board, workflow fields or extra required setup. We have not established a project configuration or ordinary-user project permissions.

**Question:** Can project integration wait, or is there a specific existing project that the first version must support? If it is required, name or link it and describe the intended placement.

### Your answer
I'm not really sure. I just saw it as a section. I'm not sure if you have a good proposal about what we could use here. I'm also looking for just additional ideas of how we can think about issues to make sure that, when we have large numbers of issues being submitted to this repo, they're in a format that I and other maintainers can digest and start implementing easily. 
<!-- Answer here. -->

## 5. Preserve a created issue when organization is incomplete

**Recommendation:** Treat labels and relationships as desired organization whose completion is reported separately from issue creation. If known capability limits prevent organization but issue creation is available and authorized, allow creation and return the link with the missing steps clearly identified. If an actual permission or security denial occurs, obey the user's stop rules; report any issue already created and do not try another route.

Example result: “Created ‘Clarify export instructions.’ Applied `documentation`. The requested parent link is incomplete; maintainer action is needed.” Never claim everything succeeded, or create a second issue to repair the first one's labels.

This allows ordinary contributors to submit useful material without granting them maintainer access. The tradeoff is that some issues may arrive without their intended labels or relationships. Exact permissions remain under research.

**Question:** Is that acceptable, or should the skill require the requested labels/relationships to be available before it creates an issue?

### Your answer
Yeah, I think this is fine. 
<!-- Answer here. -->

## 6. Use a straightforward skill name

**Recommendation:** Name the skill `create-issues`. Its description and instructions will state prominently that it operates only on AndrewGodlewsky/andrew-skills. It remains model-invocable; the user does not need to type its name. The source name does not supply the destination enforcement.

**Question:** Does `create-issues` fit, or do you prefer another name?

### Your answer
Yeah, I think this is a good name. I'm comfortable with this. But maybe we should call it "create-issue" 
I'm also okay if we don't allow the user to invoke this skill, so maybe it never shows up for them, and it's a model invocable skill only. I'm open to that idea. 
<!-- Answer here. -->

## Remaining technical follow-up

[Verify labels, projects and issue relationships for shared issue creation](https://github.com/AndrewGodlewsky/andrew-skills/issues/32) must establish supported operations and permissions. We will then check the proposed helper/runtime prerequisites and content limits against these decisions. Detailed duplicate detection and uncertain-write recovery stay in their existing ticket. No production implementation, label creation, project changes or Git publication is part of this review round.
