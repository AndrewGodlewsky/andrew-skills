# GT skill contribution process — accepted planning contract

**Historical decision record.** The proposals, observations and owner answers below are preserved as recorded. For current authoring requirements, examples, release checks and evidence placement, use [CONTRIBUTING.md](../../CONTRIBUTING.md). For implementation status, see the [authoring handoff](skill-authoring-implementation-handoff.md).

Decision: [Define the process for proposing and accepting new skills — resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/20#issuecomment-5752536726). Closed September 20, 2026 after three written rounds. The issue resolution is the canonical decision; this asset consolidates it for the authoring blueprint.

## Simple contribution flow

1. **A user submits an issue.** It can describe a skill idea, contain a completed draft or variation, request a modification, or report confusing or disappointing behavior. A plain-language need or experience is sufficient to start a conversation. Users do not have to classify the contribution correctly, inspect all existing skills, or supply a repository-ready package.
2. **A maintainer considers the submission.** Andrew or an approved maintainer decides whether to build a new skill, adapt a draft, improve an existing skill, ask for more context, or explain why the suggestion will not be included. Skill boundaries, type and invocation choices use maintainer judgment within the accepted architecture. The proposed same-task/result rule is not an adopted classification algorithm or intake requirement.
3. **A maintainer prepares the repository change on a branch.** The skill follows the accepted architecture and publishing contracts. Useful parts of a submitted variation can inform the change without the entire variation becoming a new skill. The maintainer can also author a skill from a plain request.
4. **The change is reviewed and merged into main through the owner's GitHub process.** GitHub permission, reviewer and approval rules are Andrew's responsibility. This decision neither specifies nor verifies those settings.

Feedback remains useful after publication, including when model changes affect a skill's usefulness. Users can submit another issue for confusing behavior or a desired modification; a finished replacement is not required.

No mandatory proposal-before-drafting gate, user classification form, automatic routing system or special contribution approval workflow is added. No new issue-per-correction rule is introduced. Small changes use the same existing content and release requirements without repeating this planning exercise.

## Maintainer checklist — existing requirements carried forward

This is a compact reminder of previously accepted requirements, not a new submission form or implemented validator.

- Prepare the complete skill folder using the [architecture contract](skill-architecture-contract.md): required instruction/header content, the agreed release record, and only the supporting resources actually needed. Follow its invocation default and reviewed-exception rules.
- Keep runtime instructions and resources self-contained with appropriate relative links. Explain applicable prerequisites and action/failure boundaries; preserve the accepted dependency and [historical-export portability limits](skill-personal-export-contract.md).
- Preserve applicable attribution and license terms for external material and document adaptations/provenance as required by [existing contributor guidance](../../CONTRIBUTING.md). A submitted draft is still material to review, not proof of compatibility or permitted reuse.
- Include the independent skill version and short release note, and the matching plugin version changes where required by the [publishing contract](skill-publishing-notes.md). Even small published corrections follow that contract. The new release validation is still pending implementation.
- Keep discovery documentation accurate when skills are added or changed, using the README skill listing and the existing plugin/marketplace arrangement. Do not introduce a second release catalog or contribution registry.
- Review a representative request and expected result. Keep reviewer-only examples outside the distributed skill folder by default; distinguish expected outcomes from actual observed results. Run applicable available validation and behavior checks, with failures and deferred checks stated honestly. The [owner pilot](skill-migration-acceptance-notes.md) remains the home for the already deferred client evidence.

## What ready and done mean here

**Ready for maintainer consideration:** an issue communicates the user's idea, draft, change request or experience sufficiently to begin discussion. Missing detail can be clarified in that discussion; there is no newly required technical submission package.

**Ready as a repository change:** the maintainer has prepared the relevant files and review evidence against the existing architecture, publishing and validation contracts. A local structural check does not establish client compatibility; missing, failed and deferred evidence remains visible.

**Published contribution:** the reviewed branch change has reached main through the owner-managed GitHub process. Closing a planning issue or creating local files is not publication. Wider team adoption remains subject to the separately accepted implementation and pilot work.

## Blueprint handoff and limits

[Review the skill authoring blueprint and enforcement handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/21) can now turn the accepted architecture and this simple flow into a useful starter example/checklist. It owns the canonical authoring/evidence locations, precise deterministic checks versus human review, existing-skill adoption and execution slices. Those are concrete blueprint decisions already tracked there; do not reopen contribution governance or build routing/classification logic.

The owner intends future skills to help users write good skills and submit drafts or feedback through GitHub issues during a conversation. That is future capability context, not a feature implemented or newly specified by this decision. A dedicated creator/submission skill remains outside this map's current delivery scope; its eventual name and behavior are not fixed here.

No production skill, validator, CI configuration, installed plugin or repository setting changes as part of this resolution. Human maintainer workflow does not grant agents standing permission to create branches, commit, push, open PRs or merge; action-specific owner authorization still applies.

Original owner answers: [Round 1](skill-contribution-round-1.md), [Round 2](skill-contribution-round-2.md), [Round 3](skill-contribution-round-3.md). The rounds retain the earlier proposals for context; this contract records the resulting direction.
