# Migration and acceptance — implementation handoff

Issue: [Define migration and acceptance checks for the existing skills hub](https://github.com/AndrewGodlewsky/andrew-skills/issues/9).

**Status: accepted through [Round 1](skill-migration-round-1.md).** Original answers are preserved. This is the final migration/acceptance handoff, not implementation or test evidence.

## Accepted rollout

- Develop and iterate in stages, but deliver the complete versioning, update reporting, status and historical restoration feature set before team adoption. The owner will continue refining the repository until ready; no rollout date or publishing action is implied.
- Standard users keep their native whole-plugin install/update path and start a fresh chat after updates. No migration manager or separate archive registration.
- Edits inside managed GT skills are unsupported customizations: native updates should replace them with published plugin content. No preservation prompt, automatic backup/importer or special migration handling. This does not authorize touching unrelated personal/project skills or resetting a development checkout.
- Implementers run automated acceptance checks. Andrew pilots the complete behavior with implementer support before wider team adoption. Live checks stay deferred until that later pilot; their present unknowns are not passes.
- Future implementation and pilot issues are authorized to preserve the work. Commits, publishing and repository settings remain separately controlled by Andrew.

## Current baseline and resolved inputs

- Root [plugin.json](../../plugin.json) and [marketplace](../../.claude-plugin/marketplace.json) both declare GT `0.1.3`. Current production skills are `grill-me` and `skills-update`; versioning/status/export enhancements remain unimplemented.
- [Publishing contract](skill-publishing-notes.md): baseline metadata, independent versions/notes, first-parent merge/squash source records, preserved ancestry and deterministic validation. No pre-system backfill or branch of old releases.
- [Export contract](skill-personal-export-contract.md): fixed bundled helper, exact complete source, controlled personal rename, create-only handoff, explicit target and recovery. Source receipts support that operation, not ongoing status tracking.
- [Update/restore interaction](skill-interaction-prototype-notes.md): direct native whole-plugin update, actual-change table afterward, separate `skills-restore` browse/select flow.
- [Status contract](skill-status-prototype-notes.md): local installed-GT-only table; no personal inventory, remote comparison or writes.
- [Compatibility research](../research/skill-version-compatibility-results.md): limited earlier observations only. A local live-plugin test is not a remote-update pass; exact folder retrieval is not a client activation pass. Historical same-name override failures do not prove the final suffixed-copy design works or fails.

## Onboarding

| User starting point | Path and reporting boundary |
| --- | --- |
| Fresh install | Existing native GT install for the selected client/environment; include all skills actually delivered in that release. |
| Published 0.1.3 installation | Existing native update path; start a fresh chat. Old updater may only report native command results on the transition. Never fabricate a full before/after skill table it could not capture. |
| Metadata-free old skills | Baseline first published metadata is 1.0.0; previous installed labels stay unknown. Historical export starts with cataloged releases, not guessed pre-baseline versions. |
| CLI-managed vs VS Code-managed | Use the installation's supported native path. Do not substitute a nearby terminal's CLI installation for a VS Code-managed target. |
| Locally registered checkout | Explain local-source behavior; no automated repository pull/reset or switch of installation source. |
| Modified files inside the confirmed managed GT installation | Native update replaces them with published content. No preservation gate, backup, importer or special managed-edit migration. Do not interpret an unidentified path as permission to overwrite it. |
| Personal/project copies or duplicate names | Preserve and exclude from GT status. Investigate reported client routing ambiguity without adopting/deleting user content. |
| Windows and WSL | Separate explicit targets; no automatic propagation or settings edits. |
| Missing exporter prerequisites | Only export is unavailable; refer setup to Andrew. Never install tools or change security controls automatically. |
| Broken restore chat entry point | Fixed direct exporter from a trusted complete bundle/checkout; same verification and collision behavior. No invented fallback script. |

Document plainly that editing skills inside the plugin is unsupported and native updates replace those edits. Use native update behavior rather than adding a bespoke reset/deletion tool. If a client reports no update while retaining modified managed files, report the limitation and resolve it during the pilot through supported client behavior; do not falsely claim repair or silently mutate an unrelated checkout. User-owned personal/project files remain untouched. A separately requested manual handoff is separate work, not a migration feature or routine approval gate.

## Acceptance matrix

All **product checks below are pending implementation**. “Implementer” means the assigned implementation agent/developer; “Andrew” owns client pilot execution/review and repository settings with implementation support. Automated checks precede the owner pilot; the complete feature set and pilot precede wider team adoption. Record evidence by scenario and environment; never convert deferred/unsupported/failed into passed.

| Area / scenario | Expected result | Evidence owner |
| --- | --- | --- |
| Baseline and schemas | Every active baseline skill has valid 1.0.0 metadata and nonempty notes; malformed/duplicate keys rejected; no pre-baseline labels invented. | Implementer, automated fixtures |
| Independent release changes | Changed instructions/resources or note correction requires valid bump; untouched skill versions/source records stable; invalid/version-only bookkeeping edits rejected. | Implementer |
| Container coherence | Bundle changes advance plugin patch once with matching manifests; repository-docs-only/no-op changes cause no release bump. | Implementer |
| Concurrent PRs and publication | Validate prospective changes against current main; stale candidates revalidate. Merge/squash snapshot defines release, not drafts or check reruns. | Implementer; Andrew configures required check |
| Catalog retry and source stability | Same head reproduces records; failure advertises no partial catalog; lookup stays at selected head while main advances. Missing/rewritten history fails affected verification. | Implementer |
| Removal, rename and return | Historical exact records remain; rename is retirement plus new name; return starts 1.0.0 after published absence, including empty-collection interval. Repeated labels bind distinct sources. | Implementer |
| Multi-skill historical commit | Export only selected complete folder/resources/modes; other source folders and installations untouched. | Implementer |
| Source and adapted integrity | Verify original tree, change only supported name boundary, retain instructions/resources/release metadata, record accurate source/installed manifests and receipt. | Implementer |
| Unsupported content and names | Reject unsafe/overlong names, traversal/case collisions, reserved receipt paths, nested discoverable instructions, symlinks/reparse redirection, submodules, LFS pointers and known nonportable references before activation. | Implementer |
| Existing destination/prior copy | Recognizable prior copy or occupied destination stops, even identical/edited/malformed; no overwrite, managed replacement or deletion. | Implementer |
| Concurrency and interrupted creation | Same source/home lock; no stale-lock stealing. Exclusive reservation and final no-replace instruction publication; test races and failures on supported Windows/WSL filesystems. | Implementer |
| Recovery and cancellation | Distinguish no destination, partial without root instruction, completed publication and report crash. Read-only inspect; user/Andrew handles partial files, no automatic deletion. | Implementer |
| Runtime/source failures and direct fallback | Clear missing-runtime, unavailable source/protocol and busy results. Stop auth/security failures. Direct invocation uses the same fixed bundled implementation. | Implementer |
| Native update outcomes | Direct whole-plugin additions/removals, four-column verified change table; unknown/missing notes, skipped notes, config-only/no-change and partial failure reported accurately. Updater changing itself retains its original evidence. | Implementer, then client checks |
| First update from old bundle | Successful native transition without invented previous skill versions; fresh-session guidance and new installed status work once delivered. | Implementer fixtures; Andrew client pilot |
| Managed GT edits during native update | Published plugin content replaces managed edits without a preservation prompt or backup. Verify actual client behavior, including a no-new-release invocation; report limitations instead of claiming a repair. Personal/project files remain untouched. | Implementer fixtures; Andrew client pilot |
| Status isolation | Three-column installed GT inventory only, correct notes; zero personal inventory/receipt inspection, online catalog lookup, execution of resources or writes. | Implementer |
| Status uncertainty | Unknown fields, absent vs empty vs unlocated/incomplete installation; installed return/removal facts only; no false latest or loaded-chat claims. | Implementer |
| Native remote install/update/reinstall | Actual supported CLI/VS Code operations succeed on intended installation; unrelated configuration and fixture personal files unchanged. Native automatic updates tested separately from prompted ones. | Andrew with implementer support, deferred |
| Main/personal activation and resources | Normal main name and version-suffixed personal name each load intended instructions/resources; inventory alone insufficient; created files distinct from client discovery. | Andrew with implementer support, deferred |
| Fresh/existing chats and environments | Record actual refresh behavior; explicit Windows/WSL targeting, no cross-environment writes; shared-home discovery not promised client-exclusive. | Andrew with implementer support, deferred |

Filesystem collision/crash evidence must use disposable fixtures, not real personal files. Observing personal fixture bytes during acceptance verifies non-mutation; it does not add personal inventory to the shipped status feature. Use exact tool/client/runtime versions in later evidence and preserve failed-run records.

## Owner setup handoff, not actions performed now

- Configure the chosen required validation check against current main after it exists; a workflow file alone is not merge enforcement.
- Preserve main ancestry and the accepted merge/squash publication convention so source snapshots remain reachable. No history rewrites, separate historical branch or release tags are required by this design.
- Maintain runtime setup guidance for export in the target environment; implementation checks the supported versions from the export contract at that time.
- Publishing, commits, PRs, merges, tags and settings changes remain separate owner actions. A selected rollout plan is not authorization to perform them.

## Completion and execution handoff

Rollout scope, managed-edit handling and test ownership/timing are settled. No further product decision is required to resolve this planning issue. Implementation and client evidence remain real execution work, tracked outside the planning map in the [implementation issue index](skill-versioning-implementation-handoff.md). Do not silently shrink the supported scope or treat partial historical evidence as final acceptance; report implementation failures and address them before recommending wider adoption.
