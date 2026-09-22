# GT onboarding — README prototype

> Reviewed prototype for [issue #73](https://github.com/AndrewGodlewsky/andrew-skills/issues/73), September 22, 2026. Andrew selected **both VS Code and Copilot CLI users, new to skills** and approved this draft for implementation. He clarified that Grill with UI is for conducting this session; the three README examples remain unchanged. This file preserves the prototype; the implementation is in the root README.

## Proposed README opening

---

# GT — skills for your development workflow

Turn a rough idea into a clearer plan, get concise code review findings, and create reusable skills for your team.

A skill gives your AI assistant instructions for a particular task. GT brings a collection of these workflows to GitHub Copilot in VS Code and Copilot CLI. Install the `gt` plugin once to get the collection, then choose a skill when you need it.

## Install

Choose the route for the client you use:

| Your setup | Start here |
| --- | --- |
| VS Code only | Install through VS Code. Copilot CLI and the PowerShell installer are not required. |
| Copilot CLI, with or without VS Code | Install through Copilot CLI. VS Code can discover that copy in the same user environment. |

Start with one installation per user environment. Windows and WSL are separate environments. You can deliberately keep separate copies; choose the intended copy when updating.

### Install from VS Code without the CLI

Use a current VS Code with Copilot access, repository access and agent plugins enabled (`chat.plugins.enabled`).

1. Open **Preferences: Open User Settings (JSON)**. Add `https://github.com/AndrewGodlewsky/andrew-skills.git` to `chat.plugins.marketplaces`, keeping any existing entries.
2. Open **Chat: Open Customizations**, choose **Plugins**, then **Browse Marketplace**.
3. Find `gt` in `andrew-skills`, review the publisher and contents, and install it if you trust it.

See the [VS Code marketplace guide](https://code.visualstudio.com/docs/agent-customization/agent-plugins#configure-plugin-marketplaces) for setup details.

### Install without downloading this repository

Use a current Copilot CLI with Git and repository access. In your terminal, register the marketplace:

```sh
copilot plugin marketplace add AndrewGodlewsky/andrew-skills
```

After registration succeeds, install the plugin:

```sh
copilot plugin install gt@andrew-skills
```

If the marketplace is already registered, use the installation command directly. Review any trust or authentication prompts. These commands install the published collection. See the [Copilot CLI installation guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing).

## Use a skill

Start a fresh chat and select the named skill from the GT source in your client's skill picker. Try one of these requests:

| What you want | Choose | First request | What to expect |
| --- | --- | --- | --- |
| Find a starting point | **GT Help** | “I have a feature idea. Which GT skill should I start with?” | A recommendation and an explanation. You choose whether to start the recommended skill. |
| Sharpen an idea | **Grill Me** | “I want teammates to find and reuse our project setup steps. Help me work through the plan.” | An interview, one question at a time, with a recommended answer to consider. |
| Review a change | **Caveman Review** | “Review the attached diff for bugs. Give concise findings with file and line references.” | Short, actionable findings when problems are found. Supply the diff or identify accessible code to review. |

These are example requests and intended results. GT's live client verification is still in progress; they are not a promise of identical behavior in every client. Select the GT entry your client actually shows. Bare `/help` may open built-in help; GT Help's exact command spelling is still being verified in the [owner pilot](https://github.com/AndrewGodlewsky/andrew-skills/issues/17).

Help gives advice and leaves actions to you. Other skills can write files or submit GT contributions; check the selected skill's requirements before starting. Extra tools are required for some workflows, rather than for the whole collection.

## Explore further

- [All skills and their requirements](https://github.com/AndrewGodlewsky/andrew-skills/blob/2fd61f93bf0c9acf52f671f8aedec195088e4d86/README.md#use-a-skill)
- [Update your installation](https://github.com/AndrewGodlewsky/andrew-skills/blob/2fd61f93bf0c9acf52f671f8aedec195088e4d86/README.md#update)
- [Contribute a skill](https://github.com/AndrewGodlewsky/andrew-skills/blob/2fd61f93bf0c9acf52f671f8aedec195088e4d86/CONTRIBUTING.md)
- [Maintainer dependency map](https://github.com/AndrewGodlewsky/andrew-skills/blob/2fd61f93bf0c9acf52f671f8aedec195088e4d86/docs/skill-map.md)
- [Validation and pending client checks](https://github.com/AndrewGodlewsky/andrew-skills/issues/17)
- [Skill provenance and credits](https://github.com/AndrewGodlewsky/andrew-skills/blob/2fd61f93bf0c9acf52f671f8aedec195088e4d86/README.md#skill-provenance)

---

## Proposed marketplace description

Use the same description in `plugin.json` and the `gt` entry of `.claude-plugin/marketplace.json`:

> Skills to sharpen plans, review code, and create, contribute and manage reusable AI workflows.

The full skill catalog still explains the collection's other capabilities. This short description replaces the current emphasis on only plan interviews and updates.

## Review question

The reviewed selection is **Help, Grill Me and Caveman Review**. They offer orientation, a useful conversation and a development task without making contribution tooling the first hurdle. Andrew approved the draft and clarified that the personal Grill with UI is the interview interface for this session, rather than a replacement example.

The links above point to the inspected published snapshot so this standalone prototype is usable. Production links would be relative, following the preservation plan in the [review notes](gt-onboarding-prototype-notes.md).
