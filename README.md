# Andrew Skills

One shared skills plugin for GitHub Copilot in VS Code and Copilot CLI.
Installing `andrew-skills` includes every skill in this repository.

## Install

After the repository contents are published to GitHub, run:

```sh
copilot plugin install AndrewGodlewsky/andrew-skills
```

This installs directly from the repository. No marketplace registration or
separate skill installation is needed. The command works in PowerShell, Bash,
and Zsh.

Requires a current [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli),
Git, and repository access. Follow any authentication or trust prompts. Having the
VS Code Copilot extension does not by itself mean the CLI is installed.

VS Code automatically discovers plugins installed by Copilot CLI under the same
user account on the same machine. Use an up-to-date VS Code with Copilot access
and agent plugins enabled. Reload the window if the plugin is not yet listed.
[VS Code discovery documentation](https://code.visualstudio.com/docs/agent-customization/agent-plugins#plugins-installed-by-github-copilot-cli).

### Install from VS Code without the CLI

Run **Chat: Install Plugin From Source** from the Command Palette and enter
`https://github.com/AndrewGodlewsky/andrew-skills`. Follow the installation prompts.
[VS Code source installation](https://code.visualstudio.com/docs/agent-customization/agent-plugins#install-a-plugin-from-source).

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

Use this explicit update command for direct CLI installs; this setup does not
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

### If you tested the earlier layout

Uninstall the old `team-core` plugin through the client that installed it and
remove its local registration if present. Replace a registration pointing to
`plugins/team-core` with the checkout root above. Remove this repository from
any old marketplace settings, then install `andrew-skills` using the new command.

## Repository layout

```text
plugin.json                  Plugin identity and version
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
