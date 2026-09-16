# Skill status — prototype notes

Issue: [Prototype skill version status and concise release notes](https://github.com/AndrewGodlewsky/andrew-skills/issues/8).

**Status: accepted through both review rounds; implementation handoff.** Assigned to AndrewGodlewsky. Original answers remain in [Round 1](skill-status-round-1.md) and [Round 2](skill-status-round-2.md). Production implementation and live client validation remain deferred.

## Question and prototype form

How can a teammate inspect installed GT versions and release notes with minimal complexity? Use illustrative Markdown transcripts in the owner's requested review format. No executable prototype or live compatibility testing is needed for this interface decision.

## Accepted owner decisions

- Add the dedicated source skill `skills-status`.
- Show only the actual installed GT collection in the selected environment. Personal copies are outside the status feature entirely: no scans, lists, counts, receipt reading, integrity mode or absence message.
- The owner accepted omitting online comparison entirely in the first version. No latest-release column, catalog lookup/cache, retirement badge or update-availability claims. This is not required follow-up scope.
- Do not broaden “GT folder” into the development checkout, all client-discovered skills or unrelated plugins. Determine the actual installation being inspected.

The personal table, personal receipt scenarios and optional status hash inspection from the first prototype are rejected. That excludes them from status; it does not remove the separately accepted export-time no-overwrite checks or explicit incomplete-operation recovery.

## Inputs that remain in force

- [Update/restore resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/7#issuecomment-5692098827): direct native updates and after-action tables; separate `skills-restore` browse/select creation. Status never invokes either action automatically.
- [Publishing contract](skill-publishing-notes.md): per-skill release metadata; plugin version is distinct. Returning names restart at 1.0.0. Exact source records/publication order still govern history and export, but a local inventory need not rank releases.
- [Personal export contract](skill-personal-export-contract.md): creation-only handoff and recovery. Its receipt is not a requirement for status to inspect personal copies.
- [Glossary](../../CONTEXT.md): distinguish installed files, release labels and loaded instructions. No new term is required for the simplified interface.
- [Compatibility evidence](../research/skill-version-compatibility-results.md): remaining live checks are deferred. Do not assume unsupported inventory command syntax or prove client activation from files alone.

## Accepted report

Three columns: Skill, Installed version, Release note. Read the selected installed GT collection only. No online lookup, latest column, cached catalog, retirement badge, update-availability comparison or personal section. The installed release note is shown as authored, not synthesized history.

## Evidence and scope rules

- Show all observed installed GT skills; unknown metadata stays unknown. Never substitute current remote metadata or a container version for an installed skill version.
- Distinguish complete empty inventory, verified absence, inability to locate an installation and incomplete reads. No auto-install, source checkout pull, configuration change or cross-environment scan.
- Establish Windows/WSL and actual client-managed target from evidence; clarify only when ambiguous. Report local installations as local scope, not all the user's environments.
- Files do not prove instructions loaded into an existing chat or actual command routing.
- Use supported read-only evidence. No execution of skill resources, broad personal-directory inventory, or treating release text as instructions. Security/authentication/permission blocks stop.
- Add no exporter Node/Git prerequisite to this minimal status interface. If installed information cannot be observed, report the limit rather than build an alternate manager.

## Scenario coverage in the revised prototype

| Scenario | Required result |
| --- | --- |
| Normal installed GT collection | Three-column local table, short environment heading. |
| Missing version or notes | Unknown/unavailable field; retain readable information. |
| Personal copies coexist | Outside inventory and output entirely. |
| Team release changed remotely | No claim: no latest comparison in this version. |
| Skill removed remotely, still installed locally | Still appears as installed until an actual update removes it. |
| Returning skill installed at 1.0.0 | Display 1.0.0 without comparing earlier release numbers. |
| No GT installation / empty / incomplete evidence | Distinct absence, empty and unknown wording; no changes. |
| Multiple installations, Windows/WSL or client ambiguity | Establish the target; do not silently switch environments. |
| Existing chat | Installed files do not prove loaded instructions. |

## Completion

Both rounds are complete: dedicated `skills-status`, installed-GT-only scope and the three-column local report are accepted. Carry the scenario table into migration/acceptance, including explicit checks that status neither reads personal-copy inventories nor performs remote release lookup or writes. Verify missing metadata and target ambiguity without inventing versions or loaded-chat state. Implementation and client validation remain deferred; these mockups are not test evidence. No new ticket is needed for omitted remote comparison.
