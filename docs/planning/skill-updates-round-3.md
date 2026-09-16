# Skill updates — Round 3: review the complete flow

> Historical interview: the owner subsequently approved native GT updates and the separate `gt-archive` collection. [Current accepted behavior](skill-versioning-decisions.md) supersedes managed pins, selective main-bundle updates, and pending runtime questions below. Original answers remain unchanged; no new answers are requested in this round.

Related issue: [Define latest-by-default updates and personal skill pins](https://github.com/AndrewGodlewsky/andrew-skills/issues/3)

Status: Reviewed and resolved through the subsequent conversation. See [the consolidated decisions](skill-versioning-decisions.md). Original questions and written answers are preserved below; later accepted decisions take precedence.

## What Round 2 settled

Your [Round 2 answers](skill-updates-round-2.md) establish:

- Choosing an older skill release keeps it there until the user chooses to change it.
- Every update run should remind users about retained active skills that have newer versions and conveniently offer to update them.
- Users can update some retained skills and leave others alone. Declining these offers must still allow everything else to update.
- Fresh installations should include all active skills.
- For a skill the team removes, you are open to preserving a personal copy outside the plugin. The exact handoff and ongoing ownership have not been settled.

A pin therefore means **keep this version unless I choose otherwise**, not **stop offering updates**. Latest remains the default target, and personal selections apply across projects in that installation.

## 1. Does this update flow match what you want?

**Why this matters:** Your answers make the desired treatment of pinned skills clear. The remaining detail is how much prompting a normal update needs. This example combines the settled behavior into one flow so we can agree on it without designing individual screens or commands yet.

**Recommendation:** Invoking the update skill requests updates for ordinary skills. Show a brief summary with installed/latest versions and short notes. If any active skills are held at older versions, ask one grouped question: “Also update any of these kept versions?” Let the user select some, select all, or keep them all. Keeping them all proceeds with the other updates; an explicit cancel stops the operation. Do not add another general confirmation after those choices. Ask separately about any proposed removals before changing files. Do not introduce background updates.

The user can explicitly request only particular skills instead of the normal full update. New active skills are included in the normal full update; a deliberately limited update affects only its selected skills.

### Example outcomes

| Situation | Proposed behavior |
| --- | --- |
| Nothing is pinned and nothing is being removed | Show the summary, update active skills to latest, and include newly added skills. |
| Two active skills are pinned behind latest | Offer both in one question. Update only the pinned skills the user selects, plus the ordinary skills. |
| The user chooses “keep both” | Leave both pinned skills unchanged and update everything else. Ask about them again on the next update run if newer versions remain available. |
| A pinned skill is selected for update | Update it to latest and clear its pin only after success. A failed update must not lose the retained selection. |
| All active skills are pinned | Offer their newer versions together. If the user keeps all of them, make no version changes. |
| A pinned skill is already at latest | Show it as kept and current; do not offer a nonexistent newer release. |
| The user explicitly cancels | Make no installation changes. |
| The catalog cannot be read | Preserve the installation, explain that availability could not be checked, and avoid claiming everything is current. |

“Keep pinned versions” and “cancel the update” are distinct choices. The first still updates other skills; the second changes nothing.

**Question:** Does this flow and scenario table match your intent, including proceeding without an extra general confirmation?

### Your answer
I think the idea behind having pinned skills is that you would only pin a skill when you want to keep it on that version. By default, skills should not be pinned, and the encouragement to the user should be to always be on the latest, so not using a pinned version of a skill.

I just wanted to have that idea. Maybe this is the wrong direction. Maybe the idea of allowing users to not be on the latest version is wrong overall. I don't know. I'm open to this. I'm just trying to figure out ways so that my team can change skills quickly without negatively affecting others on the team permanently. The theoretical idea behind a pin skill is that we could be moving quickly when changing skills, and hopefully it wouldn't affect users too much, because if that was really a problem for them, they could roll back to an older version of the skill. But I'm open to ideas about this because maybe this entire design is an incorrect approach, and maybe this is not recommended for a hub full of skills. And maybe instead of having the skill be pinned inside the users' hub, it should just be moved to their user level. I don't know. I'm open to ideas on this. 
<!-- Write Agree or describe the changes you want. -->

## 2. Should a retained removed skill become a personal copy?

**Why this matters:** You want users to keep a removed skill without forcing the plugin to carry it forever. A personal copy could provide that flexibility, but users need to know that it has left the team's update stream. Preserving only SKILL.md would also be insufficient for a skill with scripts or templates.

**Recommendation:** For each skill being removed, offer “remove it” or “keep a personal copy.” The second option preserves the complete skill and its version/notes before the plugin copy is removed. Explain that this personal copy is now the user's responsibility and will not receive automatic updates from the collection. Include its location and how to remove it in the result; do not repeat the removal question on future update runs.

Do not overwrite an existing personal skill with the same name. If the copy cannot be preserved and verified, leave the existing skill intact and report why that removal could not proceed. If the team later reintroduces that skill, report the name collision and let the user choose rather than silently replace their copy.

This would be a deliberate handoff, not a new system for continuously managing retired versions. Active skills kept at older versions still use the pin behavior above. Exact client locations, invocation names, and whether a plugin update can safely perform this handoff must be verified by the architecture and compatibility investigations. This questionnaire does not establish technical support.

**Question:** Is that handoff acceptable, including the personal copy leaving the normal collection update flow?

### Your answer
Yeah, I definitely want to remove skills. When we remove a skill from the general repo, we should be telling the users that we are going to remove these skills. We should give them the option to add those skills to their user level. The idea is that we will remove the skills from the repo but add them to their user level. If they still want to use them in the future, they can, but they're no longer supported at the team level. 
<!-- Write Agree or describe the changes you want. -->

## What happens after your review

If you accept this behavior, these scenarios and the earlier decisions will resolve the current behavior issue. The remaining distribution, publishing, compatibility, and interaction tickets will work within that contract. No implementation or Git publishing is part of this review.
