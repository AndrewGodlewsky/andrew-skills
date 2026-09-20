# GT skill architecture — accepted planning contract

**Historical decision record.** The proposals, observations and owner answers below are preserved as recorded. For current authoring requirements, examples, release checks and evidence placement, use [CONTRIBUTING.md](../../CONTRIBUTING.md). For implementation status, see the [authoring handoff](skill-authoring-implementation-handoff.md).

Accepted by the owner on September 17, 2026, following two Markdown review rounds and the skill-loading research. Decision: [Define the standard skill structure and invocation policy](https://github.com/AndrewGodlewsky/andrew-skills/issues/19). The issue's resolution is the canonical decision; this asset supplies the checklist and example for downstream work. This is not yet implemented validation or a completed contributor template.

## Required, optional and conditional content

| Requirement | Placement and rule | Verification |
| --- | --- | --- |
| Required: identity | `skills/<name>/SKILL.md`; explicit `name` matches the source folder, without plugin prefix or release suffix. | Structural check. Personal historical copies follow their separate naming contract. |
| Required: description | Explicit `description` explains the capability and when to use it, concisely. | Presence/type checks plus human review of meaning. |
| Required: invocation flags | Explicit `user-invocable: true` and `disable-model-invocation: true` by default. | Boolean/presence checks and review of exceptions. |
| Required: execution instructions | Nonempty body explains needed inputs, essential behavior and expected result; explain missing-input handling where needed. No fixed headings. | Nonempty-body check; human review and representative behavior evidence. |
| Required: release record | `release.yaml` contains the independently versioned release and short note under the already accepted publishing contract. Do not duplicate them in frontmatter. | Existing release-metadata implementation work. |
| Required: review evidence | Representative request and expected outcome demonstrate the intended behavior. Keep reviewer-only evidence outside the distributed folder by default. | Human review; canonical submission location remains for the process/blueprint decisions. |
| Optional: supporting content | Add `scripts/`, `references/`, `templates/` or `assets/` only when used. No empty scaffolding, mandatory extra README or third mandatory package file. | Relevant resource-path checks and human review. |
| Conditional: runtime resources | Bundle needed resources, link them relatively and state when to read them. Essential behavior must travel with the complete exported skill folder. | Path checks plus portability review. |
| Conditional: prerequisites and action boundaries | Explain required tools/services, consequential actions, necessary user choices, constraints and failure/cancellation behavior where relevant to the task. | Human review and appropriate behavior evidence; no universal boilerplate sections. |
| Conditional: attribution/license | Include applicable attribution/license material. License metadata is allowed when applicable. | Contribution review; exact intake responsibilities remain downstream. |
| Optional: argument hint | Allow `argument-hint` when it helps users supply inputs. | Field/type checks and client-support review where relevant. |
| Conditional: extensions | Any other header field requires a documented purpose and client-support review before joining GT's accepted field set. Catch misspelled/unreviewed keys. | Accepted-field validation design and review ownership remain downstream. |

## Invocation and extension policy

Manual invocation is GT's default. A reviewed model-invocable exception explicitly sets `disable-model-invocation: false`; keep it user-invocable unless a separately reviewed reason justifies hiding it. Record exception rationale in authoring review, not repetitive runtime prose. Do not publish an active skill configured with neither invocation route available.

Invocation eligibility, menu visibility and authorization to perform an action are separate. Header flags do not override user permissions or client security. Do not add tool-allowance metadata just to list prerequisites: fields such as `allowed-tools` can affect tool pre-approval. Do not borrow agent-specific model or tool configuration without a concrete consumer and review.

## Minimal instruction example

This illustrates the accepted instruction shape, not a new production skill or the final reusable template. Its package also needs the established `release.yaml` record.

```markdown
---
name: explain-design
description: Explain a proposed design and its tradeoffs. Use when reviewing a design.
user-invocable: true
disable-model-invocation: true
---

Read the supplied design and the user's goal. If either is missing, ask for it.
Explain the approach in plain language, identify the three most important
tradeoffs, and finish with a recommendation tied to the goal. Do not implement
the design as part of this skill.
```

A separate review record could say: “Given a design with two storage options, the response explains the approach, discusses three relevant tradeoffs, recommends an option and makes no implementation changes.” Include an example inside the skill only when it materially helps execution. Longer conditional guidance can live in a bundled reference with an explicit reading condition.

## Portability and context limits

- Keep required runtime instructions and resources self-contained in the complete skill folder. Repository-only review records must not become runtime dependencies.
- Explain external prerequisites and review dependencies on other skills, plugin paths or source names. A folder rename does not make arbitrary name-bound dependencies portable. Preserve the accepted historical-export eligibility limits.
- A heading is not a loading boundary. Discovery, parsing and model-request inclusion differ; optional resource contents require separate access, but no fixed token saving or prohibition on ordinary authorized file reads is promised.
- The research documents client-specific behavior and source paths, not a universal live compatibility pass. Qualified invocation syntax and actual client behavior still require the already deferred runtime verification. Installed-version reporting cannot certify instructions retained in an existing conversation.
- No hard token/line limit, mandatory workflow engine or mandatory instruction sections are adopted. Lean skills must still carry everything necessary to execute correctly.

Evidence: [technical explainer](../research/skill-context-loading.html), [source ledger](../research/skill-context-loading-evidence.md), and [architecture working notes](skill-architecture-notes.md). Documentation was checked September 16, 2026; owner acceptance does not turn source research into runtime test evidence.

## Downstream handoff

- [Define the process for proposing and accepting new skills](https://github.com/AndrewGodlewsky/andrew-skills/issues/20): decide intake, review roles, exception approval and where/how authors submit representative evidence. Use this architecture as a settled input.
- [Review the skill authoring blueprint and enforcement handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/21): review the reusable template and checklist, choose canonical authoring documentation/evidence locations, specify deterministic checks versus human review, and plan current-skill adoption and implementation slices.
- Reuse [Add per-skill release metadata and validation](https://github.com/AndrewGodlewsky/andrew-skills/issues/12) for the existing release contract; do not create a competing schema or silently expand its scope before the blueprint handoff.
- [Define installation ownership and update targeting across Copilot CLI and VS Code](https://github.com/AndrewGodlewsky/andrew-skills/issues/22) remains a separate open decision. The default recommendation is one installation to avoid accidental duplication; intentional separate copies remain permitted.

No production skill, validator, CI, installed plugin or publishing permission changes as part of this decision. Standards/template remain in scope; a dedicated skill-creator remains deferred.
