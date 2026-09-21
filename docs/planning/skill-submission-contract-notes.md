# Shared issue creation — working decisions

Decision issue: [Define the shared issue-creation and organization contract](https://github.com/AndrewGodlewsky/andrew-skills/issues/28). Owner discussion is complete; see the [consolidated contract](skill-submission-contract.md). Capability research, recovery design, prototype review and implementation remain separate work.

## Confirmed owner direction

- The sole issue destination is AndrewGodlewsky/andrew-skills. Valid repository work can originate from another workspace; unrelated work must not produce an issue anywhere.
- Many future skills will call this capability. They supply the title, description/body and its structure. The shared skill must not create missing substantive content or impose a body template.
- Its normal interaction is with the calling agent. It guides that agent through missing inputs or issue-creation requirements; the calling agent decides whether to involve the human. This does not establish a separate agent process or override host permission prompts.
- Model invocation is required. Existing workflow authorization is sufficient; ask only when missing, and respect the active user's tool/security restrictions.
- The shared skill should physically create issues and apply agreed repository organization itself when authorized, rather than making every caller implement those operations.
- Issues should have understandable titles, descriptions and identifying labels so the owner or another agent can review them efficiently. The accepted labels are `new-skill`, `enhancement-skill` and `inconsistent-skill`, with the meanings and non-skill fallback conventions proposed in Round 4. These labels have not been created; provision them in the implementation/setup work, not at runtime.
- Prefer one issue per related problem. Allow links and sub-issues when needed; do not interpret this as acceptance of automatic problem decomposition or a particular batch interface.
- Incomplete organization need not prevent issue creation. Return the created issue and clearly identify missing organization; preserve applicable security stops. Detailed retry semantics remain separate.
- The name is `create-issue`, with model invocation enabled and manual slash-command visibility disabled: `disable-model-invocation: false`, `user-invocable: false`.
- Start with labels and issue lists. Project integration is deferred; keep it possible to add later without changing callers' issue content or the fixed issue destination. No project destination, setup or integration was selected.
- Node.js and existing authenticated GitHub CLI are accepted prerequisites for the initial fixed-destination helper path, subject to metadata capability research. The owner wants troubleshooting alternatives when they are absent. Investigate safe alternatives without assuming an automated fallback or bypassing denial; preserve the caller's material for a manual handoff.
- The owner welcomes proposals for useful additional behavior while keeping the capability flexible.
- Review rounds may contain multiple related questions. This owner preference overrides the Grilling skill's one-question default for this discussion.

## Review record

- [Round 1](skill-submission-contract-round-1.md): the owner rejected the mandatory Summary/Details proposal and clarified the issue-creation/organization focus.
- [Round 2](skill-submission-contract-round-2.md): the owner chose direct application of agreed organization and invited further recommendations.
- [Round 3](skill-submission-contract-round-3.md): caller-agent interaction, proposed skill labels, one issue per problem, links/sub-issues, accepted incomplete organization, preferred singular name and openness to model-only invocation.
- [Round 4](skill-submission-contract-round-4.md): accepted label meanings/fallbacks, labels-first intake, model-only `create-issue` and initial prerequisites; requested future extensibility and troubleshooting alternatives.

## Delegated follow-up

The [settled recovery contract](skill-submission-recovery-contract.md) records the final amendment: default to new issues, with no extensive similarity search or persistent local tracking. Comments may be added to any author's issue; title/body and organization edits require own-authorship, as do both ends of native relationships. Actionable closed-issue follow-up must create a new open issue. The caller supplies all content, and uncertain writes are reconciled without blind replay. This amends the earlier blanket exclusion of content updates without authorizing a general maintainer workflow.

The [organization research](../research/skill-submission-organization-results.md) resolves documented metadata operations and permission limits: ordinary contributors may create issues without organization rights; use separate additive steps and per-step verification. Missing-prerequisite support is actionable guidance and a prepared manual handoff, not an automatic general-tool fallback. Detailed duplicate/retry semantics remain in the recovery ticket. Exact executable inputs, numeric content limits, supported runtime versions and observed client behavior belong to implementation acceptance. One issue per problem is settled; a particular batch/function API is not promised. None of those remaining checks is a runtime pass supplied by this planning decision.

Prior invocation and transport research retains its evidence limits. The fixed-destination helper is the accepted initial direction with Node.js/gh prerequisites; documented metadata capabilities are researched, while actual implementation behavior remains to be verified. No metadata operation has been proven for ordinary contributors by these review rounds.
