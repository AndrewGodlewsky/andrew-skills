# Personal historical copies — current direction

**Status: accepted after [Round 3](skill-archive-round-3.md).** The [export contract](skill-personal-export-contract.md) is the implementation handoff. This supersedes the archive-plugin packaging and managed lifecycle in earlier architecture. Original answers remain in all three rounds. Personal naming and Node/Git for export only are settled.

## Accepted behavior

- Native GT remains the whole-plugin team installation/update mechanism. Plugin skill folders/frontmatter names stay unchanged, with no version suffixes.
- Restore creates a personal historical copy and then finishes. The copy is outside the plugin and the user can edit it freely. No ongoing monitoring, synchronization, backups, replacement/removal service or import into the team repository.
- Existing destinations are never overwritten. Users manage their own files before trying another export.
- One copy per source skill remains the intended supported workflow. The version suffix does not silently change that into multiple copies per source. At export time, check recognizable prior exports for that source and stop if one remains. No background enforcement, deletion or policing of files the user subsequently renames/copies.
- Windows and each WSL environment stay separate. Copying into a personal location may make the skill visible to multiple clients sharing that home; no client-exclusive discovery promise.
- Retired and active source skills can both be exported; returning source names restart at `1.0.0`. Source commit/path, not a repeated version label, identifies the selected historical release.
- The fixed exporter must still retrieve and verify complete source files, protect existing content and recover from interrupted creation. No agent-generated file-manipulation script for each request.
- Node and Git are accepted for historical export only; normal native installation/update has no new exporter requirement. No implementation, tool installation or live client tests are requested.

## Accepted naming

Only personal copies append the version: `<skill>-v<major>-<minor>-<patch>`, such as `grill-me-v1-2-0`. The source plugin skill remains `grill-me`. The distinct personal name avoids deliberately creating a same-name override; actual discovery/coexistence remains in later client tests.

The folder and frontmatter name must agree; source version stays `1.2.0` in release metadata. Verify the untouched source first, then record the intentional naming adaptation and installed result separately. Never claim renamed bytes are the original source tree.

Do not blindly replace every occurrence of the source name in scripts/instructions. Unsupported name-bound or plugin-dependent sources stop before publication. The export contract defines source/installed receipts, portability limits, create-only publication and failure handling.

## Consequences for prior plans

- Drop the requirement for a local `gt-archive` plugin, plugin registration and its dedicated prefix from the current personal-copy direction.
- Keep independent team versioning, notes, immutable source snapshots and whole-plugin updates from the [publishing contract](skill-publishing-notes.md).
- The owner excluded personal copies from `skills-status` in [status Round 1](skill-status-round-1.md). Status shows the installed GT collection only: no personal inventory, origin display or receipt inspection. Export-time collision protection and explicit incomplete-export recovery remain separate from status; there is no ongoing tracking.
- The [reviewed interaction](skill-interaction-prototype-notes.md) keeps `skills-update` direct: apply the whole GT update, including additions/removals, then show the changed-skills table. No removal or copy-first approval gate. `skills-restore` separately shows releases, notes and the proposed personal name/location before selection, then creates the copy and hands ownership to the user.
- Migration/acceptance should cover personal discovery, distinct names, renamed-source integrity, collisions and interrupted creation. Preserve deferred client-test limitations.
- Export, update/restore interaction, [installed-GT-only status](skill-status-prototype-notes.md) and [migration/acceptance](skill-migration-acceptance-notes.md) design are complete. The [implementation handoff](skill-versioning-implementation-handoff.md) includes the restore skill and owner pilot before wider adoption; execution has not started.
