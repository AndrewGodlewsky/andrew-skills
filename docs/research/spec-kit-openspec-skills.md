# Spec Kit and OpenSpec: how their skills work

Researched October 3, 2026 from fresh shallow clones of the official repositories. This is a **default-branch source inspection, not a stable-release audit**. No CLI packages were installed and no inspected skills were executed.

| Snapshot | Exact commit | Commit time | Version in checkout |
|---|---|---|---|
| GitHub Spec Kit | `ae5ade7234be5cb1d975f736c4e06dd46d1326d6` | 2026-10-03 11:48:19 −05:00 | `1.1.1.dev0` |
| Fission AI OpenSpec | `2500d6da971336167548b53731a35b2127df35ac` | 2026-10-02 17:34:46 UTC | `1.14.0` |

Version sources: [Spec Kit pyproject.toml](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/pyproject.toml), [OpenSpec package.json](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/package.json). A manifest version alone does not prove that every inspected change is in a published release.

## Main finding

Both projects deliver **agent-readable Markdown workflows backed by a CLI**, and both generate skills from another authoritative source. Reading only files literally named `SKILL.md` gives a misleading picture of Spec Kit.

Spec Kit emphasizes a project constitution and a feature lifecycle: **specify → plan → tasks → implement → converge**. OpenSpec emphasizes a named change proposal, a schema-defined artifact dependency graph, implementation, and merging the resulting requirement deltas into durable specs. These are workflow systems, not merely collections of reusable prompts. [Spec Kit overview](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/README.md), [OpenSpec schema](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/schemas/spec-driven/schema.yaml), [OpenSpec propose skill](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-propose/SKILL.md).

## Spec Kit

### Ten core skills

The authoritative bodies are the ten files in `templates/commands/`. In skills mode, their names become `speckit-<command>` and they are emitted as individual `SKILL.md` files. Each row links directly to its source.

| Generated skill | Purpose |
|---|---|
| [speckit-constitution](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/constitution.md) | Create or update the project's governing principles. |
| [speckit-specify](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/specify.md) | Turn a natural-language feature request into a specification. |
| [speckit-clarify](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/clarify.md) | Ask up to five targeted questions and record answers in the spec. |
| [speckit-plan](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/plan.md) | Produce the technical plan and supporting design artifacts. |
| [speckit-tasks](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/tasks.md) | Produce dependency-ordered implementation tasks. |
| [speckit-analyze](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/analyze.md) | Read-only consistency and quality analysis across spec, plan, and tasks. |
| [speckit-checklist](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/checklist.md) | Check requirements' clarity/completeness: “unit tests for English,” not application tests. |
| [speckit-implement](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/implement.md) | Execute the task list. |
| [speckit-converge](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/converge.md) | Compare code against intended behavior; append missing work to tasks without editing application code. |
| [speckit-taskstoissues](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/taskstoissues.md) | Convert tasks into dependency-ordered GitHub issues, checking existing issues for duplicates. |

The main loop is constitution once per project, then specify → plan → tasks → implement → converge per feature; implement/converge repeats until no actionable gaps remain. Clarification, checklists, and analysis are additional gates. [README](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/README.md).

Artifacts include `.specify/memory/constitution.md` and, by default, `specs/<feature-directory>/spec.md`, `plan.md`, and `tasks.md`. Planning also produces `research.md`, `data-model.md`, `contracts/` where relevant, and `quickstart.md`. [Constitution](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/constitution.md), [specify](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/specify.md), [plan](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/plan.md).

### Bundled extension skills

Five extension packages are included in the Python wheel. Their command templates can also be delivered as skills; dotted command IDs are translated into hyphenated skill names. They are separate from the ten core templates. [Package assets](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/pyproject.toml), [skills integration](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/src/specify_cli/integrations/base.py).

| Package | Skill names in skills mode | Purpose |
|---|---|---|
| [bug](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/extensions/bug/extension.yml) | `speckit-bug-assess`, `speckit-bug-fix`, `speckit-bug-test` | Diagnose, apply the assessed repair, then record verification in `.specify/bugs/<slug>/`. |
| [assess](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/extensions/assess/extension.yml) | `speckit-assess-intake`, `speckit-assess-research`, `speckit-assess-define`, `speckit-assess-shape`, `speckit-assess-decide` | Capture the idea, gather evidence, define the problem, shape options, then decide go/clarify/kill; artifacts live in `.specify/assessments/<slug>/`. |
| [git](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/extensions/git/extension.yml) | `speckit-git-feature`, `speckit-git-validate`, `speckit-git-remote`, `speckit-git-initialize`, `speckit-git-commit` | Branch creation, naming checks, remote discovery, repository initialization, and commits. |
| [agent-context](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/extensions/agent-context/extension.yml) | `speckit-agent-context-update` | Refresh the managed Spec Kit section in agent context files. |
| [github](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/extensions/github/extension.yml) | `speckit-github-taskstoissues` | Turn task lists into GitHub issues through the extension system. |

