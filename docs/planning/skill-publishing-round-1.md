# Automatic skill publishing — Round 1

Issue: [Define automatic skill versioning and immutable release history](https://github.com/AndrewGodlewsky/andrew-skills/issues/5), assigned to AndrewGodlewsky.

**Status: answered and reviewed.** Your original answers are preserved below. Continue in [Round 2](skill-publishing-round-2.md). You selected main-branch release cadence, three-part skill versions, user-facing change notes, and PR validation of release requirements; YAML layout and detailed enforcement remain proposals. No commits, pushes or publishing are requested by this round.

## What this issue decides

We have settled where skills live: normal `gt` updates, with optional historical copies in `gt-archive`. Now we need to decide how a change becomes a numbered release with notes and a retrievable history entry.

Today, the repository has one manually updated plugin version (`0.1.3`). Its GitHub workflow validates files but does not assign versions or publish history. The [working notes](skill-publishing-notes.md) record the current code and the technical questions I will resolve after your preferences are clear.

The principle stays fixed: changing `grill-me` must not assign a new skill version to an unchanged `skills-update`. The plugin itself still updates as one bundle.

## 1. Should each reviewed update to the main branch produce a release?

**Why this matters:** This determines what becomes part of the history users can browse or restore. Publishing every working-branch edit creates noise. Requiring a separate release action adds a step and lets several changes be grouped together.

**Recommendation:** Treat each reviewed update to `main` that changes distributed skill content as a release opportunity, after the required checks. If that update contains several commits, release the resulting content once per changed skill. Working branches are drafts. A change only to repository documentation should not create skill releases. Supporting files inside a skill count as part of that skill.

This is the desired publishing cadence, not a claim that our current workflow can already make publication and validation happen in that order. The implementation must make the published metadata and native plugin contents agree.

**Question:** Should reviewed changes reaching `main` be released automatically, or do you want a separate “publish these changes” step so you can group them?

### Your answer
Yeah, I think every push to main should be a release. That makes sense. 
<!-- Write your answer here. -->

## 2. Should skill numbers simply identify releases, or describe the size of a change?

**Why this matters:** A simple sequence is easy to automate: release 1, then 2, then 3. Numbers such as `1.2.3` can convey fixes, additions and incompatible changes, but somebody needs to classify the change. An agent cannot reliably infer its effect on every user's workflow from a text diff.

| Approach | Example | Author effort |
| --- | --- | --- |
| **Sequential skill releases** | `grill-me` version 7 becomes 8 | No change-category decision; explain the change in the notes. |
| Meaningful three-part versions | A fix becomes `1.2.4`; a new capability becomes `1.3.0`; an incompatible change becomes `2.0.0` | Author/reviewer chooses the category; code calculates the number. |

**Recommendation:** Start with sequential numbers for individual skills, beginning at 1 when each enters the new release system. Put consequential behavior changes clearly in the notes. Keep the native plugin's separate `x.y.z` version convention. An independent skill version does not need to look like its containing plugin version.

Three-part semantic versioning is a valid alternative if its meaning is useful to the team; its formal rules rely on a defined compatibility contract. A skill's instructions and required tools would need such a contract, and a number alone cannot guarantee identical model behavior. [Semantic Versioning specification](https://semver.org/)

**Question:** Do you prefer simple skill release numbers or meaningful three-part versions?

### Your answer
Yeah, I like this XYZ number version system. I think that makes a lot of sense, so let's go with that. Just make sure that this is documented in the README and in any sort of docs that we need for the future (particularly because other agents that are going to want to create skills are going to have to understand this convention that you've come up with here). 
<!-- Write your answer here. -->

## 3. Is one short reviewed note per changed skill acceptable?

**Why this matters:** Users need to understand what changed before using or archiving a release. Fully mechanical messages such as “three files changed” rarely help. Automatically generated prose can also misstate a behavior change if nobody checks it.

**Recommendation:** Require one brief note per changed skill as part of the reviewed change. An authoring agent may draft it from the work, and the maintainer reviews it with the files. The publishing code copies the approved note without another model call. Missing notes should be caught before publication, rather than replaced with a vague message.

Example: **“Grilling now asks about budget before proposing implementation options.”** A material prerequisite or behavior change should be stated explicitly. Authors should not need to maintain a large changelog by hand.

**Question:** Is this small reviewed-note requirement acceptable, or do you want release notes produced without that author/reviewer step?

### Your answer
I think, as part of the requirements for the skills, I know there's a short description of the skills, which is what's loaded into the context. I think we should also have maybe a separate YAML file that keeps track of the new versions of skills, and maybe a quick one- to two-sentence explanation about what was changed or added. I'm open to ideas on this topic. My thought process isn't completely fixed, but I definitely want to have some way to explain to users what was changed when they update skills. 
<!-- Write your answer here. -->

## 4. Can the automation prepare version files before your usual commit and push?

**Why this matters:** “Automatic versioning” can mean automatically calculating the versions, or it can also mean a GitHub bot writing additional commits after your push. Your current preference is to own Git commits and pushes. We can automate the repetitive bookkeeping while keeping that publishing control.

**Recommendation:** Design a deterministic release-preparation command that detects changed skills and writes the proposed version/notes files for your review. Your normal authoring workflow can call it; you should not have to calculate or edit version numbers. You then make your usual commit and push. Validation checks that the release information matches the changed content. The exact commit-to-history catalog lookup still needs a separate ordering design; preparation alone does not solve that.

The alternative is to finish release generation on GitHub after you push. That requires choosing where the generated results are written and how native plugin users avoid seeing an incomplete release. A bot that commits back to the repository would be a separate future publishing-policy decision.

**Question:** Is automatic preparation before your normal commit/push sufficient, or is “push the skill changes and GitHub does all remaining release work” an essential part of the experience?

### Your answer
I think what we really want to do is design an architectural structure around what each skill needs to have before release. It needs to have prep notes, a version, and all this kind of stuff. We then add a GitHub action to our CI/CD pipeline so that when we try and do a pull request to main, it checks to ensure that each skill has all of these requirements, so that no skill is missing any piece. I'm interested in your thoughts or ideas on this. Let me know what you think would be the simplest way to achieve the outcome that I want. 
<!-- Write your answer here. -->

## What follows

Your answers will guide the concrete publishing design: version metadata, initial release records, catalog location, source-commit ordering, plugin version bumps, history preservation, and failed/retried publication. These are still part of this issue. We will not reopen native GT versus GT archive or build the deferred restore skill here.

This round uses [Grilling](C:/Users/godle/.agents/skills/grilling/SKILL.md) in your requested Markdown format. [Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md) says, “A HITL ticket only resolves through that live exchange.” Your answers supply the publishing-policy decisions; the recommendations are not assumed acceptance.
