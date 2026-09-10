# Andrew Skills

A GitHub-hosted skills catalog for GitHub Copilot in VS Code. Install a plugin
to make its skills available while working in your own projects.

| Plugin | Version | Skill | Invoke in Copilot Chat |
| --- | --- | --- | --- |
| `team-core` | `0.1.0` | [Grill me](plugins/team-core/skills/grill-me/SKILL.md): sharpen a plan through an interview | `/team-core:grill-me` |

## Install from GitHub

These steps work after the repository contents have been committed and pushed.
Use an up-to-date VS Code with GitHub Copilot access and agent plugins enabled.

1. Open **Preferences: Open User Settings (JSON)** from the Command Palette.
2. Add this repository to `chat.plugins.marketplaces`. Preserve any marketplaces
   you already use; the example includes VS Code's default catalogs.

   ```json
   {
     "chat.plugins.enabled": true,
     "chat.plugins.marketplaces": [
       "github/copilot-plugins",
       "github/awesome-copilot",
       "https://github.com/AndrewGodlewsky/andrew-skills.git"
     ]
   }
   ```

3. Open Extensions (`Ctrl+Shift+X`) and search `@agentPlugins`.
4. Find `team-core` in the `andrew-skills` marketplace, review the source trust
   prompt, and install it.
5. Start a new Copilot Chat and try:

   ```text
   /team-core:grill-me I want to build a shared skills hub for my team.
   ```

For a private repository, each teammate needs Git access to the repository.
Organization policies may control which marketplaces are available.

This repository is a marketplace containing a plugin under `plugins/team-core`.
Use marketplace installation rather than **Install Plugin From Source** on the
repository root, which is not a plugin root.

## Test locally before publishing

In VS Code's **User Settings (JSON)**, register the absolute path to the plugin:

```json
{
  "chat.plugins.enabled": true,
  "chat.pluginLocations": {
    "A:/Claude/andrew-skills/plugins/team-core": true
  }
}
```

On another machine, replace that path with the local checkout's
`plugins/team-core` directory. This setting stays on your machine.

Open **Chat: Configure Skills** and confirm `grill-me` is listed from `team-core`.
Start a fresh chat and use the example command above. The expected behavior is
one question at a time, a recommended answer, and no implementation until you
confirm shared understanding. The skill is manual-only, so invoke it explicitly.

If the skill is missing, confirm the plugin is enabled, then reload the VS Code
window and check again. Disable or remove the local registration before testing
the marketplace-installed copy, so you are testing only one copy of `team-core`.

## Updates

Maintainers edit skills and increment the plugin version in both manifests.
After publication, VS Code checks for updates every 24 hours when
`extensions.autoUpdate` is enabled. To request an update sooner, run
**Extensions: Check for Extension Updates**. See the
[official update documentation](https://code.visualstudio.com/docs/agent-customization/agent-plugins#update-plugins).

A local plugin registration reads your checkout; it is not a managed marketplace
installation. Update that checkout yourself. For testing revised instructions,
start a fresh chat so previously loaded skill text does not affect the result.

## Repository layout

```text
.claude-plugin/marketplace.json       Catalog of installable plugins
plugins/team-core/plugin.json        Agent Plugins 1.0 manifest
plugins/team-core/skills/grill-me/    Self-contained skill folder
scripts/validate.mjs                 Local and CI validation
.github/workflows/validate.yml       GitHub Actions checks
CONTRIBUTING.md                      Adding skills and publishing updates
```

The `.claude-plugin` catalog location is supported by the marketplace format;
it does not require teammates to install Claude. Plugin content uses the
Agent Plugins 1.0 format with a root `plugin.json` and `skills/` directory.

## Contribute and validate

See [CONTRIBUTING.md](CONTRIBUTING.md). With Node.js 22 or newer installed:

```sh
node scripts/validate.mjs
```

No package installation is needed. Consumers do not need Node.js for `grill-me`.
Validation checks repository conventions; installing and invoking the plugin in
VS Code is the end-to-end acceptance check.

## Skill provenance

`grill-me` was imported from Andrew's user-level skill on September 10, 2026.
The original was an alias for `/grilling`. This packaged version preserves the
`grill-me` metadata and includes the original `grilling` instructions directly,
so it has no dependency on another personal skill.

## Format references

- [VS Code agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins)
- [VS Code agent skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)
- [Agent Plugins manifest](https://agent-plugins.org/plugin-authors/manifest)
- [Marketplace format](https://code.claude.com/docs/en/plugin-marketplaces)

Setup follows the documentation checked on September 10, 2026.
