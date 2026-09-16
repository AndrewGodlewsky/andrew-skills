# Update results — Round 2

Issue: [Prototype native GT updates and personal skill restoration](https://github.com/AndrewGodlewsky/andrew-skills/issues/7).

**Status: answered and reviewed.** You selected Example B's combined table and explicitly chose direct whole-plugin updates, including additions/removals, with the summary afterward. The removal-pause recommendation below is rejected. Both rounds' original questions and answers are preserved; the [interaction handoff](skill-interaction-prototype-notes.md) records the final decisions. These examples are illustrative, not real update results.

## What I took from your feedback

- Keep `skills-update` as the action that updates the **whole installed GT collection** from the repository. There is no per-skill update selection and it does not push changes to the source repository or update unrelated plugins.
- Afterward, show a table of skills that actually changed: skill name, previous version, installed version, and one short explanation.
- Name the new source skill `skills-restore`, consistent with the proposal you accepted. Neither its source name nor other plugin skill names includes a version suffix.
- Use the browse-and-select restore flow from Prototype D. The user sees release choices, notes, target and destination, then selects a release to create its personal copy. That selection is enough; no duplicate final confirmation. Existing destinations still stop creation.

The ordinary update table is the main prototype below. The second question isolates the removal behavior your answer did not select.

## 1. Does this completed-update report match what you want?

**Recommendation:** Keep the initial message short, run the native whole-plugin update, then show only verified changes. Do not require a detailed preview or list every unchanged skill.

### Example A — two skills changed

> **User:** Update my GT skills.
>
> **Assistant:** Updating all GT skills in your Windows CLI installation.
>
> **After the update and a before/after check:**
>
> GT updated. Two skills changed:
>
> | Skill | Previous version | Updated version | What changed |
> | --- | --- | --- | --- |
> | `grill-me` | 1.2.0 | 1.3.0 | Added an optional budget question. |
> | `skills-update` | 1.0.0 | 1.0.1 | Clarified update-failure messages. |
>
> Other skills and personal copies were unchanged. Start a fresh chat to load the updated instructions.

**Behind the report:** Capture available installed versions/source identity before invoking the native update, then compare with the actual installed result. The table describes what happened, not an earlier preview or what GitHub currently advertises. Read-only checks do not require the historical export runtime.

### Example B — an addition and a removal

> GT updated:
>
> | Skill | Previous version | Updated version | What changed |
> | --- | --- | --- | --- |
> | `grill-me` | 1.2.0 | 1.3.0 | Added an optional budget question. |
> | `skills-restore` | Not installed | 1.0.0 | Added personal export of historical skills. |
> | `meeting-notes` | 1.1.0 | Removed | No longer included in the team collection. |
>
> Historical releases of `meeting-notes` can be selected through `skills-restore` when their source is available. Personal copies were unchanged.

Additions and removals belong in this same change table so that “update all” has a complete visible result. Do not invent a reason for removal if the release information does not provide one.

### Example C — nothing changed

> GT is already current. No skill versions changed.

Use this wording only when the native/current-state evidence supports it. If only plugin configuration changed, report “GT updated; no skill releases changed” rather than claiming nothing happened.

### Example D — the update succeeded but the version comparison is incomplete

> The native GT update completed, but I could not verify the full per-skill change list.
>
> `grill-me` is installed at 1.3.0; its previous version was unavailable.

Show a verified installed value separately from the changed-skills table when there is no evidence that it changed. If some changes are confirmed, show those with “Confirmed changes; comparison incomplete.” Unknown is not “not installed,” and missing metadata is not proof of a removed skill.

If the native operation fails, say it failed. Any observed after-state belongs under “Changes observed after the failed update,” not “GT updated.” Do not claim rollback or an unchanged installation without evidence.

**Short-note rule:** When several releases were skipped, summarize their verified notes into one short line where available. If only the final release's note is available, explicitly label it “Latest release note”; do not imply it covers the whole jump or invent missing history. If no note is readable, say “Change note unavailable.” This information gap does not add a new Node/Git prerequisite or prevent the native update.

**Why this matters:** The four columns answer what changed on this teammate's installation. Leaving unchanged skills out keeps the result compact; additions/removals and honest unknowns keep it accurate.

**Question:** Does this table and its treatment of additions, removals, unchanged skills and missing information match your intended update experience? Note any wording or layout changes you want.

### Your answer
I really like option B here. Let's go with that. 
<!-- Write your answer here. -->

## 2. Should a known removal pause the update, or just appear in the final table?

Your answer clearly requests “update all, then show what changed.” It does not explicitly choose whether a removal should still interrupt that flow. Earlier discussions asked to offer a personal-copy route for removed skills, so I am keeping this as one explicit choice.

**Recommendation:** Proceed directly for ordinary updates, but pause once if the available information identifies skills that will be removed. Group all known removals.

### Option A — pause for known removals (recommended)

> This update removes `meeting-notes` from GT.
>
> Choose **Update now**, **Create a personal copy first**, or **Cancel**.

If the user chooses a copy, use the accepted browse-and-select `skills-restore` flow. A successful copy allows the requested update to continue. If creation fails or an existing copy blocks it, pause; do not treat that as permission to proceed with removal. The user can then choose to update anyway or cancel.

Regardless of the choice, successful updates finish with the table in Question 1. A copy already created remains if the user later cancels the update.

### Option B — update directly and report removals afterward

> GT updated:
>
> | Skill | Previous version | Updated version | What changed |
> | --- | --- | --- | --- |
> | `meeting-notes` | 1.1.0 | Removed | No longer included in the team collection. |
>
> Use `skills-restore` if you want a personal historical copy.

This keeps the routine fully direct but gives no guided chance to copy the release before removal. Historical export still works afterward when the source remains available.

**Why this matters:** The choice is interruption versus advance notice. Neither option intercepts all native updates outside this skill, and the native client might install a newer snapshot than one we inspected. We cannot guarantee a removal pause for a change we cannot observe.

**Proposed information-gap behavior for either option:** If a non-security release-preview lookup is unavailable, continue the requested native update with a brief statement that advance change details are unavailable, then report what can actually be verified afterward. Do not require a separate preview-confirmation prompt. Authentication, permission and security-policy blocks still stop immediately; this is not permission to bypass them.

**Question:** Do you prefer Option A or Option B, including the proposed direct-update behavior when advance release details are unavailable?

### Your answer
No, it shouldn't ask the user or pause when the person does the `skills update`. It should both add and remove everything so that the plugin skills are updated correctly, and it should just summarize that back to the user. At the end, when it's complete 
<!-- Write your answer here. -->

## Restore flow already accepted

The user browses releases and short notes, sees the target and proposed personal name/path, and selects one. Selection requests creation; existing copies stop it. The result states the created path, original version and intended personal command, with fresh-session guidance and personal ownership.

We are not adding the earlier proposed “exact request bypasses selection” shortcut: your answer chose browsing/selection. An exact request may narrow the choices to one displayed candidate, which the user selects through that flow. No extra question is needed to keep the accepted default.

## Next step

Your answers settle the remaining interaction choices. The consolidated [interaction handoff](skill-interaction-prototype-notes.md) carries the table/reporting rules into status, migration and the deferred `skills-restore` implementation issue. Client validation remains deferred; no actual update or restore was run.

[Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md) requires that “A HITL ticket only resolves through that live exchange.” Both rounds now contain your answers; direct updates and the post-update summary supersede the earlier pause proposals.
