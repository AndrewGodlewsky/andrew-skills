# Automatic skill publishing — Round 3

Historical decision record: [issue #79](https://github.com/AndrewGodlewsky/andrew-skills/issues/79) supersedes development release numbering, the two-field metadata schema and automatic baseline discovery. Current rules are in [CONTRIBUTING.md](../../CONTRIBUTING.md) and the [catalog contract](../release-catalog.md). Uncompleted client/WSL pilot acceptance remains open.

Issue: [Define automatic skill versioning and immutable release history](https://github.com/AndrewGodlewsky/andrew-skills/issues/5).

**Status: answered and reviewed.** Original answers are preserved below. The owner accepted history-derived publication, new versions for every skill correction, and a simple plugin patch bump. For returning names, the owner chose to restart at `1.0.0`, rejecting the recommendation to continue numbering. The [publishing contract](skill-publishing-notes.md) records that choice and distinguishes repeated version labels by their exact source snapshots. No repository settings or release automation are being changed now.

## Already settled

Each skill has `release.yaml` with a version and short note, starts at `1.0.0`, and uses the agreed patch/minor/major rules. Release information is part of the PR and must pass checks before merge. You will configure merge enforcement later. Numbered history begins when the new system is introduced. Native GT updates and the separate GT archive remain unchanged.

The remaining questions address how those rules behave over time.

## 1. Can Git history itself supply the historical release catalog?

**Recommendation:** Read release information from the reviewed snapshots that reached `main`. A deterministic catalog builder records the first main snapshot containing each new skill/version, its full commit ID, folder path and note. For example, if `grill-me` `1.1.0` first appears in a reviewed merge, that merge's exact snapshot becomes its archive source.

This lets `release.yaml` stay small and avoids a second handwritten history file or bot-written catalog commits. The catalog is still real structured data; it is generated from preserved repository history and can be cached. An incomplete history fetch must report unavailable data, not silently invent a complete catalog.

**Why this matters:** It resolves the “how does the file contain its own future commit ID?” problem: the ID is read after the commit exists. It also avoids a separate publication service. The costs are fetching enough history and keeping published main history intact.

This proposal treats one reviewed merge result as one release snapshot. Normal merge commits or squash merges fit that boundary. Rebase-and-merge can put intermediate PR commits directly onto main, so this first design would use merge or squash for publishing. No merge setting is being changed now. Git supports following only the main line of merge history; this is a proposed design using that mechanism. [Git history traversal](https://git-scm.com/docs/git-rev-list), [GitHub merge methods](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github)

**Question:** Is a history-derived catalog with merge/squash release snapshots acceptable, or do you need a separately published release ledger or rebase-and-merge support from the outset?

### Your answer
Yeah, I think this is fine, as long as this simplifies the process. 
<!-- Write your answer here. -->

## 2. Should even a small correction to a released skill get a new version?

**Recommendation:** Once released, that skill/version always refers to the same complete files. A typo fix in `SKILL.md`, a corrected bundled template, or a correction to `release.yaml`'s note gets a new patch version if it preserves usage. Edits made while a PR is still a draft do not need a new published version for every edit.

**Why this matters:** If `1.0.0` can mean different files over time, status and restoration become ambiguous. This rule keeps the archive reproducible, at the cost of occasionally creating a release for a small correction. Top-level repository documentation still does not bump unrelated skills.

**Question:** Is that consistency worth creating a patch release for small corrections, including release-note corrections?

### Your answer
Yes, any correction or change to a skill needs to get a new version. That's why we have the XYZ versioning system: if the skill is 1.0.0 and there's just a small change in the wording or a typo fix, it can easily be updated to 1.0.1
<!-- Write your answer here. -->

## 3. If a removed skill returns with the same name, should it continue its history?

**Recommendation:** A genuinely new skill name starts at `1.0.0`, as you requested. An existing name keeps its identity even if the skill is temporarily removed. If its last release was `1.3.0`, bringing back those exact files can reuse that existing release; changed files require a higher version. Do not restart that same name at `1.0.0` with different contents.

A replacement that needs an independent history should receive a new name and start at `1.0.0`. Renaming a skill would therefore create a new named history while preserving the old one for the archive; aliases and automatic archive renaming are not required.

**Why this matters:** A user might already have archived `grill-me` `1.0.0`. Reusing that name/version for a different skill would make their stored identity ambiguous. This clarifies the edge of your “new skills start at 1.0.0” rule without creating a larger identity system.

**Question:** Does that distinction between a new name and a returning name work for you?

### Your answer
I think if we return back a removed skill, it should end up starting again at 1.0. I understand that this might be a problem for those who have archived that skill, but we're not going to worry about that. 
<!-- Write your answer here. -->

## 4. Can the overall GT plugin version simply advance once per bundle update?

**Recommendation:** Keep the existing plugin's three-part number and increment its patch component once whenever the reviewed change affects distributed skills or plugin behavior. For example, the container might move from `0.1.3` to `0.1.4` while `grill-me` moves from `1.2.3` to `2.0.0` and unchanged `skills-update` stays at `1.0.0`. Keep the root manifest and marketplace version identical.

The author's PR includes that container bump; CI checks that it happened. Multiple changed skills in the same release still cause only one container bump. Additions/removals count as bundle changes. A documentation-only push can run validation without assigning new skill or plugin versions.

**Why this matters:** Native clients see the plugin as their update unit, but users need each skill's own version and notes to understand behavior. Giving the container a simple delivery sequence avoids duplicating every skill's compatibility classification. Its version is not a claim that every contained skill changed compatibly.

**Question:** Is that simple container-bump rule sufficient, or should the overall plugin's major/minor numbers also summarize the kinds of skill changes inside it?

### Your answer
Yeah, I think this simple bump rule is sufficient. I'm okay with that. 
<!-- Write your answer here. -->

## What comes next

The [publishing contract](skill-publishing-notes.md) incorporates these answers, catalog lookup rules, CI rules and failure scenarios. Its downstream handoff covers archive, status, interactions and migration. Merge enforcement remains Andrew's later setup task; the restore skill remains deferred implementation.

This records the owner review required by [Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md): “A HITL ticket only resolves through that live exchange.” Recommendations above are historical context; the answers and consolidated contract determine the selected behavior.
