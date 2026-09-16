# Skill distribution — accepted GT archive architecture

> **Later owner decision:** [Create-only personal copies](skill-personal-copy-direction.md) supersede this document's archive-plugin registration, dedicated archive prefix and managed lifecycle. The owner prefers a name ending in the source version; personal naming and export-only runtime are now settled. Preserve the evidence below, but use the current direction for new work.

**Accepted September 15, 2026.** [Canonical issue resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/4#issuecomment-5674810009). This working copy supersedes [the earlier mixed-version manager proposal](history/skill-distribution-managed-proposal.md).


The owner approved the simpler model in conversation and selected **`gt-archive`** as its name. This supersedes the managed-pin behavior in [Define latest-by-default updates and personal skill pins](https://github.com/AndrewGodlewsky/andrew-skills/issues/3#issuecomment-5673651654), the mixed-version local-`gt` proposal, and interim handoffs describing Node as the only remaining decision.

### Selected architecture

- Keep `gt` as the normally installed and natively updated team plugin. Copilot CLI remains the CLI installation/update mechanism; VS Code retains its supported installation path. Fresh installs contain all active skills. Normal updates update the whole bundle, including additions/removals.
- Give each skill an independent release version and concise notes. Unchanged skill content keeps its version even when another skill changes and the containing plugin is republished. Distinguish skill, plugin, and catalog versions.
- Restore a historical skill into a **separate user-level local plugin named `gt-archive`**, outside the main plugin cache and native remote-update destination. The main installed skill remains unchanged.
- Intended invocation: `/gt:grill-me` for the installed team release and `/gt-archive:grill-me` for an archived copy. The user explicitly chooses the archive entry point. These are the agreed naming/routing contract, subject to deferred cross-client verification; exact restore-skill invocation remains a prototype decision.
- Archived copies are user-owned and outside normal team updates/support, whether their source skill is active or retired. Normal GT updates do not modify or delete archive files. Users explicitly replace or remove copies. Returning to team behavior means invoking the main command; no unpin operation is needed.
- Windows and each WSL environment have separate installations/archives across their projects. No automatic synchronization or per-project version policy.

### Source, execution, and ownership

The team maintains one current source line and a release catalog derived from preserved merge/squash snapshots, recording each release's version, full Git commit ID, skill folder path, and short notes. Preserve exact source identities and the history needed to retrieve them. Several skills may share a commit; exporting one retrieves only its complete folder, including resources. No separately patched historical branch is required. The [publishing contract](skill-publishing-notes.md) specifies the design.

The owner chose returning-name resets: after published removal, a returning skill starts again at `1.0.0`. A name/version alone is therefore not a globally unique release identity. Keep distinct commit/path records and determine latest by publication order; no migration or replacement of existing archive copies is required.

A dedicated restore/export skill calls fixed deterministic retrieval code with validated inputs. That code resolves a release, stages and verifies its complete files, writes the archive copy and origin/version/notes record, and registers or refreshes the archive through supported client mechanisms. It must not ask the agent to generate or rewrite the exporter each time. Native clients own the main plugin; the exporter owns only its explicit archive writes/registration. Copies and archive records must survive main-plugin changes and failures.

The exporter is substantially narrower than a manager for every installed skill. Keep ordinary GT installation/update usable without a new full-collection manager. **Node is not an accepted prerequisite.** The archive design ticket chooses the smallest practical runtime/delivery strategy and a direct fallback if the restore skill cannot load; any resulting prerequisite belongs to archive use. Setup edge cases should receive simple guidance/manual support from Andrew, not an unrequested runtime-provisioning or packaged-executable project.

No overwrite of unrelated personal content; archive replacement/removal requires an explicit user choice. A failed export must preserve the main collection and existing archive copies. Define interruption/concurrency, locally edited archive content, provenance verification, name collisions, maximum copies per skill, and helper compatibility in the archive ticket. One copy per skill is a simplifying candidate, not a separately approved storage constraint.

### Explicitly superseded behavior

Remove selective per-skill updates within the main bundle, managed pins, automatic substitution of an old release under the normal command, every-update offers to update pins, unpin transitions, and migration of every user into a helper-assembled mixed-version GT plugin.

Keep version visibility and short notes. A read-only status surface distinguishes main installed releases from archived copies and optionally compares catalog availability, without enrolling archives in an update workflow or claiming which instructions an existing chat has loaded. The enhancement adds no background installer.

Retired historical releases remain exportable to `gt-archive` using preserved catalog/history. The guided update flow should explain removals and a route to archive a release. Native updates outside that flow can remove a main-plugin skill: do not promise an interception before every native removal. Already archived copies survive independently. Design retirement messaging and safe handling of modified/unidentified legacy content in the interaction and migration tickets; preserve complete files before any explicit handoff deletes an original.

### Evidence and limits

Reuse [the accepted compatibility investigation](https://github.com/AndrewGodlewsky/andrew-skills/issues/10#issuecomment-5674093165): exact commit/path folder retrieval was verified; local CLI plugin discovery is supported by the experiment. Two qualified plugin entries appeared in inventory, but dual-plugin invocation was not proven; personal overrides hid qualified commands. The tested external-SHA installation path produced no usable installed entry and must not be described as passing.

Archive registration/discovery in CLI and VS Code, dual-prefix invocation, resource loading, main native/automatic updates leaving the archive unchanged, existing chats, and Windows/WSL behavior remain later acceptance checks. The owner reports the existing plugin works through WSL with CLI. No new live tests are required to resolve this planning decision.

### Repository and ticket handoff

Keep the existing root plugin/marketplace distribution model; do not convert it into a generated per-user bundle. Later implementation adds per-skill release metadata/catalog validation, archive export/registration, version-aware user guidance, and an independently versioned restore skill. Publishing may still change the container plugin version; that never assigns a new release number to every contained skill.

- **Define automatic skill versioning and immutable release history:** versions, notes, changed-content detection, commit/path catalog, publication ordering/retries and retention; version the native bundle independently.
- **Define historical skill export and personal copy handoff:** deterministic export, archive state/registration, failure recovery, runtime/delivery and direct fallback.
- **Prototype native GT updates and personal skill restoration:** whole-plugin update preview, independent archive restoration, explicit invocation, removal/retirement messaging and simple recovery.
- **Prototype skill version status and concise release notes:** main versus archive identities, notes, offline/unknown/modified state and installed versus loaded instructions.
- **Define migration and acceptance checks for the existing skills hub:** retain native onboarding, add optional archive enrollment, unversioned legacy handling and the deferred acceptance matrix.

The existing issue identities and dependency edges remain; their titles/bodies are updated to this scope. Local decision copies: `docs/planning/skill-distribution-proposal.md` and `docs/planning/skill-versioning-decisions.md`. Original written answers remain in the question rounds. This resolves the distribution decision only; implementation, live testing, commits, pushes, and publishing have not occurred.
