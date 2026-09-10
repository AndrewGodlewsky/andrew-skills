# Andrew Skills

One shared skills plugin for GitHub Copilot in VS Code and Copilot CLI.
Installing `andrew-skills` includes every skill in this repository.

## Install

After these repository changes are published to GitHub, download or clone the
repository and run this from its root in PowerShell:

```powershell
.\install.ps1
```

The installer registers the marketplace, then installs the entire `andrew-skills`
plugin. It stops if either step fails and does not change execution policies or
install prerequisites. It installs the published GitHub version, not local edits.

### Install without downloading this repository

In PowerShell 7, Bash, or Zsh, paste this single line:

```sh
copilot plugin marketplace add AndrewGodlewsky/andrew-skills && copilot plugin install andrew-skills@andrew-skills
```

In Windows PowerShell 5.1, run these separately, continuing only if the first
command succeeds:

```powershell
copilot plugin marketplace add AndrewGodlewsky/andrew-skills
copilot plugin install andrew-skills@andrew-skills
```

If the marketplace is already registered, run only the second command.
The first `andrew-skills` in `andrew-skills@andrew-skills` names the plugin;
the second names its catalog. Both live in this repository. All skills install
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

Add `https://github.com/AndrewGodlewsky/andrew-skills.git` to the
`chat.plugins.marketplaces` array in VS Code User Settings, preserving existing
entries. Search `@agentPlugins` in Extensions and install `andrew-skills` from
the `andrew-skills` marketplace. Follow the trust prompt.
[VS Code marketplace installation](https://code.visualstudio.com/docs/agent-customization/agent-plugins#configure-plugin-marketplaces).

## Use a skill

Start a fresh Copilot Chat and enter:

```text
/andrew-skills:grill-me I want to build a shared skills hub for my team.
```

| Skill | Purpose | Command |
| --- | --- | --- |
| [Grill me](skills/grill-me/SKILL.md) | Sharpen a plan or design through an interview | `/andrew-skills:grill-me` |

`grill-me` asks one question at a time, recommends an answer, and waits for shared
understanding before implementing the plan. It is manual-only: invoke it explicitly.

## Update

For a CLI-installed copy, run:

```sh
copilot plugin update andrew-skills
```

Use this explicit update command for CLI installs; this setup does not
configure automatic updates. See the
[CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference).

For a VS Code-managed installation, run **Extensions: Check for Extension Updates**.
VS Code also checks every 24 hours when `extensions.autoUpdate` is enabled.
[VS Code update documentation](https://code.visualstudio.com/docs/agent-customization/agent-plugins#update-plugins).

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
**Chat: Configure Skills**, confirm `grill-me` is listed from `andrew-skills`,
and try the command above in a fresh chat. If missing, confirm the plugin is
enabled and reload the window.

Local registration reads your checkout. Update the checkout yourself. Disable
the local registration before testing a GitHub-installed copy.

### If you tested an earlier installation

If you installed `andrew-skills` directly from the repository, uninstall that
copy through the client that installed it, then use the marketplace installation
above. For the CLI, the uninstall command is `copilot plugin uninstall andrew-skills`.
The installer does not remove previous installations automatically.

Uninstall the old `team-core` plugin through the client that installed it and
remove its local registration if present. Replace a registration pointing to
`plugins/team-core` with the checkout root above. If you already registered this
marketplace, refresh it with `copilot plugin marketplace update andrew-skills`,
then install `andrew-skills@andrew-skills`.

## Repository layout

```text
plugin.json                  Plugin identity and version
.claude-plugin/marketplace.json  Catalog listing this root plugin
install.ps1                  One-command setup from a downloaded checkout
skills/
  grill-me/
    SKILL.md                 Self-contained interview skill
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

See [CONTRIBUTING.md](CONTRIBUTING.md). With Node.js 22 or newer installed:

```sh
node scripts/validate.mjs
```

No package installation is needed for validation. Consumers do not need Node.js
to run the `grill-me` skill. Installing and invoking the plugin in VS Code is the
end-to-end acceptance check.

## Skill provenance

`grill-me` was imported from Andrew's user-level skill on September 10, 2026.
The original was an alias for `/grilling`. This version preserves the `grill-me`
metadata and includes the original `grilling` instructions directly, so it has
no dependency on another personal skill.
