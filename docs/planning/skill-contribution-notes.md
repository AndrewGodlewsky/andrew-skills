# Skill contribution process — working decisions

**Historical decision record.** The proposals, observations and owner answers below are preserved as recorded. For current authoring requirements, examples, release checks and evidence placement, use [CONTRIBUTING.md](../../CONTRIBUTING.md). For implementation status, see the [authoring handoff](skill-authoring-implementation-handoff.md).

Issue: [Define the process for proposing and accepting new skills](https://github.com/AndrewGodlewsky/andrew-skills/issues/20).

**Status: owner discussion complete September 20, 2026.** The [accepted contribution contract](skill-contribution-contract.md) consolidates the flow and existing requirements for the blueprint handoff. These notes preserve the decision trail; implementation and enforcement remain separate.

## Confirmed direction — September 20, 2026

Source: the owner's written answer in [Round 1](skill-contribution-round-1.md).

- GitHub issues are the intake and feedback channel. Users can submit an idea, a completed skill or variation, a requested change, or a report that a skill is confusing or did not make sense.
- A submission need not contain a finished skill. A plain description of the desired task is a valid starting point; a maintainer can build the skill from it.
- Andrew reviews submissions and decides whether to add them to GT. Andrew or an approved maintainer creates a branch, prepares the skill to meet the accepted architecture, and merges the branch into main.
- Submitting a completed draft is distinct from accepting it into the distributed collection. Users do not have to turn their feedback into a repository-ready change themselves.
- The answer does not adopt the earlier recommendation of a mandatory issue before anyone drafts a skill. Round 3 confirms a deliberately simple process; no new linked-issue requirement for every maintainer-originated change or correction is imposed.
- The owner intends future hub skills to help users author conforming skills and potentially submit them through GitHub issues from a conversation. Capture this as future direction; authoring/submission automation is not a deliverable of this planning issue or the current architecture map.

This describes the intended human contribution workflow. It does not grant agents standing permission to create branches, commit, push, open PRs or merge. The owner's existing action-specific Git authorization rules remain in effect.

## Established contracts retained

- [Architecture](skill-architecture-contract.md): minimal package, explicit header fields, manual invocation default and reviewed exceptions; representative review evidence outside the distributed folder by default.
- [Publishing](skill-publishing-notes.md): release metadata, independent skill versions, plugin version rules and validation before merge. These planned checks must not be described as already implemented.
- [Migration and acceptance](skill-migration-acceptance-notes.md): deferred client checks remain pending; structural validation does not establish runtime compatibility.

## Owner-managed matters outside this discussion

Source: the owner's written answer in [Round 2](skill-contribution-round-2.md), September 20, 2026.

- Andrew will handle GitHub-level rules and technical questions about who can approve what. Do not design reviewer permissions, approval quotas, self-review policy or exception-approval roles in this issue or pass them to the blueprint issue as questions the owner must answer there.
- The proposed self-review rule was not accepted. Do not infer actual repository protection settings from this answer or claim to have verified them.
- Keep the contribution checklist focused on skill content, useful submission information, validation and behavior evidence. Existing reviewed-exception requirements remain inputs, but approval authority is outside this discussion.

## Final direction from Round 3

- Users may submit what they believe should be a new or changed skill without following an intake classification rule. Maintainers decide what belongs in the collection and how it fits the accepted architecture.
- Do not implement the proposed same-task/result rule as policy, automated logic or a mandatory contributor check. The owner explicitly asked to keep contribution simple.
- Feedback about confusing or less useful behavior belongs in issues, including changes noticed as models evolve. Users can request help without producing a replacement skill.
- Retain the existing architecture, release metadata, attribution/dependency and representative-evidence requirements as a short maintainer checklist. No new permissions process, third mandatory skill file or contribution schema is needed.
- The architecture decision is already complete. The remaining canonical example/evidence placement and precise checks/adoption work belong to the already tracked blueprint decision; they do not require another contribution interview round.

The [blueprint and enforcement handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/21) will use the completed decisions to finalize reusable authoring guidance, canonical locations and enforcement/adoption work. The self-review and classification recommendations were not accepted. No authoring/submission automation is implemented by this decision.
