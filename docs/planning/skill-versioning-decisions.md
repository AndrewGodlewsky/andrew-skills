# Skill versions and GT archive — accepted behavior

> **Superseded packaging/lifecycle:** The owner has since selected a create-only personal-copy handoff and prefers a version-suffixed personal name. Read [the current direction](skill-personal-copy-direction.md). The archive plugin, archive prefix and managed replacement/removal below are historical, not current requirements. Native GT updates and publishing decisions remain valid; naming and export-only Node/Git are settled in the current export contract.

**Status: accepted on September 15, 2026.** The owner approved native GT updates with optional historical copies and selected the name `gt-archive`. Canonical record: [architecture resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/4#issuecomment-5674810009). This replaces the prior managed-pin contract. Its historical local copy is [preserved here](history/skill-versioning-managed-pin-decisions.md).

## User experience

- Install/update `gt` through the existing native plugin mechanisms. A normal update changes the whole bundle; fresh installs include all active skills.
- Each skill has its own version and concise release notes. A plugin update need not change every skill's version.
- Use the restore skill to export a complete historical release into a separate local `gt-archive` plugin. The main collection stays intact.
- Explicitly select the archived entry point: intended examples are `/gt:grill-me` and `/gt-archive:grill-me`. These names are the agreed contract; dual-client activation remains unverified.
- Archive copies stay as they are until the user explicitly replaces/removes them. They are outside normal team updates and support, even if their source skill remains active.
- Return to team behavior by using the ordinary GT command. Keeping the archive copy is optional.
- Inspect installed versions and short notes for main and archived skills. Status is read-only and distinguishes unknown, stale, or modified content from verified releases. It does not claim an already-open chat has loaded the installed release.
- Windows and each WSL environment keep separate installations/archives across projects. No automatic cross-environment synchronization, project policies, or team recommendation profiles.

## Historical source and support

Derive independent release records from preserved merge/squash history, including a skill version, full Git commit ID, folder path, and notes. Retrieve only the selected skill's entire folder, including scripts/templates/resources. Several skills can share one commit; exporting one must not change another. Name/version labels can repeat after removal and return; select an exact source record.

Version only changed release content, including small corrections. Preserve exact source identities and retrievable history. The team fixes/supports latest only; no historical development branch or maintained old release line is required. The [publishing contract](skill-publishing-notes.md) specifies metadata, numbering, catalog construction, publication and retention requirements; implementation remains future work.

## Archive operations

A fixed exporter receives validated inputs from the restore skill. It handles lookup, retrieval, verification, copying, provenance and supported archive registration. Agents must not generate a new exporter or rewrite its source per operation.

Archive storage is outside the main plugin's cache/update destination. Protect existing files: no silent overwrite, explicit replacement/removal, no main-plugin mutation during export, and preserve an existing archive on failure. The archive design issue owns exact records, integrity, concurrency, recovery, multiple-copy policy, client registration and a directly callable fallback.

No new full-collection manager is required. No Node prerequisite was accepted. The archive issue chooses its runtime/delivery approach; ordinary plugin installation/update should not acquire an exporter-only prerequisite. Setup edge cases can be referred to Andrew.

## Retired skills

Historical releases of retired skills remain eligible for export. Their archive copies remain user-owned and unchanged when the main plugin removes or later reintroduces a skill.

The owner chose to restart a returning skill at `1.0.0`, including reuse of the same name. Old archive copies need no migration. Repeated labels refer to distinct source snapshots; latest follows publication order, not the highest number across resets.

The guided update interaction should explain removals and the option to archive historical content. Native updates outside that interaction may remove the main copy without our prompt; preserved catalog/history supports later export. Do not promise interception of every native update. Preserve complete content before any explicit handoff deletes an original, and resolve modified/unidentified legacy files and destination collisions without overwriting them. Exact interaction belongs to the existing prototype/migration issues.

## Acceptance scenarios

| ID | Scenario | Required outcome |
| --- | --- | --- |
| A1 | Fresh/native installation | Current GT bundle with independently identifiable skill versions; archive enrollment is optional. |
| A2 | Only one skill changes | New version/notes for that skill; unchanged skills retain their versions. |
| A3 | Native whole-plugin update | Main collection updates, including additions/removals; archive files and records remain unchanged. |
| A4 | Export one older skill from a multi-skill commit | Complete requested folder appears in GT archive; main and unrelated archive content unchanged. |
| A5 | Invoke current and archived skill | Distinct intended prefixes select the respective release in supported clients; verify later. |
| A6 | Use current behavior again | Invoke main GT skill; no pin/unpin operation or archive deletion required. |
| A7 | Failed/missing historical download | Report failure; preserve main plugin and existing archive content. |
| A8 | Archive destination exists or was edited | Require an explicit resolution; never silently overwrite unrelated files. |
| A9 | User cancels proposed export/change | No content or registration changes from the canceled operation. |
| A10 | Team retires/reintroduces a skill | Return starts at `1.0.0`; existing archive survives without migration; repeated version labels retain distinct source identities. |
| A11 | Inspect versions offline or in an existing chat | Show local identity/notes where known, stale/unknown availability, and no invented loaded-chat version. |
| A12 | Windows and WSL coexist | Changes affect the intended environment; no automatic cross-environment edits. |
| A13 | Restore skill cannot load | Document a narrow direct exporter/recovery route; protect existing data. |

## Scope removed from the earlier contract

Managed pins inside GT, selective updates within its bundle, automatic override of normal commands, per-update pin-upgrade offers, unpin state changes, and migration to a helper-owned mixed-release main plugin are out of scope. Archived copies are deliberate alternative entry points. Earlier questionnaire recommendations and answers remain historical evidence, not conflicting current requirements.

## Work remaining

- Publishing design is settled in the [publishing contract](skill-publishing-notes.md); implementation is still pending.
- [Define historical skill export and personal copy handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/6).
- [Prototype native GT updates and personal skill restoration](https://github.com/AndrewGodlewsky/andrew-skills/issues/7).
- [Prototype skill version status and concise release notes](https://github.com/AndrewGodlewsky/andrew-skills/issues/8).
- [Define migration and acceptance checks for the existing skills hub](https://github.com/AndrewGodlewsky/andrew-skills/issues/9).

The [compatibility investigation](../research/skill-version-compatibility-results.md) remains partial evidence with deferred tests, not proof of this architecture. Preserve its observed failures. This is an accepted plan, not shipped functionality or permission to publish code.

