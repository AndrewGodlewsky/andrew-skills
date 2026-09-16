# Skill version status — Round 1

Issue: [Prototype skill version status and concise release notes](https://github.com/AndrewGodlewsky/andrew-skills/issues/8), assigned to AndrewGodlewsky.

**Status: answered and reviewed.** You accepted `skills-status`, excluded all personal-copy reporting/tracking, and made latest-release information optional in favor of simplicity. Original questions and answers are preserved below; the personal-copy section is rejected. In [Round 2](skill-status-round-2.md), you accepted the minimal installed-GT-only report without online comparison. All example output is illustrative.

## What is already settled

- `skills-update` updates the whole GT plugin, including additions/removals, then summarizes actual changes. This status view must not update anything.
- `skills-restore` creates a separate personal historical copy through browsing and selection. It does not manage that copy afterward.
- Main skill names stay normal. Personal names include the original version, such as `grill-me-v1-2-0`; that name does not prove the user has left the content unchanged.
- Status describes installed files in a specific environment. It cannot assume which instructions an existing chat has loaded.

This round focuses on the everyday view. We will use your choices to refine exceptional cases next, without reopening the accepted update/export contracts.

## 1. Where should someone ask to see their skill versions?

**Recommendation:** Add a dedicated read-only source skill named `skills-status`, alongside `skills-update` and `skills-restore`.

| Choice | How a teammate asks | Tradeoff |
| --- | --- | --- |
| A — dedicated `skills-status` (recommended) | “Show my GT skill versions.” | A clear place to inspect versions without requesting a change; adds one small skill. |
| B — status mode inside `skills-restore` | “Show status using skills-restore.” | Fewer entry points, but mixes inspecting the current installation with creating historical copies. |
| C — documented report request | Ask the assistant to follow a documented status recipe. | No new skill, but less discoverable and less consistent across teammates. |

For A, the intended command could be `/gt:skills-status`; exact client invocation remains subject to the deferred compatibility checks. No additional alias is proposed. We would keep `skills-update`'s invocation meaning unchanged: it requests an update.

**Why this matters:** Teammates need to know how to inspect their setup confidently. A separate read-only entry point makes the distinction between looking, updating and restoring easy to explain.

**Question:** Which entry point do you prefer? If A, does `skills-status` work as the name?

### Your answer
Yeah, I think that's fine. I think we can add a skill status. 
<!-- Write your answer here. -->

## 2. Does this everyday report show the right information?

**Recommendation:** Show two compact sections: all installed GT skills, followed by recognizable GT personal copies. Do not list unrelated skills or scan every Windows/WSL installation automatically. Use the established target, or clarify it if uncertain.

### Proposed report

> **Skill versions — Windows, CLI-managed GT**
>
> Latest team releases checked just now.
>
> **GT collection**
>
> | Skill | Installed | Latest team release | Installed release note |
> | --- | --- | --- | --- |
> | `grill-me` | 1.2.0 | 1.3.0 | Added an optional summary at the end. |
> | `skills-update` | 1.0.1 | 1.0.1 | Clarified update-failure messages. |
> | `skills-restore` | 1.0.0 | 1.0.0 | Added personal export of historical skills. |
> | `skills-status` | 1.0.0 | 1.0.0 | Added the skill-version overview. |
>
> `grill-me` has a newer team release. Use `skills-update` when you want to update the whole GT collection.
>
> **Personal copies**
>
> | Personal skill | Recorded origin | Original release note |
> | --- | --- | --- |
> | `grill-me-v1-1-0` | `grill-me` 1.1.0 | Simplified the initial interview. |
>
> Personal-copy details come from its export receipt; its contents may have been edited. Personal copies do not receive GT updates.
>
> These are files installed in this environment, not proof of instructions already loaded in a chat. Nothing was changed.

**Notes in this view:** The default note explains the installed release. Asking “What changed in the newer grill-me release?” would show available newer notes separately. Paths, exact source records and longer history stay in an on-request detail view. If there are no personal copies in the inspected locations, use one short sentence instead of an empty table.

The plugin's own version may appear in installation details, but is not a substitute for the per-skill versions. Do not present a personal copy as needing an update or label it “current”: its version describes where it came from, not the current state of user-edited content.

**Why this matters:** One table of mixed “versions” could make a personal copy look like another managed GT release. Separate sections and explicit origin wording let teammates see what is installed without implying the team still manages their personal files. Showing the installed release note answers what they currently have; newer notes remain easy to request.

**Question:** Would you use this layout, or change the columns, default notes, or amount of personal-copy information shown?

### Your answer
Yeah, I think this shows the right information. However, there should be nothing shown on personal copies. If someone makes a personal copy that's copied onto their user level, we are no longer tracking any of that, and we shouldn't be tracking any of that. We should only be tracking the actual hub and the skills that the user has as part of the GT folder. 
<!-- Write your answer here. -->

## 3. Should status check the latest team releases each time it is requested?

**Recommendation — A:** Read installed information and attempt a read-only check of the release catalog when the user requests status. Show when the latest-release information was checked. This never refreshes or updates the installed plugin and does not run in the background.

**Alternative — B:** Show local installed information first and check the latest team releases only when explicitly requested. The default latest column would say “Not checked,” or clearly identify previously retrieved information as stale.

### Example when a fresh catalog lookup is unavailable

> Installed versions are available. Latest team releases could not be checked.
>
> | Skill | Installed | Latest team release | Installed release note |
> | --- | --- | --- | --- |
> | `grill-me` | 1.2.0 | Unknown | Added an optional summary at the end. |

If an earlier catalog snapshot is available, identify its check time and label it “Last known,” without claiming it is current. “Unknown” does not mean no update exists. Missing local notes can say “Release note unavailable.” This is a proposed fallback for ordinary information gaps, not a bypass for authentication, permission or security-policy errors; those stop the blocked action and hand control back.

**Why this matters:** An on-demand check answers whether the team has published anything newer, but depends on catalog availability. A local-first report is simpler offline, though teammates must explicitly request the comparison. Either choice keeps status read-only and makes freshness visible.

**Question:** Do you prefer A, checking latest releases on each status request, or B, checking only when explicitly requested?

### Your answer
Yeah, I think this is fine. If the skill status wants to show what skills are now available if the user chose to update, that's fine, but if that's too much work, we don't have to do that either. We don't need to make this more complicated than it has to be. I want to make sure that we keep this as simple as possible, so if the skill status is going to add too much trouble or hassle, we can just not include it. 
<!-- Write your answer here. -->

## After this round

Your answers remove personal-copy and receipt scenarios from this status feature. [Round 2](skill-status-round-2.md) resolves the simplified report: the first version omits latest-release lookup. See the [final status handoff](skill-status-prototype-notes.md).

No implementation or live client setup was needed for this review. The [scenario notes](skill-status-prototype-notes.md) now record the accepted design. Both review rounds are complete.
