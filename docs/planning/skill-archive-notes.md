# GT archive lifecycle — working notes

> **Historical working notes, now resolved:** Read the [accepted personal export contract](skill-personal-export-contract.md). Round 3 accepted version-suffixed personal names only (plugin names stay normal) and Node/Git for export only. The pending questions and archive-plugin checklist below record the earlier investigation and are not outstanding requirements.

Issue: [Define historical skill export and GT archive lifecycle](https://github.com/AndrewGodlewsky/andrew-skills/issues/6).
**Status: Rounds 1–2 reviewed; create-only personal handoff accepted.** See the [current direction](skill-personal-copy-direction.md) and [Round 3](skill-archive-round-3.md) for naming/runtime questions. Original answers remain in [Round 1](skill-archive-round-1.md) and [Round 2](skill-archive-round-2.md). Earlier archive-plugin checklist sections below are historical design context, not current requirements where they conflict with the current direction.

## Latest owner input and decision boundary

The owner accepted one copy per source skill name, unrestricted personal editing and a create-only export that ends when the personal copy exists. There is no import into the team repository or ongoing management. They prefer the source version appended to the personal name, avoiding the proposed same-name override; exact suffix syntax is in Round 3.

The separate archive-plugin registration, dedicated prefix and managed replacement/removal requirements are superseded by the personal handoff. Existing architecture documents now point to the current direction; their earlier text is retained as historical context. The glossary uses personal-copy terminology. Native GT distribution and the publishing/source-history contract remain intact.

Round 3 proposes `<skill>-v<major>-<minor>-<patch>` and one shared Node/Git exporter used only for historical export. Neither exact naming nor that prerequisite is accepted yet. The owner remains open to an archive alternative if necessary; do not silently reinstate it or install tools.

## Work completed for Round 3

- Checked official naming documentation: folder/frontmatter must match and dots are invalid in the skill name. A version suffix therefore requires a controlled adaptation, not just changing the folder.
- Proposed verifying source bytes first and separately recording the renamed installed result. Keep original version/notes; do not claim the personal copy remains byte-identical after adaptation or user edits.
- Preserved one-copy intent as an export-time check of recognizable prior copies, not a background manager. Existing or edited destinations stop creation; no replacement/removal functionality is implied.
- Compared a shared Node/Git implementation with platform-specific shell implementations. A native GitHub CLI installer was also checked: [its documented behavior](https://cli.github.com/manual/gh_skill_install) includes source revision selection and update-tracking metadata, not a complete guarantee of this export contract. No installer was executed.
- [Copilot installation documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli) does not establish an independently available Node runtime for every installation method. The export-only prerequisite remains an explicit owner choice.

Remaining technical work: safe versioned naming and unsupported self-references/dependencies; exact source/installed receipt schema; primary personal destination; source lookup and no-clobber creation; concurrent creation and interrupted staging recovery; direct exporter fallback and runtime compatibility. Plugin manifest generation, registration, background edit monitoring, managed backups and replace/remove transactions are removed from the personal-copy design.

## Documentation check for the proposed pivot

Official documentation checked while preparing Round 2:

- [CLI personal skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) and [VS Code skills](https://code.visualstudio.com/docs/agent-customization/agent-skills) list `~/.copilot/skills/` as a personal location. Inference: ordinary discovery can replace archive-plugin registration. Shared-home discovery may affect both clients, so a client-only visibility promise is inappropriate.
- [CLI skill locations](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skill-locations) place personal skills ahead of plugins and project skills ahead of personal skills. A same-name export can shadow the main skill; it is not guaranteed to win over every other source.
- VS Code's naming rules require a skill's frontmatter name to match its folder and reserve plugin prefixes for plugin delivery. A distinct personal name is an adaptation, not an unchanged source snapshot; a folder rename alone is insufficient.

The prior personal-override experiment supports concern about shadowing; it does not prove every client's current behavior. No client probe or installation was performed. Live checks remain deferred. The newly documented CLI qualified syntax and earlier tested spellings are not treated as interchangeable proof of successful invocation.

## Prior accepted inputs (packaging now under review)

- [Architecture resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/4#issuecomment-5674810009): native whole-plugin GT updates plus an optional separate, explicitly invoked, user-owned `gt-archive`.
- [Publishing resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/5#issuecomment-5675205215): per-skill version/notes, catalog derived from preserved merge/squash history, exact origin/commit/path/content identity, and returning-name resets to `1.0.0`. A name/version pair is not globally unique.
- [Current behavior and acceptance scenarios](skill-versioning-decisions.md) and [publishing contract](skill-publishing-notes.md) are the local design baseline.
- Restore calls fixed deterministic code with validated inputs. It never asks the agent to generate or rewrite an exporter for each request.
- No selective main updates, managed pins, automatic override, archive upgrade reminders, cross-environment synchronization or historical release maintenance.
- No migration of archived copies solely because a source name returns. Archive copies of active and retired skills receive the same user-owned treatment.
- Node is not an accepted consumer prerequisite. No PowerShell 7 assumption. Ordinary native GT installation/update must not acquire an exporter-only dependency.
- The owner deferred live client setup/testing. This issue may design expected behavior using documentation and prior evidence; it must preserve unknowns and observed failures.

## Repository and research evidence

The production [update skill](../../skills/skills-update/SKILL.md) refreshes the marketplace and updates the native GT plugin. It distinguishes CLI versus VS Code-managed installations and uncertain Windows/WSL targets. It does not export history, create archive state or register an archive. Production contains no archive exporter.

The [compatibility report](../research/skill-version-compatibility-results.md) establishes only these relevant observations:

| Observation | Design implication and limit |
| --- | --- |
| Complete older folder retrieved from a multi-skill commit with file hashes preserved | Exact source retrieval is feasible; the research probe is not a production exporter. |
| Two local plugins appeared with qualified names in CLI inventory | Supports investigating a separate local archive; full dual-prefix invocation remains unproven. |
| A personal override hid plugin copies and qualified loading failed in that setup | A personal-copy pivot must explicitly accept possible shadowing; the previous dual-entry-point promise cannot be carried over unchanged. |
| Tested external-SHA plugin installation failed despite a success message | Do not choose that route as a proven archive registration mechanism. |
| VS Code activation and CLI/VS Code shared discovery remain unknown | Separate exported files, configured registration, discoverability and loaded-chat claims. |
| Local plugin source was read live in the tested CLI | Never stage partial content inside an active archive tree; design controlled publication and recovery. |

The research scripts use Node for experiments. Their existence does not approve Node for teammates or select the exporter implementation. No probes were rerun for this issue.

## Round 1 outcomes

1. One copy per source skill name is accepted.
2. Users own and may edit their copies freely, without team-repository import. Managed preservation, monitoring or replacement is not requested; create-only export is proposed in Round 2.
3. Client registration was not selected. The owner instead proposed personal folders; packaging and invocation are the next decision.

The glossary records the accepted copy limit and personal-editing ownership only. The remainder of these notes is the earlier technical checklist: keep retrieval/data-safety requirements, but revise plugin scaffolding, registration and replacement scope after the pivot decision.

## Technical work after those choices

### Scope and ownership

Identify the target environment and client without assuming terminal location proves VS Code's extension host. Choose a stable user-owned archive location outside native GT caches and project directories. Keep generated plugin scaffolding, exact skill snapshot files and provenance distinguishable. Reject unrelated existing directories and unsupported links rather than adopting or overwriting them.

Clarify whether both clients within one environment may use the same physical archive, how they opt in, and which registration the operation may change. Do not promise an already-open chat has loaded newly written instructions.

### Lookup and retrieval

Use the publishing catalog's full exact record, not a name/version dictionary or a floating branch reference. Repeated labels must resolve to one selected record. Pin lookup to a source head; verify the requested complete skill folder, version, notes and integrity before publishing it locally. Derive latest by publication order across resets.

Design read-only list/inspect operations, absent history, network failures and stale caches. No implicit fallback to a different release. Historical instructions/resources are copied as data, not executed during export.

### Lifecycle and recovery

Design observable transitions for selection, target checks, retrieval into staging, verification, user-approved replacement where needed, filesystem publication, registration and reporting. Keep staging outside discovered skill paths. Preserve main and unrelated archive content throughout.

Work out locking/concurrent restores, interrupted publication, incomplete/missing provenance, edited content, manifest/state coordination and registration failure. Do not promise filesystem changes plus client configuration form one atomic transaction. A failure report must distinguish preserved old content, verified exported files, registration state and any recovery action.

The archive record must retain repository origin, full source commit/path, source name/version/notes and integrity evidence. An edited copy can retain provenance while failing current-content verification. Repeated version labels must not overwrite unrelated records. Exact schema and replacement semantics depend on Round 1.

### Runtime and delivery

Compare the smallest practical fixed implementation choices for Windows and WSL, including what is available versus what would become an explicit prerequisite. Check official documentation before claiming cross-platform runtime/client behavior. Do not infer runtime availability from the host machine or the research scripts.

Decide how the main plugin delivers the current restore/export code, how it remains usable for direct recovery if the chat skill cannot load, and how helper/state compatibility is checked. Never replace the main plugin with a manager to solve archive delivery. No automatic runtime installer or packaged-executable project is presumed.

### Completion criteria

Resolve storage and identity, copy policy, supported client registration, runtime/delivery, direct fallback, replacement/removal and edited-file protection, concurrency/recovery, and observable acceptance scenarios. Carry results into the interaction/status/migration issues. Live client tests remain assigned to later validation, with failures and unknowns preserved.

[Create the restore skill for adding historical releases to GT archive](https://github.com/AndrewGodlewsky/andrew-skills/issues/11) remains a deferred implementation reminder. Do not implement it or the exporter during this design issue.
