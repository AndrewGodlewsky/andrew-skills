# Skill architecture — working notes

**Historical decision record.** The proposals, observations and owner answers below are preserved as recorded. For current authoring requirements, examples, release checks and evidence placement, use [CONTRIBUTING.md](../../CONTRIBUTING.md). For implementation status, see the [authoring handoff](skill-authoring-implementation-handoff.md).

Issue: [Define the standard skill structure and invocation policy](https://github.com/AndrewGodlewsky/andrew-skills/issues/19).

**Status: architecture confirmed September 17, 2026.** The owner confirmed the compact runtime/review-evidence split, four explicit header fields and reviewed-extension policy after the research discussion. See the [accepted contract and checklist](skill-architecture-contract.md). Original answers are preserved. Standards/template are in scope; a dedicated creator skill is deferred. This decision does not implement enforcement.

## Skill-loading research — September 16, 2026

Read the [technical HTML explainer](../research/skill-context-loading.html) and [subagent evidence memo](../research/skill-context-loading-evidence.md). Research combines primary documentation, pinned VS Code source inspection and a narrowly scoped earlier CLI marker capture. No new live client test was run.

- Discovery reads and internal metadata are distinct from text submitted to a model.
- The inspected VS Code automatic catalog excludes manual-only skills. This does not establish identical CLI filtering or prevent ordinary authorized file reads.
- Its inline skill-tool route inserts full `SKILL.md`, including YAML, plus bounded related filenames; another attachment renderer strips frontmatter. Header visibility depends on the route.
- Markdown headings do not create deferred loading. Optional resources require separate access for their contents; execution output and script source are different context surfaces.
- Custom fields need a concrete consumer. `release.yaml` remains GT's release contract, not a native automatic-loading channel. Installed-version reporting cannot certify the instructions retained in a running conversation.

These findings informed the proposal; the owner's subsequent September 17 confirmation supplied the policy decision. Research alone is not approval or a live compatibility pass. Downstream enforcement remains unimplemented.

The owner's CLI follow-up is covered in [expanded section 4](../research/skill-context-loading.html#cli-installation): installing under `.copilot` and choosing a runtime harness are separate decisions. VS Code's Local and Copilot SDK-backed session targets must not be conflated. The report now explains the header fields and tool pre-approval in detail. Qualified invocation syntax remains a client/version verification question; documentation alone does not supersede the prior fixture's limitations or authorize changing the published usage contract.

## Local evidence

- [Contribution guide](../../CONTRIBUTING.md): source skills under `skills/<name>`, matching name/frontmatter, descriptions, self-contained relative resources, review and a basic smoke check. It does not define a complete universal instruction layout.
- Both current source skills, [grill-me](../../skills/grill-me/SKILL.md) and [skills-update](../../skills/skills-update/SKILL.md), explicitly disable model invocation and omit `user-invocable`. The accepted explicit-field policy is not yet applied to them; adoption belongs to the blueprint handoff.
- [Validator](../../scripts/validate.mjs) checks names, description length, nonempty bodies, supported simple header values, duplicate fields, boolean types for the two invocation flags and certain inline links. It does not enforce an allowlist of skill header keys, required flags, body headings, semantic quality or per-skill releases today.
- [Release contract](skill-publishing-notes.md) already selects version/notes in `release.yaml`; implementation belongs to the existing metadata/catalog work. Do not duplicate it in frontmatter.
- [Export contract](skill-personal-export-contract.md) already requires complete self-contained resources and limits name-bound/plugin-dependent exports. Instructions must not claim that a folder rename makes arbitrary dependencies portable.

## Primary documentation checked 2026-09-16

The following are documented capabilities, not new runtime verification.

| Source | Relevant evidence |
| --- | --- |
| [VS Code skill format](https://code.visualstudio.com/docs/agent-customization/agent-skills#skillmd-file-format) | Requires name/description, documents optional invocation flags and argument hints; names match folders without plugin prefixes. `context: fork` is experimental. Visibility and automatic selection are separate controls. |
| [CLI skill fields](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skill-frontmatter-fields) | Requires name/description; lists both invocation flags, argument hints and `allowed-tools`. Documents automatic tool allowance for the latter, so it must not be treated as a harmless prerequisite list. |
| [CLI authoring guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) | Describes `SKILL.md` plus optional referenced resources and an optional license field. This brief guide is not the complete field reference. |

Both field references document `user-invocable` defaulting true and `disable-model-invocation` defaulting false. They do not make GT's default a product decision for us. Client fields beyond the shared set need specific review; absence from one document is not proof of rejection by that client. Existing live-test deferral remains in effect.

Invocation eligibility, user-menu visibility and authorization to perform an action are distinct. Do not promise that a header setting alone overrides tool approvals, user instructions or client security behavior. Do not borrow custom-agent model/tool configuration and present it as portable skill metadata.

## Accepted Round 1 direction

1. Manual invocation by default, with deliberate model-invocation exceptions. Round 2 made the explicit-field policy concrete; the owner confirmed it September 17.
2. Lean, focused instruction packages rather than large workflows by default. The owner wants an objectively consistent minimum while limiting loaded context. Round 2's accepted split keeps execution essentials inside the skill and review-only evidence outside by default.
3. The minimum package and optional supporting structure were accepted. Interpret optionality in context as supporting files/folders, not removal of the established SKILL.md/release.yaml requirements. No empty scaffolding or mandatory extra README.

No production enforcement or current-skill migration has occurred. There is no accepted hard token/line limit, mandatory workflow engine, or requirement to split every multi-step skill.

## Accepted Round 2 decisions and downstream boundaries

- Separate compact execution instructions from authoring evidence. Purpose/trigger is in the description; inputs/behavior/output are in the body; long runtime guidance is conditionally referenced inside the skill. Review-only examples default outside the distributed folder. They are not runtime dependencies and do not need to be exported.
- Four explicit core header fields; optional hints/license information and reviewed extensions. Document exception rationale in review, not repetitive runtime prose. Model-only visibility exceptions require separate review; no published active configuration with neither invocation route.
- Structural validation is objective, but content quality/completeness requires human review. No automatic rule based merely on the presence of headings can prove meaningful coverage.
- The process/blueprint issues will choose the canonical evidence location, review ownership, enforcement implementation and current-skill adoption. Do not decide those locations prematurely in this architecture interview.

The owner confirmed these decisions after discussing the requested research. [VS Code's documented loading stages](https://code.visualstudio.com/docs/agent-customization/agent-skills#how-copilot-uses-skills) support separating descriptions, body and on-demand resources; no claim is made of zero context cost or exact token savings. Required runtime constraints still travel with the skill. The repository-only evidence placement is an accepted GT design choice, not a client requirement.

## Handoff boundaries

The next process issue owns intake, contribution review and publication responsibilities. The blueprint issue owns the final reusable template, canonical documentation and implementation slices. This issue resolves the architecture contract with the owner; it does not implement CI or rewrite production skills.

The current glossary remains unchanged until a new GT-specific term actually needs resolution. The interview explains invocation choices directly instead of prematurely treating a proposed default as established domain language.
