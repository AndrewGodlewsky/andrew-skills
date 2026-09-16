# Skill context loading: evidence and limits

Research date: **September 16, 2026**. Requested during [skill architecture review](../planning/skill-architecture-round-2.md). This is supporting research, not approval of the proposed header policy or a client compatibility certification. No live client was run for this investigation.

## Read the evidence at the correct level

Four different things are often called “loaded”: bytes read by the application, metadata registered in its inventory, text assembled for a model request, and text retained in later requests. They are not interchangeable. A parser can read an entire file locally while the model receives only a short catalog entry. Conversely, an ignored configuration key can still reach the model as ordinary text if a later loader inserts the raw file.

Evidence labels used here:

- **Documented:** a product's stated behavior, subject to version and harness differences.
- **Source:** behavior of the named source path at a fixed revision; not proof that a particular installed build uses that path.
- **Observed locally:** a narrowly scoped prior fixture result.
- **Inference:** our architectural interpretation; not a product guarantee.
- **Unknown:** this investigation did not establish the behavior.

## Primary-source ledger

All pages below were inspected on the research date. Documentation URLs are mutable. Code URLs use the full revision returned by GitHub's commit API: `981b8c60abe325ad32cdebfddbf1d34ace34bd72`. Those files were fetched read-only using GitHub's contents API with that exact `ref` and inspected with numbered lines. Code samples were not executed.

