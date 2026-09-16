> Superseded historical design. See [the current GT archive contract](../skill-versioning-decisions.md). The contents below preserve the earlier decision/proposal and do not direct new work.

# Skill distribution — architecture proposal

Issue: [Choose a distribution model for independently selected skill versions](https://github.com/AndrewGodlewsky/andrew-skills/issues/4).

**Status: under reconsideration after the owner's latest Round 3 feedback.** The owner still requires individual skill versions but is questioning managed rollback and suggesting a separate directory for saved older skills. [Simpler alternatives](../skill-distribution-simplification.md) compares that idea with this design. The material below records the previously selected approach; do not treat the runtime prerequisite as the only remaining decision or implement it while the scope change is being discussed. Original answers remain in [Round 1](../skill-distribution-round-1.md), [Round 2](../skill-distribution-round-2.md), and [Round 3](../skill-distribution-round-3.md).

## What the answers establish

| Owner input | Consequence |
| --- | --- |
| Updates and rollback must be simple and deterministic, with little agent work | A maintained script should resolve releases and change files. The agent supplies choices and explains the result. |
| The owner explicitly chose the locally assembled `gt` plugin | Keep the plugin identity and independently select each contained skill. Familiar qualified commands remain the intended contract, subject to deferred verification. |
| Fixed-helper recovery is acceptable; the owner suggested a dedicated restore skill | Keep the direct helper fallback and carry a thin restore-skill entry point into the interaction design. Do not ask an agent to rewrite helper source. |
| Windows and WSL are required; PowerShell 7 cannot be assumed | Cover both environments. Propose PowerShell 5.1-compatible and shell launchers around one shared implementation. |
| Separate Windows/WSL installations are acceptable | Each target owns its files, selections, and pins across projects; no automatic synchronization. |
| Setup edge cases can be brought to the owner | Avoid an elaborate runtime installer or packaged-executable project. Clarify whether Node itself can be a prerequisite; its availability is not established by a working plugin installation. |

The [accepted behavior](../skill-versioning-decisions.md) still governs: latest by default, all active skills on fresh/full updates, selected updates allowed, tracked pins with newer-release offers, complete historical restoration, and user-owned copies for preserved retired skills. Selections apply across projects in an installation. No team recommendation profiles, project policies, or background installation are introduced.

## Selected distribution model

Use a fixed local helper to assemble a **local `gt` plugin containing each user's selected skill releases**. Copilot loads that plugin; the helper manages its files and per-skill records. Keeping a plugin wrapper and controlling individual skill versions are compatible design choices.

The first proposal unnecessarily coupled helper ownership with loose personal skill folders. Those are separate decisions. In Round 2 the owner chose the local plugin because it preserves recognizable team grouping while supporting independent versions. The already deferred compatibility checks still apply.

The plugin is a container for selected skills. Its own version does not describe every contained skill's release. For example:

```text
Managed local plugin — name: gt
  skills/grill-me/       complete release 1.4.0
  skills/skills-update/  complete release 1.2.0

Separate helper records:
  grill-me: installed 1.4.0, pinned
  skills-update: installed 1.2.0, ordinary updates
```

Versions are illustrative. The helper constructs this combination from the release catalog's commit/path entries. It preserves exact skill files and supporting resources; it does not alter historical frontmatter or inject aliases.

## Enrollment and everyday use

The helper is version-management code used throughout the installation's life, not merely a setup troubleshooter. The owner's Round 3 answer asks why it is needed when Copilot CLI already installs the current plugin successfully. That installation success is not in dispute, and the answer does not accept a Node prerequisite.

For initial enrollment, the helper prepares the latest complete skill folders and local records. Copilot CLI can still register/load the resulting local plugin through its supported plugin mechanism; VS Code uses its own registration path. For later update/rollback/status operations, chat skills pass inputs to the helper, which manages individual releases and records. Native plugin registration alone does not implement these selection rules. [Copilot CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)

The selected model changes the active plugin source from the remotely updated bundle to the managed local collection. Do not promise that today's exact remote-marketplace install commands are sufficient or remain unchanged. The migration issue owns the smallest one-time enrollment flow, including delivery of the helper and native registration. Keeping CLI involved in registration does not give its ordinary whole-plugin updater ownership of the helper's selected files.

JavaScript/Node is a proposed implementation for the version-management code. Its benefit is sharing one implementation across Windows and WSL; it adds no special native plugin-installation feature. Runtime acceptance remains open pending the explanation and follow-up in [Round 3](../skill-distribution-round-3.md).

## Prefix and feasibility evidence

This repository's folder is `andrew-skills`, but `plugin.json` names the plugin `gt`. VS Code documents that plugin identity supplies the prefix. The skill's own `name` remains an unqualified identifier. [VS Code skill naming](https://code.visualstudio.com/docs/agent-customization/agent-skills#skillmd-file-format)

VS Code supports local plugin directories through `chat.pluginLocations`. This is a building block for the proposal, not proof of the complete design. [Local plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins#use-local-plugins)

The earlier CLI experiment registered a local directory plugin, discovered its skills, and reported loading its directory live. Its update-all command reported nothing to update for that local source. This supports materializing files locally before registration. [CLI evidence](../../research/compatibility-evidence/cli-local.json)

Two failures remain constraints: personal overrides hid qualified plugin commands, and the tested external-GitHub-SHA source through a directory marketplace did not create a usable installed entry. This proposal uses already materialized local folders, not that failed installation combination. Personal/project name collisions still require detection and explicit resolution. End-to-end invocation, VS Code activation, WSL, resource loading, existing chats, and native updater behavior remain deferred checks. [Results and limits](../../research/skill-version-compatibility-results.md)

## Alternatives

| Approach | User experience | Main cost or gap |
| --- | --- | --- |
| Current remote bundle plus personal overrides | Familiar native install; older versions become overrides | Whole-bundle updates also affect skipped unpinned skills. Native updates, retirement timing, and qualified-name failures need protection. |
| **Helper assembles a local `gt` plugin** | One setup per environment; plugin grouping; chat invokes deterministic updates | We maintain helper and client registration. Invocation and updater isolation need later verification. **Selected in Round 2.** |
| Helper installs loose user-level skills | Same deterministic updates; simpler packaging | True plugin prefix is lost. A literal `gt-grill-me` name is a rename, not a namespace, and conflicts with preserving historical names/bytes. |
| One plugin per skill | Native package boundaries align with skills | More catalog/registration machinery; selection state and retirement handling still needed. Failed external-SHA path needs a successful alternative. |

All options need historical releases and persistent selection records. Today's native whole-plugin updater alone cannot express the agreed per-skill behavior.

## Deterministic work and agent responsibilities

The agent invokes a fixed, tested command with inputs such as operation, skill identifier, and requested version. It must not edit variables inside the helper's source or generate a new updater each time. The helper performs no model calls and returns a concise structured summary, avoiding agent inspection of every skill's contents.

Proposed operations are preview, apply, rollback, status, and repair. These are design labels, not working commands. A preview resolves catalog entries, installed versions, pins, and selections into a bounded change plan. Apply uses that same plan, rejects stale state, validates destinations and complete release content, and preserves recoverable prior state. Invalid or unavailable releases leave the installed skill and pin intact. Exact protocol, concurrency, integrity, and recovery belong to [the local version changes issue](https://github.com/AndrewGodlewsky/andrew-skills/issues/6).

The ordinary path stays short: invoke the update skill, see versions/notes and relevant choices, then let the script execute the requested selection. Pinned-version offers and cancellation rules remain intact; the interaction prototype chooses exact wording. “Automatic” means execution of a user-requested update, not background installation. This reduces agent work but does not guarantee a particular credit cost or remove client tool-approval policies.

## Ownership and recovery

| Item | Proposed responsibility |
| --- | --- |
| Sources and history | Team repository and preserved Git history. Each release resolves to a full commit plus complete skill folder path. |
| Release catalog and notes | Publishing process; immutable release identity and availability. Format and numbering remain in the publishing issue. |
| Active local plugin | Helper; one complete selected release per managed skill, including `skills-update`. |
| Installed versions and pins | Helper records outside the active plugin and disposable client caches; track source, version, ownership, and recovery state. |
| Client registration | Setup/repair maps CLI or VS Code to the managed plugin. VS Code-only users should not need CLI just for installation. |
| Chat loading | Client; installed files do not establish which instructions an existing conversation has loaded. |
| Retired personal copy | User after explicit verified handoff; outside managed updates and support. |
| Helper maintenance | Separately versioned infrastructure, independently callable when `skills-update` cannot load or is incompatible. |

Every active skill can be retained, including `skills-update`. Define a stable command contract between skills and helper; incompatible old instructions receive a recovery route without silently clearing their pin. Helper upgrades are explicit. The helper remains usable outside the update skill and its replaceable folder.

Provide a copyable direct recovery command using the same helper and validated inputs, including listing available versions. Teammates should not need Git commands, commit IDs, or script editing to restore a release. Missing historical content produces an explanation and preserves installed state, not a guessed substitute.

The owner's suggested dedicated restore skill fits this design. Recommend prototyping it as a thin chat guide: show historical releases/notes, accept a selection, explain automatic retention, and call the same helper. It must not contain a second restoration engine. The interaction issue owns the final entry-point name and transcript. Like other active skills, any restore skill is independently versioned and retainable. It supplements the direct fallback: if the plugin or both management skills fail to load, another skill inside that plugin cannot provide independent recovery.

## Windows and WSL

The current candidate is one Node implementation, a Windows PowerShell 5.1-compatible launcher, and a WSL shell launcher. The current installer already declares PowerShell 5.1. The owner wants setup edge cases handled personally rather than a substantial provisioning or packaging effort. That does not yet establish whether requiring Node is acceptable; Round 3 separates the prerequisite from automating its installation. No exact runtime minimum is selected.

Today's `install.ps1` invokes Copilot's plugin commands and does not run our proposed version manager. A JavaScript helper would need an executable Node runtime in its target environment. GitHub documents several CLI installation routes, with a Node prerequisite specifically for npm. A successful CLI installation is therefore insufficient evidence of a separately callable Node runtime. This is a prerequisite of the candidate helper implementation, not of skill versioning in general. [Copilot CLI installation](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)

Windows and each WSL installation are separate managed targets, with separate files/state, as accepted in Round 2. A pin remains consistent across projects using that target. Setup and status label the target; an update affects only that target. Do not share one writable plugin directory across Windows and WSL by default. Automatic synchronization would be an explicit scope change.

The owner reports successfully installing the current plugin through WSL with Copilot CLI. Record this as positive owner-reported baseline experience. It does not verify the new helper, mixed-release local plugin, or VS Code/WSL activation; those remain later checks. No repeat of that setup is requested.

VS Code can combine a Windows interface with extensions running locally or in WSL. A terminal's current directory alone therefore does not identify the intended plugin registration target. Setup must bind and verify that target; ambiguous routing stops before changes. Exact discovery paths remain later validation work. [VS Code WSL architecture](https://code.visualstudio.com/docs/remote/wsl)

## Example: retain one skill and update another

| Step | `grill-me` | `skills-update` |
| --- | --- | --- |
| Fresh installation | 1.4.0, unpinned | 1.1.0, unpinned |
| Team publishes both in one commit | Installed files unchanged | Installed files unchanged |
| User updates only `skills-update` | Still 1.4.0, unpinned | 1.2.0 |
| User tries new `grill-me` | 1.5.0 | Still 1.2.0 |
| User restores `grill-me` 1.4.0 | Complete old folder retrieved and pinned | Still 1.2.0, files unchanged |
| Next update | Offer newer release; preserve pin if declined | Update if eligible |

The local plugin can contain this mixture without maintaining an older branch. Returning to latest clears the pin only after success. Replacing on-disk files does not promise an instantaneous switch inside an existing chat.

## Native updater, migration, and retirement

The migrated plugin must be registered as a helper-owned local source, not a remotely updated clone of the complete collection. Native marketplace refresh must have no authority to replace its selected files. This is an architecture requirement to validate later, not an assertion that every client already honors it.

Migration preserves and verifies existing selections before disabling the conflicting remote `gt` registration. A legacy remote bundle and managed local plugin with the same identity cannot remain simultaneously active. Establish recoverable file and registration steps, preserve unrelated client configuration, and preserve the prior usable setup on failure.

A retired skill remains available until the user chooses removal or a personal copy. Keeping it requires complete verified export, including version/notes, before removing its managed copy. Refuse collisions without overwriting user files. The copy leaves plugin ownership and may lose `gt:` grouping; explain its resulting invocation and location. This handoff differs from retaining an active skill inside `gt`.

## Repository implementation handoff

| Current area | Later work |
| --- | --- |
| `skills/` | Preserve complete canonical sources; version each changed skill independently. |
| `plugin.json` / marketplace | Retain `gt` identity for generated local installations; define transition from the remote bundle. Catalog refresh must not replace selections. |
| `install.ps1` | Enroll/migrate the managed plugin and configure helper prerequisites; add WSL launcher. |
| `scripts/validate.mjs` | Retain resource validation; add release/local-package checks and revise assumptions tied to one remote bundle version. |
| `skills-update` | Invoke the helper's stable selection/update protocol. |
| User/maintainer docs | Explain setup, versions/notes, local-plugin ownership, direct recovery, environment targets, and publishing. |

## Closure and handoff

Round 2 settles the fixed-helper workflow, local plugin packaging/prefix, and separate Windows/WSL installations. Preserve those decisions in downstream context now. Carry the restore-skill suggestion into the existing interaction prototype; a new standalone investigation is unnecessary. Round 3 asks only whether a Node prerequisite with manual setup support is acceptable. Do not convert the owner's reluctance to build setup machinery into approval of an additional runtime dependency.

After that clarification, record the final resolution, close this architecture issue, and index its decision on the map. Exact runtime version, helper command syntax/state format, catalog numbering, and client acceptance checks remain assigned to the existing downstream issues. They do not require reopening the accepted distribution model.

No production implementation, new live client tests, or Git publishing is part of this round. Live validation remains deferred under the [accepted compatibility resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/10#issuecomment-5674093165).
