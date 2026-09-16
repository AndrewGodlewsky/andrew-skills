# Skill version compatibility experiments

> Current planning scope: native GT updates plus a separate `gt-archive` collection. See [the accepted architecture](../planning/skill-distribution-proposal.md). This notice supersedes earlier managed-pin handoff assumptions; all observations, failures, and unexecuted checks below remain historical evidence with their original limits.

Investigation: [Verify retained skill versions in isolated Copilot CLI and VS Code installations](https://github.com/AndrewGodlewsky/andrew-skills/issues/10).

Published progress summary: [verified results and remaining prerequisite](https://github.com/AndrewGodlewsky/andrew-skills/issues/10#issuecomment-5673938965). Detailed evidence files remain local until the owner commits them.

Run began September 14, 2026, America/New_York. Status: **planning investigation resolved with partial evidence and owner-accepted deferred validation**. The owner declined further Copilot setup/testing now and chose to proceed on a compatibility assumption, test later, and revisit failures then. The architecture discussion can proceed. This does not change any pass/fail/unknown entry below. See the [closure resolution and handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/10#issuecomment-5674093165). Accepted behavior remains in [the decision record](../planning/skill-versioning-decisions.md).

## Findings

1. **Commit plus skill folder works for retrieval.** From two published snapshots of `anthropics/skills`, restoring the complete older `docx` directory changed only that installed skill. All 61 restored files matched the older snapshot; all 56 files in the installed newer `pptx` directory retained their hashes. The newer commit changes `docx`, `pptx`, and `xlsx`, including supporting scripts. No historical branch, new commit, or execution of the downloaded skills was required.
2. **A personal copy is a viable CLI building block.** In CLI 1.0.83, the complete personal `wf-alpha` 1.0.0 fixture remained selected while its source bundle changed both fixture skills to 2.0.0. It survived a local-marketplace refresh, an update-all command, and disabling the originating bundle. The real CLI skill tool subsequently loaded its 1.0.0 instructions and exposed paths to its notes and resource. This does not establish persistent managed pins, prompts, or remote updater behavior.
3. **Invocation names need an explicit contract.** A personal `wf-alpha` hid plugin copies in inventory. Without the personal copy, two plugins appeared as `bundle:wf-alpha` and `extra:wf-alpha`. With the personal copy present, actual CLI skill-tool requests for `extra:wf-alpha` and `extra/wf-alpha` both returned “not found.” Keeping a personal override does not establish that an old qualified command will keep working.
4. **Exact-SHA installation needs a different successful fixture before selection.** A local directory marketplace referencing this repository through an external GitHub source with a full SHA reported installation success, then listed no installed plugin. Subsequent update requests failed because the plugin was not installed. The cached checkout did match the requested old SHA. This is a failure of the tested combination, not proof that every remote marketplace or external source fails.
5. **VS Code activation remains unverified.** The extension-host probe confirmed a disposable home and registered an in-process deterministic model provider. The first attempt timed out at 35 seconds. After removing an invalid absolute skill-location setting and using the default personal path, the second attempt also timed out at 70 seconds without reaching the provider. The extension host exposed no Copilot extension, although the official install command reported `github.copilot-chat` 0.65.0 already installed. Logs also reported no signed-in session. These observations identify an unresolved test-environment prerequisite; they do not establish a product compatibility failure or a proven authentication root cause.

## Environment and isolation

| Item | Observed value |
| --- | --- |
| OS | Windows, `win32 10.0.26200` |
| Node | `v24.15.0` |
| Portable Copilot CLI | `1.0.83` |
| CLI ZIP SHA-256 | `0e07221a275fdf7e61619c53566e3a421fd646d74d8e9ca491dbbff221f22945` |
| VS Code | `1.137.0`, installed build commit `645f29cc3176500b4b5762ba887cf2a7f0ffdf2c` |
| Working repository HEAD | `b144bd105bf125b78bf95b6fc229e2cb9d4ff493` |
| Disposable root | `%TEMP%\andrew-skills-compatibility-20260914` |

The portable CLI archive was downloaded from the [official release](https://github.com/github/copilot-cli/releases/tag/v1.0.83) and matched its published asset digest. `COPILOT_HOME` and `COPILOT_CACHE_HOME` point into each disposable lane. These are separate locations; changing the former does not relocate the latter. [Configuration reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference#changing-the-location-of-the-configuration-directory)

CLI inventory still discovers the real user's `.agents` skill metadata despite `COPILOT_HOME`. Therefore this is isolation of **mutable CLI state**, not a claim that every discovery source is isolated. Only uniquely named generated fixtures were invoked by the deterministic responder. No credentials were copied, unrelated skills invoked, or downloaded fixture scripts run.

VS Code used separate `--user-data-dir`, `--extensions-dir`, and process-specific `USERPROFILE`, `APPDATA`, `LOCALAPPDATA`, Copilot configuration, and cache paths. Its extension host reported the expected disposable home. The existing user's profile was not the test profile. The application reported a shared-mutex warning while still starting the test host; a successful startup does not prove skill activation. [VS Code CLI](https://code.visualstudio.com/docs/configure/command-line)

The chat probe uses the supported [Language Model Chat Provider API](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider). Both chat probes supply deterministic responses; neither measures model quality or proves behavior of the authenticated Copilot service.

## Results matrix

“Pass” applies only to the stated observation. “Unknown” means no sufficient evidence, not implicit support.

| Case | Result | Evidence / limit |
| --- | --- | --- |
| Published multi-skill commit, restore one complete folder | **Pass: filesystem** | `docx` restored to parent snapshot; `pptx` unchanged, including all resources. |
| CLI local marketplace installs bundle | **Pass: discovery** | Both generated skills appeared with paths and descriptions. Local source is loaded live; no installed copy is made. |
| Local source changes both skills with a personal hold on one | **Pass: discovery and bytes** | Personal alpha stayed at 1.0.0; beta became 2.0.0 on the next inventory call, even before update. |
| Marketplace refresh and update-all with that copy | **Pass, limited** | Copy hashes unchanged. CLI explicitly said live local plugins have nothing to update. This is not a remote-update pass. |
| Cold-cache external SHA through local marketplace | **Fail: usable install** | Success message followed by empty plugin inventory and “not installed” update error. Cached Git HEAD matches requested SHA. |
| External SHA upgrade and rollback | **Unknown** | Failed installation prevented these operations; update errors are recorded. |
| Two separately retained external plugin releases | **Unknown** | No successful two-plugin immutable installation established. |
| Remote relative-folder shared-checkout control | **Unknown: runtime** | Prior source inspection remains relevant; local live-directory control is a different case. |
| Personal versus plugin duplicate | **Pass: observed precedence** | Personal alpha wins in CLI inventory and actual skill-tool loading. |
| Two plugins with same skill, no personal copy | **Pass: inventory only** | Both qualified `plugin:skill` entries appeared. |
| Bare alpha with personal copy after bundle disabled | **Pass: CLI skill-tool loading** | Actual provider request contained old instructions and listed supporting files. |
| Qualified plugin alpha while personal copy exists | **Fail: tested skill-tool names** | Both colon and slash forms returned “not found”; process exit was still zero. |
| Interactive slash-command UI | **Unknown** | `-p /name` became prompt text; the scripted backend explicitly called the real `skill` tool. No interactive picker was tested. |
| Read supporting resource during chat | **Unknown** | Correct resource paths were injected; the responder did not request a resource read. File hashes establish preservation only. |
| Existing chat after an on-disk version change | **Unknown** | Fresh sessions tested; resume/refresh semantics remain open. |
| Retirement to a complete personal directory | **Pass, limited** | Personal files survived disabling the local bundle and old instructions remained loadable. Actual catalog retirement/removal and future reintroduction still need testing. |
| Collision refusal | **Pass: probe safeguard only** | No-overwrite copy returned Windows “The file exists”; existing hashes survived. This is not client or product collision handling. |
| Returning to latest | **Partial** | Removing the personal copy exposed both qualified 2.0.0 plugin entries. No transactional manager or confirmation behavior exists yet. |
| CLI-managed plugins discovered by VS Code | **Unknown** | Not yet tested. |
| VS Code-managed marketplace update/rollback | **Unknown** | Not yet tested. |
| VS Code local/personal activation | **Unknown** | Isolated host and provider started; no chat request reached provider. |
| Native plugin automatic updates | **Unknown** | No authenticated interactive session-start update experiment performed. |
| Offline/missing historical release | **Unknown** | CLI activation used its offline mode and a local provider; this did not test catalog or release retrieval failures. |
| Machine-readable inventory | **Mixed** | `skill list --json` worked; `plugin list --json` returned `unknown option '--json'` in 1.0.83 despite current web documentation. |

## Published snapshot fixture

- Repository: [anthropics/skills](https://github.com/anthropics/skills).
- Newer: [Update docx, pptx, and xlsx skills](https://github.com/anthropics/skills/commit/fa0fa64bdc967915dc8399e803be67759e1e62b8), `fa0fa64bdc967915dc8399e803be67759e1e62b8`.
- Older parent: `9d2f1ae187231d8199c64b5b762e1bdf2244733d`.
- Download `/archive/<full-sha>.zip`, extract each into a separate directory, initially copy both skills from newer, preserve the newer installed `docx` directory as evidence, and copy only older `skills/docx` into its place.
- Compare each relative filename and SHA-256. Archive bytes were not used as the definition of a skill release. No fixture content is redistributed in this project; evidence contains filenames and hashes.

## Reproduce and inspect

Scripts are research probes, not a production installer. They deliberately preserve earlier runs. The CLI probe requires a fresh lane name and the verified portable executable at `<root>/runtime/copilot.exe`.

```powershell
node docs/research/skill-compatibility-probe.mjs <absolute-test-root> local <fresh-lane-name>
node docs/research/skill-compatibility-probe.mjs <absolute-test-root> external <fresh-lane-name>
node docs/research/skill-snapshot-probe.mjs <absolute-extracted-snapshots-root>
```

The activation probe expects the final `local-r3` fixture state. Run `node docs/research/skill-activation-probe.mjs <absolute-test-root> <fresh-lane-name>`. It starts a loopback-only responder, asks the real CLI to invoke fixture names through the `skill` tool, and records injected markers. It sets offline mode and removes provider/GitHub credential variables from the child environment. Success must be judged from tool results and markers, not process status.

The VS Code probe is an extension-host test module. Its temporary extension manifest registers vendor `wf-observer`, publisher `wayfinder`, name `compatibility-probe`, main `probe.cjs`, and `onStartupFinished` activation. Use the module for both `--extensionDevelopmentPath`'s main and `--extensionTestsPath`; set `WF_PROBE_ROOT` and disposable paths as above. Populate `<probe-root>/home/.copilot/skills/wf-alpha` with old fixture content and register the new fixture plugin using `chat.pluginLocations`. Do not disable workspace trust or authentication to make a test pass.

Durable evidence:

- [Local CLI commands, discovered paths, and file hashes](compatibility-evidence/cli-local.json)
- [External-source CLI commands and failures](compatibility-evidence/cli-external.json)
- [CLI skill-tool activation markers](compatibility-evidence/cli-activation.json)
- [Published-snapshot before/after hashes](compatibility-evidence/snapshot-restore.json)
- [VS Code initial probe](compatibility-evidence/vscode.json)
- [VS Code corrected configuration and longer startup window](compatibility-evidence/vscode-r2.json)

## Handoff and deferred validation

The owner accepted VS Code compatibility as a planning assumption and deferred live validation. A working native chat is no longer a prerequisite to close this research issue or begin the architecture discussion. Documentation and partial CLI results support feasibility; they do not verify the complete cross-client experience. The architecture must preserve this distinction and account for the observed naming and external-source installation failures.

For later testing only, [the manual profile launcher](open-compatibility-profile.ps1) opens the prepared `vscode-r2` profile if the temporary fixtures still exist. No action is requested from the owner now. It starts a separate window with the same isolated user-data, extension, home, and cache paths. The test responder may appear as **Fixture observer**; its output is intentionally synthetic. Do not interpret that response alone as successful skill loading or copy credentials from another profile.

Deferred checks belong to [Define migration and acceptance checks for the existing skills hub](https://github.com/AndrewGodlewsky/andrew-skills/issues/9), for later implementation/owner testing: native VS Code activation, local and CLI-managed discovery, bare/qualified invocation, resource reads, existing chats, cold-cache install/rollback, selected/full/automatic remote updates, unavailable releases, successful return to latest, and retirement/reintroduction collisions. That planning issue specifies coverage; it need not execute these tests now.

[Choose a distribution model for independently selected skill versions](https://github.com/AndrewGodlewsky/andrew-skills/issues/4) owns the architecture and treatment of the failed external-source combination. [Define pinning, rollback, and reliable local version changes](https://github.com/AndrewGodlewsky/andrew-skills/issues/6) owns state, activation/recovery, and updater guarantees. The status/update prototypes must distinguish proposed commands from verified syntax and installed files from unverified session state. No commits, pushes, tags, PRs, or releases are authorized by this investigation.
