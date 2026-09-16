# Update and personal restore — prototype notes

Issue: [Prototype native GT updates and personal skill restoration](https://github.com/AndrewGodlewsky/andrew-skills/issues/7).
**Status: interaction decisions settled through both review rounds.** This is the implementation handoff for the reviewed interaction; original answers remain in [Round 1](skill-interaction-round-1.md) and [Round 2](skill-interaction-round-2.md). Production implementation and live client validation remain deferred.

## Prototype question and form

What should teammates see and decide during ordinary native GT updates and create-only personal restoration? This is a throwaway written conversation prototype, consistent with the owner's Markdown review preference and the issue's transcript/mock-up scope. It does not simulate filesystem correctness or client compatibility and contains no executable updater/exporter.

Round 1 contains six illustrative transcripts; Round 2 expands the requested result table. Once reviewed, retain accepted interaction decisions and clearly mark superseded examples rather than promoting them into production code.

## Baseline and boundaries

- [Publishing resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/5#issuecomment-5675205215): independent skill versions/notes, exact source records, repeated labels after removal/return.
- [Personal export resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/6#issuecomment-5689786832): source names unchanged inside GT; suffixed personal names; create-only handoff; Node/Git for export only; user ownership after creation.
- [Existing update skill](../../skills/skills-update/SKILL.md) requests marketplace refresh then whole-plugin update, distinguishes CLI and VS Code-managed installations, and reports evidence without inventing version changes. It is production baseline, not an implementation of these previews.
- Live client tests remain deferred. CLI/VS Code command names in the transcript are design examples; confirm actual supported spellings later.
- No separate archive plugin, pins, selective updates, overwrite, managed replacement/removal, background monitoring or repeated personal-upgrade prompts.
- Status issue owns the standalone overview interface; this issue shows only information needed for update/export decisions.

## Reviewed Round 1 decisions

1. `skills-restore` accepted in response to the proposed spelling; paired with `skills-update`, with no source-version suffix or additional alias.
2. Update the whole installed GT collection, then show a four-column table of actual changes: skill, previous version, updated version and short change explanation. The owner requested a richer prototype; they did not accept the earlier preview/removal pause policy.
3. Browse-and-select Prototype D accepted. Show target/destination/release notes before selection; selection requests creation, with no duplicate final confirmation. Do not infer acceptance of the separate exact-request bypass. Existing destinations always stop.

## Reviewed Round 2 decisions

The owner selected Example B's combined result table and explicitly rejected pausing for removals: update the complete GT plugin, adding and removing skills as the native update requires, then summarize the outcome. This supersedes every earlier proposed removal approval or copy-before-update gate.

1. Once the actual installation target is established, invoking `skills-update` requests the native whole-plugin update. Give brief progress, apply it, then report. No per-skill choices, removal confirmation, required release preview or automatic restore step.
2. Show changed skills, additions and removals together in four columns: **Skill**, **Previous version**, **Updated version**, **What changed**. Use `Not installed` and `Removed` only for verified presence transitions. Omit unchanged rows.
3. Include a concise route to `skills-restore` for a removed skill when historical source is available. Restoration is a separate user-requested action after the update; it does not hold up native removals. Existing personal copies remain outside the native update.
4. Non-security gaps in release-preview information do not introduce an extra confirmation or prevent the requested update. Disclose unavailable details and report only what can be verified afterward. Ambiguous installation targets still need clarification, and native tool approvals and security/authentication stops still apply.
5. No-change, incomplete-comparison and failure wording follow the evidence rules below. Those reporting safeguards preserve accuracy; they do not turn information gaps into additional approval steps.

File operations and recovery retain the accepted exporter contract. No new product choice remains in this interaction issue; standalone status presentation and migration details stay with their own issues.

## Result-table data contract for the revised prototype

- Capture installed metadata/identity before native mutation, compare with actual installed after-state, and retain the snapshot long enough to report even if `skills-update` itself changed. Do not recursively reload it midway through the result.
- Compare source/content identity where available, not version strings alone: a reintroduced release can reuse a number. Equal labels with distinct verified sources are still a changed release. Do not classify unchanged skills as changed merely because the containing plugin advanced.
- Added/removed means verified presence change, not missing metadata. Old version unknown is not the same as not installed. If identity evidence is insufficient, report unknown rather than fill a success table with guesses.
- Show verified changed rows only; disclose incomplete coverage and show confirmed installed values separately when a transition cannot be proved.
- Change text summarizes available verified notes for the actual transition. If only the installed release note is known, label that limited scope. Missing notes do not block native updates or invite invented summaries.
- A failed native operation is a failure regardless of table data; any observed changes are explicitly reported after that failure, never as a completed update or implicit rollback.
- Unknown latest status cannot become “already current.” A configuration-only bundle update can succeed without skill-release changes.
- No exporter runtime dependency is added to ordinary updates. Missing preview metadata is distinct from auth/security blocks, which always stop.

## Scenario coverage for review and follow-up

| Scenario | Required response / state for implementation |
| --- | --- |
| Ordinary update | Brief progress, native whole-plugin action, verified four-column result table; personal files untouched. Round 2 A. |
| No updates | “GT is already current” only with current-check evidence; otherwise report the native command's actual result. No personal-copy prompts. |
| Addition or removal | Apply the native update directly, then show verified additions/removals in the same table. No removal or copy-first pause. Round 2 B and Question 2 answer. |
| Native update outside guide or newer remote snapshot | No guarantee of interception; compare observed installed metadata when possible, explain mismatch, offer historical export afterward. Never claim update was pinned to preview H. |
| Unknown target | Clarify Windows/WSL and actual installation before action. A terminal alone does not establish VS Code target. |
| VS Code-managed installation | Guide native VS Code path; do not substitute CLI update against a different installation. |
| Preview unavailable | Proceed with the requested update for non-security information gaps, briefly disclose the limitation and report verified results afterward; auth/security errors stop. No extra preview confirmation. |
| Browse or exact release request | Accepted browse-and-select flow with target/name/path/note; an exact request can narrow the displayed candidate but does not bypass selection. |
| Repeated version label | Simple numbered/lettered source choices with notes/publication context, bound to exact records. Round 1 F. |
| Existing or edited copy | Stop, location, no changes; user manages it. No replace/remove action. Round 1 E. |
| Missing Node/Git | “Historical export needs [missing tool] in [target]. No personal copy was created. Contact Andrew for setup help.” Ordinary updates remain available. |
| Missing/unverifiable source | No substitute release; no creation. State what could not be retrieved/verified. |
| Name too long or known unsupported dependency | Explain the rejected name or specific portability problem; no silent rename/truncation or script rewriting. |
| Concurrent operation | Busy message, no second creation; do not break an uncertain lock. |
| Cancel before destination reservation | No personal files created; native update remains separate. |
| Cancel/failure with partial destination | Report exact incomplete path and that creation did not finish; no root instruction published. Refer to read-only inspect/Andrew, no automatic deletion. |
| Cancel after publication | Report that creation completed and the personal copy remains. Do not claim cancellation undid it. |
| Reporting crash after publication | Inspect outcome; report completed file creation if verified instead of retrying writes. |
| Files created, skill not discovered | Distinguish successful export from client discovery; preserve files and give supported fresh-session/help guidance. |
| Restore skill cannot load | Direct fixed exporter entry from trusted complete bundle/checkout; same plan/no-overwrite rules. Copyable exact commands depend on implementation paths, not invented here. |

## Native update evidence and cancellation

A readable source snapshot is not a native client version lock. The client may fetch a later head than any metadata inspected beforehand. A preview is neither required nor an approval gate. Post-action reporting must compare observed installation evidence, not claim that the native client installed a previewed snapshot. Unknown evidence stays unknown.

Likewise, cancellation during an already-running native client operation cannot be promised to roll back the main bundle. Report completion/partial/unknown outcome accurately rather than borrowing the exporter's create-only state model.

## Completion

The owner has reviewed the name, browse/selection flow, combined result table and direct-update policy. This resolves the planning question; the examples are illustrative, not test results. Carry this contract into the status, migration and deferred restore implementation issues. Preserve filesystem acceptance and client tests for later implementation. No production changes or user setup are required to resolve this issue.
