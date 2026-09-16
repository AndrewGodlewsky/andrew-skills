# Automatic skill publishing — Round 2

Issue: [Define automatic skill versioning and immutable release history](https://github.com/AndrewGodlewsky/andrew-skills/issues/5), assigned to AndrewGodlewsky.

**Status: answered and reviewed.** Your original answers are preserved. The release-file shape, initial versions, bump meanings and pre-merge validation requirement are accepted. You will configure enforcement later. Continue in [Round 3](skill-publishing-round-3.md) for the remaining publishing contract. No implementation or settings changes are requested.

## What I took from your answers

- Reaching `main` should be the release event. Unchanged skills still keep their versions; a documentation-only push need not invent new skill versions.
- Skills use **`x.y.z` numbers**. I have documented that chosen direction in the README and contributor guide, with the unfinished details labeled as planned.
- Users need a short explanation of what changed. You suggested a separate YAML file, distinct from the skill's short discovery description.
- Authors should supply complete release information in the change, and a GitHub Action should check it on the pull request.

I agree with that workflow. A validation job can report “`grill-me` changed but its version did not” or “release notes are missing.” The author or authoring agent fixes the PR. No bot needs to write corrective commits after the change has landed. An optional local helper could reduce bookkeeping later, but it need not be a required part of the first design.

## 1. Does this small release file capture what you want?

**Recommendation:** Put one `release.yaml` beside each skill's `SKILL.md`, containing the current version and one- to two-sentence release note. For example:

```yaml
version: "1.1.0"
notes: >-
  Added a budget question before implementation recommendations.
  Existing interview commands continue to work.
```

This is a proposed schema and example, not an existing file. `SKILL.md`'s description continues to explain what the skill does; the release note explains what changed in this version. Previous versions and their notes remain available through the historical catalog and corresponding source snapshots. The separate catalog resolves a release to its exact commit/path; this author file does not try to contain its own future Git commit ID.

**Why this matters:** Keeping metadata next to its skill makes the authoring requirement easy to discover and includes the note with an exported historical copy. A current-release file is smaller than making authors maintain a second handwritten history list. If “prep notes” means a testing checklist or other author-only information, that should be identified separately from the user-facing note.

CI can validate required fields, a version increment and a nonempty note. A reviewer still checks whether the note accurately describes the change; deterministic validation cannot establish that from prose alone.

**Question:** Is version plus a short user-facing note enough, or do you want additional required release information such as preparation/testing notes?

### Your answer
Okay, I think this looks good, and the version plus a short user-facing note is plenty. We don't need to have the entire backstory here, just a little bit of extra context for the user. This is perfect. 
<!-- Write your answer here. You can also suggest a different YAML organization. -->

## 2. Do these version-bump rules match what you want the numbers to mean?

**Recommendation:** Start each skill at `1.0.0` when it enters the new system. For subsequent releases, use these rules:

| Change | Example from `1.2.3` | Skill example |
| --- | --- | --- |
| Fix or clarification that preserves the documented workflow | `1.2.4` | Correct a template or clarify an existing question. |
| Added capability that preserves existing usage | `1.3.0` | Add an optional interview mode. |
| Incompatible change to documented usage | `2.0.0` | Remove a supported mode or add a mandatory tool users must install. |

The author or authoring agent proposes the increment and notes; review confirms the category. CI checks valid ordering and released-version reuse, without asking an AI to classify every diff. The main plugin keeps its own version; these example skill numbers do not replace it.

**Why this matters:** You selected three-part numbers. These rules make them useful to users and give future authoring agents a concrete convention. The compatibility boundary is documented inputs, commands, requirements and workflow/output promises, rather than identical wording from the model. If several types of change occur together, use the largest applicable bump. [Semantic Versioning](https://semver.org/)

**Question:** Do you accept this `1.0.0` starting point and the fix/addition/incompatible-change rules, or would you change their meaning for skills?

### Your answer
Yeah, I think this is good. I like this. 
<!-- Write your answer here. -->

## 3. Should the release check be required before anyone updates main?

**Recommendation:** Use PRs for changes to `main` and make the release-validation check required, including for your ordinary maintainer changes. Require validation against the current main state before merge so two PRs cannot both introduce the same next skill version unnoticed. This does not propose an additional human-reviewer quota.

**Why this matters:** Adding a GitHub Action makes a failure visible; it does not automatically make it impossible to merge or bypass. Required-check/branch rules provide that enforcement. A direct push to `main` can expose incomplete content to native plugin users before an after-push check fails. GitHub documents separate controls for required checks and administrator bypass. [Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

Every accepted PR merge still updates `main` and becomes the release event you requested. The exact rule configuration would be designed and applied separately; no setting is being changed now.

**Question:** Should the PR/check requirement apply to your own normal changes too, or do you need to retain a direct-to-main publishing path?

### Your answer
Yeah, these checks are going to have to be done before the pull requests are merged into main, so don't worry about the protected branches and stuff. I'll set all that up, and we'll get this done in the future. I just kind of want this idea noted down so that when we go to build this, it's easy to interface with what you're building right now. 
<!-- Write your answer here. -->

## 4. Can reliable numbered history begin when we introduce this system?

**Recommendation:** Make the first metadata-complete release the starting point of the numbered catalog. Older repository history remains intact, but we do not invent skill version numbers and release notes for every previous commit. If an older release later proves important, it can receive an explicit, reviewed historical import.

For example, a teammate could restore skill `1.0.0` after trying `1.1.0`. They would not automatically see every experiment from before versioning was introduced as a numbered release. The existing plugin version `0.1.3` does not tell us an independent historical version for each skill.

**Why this matters:** A clean baseline makes the archive's version and notes trustworthy and avoids a backfill project. It also defines the earliest release the new restore flow can normally offer.

**Question:** Is that starting boundary acceptable, or are there particular pre-versioning skill snapshots you need available in GT archive from day one?

### Your answer
Yeah, I think this is fine. Ultimately, when we first create these skills or introduce them to the repo, they should always just start with 1.0.0. 
<!-- Write your answer here. -->

## Next steps

I will use your answers to specify the CI comparison rules, native plugin/catalog consistency, exact commit lookup, permanent history availability and failed/retried publication. Those technical details remain within this issue. This round does not assume that per-skill YAML plus a PR check alone solves the historical index.

This is the written owner review required by [Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md): “A HITL ticket only resolves through that live exchange.” The issue stays open while we settle the publishing contract; recommendations are not treated as your decisions.
