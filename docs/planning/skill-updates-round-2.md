# Latest skill versions and personal pins — Round 2

> Historical interview: the owner subsequently approved native GT updates and the separate `gt-archive` collection. [Current accepted behavior](skill-versioning-decisions.md) supersedes managed pins, selective main-bundle updates, and pending runtime questions below. Original answers remain unchanged; no new answers are requested in this round.

Related issue: [Define latest-by-default updates and personal skill pins](https://github.com/AndrewGodlewsky/andrew-skills/issues/3)

Status: Answers reviewed. See [the consolidated decisions](skill-versioning-decisions.md) for the accepted outcome. Original proposals and Andrew's answers are preserved below; later accepted decisions take precedence.

## What your first round clarified

My first round introduced more team-policy machinery than you need. Your answers describe one team-maintained collection with a straightforward default: update to the latest releases, while letting each person retain or restore older skill versions.

These decisions come from your [Round 1 answers](team-defaults-round-1.md):

| Decision | Source |
| --- | --- |
| The team maintains the collection through the repository's main branch. There is no separate recommendation or approval layer for selecting a team version. | Answers 2–4 |
| Latest is the normal update target; an older release remains an individual choice. Returning from that choice targets latest. | Answers 3, 4, and 7 |
| A person's chosen version applies across projects in their installation. Project-specific settings and switching between teams are outside this effort. | Answers 5 and 10 |
| Users need a catalog of versions and short notes, plus a way to see which installed skills are behind latest. | Answers 1 and 6 |
| Removing skills requires asking the user. Users must be able to keep skills the team removes. | Answer 8 |
| Declining an update leaves the local installation alone. Unavailable catalog information should not silently replace installed content. | Answer 9 |
| Keep the workflow simple. Pinning versus skipping, and the mechanism for preserving a removed skill, were left open for advice. | Answers 6–8 |

“Latest” here means the latest published release, not unpublished working changes. Release numbering, the publication trigger, and whether the catalog uses YAML are still questions for the publishing and architecture tickets. Cross-device synchronization is not implied by using the same version across projects.

## My recommended approach

Give each skill just two update modes: **follow latest** or **keep this version**. Running the update skill shows what is installed, what is available, short notes, and anything deliberately held back. Choosing an earlier release can put that skill into “keep this version”; choosing “update to latest” can return it to normal updates.

Keep retained skills under the same management interface if the clients permit it. Moving a skill into an unmanaged personal folder would make its history and update behavior harder to explain. The storage mechanism still needs the compatibility investigation; this is a recommendation about the user experience, not a claim that the current plugin already supports it.

Example status, using fictional skill names and versions:

| Skill | Installed | Latest | Status |
| --- | --- | --- | --- |
| plan-review | 1.2.0 | 1.3.0 | Update available |
| test-guide | 2.0.0 | 2.2.0 | Kept at 2.0.0 by you |
| old-checklist | 1.1.0 | — | Removed from the collection; kept by you |

## How to answer

Write under each **Your answer** heading. “Agree” accepts the recommendation; otherwise describe what you would prefer. Your earlier answers remain intact. This round addresses only the choices that are still open.

## 1. Should updating require one confirmation after the summary?

**Question:** Should running the update skill show the proposed changes and ask once before applying them, or should invoking it immediately update eligible skills?

**Why this matters:** Your preference for latest establishes the target version, but it does not settle when the user reviews changes. A single summary can make versions and notes visible without forcing people through a separate question for every skill.

**Recommendation:** Show a summary and offer “update all eligible skills” as the default, with the ability to select particular skills or cancel. Keep pinned skills unchanged unless the user explicitly chooses otherwise. Removal still needs the explicit choice discussed below. Do not add background updates as part of this enhancement.

### Your answer
I want to have some convenient way to allow users, if they have skills that are pinned or that are held at previous versions, to quickly ask them if they want to update any of those. If they do, that's great: update them, and if not, just update everything else. 
<!-- Write here. -->

## 2. Should choosing an older version automatically keep it there?

**Question:** When a user rolls back or selects an older release, should that skill stay at that release until they explicitly choose “update to latest” or another version?

**Why this matters:** A rollback would be frustrating if the next ordinary update immediately undid it. Automatically retaining a deliberately selected older release avoids requiring the user to understand a second pinning step.

**Recommendation:** Yes. Selecting an older release automatically means “keep this version.” Ordinary updates show the newer version is available but leave that skill alone. Skipping an update once does not create a persistent setting; the next update can offer it again. “Update to latest” clears the pin only after a successful update.

### Your answer
I'm thinking it should keep it there, but every time you go to update skills, it should remind the user to tell them, "Hey, this is an old version of the skill. Do you want to update?" 
<!-- Write here. -->

## 3. Should new skills join the collection by default?

**Question:** Should a fresh installation include all active skills, and should later additions be included in the normal proposed update?

**Why this matters:** The current collection installs as a whole. Keeping that expectation makes it easy for teammates to receive newly published workflows without discovering and installing each one separately.

**Recommendation:** Include all active skills in a fresh installation. List newly added skills in the next update summary and include them by default when the user approves the normal update. A user selecting only particular changes can leave an addition out for that run. Do not introduce a persistent per-skill subscription system in this version.

### Your answer
Yeah, we should be including all fresh installations and active skills. 
<!-- Write here. -->

## 4. How should a kept, removed skill appear afterward?

**Question:** After a user declines removal of a skill, should it remain visible and managed as “removed from the collection; kept by you,” without asking to remove it again on every update?

**Why this matters:** You have already decided users must be asked before removal and must be able to keep a skill. The remaining choice is how to preserve that flexibility without repeated prompts or making the retained skill disappear from the version overview.

**Recommendation:** Show the removal list and let users remove or keep each affected skill. Keeping retains its installed version and records that choice. Continue showing it in status, with a voluntary removal action, but do not repeat the removal prompt during every update. Whether preservation uses a managed snapshot or a client-supported personal location belongs to the architecture investigation.

### Your answer
I'm not sure. I would be open to interpretation on this. If you think this is too much of a hassle, maybe what we should do instead is this: if a user wants to keep a skill, it can be installed at their user level so that it is cleanly removed from the plugin, but they can still keep it. Maybe we just give them that option. 
<!-- Write here. -->

## Anything this still makes too complicated?

If one of these choices adds more process than your team needs, say so here. The aim is a small extension to installing and updating the collection.

<!-- Write here. -->