| ID | Source | Supported conclusion and limit |
| --- | --- | --- |
| D1 | [VS Code skills documentation](https://code.visualstudio.com/docs/agent-customization/agent-skills#how-copilot-uses-skills) | Describes discovery, instruction activation, then selective resource access. This is a conceptual loading model, not a byte-level promise to strip YAML. |
| D2 | [Copilot CLI skills reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skills-reference) | Invocation inserts skill content into the conversation. Documents invocation flags and tool pre-approval. It does not specify the complete serialized request. |
| D3 | [Copilot CLI adding skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills#using-agent-skills) | Selection uses descriptions; activation injects `SKILL.md`. Bundled files become available, which does not mean every file's contents are injected. |
| D4 | [Agent Skills specification](https://agentskills.io/specification) | Defines package and frontmatter conventions, unrestricted Markdown body structure, optional resources and progressive disclosure. Client extensions require separate review. |
| D5 | [VS Code context and model concepts](https://code.visualstudio.com/docs/agents/concepts/language-models#context-window) | Request context includes instructions, history, attachments and tool results; models request tools and the host executes them. |
| D6 | [VS Code session management](https://code.visualstudio.com/docs/agents/run/sessions/manage-sessions#compact-conversation-context) | Compaction summarizes history; starting a new session resets context. A conversation fork copies history and differs from a skill subagent. |
| D7 | [VS Code cache diagnostics](https://code.visualstudio.com/docs/agents/agent-troubleshooting/cache-explorer) | Prefix reuse depends on model/provider. A request diff does not prove backend billing or cache behavior. |
| D8 | [VS Code Chat Debug view](https://code.visualstudio.com/docs/agents/agent-troubleshooting/chat-debug-view#chat-debug-view) | Request inspection exposes prompt/context/tool details. Inventory alone cannot establish model-visible content. |
| D9 | [Agent Skills scripts guidance](https://agentskills.io/skill-creation/using-scripts#designing-scripts-for-agentic-use) | Tool output, including diagnostics, is context; concise structured output improves the interface. |
| D10 | [Claude Code skill lifecycle](https://code.claude.com/docs/en/skills#skill-content-lifecycle) | Documents explicit persistence, duplicate-render handling and compaction retention rules. These are Claude-specific, not Copilot guarantees. |
| S1 | [VS Code automatic index builder, lines 406–512](https://github.com/microsoft/vscode/blob/981b8c60abe325ad32cdebfddbf1d34ace34bd72/src/vs/workbench/contrib/chat/common/promptSyntax/computeAutomaticInstructions.ts#L406) | Filters manual-only skills; serializes eligible metadata; caps catalog text on the skill-tool route. |
| S2 | [Copilot extension index collector, lines 446–539](https://github.com/microsoft/vscode/blob/981b8c60abe325ad32cdebfddbf1d34ace34bd72/extensions/copilot/src/platform/promptFiles/node/automaticInstructionsCollector.ts#L446) | Independently mirrors the metadata filtering and catalog construction in S1. |
| S3 | [Copilot extension SkillTool, lines 57–104](https://github.com/microsoft/vscode/blob/981b8c60abe325ad32cdebfddbf1d34ace34bd72/extensions/copilot/src/extension/tools/node/skillTool.ts#L57) | Inline tool result includes the complete document, base directory and related filenames. |
| S4 | [Plugin parser, lines 1190–1201](https://github.com/microsoft/vscode/blob/981b8c60abe325ad32cdebfddbf1d34ace34bd72/src/vs/platform/agentPlugins/common/pluginParsers.ts#L1190) | Reads the complete local document, extracts name, description and invocation flags. This is discovery parsing, not request serialization. |
| S5 | [Prompt attachment renderer, lines 58–75](https://github.com/microsoft/vscode/blob/981b8c60abe325ad32cdebfddbf1d34ace34bd72/extensions/copilot/src/extension/prompts/node/panel/promptFile.tsx#L58) | A different renderer computes a body offset to omit the frontmatter. This investigation did not trace every slash-command route into this renderer. |

## Before invoking a skill

### VS Code source-specific behavior

S1 rejects entries without descriptions, entries with `disableModelInvocation`, and entries excluded by session type. Its skill list is assembled when a file-reading route exists. Eligible entries contain name, description and file path, surrounded by instructions about using the skill tool or reading the file. The actual serialization includes the file path even though an adjacent comment says the tool route keeps paths out: executable code is the stronger evidence.

With the skill tool enabled, S1 limits full catalog entries to **15,000 characters**, then adds at most **5,000 characters** of remaining skill names. These are character budgets, not token counts or a per-skill quota. Without that tool, the shown loop does not apply that particular full-entry cap. S2 mirrors these conditions. Neither establishes the final request after all later budgeting or provider transformations. [S1](https://github.com/microsoft/vscode/blob/981b8c60abe325ad32cdebfddbf1d34ace34bd72/src/vs/workbench/contrib/chat/common/promptSyntax/computeAutomaticInstructions.ts#L406), [S2](https://github.com/microsoft/vscode/blob/981b8c60abe325ad32cdebfddbf1d34ace34bd72/extensions/copilot/src/platform/promptFiles/node/automaticInstructionsCollector.ts#L446).

### Copilot CLI: narrower conclusion

The CLI documents automatic selection from descriptions and manual invocation controls. Its public reference does not settle whether every manual-only description is omitted from every request, where catalog text sits in the message hierarchy, or the exact catalog token budget. Do not import S1's VS Code constants into a CLI claim. [D2](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skills-reference), [D3](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills#using-agent-skills).

**Design inference:** manual-only defaults can reduce unsolicited routing and, on the inspected VS Code path, remove automatic catalog entries. They are not a security boundary against ordinary authorized file reads. A repository analysis task can still explicitly read a `SKILL.md` as data.

## What invocation adds

On the inspected **SkillTool** route, the host obtains the document with `getText()`, reads a mode setting, and returns the whole document in a skill-context wrapper. YAML is therefore included on this route. The related-file helper lists at most 50 files and stops recursion beyond depth five; several build/cache directories are skipped. It lists paths, not file contents. No duplicate-invocation guard appears in this tool's `invoke` method; higher layers could still handle repetition. [S3, loading](https://github.com/microsoft/vscode/blob/981b8c60abe325ad32cdebfddbf1d34ace34bd72/extensions/copilot/src/extension/tools/node/skillTool.ts#L57), [file listing](https://github.com/microsoft/vscode/blob/981b8c60abe325ad32cdebfddbf1d34ace34bd72/extensions/copilot/src/extension/tools/node/skillTool.ts#L266).

By contrast, S5 explicitly attempts body-only rendering for a prompt attachment. Thus both “the entire YAML is always sent” and “YAML never reaches the model” are too broad. The agent's route, configuration and installed build matter. [S5](https://github.com/microsoft/vscode/blob/981b8c60abe325ad32cdebfddbf1d34ace34bd72/extensions/copilot/src/extension/prompts/node/panel/promptFile.tsx#L58).

The CLI documentation says content is injected into the conversation, but does not provide byte-level separation guarantees. The older local CLI fixture found its body marker only after the forced real skill-tool call and exposed resource paths. It did not read the resources. The recorder flattened messages and returned synthetic usage values, so it cannot establish roles, frontmatter handling or genuine token costs. [Prior experiment and limits](skill-version-compatibility-results.md), [recorded activation evidence](compatibility-evidence/cli-activation.json).

## References, scripts and sidecars

**Design inference from the inspected loader:** adding a reference file increases the installed package and may add a filename to the activation result; its complete contents do not follow merely because it exists. A later read adds the returned text. A link provides a navigation hint, not an automatic inclusion guarantee. An instruction to read every reference defeats the intended selective design.

Executing a script and reading its source are separate operations. The interpreter consumes its source; the model receives the tool's reported output and status. The model may also request a source read, which adds another context payload. Large stdout/stderr can consume or be truncated from context; concise summaries plus a result-file path make better interfaces. [Script-output guidance](https://agentskills.io/skill-creation/using-scripts#designing-scripts-for-agentic-use).

**GT-specific inference:** `release.yaml` is our release-system contract, not a standard skill-loader trigger. Nothing in the inspected skill-discovery parser interprets it. It may appear in a filename list, and status/update tooling can deliberately read it. We should not promise zero context impact, automatic version enforcement, or ordinary execution-time loading. A tool that returns selected version fields can keep release notes out of unrelated tasks.

## Later turns, caching and subagents

Context is assembled for requests, not permanently “installed into the model.” Conversation history and tool results can carry activated instructions into later turns. Compaction changes that history. VS Code documents summarization but the sources inspected here do not establish a universal per-skill retention budget or live-refresh behavior after editing the file. [Context](https://code.visualstudio.com/docs/agents/concepts/language-models#context-window), [compaction](https://code.visualstudio.com/docs/agents/run/sessions/manage-sessions#compact-conversation-context).

Prompt caching can reuse computation for an unchanged prefix. That is different from omitting text from the logical request or making it irrelevant to the context limit. Do not equate cheap cached input with free context. [Cache diagnostics](https://code.visualstudio.com/docs/agents/agent-troubleshooting/cache-explorer).

VS Code documents experimental `context: fork`, requiring its skill-tool setting, with a dedicated subagent returning a result. The pinned implementation delegates the skill content and task through the subagent tool. This is not proof that the child has no other system instructions or that every client's fork inherits the same history. [VS Code fork documentation](https://code.visualstudio.com/docs/agent-customization/agent-skills#run-a-skill-in-a-forked-context), [source](https://github.com/microsoft/vscode/blob/981b8c60abe325ad32cdebfddbf1d34ace34bd72/extensions/copilot/src/extension/tools/node/skillTool.ts#L107).

**Comparison only:** Claude Code documents manual-only descriptions being omitted, identical rendered invocations being deduplicated, skill messages surviving later turns, and limited reattachment after compaction (5,000 tokens per skill; 25,000 shared). It also distinguishes a skill fork from a conversation fork. These details demonstrate why a host-independent lifetime promise would be unsound; they are not Copilot behavior. [Claude Code skills](https://code.claude.com/docs/en/skills#skill-content-lifecycle).

## What this means for extra architecture or categories

These are recommendations, awaiting owner review:

| Proposed addition | Practical effect | Recommendation |
| --- | --- | --- |
| Markdown heading in `SKILL.md` | Helps humans and models navigate; remains ordinary instruction text on activation. It does not create a lazy-loaded module. | Use headings when they clarify a real procedure, not to fill a checklist. |
| Long mandatory purpose/example sections | Repeat information and enlarge every activation. | Keep only examples that improve execution; put review-only examples in repository evidence. |
| New top-level YAML `category` | No demonstrated native routing meaning; might still be model-visible as raw text on some loaders. | Do not describe it as harness configuration unless a client or our own tool consumes it. |
| Standard `metadata` mapping | The specification permits custom string-to-string metadata, but that alone adds no runtime semantics. | Require a concrete consumer and keep meaningful task guidance in instructions. |
| `allowed-tools` used as dependency documentation | CLI documents automatic tool allowance, not just a dependency list. | Keep it out of the baseline header pending deliberate client-specific review. |
| Version duplicated in frontmatter and sidecar | Creates two independently editable sources of truth. | Keep the accepted release contract in `release.yaml`. |
| Extra nested category directories above each skill | Discovery implementations may search specific depths and root layouts. | Organize a repository index or review records first; change distribution paths only with explicit discovery tests. |
| Optional focused references | Move uncommon detail out of every activation, at the cost of a later read when needed. | State the exact condition for reading each reference; keep essential boundaries in the main body. |

The standard places no mandatory heading scheme on the body and permits extra metadata. That supports flexibility, not an automatic guarantee that any invented field works everywhere. [Specification](https://agentskills.io/specification).

## Deferred verification checklist

This is a proposed experiment plan, not work performed or a request to test now:

1. Record exact client version, harness/session type, model/provider, settings and installation route.
2. Use unique markers in description, YAML, body, reference text and script output.
3. Inspect a fresh request before invocation, the activation response, and the following request.
4. Repeat for manual-only and automatically invocable flags, including plugin installation.
5. Read one resource and execute one known script independently; distinguish filename, source and output markers.
6. Inspect later turns, repeated invocation, a file edit and compaction separately.
7. Use actual model-request debug data for inclusion claims and actual provider usage for token claims. An inventory or UI “loaded” event is insufficient.

VS Code's Chat Debug view is the documented inspection point. The local CLI experiment remains partial evidence; owner-deferred client verification remains deferred. [Debug view](https://code.visualstudio.com/docs/agents/agent-troubleshooting/chat-debug-view#chat-debug-view).
