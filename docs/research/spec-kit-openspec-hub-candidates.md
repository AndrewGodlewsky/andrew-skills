# Spec Kit and OpenSpec skills: candidates for the GT skills hub

Prepared October 3, 2026. Integration-effort assessment added October 5, 2026; source snapshots remain those inspected on October 3.

## Purpose and recommendation

Andrew wants to consider individual skills and useful behaviors without adopting either complete toolkit. This document lists what each skill does, when it would be used, its overlap with existing capabilities, and whether it is worth adapting for GT.

The strongest candidates are requirements review, implementation verification, documentation verification, and keeping planning documents consistent. GT already covers interviewing, domain modeling, simplicity reviews, code reviews, and skill submissions. The clearest opportunities connect **what was requested → what was documented → what was built**.

These are recommendations for review, not approved additions. No skills were installed, activated, or modified for this comparison.

### How to read the recommendations

- **Adapt:** a promising standalone capability, rewritten to work with ordinary project inputs.
- **Borrow:** useful behavior to incorporate into an existing skill or workflow.
- **Skip:** little additional value for Andrew's stated goal, or too dependent on the original toolkit.
- **Unassessed:** insufficient implementation evidence to recommend it.

Most product skills cannot be copied unchanged. Spec Kit expects its templates, scripts, and `.specify/` structure. OpenSpec's workflow skills call its CLI for state, paths, and instructions. A standalone adaptation would retain the reasoning while accepting ordinary issues, documents, and source files.

The comparison uses GT's current repository catalog. Where a personal skill outside GT already overlaps, that is identified separately; personal availability does not mean the capability is shipped in GT.

### How to read integration effort

The new column estimates the work to make each capability useful in GT **without installing Spec Kit or OpenSpec**. These are engineering judgments from the inspected source, not measured implementation times. Ease and usefulness are separate: a small Git helper can be easy to extract and still not be worth adding.

- **Low:** mostly instruction edits, input/output generalization, and removing toolkit references. No replacement workflow engine is expected.
- **Medium:** meaningful adaptation of templates, document contracts, helper scripts, external tools, or dependent skills. The central behavior remains reusable.
- **High:** substantial coupling to toolkit state, schemas, managed-file updates, or release infrastructure. Preserving comparable behavior requires replacing those systems or deliberately reducing scope.
- **Unknown / Not applicable:** source is missing, or the item is only an example rather than a finished capability.

Ratings assume preserving the useful capability described in the row. Copying only an idea may be easier than extracting the complete workflow. A skill can be independent of both toolkits while still needing GitHub, Git, browser access, or subagent support.

All actual additions also need the hub's normal packaging, attribution, validation, dependency review, Help review, and release work. That shared overhead is not repeated in every row. Source-specific dependencies and behavioral changes are called out individually.

## Source scope

This is a source inspection of the following default-branch snapshots, not a stable-release or runtime test:

| Project | Commit | Version recorded in source |
|---|---|---|
| GitHub Spec Kit | `ae5ade7234be5cb1d975f736c4e06dd46d1326d6` | `1.1.1.dev0` |
| Fission AI OpenSpec | `2500d6da971336167548b53731a35b2127df35ac` | `1.14.0` |

The inventory covers 10 Spec Kit core workflows, 15 commands from bundled extensions, 12 OpenSpec workflows, and six internal maintainer skills. Four additional source/reference items are listed separately. Third-party extensions listed in external catalogs were not audited.

See [the source research](spec-kit-openspec-skills.md) for per-skill immutable source links, generation details, and local checkout locations. Existing GT guidance is in [GT Help](../../plugins/gt/skills/help/SKILL.md) and the [skill dependency map](../skill-map/map.md).

## Spec Kit: ten core skills

