# Model invocation and composition for GT issue submissions

**Scope update after this research:** The owner rejected an imposed issue-body template and subsequently accepted model-only `create-issue` (`user-invocable: false`, `disable-model-invocation: false`). Callers own the exact title/body and structure; see [the caller contract](../planning/skill-submission-contract.md). Earlier references below to formatting a common body or retaining manual invocation are historical recommendations, not current requirements. Invocation findings retain their stated evidence limits; the new visibility combination still requires observed client acceptance.

Research for [Verify model invocation and skill composition in Copilot clients](https://github.com/AndrewGodlewsky/andrew-skills/issues/26), assigned to AndrewGodlewsky before investigation. Investigated September 20, 2026, America/New_York (September 21 UTC).

## Conclusion and evidence boundary

Use an ordinary model-invocable GT skill, loaded into the caller's conversation, with an explicit dependency handoff. Both target clients document automatic skill loading. This supports the proposed design without requiring the user to type a slash command. It does **not** establish guaranteed selection, an isolated function call, exact argument/return semantics, or permission to create an issue.

The design is ready for the remaining planning decisions. Actual automatic selection and caller-to-submission execution for this new skill are **untested**: it has not been implemented. No production skill, tool permissions, credentials or client settings were changed for this investigation. Research completion must not be reported as runtime acceptance.

## Documented capabilities

| Evidence | Finding | Consequence for this design |
| --- | --- | --- |
| [VS Code agent skills](https://code.visualstudio.com/docs/agent-customization/agent-skills) | The description guides relevance-based loading. `disable-model-invocation: false` permits it; `user-invocable: true` keeps the manual route. Plugin commands receive a prefix, while the source name stays unqualified. Loading is inline by default; experimental `context: fork` uses a separate subagent. | Keep both invocation routes and use inline composition. No experimental fork dependency is needed. A slash-command prefix is a client presentation detail, not a source-folder name. |
| [Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skills-reference) | CLI documents the same two invocation flags. Its skill listing includes name, description, source, path and enabled state. Project/personal/plugin discovery has precedence rules. | Check the effective entry and its origin instead of assuming the requested name resolves to GT. |
| [Adding CLI skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) | The model selects a skill using the task and description, then receives its instructions in context. CLI documents `/skills info`, enable/disable controls and `/skills reload`. Script execution is a separate capability with permission handling. | Skill loading and issue submission are separate stages. Reloading the catalog is not proof that an existing conversation has forgotten earlier instructions. |
| [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference#loading-order-and-precedence) | Skills use first-found precedence, with project and personal entries ahead of plugin entries. | A same-name local skill may shadow the intended dependency; a qualified name must not be assumed to bypass that behavior. |
| [Agent Skills client implementation guide](https://agentskills.io/client-implementation/adding-skills-support) | Clients may activate skills through file reads, dedicated tools or injected content. Discovery, instruction loading and referenced-resource loading are distinct steps. | Use the active client's advertised loading mechanism. Do not invent a universal `invoke_skill` tool or assume that a Markdown mention executes another skill. This guide describes implementation choices, not proof of Copilot behavior. |
| [VS Code WSL architecture](https://code.visualstudio.com/docs/remote/wsl) | A remote WSL window runs a server in the distribution; extensions can run locally or remotely, and its integrated terminals run in WSL. | Identify the actual chat/tool execution environment. A Windows window or workspace path alone does not establish where the dependency, credentials or tools live. |

Current CLI documentation also describes `allowed-tools`; this repository's authoring guide does not permit that field. VS Code's experimental `context` field is likewise outside the current GT header allowlist. Neither is necessary to meet model invocation. Do not add either or change the validator as a side effect of this research. [CLI skill documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills), [GT authoring rules](../../CONTRIBUTING.md).

## Observed client matrix

The Windows results below reuse recorded observations; they are not new authenticated chat tests.

| Client/environment | Actual local evidence | What remains unknown |
| --- | --- | --- |
| Copilot CLI on Windows, 1.0.83 | The earlier deterministic-provider probe exercised the real skill tool: a personal fixture loaded, while two attempted qualified plugin names failed when shadowed. The later pilot installed GT 0.1.7 and listed all four skills. This investigation ran `copilot skill --help` successfully in the disposable environment; it advertises project, personal, plugin and custom sources. | Automatic model selection, chaining this new skill, strict target handling and real issue submission. A scripted provider choosing a tool does not measure a model's autonomous selection. |
| VS Code on Windows, 1.138.0 | The pilot's authorized launch retry produced renderer and extension-host startup logs. At that observation the isolated profile had no signed-in GitHub session. | Effective GT discovery, automatic loading, caller composition, resource reads and authenticated issue submission. This investigation did not recheck or change the sign-in state. |
| VS Code connected to WSL | Architecture documented; no usable owner-pilot WSL setup was established in the prior work. | Which installed entry and host supply the skill/tools, automatic selection, paths/resources and actual submission. A successful Windows run cannot fill these cells. |
| Copilot CLI inside WSL | CLI skill behavior documented; no WSL execution performed for this investigation. | Actual installed version, discovery, model selection, composition, permissions and submission. |

Prior evidence: [compatibility experiments](skill-version-compatibility-results.md), [Windows pilot](owner-pilot-windows-20260920.md). The earlier personal-name collision result is a reason to check identity; it is not proof that the new skill will fail. The new help-command record remains at `.vscode/owner-pilot-20260920/evidence/research-skill-help.json` locally, and is preserved in [research evidence](skill-submission-invocation-evidence.json).

## Recommended composition contract

These are research recommendations for the contract and prototype tickets, not an invented new API or a completed production implementation. They preserve the owner's settled scope: callers supply content, one flexible issue format, reuse existing authorization, and exclusively submit GT-related material to AndrewGodlewsky/andrew-skills.

1. **Describe a narrow capability.** The eventual discovery description should say it formats caller-provided GT skill submissions and posts only to the named repository. Avoid a generic description such as “create GitHub issues.” The body must independently check scope and authorization; description wording cannot enforce them.
2. **Declare the dependency in every caller.** Once a submission is ready, the caller explicitly asks the model to load the shared skill's actual installed instructions, using the client's discovery mechanism. Supply the prepared content and the existing authorization context. Do not ask the shared skill to create the proposal or investigate missing facts.
3. **Resolve the intended source.** Identify the enabled GT-provided entry and the instructions actually loaded. Use the client-advertised identity/path; do not construct a cache path or assume `gt:<name>` is accepted by every tool. If the available information cannot distinguish GT from a same-name local copy, stop this submission and report the ambiguity. Do not load an arbitrary similarly named skill as a fallback.
4. **Compose inline.** The parent conversation retains the supplied content and reads any bundled resources through paths relative to the selected skill. A caller should not copy the callee's body, duplicate its format or embed an absolute installation path. A dependency on another named skill is explicit and is not automatically portable under renaming or historical export.
5. **Separate loading from writing.** Loading alone causes no issue write. Before submission, verify that this is a GT-related submission, the caller supplied the substance, authorization is present, and the selected write path binds the sole allowed repository. User/tool restrictions still apply. If repository binding is unavailable or ambiguous, return without a write.
6. **Report evidence, not a simulated return value.** The caller consumes a concise result backed by actual tool evidence. A readable issue link must refer to the intended repository. Missing capability, cancellation, confirmed failure and uncertain creation must not become a success message or an automatic retry. The outcome vocabulary belongs to the contract/reliability decisions.

Example caller wording, with the final name deliberately unresolved:

> The user has authorized this GT marketplace submission. Use the installed GT submission skill to format and submit the following supplied content only to AndrewGodlewsky/andrew-skills. Load its current instructions before acting. If that dependency cannot be identified or loaded, report that the submission could not proceed; do not substitute another skill or submit directly.

This instruction is an integration pattern to test, not a guarantee that a model will follow it. The subsequent transport investigation must decide what target restriction can be enforced by the actual write mechanism. A fixed repository in prose, a plugin prefix, or a frontmatter flag is **not a security boundary** around a general GitHub tool.

## Failure and refresh boundaries

| Condition | Required proposed behavior |
| --- | --- |
| Dependency absent, disabled, unreadable or malformed | Preserve the supplied content, report the unavailable capability, and make no issue write. Do not install tools, change settings or reconstruct the missing skill. |
| Same-name project/personal entry, duplicate installations or uncertain origin | Do not substitute based on a name match. Report ambiguity; identifying an installed path is distinct from trusting arbitrary project content. |
| A caller runs in another repository with a valid GT submission | Permit composition when the GT dependency and fixed destination are established. The active project is not the issue target. |
| Generic unrelated request or requested target override | This capability performs no submission to any repository. A repository name quoted within evidence is ordinary content, not a destination override. |
| Catalog changed or an old conversation retains previous instructions | Re-establish current dependency identity and instructions, preferably in a fresh chat for acceptance testing. Do not claim reload updated all retained context or that an installed-version report certifies loaded instructions. |
| Tool or authenticated access unavailable | Return the limitation without fabricating completion or substituting Codex-only capabilities. Existing workflow authorization does not grant missing client permissions. |

## Downstream checks and closure boundary

Carry these checks into [Define submission-skill acceptance and implementation handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/31). Use disposable fixtures and a controlled issue target; choose the actual transport in [Compare GitHub issue creation paths in VS Code and WSL](https://github.com/AndrewGodlewsky/andrew-skills/issues/27).

- Observe a caller loading the intended shared skill without a manual user command. Record client/model versions, source path and loaded instructions, not just inventory.
- Exercise absent, disabled and shadowed dependencies, plus fresh and existing chats. Observe supporting-resource reads if the implementation uses a bundled format.
- Run each supported Windows/WSL client configuration separately. Record local/remote execution location and actual prerequisites; no inferred cross-environment pass.
- Exercise valid GT content from a different workspace and unrelated issue requests, including attempted target overrides. Observe tool calls and resulting repository, including **no write** in refusal cases.
- Verify supplied Markdown/code survives the one flexible format; no new substantive content is invented. Validate a real issue result and failure/uncertain outcomes after the transport is implemented.

These are planned tests, not results. This research resolves the documented invocation model and its limits, allowing design work to continue. Production acceptance remains open in the downstream tickets; no new client bridge, experimental execution mode, separate composition framework or additional planning ticket is justified by the evidence so far.
