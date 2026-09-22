# Skill dependency map

Inspect what a skill relies on and which other skills need review before changing
it. This maintainer tool reads current working files, including uncommitted edits.
It implements the accepted overview graph plus linked table from
[#53](https://github.com/AndrewGodlewsky/andrew-skills/issues/53), using the audited
data from [#61](https://github.com/AndrewGodlewsky/andrew-skills/issues/61).
Production viewer work and verification are recorded in
[#62](https://github.com/AndrewGodlewsky/andrew-skills/issues/62).

From the repository root, with Node.js available:

```sh
node scripts/skill-map-server.mjs
```

Open [the local skill map](http://127.0.0.1:43854/). Stop with Ctrl+C.
Use `--port N` if a different local port is needed. No installation or hosted
service is required, and no skill runtime depends on this viewer.

## Use the map

- **Overview graph:** A → B means A relies on B. Dashed edges are conditional.
  Select any skill, including one in the isolated-skills list. The side panel
  shows unique direct and transitive callers, paths, conditions and source quotes.
- **All skills:** scan or filter the complete inventory. Click a row, or tab to
  its name and press Enter, to open it in the graph. Returning preserves selection.
- **Include shared resources:** inspect scripts, guidance, bundled files and
  maintained-source → generated-copy → consumer relationships. Arrows still mean
  relies-on, so a copy points to its maintained source. The graph shows the
  selected node's immediate links; the side panel traces full caller paths and
  the table includes every resource. Selecting a skill also checks its owned
  resources for external consumers.
- **Review and evidence:** distinguish reviewed skills, pending/stale reviews,
  missing targets, copy drift and candidates needing classification. Candidates
  do not become dependency arrows automatically. Expand source evidence to open
  the quoted working-file location. Conditions and cycles remain visible.
- **Refresh working files:** reanalyze current sources and dependency records.
  Every navigation also refreshes. A snapshot label identifies the analyzed input.

Potential impact means **review scope, not proven breakage**. An unreviewed skill
with no recorded edges is not declared independent. A reviewed absence of skill
dependencies does not mean an absence of resources or external prerequisites.
Large path enumerations show their limit explicitly instead of claiming complete
coverage. Incomplete analyses remain inspectable.

## Text and saved output

The viewer's **Text fallback** includes the complete dependency list, conditions,
quotes and table without requiring SVG or JavaScript. The footer offers
deterministic **JSON** and **Markdown + Mermaid** snapshots of the same analysis.
The Markdown includes the simple Mermaid graph, full skill/resource tables,
all declared dependencies/provenance, evidence, findings and candidate decisions.
Its tables and edge list remain useful when Mermaid is unavailable.

Save downloaded `map.md` in `docs/skill-map/` for its repository-relative source
links to resolve. Saved files describe the recorded fingerprint and cannot detect
later disk edits. The live source viewer warns if an evidence link was created
against an older snapshot. Managed persisted artifacts, failure checks, CI and
AGENTS.md/CONTRIBUTING.md maintenance instructions are the next execution task,
[#63](https://github.com/AndrewGodlewsky/andrew-skills/issues/63).

The [data/API guide](skill-map/README.md) documents the model, semantic review,
copy transformations, scanner coverage and limits. The original presentation
prototype has been retired; its accepted decisions remain in #53 and the
[implementation handoff](planning/skill-map-implementation-handoff.md).
