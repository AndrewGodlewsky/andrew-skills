# create-issue — caller and organization contract

Decision: [Define the shared issue-creation and organization contract](https://github.com/AndrewGodlewsky/andrew-skills/issues/28), based on the owner's answers in [Rounds 1–4](skill-submission-contract-notes.md).

**Status: owner-facing contract settled; implementation pending.** This document records the agreed behavior and assigns remaining technical questions. It is not a production skill, function schema or claim of live client compatibility.

**Final owner amendment during recovery design:** Default to new issues without extensive similarity searches. Use live GitHub state, with no persistent receipts/cache or hidden markers. New comments are allowed on any author's issue; title/body edits and organization changes are restricted to own-authored issues, and both ends of native relationships must be own-authored. Actionable follow-up on a closed issue requires a new open issue. The [recovery contract](skill-submission-recovery-contract.md) defines those operations and supersedes earlier proposals excluding all comments/edits.

## Purpose and invocation

`create-issue` is a shared capability for agents creating issues exclusively in **AndrewGodlewsky/andrew-skills**. It can support proposals, feedback, planning and other work concerning this repository. A valid request can originate in a different workspace. Unrelated work and attempts to choose another destination produce no issue anywhere.

Use `disable-model-invocation: false` and `user-invocable: false`. The reason for the exception to GT's manual default is that this is a dependency used by calling workflows, which manage the human conversation. It should not appear as a manual slash command; this does not mean it is secret or absent from all management views. Client behavior still needs acceptance testing.

Composition is an explicit handoff to the identified installed GT skill in the agent's conversation. It is not a separate agent or a universal function-call API. Missing information and results go to the calling agent, which decides whether human input is needed. Host permission prompts and user security instructions still apply.

## Content and authorization

The caller supplies the title and description/body, including its structure and all substantive content. The shared skill preserves that material. No mandatory headings, Summary/Details template, investigation, proposal-writing or automatic work decomposition belongs here.

**Prototype review clarification:** The owner expects callers to include the actual relevant context in the issue description, with substantially more detail for skill tweaks. Abbreviated examples illustrate transport, not a content-quality standard. The bare idea in prototype Example A was rejected. This does not create a mandatory template or move drafting/investigation into the shared skill. See the [prototype review outcome](skill-submission-prototype-notes.md).

Guide the caller when essential material is absent or ambiguous. Do not invent missing facts, silently rewrite understandable wording or expand into a human interview. Advise callers to use informative titles and identify an affected skill when known; advice does not authorize changing supplied text.

Existing workflow authorization is sufficient. Loading the skill or asserting a boolean is not evidence of permission. Return missing authorization to the caller rather than introducing a repeated approval gate when authorization already exists. Do not collect unrelated workspace files or fetch linked content automatically.

## Labels

**Scope settled after prototype acceptance:** Keep the three labels; defer native parent/child and blocker links. The [prototype review outcome](skill-submission-prototype-notes.md) supersedes earlier requirements to implement native relationships in the first version. Projects remain deferred.

| Label | Intended use |
| --- | --- |
| `new-skill` | Proposal to add a skill not currently in the collection. |
| `enhancement-skill` | Requested addition or improvement to an existing skill. |
| `inconsistent-skill` | Unexpected, confusing or inconsistent behavior in an existing skill; proof of nondeterminism is not required. |

Select a fitting primary skill label from supplied purpose/context. Return genuine ambiguity to the caller. For other repository work, use appropriate existing descriptive labels or explicit workflow labels; do not force a skill category onto every issue. Extra labels must add useful information. Do not infer priority, acceptance, difficulty, invalidity or duplicate status.

Keep the meanings and selection guidance in one bundled reference. Validate requested labels against the repository. Provision the three agreed labels once during implementation/setup; the runtime capability does not create arbitrary labels. No additional label category is currently justified. Missing labels are reported as incomplete organization, not silently invented or treated as applied.

## Issue relationships and intake

Prefer one issue per related problem. Preserve caller-supplied ordinary issue references. Native parent/child and blocker operations are deferred beyond the first version; do not implement them or infer them from body mentions. They remain distinct from ordinary references.

Do not split content or invent dependencies. If native relationships return in a later scope, both ends must be own-authored and all identity/permission checks still apply; deferral is not permission to relax those boundaries. Existing-issue operations in the first version are limited to explicit new comments, own-issue title/body edits and additive labels defined in the recovery contract, not general maintainer triage.

Start with labels and issue lists. Project integration is deferred beyond the initial implementation; no Project access is a prerequisite. Keep organization separate from content and preserve issue identities/results so a later approved Project integration can be added without a mandatory body migration. A future Project needs its own fixed, approved identity and permission design. No generic destination router or premature extension framework is needed.

The capability does not assign maintainers, accept work, set priorities, close duplicates or begin implementation. Those remain maintainer/workflow decisions.

## Delivery and setup

The accepted initial direction is a small bundled fixed-destination helper with Node.js and existing authenticated GitHub CLI in the actual execution environment. It should not require a checkout of this repository. Windows installation or authentication is not proof of WSL readiness. Exact supported versions and metadata endpoints require the remaining research and acceptance work.

The helper accepts no repository/host override, verifies the intended target, and checks results. A restriction enforced by this helper is not a sandbox around every other tool available to the agent. Preserve scope and existing authorization in both the instructions and the technical path.

The owner also requested troubleshooting alternatives. At minimum, preserve the prepared title/body and intended organization, identify the missing prerequisite, and return useful setup guidance to the caller. A manual handoff to the fixed repository is a possible troubleshooting route, clearly marked **not submitted**; it is not automatic success. Investigate any automated alternative before accepting it. It must preserve destination binding, identity and permissions. Never switch tools/accounts/environments after a denial to evade a control, install prerequisites silently or copy credentials.

## Caller results

Return a concise outcome, available evidence and the next useful action. The following meanings are contract requirements; the exact wire representation and recovery algorithm remain for the reliability decision.

| Situation | What the caller receives |
| --- | --- |
| Created and verified | Verified issue identity/link plus applied organization. |
| Created, some organization incomplete | The same created issue link plus precise missing labels/relationships and required follow-up. Never recreate it to repair metadata. |
| Known existing issue selected | Verified issue link and the caller's reason for reuse. Make clear whether any new content was saved; routine submission defaults to a new issue. |
| Missing content, authorization or capability | Specific unmet need and the prepared material; no claim of creation. |
| Cancelled or confirmed rejected | Known outcome and preserved material. Cancellation after a request was sent does not prove no issue exists. |
| Creation or verification uncertain | Known response/identity evidence, what remains unknown, and reconciliation needed. No blind resubmission or fabricated URL. |

Creation is allowed when known capability limits prevent some organization and creation itself is available and authorized. Report incomplete organization clearly. If an actual security/permission denial occurs, follow the applicable stop rules and report any issue already created. Preserve evidence of a successful creation even if readback or a later step fails.

Preserve Markdown, code and Unicode. Numeric input/response limits must be documented and tested during implementation; reject oversize input without silent truncation. Do not invent a portable GitHub size limit that the research did not establish.

## Illustrative handoffs

These are examples, not live submissions or prescribed body templates.

- A creator workflow supplies a title and its own complete Markdown draft. `create-issue` preserves both, selects `new-skill`, and reports the verified issue plus label outcome.
- A troubleshooting workflow supplies an observation and identifies the existing skill. The shared capability can use `inconsistent-skill` without asking the human to prove a bug or drafting a diagnosis.
- A planning workflow supplies a research issue with `wayfinder:research` and an explicitly identified parent in this repository. The capability creates and links it if supported; if linkage is unavailable, it returns the created issue and missing relationship separately.

## Remaining work and closure boundary

The [organization research](../research/skill-submission-organization-results.md) is now complete. It recommends separate additive organization and readback, distinguishes ordinary submitters from maintainers, and specifies a prepared manual handoff for missing tools. Its local read-only evidence is not production acceptance; the follow-up tasks below retain their implementation and recovery responsibilities.

| Work | Existing owner |
| --- | --- |
| Metadata permissions/endpoints and safe missing-prerequisite alternatives | [Verify labels, projects and issue relationships for shared issue creation](https://github.com/AndrewGodlewsky/andrew-skills/issues/32) |
| Settled reuse/update policy and uncertain-result recovery; implementation still pending | [Define duplicate prevention and uncertain submission recovery](https://github.com/AndrewGodlewsky/andrew-skills/issues/29) |
| Owner review of concrete caller interactions | [Prototype submissions from creator, update and feedback skills](https://github.com/AndrewGodlewsky/andrew-skills/issues/30) |
| Package, label provisioning, version requirements, bounded inputs and actual Windows/WSL acceptance | [Define submission-skill acceptance and implementation handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/31) |

This resolves the caller-facing contract. Research can still expose a limitation requiring a focused revision; it must not silently drop an accepted requirement or claim unobserved compatibility. No production implementation, label/project creation, commit, push or publication is authorized by this planning artifact itself.
