# Repository foundations: operational context and executable feedback

Research date: October 7, 2026. Scope: inputs for a reviewable HTML guide and a possible future repository-creation skill. This note does not create or change that skill. The proposed outlines and generator behavior below are design recommendations, informed by the cited primary sources; they are not a universal standard or experimentally validated package.

## Evidence and design stance

The strongest directly relevant accounts are first-party engineering case studies. OpenAI describes a short agent entry point, a navigable documentation system, executable boundary checks, and accessible diagnostics. Anthropic describes session continuity supported by initialization scripts, feature criteria, progress records, and verification. Neither establishes that every repository benefits from an identical file tree. [OpenAI](https://openai.com/index/harness-engineering/), [Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).

The proposed creation skill should produce usable capabilities, with documents explaining them. A command that actually checks a property is stronger evidence than a paragraph saying that the property matters. A small repository can put several responsibilities in one file. An operational service may need more distinct documents than a library or collection of content.

## 1. AGENTS.md: a compact operational entry point

**Evidence.** The AGENTS.md convention is plain Markdown with no required schema. Its examples cover overview, setup, tests, style, and security. It supports nested instructions for subprojects. Actual loading and precedence should still be checked against the selected agent tools rather than assumed universally. [AGENTS.md](https://agents.md/).

**Creation trigger:** baseline for repositories intended to be maintained by agents. Generate only repository-specific guidance that is already known or deliberately chosen.

**Content domains and subdomains:** orientation (purpose in one paragraph; document map); execution (working directory, setup and focused/full checks); modification constraints (generated files, public interfaces, compatibility expectations); local conventions that tooling cannot communicate; change workflow (canonical issue/spec, evidence required at completion); and links to authoritative policy. Add nested files when a package really has different commands or constraints, not mechanically in every folder.

**Discovery questions:** Which agents will work here? Which tasks and commands are routine? Which paths are generated? Which mistakes would a competent new contributor otherwise make? What actions has the owner actually authorized?

**Facts versus decisions:** inspect manifests, scripts and generator headers for facts. Obtain workflow expectations from the owner or existing approved guidance. Do not convert a template's sample permission into authority to commit, push, publish, create pull requests, deploy or change repository settings. A repository file cannot override higher-priority user or platform instructions.

**Minimal outline:** Purpose; Read next; Commands; Change constraints; Completion evidence. Prefer links over duplicated architecture, domain definitions and product requirements.

**Validation/upkeep:** check links and referenced paths; execute safe documented commands; compare command descriptions with actual behavior. Revisit when scripts, package boundaries, generation processes or owner policy change. Record unavailable checks honestly.

## 2. CONTRIBUTING.md: the shared contribution contract

**Evidence.** GitHub recognizes contributor guidelines in the root, `docs`, or `.github`, and surfaces them when people create issues and pull requests. Its documented purpose is communicating how to contribute and submit useful changes. [GitHub contributor guidelines](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors).

**Creation trigger:** several contributors, an external contribution path, or a substantial review/release process. A solo prototype may begin with a short README section and split it later.

**Content domains:** contribution routes (bugs, features, discussion, security reports); local setup; change expectations (scope, documentation, relevant tests, compatibility); review evidence (what changed, why, how verified); and delivery (versioning, release preparation, who approves it). Link long setup or release procedures where they already live.

**Discovery questions:** Are outside contributions accepted? Where is work proposed and tracked? What constitutes an acceptable change? Who can approve releases? Are legal contribution requirements already established?

**Facts versus decisions:** installed tooling, command names and repository structure are discoverable. Review thresholds, release authority, licensing/CLA policy and support promises belong to the owner. Never invent them from conventions elsewhere.

**Minimal outline:** Ways to contribute; Setup; Making a change; Validation; Review and release links.

**Validation/upkeep:** walk one representative change through the instructions, check template links, and compare the process with CI and release configuration. Keep operational rules canonical here if they apply equally to humans and agents; AGENTS.md should link them. Contributor guidance explains a process; it does not by itself grant tool permissions.

## 3. Reproducible setup and command interfaces

**Evidence.** For npm projects, `npm ci` requires a lockfile, rejects a mismatch with the manifest, and does not update either file. This is a concrete example of a frozen installation mechanism, not a reason to select npm for every project. [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/).

**Creation trigger:** baseline once the repository has an executable or generated deliverable. A pure prose repository may only need its preview and document checks.

**Artifact family:** package/build manifest, appropriate lockfile, runtime declaration, setup/check scripts, `.env.example` when environment variables exist, and a concise setup guide. A dev container or compose file is conditional on real environment complexity.

**Domains:** prerequisites (supported OS/runtime/tools); dependencies (installation and update mechanisms); configuration (variable names, required/optional status, safe examples); local services (startup, seed data, shutdown); commands (dev, build, focused checks, full checks); outputs (generated paths); and repeatability (deterministic inputs, ports, isolated state).

**Discovery questions:** What deliverable must run? On which systems? Which external services are required? Can a useful local mode run without production credentials? Which steps alter data or access paid services?

**Facts versus decisions:** inspect the selected stack; label chosen runtime targets and new scripts as proposals until implemented. Secret values are never scaffold content. Portability and supported-version promises need owner intent.

**Minimal outline:** Requirements; Install; Configure; Run; Check; Troubleshooting. Each command needs its working directory and expected observable result. The command manifest is canonical; prose explains purpose and prerequisites.

**Validation/upkeep:** perform a clean setup where practical, then start and exercise the smallest useful feature. Confirm a repeated setup does not duplicate or destroy user data. Distinguish “script exists,” “executed successfully,” and “verified on all supported platforms.” Update together with dependencies and environment changes.

## 4. Tests, CI and machine-readable contracts

**Evidence.** GitHub Actions workflows are repository YAML defining event triggers and jobs whose steps execute scripts or actions. JSON Schema provides a vocabulary for documenting and validating JSON shapes; specifying types and constraints is meaningful, whereas an empty schema constrains nothing. [GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions), [JSON Schema](https://json-schema.org/learn/getting-started-step-by-step).

**Creation trigger:** a minimal verification path belongs in the baseline. Add schema contracts for actual structured boundaries and architecture checks for explicit architectural rules. Add remote CI when the hosting and execution policy are known.

**Domains:** behavior (critical use cases, failures, edge cases); boundaries (API, file, configuration and data contracts); invariants (permitted dependency directions, generation consistency); quality (formatting, lint, type checks); execution (fixtures, isolation, external-service requirements); and results (exit status, useful diagnostics, reproducible failing inputs). For agent products, distinguish deterministic package validation from evaluations of model behavior.

**Discovery questions:** What outcome must never regress? What would count as evidence that the initial feature works? Which input boundaries can reject invalid data? What checks are cheap enough for every edit? Which require credentials, significant time or money?

**Facts versus decisions:** framework configuration and existing checks are facts. Risk tolerance, coverage goals, required checks and supported environments are design decisions. Avoid arbitrary coverage percentages and nominal tests that only confirm a scaffold exists.

**Minimal outline for an optional TESTING.md:** Check commands; What each establishes; Fixtures; Local/CI differences; Known gaps. Start with a representative behavior test and a useful aggregate check, not an empty directory for every test category.

**Validation/upkeep:** run checks; ensure a deliberately invalid fixture is rejected where appropriate; verify the aggregate command does not quietly skip essential work. A passing schema only proves specified structural constraints, not business correctness. A workflow file does not prove branch protection requires it. Changes to branch protection, deployment and secrets require their own authorization.

## 5. Plans and progress: durable current work

**Evidence.** Anthropic's harness uses an initializer, a feature list and progress records so subsequent sessions can recover state and verify incremental work. Its observed failure modes include unfinished changes and premature completion claims. These are implementation lessons from its long-running-agent experiments. [Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).

**Creation trigger:** work spans sessions, has multiple milestones or has a recovery requirement. Prefer an existing issue or tracker if it is reliably accessible. Do not create an idle progress file merely because the template has a slot.

**Domains:** objective and acceptance criteria; present state; sequence and dependencies; discoveries and decisions; checks already run with results; blockers; next executable step; and completion/archive state. Durable design choices belong in ADRs after the working plan reveals them.

**Discovery questions:** Where will work be tracked? Can all target agents read that source? How will a new session distinguish a completed check from an intended check? What should be preserved when interrupted?

**Facts versus decisions:** record actual commands/results, current files and unfinished changes as evidence. Scope, priority and what “done” means come from the accepted request. A generated checklist should not silently expand scope.

**Minimal outline:** Goal; Acceptance; Current state; Next steps; Decisions; Verification; Open questions. An initial plan can be the repository bootstrap itself, with each item tied to a deliverable and observable result.

**Validation/upkeep:** have a fresh reader resume from the plan; reconcile status with files and checks; archive completed work and link resulting specs/decisions. Avoid copying chat transcripts or preserving obsolete next steps as live instructions.

## 6. Diagnostics and runbooks: evidence and recovery

**Evidence.** OpenTelemetry identifies traces, metrics and logs as different signals about system behavior. These categories help organize diagnostics; adopting its entire toolchain is not required for a small repository. [OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/).

**Creation trigger:** every executable needs understandable failures; a service, recurring job or operational procedure may justify `docs/runbooks/`. A library may only need error conventions and a reproducer recipe.

**Domains:** symptoms; scope/environment; health checks; relevant logs and correlation identifiers; metrics and expected bounds; reproductions; likely causes and discriminating checks; mitigations; rollback/recovery; post-action verification; and escalation contacts. Separate read-only diagnosis from state-changing actions and identify preconditions for the latter.

**Discovery questions:** What can fail at startup or during the first critical user flow? How is evidence accessed locally? Who operates production? What data must logs omit? Which recovery steps are actually tested?

**Facts versus decisions:** document observed error messages, paths and health endpoints. Service objectives, retention, access rules and incident responsibilities require an owner decision. Do not invent production URLs, dashboards, credentials or recovery guarantees.

**Minimal outline:** Symptom; Diagnose; Recover; Verify; Escalate. Seed a real local startup failure or useful diagnostic command, then add runbooks from observed operational needs.

**Validation/upkeep:** reproduce one known failure and confirm the documented evidence distinguishes it. Review after incidents and instrumentation changes. A runbook is operational knowledge, not implicit authorization to execute a destructive recovery action.

## 7. SECURITY.md and ownership: conditional public contracts

**Evidence.** GitHub's SECURITY.md guidance covers supported versions and vulnerability reporting. CODEOWNERS maps paths to eligible people or teams and can support required reviews when repository protection is configured. The file alone does not enforce approval. [Security policy](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/add-security-policy), [Code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).

**Creation trigger:** published software or a genuine private vulnerability-reporting need for SECURITY.md; several maintainers or meaningful review ownership for CODEOWNERS. Never create a fake contact route.

**Domains:** SECURITY.md holds supported release lines, reporting channel, useful report contents and owner-approved response expectations. Internal security design belongs in a separate threat model or architecture document. CODEOWNERS holds real path-to-maintainer mappings, including sensitive workflow/configuration files when appropriate. Explain general responsibilities in CONTRIBUTING.md.

**Discovery questions:** Who receives reports? Is the channel operational? Which versions receive fixes? Which maintainers have the needed access and agree to own these paths? Which rules are merely documented, and which are configured remotely?

**Minimal outlines:** Security: Supported versions; Reporting; What to expect. Ownership: broad default followed by intentional path exceptions, using platform semantics.

**Validation/upkeep:** verify contact information and file syntax without submitting test vulnerability reports; inspect account/team eligibility when access exists; explicitly report unverified protection settings. Revisit with maintainer, support-window and release changes. A security document makes no claim of audit completion or legal compliance.

## Proposed generator completion criteria

Create only selected, populated artifacts; provide a manifest of created files and deliberately omitted responsibilities. Separate observed facts, owner choices, working assumptions and unanswered questions. Every generated operational instruction should point to a real executable capability or clearly explain its prerequisites. Record check results and limitations. Link one canonical source for each responsibility. Leave Git writes, publishing, deployment and remote settings within the user's actual authorization. The useful output is an operable starting repository with honest context, rather than a large collection of empty headings.
