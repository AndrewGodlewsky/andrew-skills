# Skill architecture and contribution process — scope assessment

**Historical decision record.** The proposals, observations and owner answers below are preserved as recorded. For current authoring requirements, examples, release checks and evidence placement, use [CONTRIBUTING.md](../../CONTRIBUTING.md). For implementation status, see the [authoring handoff](skill-authoring-implementation-handoff.md).

**Status: all decisions in this planning map accepted by September 20, 2026; implementation pending.** The owner confirmed the [minimal architecture contract](skill-architecture-contract.md), [simple contribution flow](skill-contribution-contract.md), [authoring blueprint](skill-authoring-blueprint-prototype.md) and [installation-targeting flow](skill-installation-targeting-handoff.md). The [authoring implementation handoff](skill-authoring-implementation-handoff.md) tracks canonical guidance and architecture enforcement/adoption; existing update/status/pilot issues own targeting integration. GitHub approval rules remain owner-managed, and no intake classification/routing logic is requested. The coverage table below records original gaps, not questions to reopen. The owner explicitly chose **standards and template now; creator skill later**. Existing versioning decisions remain in force.

## Coverage and gaps

| Need | Current coverage | Remaining decision |
| --- | --- | --- |
| Skill identity and location | `CONTRIBUTING.md` uses `skills/<name>/SKILL.md`, matching lowercase names, descriptions and bundled relative resources. | Which conventions are mandatory, optional or conditional across all future skills? |
| Invocation behavior | Current two skills set `disable-model-invocation: true`. The validator checks boolean types for it and `user-invocable` when present. | Should authors explicitly declare invocation policy? What defaults/exceptions and client support apply? Current usage is not a policy for every future skill. |
| Versions and notes | The accepted publishing contract and metadata implementation issue already define `release.yaml`, release steps and CI. | Reference this existing contract rather than invent another version field or publishing process. |
| Instruction architecture | Current contribution guide asks for procedure, expected outputs and examples. | Define a useful minimum for purpose/triggers, inputs, steps, outputs, prerequisites, failures and examples without forcing needless boilerplate. |
| Resource/dependency architecture | Existing self-contained-folder and historical-export contracts set portability boundaries. | Standardize where optional resources/scripts/references live and how prerequisites or unsupported dependencies are declared/reviewed. |
| Adding or importing skills | Existing guide covers creation, README listing, validation, a fresh-chat smoke check, review and attribution. | Define proposal/intake, duplication checks, quality evidence, reviewer responsibilities, approval and handoff to owner-controlled publication. Decide import scope and exceptions. |
| Automated versus human checks | Existing validator checks basic structure, names, descriptions, optional boolean flags and inline relative resource links. | Decide which new rules block CI, which need human review and how existing skills adopt the standard. Unknown frontmatter keys are not currently rejected as a skill-field allowlist. |
| Reusable authoring instructions | Contributor guide provides a small header example. | Review a representative starter template/checklist and a canonical reference path usable by future agents, without a competing schema. |

Current baseline comes from [CONTRIBUTING](../../CONTRIBUTING.md), [validator](../../scripts/validate.mjs), and the two current source skills. These observations do not establish official client support for every metadata field; that must be checked against primary client documentation when the architecture decision is worked.

## Existing work to reuse

- [Add per-skill release metadata and validation](https://github.com/AndrewGodlewsky/andrew-skills/issues/12): release metadata and stable CI. Its scope does not yet promise a complete authoring standard or intake policy.
- [Build the skill release catalog from published Git history](https://github.com/AndrewGodlewsky/andrew-skills/issues/13): published history, not skill-authoring structure.
- [Implement create-only historical skill export and recovery](https://github.com/AndrewGodlewsky/andrew-skills/issues/14): portability constraints future source skills must respect.
- [Complete the owner pilot and team adoption readiness checks](https://github.com/AndrewGodlewsky/andrew-skills/issues/17): rollout documentation and runtime evidence, not the undecided architecture/intake standard.

The earlier versioning map remains complete for its destination. This is an additional authoring-design effort. Do not reopen version semantics, personal-copy tracking or native update choices just to define a template.

## Planning issues

Map: [Standardize skill architecture and the contribution process](https://github.com/AndrewGodlewsky/andrew-skills/issues/18).

1. [Define the standard skill structure and invocation policy](https://github.com/AndrewGodlewsky/andrew-skills/issues/19) — owner-confirmed architecture; see the accepted contract above.
2. [Define the process for proposing and accepting new skills](https://github.com/AndrewGodlewsky/andrew-skills/issues/20) — settled simple submission/maintainer flow; see the contribution contract. Existing content/evidence requirements carry forward without new governance or classification rules.
3. [Review the skill authoring blueprint and enforcement handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/21) — owner accepted the concrete examples, canonical guide, validation boundary and adoption handoff. The new execution issues are linked in the handoff above.

A dedicated skill-creator is distinct from a template that a future creator can read. The owner explicitly left that additional feature for later. The reviewed blueprint now supplies two implementation slices for guidance and enforcement/adoption. Both are prerequisites of complete rollout; the existing metadata work remains free to proceed with coordinated edits and no duplicate schema/job.

## Follow-up: installation ownership and update targeting

During the architecture review, the owner raised the experience of teammates using CLI and VS Code, possibly with separate installations. [Define installation ownership and update targeting across Copilot CLI and VS Code](https://github.com/AndrewGodlewsky/andrew-skills/issues/22) is now accepted; see the targeting handoff above. It supplies the existing update, status and pilot implementation issues. The following paragraph preserves the original motivation; its open design questions are resolved by that handoff.

The existing implementation issue already requires respecting the actual target, but the identification and ambiguity flow were not specified. The owner clarified the intent: recommend one managed hub installation per user environment and present CLI/VS Code installation as alternatives so ordinary onboarding does not accidentally create two copies. This is guidance, not an enforced single-installation restriction. Experienced users may deliberately keep independent copies; their presence alone must not trigger forced cleanup, migration, or refusal. Shared discovery of a CLI-managed copy is still one installation. Reliable ownership detection, ambiguity handling, supported native actions and user-performed VS Code update reporting remain to be designed. Do not update every discovered copy by default; intentional duplication does not itself require a new bulk-management feature. The resolution must also inform status and pilot work. The original versioning map remains closed; native whole-plugin updates and personal export semantics remain accepted inputs, including separate Windows/WSL environments and optional personal historical copies outside the hub.

No production skill, validator, CI policy or publishing permission changes in this charting step. Future question rounds retain the owner's Markdown format with explanations and answer spaces.
