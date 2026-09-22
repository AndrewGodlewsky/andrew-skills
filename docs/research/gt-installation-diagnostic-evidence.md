# GT installation diagnostic evidence

Research for [#74](https://github.com/AndrewGodlewsky/andrew-skills/issues/74), reviewed September 22, 2026. This report supplies evidence and recommendations for [#75](https://github.com/AndrewGodlewsky/andrew-skills/issues/75); it does not select or implement that issue's scope.

Published research artifact: [complete Markdown report on #74](https://github.com/AndrewGodlewsky/andrew-skills/issues/74#issuecomment-5783719920).

Repository baseline: `01529c4d8114dcf2a953c6c4adb3b80f62071ce1`, GT 0.1.19. Repository findings refer to that published baseline, excluding concurrent uncommitted skill changes. Current vendor documentation, earlier repository experiments, and recommendations are distinguished below. No Copilot client was run, installed, configured, authenticated, or repaired for this research. No new live activation evidence was collected.

## Finding

A useful diagnostic can identify a selected installation and explain the evidence available for it. It cannot honestly collapse package bytes, manager registration, skill discovery, instruction loading, and successful behavior into one “working” flag. The proposed report should preserve those separate questions and explicitly retain unknowns.

There is a viable VS Code route without a standalone Copilot CLI prerequisite. There are also documented CLI inventory commands. Neither route establishes cross-client activation merely by inspecting a common installation directory. Version-specific capability checks and source association are essential, given the historical discrepancies below.

## Current primary-source capabilities

All external sources in this section were retrieved September 22, 2026. These are documented capabilities, not observations of Andrew's installations.

### VS Code plugin identity and availability

VS Code documents marketplace and direct-source installation through its own UI. Its Installed plugins view also discovers plugins under `~/.copilot/installed-plugins/`. Plugins can be enabled globally or per workspace; disabled plugins' customizations become unavailable. Local directories can be registered through `chat.pluginLocations`; plugin support itself is controlled by `chat.plugins.enabled`. The documented Windows cache example is `%APPDATA%\Code\agentPlugins\github.com\{org}\{repo}`. This is a location clue, not proof that a particular directory owns the current session. [VS Code agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins)

**Implication:** request the selected client's installed-plugin entry and source when available. CLI absence should not prevent a VS Code investigation. Shared discovery is documented, but it does not establish synchronized enabled state, identical selected sources, or identical session context across clients.

### CLI manager and discovered-skill inspection

Current documentation defines `copilot plugin list --json` rows with `name`, optional `marketplace` and `version`, `enabled`, `source`, and optional `installedFrom`. `copilot plugin marketplace list --json` enumerates registered marketplaces. The old cross-kind `plugins --kind` interface is retired. Confirm the installed build's help before selecting syntax or assuming an output schema. [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)

`copilot skill list --json` documents `name`, `description`, `source`, `path`, and `enabled`. The command reference describes project/personal precedence over plugins and plugin-qualified names for colliding plugin skills. `copilot instruction list --json` inspects discovered instruction sources, but explicitly resolves plugin instructions against global user settings only; repository or managed activation can be missing. Therefore that command cannot certify the live session's complete instructions. [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

**Implication:** list output supports the specific manager/discovery observation and environment recorded with it. It does not by itself prove instruction execution. Missing fields or unsupported options produce limited evidence, not a negative installation diagnosis.

### Skill selection and instruction loading

CLI `/skills list` reports availability, while `/skills info` documents the skill's location and originating plugin. The CLI skills guide describes a selected skill's instructions being injected into agent context. The guide does not make an inventory listing equivalent to an observed successful invocation. [Adding CLI skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)

VS Code explicitly separates frontmatter discovery, loading the skill body into context, and subsequent referenced-resource access. A slash-menu entry therefore cannot prove that a supporting script or resource was read. Skills can also hide their slash entry or disable automatic invocation through frontmatter controls. [VS Code agent skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)

The VS Code customization editor is scoped to the selected harness. Its verification guidance recommends checking response References for the expected instructions or skill and evaluating behavior on a representative task. [Manage customizations](https://code.visualstudio.com/docs/agent-customization/overview)

**Implication:** preserve the selected source path or client-provided source association, the exact invocation, and a narrow session reference. An agent saying that it “used GT” is weaker than client evidence tying the selected source to the request.

### Session diagnostics

VS Code's customization Diagnostics view identifies discovered instruction files and errors; its Chat Debug view can inspect the request's actual prompt and context. These answer different questions. [VS Code troubleshooting](https://code.visualstudio.com/docs/agents/agent-troubleshooting/troubleshooting)

Agent Debug Logs expose discovery and tool events; logging may need to be enabled before reproduction and is not retroactive. Debug exports may contain prompts, code, paths, and tool payloads. Prefer a reviewed, redacted relevant excerpt, rather than a complete debug export. [Debug chat interactions](https://code.visualstudio.com/docs/agents/agent-troubleshooting/chat-debug-view)

**Implication:** unavailable historical logs leave an unknown. Enabling logging, reloading a window, or starting a fresh test is a separate proposed follow-up, not a read-only observation already completed by this research.

### Environment and configuration boundaries

CLI `COPILOT_HOME` relocates configuration and installed plugins; `COPILOT_CACHE_HOME` controls a separate cache. Repository and local settings add further scopes, and repository-only plugin activation can differ from global activation. Avoid dumping the whole configuration directory: it includes application state, sessions, and secret-related storage. [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)

VS Code WSL uses a Windows UI with commands and many extensions running in Linux; terminals in a WSL window run in WSL, and remote settings can differ. Thus the same visible Windows machine or mounted repository is insufficient evidence of the same runtime home. [Developing in WSL](https://code.visualstudio.com/docs/remote/wsl)

**Implication:** record native Windows versus the specific WSL distribution, client/harness, workspace/profile, and which home the evidence concerns. The reviewed documents do not establish every cross-boundary plugin-cache discovery behavior; resolve it from that client's evidence instead of assuming Windows and WSL share registration.

## Evidence and capability matrix

The conclusions in the final column are this report's proposed interpretation rules. They are deliberately narrower than “installation works.”

| Question | File/resource reads | Read-only command capability, if available | User-provided client evidence | Strongest supported conclusion / limit |
| --- | --- | --- | --- | --- |
| Which package is this? | Selected root's manifest and release metadata | Existing manager list/help; no install or refresh | Installed entry and marketplace/source | Identified candidate; manifest claims alone do not establish manager ownership |
| Which manager owns it? | A narrowly exposed registration record linked to the root | Relevant manager entry and source | Client installation details | Provenance bound to one environment; a matching basename is insufficient |
| Is it enabled? | Explicit applicable state, if exposed | Manager-reported state for this scope | Installed view's current state | Enabled/disabled at the observed scope; not successful invocation |
| Which same-name skill is selected? | Candidate paths establish competing copies only | Discovered skill's source/path | Skill details or request reference with source | Source association where evidenced; otherwise ambiguous |
| Are instructions loaded? | Reading `SKILL.md` establishes readable bytes only | Ordinary inventory cannot establish this | Request References/context or a specific successful load event | Loaded in the cited request only |
| Were bundled resources used? | Presence/readability of referenced resource | Inventory cannot establish use | Relevant resource read/tool event | That resource was accessed; presence is weaker |
| Did the workflow succeed? | Package structure cannot answer | A process exit alone cannot answer | Expected versus actual task result plus relevant events | Outcome of that run; no general future guarantee |
| Is GT absent? | A missing guessed directory is insufficient | Complete relevant manager inventory, correctly scoped | Complete client inventory with source/scope | Absent only within the verified scope; otherwise unlocated/incomplete |
| Is another environment affected? | Separate roots need separate evidence | Run only in the explicitly selected environment | Window/remote indicator and matching client details | Windows evidence does not certify WSL or a different profile |
| Are this skill's prerequisites satisfied? | Selected skill's declared tools, dependencies and permissions | Narrow same-environment version/capability evidence, if permitted | Relevant client capabilities and redacted access result | Declared, observed and functionally tested are separate states; see prerequisite table |

File/resource reads are the lowest capability level. Read-only commands are optional evidence sources, not a universal prerequisite. A skill whose contract permits only guidance or direct resource reads must not gain shell execution because this table mentions commands. These documented UI views are human/client capabilities, not automatically tools available to an agent. When a supported UI or read interface is unavailable, request the minimal relevant user-provided evidence. Neither route requires the diagnostic to install or configure anything.

A reference or load event proves only the inclusion/loading stated for that request. It does not establish that the model obeyed the instructions, retained them indefinitely, or successfully used supporting resources. This investigation did not enable debug capture or change client configuration.

## Reuse the accepted GT contracts

The [accepted installation decision](https://github.com/AndrewGodlewsky/andrew-skills/issues/22#issuecomment-5752852987) is implemented in the matching [Status selection resource](../../skills/skills-status/references/installation-target.md) and [Update selection resource](../../skills/skills-update/references/installation-target.md). Their contents were compared and match. Select the explicit user target and verify its registration, provenance and root; otherwise use reliable active-source association, then a sole verified candidate in the current environment if nothing contradicts it. If evidence conflicts or several candidates remain, ask one concise target question. A choice establishes intent, not ownership. A folder name, checkout, model identity or executable path is insufficient.

| Installation arrangement | Selection and ownership | Evidence still needed |
| --- | --- | --- |
| CLI-managed, used in CLI | Verify CLI registration/source and resolved GT root in its effective home | Discovery and request-specific loading in that CLI context |
| VS Code-managed, no CLI installed | Use supported VS Code installed-entry/source details for the selected harness, workspace and profile | Reliable root association and relevant client evidence; no CLI prerequisite |
| One CLI-managed copy shared with VS Code | One installation, still owned by CLI; tie both clients to that registration/root | Each client's applicable enabled/discovered state and request evidence separately |
| Deliberate CLI and VS Code copies | Two valid candidates; select one target before inspection | Source association for the requested skill; copies alone are not a defect |
| Windows plus developer WSL | Treat each environment, user and effective configuration separately | Evidence from the selected environment; do not transfer Windows tool/authentication conclusions to WSL |
| Local development registration | Identify as development source rather than a managed release | Its own explicit source association; do not update/pull the checkout as repair |

Different cache paths can represent one continuing registration; identical versions can represent different bytes or different installations. [Skills Update](../../skills/skills-update/SKILL.md) and its [reporting contract](../../skills/skills-update/references/update-report.md) separate registration continuity, package identity and per-skill versions. A supported fingerprint can strengthen byte comparison, but installing tooling merely to obtain one is unnecessary. An update exit code alone does not prove an update or loaded instruction change.

[Skills Status](../../skills/skills-status/SKILL.md) stays an installed-version report with exactly `Skill`, `Installed version`, and `Release note` columns. Its existing distinctions also fit diagnostic evidence:

- **Absent:** complete relevant manager evidence establishes no installation in that scope.
- **Disabled:** applicable registration records disabled state; readable files can still exist.
- **Empty:** a verified root and complete readable inventory contain no skills.
- **Unlocated:** identity or resolved-root evidence is insufficient.
- **Ambiguous:** several plausible targets or conflicting source evidence prevent selection; do not arbitrarily choose.
- **Incomplete:** coverage, readability or metadata verification is partial. Retain observed rows and independently known values; a malformed skill folder must not disappear from the report.

Status reads immediate skill directories and metadata as inert data, follows no links outside the verified installation, and does not inventory personal/project skills. A concurrent installation change requires a supported coherent snapshot or an incomplete result. It makes no freshness claim and needs no Node, Git or CLI when other supported evidence suffices. A broader proposed diagnostic must explicitly define any additional permission to inspect a competing source; it cannot silently expand Status.

[GT Help](../../skills/help/SKILL.md) permits guidance and selective supported file/resource reads from the selected GT source, but no commands, invocation/delegation, installation, submission or repair. Missing automatic exposure of a manual-only skill is not proof of absence. Neither Help nor Status should be converted into a diagnostic executor by implication. Preserve applicable permission/authentication/security stops; research recommendations do not authorize a retry through another tool or environment.

## Requested-skill prerequisite evidence

Inspect the requested skill and its relevant dependencies in the selected package, not a universal tool checklist. These are representative baseline requirements, not a claim that any tool is installed or working today.

| Requested work and source | Declared requirement | Useful read-only evidence and remaining limit |
| --- | --- | --- |
| [Help](../../skills/help/SKILL.md) / [Status](../../skills/skills-status/SKILL.md) | Supported guidance/resource access; Status also needs a verified readable installation | Identify available read tools and source evidence. Terminal, Node, Git and CLI are not blanket prerequisites |
| [Historical restore](../../skills/skills-restore/SKILL.md) | Latest patched Node 22 or 24 LTS and Git 2.43+ in the selected environment | Existing version output can establish a version, with dated release evidence needed for “latest patched.” Export, network access and client activation remain untested |
| [Issue submission](../../skills/create-issue/SKILL.md), used by Create Skills / Skill Tweak / Skill Steal | Node 22+, authenticated gh 2.90+, file reads and structured process/UTF-8 stdin support in that environment | Version and capability evidence does not prove destination access or authority. No live submission, credential reads or Windows-to-WSL authentication inference for diagnosis |
| [Caveman Compress](../../skills/caveman-compress/SKILL.md) | Python 3.10+ and an already configured Claude provider | Version/configuration status can remain separately known or unknown. Do not send document contents to a provider or incur usage merely to prove readiness |
| [Caveman Explore](../../skills/caveman-explore/SKILL.md) | Separate native delegation context and repository read/search access | Inspect exposed capabilities. A file read cannot prove delegation, and missing delegation must not become silent in-context execution |
| [Grill with Docs](../../skills/grill-with-docs/SKILL.md) | Selected enabled same-GT Grilling and Domain Modeling dependencies, with appropriate document access | Dependency files show declared content; client source/discovery evidence establishes availability. Actual invocation and writes remain separate workflow observations |

Record each relevant prerequisite as **declared**, **observed in this environment**, **unavailable**, **unknown**, or **functionally tested in a cited run**. Also distinguish a missing tool from an authentication or policy denial. No dedicated invocation API being visible does not by itself prove that a client cannot invoke a skill; use its supported interaction and evidence model. A live provider call, skill invocation or write is not a passive prerequisite inspection.

## Historical evidence and incompatibilities

The [September 14 compatibility investigation](skill-version-compatibility-results.md) tested Copilot CLI 1.0.83. Its `skill list --json` succeeded while `plugin list --json` rejected the option. A personal fixture shadowed plugin copies. Qualified invocation names failed in the tested real skill tool despite a zero process exit. A deterministic responder did observe old personal-skill instruction loading, but did not test authenticated model quality, interactive slash selection, or actual supporting-resource reads.

These observations remain valid for the tested build and fixtures. Current documentation does not retroactively turn those failures into successes. A diagnostic should detect supported operations, preserve raw error meaning in a short sanitized excerpt, and avoid a hard-coded assumption that all versions support the present JSON interface or qualified syntax.

That investigation also leaves VS Code activation, CLI-managed discovery by VS Code, and existing-session refresh semantics unknown. Its unsuccessful VS Code probe identified unresolved environment prerequisites; it did not establish a confirmed authentication root cause or a product compatibility failure.

The [September 20 Windows owner pilot](owner-pilot-windows-20260920.md) observed CLI 1.0.83 with GT 0.1.7: remote registration, four discovered skill entries, and a no-new-release native update/reinstall restoring 135 file hashes. Synthetic personal/project files were preserved. This establishes those fixture operations, not chat activation, a new-release transition or VS Code-owned updates. The 64-character `source_sha` was opaque client metadata, not a Git commit. VS Code startup succeeded on the authorized retry; sign-in, plugin discovery and chat verification remained pending.

The [WSL acceptance record](skill-submission-wsl-acceptance.md) recorded WSL 2.6.3.0 with only `docker-desktop`, no ordinary developer distribution, at its earlier inspection. That is not today's machine inventory. Linux CI success does not establish WSL Copilot acceptance. The [Help evidence on #17](https://github.com/AndrewGodlewsky/andrew-skills/issues/17#issuecomment-5771513680) likewise separates static/simulated checks from pending client loading, naming/collision and session-refresh observations. These records were reviewed, not rerun.

## Minimal non-sensitive report

Proposed shape; the values below are deliberately placeholders, not a claim about the owner's current setup:

```text
Observed: <date/time>; evidence supplied by <client/user/file read>
Target: <VS Code + harness OR Copilot CLI>; version <known/unknown>
Environment: <native Windows OR WSL distro>; workspace/profile <alias>
Requested collection: GT; manager identity <verified/unknown>
Source: <public marketplace/repository identity>; root <GT-root-A>
Package: <manifest version>; evidence <manifest/resource/manager entry>
Registration: <registered/absent/unlocated/incomplete>; scope <known/unknown>
Enabled: <yes/no/unknown>; evidence <specific client entry>
Skill selection: <name> -> <GT-root-A OR other-source-B OR ambiguous>
Prerequisites: <requested skill>; <requirement -> observed/unavailable/unknown>
Instructions: <loaded in cited request / not evidenced>
Resource access: <observed relevant event / not tested>
Workflow: <specific result / not tested>
Limits: <unsupported option, incomplete inventory, missing session evidence>
Next useful check: <one targeted observation addressing the remaining gap>
```

Keep root aliases consistent so two copies remain distinguishable without exposing usernames or private repository paths. Include a short relative skill path when useful. Do not request tokens, credential files, complete configuration dumps, full conversation history, unrelated plugin inventories, or broad environment-variable dumps. Package version and per-skill release version are different fields; neither proves current-session activation.

## Recommended scope for #75

Recommendation, not a decision: start with a documented read-only troubleshooting procedure and the minimal report above. Use the owner pilot to determine whether repetition warrants a separate manual diagnostic skill. Either delivery should support resource-only, optional manager-command, and client-evidence routes. Select one installation, associate same-name skills with sources where possible, report explicit unknowns, and recommend the next useful observation. Keep installation repair, updates, authentication setup, comprehensive environment scanning, and claims of model compliance outside its default work.

Do not change GT Help into an executor. The current [Help contract](../../skills/help/SKILL.md) explicitly limits it to guidance and selective supported resource reads; it forbids commands and invoking other skills. A separately chosen diagnostic can have its own reviewed scope while Help explains when it is useful. Preserve Skills Status's existing output contract; any richer report needs an explicit #75 decision about ownership and presentation.

## Owner-pilot gaps

These are proposed later verification cases, not blockers fabricated for this documentation research:

1. VS Code without standalone CLI: identify the GT manager/source, enabled scope, selected harness, discovered skill and source, and request-specific instruction evidence.
2. Shared CLI installation in VS Code: establish that the shown entry and invoked skill resolve to the same selected root. Repeat with a competing personal skill if that scenario is in scope.
3. CLI version differences: check supported inventory syntax and same-name selection on the owner's actual build before promising machine-readable output or qualified invocation.
4. Native Windows and developer WSL: collect distinct manager/home evidence; retain WSL as untested until a suitable developer distribution exists and is actually exercised.
5. Existing versus fresh sessions: determine whether changed package bytes are reflected in instructions for each tested request; do not infer reload behavior from a filesystem hash.
6. Any end-to-end workflow: record expected behavior, source-linked loading evidence, actual result and limitations. Do not promote a zero exit, inventory row, or scripted responder into a general activation pass.
7. Separate copies and failure cases: exercise intentional CLI/VS Code copies, disabled state, incomplete root/metadata evidence and source conflicts. Confirm reports preserve ambiguity and do not infer absence from a hidden manual-only entry.
8. Requested-skill prerequisites: verify a representative instruction-only skill and a tool-dependent workflow in the chosen environment; keep version availability, authentication/access and successful workflow outcomes separate.

The research can inform #75 now. Live acceptance remains owned by the existing pilot/acceptance work, including [#17](https://github.com/AndrewGodlewsky/andrew-skills/issues/17), rather than being silently declared complete here.

## Research validation

Reviewed the published selection, Status, Update and Help contracts; compared both bundled selection resources; checked current official documentation against historical client results; and mapped every #74 investigation requirement to the report. All 14 unique relative repository links resolve at the stated baseline. Markdown table widths, code fences, trailing whitespace and unfinished-draft checks passed. This is a documentation-only research artifact: no runtime tests or client acceptance tests were run, and no production skill or manifest was changed for #74.
