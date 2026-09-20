# GT installation targeting — accepted handoff

> **Execution update:** the working-tree [updater](../../skills/skills-update/SKILL.md)
> and [status skill](../../skills/skills-status/SKILL.md) now carry this selection
> contract in their own bundled resources. Supplied-evidence instruction checks
> cover the branches; real client registration, routing and activation still need
> the owner pilot. The accepted planning record below is preserved.

**Status: owner accepted and decision/map closed September 20, 2026; implementation and live client verification pending.** Decision: [Define installation ownership and update targeting across Copilot CLI and VS Code — resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/22#issuecomment-5752852987). The complete [reviewed flow, decision table and evidence plan](skill-installation-targeting-round-1.md) retain the owner's original answer.

## Accepted behavior

- Recommend one installation per user environment through either the CLI or VS Code onboarding route. Shared use of a CLI-managed copy does not need a second installation. Deliberate separate copies remain permitted; no cleanup, consolidation, migration or installation blocking is introduced.
- Select one intended managed GT installation at a time. Prioritize explicit user intent matched to verified registration/source evidence, then reliable active-skill source association. Without source association, a sole verified candidate in the current environment may be selected if no evidence contradicts it. State the target; this does not prove the source of earlier chat instructions.
- Ask one concise target question when evidence is ambiguous, conflicting or insufficient. A user choice establishes intent, not proof that an arbitrary folder is managed. Use relevant manager registration, GT provenance, environment/user/configuration and root identity; paths, names, model choice or the current directory alone are insufficient.
- Use the installation's owning manager. For a verified CLI target with appropriate access, preserve the native catalog-refresh-then-GT-update sequence. Verify the fixed names identify that source in the same effective configuration. For VS Code-managed targets, guide native UI updates until a supported direct bridge is established. Never substitute an update to a different CLI copy.
- Explicitly requested multiple copies may be handled sequentially using the same single-target flow, each with separate evidence and results. Do not update all discovered copies by default. Stop on failure or unresolved identity and report prior completed work.
- Recognize development sources, disabled state, absence, unlocated targets and cross-environment mismatches. Do not pull a development checkout or automatically install, enable or repair a plugin. A disabled copy may be explicitly updated only if its native manager supports that without silently enabling it.
- Preserve a small before-snapshot outside files the native update replaces, using a supported task/session mechanism. Reidentify the same manager registration after an update, including changed cache paths. Do not add a permanent inventory database.
- Resume guided UI updates after the user reports completion and reread the same target where possible. Separate user-reported completion, native operation results and verified file changes. Missing before-state or lost chat context limits comparison; never reconstruct fictional previous versions.
- Retain the accepted whole-plugin update and result-table semantics. Unknown release metadata does not prevent a correctly targeted update; missing/ambiguous ownership is different. Command failures, partial changes, cancellation and security stops remain explicit. Installed files do not certify the instructions retained in an existing chat.

## Existing implementation owners

| Issue | Required integration |
| --- | --- |
| [Add per-skill result tables to native GT updates](https://github.com/AndrewGodlewsky/andrew-skills/issues/15) | Target selection and native routing, snapshot survival/reidentification, guided UI resumption, explicitly selected sequential targets and honest transition reporting. Document the actual supported prerequisites and update route with implementation. |
| [Implement the installed GT skills-status report](https://github.com/AndrewGodlewsky/andrew-skills/issues/16) | Reuse target identification for the selected installed collection. Read-only status need not have update-capable CLI/terminal access if the installation is reliably identifiable/readable. Preserve installed-only columns, unknown/absent/empty distinctions and no personal inventory or remote comparison. |
| [Complete the owner pilot and team adoption readiness checks](https://github.com/AndrewGodlewsky/andrew-skills/issues/17) | Verify the complete targeting matrix, supported evidence in actual client versions, native actions, target continuity and failure/resumption cases. Finish onboarding/update documentation consistent with actual behavior and preserve unknowns until resolved. |

Reuse these issues, their metadata dependencies and their existing validation work. No additional updater, installation manager, status project, registry or exporter prerequisite is required. The canonical authoring-guide issue can point management-skill authors to the implemented prerequisites without taking ownership of runtime routing.

## Required evidence matrix

Cover CLI-only, VS Code-only, one shared CLI installation, accidental/deliberate separate copies and explicitly requested sequential updates. Include configured locations/profiles, development sources, disabled/absent/unlocated/incomplete states and Windows/WSL/SSH/container mismatches.

For each actual client/harness version, establish which supported signals expose registration, provenance and active-source association. Verify name-based CLI targeting, available native VS Code actions and the scope of any global update check. A documented UI command does not establish a skill-callable bridge or GT-only mutation.

Include failed/partial/no-change updates, snapshot survival when the updater replaces itself, fresh-chat loss of before-state, user-performed UI updates, cache-path changes and incomplete reidentification. Verify status remains read-only with no personal or remote-release lookup. Use disposable fixtures in the deferred pilot rather than changing the owner's real installations during planning.

## Limits and next phase

The review relied on the September 20 documentation check and earlier source research linked in the review round. Those support the design; they do not prove runtime compatibility. No plugin inventory scan, client launch, update, installation, settings change or production implementation occurred to resolve this decision.

This completes the remaining question in the [architecture and contribution planning map](https://github.com/AndrewGodlewsky/andrew-skills/issues/18). The [authoring handoff](skill-authoring-implementation-handoff.md) and [versioning handoff](skill-versioning-implementation-handoff.md) track the execution phase. Future creator/submission skills and GitHub approval governance remain outside this completed map.