The tree also contains a [self-test extension](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/extensions/selftest/extension.yml) with `speckit.selftest.extension`, plus an [extension authoring example](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/extensions/template/extension.yml). These are not among the five wheel-bundled packages above. Third-party catalog listings are discovery metadata, not additional first-party shipped skills; their implementations were not audited. [Extension catalogs](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/extensions/README.md).

### Generation and discovery

`SkillsIntegration.setup()` reads the shared templates, transforms placeholders and invocation syntax for the selected agent/platform, rebuilds frontmatter, and writes `speckit-<name>/SKILL.md`. Generated metadata records the originating template; compatibility declares the required `.specify/` project structure. The templates carry descriptions, scripts, and sometimes handoffs. [Generator](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/src/specify_cli/integrations/base.py).

For Codex, the destination is `.agents/skills/speckit-<name>/SKILL.md`; skills are the default format. Other integrations may use different formats or invocation syntax. The files in `templates/commands/` are therefore authoring inputs, not ready-to-copy installed skills: they contain substitutions such as `{SCRIPT}`. [Codex integration](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/src/specify_cli/integrations/codex/__init__.py), [example template](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/plan.md).

### Repository-only maintainer skills

The checkout contains two literal skill files under `.github/skills/`, distinct from the generated product workflows:

- [code-review](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/.github/skills/code-review/SKILL.md): checks positive/negative test coverage, regression evidence, and repository terminology.
- [add-community-extension](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/.github/skills/add-community-extension/SKILL.md): processes extension submission issues and updates catalog/docs.

## OpenSpec

### Twelve distributed workflow skills

OpenSpec checks generated, readable copies into `skills/openspec-*/SKILL.md`. Six workflows are in the default **core** profile; the remaining six are available through a custom profile. The inventory and default selection come from executable source, not just documentation. [Profile definitions](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/src/core/profiles.ts), [generation registry](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/src/core/shared/skill-generation.ts).

| Skill | Default? | Purpose |
|---|---|---|
| [openspec-explore](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-explore/SKILL.md) | Yes | Investigate and discuss an idea without starting implementation. |
| [openspec-propose](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-propose/SKILL.md) | Yes | Create a change proposal and all its planning artifacts in dependency order. |
| [openspec-apply-change](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-apply-change/SKILL.md) | Yes | Implement tasks and check off completed entries. |
| [openspec-update-change](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-update-change/SKILL.md) | Yes | Revise existing planning artifacts coherently, confirming proposed edits. |
| [openspec-sync-specs](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-sync-specs/SKILL.md) | Yes | Merge spec deltas into durable specs while leaving the change active. |
| [openspec-archive-change](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-archive-change/SKILL.md) | Yes | Finish a change, handle outstanding spec sync, and archive it. |
| [openspec-new-change](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-new-change/SKILL.md) | No | Create an empty change scaffold and show the first artifact's instructions. |
| [openspec-continue-change](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-continue-change/SKILL.md) | No | Create one next-ready artifact per invocation. |
| [openspec-ff-change](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-ff-change/SKILL.md) | No | Create a change and fast-forward through implementation prerequisites. |
| [openspec-verify-change](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-verify-change/SKILL.md) | No | Report completeness, correctness, and coherence against artifacts; no edits. |
| [openspec-bulk-archive-change](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-bulk-archive-change/SKILL.md) | No | Review and archive multiple changes, resolving overlapping spec deltas. |
| [openspec-onboard](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-onboard/SKILL.md) | No | Guide a user through a real change, from exploration through implementation and archive. |

A `feedback` skill template is exported by the source facade, but is **absent from the normal skill-generation registry and the twelve-file distribution**. It should not be counted as an installed thirteenth workflow. [Feedback template](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/src/core/templates/workflows/feedback.ts), [registry](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/src/core/shared/skill-generation.ts).

### How the workflow works

The skills call the CLI for structured state: `openspec status --change ... --json` provides artifact readiness/dependencies; `openspec instructions <artifact-id> --change ... --json` supplies the next artifact's instructions and paths. The agent writes the content. The CLI/schema owns sequencing and location, reducing hardcoded workflow assumptions inside the skill. [Propose](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-propose/SKILL.md).

The default `spec-driven` schema defines proposal, specs, design, and tasks. In the ordinary local layout these live under `openspec/changes/<name>/`; durable specs live under `openspec/specs/<capability-path>/spec.md`, and completed work moves under `openspec/changes/archive/`. Delta specs distinguish added, modified, removed, and renamed requirements. Current skills also support separately registered planning stores, so returned paths take precedence over assumptions about the working repository. [Schema](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/schemas/spec-driven/schema.yaml), [sync](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-sync-specs/SKILL.md), [archive](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-archive-change/SKILL.md), [propose](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-propose/SKILL.md).