These are generated skills whose authoritative bodies live in [the command templates](https://github.com/github/spec-kit/tree/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/templates/commands).

| Skill | What it does and when to use it | Recommendation for GT | Standalone fit / integration effort |
|---|---|---|---|
| `speckit-constitution` | Records project principles and constraints. Useful when agents repeatedly make choices that violate established expectations. | **Borrow.** Put useful principles in existing project instructions and architectural decisions. A separate constitution could duplicate those. | **Medium — template-dependent.** Replace constitution storage, versioning, and downstream template-sync rules with the hub's existing instruction and decision files. |
| `speckit-specify` | Turns a feature request into requirements, user scenarios, acceptance criteria, and scope. Useful before handing work to an agent. | **Adapt, potentially.** GT Create Skills does this specifically for skills; a general feature-specification skill would cover broader work. | **Medium — workflow-dependent.** Bundle or replace the spec template; remove feature numbering, state files, hooks, and required downstream commands. |
| `speckit-clarify` | Finds consequential ambiguity in an existing specification, asks up to five targeted questions, and records the answers. | **Borrow.** Add a focused specification-clarification mode to an existing interview skill rather than another overlapping interviewer. | **Low — reasoning is portable.** Accept a supplied specification, remove project lookup/hooks, and define where confirmed answers are recorded. |
| `speckit-plan` | Converts requirements into a technical approach, research, data models, interfaces, and implementation guidance. Useful for substantial changes. | **Possible adaptation.** Produce only the documents the task needs, without requiring a complete planning package every time. | **Medium — several supporting artifacts.** Replace setup scripts and constitution checks; make research, contracts, and other outputs optional and self-contained. |
| `speckit-tasks` | Breaks a plan into dependency-ordered, actionable work. Useful for implementation handoffs or splitting work across agents. | **Adapt if handoffs are frequent.** Tie tasks to accepted requirements and completion criteria. | **Medium — format-dependent.** Replace prerequisite scripts, fixed artifact paths, and task markers; retain dependency ordering and requirement traceability. |
| `speckit-analyze` | Checks specification, plan, and tasks for contradictions, duplication, ambiguity, and missing coverage before implementation. | **Strong adapt.** Why Not checks intent and unnecessary complexity; this adds detailed consistency and coverage checking. | **Medium — portable checks, fixed inputs.** Replace scripts and required spec/plan/task schemas with supplied documents and explicit coverage rules. |
| `speckit-checklist` | Produces questions that test requirements quality: are errors defined, terms measurable, and edge cases covered? | **Strong adapt or combine with analyze.** Especially useful before building a skill from its specification. | **Low — mostly prompt logic.** Remove prerequisite scripts, hooks, and fixed output paths; retain the requirements-quality questions and reviewer ownership. |
| `speckit-implement` | Executes the task list, observes prerequisites, and records progress. | **Skip initially.** Much is ordinary agent execution; its additional value comes from the surrounding Spec Kit workflow. | **High — much of the workflow must change.** Replace prerequisite checks, task conventions, hooks, and completion state; define what remains beyond normal agent execution. |
| `speckit-converge` | Compares actual implementation with specification, plan, and tasks. Finds missing, partial, contradictory, or unrequested behavior and appends corrective tasks. | **Strong adapt.** Useful when an agent says done and Andrew wants evidence that the requested behavior exists. | **Medium — evidence logic is reusable.** Replace prerequisite scripts, constitution authority, and task IDs/phases; define report-only versus authorized task-appending behavior. |
| `speckit-taskstoissues` | Converts tasks into GitHub issues, checks for existing task IDs, and preserves dependency ordering. | **Adapt.** Useful for Andrew's issue-heavy workflow. GT Create Issue is a marketplace submission helper, so this would serve a different purpose. | **Medium — needs GitHub, not the toolkit.** Replace task discovery and ID assumptions; implement repository selection, duplicate detection, and dependency mapping with available GitHub tools. |

### Distinctions worth preserving

- **Checklist** examines whether requirements are well written. It generates review questions; it does not prove the software works.
- **Analyze** examines whether the specification, plan, and tasks agree and cover the intended work.
- **Converge** examines whether the actual implementation satisfies the accepted intent. The source workflow appends corrective tasks but does not implement them or rewrite the requirements.

## Spec Kit: 15 bundled extension commands

These commands can also be delivered as skills. The names below use their generated, hyphenated skill form. [Extension sources](https://github.com/github/spec-kit/tree/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/extensions).

| Skill | What it does and when to use it | Recommendation for GT | Standalone fit / integration effort |
|---|---|---|---|
| `speckit-bug-assess` | Investigates a bug report against code, identifies a suspected cause, assesses severity, and proposes a repair. | **Borrow.** Andrew already has a personal Diagnosing Bugs skill. Compare that before adding another diagnostic workflow to GT. | **Low — mostly standalone reasoning.** Replace the assessment path and downstream skill references; accept a report and repository directly. |
| `speckit-bug-fix` | Implements the repair described in a saved assessment and records the changes. | **Skip as a separate addition.** Better as the next step of an existing debugging workflow. | **Medium — depends on an assessment contract.** Accept an ordinary assessment, define its minimum evidence, and replace fixed report paths and handoffs. |
| `speckit-bug-test` | Checks whether a repair resolves the original bug and records verification evidence. | **Borrow strongly.** Keep the original symptom and reproduction attached to verification instead of reporting only passing tests. | **Medium — depends on prior evidence.** Replace assessment/fix file conventions and preserve access to the original reproduction, expected result, and verification tools. |
| `speckit-assess-intake` | Captures a rough idea and its provenance without evaluating it. Useful when collecting proposals for later consideration. | **Borrow.** Similar intake already exists in Create Skills. | **Low — simple document workflow.** Replace the output path and pipeline handoffs; retain faithful capture of the idea and its source. |
| `speckit-assess-research` | Collects evidence supporting or challenging an idea, including prior art and user needs. | **Borrow.** Andrew's personal Research skill already covers much of this. Explicitly seeking disconfirming evidence is valuable. | **Low — portable research instructions.** Accept a brief directly, replace pipeline files, and use available research tools with cited evidence. |
| `speckit-assess-define` | Establishes who has the problem, what hurts, goals, non-goals, and success criteria before choosing a solution. | **Borrow.** Fits Grill Me and Why Not. | **Low — portable framing exercise.** Accept supplied context instead of mandatory intake/research files; make the output destination explicit. |
| `speckit-assess-shape` | Compares solution options, scope, effort appetite, and tradeoffs before detailed design. | **Borrow.** Fits the existing design interviews. | **Low — portable option comparison.** Accept an agreed problem directly and remove fixed assessment artifacts and downstream commands. |
| `speckit-assess-decide` | Produces a reasoned proceed, clarify, or stop decision from collected evidence. | **Borrow.** Could improve an interview's or Why Not review's closing recommendation. Five separate assessment skills would add substantial ceremony. | **Low — portable decision rubric.** Accept an evidence packet, replace pipeline-state assumptions, and report a recommendation without automatically launching delivery. |
| `speckit-git-feature` | Creates and switches to a feature branch using its numbering conventions. | **Skip.** Small Git operation tied to Spec Kit conventions. | **Medium — script/config dependent.** Replace numbering and branch-creation helpers with project conventions and the owner's Git authorization rules. |
| `speckit-git-validate` | Checks whether the current branch follows the expected naming scheme. | **Skip.** Better handled by repository tooling if needed. | **Low — small check.** Replace Spec Kit naming patterns with explicit project rules; keep it read-only. |
| `speckit-git-remote` | Finds the Git remote for GitHub integrations. | **Skip.** Helper functionality with little standalone value. | **Low — already close to standalone.** Retain Git remote discovery and remove toolkit-specific output conventions. |
| `speckit-git-initialize` | Initializes a repository and creates an initial commit. | **Skip.** Ordinary setup work. | **Low — small script replacement.** Replace bundled initialization scripts with ordinary Git operations and explicit initial-commit authorization. |
| `speckit-git-commit` | Automatically stages and commits changes around workflow events. | **Skip.** Automatic commits conflict with Andrew's separate Git authorization requirements. Caveman Commit already handles message drafting. | **Medium — hook behavior needs redesign.** Remove event/config dependencies and automatic stage-all behavior; establish intended scope and commit authorization. |
| `speckit-agent-context-update` | Refreshes a managed portion of agent instruction files from project information. | **Possible adaptation later.** Useful if instructions frequently become stale, but needs clear ownership of generated versus authored text. | **High — managed-file integration.** Replace config, source extraction, and update scripts; preserve authored sections and support repeatable, non-destructive updates. |
| `speckit-github-taskstoissues` | Provides tasks-to-GitHub-issues conversion through the extension system. | **Same candidate as core taskstoissues.** Do not import both. | **Medium — same extraction as core variant.** Replace resolver scripts and task conventions; retain GitHub integration and reliable duplicate/dependency handling. |

## OpenSpec: twelve workflow skills

The first six are enabled by the default core profile. The remaining six are optional workflows. [Skill sources](https://github.com/Fission-AI/OpenSpec/tree/2500d6da971336167548b53731a35b2127df35ac/skills).

| Skill | Default? | What it does and when to use it | Recommendation for GT | Standalone fit / integration effort |
|---|---|---|---|---|
| `openspec-explore` | Yes | Investigates a problem, explores options, and clarifies requirements through conversation and code inspection. | **Borrow.** Overlaps with Grill Me and Grill with Docs. Inspecting available evidence before asking factual questions is useful. | **Low — discussion logic stands alone.** Remove root/store/CLI discovery and toolkit handoffs; ground discussion in supplied project evidence. |
| `openspec-propose` | Yes | Creates a change proposal and its required planning documents in dependency order, then stops before implementation. | **Possible adaptation alongside specify.** Choose one coherent planning skill instead of importing two competing systems. | **High — CLI supplies workflow structure.** Replace schema selection, artifact readiness, instruction lookup, paths, and completion rules with a smaller explicit planning contract. |
| `openspec-apply-change` | Yes | Reads the change's instructions and context, implements tasks, and records completion. | **Skip initially.** Strongly dependent on OpenSpec's state and CLI. | **High — CLI supplies execution state.** Replace context discovery, task state, blocked/done rules, and schema-specific instructions before it can operate independently. |
| `openspec-update-change` | Yes | Revises existing planning documents and reconciles related documents when a decision changes. | **Strong adapt.** Useful when an interview changes a decision but the specification, plan, and tasks still disagree. | **Medium — reconciliation logic is portable.** Replace CLI artifact/path discovery with an explicit document set and accepted decision; simplify schema/glob rules and honor existing edit authorization. |
| `openspec-sync-specs` | Yes | Merges a change's added, modified, removed, and renamed requirements into persistent specifications. | **Skip unless adopting persistent behavioral specs.** Its value depends on that document model. | **High — requires a spec model.** Define durable specs, delta syntax, conflict handling, and merge validation; little original behavior survives without those conventions. |
| `openspec-archive-change` | Yes | Checks completion and outstanding spec synchronization, then archives a change. | **Skip.** Mostly OpenSpec lifecycle management. | **High — depends on lifecycle state.** Replace completion checks, sync handoffs, and archive rules with a project-owned change lifecycle. |
| `openspec-new-change` | No | Creates an empty change scaffold and shows instructions for the first planning document. | **Skip.** Framework setup rather than a broadly reusable capability. | **High for equivalent behavior.** The CLI owns scaffolding and schema setup. A simple document starter is easy, but would be a substantially reduced replacement. |
| `openspec-continue-change` | No | Creates the next eligible planning document, one invocation at a time. | **Skip.** Depends on OpenSpec's dependency graph; another step-by-step document workflow adds little here. | **High — requires dependency tracking.** Replace CLI readiness and instruction resolution, persistent state, and selection of the next artifact. |
| `openspec-ff-change` | No | Generates planning prerequisites in one pass. | **Skip as a separate skill.** Overlaps with propose; useful behavior belongs in a general planning skill. | **High — requires workflow orchestration.** Replace schema/dependency resolution and completion state; a fixed planning prompt is a reduced alternative. |
| `openspec-verify-change` | No | Reviews implementation completeness, correctness, and consistency with accepted documents, returning findings without editing. | **Strong adapt.** Combine its verification approach with Spec Kit converge rather than adding two overlapping reviewers. | **Medium — review logic is portable.** Replace CLI context lookup and schema assumptions with supplied requirements, plans, tasks, and implementation evidence. |
| `openspec-bulk-archive-change` | No | Archives several changes while handling overlapping specification changes. | **Skip.** Useful mainly with OpenSpec's change and spec model. | **High — coupled lifecycle and merging.** Requires standalone archive rules plus ordering, overlap detection, and conflict handling across changes. |
| `openspec-onboard` | No | Walks the user through a real OpenSpec change with explanations at each stage. | **Borrow the teaching approach.** A guided first use could help GT, but this particular skill teaches the toolkit Andrew does not want to adopt. | **High — teaches the entire toolkit.** Rebuild the example and every workflow step for GT; borrowing only the guided-teaching style is easy. |

### Interaction differences to consider

OpenSpec's update-change requires confirmation for each artifact revision. Propose forces a stop after planning. A standalone adaptation should follow Andrew's requested scope and existing authorization rather than inherit these pauses automatically.

## Internal maintainer skills

These maintain the projects themselves. They are separate from the workflows distributed to end users.

Sources: [Spec Kit maintainer skills](https://github.com/github/spec-kit/tree/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/.github/skills), [OpenSpec maintainer skills](https://github.com/Fission-AI/OpenSpec/tree/2500d6da971336167548b53731a35b2127df35ac/.agents/skills).

| Project | Skill | What it does and when to use it | Recommendation for GT | Standalone fit / integration effort |
|---|---|---|---|---|
| Spec Kit | `code-review` | Checks positive and negative test coverage, regression evidence, and consistent terminology. | **Borrow.** Useful criteria for existing review skills without adding another reviewer. | **Low — nearly standalone.** Generalize the repository terminology rule and package the short review checklist; no toolkit runtime is needed. |
| Spec Kit | `add-community-extension` | Processes submitted extensions, validates catalog information, and updates catalog and documentation. | **Borrow selectively.** Relevant to marketplace maintenance, but their catalog and submission process differ from GT's. | **High — repository-specific automation.** Replace submission fields, catalog schema, validation, generated docs, and PR flow with GT's maintainer process. |
| OpenSpec | `write-openspec-docs` | Writes documentation using a house style focused on reader tasks, findable answers, verified commands, and clear structure. | **Adapt, potentially.** Useful for GT Help and repository docs. Caveman focuses on compression; this addresses information organization. | **Medium — bundled style dependencies.** Adapt the house-style resources, examples, and page-map rules; resolve or replace the missing no-ai-slop dependency. |
| OpenSpec | `draft-openspec-docs` | Builds an outline inside a page, records decisions, and drafts sections as the user approves them. | **Borrow cautiously.** Useful for major collaborative documents, but per-section approvals are probably too slow for normal work. | **Medium — composition and docs-tree dependencies.** Adapt the writing skill, replace page-map/sync scripts and missing no-ai-slop dependency, and revise the approval cadence and page-rewrite behavior. |
| OpenSpec | `verify-openspec-docs` | Uses independent reviewers to check factual claims against code and command output, reporting evidence and unverified claims. | **Strong adapt.** Valuable for installation instructions, skill descriptions, examples, and Help guidance. | **Medium — no OpenSpec CLI needed for the general reviewer.** Replace house-style/docs-tree paths and OpenSpec validation examples; define supported reviewer delegation and safe example execution. |
| OpenSpec | `release-openspec` | Inspects release state, checks changeset coverage, resumes the appropriate release step, and verifies publication. | **Borrow the resumable-state approach.** Implementation is specific to OpenSpec and Changesets; a GT release skill needs GT's release rules. | **High — release-system specific.** Replace Changesets, CI, repository identity, branch/PR rules, and publishing verification with GT's release process and authorization boundaries. |

## Additional source and reference items

These are not additional normal product skills in the inventories above.

| Item | What it is | Recommendation | Standalone fit / integration effort |
|---|---|---|---|
| Spec Kit `speckit.selftest.extension` | A command that tests extension discovery, installation, and registration. | **Borrow the testing idea** if marketplace lifecycle checks are needed; skip the Spec Kit-specific command. | **High — tests a different platform.** Replace the extension installer, registry, lifecycle assertions, and scratch setup with GT equivalents. |
| Spec Kit `speckit.my-extension.example` | An example command in the extension-authoring template. | **Skip.** Author scaffolding. | **Not applicable — a placeholder.** It contains no finished capability to extract; implementation effort depends on the skill chosen. |
| OpenSpec `feedback` template | Prepares contextual, anonymized feedback for approval and submission. Absent from the normal twelve-skill distribution. | **Skip.** Substantial overlap with Skill Tweak. | **Medium — portable intake, specific transport.** Replace the OpenSpec submission command and destination; preserve draft review, redaction, and authorized sending. |
| Referenced `no-ai-slop` | Referenced by OpenSpec documentation skills; its implementation is not included in the inspected checkout. | **Unassessed.** Its name is insufficient evidence to recommend it. | **Unknown — source unavailable.** Its dependencies and integration effort cannot be assessed from references alone. |

Sources: [self-test manifest](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/extensions/selftest/extension.yml), [example manifest](https://github.com/github/spec-kit/blob/ae5ade7234be5cb1d975f736c4e06dd46d1326d6/extensions/template/extension.yml), [feedback template](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/src/core/templates/workflows/feedback.ts), [documentation skill referencing no-ai-slop](https://github.com/Fission-AI/OpenSpec/blob/2500d6da971336167548b53731a35b2127df35ac/.agents/skills/write-openspec-docs/SKILL.md).

## Recommended shortlist

The following names are proposals for discussion, not existing or approved additions.

| Proposed standalone skill | Integration effort | Main work |
|---|---|---|
| review-spec | **Medium overall; checklist-only is Low.** | Combine review criteria, accept ordinary documents, and replace fixed schemas and prerequisite scripts. |
| verify-work | **Medium.** | Establish requirements-to-evidence mapping and optional corrective tasks without either toolkit's state or task conventions. |
| verify-docs | **Medium.** | Generalize source and style inputs, replace project-specific validation, and define reviewer/tool availability. |
| reconcile-plan | **Medium.** | Replace CLI artifact discovery with an explicit document set and accepted decisions; preserve coherent edits without importing per-file approval requirements. |
| tasks-to-issues | **Medium.** | Provide GitHub access, project-scoped duplicate detection, source mapping, and dependency handling. |

The easiest useful first slice is a requirements-quality reviewer drawn from checklist. The broader review-spec combines that with cross-document consistency checks. None of the shortlisted adaptations needs either complete toolkit, but none is a verified drop-in package.

### 1. review-spec

**Draw from:** Spec Kit checklist and analyze.

Accept an issue, specification, or set of planning documents. Find unclear requirements, contradictions, missing failure cases, and requirements with no planned work. Support a single document without requiring a plan and task list that do not yet exist.

**Why it fits GT:** complements the interview and Why Not skills with a concrete check of the resulting specification.

**Example finding:** “Cancellation is required, but the behavior section never explains what happens to partially written files.”

**Expected output:** prioritized findings tied to exact requirements, with suggested clarifications. Generating a checklist and evaluating an existing specification should be distinguishable operations.

### 2. verify-work

**Draw from:** Spec Kit converge and OpenSpec verify-change.

Compare accepted requirements with the actual result and return evidence-backed gaps. Check required behavior even when the task list says it is complete. Distinguish missing, partial, contradictory, and unrequested behavior, and disclose what could not be verified.

**Why it fits GT:** Why Not challenges the approach; this checks delivery. A code review can find defects in changed code while still missing a requirement that was never implemented.

**Example finding:** “The spec requires recovery after interruption. The implementation saves progress only at completion, so interrupted work cannot resume.”

**Expected output:** requirements-to-evidence findings, with corrective tasks as an optional output. Verification should not automatically start repairs or rewrite the accepted requirements to match the result.

### 3. verify-docs

**Draw from:** OpenSpec verify-openspec-docs.

Check documentation claims against source and observed behavior. Validate commands, paths, defaults, examples, and promised behavior. Use bounded independent review where it adds value; isolate mutating examples in an appropriate scratch environment or report them as unverified.

**Why it fits GT:** especially useful for Help, installation guidance, skill descriptions, and examples that become stale after implementation changes.

**Example finding:** “The guide says this action restores the managed installation, but the skill creates a separate personal copy.”

**Expected output:** factual findings with the command or source evidence used, plus explicitly unverified claims. Keep house-style preferences separate from factual errors.

### 4. reconcile-plan

**Draw from:** OpenSpec update-change.

Carry an accepted decision through the affected planning documents. Identify every affected behavior description, acceptance criterion, task, and example. Follow the project's existing document locations and the user's edit authorization.

**Why it fits GT:** interviews often change a decision after several documents already exist. This addresses the stale-document problem left behind by that change.

**Example:** a skill changes from automatically submitting an issue to previewing a draft. Reconcile its specification, acceptance criteria, implementation tasks, and examples so they describe the same behavior.

**Expected output:** coherent revised documents or a scoped reconciliation report, depending on the request, with unresolved conflicts stated explicitly. Do not infer a new decision from contradictory documents.

### Next candidate: tasks-to-issues

**Draw from:** either Spec Kit tasks-to-issues implementation, not both.

Convert accepted work into useful GitHub issues with dependencies, source references, and duplicate checks. Adapt to the repository's actual issue conventions rather than assuming globally unique Spec Kit task IDs.

**Why it fits GT:** Andrew uses GitHub issues extensively, and GT Create Issue is specifically a marketplace submission dependency rather than a general work-planning tool.

## Adaptation considerations

If a candidate is selected later:

- Accept existing user-selected documents and repository conventions instead of requiring `.specify/` or `openspec/` layouts.
- Remove toolkit-specific CLI calls, hooks, placeholders, and state assumptions; replace only the necessary behavior.
- Keep existing GT and personal-skill overlap visible when deciding whether to add a skill or improve one.
- Preserve distinctions between advice, document edits, implementation, issue creation, and Git/release actions.
- Follow the user's requested scope and established authorization instead of importing extra confirmation steps.
- Review source reuse terms and retain required attribution if adapting implementation text.
- Follow GT's current authoring and maintenance process only when actual skill work is requested.

## Review status

- All listed items have a purpose and recommendation recorded above.
- Recommendations are based on source inspection and the current GT catalog, not comparative performance testing.
- No proposed name, scope, or addition has been accepted yet.
- No toolkit installation or skill adaptation is part of this document-save request.
