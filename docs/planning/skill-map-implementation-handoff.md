# Skill dependency map — implementation handoff

**Resolved planning handoff for [#54](https://github.com/AndrewGodlewsky/andrew-skills/issues/54),
September 22, 2026. Execution status below.** Andrew selected validation failure,
accepted the recommendation to include both views in the first implementation,
and directed completion of the remaining section. The workflow and technical
defaults below complete that handoff; the execution status distinguishes delivered tooling. Keep decisions and actual
check results in the [#54 resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/54#issuecomment-5771080202)
and the execution issue carrying each change.

**Current execution:** #61's data foundation and dependency-focused audit are
implemented, along with #62's [production viewer](../skill-map.md), shared-resource
view and deterministic HTTP exports. See the [data/API guide](../skill-map/README.md)
for commands, coverage and limits. Persisted generated artifacts/freshness
enforcement and authoring integration (#63) remain pending. The planning evidence at the end describes the earlier
decision stage, not these subsequent implementation results.

## Settled requirements

- [#51](https://github.com/AndrewGodlewsky/andrew-skills/issues/51#issuecomment-5770734161):
  discover every skill in the current working files, including isolated skills.
  Show actual required and conditional skill dependencies; A → B means A relies
  on B. Show direct and transitive callers, paths, conditions, missing targets
  and cycles. Impact means review scope, not proven breakage. The expanded
  shared-source view must not replace the simple skill view. #54 now includes
  both in the first implementation; the expanded view is optional to display.
- [#52](https://github.com/AndrewGodlewsky/andrew-skills/issues/52#issuecomment-5770814978):
  automatic inventory plus explicit repository-owned dependency records and
  semantic review by the authoring agent. Keep metadata outside runtime skill
  headers. Evidence includes paths and instruction excerpts. Detect stale
  evidence and review status; keep scanner candidates separate from asserted
  edges. Record reasoned exclusions. Trace maintained shared sources through
  generated copies to consumers without treating copies as independent sources.
- [#53](https://github.com/AndrewGodlewsky/andrew-skills/issues/53#issuecomment-5770985802):
  the overview graph is primary. A complete skills table opens and highlights a
  selected skill in the graph; retain selection between views. Support keyboard
  use, evidence inspection and a Markdown/Mermaid/table fallback. The
  accepted prototype demonstrated interaction, not production architecture or
  complete dependency coverage; it has been replaced by the [viewer](../skill-map.md).
- #54 owner requirement: automatic inventory and map maintenance belong in the
  normal authoring workflow, documented through AGENTS.md and CONTRIBUTING.md.
  An instruction alone does not guarantee freshness.

## Authoring workflow

This completes the accepted inventory/review ownership model from #52.
Command names and storage paths remain implementation choices;
publish real, tested commands in the guide when they exist.

1. Discover current skill packages and relevant source files from the working
   tree, including additions, deletions and local edits. Do not use a manually
   maintained node list. Show changed/new packages as needing dependency review.
2. The authoring agent reads affected instructions and bundled resources,
   updates actual dependencies, conditions and evidence, and classifies scanner
   candidates as dependencies or reasoned exclusions. Ask Andrew about genuinely
   ambiguous intent. Do not silently promote name matches into graph edges.
3. Record review against the current source contents. Regeneration alone must
   never certify review or turn an empty edge list into confirmed independence.
4. Regenerate deterministic map data and presentation. Run the read-only check
   and relevant existing repository checks. Resolve findings and record actual
   results in the issue carrying the change. Leave Git publication to the owner.

| Author action | Automatic behavior | Required review |
| --- | --- | --- |
| Add a standalone skill | Inventory includes it without editing a node list; review starts pending. | Inspect its instructions/resources and explicitly record a reviewed empty dependency set when justified. |
| Add or change a dependency | Detect changed source state and candidate references; refresh evidence locations. | Record the real target, condition and evidence; verify affected callers and paths. |
| Edit a skill without changing dependencies | Mark the affected source review stale even if the quoted excerpt still matches. | Confirm the relationship records still describe the complete current instructions. |
| Rename a skill | Discover the new name and preserve inbound references to the old name as unresolved. | Explicitly repair references and records; never guess that a new skill is the old target. |
| Remove a skill | Remove it from current inventory; retain unresolved inbound targets and flag orphaned records. | Remove or replace dependencies in callers and reconcile obsolete records. |
| Edit a shared source | Trace the maintained source through generated copies to each known consumer; mark affected review stale. | Review consumers, regenerate copies using existing builders and verify provenance. |

The preview should remain inspectable when review is incomplete. Known stale
edges retain visible status; new candidates are shown separately. Every view
must distinguish reviewed-empty, unreviewed, stale and unresolved states.

## Freshness implementation defaults

- Bind each skill's review to a deterministic digest of its source inventory
  and contents, covering instructions and bundled resources. Source additions,
  deletions and changes outside a quoted passage invalidate that review. Include
  maintained shared inputs for the provenance layer, regardless of which view
  the reader currently displays.
- Define text normalization consistently with repository line-ending rules;
  sort paths and hash non-text resources as bytes. Do not use modification times
  or require a clean Git tree. A source digest must exclude generated map output
  and its own stored review digest to avoid a self-referential check.
- Tie exclusions to their source context. A formerly excluded recommendation
  becoming an instruction needs review. Inventory changes also rerun candidate
  discovery against existing skills, since a new name may match existing prose.
- Compare regenerated expected artifacts with checked-in artifacts without
  writing during validation. Repeated generation from unchanged inputs must
  produce identical bytes; avoid per-run timestamps in deterministic output.
- Label saved output with its source fingerprint and coverage. A saved static
  page cannot detect later disk edits by itself. Its source label must not imply
  a live freshness check; the local workflow and CI establish freshness.
- Scanning and hashes can identify changes and review gaps. They cannot prove
  that arbitrary prose was interpreted correctly or that dependent skills work
  at runtime. Complete the initial semantic audit before calling coverage full.

## Accepted validation policy

Andrew selected **Fail validation** on September 22, 2026, in response to the
choice between failure and warnings for stale output or unfinished review.
Fail map readiness for stale artifacts, omitted inventory, invalid
records, missing targets, stale or ambiguous evidence, unfinished source review
and unclassified candidates. Continue rendering a visibly incomplete preview.
Cycles and valid conditional dependencies are information, not failures solely
because they exist. A properly reviewed exclusion or reviewed standalone skill
passes. Repository settings and merge enforcement are outside this work.

## First implementation and delivery

Ship the simple skill-only graph and the optional expanded shared-source view
together, with the linked full skills table and fallback. The expanded layer
covers actual repository resource dependencies, including scripts, guidance,
templates or other resources, and maintained-source/generated-copy provenance.
Do not add edges merely for directory co-location or a casual file mention.
Audit the current inventory and all relevant bundled resources; the prototype's
shared-source examples are not a complete list of consumers or resources.

Use a repository-local, read-only viewer for current working-source inspection,
plus deterministic generated data and Markdown/Mermaid/table output. This is a
delivery default for implementation, not a requirement to preserve the
throwaway server or its layout code. No external hosting or runtime skill
dependency is needed. Document the actual launch, generate and check commands
when implemented. Saved outputs identify their snapshot; reopening/refreshing
the local viewer must re-evaluate current working-source status.

## Bounded acceptance examples

| Case | Expected evidence |
| --- | --- |
| New standalone skill | It appears in graph inventory and full table without a node-list edit; pending review is visible; explicit review permits a confirmed empty set. |
| New A → B dependency | Source-grounded edge and condition appear; selecting B shows A as a direct caller; regeneration/check includes the change. |
| A → B → C and A → D → C | Selecting C reports unique callers, separates direct/transitive impact and exposes both dependency paths without duplicate caller counts. |
| A ↔ B, C → A and a true self-call | Traversal terminates, cycle edges remain visible and the selected skill is not counted as its own impacted caller. |
| Missing or renamed B | The old target remains visibly unresolved; a similarly named new skill does not silently repair it. |
| Context changes outside an evidence excerpt | Previously reviewed source and exclusions become stale even when the quote still exists. |
| Recommendation, example, negation or attribution | It does not become a dependency; retain a reviewed reason/context for scanner candidates. Changing it into an instruction requires reclassification. |
| Outdated output or pending review | Read-only check identifies the exact finding, leaves files untouched and uses the agreed severity; incomplete preview remains usable. |
| Repeated generation and supported platforms | Unchanged inputs produce identical output; line endings do not cause false freshness failures. |
| Table/graph navigation | All current skills are reachable; pointer and keyboard selection highlight the same skill, preserve selection and expose conditions/evidence. |
| Fallback and source links | Text lists preserve relationship/status information; Mermaid renders in the intended host; evidence links reach the correct source location. |
| Shared source | Editing one maintained source reaches every declared consumer through generated copies; stale or missing copies cannot look current. |

## Implementation slices

1. [#61 — Dependency data, review tracking and initial audit](https://github.com/AndrewGodlewsky/andrew-skills/issues/61):
   inventory, explicit records, source review tracking, scanner candidates and
   initial semantic audit of skill and shared-source dependencies. Establish complete coverage before a green
   readiness claim; the prototype's eight sample edges are not a full audit.
2. [#62 — Overview, linked table and shared-source view](https://github.com/AndrewGodlewsky/andrew-skills/issues/62):
   production overview graph, linked full table, impact/evidence/status views
   and fallback using the accepted interaction, including both map views.
   Replace the throwaway prototype with working-source inspection and honest
   freshness labels.
3. [#63 — Freshness and authoring integration](https://github.com/AndrewGodlewsky/andrew-skills/issues/63):
   deterministic generation and read-only checking, acceptance fixtures and
   existing CI integration. Add AGENTS.md's maintenance rule/pointer and the
   canonical CONTRIBUTING.md workflow with real commands. Demonstrate adding a
   new skill end to end, including shared-source freshness and consumer impact.

All three are assigned to Andrew. #62 is blocked by #61; completion of #63 is
blocked by #61 and #62. They are outside the planning-only child list of #50.
These are execution tasks following the planning decisions. Record technical
refinements and any material scope changes in their issues. Do not reopen settled
product choices merely to choose filenames or a hashing implementation.

## Repository findings and release boundary

Current CI in [validate.yml](../../.github/workflows/validate.yml) runs on pushes
and pull requests to main and manual dispatch, with read-only contents
permissions. Existing builders already offer read-only `--check` behavior.
Integrate map validation with that pattern; no CI writes or automatic commits.

[build-create-skills.mjs](../../scripts/build-create-skills.mjs) extracts two
CONTRIBUTING.md ranges: `## Skill standard` up to `## Complete examples`, and
`The supported metadata format is deliberately small:` up to
`A skill absent from a published main snapshot`.
[build-skill-steal.mjs](../../scripts/build-skill-steal.mjs) reuses that extraction.
The completion checklist and validation sections are outside those ranges.
Place repository map instructions outside packaged excerpts and verify builders
after editing; do not assume every guide change is repository-only.

Repository-only docs/tooling do not require skill version bumps. If actual
distributed packages change, apply the existing release contract to those
packages and the bundle. Do not add a runtime skill dependency for map tooling.

## Actual evidence so far

Inspected current CI, guide extraction, release guidance and the source
inventory reader. The accepted prototype has local interaction checks recorded
in #53; it is still incomplete sample data. No production generator, review
tracker, map readiness check, CI integration or AGENTS.md maintenance rule has
been implemented or verified. The acceptance rows above are future checks,
not reported passes.
