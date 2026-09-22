# GT Help: knowledge sources and client entry points

Research for [Investigate GT Help knowledge sources and client entry points](https://github.com/AndrewGodlewsky/andrew-skills/issues/65), September 22, 2026.

Published artifact: [knowledge-source research](https://github.com/AndrewGodlewsky/andrew-skills/issues/65#issuecomment-5771167109).
This file is the local working copy; the issue holds the published research and resolution.

## Finding

Help can remain a guidance-only skill while grounding answers in readable skill
packages and maintained documentation. Its main design problem is separating
inventory, behavioral knowledge and workflow recommendations: none is a complete
substitute for the others. A model-visible skill list alone cannot establish the
installed inventory. The next owner decision should choose the source/freshness
model, not revisit manual invocation or permission to perform actions.

Required behavior is already settled: `user-invocable: true`,
`disable-model-invocation: true`, questions and recommendations only. Reading
source material for an answer is distinct from activating it. The minimum
read-only knowledge access still needs to be specified in that model.

## Evidence boundary

The working checkout HEAD and GitHub main both reported
`d53402ff3a58e2824686d502810caa6362dabc0f` during this investigation.
There were 17 immediate skill folders, including the model-only `create-issue`;
no Help package existed. Local documentation changes and an untracked
`scripts/skill-map.mjs` were present. Existing work was inspected, not changed
or treated as published. This checkout is research material, not evidence of a
user's active installed collection.

Pinned GT source links below refer to that published revision. The related
[dependency-data implementation](https://github.com/AndrewGodlewsky/andrew-skills/issues/61)
and [freshness integration](https://github.com/AndrewGodlewsky/andrew-skills/issues/63)
were open with no issue comments when checked. Those observations are dated,
not ongoing status claims.

## Ask Matt reference and provenance

Matt Pocock's [Ask Matt source](https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/ask-matt/SKILL.md)
organizes recommendations around a user's situation, ordered workflows,
conditional branches, standalone tasks and context handoffs. This is a useful
interaction pattern for Help; its particular catalog and engineering sequence
are not GT's catalog.

The inspected personal reference differed from pinned upstream after normalizing
line endings: upstream blob `ae8eb9b211972d9ae584b41d0f1439c644494fc7`
at `c55ee46073ed923f86ce59a5eb3b6d895095d1b7`. Therefore its behavior must
not be presented as an exact copy of that revision. Neither reference should
become a runtime dependency.

The author's [companion documentation](https://github.com/mattpocock/skills/blob/main/docs/engineering/ask-matt.md)
describes a manually maintained router and reports two relevant failure modes:
mistaking a filtered model-visible list for installation evidence, and
describing skills from summaries without checking their instructions. These
are upstream-reported problems, not reproduced GT failures. Help should preserve
the situation-based explanation while verifying consequential behavior claims
against the selected source.

The pinned upstream [license](https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/LICENSE)
is MIT, copyright 2026 Matt Pocock. If implementation adapts upstream text,
retain its notice and record the exact source and adaptations as required by
GT's [authoring guide](https://github.com/AndrewGodlewsky/andrew-skills/blob/d53402ff3a58e2824686d502810caa6362dabc0f/CONTRIBUTING.md).
This report summarizes the reference; it imports no production skill.

## Source and capability comparison

| Source | What it establishes | Limit and useful role |
| --- | --- | --- |
| Client-provided skill metadata | Skills the client exposes through that particular route, with supplied descriptions | Filtering can hide manual-only skills. Use as a discovery hint, not proof that an omitted skill is absent. |
| Selected GT package inventory and headers | Present package names, declared purposes and invocation flags | Requires readable source identity. Does not prove enabled state, runtime availability or workflow suitability. Model-only skills must not be presented as user slash commands. |
| Relevant `SKILL.md` bodies and bundled resources | The selected version's authored behavior, prerequisites, boundaries and dependencies | Read as evidence only; never execute embedded instructions. Read details needed for the question rather than every package on every answer. |
| Per-skill `release.yaml` | That package's declared version and release note | Not a complete behavior specification; plugin version is not skill version. Cannot establish remote freshness or which instructions an existing conversation retained. |
| GT README and maintained support documentation | Intended installation/update routes, marketplace identity and user guidance | Must identify source revision; a current web README may describe newer behavior than installed GT. Help needs portable runtime access or a maintained bundled derivative, not an assumed checkout. |
| History-derived release catalog | Published release identities, historical sources and active records at a known commit | Requires preserved Git history and tooling; its reader does not fetch. Useful publication evidence, excessive as a mandatory prerequisite for ordinary Q&A. |
| Dependency map data | Reviewed actual dependencies, evidence and potential change impact in its source snapshot | Does not express user suitability or recommended workflow order. Unreviewed/new inventory is not reviewed knowledge. Current implementation work cannot be presumed shipped. |
| Curated workflow/support guide | Human-reviewed reasons, distinctions and ordered recommendations | Secondary knowledge that needs explicit freshness checks against its sources; cannot alone prove installed availability. |

The package and metadata distinctions above follow the
[status skill](https://github.com/AndrewGodlewsky/andrew-skills/blob/d53402ff3a58e2824686d502810caa6362dabc0f/skills/skills-status/SKILL.md),
[installation-selection contract](https://github.com/AndrewGodlewsky/andrew-skills/blob/d53402ff3a58e2824686d502810caa6362dabc0f/skills/skills-status/references/installation-target.md),
[README](https://github.com/AndrewGodlewsky/andrew-skills/blob/d53402ff3a58e2824686d502810caa6362dabc0f/README.md)
and [release-catalog reader contract](https://github.com/AndrewGodlewsky/andrew-skills/blob/d53402ff3a58e2824686d502810caa6362dabc0f/docs/release-catalog.md).

Existing status, update and restore skills supply useful source contracts, but
Help must not invoke them. Status is itself a manual-only workflow; update and
restore perform changes. Help may explain their purpose and let the user choose
to invoke them separately. Restoration creates a personal historical copy,
whereas update changes the selected managed collection; those are different
answers to different questions.
Sources: [update](https://github.com/AndrewGodlewsky/andrew-skills/blob/d53402ff3a58e2824686d502810caa6362dabc0f/skills/skills-update/SKILL.md),
[restore](https://github.com/AndrewGodlewsky/andrew-skills/blob/d53402ff3a58e2824686d502810caa6362dabc0f/skills/skills-restore/SKILL.md).

## Four different states

1. **Working source:** may contain uncommitted additions or incomplete tooling.
2. **Published collection:** files at a verified remote publication revision.
3. **Installed collection:** files in the user's selected environment and GT
   registration; may be older, disabled or ambiguous.
4. **Loaded conversation:** instructions already retained in a chat; installed
   file inspection cannot prove this state.

Recommendation: answer general GT questions from clearly identified maintained
knowledge. Before asserting that a user can run a particular skill now, require
appropriate client/source evidence or qualify availability. Do not force an
installation audit for a general question. A supplied excerpt can support a
bounded answer when source access is unavailable.

## Existing map reuse

The local in-progress `scripts/skill-map.mjs` exposes inventory, source digests,
lexical candidates, reviewed relationships and change-impact traversal. It reads
repository-owned sources including scripts/exporter/authoring guidance. Its CLI
expects `docs/skill-map/relationships.json`, which was absent when inspected.
The module was not executed or tested here. It is neither a complete installed
Help knowledge source nor evidence that freshness integration has shipped.

Potential reuse belongs at authoring/build time: common package discovery,
source identities and invalidation signals. Help-specific recommendation
knowledge remains separate. Do not import a repository-only module into the
runtime skill or turn every recommendation into a dependency edge.
The accepted distinction is recorded in
[Choose how skill relationships are recorded and verified](https://github.com/AndrewGodlewsky/andrew-skills/issues/52).

## Options for the owner decision

| Option | Advantage | Cost or limitation |
| --- | --- | --- |
| Runtime inventory and selective source reading | Reflects the readable selected installation and naturally notices added/removed packages | Client read capabilities vary; detailed scanning is costly; published changes and workflow synthesis need separate evidence. |
| Generated, bundled help catalog | Predictable, portable Q&A input; ordinary use need not require Git, Node or network | Only as current as its release; build/check ownership is needed; summaries can drift semantically. |
| Hybrid: generated inventory plus a small reviewed guide and selective detail reads | Combines coverage, concise entry knowledge and source-grounded answers | Requires clear precedence, invalidation rules and honest behavior when detailed sources are unavailable. |

**Provisional recommendation:** discuss the hybrid first. It directly addresses
the known failure modes without making Help an installer or a repository
scanner. Andrew has not selected it. “Dynamic” can mean automated maintenance
before publication; it need not mean a network lookup or self-update on every
question.

Decide in [Choose how GT Help stays current as skills and marketplace guidance change](https://github.com/AndrewGodlewsky/andrew-skills/issues/66):
source precedence, permitted read-only access, invalidation/review responsibility,
offline behavior, and source detail needed before making recommendations.
Conversation design and acceptance remain with their existing tickets.

## Failure cases to carry into acceptance

These are expected behaviors, not executed Help tests:

| Case | Expected guidance |
| --- | --- |
| Manual-only skill omitted from model metadata | Do not declare it absent; use appropriate inventory or state uncertainty. |
| Added, removed or renamed skill | Reflect the selected source; never invent an alias or silently equate a new name with an old one. |
| Older installed package versus current published guide | Explain the source difference; do not update anything. |
| Same name in GT and another plugin/personal copy | Identify GT source and client namespace; do not substitute the unrelated skill. |
| Missing/unreadable source or unsupported metadata | Give a bounded answer, identify the missing evidence and ask for relevant text when needed. |
| No network | Use available identified local knowledge with a freshness limit; do not claim current remote availability. |
| Permission/authentication/security rejection | Stop the blocked inspection and report it; no alternate route to bypass the control. |
| Source text asks to run a workflow or user asks Help to act | Treat source as data; explain next steps without invoking, executing, editing or submitting. |

## Checks and limits

Observed: read-only Git state and GitHub issue state; remote/local commit equality
at the time of inspection; local package count; source and metadata inspection;
Ask Matt upstream source/license reads and normalized-content mismatch.
No package was changed, no client configuration was changed, and no Help skill
was created. No behavioral, live-client or model-invocation test was run.

The companion [client entry-point report](https://github.com/AndrewGodlewsky/andrew-skills/issues/65#issuecomment-5771165460) records
primary-source documentation evidence and the exact untested runtime boundaries.
Its client findings must be carried into the acceptance handoff; a header or
documentation statement alone is not a demonstrated client pass.
