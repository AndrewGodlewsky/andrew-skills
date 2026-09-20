# Skill versioning — implementation handoff

**Status: metadata baseline published; catalog, update/status instructions and authoring/architecture implementation are in the working tree.** The owner published issue #12 in `bf74bca587d80502394f27fc5984816081c92a12`. The current parallel wave covers #13, #15, #16, #23 and #24 and remains uncommitted. Its hosted CI and owner pilot have not run. Exporter #14, restore #11 and final pilot #17 remain pending. The owner approved a complete feature set and small owner pilot before wider team adoption, with development allowed in stages. Source: [migration resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/9#issuecomment-5692675491).

## Execution issues

These sit outside the completed [Wayfinder planning map](https://github.com/AndrewGodlewsky/andrew-skills/issues/1). Dependencies use GitHub's native blocking relationships. The existing restore issue is reused.

| Work | Prerequisite |
| --- | --- |
| [Add per-skill release metadata and validation](https://github.com/AndrewGodlewsky/andrew-skills/issues/12) | First implementation step |
| [Build the skill release catalog from published Git history](https://github.com/AndrewGodlewsky/andrew-skills/issues/13) | Metadata and validation |
| [Implement create-only historical skill export and recovery](https://github.com/AndrewGodlewsky/andrew-skills/issues/14) | Historical catalog |
| [Create the restore skill for historical personal copies](https://github.com/AndrewGodlewsky/andrew-skills/issues/11) | Exporter |
| [Add per-skill result tables to native GT updates](https://github.com/AndrewGodlewsky/andrew-skills/issues/15) | Metadata and validation; accepted installation-targeting contract |
| [Implement the installed GT skills-status report](https://github.com/AndrewGodlewsky/andrew-skills/issues/16) | Metadata and validation; accepted installation-targeting contract |
| [Publish the canonical GT skill authoring guide and examples](https://github.com/AndrewGodlewsky/andrew-skills/issues/23) | Accepted authoring blueprint; coordinate release-workflow documentation with metadata implementation |
| [Enforce the GT skill architecture and adopt it in existing skills](https://github.com/AndrewGodlewsky/andrew-skills/issues/24) | Accepted authoring blueprint; coordinate shared validator/skill edits with metadata implementation |
| [Complete the owner pilot and team adoption readiness checks](https://github.com/AndrewGodlewsky/andrew-skills/issues/17) | Restore, update reporting, status, canonical authoring guide and architecture adoption (catalog/exporter included transitively) |

Metadata validation established the stable CI job. Catalog implementation now adds history-dependent checks to that same job; required-check settings remain an owner action. Update/status work does not acquire the exporter's runtime prerequisite.

The September 20 [authoring handoff](skill-authoring-implementation-handoff.md) adds guidance and architecture-adoption prerequisites to complete rollout. It introduces no blocker for settled metadata work and no second release schema or CI job. Coordinate shared files; combine baseline/adoption edits where practical, otherwise follow normal release increments.

## Contracts to use

- [Publishing](skill-publishing-notes.md): per-skill version/notes, immutable exact historical sources, metadata baseline and CI rules.
- [Personal export](skill-personal-export-contract.md): complete source retrieval, controlled name adaptation, no-overwrite, concurrency and recovery.
- [Update/restore interaction](skill-interaction-prototype-notes.md): direct native update then result table; separate browse/select creation.
- [Status](skill-status-prototype-notes.md): installed GT-only three-column local report.
- [Migration and acceptance](skill-migration-acceptance-notes.md): native adoption, managed edits replaced, test ownership and pilot expectations.
- [Installation targeting](skill-installation-targeting-handoff.md): select the intended managed copy, native CLI/VS Code routing, guided-update resumption, status reuse and target/evidence verification.

The linked issue resolutions are the remote decision record. Local planning files and interview answers remain uncommitted until Andrew chooses to publish them. Original answers are preserved; superseded proposals are not current requirements.

## Delivery and evidence boundaries

- Local metadata/release, catalog and architecture checks have automated fixtures. Update/status instruction scenarios use supplied evidence and are not native-client tests. End-to-end product acceptance remains pending. Historical compatibility research is partial evidence, not a pass for the new implementation.
- Native updates replace managed GT edits without a preservation system; personal/project files and development checkouts remain outside that policy. Native no-op behavior requires evidence before claiming it repaired edits.
- The pilot records actual client invocation, resources, fresh/existing chats and Windows/WSL targets; inventory or created files alone is insufficient.
- No separate historical branch, archive plugin, selective main updates, personal-copy tracking or online status comparison is in scope.
- Complete code and automated checks precede the owner pilot; the complete feature set and pilot precede wider team adoption. No deployment date is promised.
- Nothing here authorizes commits, pushes, PRs, merges, tags, releases or repository setting changes. Those remain Andrew's separately authorized actions.
