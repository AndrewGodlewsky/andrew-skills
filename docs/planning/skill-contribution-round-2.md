# Skill contribution process — Round 2: who accepts a contribution?

**Historical decision record.** The proposals, observations and owner answers below are preserved as recorded. For current authoring requirements, examples, release checks and evidence placement, use [CONTRIBUTING.md](../../CONTRIBUTING.md). For implementation status, see the [authoring handoff](skill-authoring-implementation-handoff.md).

Issue: [Define the process for proposing and accepting new skills](https://github.com/AndrewGodlewsky/andrew-skills/issues/20).

**Status: owner excluded this decision from the planning scope on September 20, 2026.** Andrew will handle GitHub rules and who can approve what. The self-review recommendation below was not accepted; it is preserved only as discussion history. Do not reopen approval roles or reviewer permissions in subsequent rounds. Continue with [Round 3](skill-contribution-round-3.md).

## What your first answer settled

Users submit ideas, completed drafts, change requests or confusing behavior through GitHub issues. You or an approved maintainer turn selected submissions into properly structured changes on a branch, then merge them into main. A user can contribute useful feedback without writing a finished skill or preparing a branch.

This replaces the earlier framing of “must an issue exist before someone drafts?” with two distinct steps: user submission and maintainer acceptance. Your future authoring/submission skills can help with the first step; they do not yet exist as part of this work. The [working decisions](skill-contribution-notes.md) preserve the details.

## 1. Can an approved maintainer accept their own contribution?

**Recommendation:** Yes, for an ordinary contribution that follows the agreed standard, let you or an approved maintainer author, review and merge it without a mandatory second reviewer. The maintainer still records the review evidence and satisfies the agreed checks before merging. Self-review is not the same as skipping review, and an automated check is not proof that the skill behaves well.

This keeps a small team from waiting for another person on every straightforward skill or correction. The tradeoff is that a second person may notice unclear instructions or assumptions the author misses. A maintainer can still request another review whenever it would help.

The exact evidence/checklist and handling of exceptions will be decided in subsequent rounds. This question is only about whether routine acceptance requires a second person. Existing deferred client tests remain deferred, and the future release checks remain implementation work.

### Concrete example

A user submits an issue asking for a skill to explain a design. An approved maintainer writes it on a branch, checks it against the standard, records a representative request and the available validation/behavior evidence, and prepares it for merge. Under this recommendation, the maintainer can complete the review themselves. Under a second-reviewer rule, another authorized person must accept the change before it is merged.

| Choice | Effect |
| --- | --- |
| Authoring maintainer may also accept — recommended | Supports Andrew working alone and lets approved maintainers complete routine contributions with recorded review evidence. |
| Another approved maintainer must accept | Adds an independent check, but requires a second available person even for routine contributions. |
| Andrew must accept every contribution | Keeps final acceptance with you even when another maintainer authors the change; may create a queue as the team grows. |

**Question:** For an ordinary contribution that follows the standard, can the authoring maintainer also accept it, must a different approved maintainer review it, or do you want final acceptance to remain with you?

### Your answer
Ultimately, this is not going to happen because we have rules at the GitHub level, but I don't need you to worry about this. Let's skip all of these technical "who can approve what" questions. I'll work all these out. These aren't really related to the skills repository Plugin hub here we're trying to build. 
<!-- Write your answer here, or answer in chat. -->

Human maintainer authority does not grant an agent standing permission to commit, push, open a PR or merge. Your existing explicit-authorization rules for those actions remain unchanged.
