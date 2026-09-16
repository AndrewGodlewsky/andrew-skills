# GT archive lifecycle — Round 1

Issue: [Define historical skill export and GT archive lifecycle](https://github.com/AndrewGodlewsky/andrew-skills/issues/6), assigned to AndrewGodlewsky.

**Status: answered and reviewed.** Your answers are preserved. One copy per skill and free personal editing with no import into the team repository are settled. You proposed personal skill folders instead of the separate archive plugin; [Round 2](skill-archive-round-2.md) explains that pivot's invocation tradeoff and a simpler handoff model. Plugin registration and edited-file replacement recommendations below are not accepted decisions.

## What stays settled

- Native `gt` installs and updates the whole team collection.
- The restore skill calls fixed exporter code to copy one complete historical skill into a separate local `gt-archive` plugin.
- Users explicitly choose the archive command. Intended examples are `/gt:grill-me` and `/gt-archive:grill-me`; complete cross-client activation remains a deferred check.
- Archive copies are user-owned, outside normal team updates/support, and change only through an explicit user action.
- Windows and each WSL environment have separate installations. There is no automatic synchronization or per-project version policy.
- Returning skills restart at `1.0.0`. Repeated labels remain distinguishable by their exact source records; existing archives require no migration.
- The dedicated restore skill is already tracked as deferred implementation. This issue designs the exporter and archive lifecycle.

## 1. Is one archived copy per skill name enough?

**Recommendation:** Allow one copy of each skill name in GT archive. A user could keep archived `grill-me` and `skills-update` together, but only one archived `grill-me` at a time. Restoring a different release of that name offers to replace the existing archived copy after showing what will change. Cancel leaves it alone; choosing the same exact unmodified release is a no-op.

For example, a teammate keeps `grill-me` `1.2.0` in the archive while main has `2.0.0`. If they later choose `1.1.0`, they replace the archive copy explicitly. They still invoke the same archive entry point.

**Why this matters:** This gives each skill one predictable archive command. Keeping several releases side by side would need distinct names or another selection mechanism, plus rules for keeping those names consistent with the skill's own instructions. That may be worthwhile for comparing versions, but it adds user-facing behavior beyond retaining a preferred copy.

This limit applies to the usable archive, not the historical catalog. Both earlier and returning releases remain selectable, including releases that happen to share the same version number.

**Question:** Is one archived copy per skill name enough for the first version, or must users be able to keep several releases of the same skill available side by side?

### Your answer
Yeah, we definitely only want to have one archive copy per skill. Honestly, the more I've been thinking about this, maybe we don't have a separate archive folder. Maybe when they want to pull an old version of the skill, it just installs it at their user level. That might just simplify everything. What do you think about that? Should we pivot? 
<!-- Write your answer here. -->

## 2. What should happen when a user has edited an archived copy?

**Recommendation:** Let users edit their own archive files. Status calls an altered copy “modified” and keeps its original source reference; it no longer claims that the current files exactly match that source.

If a later restore or removal would affect those edits, stop and explain what was detected. Offer to cancel or let the user preserve their work manually before retrying. Do not merge their changes with a historical release or create an automatic backup/history system in the first version. Once they have preserved what they need, an explicit replace/remove choice can proceed. Missing or untrusted provenance receives the same cautious treatment; unrelated personal files are never treated as exporter-owned content.

**Why this matters:** GitHub can provide the original release, but it cannot recover changes a teammate made only on their machine. A plain “replace version” operation could destroy their work. This recommendation protects edits while keeping recovery simple; the tradeoff is a manual preservation step for this less common case.

**Question:** Is stopping for manual preservation sufficient, or should the exporter provide a built-in “back up my edited copy, then replace/remove it” option?

### Your answer
Nothing should happen. That user should be able to do whatever they want with that skill because we're never pulling that skill back into the repo. 
<!-- Write your answer here. -->

## 3. Should the first restore set up the archive only for the client being used?

**Recommendation:** Make first-time archive setup part of the first requested restore. Show the target environment, client and proposed archive location. Register the archive only for the chosen client, using its supported mechanism. If the teammate also wants to use that same environment's archive in the other client, make that a separate explicit setup action.

For example, a restore requested through a Windows CLI targets the Windows archive and CLI registration. It does not silently edit VS Code settings or a WSL installation. If the target is unclear, clarify it before writing. Within one environment, we can design both clients to refer to the same archive files when explicitly configured; this remains subject to the deferred client checks.

**Why this matters:** Copying the files and making them available in a client are separate steps. A teammate should not have to understand that distinction before trying their first restore, but an operation in one client should have a clear limit on which other settings it changes. Registration failure must be reported separately from a successful file export.

This recommendation adds no background setup or new prerequisite to ordinary GT installation/update. Exact paths, commands and exporter runtime are technical work for this issue after these behavior choices.

**Question:** Should first restore set up only the chosen client, or should it offer one combined setup for both CLI and VS Code in that environment?

### Your answer
I don't know. Let me know your thoughts on this. Now that I've been thinking about it, I do wonder if we could just simplify this: those skills, instead of being put in an archived folder, would just be put at the user level for that user, and they can use them as they please. 
<!-- Write your answer here. -->

## What comes next

Your answers will determine copy naming, ownership and first-use behavior. I will then develop the concrete storage/provenance format, fixed exporter runtime/delivery options, registration and failure-recovery sequence. Any meaningful remaining setup tradeoff will be explained in a later Markdown round; Node is not assumed to be approved.

The [working notes](skill-archive-notes.md) distinguish existing evidence, settled inputs and open design work. Exact restore-skill naming and conversational wording belong to the later interaction prototype.

[Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md) requires that “A HITL ticket only resolves through that live exchange.” This issue stays open for your answers; the recommendations above are not accepted decisions yet.
