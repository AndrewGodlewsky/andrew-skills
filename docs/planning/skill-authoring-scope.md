# Skill architecture and contribution process — scope assessment

**Status: new Wayfinder map charted; no skill standard adopted yet.** The owner requested a well-defined process for adding skills and a standard architecture usable by people and future skill-authoring agents. They explicitly chose **standards and template now; creator skill later**. Existing versioning decisions remain in force.

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

1. [Define the standard skill structure and invocation policy](https://github.com/AndrewGodlewsky/andrew-skills/issues/19) — first available planning issue; grounded in supported client metadata and existing release/export decisions.
2. [Define the process for proposing and accepting new skills](https://github.com/AndrewGodlewsky/andrew-skills/issues/20) — ownership, evidence and acceptance; blocked by the architecture decision.
3. [Review the skill authoring blueprint and enforcement handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/21) — starter template/checklist, canonical documentation, validator versus human review, current-skill adoption and implementation handoff; blocked by both decisions.

A dedicated skill-creator is distinct from a template that a future creator can read. The owner explicitly left that additional feature for later. Final automated enforcement, current-skill migration and implementation slices follow the decisions above; no duplicate implementation issues are created before those decisions exist. Existing metadata and pilot issues now link this effort without imposing new blocking rules on settled versioning work.

No production skill, validator, CI policy or publishing permission changes in this charting step. Future question rounds retain the owner's Markdown format with explanations and answer spaces.
