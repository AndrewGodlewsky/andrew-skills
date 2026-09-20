# Andrew Skills

One shared skills plugin for GitHub Copilot in VS Code and Copilot CLI.
Installing the `gt` plugin includes every skill in this repository.

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
| [Skills update](skills/skills-update/SKILL.md) | Refresh the marketplace and update the CLI-installed `gt` plugin | `/gt:skills-update` |

`grill-me` asks one question at a time, recommends an answer, and waits for shared
understanding before implementing the plan. It is manual-only: invoke it explicitly.

## Update

### Update from chat

In a fresh Copilot chat with terminal tools available, invoke:

```text
/gt:skills-update
```

This manual-only skill asks Copilot to refresh `andrew-skills`, then update `gt`
only if the refresh succeeds. It reports the result and recommends starting a
fresh chat afterward. Terminal execution may require approval in your client.
It requires Copilot CLI and targets the CLI installation for that machine and
user account; VS Code-managed installations use the VS Code steps below.

The skill is included starting with version `0.1.3`. Existing users must update
once using the CLI commands below to receive it. It does not check or update
automatically in the background.

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
  skills-update/
    SKILL.md                 On-demand CLI plugin update skill
    release.yaml             Independent skill version and release note
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
The planned `skills-restore` skill creates that personal copy and leaves it to the user;
it never overwrites an existing destination or manages the copy afterward.
The planned exporter requires Node and Git; normal skill use does not add those
requirements. See the
[personal export contract](docs/planning/skill-personal-export-contract.md).

The [reviewed interaction design](docs/planning/skill-interaction-prototype-notes.md)
keeps `skills-update` direct: update the whole GT plugin, including additions and
removals, then show a table of changed skills, previous versions, installed
versions and short change notes. There is no removal-confirmation step.
`skills-restore` separately lets users browse and select a historical release.
These reporting and restore enhancements are planned, not implemented yet.

The [implementation handoff](docs/planning/skill-versioning-implementation-handoff.md)
tracks the work and owner pilot before team adoption. Existing users retain the
native update path. Edits inside managed GT skills are unsupported and native
updates replace them; personal and project-level skills remain user-owned.

The planned [skills-status report](docs/planning/skill-status-prototype-notes.md)
shows only installed GT skills: skill name, installed version and that release's
short note. It reads the selected local installation without online release
comparisons or personal-copy tracking. This status skill is not implemented yet.

The validator checks release metadata and version transitions, including the
first complete `1.0.0` baseline. The **Validate skills and releases** CI job checks
prospective PR merges against current `main`. Andrew will configure required
merge checks later. Each bundle change increments the overall plugin patch
version once, regardless of how many skills changed. The historical catalog and
its history-wide checks are still planned. Authors and agents should follow the
[contributor guidance](CONTRIBUTING.md) for the supported metadata format and
workflow.

### Current validation

See [CONTRIBUTING.md](CONTRIBUTING.md). With Node.js 22 or newer installed:

```sh
node scripts/validate.mjs
node scripts/validate.mjs --base origin/main --current-main origin/main
node --test scripts/release-validation.test.mjs scripts/release-snapshots.test.mjs
```

The plain validator checks metadata and structure. The comparison command also
checks version transitions against your local `origin/main`; ensure that ref is
current first. It does not contact GitHub. Release comparisons and snapshot tests
require Git. See [validation details](CONTRIBUTING.md#run-validation) for committed
candidates, stale-base checks and CI behavior.

No package installation is needed for validation. Consumers do not need Node.js
to run the `grill-me` skill. Installing and invoking the plugin in VS Code is the
end-to-end acceptance check.

## Skill provenance

`grill-me` was imported from Andrew's user-level skill on September 10, 2026.
The original was an alias for `/grilling`. This version preserves the `grill-me`
metadata and includes the original `grilling` instructions directly, so it has
no dependency on another personal skill.
