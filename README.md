# Andrew Skills

One shared skills plugin for GitHub Copilot in VS Code and Copilot CLI.
Installing the `gt` plugin includes every skill in this repository.

Maintainers: review the [skill dependency map prototype](docs/skill-map.md)
for the accepted overview graph and linked dependency table from
[#53](https://github.com/AndrewGodlewsky/andrew-skills/issues/53). The
[implementation handoff](docs/planning/skill-map-implementation-handoff.md)
defines both map views, freshness checks and automatic inventory maintenance;
the [data foundation and audit](docs/skill-map/README.md) are implemented.
The production viewer and authoring/CI integration remain pending.

## Install

For the usual setup, install the hub **once per user environment**, choosing
**one** of these methods:

| Setup | Installation method |
| --- | --- |
| VS Code without Copilot CLI | [Install through VS Code](#install-from-vs-code-without-the-cli). No install script is needed. |
| Copilot CLI, including skills shared with VS Code | Use the PowerShell installer below or the CLI commands. |

`install.ps1` requires Copilot CLI and creates a CLI-managed installation.
For CLI and VS Code use in the same environment, install through the CLI and let
VS Code discover that installation; a second VS Code installation is unnecessary.
For VS Code-only use, install through VS Code instead. Windows and WSL are
separate environments and do not need to share installed files. These are
alternative onboarding routes to avoid accidental duplication, not a restriction
on experienced users who deliberately choose separate installations. If you keep
separate copies, identify which installation you intend to update.

### Install with the CLI using PowerShell

After these repository changes are published to GitHub, download or clone the
repository and run this from its root in PowerShell:

```powershell
.\install.ps1
```

The installer registers the marketplace, then installs the entire `gt`
plugin. It stops if either step fails and does not change execution policies or
install prerequisites. It installs the published GitHub version, not local edits.

### Install without downloading this repository

**PowerShell 7, Bash, or Zsh:** paste this single line:

```sh
copilot plugin marketplace add AndrewGodlewsky/andrew-skills && copilot plugin install gt@andrew-skills
```

**Windows PowerShell 5.1:** use this compatible single line:

```powershell
copilot plugin marketplace add AndrewGodlewsky/andrew-skills; if ($LASTEXITCODE -eq 0) { copilot plugin install gt@andrew-skills }
```

Both versions install the plugin only if marketplace registration succeeds.
Windows PowerShell 5.1 does not support `&&`; an error about `&` or `&&` can mean
you pasted the PowerShell 7 command into the older shell. To check your version:

```powershell
$PSVersionTable.PSVersion
```

Copy `gt@andrew-skills` exactly, without a backslash before `@`.
If the marketplace is already registered, run just:

```powershell
copilot plugin install gt@andrew-skills
```

In `gt@andrew-skills`, `gt` names the plugin and `andrew-skills` names its
catalog. Both live in this repository. All skills install
together, with no separate skill installation.

Direct repository installation is deprecated by Copilot CLI. Use the marketplace
commands above. See [GitHub's notice](https://github.com/github/awesome-copilot/blob/main/website/src/content/docs/learning-hub/installing-and-using-plugins.md)
and [marketplace installation guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing).

Requires a current [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli),
Git, and repository access. Follow any authentication or trust prompts. Having the
VS Code Copilot extension does not by itself mean the CLI is installed.

VS Code automatically discovers plugins installed by Copilot CLI under the same
user account on the same machine. Use an up-to-date VS Code with Copilot access
and agent plugins enabled. Reload the window if the plugin is not yet listed.
[VS Code discovery documentation](https://code.visualstudio.com/docs/agent-customization/agent-plugins#plugins-installed-by-github-copilot-cli).

### Install from VS Code without the CLI

Use a current VS Code with Copilot access and agent plugins enabled
(`chat.plugins.enabled`). Repository access is required.

1. Open **Preferences: Open User Settings (JSON)** from the Command Palette.
2. Add `https://github.com/AndrewGodlewsky/andrew-skills.git` to the
   `chat.plugins.marketplaces` array, preserving existing entries.
3. Run **Chat: Open Customizations**, select **Plugins**, then **Browse Marketplace**.
4. Find `gt` in `andrew-skills`, select **Install**, and follow the trust prompt.

This installs the published plugin through VS Code. Do not run `install.ps1`
for this route. Update this installation using the
[VS Code update instructions](#vs-code-installed-plugin), rather than CLI commands.
[VS Code marketplace installation](https://code.visualstudio.com/docs/agent-customization/agent-plugins#configure-plugin-marketplaces).

## Use a skill

Start a fresh Copilot Chat and enter:

```text
/gt:grill-me I want to build a shared skills hub for my team.
```

| Skill | Purpose | Command |
| --- | --- | --- |
| [Grill me](skills/grill-me/SKILL.md) | Sharpen a plan or design through an interview | `/gt:grill-me` |
| [Grill with docs](skills/grill-with-docs/SKILL.md) | Interview about a plan while recording agreed terms and selected architectural decisions | `/gt:grill-with-docs` |
| [Grilling](skills/grilling/SKILL.md) | Explore a design in rounds of questions whose prerequisites are settled | `/gt:grilling` or model selection |
| [Domain modeling](skills/domain-modeling/SKILL.md) | Refine domain vocabulary and write glossary entries and qualifying ADRs | `/gt:domain-modeling` or model selection |
| [Why not](skills/why-not/SKILL.md) | Check intent drift and suggest simpler designs at a high level | `/gt:why-not` or model selection |
| [Skills update](skills/skills-update/SKILL.md) | Update the intended managed GT copy and report verified skill changes | `/gt:skills-update` |
| [Skills status](skills/skills-status/SKILL.md) | Show versions and release notes in one selected local GT installation | `/gt:skills-status` |
| [Skills restore](skills/skills-restore/SKILL.md) | Browse exact historical releases and create an independent personal copy | `/gt:skills-restore` |
| [Create issue](skills/create-issue/SKILL.md) | Submit caller-prepared GT proposals and feedback to this repository | Model-only dependency; no manual command |
| [Create skills](skills/create-skills/SKILL.md) | Specify a new GT skill, attempt its package/checks, and submit it for review | `/gt:create-skills` |
| [Skill tweak](skills/skill-tweak/SKILL.md) | Capture a GT skill incident and submit feedback after approval of the complete draft | `/gt:skill-tweak` |
| [Skill steal](skills/skill-steal/SKILL.md) | Adapt a local skill while preserving behavior and submit it for GT review | `/gt:skill-steal` |
| [Caveman commit](skills/caveman-commit/SKILL.md) | Write terse Conventional Commits messages from supplied change context | `/gt:caveman-commit` or model selection |
| [Caveman](skills/caveman/SKILL.md) | Use light or full chat style while preserving technical meaning | `/gt:caveman` or model selection |
| [Caveman review](skills/caveman-review/SKILL.md) | Review changes with one concise, actionable line per finding | `/gt:caveman-review` or model selection |
| [Caveman explore](skills/caveman-explore/SKILL.md) | Delegate read-only repository localization and return verified path/line citations | `/gt:caveman-explore` or model selection |
| [Caveman compress](skills/caveman-compress/SKILL.md) | Compress a selected prose file with a readable backup using Python and Claude | `/gt:caveman-compress` or model selection |

`grill-me` asks one question at a time, recommends an answer, and waits for shared
understanding before implementing the plan. Manual and model invocation are enabled.
Create Skills and Skill Tweak invoke the selected GT Grill Me for their interviews,
passing existing context and retaining its confirmed understanding. Its interview
instructions are unchanged; a missing or disabled dependency leaves a draft.
Caller integration and live-client acceptance are recorded in
[#47](https://github.com/AndrewGodlewsky/andrew-skills/issues/47).

`grill-with-docs` invokes the enabled GT `grilling` and `domain-modeling` skills
from the same installation. All three are included in this plugin. It uses
upstream-style rounds of independent questions, captures agreed terms in
`CONTEXT.md` during the interview, and offers ADRs for consequential tradeoffs.
Existing repository documentation locations take precedence over the default
`docs/adr/`. Supply a plan or domain-documentation goal and the target repository.
Missing dependencies stop the composed workflow; unavailable file access leaves
proposed text. The existing `grill-me` keeps its one-question-at-a-time behavior.
These additions are prepared for plugin 0.1.14; live-client checks remain pending
in [#48](https://github.com/AndrewGodlewsky/andrew-skills/issues/48).

`why-not` gives one read-only review of an idea, skill, design or returned agent
work against the user's actual goal. It prefers a fresh sub-agent, with a labeled
same-conversation fallback when sub-agents are unavailable. Expect up to three
concrete simplification suggestions, or an explanation that the design is already
appropriate. It preserves necessary complexity and leaves changes to the parent
model. Both user invocation and model selection are enabled; this is not an
automatic review hook. Supply the original goal and the proposal to review.

`create-issue` is a shared dependency for calling workflows that already have
the issue content and submission authorization. It preserves the caller's layout
and always targets `AndrewGodlewsky/andrew-skills`, even from another workspace.
It requires Node.js 22+, an already authenticated GitHub CLI 2.90.0+, and safe
process/stdin access in the selected Windows or WSL environment. It does not
install tools, sign in, or copy credentials. Configured proxy environments stop
until proxy integration is reviewed. Read its bundled instructions for ownership,
separate content/label outcomes and recovery without replay. Model discovery,
composition and authenticated writes in actual clients remain acceptance work
in [#35](https://github.com/AndrewGodlewsky/andrew-skills/issues/35) and
[#36](https://github.com/AndrewGodlewsky/andrew-skills/issues/36).

`create-skills` starts with a detailed specification, then attempts a package and
checks. It submits an intent recap, interview record, specification, produced
files and actual check results as separate parts of one issue through
`create-issue`. Failed/unavailable checks
do not block intake; unresolved intent is explicit for maintainer follow-up. It
builds useful settled portions, or explains why core ambiguity prevents an attempt.
Maintainers independently validate before adoption. Long text uses indexed
comments; essential binaries can use a manual ZIP attachment.
After verified delivery it offers an ordinary-name personal copy, only on your
explicit yes. You own that copy's future maintenance. This workflow creates new
skills; changes to existing skills are outside its scope. Local tools need Node
22+; actual Copilot acceptance is tracked in
[#43](https://github.com/AndrewGodlewsky/andrew-skills/issues/43).

`skill-tweak` collects relevant conversation evidence when a GT skill behaves
unexpectedly or produces an unwanted result. It keeps incident-time diagnostics
separate from current readings and records unavailable telemetry honestly.
Both intake skills preserve requirements, corrections and consequential approvals
in a reviewed intent recap and interview record, with gaps and interpretations
labeled. Long feedback also uses verified indexed comments; see
[#46](https://github.com/AndrewGodlewsky/andrew-skills/issues/46).
It previews the complete report and requires your approval before submission
through `create-issue`. You can request a draft without publishing; an unavailable
dependency also leaves a useful draft. It does not fix or rerun the affected skill.
Client discovery and complete submission acceptance remain tracked in
[#45](https://github.com/AndrewGodlewsky/andrew-skills/issues/45).

`skill-steal` accepts an existing local skill by name, directory or SKILL.md path.
It preserves the original, captures its behavior and provenance, and drafts a GT
adaptation. It uses the enabled GT `grill-me` when intent or compatibility needs
clarification and `create-issue` for submission. Required checking/preparation
tools are bundled locally and need Node 22+; using them does not invoke
`create-skills`. Private or unshareable files are withheld with explicit gaps.
A draft-only request stays local. Intake is separate from adoption or installation;
actual client acceptance is tracked in
[#49](https://github.com/AndrewGodlewsky/andrew-skills/issues/49).

`caveman` offers only `light` and `full` chat styles. Full is the default; upstream
`lite` is an alias for light. Invoke `/gt:caveman light` or `/gt:caveman full`, then
use `/gt:caveman off`, `stop caveman` or `normal mode` to stop. The chosen mode lasts
for the current conversation. Unsupported intensities leave the mode unchanged
and prompt for light or full. It preserves exact technical details, uses normal
prose when clarity requires it, and leaves external artifacts in normal prose.
Only an enabled GT installation and normal skill loading are required: no hooks,
API keys, external runtimes or companion Caveman skills. See its
[usage and provenance guide](skills/caveman/README.md). The new source package
becomes available in installed GT copies after owner publication and native update.

## Update

### Update from chat

In a fresh Copilot chat, invoke:

```text
/gt:skills-update
```

This manual-only skill identifies the intended managed installation. It asks
which copy you mean when the available evidence is ambiguous. For a verified
CLI-owned copy, it refreshes `andrew-skills`, then updates `gt` only if refresh
succeeds. That route needs matching CLI/terminal access and respects client
approvals. For a VS Code-owned copy, it guides native update controls and resumes
after you report completion; it does not update a different CLI copy.

The skill captures available before-state in task/session state, then rechecks
the same installation and reports verified changes in four columns: Skill,
Previous version, Updated version and What changed. Missing prior state or
unverifiable identity limits comparison. It labels final-only notes and separates
user-reported completion, native results and observed file changes. There is no
Node, Git or release-catalog prerequisite for ordinary updates. A fresh chat is
recommended after success. Actual client behavior remains in the owner pilot.

The original updater shipped in plugin `0.1.3`; this working-tree enhancement is
part of plugin `0.1.5`. Until published, installed copies retain their earlier
behavior. Use your installation owner's native update route below to receive
published changes. The skill does not update automatically in the background.

### CLI-installed plugin (including the installer script)

For normal updates, run just:

```sh
copilot plugin update gt
```

This is GitHub's documented command for updating an installed plugin to its
latest version. It updates the whole `gt` package, including new skills and
changes to existing skills. You do not install each skill separately or rerun
the installer. See [GitHub's update guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing#managing-installed-plugins).

### How to check for an available update

In an interactive Copilot CLI session, enter `/plugin`. The dashboard flags
available updates and offers an **Update** action. This setup does not enable
automatic updates for our custom marketplace. If you only use the CLI-installed
skills in VS Code, do not rely on a VS Code notification for that installation;
check the CLI dashboard or run the update command when the team announces changes.

### Refreshing the marketplace versus updating the plugin

| Command | Purpose |
| --- | --- |
| `copilot plugin marketplace update andrew-skills` | Refresh the catalog so Copilot can discover its current plugin entries and versions. |
| `copilot plugin update gt` | Update the installed `gt` plugin and its skills. |

These commands are not interchangeable. A catalog refresh is not a substitute
for requesting a plugin update. GitHub documents plugin update as a standalone
command; a separate catalog refresh is not listed as a routine prerequisite.
If an announced version or plugin entry is missing, refresh the catalog first,
then update the plugin. Run the second command only if the first succeeds:

```sh
copilot plugin marketplace update andrew-skills
copilot plugin update gt
```

To run both steps in one line in **PowerShell 7, Bash, or Zsh**:

```sh
copilot plugin marketplace update andrew-skills && copilot plugin update gt
```

`&&` runs the plugin update only after the catalog refresh succeeds.
For **Windows PowerShell 5.1**, use this equivalent:

```powershell
copilot plugin marketplace update andrew-skills; if ($LASTEXITCODE -eq 0) { copilot plugin update gt }
```

The marketplace name is `andrew-skills`; the plugin name is lowercase `gt`.
See the [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
for catalog refresh, update notices, and optional marketplace auto-update settings.

### VS Code-installed plugin

For a VS Code-managed installation, open the Command Palette (`Ctrl+Shift+P` on
Windows/Linux or `Cmd+Shift+P` on macOS) and run
**Extensions: Check for Extension Updates** to check immediately.

To enable automatic updates, open the Command Palette and run
**Extensions: Enable Auto Update for Extensions**. Alternatively, open Settings,
search for `extensions.autoUpdate`, and enable it. VS Code's agent plugin
documentation says plugin update checks run every 24 hours when this is enabled.

For general extension update checking, also keep `extensions.autoCheckUpdates`
enabled in Settings. It controls automatic checking; `extensions.autoUpdate`
controls automatic installation. These settings affect other extensions too.
Your organization may manage them centrally.

Official documentation:

- [Agent plugin updates in VS Code](https://code.visualstudio.com/docs/agent-customization/agent-plugins#update-plugins)
- [Extension auto-update settings](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#extension-auto-update)
- [Checking and updating extensions manually](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#update-an-extension-manually)

These instructions apply to VS Code-managed updates. For a plugin installed by
our CLI installer, use the CLI commands above; enabling VS Code auto-update does
not configure Copilot CLI's marketplace auto-update setting.

After updating, test in a fresh chat so previously loaded instructions do not
affect the result.

## Test locally before publishing

Register the checkout root in VS Code's **User Settings (JSON)**:

```json
{
  "chat.plugins.enabled": true,
  "chat.pluginLocations": {
    "A:/Claude/andrew-skills": true
  }
}
```

Replace the path with your checkout location on another machine. Open
**Chat: Configure Skills**, confirm `grill-me` is listed from `gt`,
and try the command above in a fresh chat. If missing, confirm the plugin is
enabled and reload the window.

Local registration reads your checkout. Update the checkout yourself. Disable
the local registration before testing a GitHub-installed copy.

### If you tested an earlier installation

The plugin was renamed from `andrew-skills` to `gt` in version `0.1.2`.
If you installed the old plugin (directly or through the marketplace), uninstall
that copy through the client that installed it, then install `gt` using the
marketplace instructions above. For the CLI, the uninstall command is
`copilot plugin uninstall andrew-skills`. An update to the old name does not
replace this migration. The repository and marketplace remain `andrew-skills`.
The installer does not remove previous installations automatically.

Uninstall the old `team-core` plugin through the client that installed it and
remove its local registration if present. Replace a registration pointing to
`plugins/team-core` with the checkout root above. If you already registered this
marketplace, refresh it with `copilot plugin marketplace update andrew-skills`,
then install `gt@andrew-skills`.

## Repository layout

```text
plugin.json                  Plugin identity and version
.claude-plugin/marketplace.json  Catalog listing this root plugin
install.ps1                  One-command setup from a downloaded checkout
skills/
  grill-me/
    SKILL.md                 Self-contained interview skill
    release.yaml             Independent skill version and release note
  why-not/
    SKILL.md                 High-level intent and simplicity reviewer
    release.yaml             Independent skill version and release note
  skills-update/
    SKILL.md                 On-demand CLI plugin update skill
    release.yaml             Independent skill version and release note
  skills-status/
    SKILL.md                 Read-only installed skill report
    release.yaml             Independent skill version and release note
    references/              Bundled installation selection procedure
  skills-restore/
    SKILL.md                 Browse/select personal historical export
    release.yaml             Independent skill version and release note
    references/operations.md Fixed helper calls and recovery procedure
    scripts/exporter/        Complete bundled exporter and direct guide
  create-issue/
    SKILL.md                 Model-only GT submission dependency
    release.yaml             Independent skill version and release note
    references/              Helper protocol and label meanings
    scripts/                 Five generated runtime modules
  create-skills/
    SKILL.md                 Specification-first authoring workflow
    release.yaml             Independent skill version and release note
    references/              Interview, writing, checks, delivery and installation
    scripts/                 Generated local checking/preparation/installation tools
    assets/                  Attribution/license notice
  skill-tweak/
    SKILL.md                 GT incident intake and approved feedback submission
    release.yaml             Independent skill version and release note
    references/evidence.md   Diagnostic provenance and evidence collection
    templates/issue.md       Complete outgoing issue draft layout
  skill-steal/
    SKILL.md                 Source-first import and review submission
    release.yaml             Independent skill version and release note
    references/              Source preservation, clarification, checks and delivery
    scripts/                 Generated local checker and handoff planner
exporter/                    Same fixed helper for checkout-based recovery
scripts/issue-submission/    Maintained submission helper and development guide
scripts/build-issue-submission.mjs  Deterministic bundle build / --check
scripts/create-skills/       Maintained creator tools; no network client
scripts/build-create-skills.mjs  Deterministic tools/rules bundle build / --check
scripts/skill-steal/         Maintained check/prepare/next entry point
scripts/build-skill-steal.mjs  Bundled shared tools/rules and adapted delivery guide
scripts/validate.mjs         Local and CI validation
.github/workflows/validate.yml
README.md
CONTRIBUTING.md
```

The repository root is the plugin root. Its manifest uses
[Agent Plugins 1.0](https://agent-plugins.org/plugin-authors/manifest).
The marketplace lists this same root with `"source": "./"`; there is no nested
plugin bundle. See the [marketplace format](https://code.claude.com/docs/en/plugin-marketplaces).
Add future skills under `skills/`; everyone installing the plugin receives them
together.

## Contribute and validate

To propose a skill or report confusing behavior, open an issue with the task,
draft or experience you want considered; a finished package is not required.
Authors and agents changing skills should use [CONTRIBUTING.md](CONTRIBUTING.md),
the single current guide with complete examples, the header standard, a short
checklist and release workflow. Keep change-specific expectations and observed
checks in the existing issue or PR carrying the change.

### Per-skill releases

Each skill has a **`release.yaml`** beside
`SKILL.md`, containing its **`x.y.z` version** and a short user-facing release
note. New skills start at **`1.0.0`**. Use patch increments for compatible fixes,
minor increments for compatible additions, and major increments for incompatible
changes to documented usage. A skill's version is separate from the containing
`gt` plugin version; unchanged skills keep their versions. Even typo or release-note
corrections get a new version; note-only corrections use a patch. A removed skill reintroduced under the same name
restarts at `1.0.0`; exact source snapshots distinguish repeated version labels.

**Names inside the GT plugin stay unchanged**: `grill-me` stays `grill-me`.
Only optional historical personal exports use names such as `grill-me-v1-2-0`.
The [skills-restore skill](skills/skills-restore/SKILL.md) creates that personal copy and leaves it to the user;
it never overwrites an existing destination or manages the copy afterward.
The [fixed exporter helper](exporter/README.md) implements direct list, plan,
create-only export and read-only recovery inspection. It requires Node and Git;
normal skill use does not add those requirements. Windows implementation checks
are recorded in [issue #14](https://github.com/AndrewGodlewsky/andrew-skills/issues/14);
WSL and live-client acceptance remain outstanding. See the
[personal export contract](docs/planning/skill-personal-export-contract.md).

The [reviewed interaction design](docs/planning/skill-interaction-prototype-notes.md)
keeps `skills-update` direct: update the whole GT plugin, including additions and
removals, then show a table of changed skills, previous versions, installed
versions and short change notes. There is no removal-confirmation step.
Update reporting is implemented in the skill instructions, with supplied-evidence
scenario checks. For a personal copy, invoke `/gt:skills-restore` and name the
skill you want to browse. It shows release notes, the target environment and
proposed personal paths. Selecting a displayed source requests creation without
another confirmation; an exact initial version request still gets a selection
step. Portability review can reject a source before creation. The complete helper
travels inside the skill, with no runtime package installation. Implementation
evidence is tracked in [issue #11](https://github.com/AndrewGodlewsky/andrew-skills/issues/11);
live Copilot discovery and invocation remain pending in the owner pilot.

The [implementation handoff](docs/planning/skill-versioning-implementation-handoff.md)
tracks the work and owner pilot before team adoption. Existing users retain the
native update path. Edits inside managed GT skills are unsupported and native
updates replace them; personal and project-level skills remain user-owned.

The manual [skills-status report](skills/skills-status/SKILL.md) shows only
installed GT skills: skill name, installed version and that release's short note.
It reads one selected local installation without online release comparisons or
personal-copy tracking. Invoke `/gt:skills-status`; when several installations
are plausible it asks which one to report. It requires file-read access, with
no Node.js or Copilot CLI requirement. Client verification remains in the pilot.

The validator checks release metadata and version transitions, including the
first complete `1.0.0` baseline. The **Validate skills and releases** CI job checks
prospective PR merges against current `main`. Andrew will configure required
merge checks later. Each bundle change increments the overall plugin patch
version once, regardless of how many skills changed. The
[historical catalog and versioned reader API](docs/release-catalog.md) derive
exact release records from complete preserved first-parent history and extend
the same release check. The fixed helper is bundled both in root `exporter/`
and inside `skills-restore`. Run `node scripts/build-exporter.mjs --check` to check
bundle freshness and `node --test scripts/export-*.test.mjs` in the selected
Windows or WSL environment for exporter tests. These tests use isolated
temporary homes and existing Git objects; they create no Git history.
Authors and agents should follow the
[contributor guidance](CONTRIBUTING.md) for the supported metadata format and
workflow.

### Current validation

See [CONTRIBUTING.md](CONTRIBUTING.md). With Node.js 22 or newer installed:

```sh
node scripts/validate.mjs
node scripts/build-issue-submission.mjs --check
node --test scripts/issue-submission*.test.mjs
node scripts/build-create-skills.mjs --check
node scripts/build-skill-tweak.mjs --check
node scripts/build-skill-steal.mjs --check
node --test scripts/create-skills*.test.mjs scripts/skill-tweak*.test.mjs scripts/skill-steal*.test.mjs scripts/intent-record.test.mjs
node scripts/validate.mjs --base origin/main --current-main origin/main
node --test scripts/release-validation.test.mjs scripts/release-snapshots.test.mjs scripts/skill-architecture.test.mjs scripts/release-catalog.test.mjs scripts/release-catalog-reader.test.mjs
```

The plain validator checks metadata and structure. The comparison command also
checks published history and version transitions against your local `origin/main`; ensure that ref is
current first. It does not contact GitHub. Release comparisons and snapshot tests
require Git. See [validation details](CONTRIBUTING.md#run-validation) for committed
candidates, stale-base checks and CI behavior.

No package installation is needed for validation. Consumers do not need Node.js
to run the `grill-me` skill. Installing and invoking the plugin in VS Code is the
end-to-end acceptance check.

The imported compression runtime also has offline regression checks. With
Python 3.10+ installed, run `python -B scripts/caveman-compress-checks.py`.
These use synthetic temporary files and mocked provider responses; they require
no Claude credentials or API calls. CI runs them on Windows and Linux. Local
results do not establish live provider behavior or semantic equivalence.

Maintain submission runtime code under `scripts/issue-submission/`, then run
`node scripts/build-issue-submission.mjs`; do not edit the generated skill copies.
The issue-submission CI matrix runs its offline tests and bundle check on Windows
and Linux with Node 22/24, without live credentials or writes. A local pass does
not establish that pending remote jobs or Copilot client checks passed. The
helper stays bound to GT when copied or renamed; relative resources alone do not
establish eligibility for the conservative personal exporter. Do not relax
exporter guards to make this submission skill exportable.

## Skill provenance

`caveman` adapts the [upstream style skill at 2fd153c6](https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/skills/caveman/SKILL.md)
with only light/full modes, light/lite equivalence, explicit unsupported-mode
handling, and host-required progress updates. It preserves meaningful uncertainty
and removes unverified tokenizer claims. Its [MIT notice](skills/caveman/LICENSE)
is bundled. Manual and model invocation are enabled for explicit Caveman-style
requests. Session hooks, upstream engine/proxy products and other Caveman skills
are not dependencies and are not included in this adaptation.
The request, exception rationale and actual checks are tracked in
[#60](https://github.com/AndrewGodlewsky/andrew-skills/issues/60).

`caveman-commit`, `caveman-review`, `caveman-explore` and `caveman-compress`
adapt Julius Brussee's
[`JuliusBrussee/caveman` at 2fd153c6](https://github.com/JuliusBrussee/caveman/tree/2fd153c67988e980fb0b2455c90832159a6a5a25/skills).
Each package includes the upstream 2026 MIT notice and its own adaptation notes.
GT adds supported headers, initial release metadata and explicit input and failure
handling. Manual and model invocation remain available to preserve phrase-based
selection; aliases and client discovery still require live-client verification.
Explore uses the host's available delegation tools and model while retaining a
separate read-only context; it requires delegation support. Compress requires
Python 3.10+ and an authenticated Claude CLI or Anthropic SDK setup and sends
selected file content to that provider. Review and validation records are
[#55](https://github.com/AndrewGodlewsky/andrew-skills/issues/55),
[#56](https://github.com/AndrewGodlewsky/andrew-skills/issues/56),
[#57](https://github.com/AndrewGodlewsky/andrew-skills/issues/57) and
[#58](https://github.com/AndrewGodlewsky/andrew-skills/issues/58).

`grill-with-docs`, `grilling` and `domain-modeling` adapt the corresponding skills
and the two domain document formats from Matt Pocock's
[`mattpocock/skills` at c55ee460](https://github.com/mattpocock/skills/tree/c55ee46073ed923f86ce59a5eb3b6d895095d1b7).
The wrapper resolves both enabled GT dependencies instead of requiring a
client-specific Skill tool. Adaptations add GT headers and release metadata,
missing-input/access handling, repository documentation conventions, cancellation
boundaries, user-selected question pacing, and local fact-finding when delegation
is unavailable. The two dependencies permit model invocation so the wrapper can
compose them; the wrapper remains manual-only. Each package includes Matt's
2026 MIT notice: [wrapper](skills/grill-with-docs/assets/matt-pocock-license.txt),
[interview](skills/grilling/assets/matt-pocock-license.txt), and
[domain modeling](skills/domain-modeling/assets/matt-pocock-license.txt).
The request, invocation rationale, expected behavior and actual validation are
tracked in [#48](https://github.com/AndrewGodlewsky/andrew-skills/issues/48).

`skill-tweak` contains original instructions proposed in
[#45](https://github.com/AndrewGodlewsky/andrew-skills/issues/45) through the GT
`create-skills` workflow. At review, the installed creator skill was 1.0.0 in
GT plugin 0.1.10; the originating execution's artifact identity was not recovered.
The package includes no copied upstream writing-guide text. Its local delivery
helper shares the maintained GT handoff planner with create-skills.
It delegates submission to the enabled GT `create-issue` dependency. The issue
records independent review, checks and the refinement to check submission
readiness before asking for publication approval.

`skill-steal` contains original instructions proposed through GT Create Skills in
[#49](https://github.com/AndrewGodlewsky/andrew-skills/issues/49). Its adoption
bundles the maintained GT checker, package rules and submission planner rather
than requiring runtime access to Create Skills resources. It delegates conditional
clarification to GT Grill Me and delivery to GT Create Issue. No third-party skill
or upstream writing-guide text is imported in this initial package. Future
imports must retain their own attribution and reuse terms in their review record
and adapted package.

`create-skills` adapts Matt Pocock's former `write-a-skill` process from commit
`985d8fce764dae479e7b77b632429abe38891ee8` of `mattpocock/skills` and the
`writing-for-agents` guidance/skill mechanics in his installed plugin 1.2.3.
It includes an adapted interview, specification-first submission, GT-specific
invocation/architecture rules and an optional personal copy. It omits obsolete
line-count limits and upstream client-specific invocation claims. The
[MIT notice](skills/create-skills/assets/matt-pocock-license.txt) travels with the
adaptation. Exact reviewed source hashes are recorded in
[the architecture notes](docs/planning/create-skills-architecture-notes.md#source-identity-recorded-for-adaptation).

Maintain creator tools under `scripts/create-skills/`, shared package validation
under `scripts/skill-package-validation.mjs`, and GT rules in CONTRIBUTING.md.
Maintain shared intent guidance in `scripts/intent-capture.md`, input validation
in `scripts/intent-record.mjs`, delivery in `scripts/review-handoff.mjs`, and tweak
commands in `scripts/skill-tweak/`. These builds copy shared resources into their
self-contained packages. Run `node scripts/build-skill-tweak.mjs` for tweak and
`node scripts/build-create-skills.mjs` for creator changes, and use
`--check` for freshness verification. The generated package-rules excerpt uses
declared unique anchors in the guide; adjust the generator deliberately if those
sections move. Do not edit generated skill scripts or package-rules.md directly.
The Windows/Linux Node 22/24 CI matrix runs offline creator tests; it does not
prove model behavior or client invocation. See the
[creator acceptance record](docs/research/create-skills-acceptance.md).

Maintain the Skill Steal entry point under `scripts/skill-steal/`; run
`node scripts/build-skill-steal.mjs` after changing shared checker/planner sources,
CONTRIBUTING.md, or the creator tools/submission guides. Its builder adapts the
shared delivery guide to omit personal installation and link its conditional
clarification record. Unexpected guide changes fail the build for review.
Use `--check` for freshness, and do not edit its generated scripts, package rules,
tools or submission guide directly. Changes to shared sources may affect several
distributed packages; apply release rules to each package actually changed.

`grill-me` was imported from Andrew's user-level skill on September 10, 2026.
The original was an alias for `/grilling`. This version preserves the `grill-me`
metadata and includes the original `grilling` instructions directly, so it has
no dependency on another personal skill.
