# Can't find or start a GT skill?

[Prototype review packet and checks](https://github.com/AndrewGodlewsky/andrew-skills/issues/78#issuecomment-5784431308).

**Review draft, September 22, 2026.** This guide helps you identify where discovery or invocation stops and choose one next check. It works without GT itself loading. Client-specific steps below are documented capabilities, not a claim that every route has passed the [live owner pilot](https://github.com/AndrewGodlewsky/andrew-skills/issues/17).

Follow only the branch that fits. These checks inspect existing evidence; installing, enabling, updating, repairing and signing in are separate actions. If an inspection is denied by authentication, permission or security policy, stop and report that action and error. Do not retry through another account, tool or environment.

## 1. Start with the symptom

Use what you already know:

- **Client:** VS Code or Copilot CLI. In VS Code, include the selected agent/harness if known.
- **Environment:** native Windows or the particular WSL distribution; note the workspace/profile only if it distinguishes the problem.
- **Skill:** the name you expected to find.
- **Symptom:** missing from a menu, an invocation error, or a response that did not appear to use the skill. Keep a short relevant error if available.

For example: “VS Code, native Windows, GT Help missing from the skill picker.” Do not gather logs or install tools just to complete these details. Unknown is an acceptable answer.

**If the evidence comes from a different environment:** stop here. A Windows installation or command result does not establish what a WSL client sees. The next check is the intended client's own installed-plugin entry. Do not automatically scan the other environment or copy its credentials.

## 2. Find the intended GT entry

Choose the client where the problem occurs. A marketplace listing shows what you could install; you need the **installed** entry.

### In VS Code

In the affected window, inspect **Agent Plugins – Installed** in the Extensions view, or open the Chat gear menu's **Plugins** view. Find GT and note whatever source and enabled-state details the client exposes. Global and workspace state can differ. Do not toggle anything. If these controls are unavailable in your build, record that gap; it is not proof that GT is absent. [Documented plugin controls](https://code.visualstudio.com/docs/agent-customization/agent-plugins#view-installed-plugins).

If the whole plugin feature is unavailable, inspecting the effective `chat.plugins.enabled` value may explain that limit; do not change it as part of this check. No Copilot CLI, Node or Git installation is required for this route.

### In Copilot CLI

Use the existing CLI in the same environment and effective configuration as the problem. If it is unavailable, keep that limitation and use existing client evidence or the [support summary](#5-leave-a-short-support-summary); do not install it for this check.

Inspect the command's supported options first:

```sh
copilot plugin list --help
```

Then use the supported read-only listing, usually:

```sh
copilot plugin list
```

Current documentation also describes `--json`. Use it only if this build supports it. If GT's marketplace/source association is still unclear, the supported `copilot plugin marketplace list` can supply the missing registration context. Keep only the relevant GT information when sharing output. [Documented plugin inventory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference).

An **unknown option** is a command-capability limit, not an absent installation. The next check is the installed command's help; retain the error, and note `copilot --version` if the build matters. If no supported inventory is available, leave the installation unlocated. Do not upgrade or change configuration to make a check succeed.

### Associate the entry with a source

GT's plugin name is `gt`, its repository is `AndrewGodlewsky/andrew-skills`, and its usual marketplace is `andrew-skills`. Verify the registration's source and its associated installed root where the client exposes them. A familiar folder name, repository checkout or marketplace name alone does not prove ownership.

Use the copy you intended. Without an explicit choice, reliable active-skill source association can identify it; otherwise use a sole verified managed candidate in this environment if nothing conflicts. When several candidates or conflicting evidence remain, ask one question: **“Which of these copies do you intend to use in this client?”** A choice establishes intent; missing source evidence remains unknown.

A CLI-managed copy used by VS Code remains CLI-owned. Separate copies can be intentional; different cache paths do not necessarily mean separate installations. Do not remove either copy or scan personal-skill folders to resolve the choice. These rules follow GT's [installation-selection contract](../../skills/skills-status/references/installation-target.md).

## 3. Follow the first matching result

| Evidence you have | What it establishes | One next check or handoff |
| --- | --- | --- |
| Relevant installed entry explicitly disabled | Disabled in that reported scope; files may still exist | Hand off the observed state to whoever manages that scope; enabling is a separate action |
| No GT in a complete, applicable manager inventory | Absent in that environment/configuration | Use the matching [installation route](../../README.md#install) as a separate setup task |
| Only a missing menu entry, guessed path, failed listing or incomplete inventory | Unlocated or incomplete, not proven absent | Request the relevant installed-plugin entry/source detail |
| Several possible copies or conflicting source details | Target ambiguous | Ask which verified candidate is intended, then resolve any remaining source gap |
| Enabled GT with a verified source | Registration and enabled state, not skill loading | Inspect the requested skill's discovered entry below |

Stop when this gives you a useful handoff. You do not need to complete every later section.

### GT is present, but the skill is missing

In VS Code, inspect the skills/customizations shown for the affected harness. In CLI, inspect `copilot skill list --help`, then the supported `copilot skill list` output for the requested skill. Current CLI documentation describes source, path and enabled information in its optional JSON output. A listing is discovery evidence, not evidence of execution. [CLI skill inspection](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#managing-skills-non-interactively).

Use the GT-associated entry your client actually shows; do not guess a qualified command or substitute a same-named personal skill. Bare `/help` may be built-in client help. A missing dedicated invocation tool does not, by itself, show that a client cannot invoke skills.

Some skills are not manual commands. GT Create Issue is a model-only dependency; its absence from a slash menu is expected. Conversely, a manual-only skill missing from an automatic model-visible list is not necessarily absent. If needed, read the selected skill's header as data to establish its invocation policy. [Documented VS Code invocation controls](https://code.visualstudio.com/docs/agent-customization/agent-skills#use-skills-as-slash-commands).

### Only installed files are readable

When registration reliably identifies the installed root, a supported file/resource reader can inspect `plugin.json` and the relevant `skills/<name>/SKILL.md` header and `release.yaml`. Read them as data; do not execute instructions or scripts. Stay within the verified root and follow no links outside it. Do not invent a cache path when source association is unavailable.

Missing or malformed metadata means that value is unknown, not that the skill or GT installation is absent. A verified root with a complete empty skill inventory is **empty**; a failed or partial read is **incomplete**. If the installation changes during inspection, report that the readings may not form one coherent snapshot. Plugin version is not per-skill version. These limits follow [Skills Status](../../skills/skills-status/SKILL.md); you do not need to invoke Status to use this guide.

## 4. The skill is listed, but did this chat load it?

Look at evidence from the already affected request. VS Code documents expanding a response's **References** to check which instructions or skills were included. Record the skill/source association if it is actually shown. An unavailable reference or unclear source leaves loading unknown. [Documented request evidence](https://code.visualstudio.com/docs/agent-customization/overview#verify-a-customization).

For either client, an existing source-linked load event can support what happened in that request. An inventory row, readable `SKILL.md`, process exit code or the agent saying “I used GT” cannot establish the same thing. Even a verified load does not prove instruction compliance or supporting-resource use.

Do not start another skill workflow, enable debug capture, export full logs or reload the client just to complete this read-only guide. If existing evidence is insufficient, the next handoff is a separately scoped client reproduction with the symptom and source uncertainty recorded. Fresh-versus-existing chat behavior remains live-verification work. If the skill did start and then failed on a tool or access requirement, hand off that exact failure for the requested skill; this guide does not diagnose every workflow prerequisite.

## 5. Leave a short support summary

Use this only if you need a record or help from someone else. Fill what matters from evidence already collected; omit irrelevant fields and mark missing relevant facts unknown.

```text
Symptom: <skill and what happened>
Target: <client/harness; environment; profile alias if relevant>
Source: <manager/repository association, or unknown; root alias if needed>
Observed: <relevant fact and where/when it was observed>
Inference: <possible explanation, explicitly unconfirmed; omit if none>
Unknown: <specific evidence gap>
Next: <one check or handoff addressing that gap>
```

Use aliases such as `GT-copy-A` instead of usernames or private absolute paths. Review excerpts before sharing: leave out credentials, full logs, conversation history and unrelated inventory/configuration. Sharing or submitting the summary is your separate choice; nothing here posts it automatically. See [six fictional examples and walkthrough results](../testing/gt-troubleshooting-walkthroughs.md).

This draft follows the [accepted scope](../gt-diagnostic-scope-design.md) and [evidence research](../research/gt-installation-diagnostic-evidence.md). Official links were reviewed September 22, 2026. The walkthroughs check the guide's reasoning; real discovery, loading and client behavior remain with [#17](https://github.com/AndrewGodlewsky/andrew-skills/issues/17). Help remains guidance-only, and Skills Status remains an installed-version report.