### Generation and discovery

Authoritative skill bodies are TypeScript template functions in `src/core/templates/workflows/`. A shared registry generates both skills and command content. Frontmatter includes name, description, allowed tools, compatibility, license, and metadata. Profile-aware generation resolves optional handoffs so a generated skill does not refer to an omitted workflow. Custom profiles including archive or bulk-archive automatically include sync. [Generator](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/src/core/shared/skill-generation.ts), [profiles](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/src/core/profiles.ts).

`openspec init` writes skills for the selected tools; Codex's current destination is `.agents/skills/`, with `.codex` recorded as a legacy location. The separate `skills/` tree supports `npx skills add Fission-AI/OpenSpec`; these skills still depend on the OpenSpec CLI and project setup. Its generated copies omit volatile release-version metadata, and parity tests compare their content with the templates. [Tool config](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/src/core/config.ts), [distribution README](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/README.md), [normalization](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/scripts/skillssh-shared.mjs), [parity test](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/test/core/templates/skillssh-parity.test.ts).

### Repository-only maintainer skills

Four additional skills live under `.agents/skills/`; they are separate from the twelve distributed workflows:

- [write-openspec-docs](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/.agents/skills/write-openspec-docs/SKILL.md): apply the documentation house style.
- [draft-openspec-docs](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/.agents/skills/draft-openspec-docs/SKILL.md): collaborate on a page plan and draft approved sections.
- [verify-openspec-docs](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/.agents/skills/verify-openspec-docs/SKILL.md): fact-check documentation using a fresh-context subagent.
- [release-openspec](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/.agents/skills/release-openspec/SKILL.md): resumable release preparation, publication verification, and release notes.

The documentation-writing skills also reference a `no-ai-slop` skill, but this checkout contains no corresponding `SKILL.md`. Its implementation and provenance were not verified. This is a referenced dependency, not a fifth checked-in maintainer skill. [Writing skill](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/.agents/skills/write-openspec-docs/SKILL.md), [drafting skill](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/.agents/skills/draft-openspec-docs/SKILL.md).

## Patterns worth considering for GT

These are design observations, not implementation proposals or changes to GT.

1. **Give each skill an explicit artifact contract.** Spec Kit's converge skill can append tasks but cannot rewrite the spec or implement fixes; OpenSpec separates update, apply, verify, sync, and archive. This makes scope and completion inspectable. [Converge](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/converge.md), [OpenSpec skill reference](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/docs-lab/reference/skills.md).
2. **Keep one authored source when supporting multiple clients.** Both generate client-specific skills from shared workflow sources. OpenSpec additionally tests distributed-file parity. That pattern could reduce duplicated instructions, but brings generator and validation maintenance costs. [Spec Kit generator](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/src/specify_cli/integrations/base.py), [OpenSpec parity test](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/test/core/templates/skillssh-parity.test.ts).
3. **Treat handoff dependencies as real configuration.** OpenSpec selects installed workflow references during generation and closes the archive → sync dependency. That is stronger than merely documenting a related skill's name. [Generation](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/src/core/shared/skill-generation.ts), [profiles](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/src/core/profiles.ts).
4. **Keep state in durable artifacts and query it structurally.** OpenSpec skills consume CLI JSON rather than relying only on conversation memory. Spec Kit uses prerequisite scripts and persistent spec/plan/task files. [Propose](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-propose/SKILL.md), [implement](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands/implement.md).
5. **Separate accidental discovery from explicit adoption.** OpenSpec's generated skills check whether a project is initialized. An automatically selected skill silently falls back to ordinary work when there is no root; an explicit OpenSpec request asks how to proceed before creating one. This is a useful guard against a broad skill trigger taking over unrelated work. [Propose project check](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/skills/openspec-propose/SKILL.md).
6. **Separate product workflows from maintainer automation.** Both repositories keep internal review/docs/release skills apart from their user-facing workflow generation. Their inventories should be evaluated separately when borrowing ideas.

## Local reading locations

Both checkouts are under:

`C:\Users\godle\.codex\visualizations\2026\10\03\01a102e2-a183-7703-ba8c-3e9a170e91ca\sources\`

- Spec Kit: `spec-kit\templates\commands\`, especially `converge.md`, `plan.md`, and `checklist.md`; then `spec-kit\extensions\`.
- OpenSpec: `OpenSpec\skills\` for generated readable skills; `OpenSpec\src\core\templates\workflows\` for their source; `OpenSpec\schemas\spec-driven\schema.yaml` for artifact sequencing.
- Internal skills: `spec-kit\.github\skills\` and `OpenSpec\.agents\skills\`.

Validation performed: inspected tracked file inventories (including hidden skill directories), read source templates and registration/profile code, and recorded exact checkout commits. No runtime or behavior tests were run; reported behavior is what these sources instruct or implement.

