# Update and restore interaction — Round 1

Issue: [Prototype native GT updates and personal skill restoration](https://github.com/AndrewGodlewsky/andrew-skills/issues/7), assigned to AndrewGodlewsky.

**Status: answered and reviewed.** Your original answers are preserved. `skills-restore` and browsing/selecting a release are accepted. You requested a table after the whole-plugin update showing skill, previous version, installed version and a short change note. [Round 2](skill-interaction-round-2.md) settles the expanded report and direct-update policy: apply additions/removals without a removal pause, then summarize. Earlier preview and exact-request shortcut recommendations below are not accepted behavior. See the [final interaction handoff](skill-interaction-prototype-notes.md). All example results are illustrative; no actual update or export ran.

## What we are deciding

The [personal export contract](skill-personal-export-contract.md) already settles the mechanics: stable main-plugin skill names, version-suffixed personal copies, Node/Git for export only, create-only writes, and user ownership afterward.

This round asks how those actions should feel in conversation. It does not reopen archive plugins, pins, replacement, runtime choices or automatic updates. Proposed command spellings below are interaction examples; actual CLI/VS Code routing still needs the deferred compatibility checks.

## 1. Should the new skill be called skills-restore?

**Recommendation:** Name its source folder/frontmatter `skills-restore`, matching the existing `skills-update` naming pattern. Its opening explanation should be: “Create a personal copy of an older skill release.”

That gives a proposed pair:

- `/gt:skills-update` — update the whole team plugin.
- `/gt:skills-restore` — create one historical personal copy.

A completed personal export might be invoked as `/grill-me-v1-2-0`. Only that personal name includes a version. We would not introduce `/restore` as an extra alias or rename existing plugin skills.

**Why this matters:** “Restore” fits the language we have been using, but it can sound like replacing the main plugin. The description needs to clarify that it creates a separate personal copy. Matching the update skill helps teammates recognize the two related actions.

**Question:** Do you want `skills-restore`, or would you prefer `skills-export` or another name that makes the personal-copy behavior clearer?

### Your answer
Yeah, I think that's fine. We can call it skill restore. 
<!-- Write your answer here. -->

## 2. Should ordinary updates proceed after a short preview, pausing only when a choice is needed?

**Recommendation:** Invoking the update skill requests the whole-plugin update. Show changed skills and one short note each, then proceed without another routine “Are you sure?” question. Pause if the preview includes removals or cannot establish what will change. Client tool approvals still apply.

### Prototype A — ordinary update

> **User:** Update my GT skills.
>
> **Assistant:** Target: Windows, CLI-managed GT.
>
> `grill-me`: 1.2.0 → 1.3.0 — Adds an optional budget question.
>
> Updating the whole GT plugin. Your personal copies will not be changed.
>
> **After a successful operation and verified installed metadata:**
>
> GT updated. `grill-me` is now 1.3.0; `skills-update` remains 1.0.0. Start a fresh chat to load the updated instructions.

**State after:** Main bundle updated; personal files unchanged. Do not enumerate or offer upgrades for personal copies during each update. If the client does not expose enough evidence to verify installed versions, report the command result without inventing them.

### Prototype B — the update removes a skill

> **Assistant:** This GT update removes `meeting-notes` from the team plugin.
>
> Choose: **Update now**, **Create a personal copy first**, or **Cancel**.
>
> A personal copy is yours to maintain; it will not receive team updates.

If the user chooses a copy, run the separate export flow. After successful creation, continue the requested whole-plugin update. If export fails, pause and explain; do not remove the main copy through this guided operation unless the user then chooses to update anyway. For several removals, group them into one choice rather than interrupting separately for every skill.

**State after cancel:** No plugin update. If a personal export already finished before a later cancellation, it remains; cancellation does not silently delete it.

### Prototype C — preview unavailable

> **Assistant:** I cannot read the release preview, so I cannot tell which skills this update changes or removes.
>
> Choose: **Continue with the native whole-plugin update** or **Cancel**.
>
> Existing personal copies will not be changed.

This is only for a non-security information gap. Authentication, permission and security-policy errors stop and hand control back; “continue anyway” is never a bypass for those blocks.

**Why this matters:** Most updates should be quick. Removals deserve an opportunity to preserve useful behavior, and an incomplete preview should not be presented as “nothing changed.” Native updates are not an atomic preview/apply system: the remote bundle can advance after the preview. The final result must describe actual observed changes and any mismatch; the design cannot promise to intercept every removal, especially when users update through the client directly. Preserved Git history still supports export afterward.

The preview must not add an exporter Node/Git requirement to normal updates. Use available native metadata and accessible release information; fall back to the unavailable-preview flow if necessary. For VS Code-managed installations, guide the supported native update path and do not silently operate on a separate CLI installation.

**Question:** Does this pause policy work: proceed for ordinary updates, pause for removals or an unavailable preview, and group multiple removals into one decision?

### Your answer
Can we prototype this a little bit more? What I want to have happen on skill update is that it should go update all of the skills in the repository. For any skills that were actually updated, I think I want to see them in a table so you can see:
- the skill name
- the version it was
- the version it was updated to
- that quick, short line of the description of what was actually changed
<!-- Write your answer here. -->

## 3. Should choosing a fully described release be enough to create the copy?

**Recommendation:** Show the target, destination, version and note before selection. Treat selecting that clearly described option as the request to create it; do not immediately ask for the same confirmation again. If the initial request already identifies one exact release and a clear target, show the same summary and proceed.

Ambiguous release labels or environments still need a choice. Existing personal files always stop creation; the choice never authorizes overwriting.

### Prototype D — browse and select

> **User:** I preferred an older version of `grill-me`. Create a personal copy.
>
> **Assistant:** Target: Windows personal skills. The copy will be separate from GT and yours to edit.
>
> | Choice | Source version | Note | Personal name |
> | --- | --- | --- | --- |
> | A | 1.2.0 | Added an optional summary at the end. | `grill-me-v1-2-0` |
> | B | 1.1.0 | Simplified the initial interview. | `grill-me-v1-1-0` |
>
> Destination: `C:\Users\Teammate\.copilot\skills\<personal-name>\`.
>
> Choose A, B, more releases, or cancel. Choosing a release creates it if the destination is clear.
>
> **User:** A.
>
> **Assistant, after verified creation:** Created `grill-me-v1-2-0` in your personal skills folder. The GT copy was not changed.
>
> Intended personal command: `/grill-me-v1-2-0`. Start a fresh chat to discover it. You can edit or remove this copy yourself; GT will not manage it.

**State after:** One created personal copy and source receipt. Main unchanged. “Created” reports files, not proof that a client has loaded them.

### Prototype E — an earlier copy exists

> **Assistant:** A personal copy of `grill-me` already exists at `C:\Users\Teammate\.copilot\skills\grill-me-v1-1-0\`.
>
> Nothing was changed. Move it outside skill-discovery locations or remove it yourself before requesting another version.

There is no replace button, automatic backup or deletion offer.

### Prototype F — the same version label appears twice

> **Assistant:** Two different published releases are labeled `grill-me` 1.0.0:
>
> **A — Initial release:** the original interview.
>
> **B — Reintroduced release:** the later rewritten interview.
>
> Choose which source you want, or ask for source details.

The selector binds A/B to exact catalog commit/path records. Show publication date and notes where available; do not require the user to paste a commit ID. Both would propose the same personal name, so any existing destination still blocks creation.

**Why this matters:** Release selection should be a meaningful decision rather than a series of repetitive confirmations. It must also be clear that the selected copy becomes personal and that another version cannot silently replace it.

**Question:** Should selecting the fully described release trigger creation, including proceeding from an already exact request, or do you want a separate final “Create this copy?” confirmation every time?

### Your answer
I think I really like option D here, where the user can browse and select once they want to restore an older version of the skill. Let's go with that. 
<!-- Write your answer here. -->

## What happens next

I will use your answers to refine these transcripts and the [scenario checklist](skill-interaction-prototype-notes.md). The next review will focus only on remaining interaction gaps. Standalone version-status design belongs to its own issue; creating the restore skill is still deferred.

[Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md) requires that “A HITL ticket only resolves through that live exchange.” These transcripts use the [Prototype skill](C:/Users/godle/.agents/skills/prototype/SKILL.md) as a written mock-up in your requested Markdown format. They are proposals awaiting your review, not accepted new behavior or evidence that client activation works.
