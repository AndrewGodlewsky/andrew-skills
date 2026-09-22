# GT Help: client entry points and invocation controls

Published artifact: [client-entry research](https://github.com/AndrewGodlewsky/andrew-skills/issues/65#issuecomment-5771165460).
This file is the local working copy of that issue artifact.

Research date: 2026-09-22. Scope: documented behavior in GitHub Copilot for
VS Code and Copilot CLI. This is source research, not a live-client acceptance
result. No client installation, configuration change, skill invocation or
executable probe was performed.

## Documented support

| Client | Manual invocation and flags | Plugin-qualified name |
| --- | --- | --- |
| Copilot in VS Code | Skills appear in the slash menu by default. `user-invocable: true` keeps that route available; `disable-model-invocation: true` is documented to prevent automatic loading. | Plugin names automatically prefix commands, with `/my-plugin:test-runner` as the documented example. The inferred GT candidate is `/gt:help`. Keep source `name: help`, without a namespace. [VS Code skills documentation](https://code.visualstudio.com/docs/agent-customization/agent-skills#skillmd-file-format) |
| Copilot CLI | `/SKILL-NAME` invokes a skill. The reference documents both flags: `user-invocable` defaults to true; `disable-model-invocation` defaults to false and controls automatic invocation. | For duplicate skill names across plugins, the reference documents slash-separated qualified names, such as `/my-plugin/search`. The inferred GT candidate is `/gt/help`, requiring verification for this package and collision case. [CLI skills reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skills-reference) |

VS Code's January 2026 release notes also explicitly describe the two skill
invocation controls. This is corroborating documentation, not evidence that
the user's installed version behaves accordingly. [VS Code 1.109 release
notes](https://code.visualstudio.com/updates/v1_109#_use-skills-as-slash-commands)

## The bare `/help` name

Copilot CLI already documents `/help` as its interactive-command help entry
point. Its published skill naming rules alone do not establish how a GT skill
with the same bare name interacts with that built-in command. [CLI slash
commands](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#slash-commands-in-the-interactive-interface)

VS Code documents `/help` for listing agents and slash commands in a local Ask
chat. That statement should not be generalized to every agent mode. [VS Code
AI feature reference](https://code.visualstudio.com/docs/agents/reference/ai-features-cheat-sheet)

Recommendation: retain the product name GT Help and source name `help`, but do
not promise a universal bare `/help` command. Publish the verified entry point
separately for each supported client; the current documents use different
qualification separators.

## Precedence and evidence limits

The CLI also documents `copilot skill list --json` with name, description,
source, path and enabled fields. That is a possible research or user-supplied
inventory source, not proof of which instructions a chat has loaded and not
authorization for guidance-only Help to execute a command.
[CLI skill management](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#managing-skills-non-interactively)

The CLI plugin reference says a project or personal skill can shadow a plugin
skill of the same name. It describes first-found precedence generally, whereas
the CLI command reference additionally describes coexistence for duplicate
plugin skills. These pages do not resolve built-in `/help` collision handling.
Record the loaded source, not just a matching displayed name. [CLI plugin
precedence](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference#loading-order-and-precedence)

The two frontmatter fields are documented invocation controls. Their presence
in a source file, successful repository validation, or appearance in a picker
does not demonstrate that a particular installed client prevented automatic
invocation. Guidance-only behavior is a separate requirement: invocation
metadata does not establish that an invoked skill avoids writes or actions.

## Deferred client acceptance checks

These are proposed checks, not observed results:

1. Record client/version, enabled GT version and loaded Help source in a fresh
   session; confirm the source contains both explicit true flags.
2. Record the exact picker entry and command that manually loads GT Help.
   Check `/help` separately and document whether it opens built-in help.
3. In another fresh session, ask a marketplace question without naming Help.
   Inspect available invocation evidence for automatic selection or loading;
   an ordinary answer alone is inconclusive. Repeat after relevant client
   updates without claiming that a finite sample proves universal prevention.
4. Check a same-name project/personal skill and another plugin skill to identify
   shadowing and qualification behavior.
5. For a manually invoked Help conversation, request an action such as an
   update or install. Verify that Help supplies guidance without performing
   the action, invoking another skill, or changing files or configuration.

Until those checks run, the supported conclusion is that both intended clients
document manual-only skill controls; actual GT Help discovery, command spelling,
collision behavior and action boundaries remain unverified.
