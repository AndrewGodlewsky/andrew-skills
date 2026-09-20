# Skill contribution process — Round 1: starting a contribution

**Historical decision record.** The proposals, observations and owner answers below are preserved as recorded. For current authoring requirements, examples, release checks and evidence placement, use [CONTRIBUTING.md](../../CONTRIBUTING.md). For implementation status, see the [authoring handoff](skill-authoring-implementation-handoff.md).

Issue: [Define the process for proposing and accepting new skills](https://github.com/AndrewGodlewsky/andrew-skills/issues/20).

**Status: owner direction recorded September 20, 2026.** Issues provide intake and feedback for ideas, completed skill drafts, change requests and confusing behavior. Andrew or an approved maintainer prepares the repository contribution on a branch and merges it into main. See the [working decisions](skill-contribution-notes.md) and [next round](skill-contribution-round-2.md). The original recommendation below is preserved as discussion history; it does not establish a mandatory issue-before-drafting gate.

## Established inputs

- The [accepted architecture contract](skill-architecture-contract.md) defines the minimal package, explicit header fields, manual invocation default and reviewed exceptions. This discussion uses those decisions.
- The [publishing contract](skill-publishing-notes.md) defines independent skill versions and release notes. Implementation and enforcement remain pending.
- Current [contributor guidance](../../CONTRIBUTING.md) explains creating a skill, updating discovery documentation, validation, representative client checks and team review. It does not yet define proposal intake or who accepts a contribution.
- Review evidence belongs outside the distributed skill folder by default. Client checks already deferred to the owner pilot stay pending; structural validation does not prove runtime behavior.
- Commits and publication remain owner-controlled. This issue defines the process; the later blueprint review will turn the agreed process into reusable authoring guidance and an enforcement handoff.

## 1. Should every new skill start with a short GitHub issue?

**Recommendation:** Yes, use one lightweight issue for a new skill, including an imported or adapted skill. Reuse an existing issue when it already describes the need. The issue should contain:

- The intended user and recurring task.
- One representative request and the useful result expected.
- Existing GT skills considered, with a short reason to add a skill instead of extending one.
- Known external source, tools or dependencies, if any; unknowns can be recorded honestly.

This gives contributors and future authoring agents a shared place to check for duplicate work and agree on scope. It need not be a long specification or a separate document.

**Proposed timing:** Recording the proposal allows ordinary local drafting to begin; it does not require a separate approval round before every draft. Acceptance into GT still happens through review before owner-controlled publication. A proposal is not permission for external actions, tool installation or publishing. Existing authorization and security boundaries continue to apply.

For a small correction to an existing skill, use the eventual change-review record instead of requiring a new proposal issue. A broader change that gives an existing skill a substantially different purpose should get the same short scope discussion as a new skill. Its release/version requirements remain those already agreed.

### Concrete example

A teammate wants `explain-design`. They first check whether `grill-me` already covers the need. Their issue might say: “Help reviewers understand an existing design. Given a design and a goal, explain the approach, identify three tradeoffs and recommend an option. Unlike the interview skill, this produces an explanation from supplied material.” They can draft locally while review and final acceptance remain outstanding.

### Alternatives

| Choice | Effect |
| --- | --- |
| Short issue before drafting; no separate routine approval gate — recommended | Records intent and helps prevent duplication without making all drafting wait for an owner response. |
| Short issue and explicit owner approval before drafting | Gives the owner earlier scope control, but adds a wait even for small new skills. |
| Draft first; explain the proposal during change review | Minimizes intake steps, but overlapping or unsuitable work may be discovered after authoring. |

**Question:** Which starting rule do you want for new skills: a short issue with drafting allowed, an owner-approved issue before drafting, or draft-first review?

### Your answer
Ultimately, here's what I'm thinking. I do want to have the issue system be a way that users can submit either ideas or their variation of completed skills, so that I, as a maintainer, can review and approve if I want to add them into the repo. They also should be able to submit issues for skills that they think should be changed, or for skills that they are confused by, where it didn't make sense to them. This would be a feedback loop for me to be able to update skills through the issues. But ultimately, when we're talking about actually contributing skills into the main repo, that's going to be done through a branch. I will create a branch, or some approved maintainer will create a branch, add the skill with all the correct architecture, and then merge that branch into the main branch. That's how that should work. I will definitely be building into this hub some skills that will help users write good skills and write skills that have the right architecture to be added into the hub in the future. Inside some of those skills, we can add a variation or add some mechanism so that issues can automatically be pushed to the GitHub repo (so that it's seamless for the user having a conversation and then having a skill be built and submitted as a GitHub issue). But it is also equally fine for a user just to submit an issue saying they need a skill to do X, Y, and Z, and I'll end up building that, like I said, in a branch and then merging into the main branch. Hopefully this makes sense, and let me know if you have any questions. 
<!-- Write your answer here, or answer in chat. -->

## Later decisions in this issue

After the starting rule is settled, work through authorship/review/acceptance responsibilities, reuse and import handling, evidence submission and exceptions, then the ready/done checklist. These are discussion topics, not additional questions to answer now. The final process must distinguish authored examples, actual observed behavior and deferred client checks.
