# GT plugin subdirectory migration: implementation brief

Prepared September 30, 2026. Status: owner-selected direction; implementation and live client verification remain outstanding.

Implementation update, October 1, 2026: the uncommitted migration and actual
verification are tracked in [issue #80](https://github.com/AndrewGodlewsky/andrew-skills/issues/80).
The brief below preserves its pre-implementation starting state; current authoring
paths and release instructions are in CONTRIBUTING.md. Live client acceptance
remains separate from repository checks.

## Purpose and decision context

Andrew reports that installing this repository as a Copilot plugin brings repository maintenance material into the local plugin installation. Users need the operational skill packages, not the authoring guides, test suites, dependency-map tooling, or planning documents.

The initial idea was a second distribution repository, populated automatically through PRs after source changes merge. After discussing marketplace subdirectory sources, Andrew preferred the simpler single-repository approach and requested extensive documentation for another agent to implement it.

The selected direction is to give GT a dedicated plugin root inside this repository and point the marketplace entry at it. Do not start a second repository, cross-repository publishing workflow, or additional release approval process as part of this work. The current request authorizes preparing this documentation; the receiving agent should follow its actual implementation request and the owner's Git permissions.

The exact `plugins/gt/` spelling and physically moving the canonical sources there are recommended implementation choices, not separately negotiated user requirements. Prefer them unless inspection reveals a concrete incompatibility. Preserve the simplicity of one repository and one maintained copy of each skill.

## What this change can and cannot establish

The marketplace `source` selects a plugin root. It does not promise a sparse Git checkout or an archive containing only that directory. Treat these as separate acceptance questions:

1. Does the client resolve GT to the dedicated directory and discover its skills and bundled resources correctly?
2. Does the installed plugin directory exclude repository maintenance content?
3. Does the marketplace cache or another checkout still contain maintenance content?

The desired package boundary is established by the layout. Questions 2 and 3 need observation in the supported clients. Do not claim reduced download size, reduced disk use, or absence of maintenance files from the machine merely because a subdirectory source works. A plugin root is also not an access-control boundary preventing an agent from reading other accessible files.

If a client keeps the whole checkout with a plugin-root pointer, report that precisely. If the result does not address Andrew's actual concern, bring back the evidence before expanding this into a distribution-repository project.

## Proposed final layout

```text
andrew-skills/
  .claude-plugin/
    marketplace.json              # marketplace discovery remains at repository root
  plugins/
    gt/
      plugin.json                 # the existing GT manifest, relocated
      skills/                     # canonical maintained skill packages, relocated
        help/
          SKILL.md
          release.yaml
        skills-restore/
          SKILL.md
          release.yaml
          references/
          scripts/exporter/       # runtime helper still travels with its skill
        ...
  scripts/                        # maintained helper sources, builders, tests
  exporter/                       # existing direct exporter distribution/guide
  docs/                           # planning, evidence, map artifacts
  .github/workflows/validate.yml
  AGENTS.md
  CONTRIBUTING.md
  README.md
  install.ps1
  release-baseline.json            # preserve existing historical boundary
```

Set the existing marketplace plugin entry's source to `./plugins/gt`. Preserve the marketplace name `andrew-skills`, plugin name `gt`, publisher, and repository identity. Keep the marketplace version equal to the relocated plugin manifest version.

Do not point source at the current `./skills` directory. Under the declared Agent Plugins 1.0 format, the plugin root contains `plugin.json` and its own `skills/` child. The current skills collection is one level below that boundary.

Prefer a physical source move over generating a second complete skills tree. Existing generated helper files remain generated in their skill packages. Avoid symlinks, junctions, duplicate discovery roots, and a leftover root manifest that ambiguously advertises a second GT plugin. Keep applicable runtime resources and attribution with the package; maintenance files should not be copied into it to satisfy broken paths.

## Evidence and starting state

Repository inspected: `A:\Claude\andrew-skills`. Working tree was clean at the beginning of this documentation task. Observed plugin version was `0.1.22`; re-read current main and the working tree before choosing any release version. No implementation tests or live installation tests were run for this proposal.

Current files establish these assumptions:

- Root `plugin.json` declares Agent Plugins 1.0 and plugin `gt`.
- `.claude-plugin/marketplace.json` contains one plugin with `source: "./"`.
- `CONTRIBUTING.md` explicitly requires root skill packages and root manifest/source validation today. It must change with the implementation.
- `.github/workflows/validate.yml` validates PRs and main snapshots, tests multiple Node/OS combinations, and checks generated bundles and the dependency map. It does not publish packages.
- Runtime Restore modules are already bundled under the skill; their maintained source is under root `scripts/`.
- `install.ps1` uses marketplace registration and `gt@andrew-skills`, rather than explicitly copying the root skills tree.

Documentation checked during this conversation:

- [Copilot CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference): plugin-root manifest, fixed `skills/` location for Agent Plugins, relative marketplace sources, and separate installed-plugin/cache locations.
- [Creating a Copilot marketplace](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace): relative paths such as `./plugins/frontend-design` are supported.
- [VS Code agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins): marketplace repository cloning, plugin updates, and retained inlined plugin files after uninstall. This prevents assuming a subdirectory excludes the rest of the repository from disk.

These references establish supported shapes, not verified behavior of Andrew's installed client versions. Recheck them if implementation occurs later.

## Read these repository contracts first

Read `AGENTS.md` and `CONTRIBUTING.md`, then use these existing artifacts for details rather than inventing a new authoring/release standard:

- `docs/release-catalog.md` and `docs/planning/skill-personal-export-contract.md`: catalog identity and historical export.
- `REHOME-HANDOFF.md`: useful inventory of identity assumptions and generated sources. This task is a path migration, not a repository rehome; do not retarget issue submission or source ownership.
- `docs/skill-map/README.md` and `docs/skill-map/relationships.json`: map schema, provenance, reviews, and exclusions.
- `README.md`: supported installation/update routes and local-client test instructions.
- `skills/help/SKILL.md`, Update/Status installation-target references, and Restore instructions before the move; use their new locations afterward.

Relevant existing decisions/evidence:

- [#79: cumulative history and fresh baseline](https://github.com/AndrewGodlewsky/andrew-skills/issues/79).
- [#13: history-derived release catalog](https://github.com/AndrewGodlewsky/andrew-skills/issues/13) and [#14: historical export](https://github.com/AndrewGodlewsky/andrew-skills/issues/14).
- [#22: installation ownership and update targeting](https://github.com/AndrewGodlewsky/andrew-skills/issues/22).
- [#66: Help maintenance](https://github.com/AndrewGodlewsky/andrew-skills/issues/66) and [#63: map freshness](https://github.com/AndrewGodlewsky/andrew-skills/issues/63).
- [#17: owner pilot](https://github.com/AndrewGodlewsky/andrew-skills/issues/17): existing deferred client acceptance must remain visible.

All existing issues were listed during preparation; none had an explicit subdirectory-migration title. The implementation agent should recheck and select or create one change record under standing issue-management authority. Record requested outcomes, decisions, actual checks, failures, and exceptions there; link this brief by its repository path. No migration issue was created by this documentation task.

## Impact inventory

This is a verified starting inventory, not an exhaustive list. Search all maintained sources and tests for root-path assumptions, including joins using separate `skills` arguments and regular expressions, not only literal `skills/` text.

| Area | Starting files | Required review |
| --- | --- | --- |
| Package and marketplace | `plugin.json`, `.claude-plugin/marketplace.json` | Relocate manifest; set source; preserve identity and matching versions. |
| Structural validation | `scripts/validate.mjs`, `scripts/skill-package-validation.mjs`, `scripts/skill-architecture.test.mjs` | Plugin-root discovery, skill enumeration, bundled-resource boundary, error paths. |
| Snapshot readers | `scripts/release-snapshots.mjs` | Runtime path list, Git tree queries, tree regex, working-tree traversal, index modes, clean-filter checks. |
| Release transitions | `scripts/release-validation.mjs`, `scripts/fixtures/releases.mjs` | Old/new manifests and source values, skill extraction, package configuration changes, history fixtures. |
| Catalog | `scripts/release-catalog.mjs`, `scripts/release-catalog-reader.mjs` | Per-snapshot layout, original source path/commit/tree, unchanged release retention. |
| Restore | `scripts/export-source.mjs`, `scripts/export-protocol.mjs`, `scripts/export-filesystem.mjs`, `scripts/export-*.test.mjs` | Exact source-path validation, tree selection, old plans/cache/receipts, preserved integrity checks. |
| Bundlers | `scripts/build-create-skills.mjs`, `build-skill-tweak.mjs`, `build-skill-steal.mjs`, `build-issue-submission.mjs`, `build-exporter.mjs` | New output roots; skill-to-skill source reads; generated import dependencies and manifests. All listed builders are under `scripts/`. |
| Dependency map | `scripts/skill-map.mjs`, `skill-map-view.mjs`, `skill-map-server.mjs`, `build-skill-map.mjs`, map tests | Inventory roots, ownership regex, file IDs, links, provenance, reviews and scanner candidates. |
| CI/test harnesses | `.github/workflows/validate.yml`, `scripts/*.test.mjs`, `scripts/caveman-compress-checks.py` | Root assumptions, legacy fixtures versus current fixtures, OS/Node coverage. |
| Installation and support | `README.md`, `install.ps1`, Help, Update, Status, Restore, `.vscode/` fixtures | Marketplace and direct/local routes, actual selected plugin root, upgrade path, resource resolution. |
| Maintainer docs | `AGENTS.md`, `CONTRIBUTING.md`, `REHOME-HANDOFF.md`, current map/release guides | Replace active authoring paths and validation explanations; preserve dated evidence. |

Do not blindly replace all `skills/` strings. Inside an installed GT plugin, `skills/<name>` remains correct. Inside an individual skill, relative bundled-resource links should usually remain unchanged. Historical records and legacy test fixtures must continue to describe their original paths. Current repository links need the new `plugins/gt/skills/` prefix.

## Critical design: preserve release history across the move

This is the largest technical risk. Merely moving files and changing the marketplace will break the existing historical reader, which validates every preserved first-parent publication.

The current reader enumerates root `skills`; catalog records contain `skillPath: skills/<name>`; `prepareSource` explicitly validates that path. A global replacement would make old releases unreadable. Treat layout as a property of each snapshot, not a global constant describing all history.

Recommended design:

1. Add a small shared layout resolver if that prevents inconsistent logic. Support the known legacy root layout and the intended `plugins/gt` layout. Derive/validate the layout from each snapshot's marketplace and manifests. Avoid turning this task into an arbitrary multi-plugin framework.
2. Read both known path sets when inspecting historical Git snapshots, then select the valid layout for that snapshot. Preserve safeguards for unsupported modes, links, malformed paths, missing objects, shallow history, and clean filters.
3. Reject ambiguous or conflicting layouts instead of silently merging two collections or preferring stale root files. Define this for working trees and historical snapshots, including empty skill collections.
4. Compare skills by logical name and their internal relative paths, bytes, and Git modes. A parent-folder relocation with identical package contents is not a skill removal, return, rename, or new release period.
5. Preserve existing catalog records for unchanged skills, including their original source commit, tree and path. The active release may correctly keep pointing at an older root-layout snapshot after migration.
6. For a genuinely changed release after migration, record its actual `plugins/gt/skills/<name>` source path and exact publication identity. Restore must read the path belonging to the selected historical record.
7. Keep the `gt-skill-folder-v1` content hash meaning stable unless a separately justified format change is necessary. Do not rewrite old records or the immutable `release-baseline.json` marker to make the move pass.
8. Preserve full-history validation, prior-catalog comparisons, original periods/notes, and source-tree verification. Test against a catalog saved before migration as well as a fresh catalog build afterward.

The existing snapshot/config comparison should recognize a changed marketplace source as a bundle configuration change requiring a plugin patch. Keep manifest versions synchronized. Do not reset the plugin or all skill versions.

A folder move alone should not require new versions for byte-identical skill packages. However, this migration will likely change the bundled Restore code, generated authoring guidance, and perhaps Help. Those are real package changes and follow the existing per-skill release rules. Review all generated differences before determining the affected skills. Do not invent a bypass to release validation or normalize away a real behavior change.

If a new layout module is imported by runtime exporter modules, include it in `build-exporter.mjs`'s explicit file list, hash manifest, generated launcher, and map provenance. A new import can otherwise pass source tests while failing in an installed package.

Changing Restore behavior requires reviewing its exporter version and compatibility with saved plans/cache. Prefer explicit regeneration errors for incompatible old plans over silently reinterpreting them. Preserve old installed personal copies and receipts. Existing clients with the old bundled helper may fail to read a future migrated snapshot; document/test updating the whole GT plugin first. Do not promise compatibility of an old helper with a new layout without evidence.

## Implementation sequence

### 1. Establish baseline and client evidence

Read current instructions, working-tree state, current published base, and the existing migration issue if any. Preserve unrelated local edits. Capture the current skill inventory and package identities before moving files. Record client versions and the install route reported by Andrew.

Use a disposable fixture outside real client caches to investigate subdirectory source resolution. A local-directory marketplace test proves local loading only. A Git-backed marketplace test is needed to characterize cloning/copying and cache behavior. Use an existing suitable public fixture if available or prepare a test fixture for owner publication; do not create a remote repository, push, or publish a PR without authorization. Do not replace the user's real GT installation for a probe.

If client execution is unavailable, continue the local implementation where authorized and mark live acceptance deferred. Lack of a client is not evidence that the layout fails or that the cache is clean.

### 2. Implement layout-aware readers with focused regressions

Add coverage for legacy snapshots, nested snapshots, and the transition before relying on a moved production tree. Keep existing legacy fixtures. Introduce new-layout fixtures and mixed-history scenarios rather than converting every old fixture.

Then move the canonical skill tree and manifest using ordinary working-tree file operations, update marketplace source and builders, and regenerate required copies. Avoid Git staging/history writes. On Windows, verify resolved source and destination paths remain within this workspace before recursive moves.

### 3. Update consumers and maintained guidance

Adapt the map and current repository-path consumers. Review Help and update it only where its advice changes. Installed plugin-relative language can remain correct after a repository move. Keep issue submission directed at this same repository.

Review direct-from-repository install instructions: a client that assumes the repository root is the plugin may no longer work after removing root `plugin.json`. Prefer the existing marketplace route. Advertise subdirectory-specific direct routes only where supported and tested. Local development registration should target `plugins/gt`.

Keep `gt@andrew-skills` and existing marketplace registration commands if client evidence supports them. Do not infer that an existing installed copy automatically migrates merely because names stay unchanged; test marketplace refresh plus plugin update.

Update current authoring and maintenance guidance to the new paths. Preserve dated planning documents and prior evidence unless they purport to be current instructions; use a short supersession note when needed instead of rewriting history.

### 4. Release metadata and map review

Follow `CONTRIBUTING.md` relative to the same published base throughout draft iterations. Bump the plugin once for the bundle/configuration change, and affected skills according to real package changes. Rebuild helpers after editing maintained sources, not generated copies by hand.

Revisit map relationships, copy provenance, quotes, exclusions and path-based IDs. Preserve semantic relationships while updating actual paths. Review affected sources before changing review digests. Regenerate the saved map artifacts and run the read-only check. Ensure preview links still resolve. Do not add map/Help maintenance requirements to user-facing contribution skills.

### 5. Validate, review, and hand off uncommitted

Run the focused regression suite and all relevant existing checks. Inspect the final diff for accidental package changes, unexpected missing files, stale duplicate roots, and generated files omitted from the change. Record client and platform checks as passed, failed, or untested.

Leave implementation changes uncommitted for Andrew. Prepare a concise review summary and any genuinely outstanding decisions. A second repository is not the default fallback for a failed check.

## Required regression scenarios

| Scenario | Expected outcome |
| --- | --- |
| A valid pre-migration publication | Same catalog records and historical export as before. |
| First nested-layout publication | New plugin root resolves; one bundle patch; immutable baseline preserved. |
| Unchanged skill relocated | Same content identity, version, period, notes and original source record; no fabricated release. |
| Changed skill in migration | Proper new release metadata and new actual source path. |
| Later nested-layout edit | Ordinary version validation and exact export still work. |
| Removal, return, empty collection | Existing semantics survive the layout transition. |
| Prior catalog from before migration | Its preserved head/records still verify after migration. |
| Both layouts conflict or source is invalid | Explicit failure, with no silent collection merging or arbitrary filesystem traversal. |
| Bundled Restore run away from repo | Imports, hashes, launcher, guide and source verification are complete. |
| Old saved plan/cache and personal receipt | Compatible data preserves meaning; incompatible data fails explicitly; existing personal copies remain intact. |
| Untracked new nested skill | Working-tree validation and map inventory see it. |
| Broken/missing resource, symlink, unsafe mode | Existing rejection behavior remains; relocation does not relax package boundaries. |
| Builder rerun / check | Deterministic results; checks do not rewrite output. |
| Installation upgrade | Existing selected GT copy updates without duplicated skills or stale root content being mistaken for current content. |

Use the relevant command groups in `CONTRIBUTING.md` and `.github/workflows/validate.yml` as the authoritative suite. At minimum, cover structural validation, release snapshots/validation/catalog/reader, all export tests, affected package builders/tests, dependency map tests/checks, and the Caveman Python check if path assumptions change. Existing CI covers Windows/Linux and Node 22/24; report the actual locally available coverage.

Run every affected builder followed by its `--check`, and finish with `node scripts/validate.mjs` plus a release comparison against an independently verified current main. Passing `origin/main` twice does not establish remote freshness. Read-only Git access may need the owner's pre-authorized elevated sandbox exception.

Tests use disposable Git repositories in some fixtures. Review their operations against the owner's Git-write rules before running; do not assume permission to commit in fixtures if those rules apply. If explicit authorization is needed, complete non-writing validation and state the exact outstanding test operation. Never use a fixture as a route to modify the real repository history.

## Live client acceptance record

For each observed environment, record client/version, OS, marketplace source/ref, commands or UI actions, actual plugin root, installed files, cache files, and whether evidence comes from direct inspection or inference.

Primary routes are Copilot CLI marketplace installation and VS Code marketplace installation, including VS Code discovering a CLI-managed copy. Test Windows/WSL separately where supported; neither proves the other. Codex compatibility is an additional check if currently claimed or requested, not permission to widen this task into a new support matrix.

Test fresh installation, marketplace refresh/update of an existing root-layout install, discovery of representative instruction-only and bundled-helper skills, Status, Update, and historical Restore. Exercise helper reads/planning without creating issues or personal copies unless the test explicitly calls for and authorizes those writes. Start fresh chats where appropriate; a disk update does not prove an existing conversation reloaded instructions.

Report package cleanliness and cache cleanliness separately. Retention of a whole marketplace checkout is a documented possible limitation, not automatically a failed skill-discovery test. Avoid using symlinked local tests as evidence of remote installation contents. Do not manually prune the real installed cache to manufacture the desired result.

## Completion criteria

- One canonical GT package lives under `plugins/gt`, with one skill collection and a valid manifest; marketplace points to it.
- Runtime bundles are self-contained; maintenance tooling stays outside the plugin root.
- Identity, issue destinations, contribution ownership, and release history remain intact.
- Old and new layouts validate/export correctly, including a continuous history spanning the move.
- Current builders, documentation, map reviews/generated artifacts, tests and CI agree on the new source paths.
- Installation and upgrade behavior is evidenced for tested clients; cache/download limitations and deferred checks are explicit.
- No unintended root-layout installation promise, duplicate source tree, version reset, or security bypass was introduced.
- The owner receives uncommitted changes, actual verification results, and one linked change record.

## Authorization and boundaries

Read the active user/global instructions again in the implementation session. Andrew reserves commits, pushes, merges, rebases, tags, PR creation/merging, releases, and other branch/history writes for specific explicit authorization. This handoff grants none of those actions. Ordinary working-tree editing is permitted under an implementation request; completed work is expected to remain uncommitted.

Project issue management has standing authorization, including elevated CLI access for its known configuration/credential requirement. Check existing state before making an issue. This does not authorize repository settings or Git publication.

Security controls require stopping and reporting the exact block, then waiting for Andrew, except for applicable explicit standing exceptions. Do not change ACLs, disable controls, or switch toolchains to route around a block. Preserve these rules in any test plan involving real client profiles.

## Suggested skills for the receiving agent

Use these only when available and relevant; read their current instructions before applying them:

- `codebase-design` or `mattpocock-skills:codebase-design` for a small shared layout boundary across snapshot, catalog and validation code.
- `tdd` or `mattpocock-skills:tdd` for mixed-layout history and export regressions.
- `diagnosing-bugs` for an observed install/update or compatibility failure.
- `code-review` for the final compatibility, generated-package and history-preservation review.
- `handoff` for continuing context if implementation spans sessions.

Do not invoke a broad brainstorming workflow to reopen the selected one-repository direction unnecessarily. These suggestions do not authorize delegation, Git writes, installations, or unrelated refactoring.
