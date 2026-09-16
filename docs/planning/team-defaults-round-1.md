# Team defaults and individual overrides — Round 1

> Historical interview: the owner subsequently approved native GT updates and the separate `gt-archive` collection. [Current accepted behavior](skill-versioning-decisions.md) supersedes managed pins, selective main-bundle updates, and pending runtime questions below. Original answers remain unchanged; no new answers are requested in this round.

Related issue: [Define team defaults and individual version overrides](https://github.com/AndrewGodlewsky/andrew-skills/issues/3)

Status: Answers reviewed. See [the consolidated decisions](skill-versioning-decisions.md) for the accepted outcome. Original recommendations and answers below are preserved for context; later accepted decisions take precedence.

## How to answer

Write under each **Your answer** heading. You can write “Agree” to accept the recommendation, describe another approach, or leave a question open. Examples from your team's work are especially useful.

We will review your answers together in the next round, resolve any conflicts, and turn the agreed behavior into a small glossary and scenario table. This round focuses on what teammates should experience; storage formats, commands, and implementation choices belong to later investigations.

## What is already established

- The first version should support team-managed defaults and individual overrides.
- Users should be able to retain a skill version while the hub continues to evolve.
- Users should be able to inspect their versions and release notes, select updates, and roll back.
- The current plugin updates all bundled skills together. The mechanism for independent selection is still being investigated.
- Your request to continue grilling did not answer the earlier question about update approval; that question is included below.

## Working terms

These definitions make the questions easier to read; we can revise them based on your answers.

- **Team defaults:** The skills and versions the team recommends using together.
- **Installed version:** The release currently present in a user's selected installation.
- **Individual override:** A user's choice that differs from the applicable team defaults.
- **Pin:** A persistent choice to retain a specific skill version until explicitly changed.
- **Skip:** Declining a particular offered update, without necessarily creating a persistent pin.

## 1. Where should team defaults apply?

**Question:** Should a project determine which team defaults apply, or should a person choose one set of defaults for all their work?

**Why this matters:** A person may work on several projects or with several teams. We need a predictable way to identify the relevant defaults so opening one project does not unexpectedly change the skills used elsewhere.

**Recommendation:** Let each project select one team's default set. When a project has no selection, offer the user's preferred team as an explicit fallback. This describes the desired behavior; cross-project isolation still needs technical validation.

### Your answer
I'm not sure. I'd be open to your thoughts and advice here.

What I was thinking about when I made those recommendations is that our team is going to own our entire skill set, as in the GT folder. Inside that folder, I would like each of those skills to have a version, because I want, in the future, to update these skills quite frequently. I want users with the /update skill to be able to update their skills, but I want them to be able to roll back individual versions of individual skills if they feel that was better for them to use. As in, if it's possible, which I don't know, you have to do some research, but I prefer not to force everyone to use the current version of the skill. So, in my head, how this works (and you'd have to think about this to let me know your thoughts): we would have a YAML file or something somewhere that would have:
- a list of the skills and the versions of those skills
- a quick description or notes of when we push the new version of the skill
The idea is that if users don't like the version of the skill they updated to, they can always go back to a previous version.
<!-- Write here. -->

## 2. Who maintains the team's recommendations?

**Question:** Who should be able to change the team defaults, and what review should those changes receive?

**Why this matters:** Publishing a new skill release and recommending it to the whole team are different responsibilities. Separating them would let people try a new release before the team adopts it, while keeping responsibility for shared recommendations clear.

**Recommendation:** A designated team maintainer changes the defaults through the team's normal review process. Publishing a release makes it available but does not automatically make it the team recommendation. You can fill both roles initially.

### Your answer
Ultimately, I'm not super worried about maintaining the skills because the skills are going to be the main branch of the repo. We're going to actively maintain them as a team by looking at it and updating that branch. 
<!-- Write here. -->

## 3. What exactly does a team recommendation select?

**Question:** Should the team recommend an exact version of each skill, a range of versions, or simply the latest release?

**Why this matters:** “Use the team default” needs a clear meaning. An exact version makes it easier to reproduce someone's behavior and discuss problems; a moving target reduces maintenance but can give teammates different instructions at different times.

**Recommendation:** Each revision of the team defaults identifies exact skill versions. Show newer available releases separately so a teammate can deliberately try one without changing the recommendation for everyone.

### Your answer
I don't even know if we need the recommendation skill because, by default, I want people to just update to the latest version. I just would like to give them a way to maintain an older version of a skill if they choose to do that. 
<!-- Write here. -->

## 4. When should a changed recommendation take effect?

**Question:** When the team changes a recommended version, should a teammate adopt it automatically or only after reviewing an update?

**Why this matters:** A teammate who follows defaults may still be in the middle of work when those defaults change. This choice determines whether following defaults means immediate synchronization or a preferred target for the next deliberate update.

**Recommendation:** Offer changed recommendations through the update flow, with version notes and a preview. Apply the teammate's approved selection; keep pinned skills unchanged unless the teammate explicitly changes those pins.

### Your answer
Like I was saying before, I think by default we should be pushing people to new versions of skills because we're changing them for a purpose. I just didn't want to completely prevent people from maintaining or rolling back to older versions that they liked. 
<!-- Write here. -->

## 5. Where should an individual's override apply?

**Question:** Should an override affect only the current project, every project using the same team defaults, or all of that person's projects?

**Why this matters:** Someone may prefer an older skill for one project but want the current recommendation elsewhere. An override with a broader scope than expected can be confusing and can make otherwise unrelated projects influence one another.

**Recommendation:** Make overrides personal and specific to the current project initially. Make that scope visible when creating an override. Consider an explicit broader preference later if repeating the same choice becomes burdensome.

### Your answer
Yes, ultimately, at the end of the day, these skills are being housed in the marketplace. If a user chooses to have an older version of a skill, that would affect any time they want to go use that skill in any project. 
<!-- Write here. -->

## 6. How should skipping an update differ from pinning?

**Question:** Should declining an offered update merely skip that update, or should it permanently retain the current version?

**Why this matters:** “Not now” and “keep this version” express different intentions. If we treat them identically, users may either get repeated offers they thought they had dismissed permanently or stop receiving recommendations without realizing it.

**Recommendation:** Offer separate actions: skip for now, or pin the current version. A skip leaves the skill eligible for future update offers. A pin survives later team-default changes and “update all” until explicitly changed or removed.

### Your answer
I don't know. I would be interested in either way. I'm not sure how easy this is going to be to actually implement, so I'd be open to different ideas or different options. Because ultimately, it would be nice to be able to show the user, when they do the /update skills, that they're not currently up to date with everything (so they can easily understand and implement that). I'm open to ideas because I'm not sure how to do this in a way that will make sense and be robust enough to work at scale for my team. 
<!-- Write here. -->

## 7. What should returning to team defaults do?

**Question:** When someone removes an override, should the skill immediately move to the team's currently recommended version?

**Why this matters:** The team recommendation could be older than the user's experimental version, or newer than a long-held pin. Returning to defaults can therefore involve either an upgrade or a downgrade, and users need to understand what will happen.

**Recommendation:** Preview the move to the current team recommendation and its notes, then apply it on approval. Remove the override only after the move succeeds. If the recommendation is unavailable, preserve the existing selection and explain the problem.

### Your answer
I assume it would just update to the latest version. I don't want this to be super, super complicated. I just wanted to provide it a little extra functionality. 
<!-- Write here. -->

## 8. How should changes to the team's skill list affect users?

**Question:** What should happen when a user first adopts a default set, when the team adds a skill, and when the team stops recommending a skill?

**Why this matters:** Team defaults describe which skills to use as well as their versions. Treating that list as mandatory synchronization could unexpectedly install or remove skills, especially when a person has made their own selections.

**Recommendation:** On first adoption, preview the recommended set and let the user accept all or a subset. Offer later additions during updates. When a skill is removed from the defaults, mark it as no longer recommended and offer removal while preserving it until the user chooses. Keep individual pins intact.

### Your answer
So ultimately, When we end up removing skills, there has to be a process so that when the user updates, the update will ask the user if it is okay to remove the list of skills. If they don't want them removed, then they should just be pinned, or maybe moved to their user level. I'm open to ideas either way, because I don't want to take the flexibility away from users, but I do want to subtly nudge people to stay with the group. 
<!-- You can answer separately for first adoption, additions, and removals. -->

## 9. What should happen when team defaults cannot be read?

**Question:** How should the system behave offline, when the team configuration is missing, or when access to it fails?

**Why this matters:** Teammates should understand whether they are using the last known recommendations or have never received any. Silently falling back to the newest releases could change behavior precisely when the intended recommendation cannot be verified.

**Recommendation:** Keep installed skills and individual choices unchanged. Show the last successfully read defaults with a stale-data notice when available. If no defaults have ever been read, ask the user to select a valid team before applying team-based updates. Do not substitute latest releases silently or bypass access controls.

### Your answer
I think this is fine. If they choose not to update, it just shouldn't do anything because it's just on their local computer, so there are no worries about this. 
<!-- Write here. -->

## 10. How should switching teams or conflicting defaults work?

**Question:** If a project changes teams, or more than one default set appears applicable, how should the user resolve that situation?

**Why this matters:** This checks whether the scope choices above remain understandable in real team work. Combining recommendations automatically could produce a set no team actually recommends, while dropping old overrides could undo deliberate user choices.

**Recommendation:** Use one explicitly selected default set per project in the first version. Ask the user to resolve competing selections. When switching sets, preview the differences, retain applicable pins, and identify overrides that no longer have a matching recommendation. Apply changes only after review.

### Your answer
That's not really our problem. This plugin and skill set is really for my team to use to get better. If a project changes teams, I wouldn't worry about any of this. This is too large a scope. 
<!-- Write here. -->

## Additional examples or concerns

Describe any situation these questions missed, especially how people on your team currently share skills, work across projects, or choose to keep older behavior.

<!-- Write here. -->
