# Independent skill versions: client capability research

> Current planning scope: native GT updates plus a separate `gt-archive` collection. See [the accepted architecture](../planning/skill-distribution-proposal.md). This notice supersedes earlier managed-pin handoff assumptions; all observations, failures, and unexecuted checks below remain historical evidence with their original limits.

Research date: 2026-09-14. Ticket: [Verify independent skill version support in Copilot CLI and VS Code](https://github.com/AndrewGodlewsky/andrew-skills/issues/2).

## Finding

Independent version selection needs a distribution and selection mechanism beyond the current `gt` bundle. Separate plugins and managed standalone skill directories are plausible candidates. Neither is yet verified to satisfy the complete pin/update/rollback experience across both clients. This research narrows the options; the owner still chooses the architecture.

In particular, distinguish **an immutable release reference** from **a user's persistent choice to retain that release**. A team catalog can change the former without respecting the latter unless the system explicitly preserves the user's choice.

## Evidence and limits

- Repository inspected at `b144bd105bf125b78bf95b6fc229e2cb9d4ff493`, initially clean. The root manifest is `gt` version `0.1.3`. The installer installs that bundle; the update skill updates it as a unit. The validator requires exactly one marketplace plugin with source `./`. No individual release catalog, pin record, or release notes mechanism exists in this checkout.
- `Get-Command copilot` found no CLI executable on PATH. No CLI version or command behavior was tested. VS Code contains an embedded Copilot package, but this was not treated as a supported standalone CLI installation.
- Installed VS Code package metadata identifies `1.137.0`, commit `645f29cc3176500b4b5762ba887cf2a7f0ffdf2c`, build date `2026-09-08`. This is an inventory observation, not an installation or invocation test.
- Public VS Code source was inspected at `38246c086c8a825ca90190749dd88df6effec257`. That revision differs from the installed build. Source findings describe that revision, not guaranteed behavior of every released client.
- No installed skills, client settings, caches, or authentication were changed. No install, update, rollback, live chat, or upstream test suite was run.

Evidence classes: **D** documented; **S** source-inspected; **L** locally observed; **U** unknown/unverified; **N** absent from the documented management interface or unsupported by the current project. Absence from documentation is not proof that an undocumented capability cannot exist.

## Capability matrix

| Capability | CLI-managed plugins, also discovered by VS Code | VS Code-managed marketplace plugins | Local registration / standalone skills |
| --- | --- | --- | --- |
| Install and update separately | **D:** named plugin install/update; current `gt` still bundles both skills. [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference) | **S:** relative-path plugins share their marketplace checkout; a folder split alone does not isolate updates. [Repository service](https://github.com/microsoft/vscode/blob/38246c086c8a825ca90190749dd88df6effec257/src/vs/workbench/contrib/chat/browser/agentPluginRepositoryService.ts#L395) | **D:** supported project/personal skill directories; **U:** our version manager and cross-client registration behavior. [VS Code skills](https://code.visualstudio.com/docs/agent-customization/agent-skills#create-a-skill) |
| Identify exact release content | **D:** GitHub/URL source descriptors accept a full commit `sha` and optional path. [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference#plugin-source-types) | **S:** Git sources check out requested commits; cache paths include revision identity. [Source implementation](https://github.com/microsoft/vscode/blob/38246c086c8a825ca90190749dd88df6effec257/src/vs/workbench/contrib/chat/browser/pluginSources.ts#L199) | **U:** a manager could materialize verified release directories; ordinary local files have no automatic release identity. |
| Retain one version through later updates | **U:** source pinning is documented, but a persistent per-user hold against catalog changes is not established. | **S/U:** update-all re-reads catalog descriptors and attempts changed sources; it does not establish an individual hold contract. [Update flow](https://github.com/microsoft/vscode/blob/38246c086c8a825ca90190749dd88df6effec257/src/vs/workbench/contrib/chat/browser/pluginInstallService.ts#L381) | **U:** feasible only if the manager owns selection and preserves complete snapshots; live directories remain mutable. |
| Restore an earlier skill version | **N/U:** no documented plugin rollback or per-skill version selector; historical retrieval needs a defined workflow. [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference) | **U:** commit checkout is a building block, not a verified rollback interface. | **U:** restoring a complete directory is a candidate, not an implemented operation. |
| Inspect installed versions | **D:** `copilot plugin list --json` can include plugin version. [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference#copilot-plugin-list-options) | **S:** plugin discovery reads manifest version with marketplace fallback. [Discovery](https://github.com/microsoft/vscode/blob/38246c086c8a825ca90190749dd88df6effec257/src/vs/workbench/contrib/chat/common/plugins/agentPluginServiceImpl.ts#L365) | **D:** `copilot skill list --json` identifies source/path/enabled state, without a version field. [Skill commands](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#managing-skills-non-interactively) |
| Already loaded chat instructions | **U:** installed state alone cannot establish the exact content already injected into a conversation. | **U:** same limitation; a file observation is not session evidence. | **U:** report installed content separately and test fresh-chat activation. |

## Installation and update boundaries

The documented CLI separates marketplace refresh from plugin update. Custom marketplace auto-updates require opt-in; a publisher push does not itself require consumer installation. [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference#copilot-plugin-update-options)

VS Code discovers CLI-installed plugin directories. Its source discovers those entries without VS Code marketplace metadata, supporting the inference that discovery does not transfer update ownership to VS Code's marketplace updater. Verify that boundary in a live client. [Discovery implementation](https://github.com/microsoft/vscode/blob/38246c086c8a825ca90190749dd88df6effec257/src/vs/workbench/contrib/chat/common/plugins/agentPluginServiceImpl.ts#L979)

VS Code documents local registration through `chat.pluginLocations`, marketplace update checking, and workspace plugin recommendations. Recommendations are useful enrollment mechanisms, but do not specify the requested team-version-plus-individual-override model. Its plugin guide describes extension update checks; the inspected upstream code also filters automatic operations by marketplace auto-update settings. Treat the exact automatic-update path as version-sensitive. [Plugin guide](https://code.visualstudio.com/docs/agent-customization/agent-plugins), [update implementation](https://github.com/microsoft/vscode/blob/38246c086c8a825ca90190749dd88df6effec257/src/vs/workbench/contrib/chat/browser/pluginInstallService.ts#L381)

The source reveals an additional edge case: Git cache locations differ by revision, while update returns without updating if the target checkout is absent. Consequently, even adopting a catalog's new SHA must be tested with a cold cache; reading the descriptor is insufficient proof of successful activation. [Git source lifecycle](https://github.com/microsoft/vscode/blob/38246c086c8a825ca90190749dd88df6effec257/src/vs/workbench/contrib/chat/browser/pluginSources.ts#L90)

## Standalone skills, names, and notes

The CLI documents `copilot skill add` for files, URLs, and directories: files/URLs copy content, while directories register a custom source. It does not document a skill update/version command. A single Markdown download cannot be assumed to preserve scripts and templates. Project/personal names take priority over plugin skills. The command reference describes qualified plugin invocation with `/plugin/skill`; VS Code documents `/plugin:skill`. Test actual commands rather than assuming the existing `/gt:...` survives a distribution change. [CLI skills](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skills-reference), [VS Code names](https://code.visualstudio.com/docs/agent-customization/agent-skills#header-required)

There is also documentation tension: the CLI plugin reference describes first-found skill deduplication, while the command reference describes same-name plugin skills coexisting under qualified commands. Treat duplicate-name routing as unresolved until tested, especially during migration.

The Agent Skills format allows string-valued `metadata`, including a version example. It supplies a place to declare a version, not publication, history, rollback, or release-note semantics. This repo's lightweight validator does not parse nested metadata mappings, so adopting that representation would require validator changes. A sidecar release record is another design option. No metadata format is chosen here. [Agent Skills specification](https://agentskills.io/specification#frontmatter)

CLI telemetry documents a skill-invocation event with plugin identity/version. That is a possible future observation source, not a user-facing inventory or a guarantee of individual skill content identity. [CLI telemetry](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#events)

## Feasible options and tradeoffs

These are research inferences, not architecture decisions.

| Candidate | Useful property | Remaining design work |
| --- | --- | --- |
| Current bundle plus version metadata | Small publishing change; preserves current install and commands | Does not deliver independent selection. Any generated composite bundle needs a new selection mechanism and protection from upstream replacement. |
| One plugin per skill with immutable external source references | Aligns a client update unit with a skill; keeps marketplace discovery | Must prove cache isolation, historical installation, personal holds, and command migration. Avoid assuming relative subfolders isolate updates. |
| Managed complete skill snapshots in supported directories | Makes per-skill selection and restoration explicit | Owns catalog, integrity checks, notes, local state, atomic activation, precedence, enrollment, and management-tool compatibility. CLI custom-directory registration alone does not prove VS Code discovers it. |

A shared repository does not inherently prevent independent releases: a release can identify a repository commit plus a skill path. The question is whether each consumer's installed selection remains independent when catalogs and other selections change.

## Required follow-up evidence

Before committing to a distribution architecture, run a focused compatibility experiment in disposable installations. Record exact CLI/VS Code versions and source hashes, then test:

1. Two skill packages with different release selections, including a supporting resource whose content differs by release.
2. Catalog refresh, selected update, update-all, and relevant automatic-update paths while one selection is retained.
3. Cold-cache installation of a new SHA, restoration of an older SHA, and subsequent updates.
4. CLI-managed discovery in VS Code, VS Code-managed installation, and locally registered content separately.
5. Duplicate names across the old bundle, new plugins, and personal/project skills; bare and qualified invocations; fresh versus existing chats.
6. Inventory output versus the bytes actually loaded, plus offline and unavailable-release behavior.

Use existing published fixture revisions or have the maintainer prepare them; this investigation grants no permission for commits, pushes, tags, or releases. Preserve the owner's real installations. Passing results must include observed outcomes, not just command exit status. Failed or unsupported paths must constrain the architecture explicitly.

## Research disposition

The documentation/source investigation is complete. End-to-end compatibility remains unverified and must gate the architecture decision through a follow-up ticket. The existing team-default, publishing, retention, interaction, and migration tickets remain necessary; no product behavior was decided on the owner's behalf.
