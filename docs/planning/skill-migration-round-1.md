# Migration and acceptance — Round 1

Issue: [Define migration and acceptance checks for the existing skills hub](https://github.com/AndrewGodlewsky/andrew-skills/issues/9), assigned to AndrewGodlewsky.

**Status: answered and accepted.** You chose a complete rollout after development stages and an owner pilot, and clarified that native updates should replace edits inside managed GT files without a preservation system. Original answers are retained. See the [final migration handoff](skill-migration-acceptance-notes.md). No client tests are requested now.

## What migration means here

Existing teammates keep the GT plugin and their normal installation/update path. The repository currently declares plugin version `0.1.3`; its two current skills do not yet have independent release metadata. The planned change adds per-skill versions and notes, the update result table, `skills-status`, and optional historical export through `skills-restore`.

Already settled:

- Native updates apply the entire bundle, including additions/removals, without removal approval. Personal files remain outside those updates.
- The first published snapshot with complete skill metadata establishes the `1.0.0` baseline for its skills. Earlier unversioned snapshots are not automatically backfilled into releases.
- `skills-status` reads installed GT skills only, with three columns and no remote comparison or personal inventory.
- Historical export alone adds the accepted Node/Git prerequisites; it does not install tools automatically. Existing native-client prerequisites still apply.
- You control publishing and repository settings. Live client testing stays deferred; this round does not reverse that decision.

## 1. Should teammates receive the complete feature set together?

**Recommendation — A:** Build in manageable implementation steps, but announce the enhancement to the team once versions/notes, update reporting, status and historical export are ready together. Teammates take a normal whole-plugin update, then start a fresh chat. New users use the existing native install path. There is no separate migration command or archive registration.

**Alternative — B:** Roll out versions/notes, update reporting and status first, then ship restoration later. The initial release would clearly say that historical export is not yet available; any guidance that mentions `skills-restore` must wait until that skill is actually delivered. Source history would still begin at the metadata baseline.

Either approach keeps restore implementation deferred until implementation work begins. Neither promises access to releases from before the metadata baseline. Updating a metadata-free installation may leave the previous skill version unknown in the first result report; a new updater cannot reconstruct evidence the old updater did not capture.

**Why this matters:** Shipping together gives users the full path from trying an update to restoring older behavior. Staging delivers visibility sooner but creates a period where versions exist without a restore entry point. This is about what teammates receive, not requiring all development to happen in one change.

**Question:** Do you prefer A, one complete team rollout, or B, visibility first and restoration later?

### Your answer
Yeah, I think we should go with one complete rollout. 
<!-- Write your answer here. -->

## 2. How should we handle someone who customized the old installation?

**Recommendation:** Keep the standard migration simple. Do not build a scanner, automatic importer, renamer or backup service for old customizations. Include a short onboarding note: edits inside the managed GT installation can be replaced by native updates; move custom work out yourself before updating if you want to keep it, with your help available when needed.

Concrete cases:

| Existing setup | Proposed handling |
| --- | --- |
| Ordinary installed GT | Normal native update; no separate migration operation. |
| Personal or project-level skills, including duplicate names | Leave them alone. Do not enroll them in GT or show them in `skills-status`. Explain possible invocation ambiguity only when relevant. |
| Locally edited GT files | User/Andrew handles preservation before an update if requested. No automatic promise that native updates preserve managed edits. |
| GT registered from a local checkout | Follow that installation's source workflow; do not pull, reset, replace it or silently switch it to a remote install. |
| Old skill with no version metadata | Do not guess a version or label a custom copy as a verified historical release. |

This does not add a mandatory inspection or confirmation to every `skills-update`. If someone explicitly requests a custom-content handoff, preserve the complete instructions and resources before any separately authorized deletion. A personal copy is outside GT management afterward.

**Why this matters:** Automatic adoption would make us responsible for identifying and moving arbitrary user edits, despite the decision to stop managing personal files. A documented standard path plus case-by-case help keeps existing users supported without building a second migration system.

**Question:** Is this documentation-and-manual-help approach enough for older custom setups, or is there a specific existing setup we must handle automatically?

### Your answer
Yeah, we need to keep this simple. No user should be editing any skills inside the plugin. If they do, we just want to overwrite them with the newest version of the skills from the plugin. I think your understanding is correct. Let's keep this simple. Don't overcomplicate this at all. 
<!-- Write your answer here. -->

## 3. When should the deferred client checks happen relative to wider team use?

**Recommendation — A:** Keep this planning issue independent of live tests. During later implementation, have the implementer run automated publication/export/status checks. Then use a small pilot with you to exercise actual CLI/VS Code behavior before recommending the complete enhancement to the wider team. The [draft acceptance matrix](skill-migration-acceptance-notes.md) records expected results and proposes who collects the evidence.

The pilot would cover the environments you intend to support: native installation/update, main and personal skill invocation with resources, and the effect of starting a fresh chat. Windows/WSL filesystem checks for export remain implementation coverage. We would record the exact client versions and outcomes when those checks are eventually run.

**Alternative — B:** You decide when to share it, with unresolved client behavior explicitly listed in the handoff. Live checks can happen later, as you previously requested; untested behavior is never described as verified. This does not turn failed automated file-integrity or no-overwrite checks into passes.

**Why this matters:** We already have partial research, including failures under older experiments, but that does not establish the new personal-name design across every supported client. Choosing the timing now prevents a future implementer from either treating unknowns as proven or unexpectedly demanding setup to finish this planning issue.

**Question:** Do you prefer A, a small pilot before wider team rollout, or B, owner-directed rollout with the remaining client checks explicitly deferred? No tests or setup are requested now.

### Your answer
I think A is fine. Ultimately, I'm going to keep tweaking this repository and plugin until it's completely ready, and then I'm going to have my team adopt it. Everything should be complete before we really get to adoption, even if we go through a couple of stages. I think it's fine if you want to create some future issues just to make sure we don't forget about things, so I'm not really worried about this. 
<!-- Write your answer here. -->

## What follows

Your answers settle migration and acceptance timing. The handoff retains the complete feature set before team adoption, allows implementation stages, and assigns automated checks to the implementer and the client pilot/repository setup to Andrew with support. Future implementation and pilot issues record the remaining execution work; publishing remains yours to authorize.

[Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md) requires that “A HITL ticket only resolves through that live exchange.” Your answers now resolve all three choices; earlier recommendations yield to your explicit managed-file overwrite policy.
