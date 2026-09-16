# Personal skill copies — Round 2

Issue: [Define historical skill export and GT archive lifecycle](https://github.com/AndrewGodlewsky/andrew-skills/issues/6).

**Status: answered and reviewed.** Original answers are preserved. Create-only personal export is accepted; the owner prefers appending the source version to the personal skill name rather than a same-name override. [Round 3](skill-archive-round-3.md) proposes a compatible suffix spelling and the export-only runtime. The [current direction](skill-personal-copy-direction.md) supersedes the separate archive-plugin lifecycle; exact naming/runtime remain open.

## What I took from your answers

- **One historical copy per skill is enough.** Several versions side by side are unnecessary.
- **The copy belongs to the user.** They may edit it however they want; those edits are not pulled into the team repository.
- You asked whether we should put restored skills directly in the user's personal skill location instead of maintaining a separate `gt-archive` plugin.

I think that pivot is reasonable for the ownership model you describe. We can make restoration a handoff: select an exact historical release, copy the complete skill into a personal location, record where it came from, and leave it to the user.

The previous archive was already intended to live at user level. The simplification is dropping its plugin wrapper and registration, not changing who owns it. Versioning, short notes and Git history still provide the source for restoration.

## 1. Is a personal copy allowed to take precedence over the team skill?

**Recommendation:** Use the original skill name for a personal copy and accept native same-name precedence, if retaining a preferred personal version matters more than switching between two separately named commands.

For example, restoring `grill-me` could create `~/.copilot/skills/grill-me/`, including `SKILL.md`, `release.yaml` and all bundled resources. This is an example destination in the selected environment, not a directory we have created.

Both Copilot CLI and VS Code document that personal location. This removes the need to register a second plugin. It does not restrict discovery to whichever client performed the copy; another client using the same home may also discover it. Windows and WSL remain separate targets. [CLI personal skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills), [VS Code personal skills](https://code.visualstudio.com/docs/agent-customization/agent-skills#_create-a-skill)

**The important tradeoff:** In CLI, personal skills precede plugin skills for duplicate names; project skills can precede personal skills. Our earlier experiment also found that a personal copy hid the plugin copies and the tested qualified invocations failed. We should therefore not promise that the current team skill stays independently callable while a same-named personal copy exists. Full VS Code precedence/activation testing remains deferred. [CLI precedence reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skill-locations), [prior observations](../research/skill-version-compatibility-results.md)

Native GT updates would still update the main plugin's files. They would not update the personal copy, which can remain the discovered choice. To return to team behavior, the user would move the personal copy outside skill-discovery locations or remove it, then use a fresh session; other duplicates or project skills may also need resolving.

**Why this matters:** A plain personal folder can simplify installation, but it changes the earlier promise of separate `gt` and `gt-archive` entry points. That is a behavior choice, not just moving a directory.

| Option | Main consequence |
| --- | --- |
| **Personal copy, original name — recommended for a simple handoff** | No second plugin; native precedence can hide the team version until the copy is moved/removed. |
| Personal copy with a distinct name, such as `grill-me-personal` | Aims to keep both choices visible, but needs consistent folder/frontmatter naming and review of any self-references; the installed copy is an adaptation of the source snapshot. |
| Keep the separate `gt-archive` plugin | Preserves the earlier intended two-command model, with plugin registration and deferred compatibility checks. |

**Question:** Which behavior do you want: same-name personal copies, distinctly named personal copies, or the separate archive plugin?

### Your answer
I mean, what I would think we would really want to do is just have the personal skill dash and then the version at the end. No, wouldn't that be a better solution to this problem? I'm not opposed to the archive idea, but I just worry that's going to add too much clutter. 
<!-- Write your answer here. -->

## 2. Can restoration end once the personal copy has been delivered?

**Recommendation:** Make the first version a create-only export. The restore skill chooses the exact release, the fixed exporter verifies and copies it, and the result reports its location and source. The team system then leaves it alone: no edit monitoring, synchronization, automatic backups, merging or importing changes into the repository.

Keep the original version/note and a small source record with the copy. Those describe its origin; after the user edits it, they do not prove that it still matches that release. A later read-only status request can report the recorded origin without claiming ongoing verification.

If the destination already exists, stop without modifying it, whether it contains an earlier export or an unrelated personal skill. Explain the location and let the user move/remove it themselves before requesting another export. This avoids needing to determine whether their edits are valuable or maintain a replacement/backup system. Merely choosing a different historical release never authorizes overwriting an existing personal folder.

**Why this matters:** “Do whatever you want with it” works best when the exporter has a clear stopping point. The remaining inconvenience is that choosing a different personal release later requires the user to clear the destination first. This is a proposed simplification of the previous managed replacement/removal scope, not an assumption that your answer authorized deleting files.

**Question:** Is that create-only handoff sufficient, or should the restore skill also offer explicitly requested replacement/removal of existing copies?

### Your answer
Yeah, I would think it would end once the personal copy is created and it's done, because we don't need to manage it. It's not part of our plugin, so the skill is just placed on their user level, and that's it. You move on. 
<!-- Write your answer here. -->

## What follows this round

If you choose personal copies, I will update the architecture and downstream issues to replace the archive-plugin assumption. Publishing rules and historical source records stay intact. One-copy and user-ownership decisions are already recorded; the two choices above remain open.

We still need to specify the smallest fixed export implementation, how it runs in Windows/WSL, source-record layout and partial-copy recovery. Dropping plugin registration reduces that work but does not make retrieval/verification automatic by itself. No Node prerequisite or new tool installation is presumed.

The [working notes](skill-archive-notes.md) retain the evidence and open questions. Under [Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md), “A HITL ticket only resolves through that live exchange.” Your pivot changes the previous invocation contract, so this issue remains open for your choice rather than treating the proposed change as already approved.
