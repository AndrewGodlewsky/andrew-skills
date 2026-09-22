# Skill publishing — accepted contract

Historical decision record: [issue #79](https://github.com/AndrewGodlewsky/andrew-skills/issues/79) supersedes development release numbering, the two-field metadata schema and automatic baseline discovery. Current rules are in [CONTRIBUTING.md](../../CONTRIBUTING.md) and the [catalog contract](../release-catalog.md). Uncompleted client/WSL pilot acceptance remains open.

> **Execution update:** metadata validation and the [catalog reader](../release-catalog.md)
> now implement this contract. [CONTRIBUTING.md](../../CONTRIBUTING.md) describes
> current authoring and checks. The original planning snapshots below remain
> historical context; exporter and native-client pilot work remain pending.

> **Consumer handoff update:** [Create-only personal copies](skill-personal-copy-direction.md) now replace the archive-plugin destination referenced below. The publishing/catalog/numbering contract remains accepted. Verify exact source bytes before any personal-name adaptation, then record the adapted result separately; published source identities are unchanged.

Issue: [Define automatic skill versioning and immutable release history — resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/5#issuecomment-5675205215).

**Status: publishing decisions settled on September 15, 2026.** This is an implementation handoff, not a shipped pipeline. Original answers remain in [Round 1](skill-publishing-round-1.md), [Round 2](skill-publishing-round-2.md) and [Round 3](skill-publishing-round-3.md). The owner rejected continued numbering for returning names: they restart at `1.0.0`.

## Accepted author-facing requirements

- Each skill has `release.yaml` beside `SKILL.md`, with `version` and a brief user-facing `notes` string. No mandatory preparation backstory or testing-note field.
- Skill versions use `x.y.z`. New and returning skills start at `1.0.0`; initial adoption also begins the numbered history. The owner's “1.0” is expressed in the already agreed three-part format. No automatic backfill of unversioned repository history.
- Patch: compatible fix/clarification. Minor: compatible addition. Major: incompatible change to documented inputs, commands, tool requirements or workflow/output promises. Reset lower components and use the largest applicable category.
- Authors or authoring agents supply version/notes in the reviewed change. Review checks meaning; deterministic CI checks structure and consistency. No model call is needed to classify a diff during CI.
- Validation must happen before PRs merge to `main`. Andrew will configure enforcement later; no protection settings or reviewer quota are part of this work.
- Updates to `main` are release-processing events. Unchanged skills keep their versions; repository-documentation edits alone do not invent changed skills.
- Every correction to published skill content requires a new version, including typo, resource and release-note corrections. Draft edits do not each create a release.
- Each bundle change advances the plugin patch once, independently of the skill bump categories. Root manifest and marketplace versions match; additions/removals and plugin behavior/configuration count, repository-only docs do not.
- The native GT plugin updates as a whole; historical copies are explicitly exported to `gt-archive`. No managed pins, selective main updates or new consumer Node prerequisite.

Accepted author file example:

```yaml
version: "1.0.0"
notes: "Initial release of this skill."
```

The [README](../../README.md) and [contributor guide](../../CONTRIBUTING.md) document the accepted conventions as planned. The existing validator/workflow still do not enforce them.

## Production baseline

| File | Current implementation |
| --- | --- |
| [Plugin manifest](../../plugin.json) / [marketplace](../../.claude-plugin/marketplace.json) | One root GT plugin, matching container version `0.1.3`, source `./`. |
| [Validator](../../scripts/validate.mjs) | Existing manifest, skill instruction and resource checks; no release-history validation. |
| [Workflow](../../.github/workflows/validate.yml) | Read-only validation on push, PR and manual dispatch; Node 22 for maintainers/CI. |
| [Contribution process](../../CONTRIBUTING.md) | Existing manual plugin bump and maintainer publishing, alongside clearly labeled future guidance. |

No release files have been added under skills, no CI code changed and no repository rules configured.

## Returning names and exact identity

A removed skill reintroduced under the same name starts again at `1.0.0`, even if its files are identical. Removal must be visible in a published main snapshot; deleting/re-adding within one PR does not reset an active skill. A rename creates a new named skill at `1.0.0` and retires the old name.

The owner accepts repeated name/version labels and requires no remediation for existing archives. Historical records can remain exact using the already required repository origin, full source commit and folder path. No additional author-maintained identifier is needed. Within an uninterrupted publication period under a name, numbers advance and cannot be reassigned to different content; after a published removal, they reset on return.

The catalog must be a list of exact records, not a dictionary keyed only by name/version. A historical lookup by those labels can return multiple matches; downstream selection must resolve one exact record rather than silently choose. Existing archives retain their files/provenance; unidentified legacy copies stay unknown. Latest follows publication order: a returning `1.0.0` can be newer than the earlier `2.3.0`. Archive naming, collisions and the simplest presentation of repeated labels belong to downstream design.

## Catalog source and release boundary

Use Git history as the authoritative published source. Each accepted main merge/squash result is one complete release snapshot. Git's first-parent traversal follows the main integration line without treating feature-branch intermediate commits as separate releases. GitHub's rebase-and-merge places individual commits onto the target history; supporting that as one release per PR would require a different boundary record. The accepted initial design supports merge/squash publication. [Git traversal](https://git-scm.com/docs/git-rev-list), [merge methods](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github)

This boundary relies on main being updated through the accepted PR process. No claim is made that a history scan can reconstruct arbitrary multi-commit direct-push event boundaries. The enforcement handoff must include the chosen merge methods and validation of the prospective merged state against current main. Andrew will configure that later.

### Deterministic construction

1. Resolve the chosen main head to one full commit ID, H. Hold H fixed for the entire operation.
2. Traverse the complete first-parent lineage to H, oldest first. The baseline is the first main snapshot with at least one active skill and valid release metadata for all active skills, all at `1.0.0`. Rollout introduces that metadata together. Record the baseline's full commit. Ignore pre-system history; missing/invalid active metadata after the baseline is an error, not a reset. An empty collection later does not erase the baseline or history.
3. Enumerate complete skill folders and metadata. A previously absent name begins a new publication period at `1.0.0`; a continuously present name retains identical files/version or introduces the next increment. For each new release, record its **first published main snapshot**, repository origin, full commit ID, folder path, version, notes and complete-folder integrity identity. A returning `1.0.0` gets a distinct record tied to the return snapshot.
4. If a release persists in later main snapshots, verify its complete files match and keep the original source mapping. Changes to another skill or top-level docs must not repoint old records.
5. Keep historical entries when a skill disappears. Separately derive active skills from H. Repeated name/version labels across removal/return are valid, not conflicting exact source identities.
6. Return the complete catalog only after validation. An incomplete history fetch or conflicting version mapping cannot be reported as a complete catalog.

The integrity identity covers tracked relative paths, file modes and exact Git blob content, including `release.yaml` and resources. Implementation must use a documented deterministic encoding or tree-object identity, preserve Git's stored bytes, and reject unsupported links/path escapes. Archive/working-tree newline conversion must not masquerade as verified exact content.

Illustrative **generated** record (not the author file):

```yaml
skill: grill-me
version: "1.1.0"
repository: "https://github.com/AndrewGodlewsky/andrew-skills"
sourceCommit: "<full commit ID of the first published main snapshot>"
skillPath: "skills/grill-me"
contentIdentity: "<verified skill tree identity>"
notes: "Added an optional budget question."
```

The commit field is populated after Git has created the commit. Nothing embeds its own future ID. Multiple skill records may point to the same snapshot while selecting different folders.

### Storage, caching and ownership

A catalog is generated structured data; it does not need another handwritten file or a bot committing to main. Build it when history/status/export needs it, optionally caching by repository origin, head H, baseline and catalog-format version. The format version describes the reader's data format, not a new author release counter. Incremental extension is valid only after checking ancestry and reusing validated prior records. Detect rewritten history or conflicting exact source mappings rather than silently accepting them.

The exporter implementation chooses how it obtains the required Git objects or equivalent API data. A plugin cache must not be assumed to contain complete history. Incomplete access is reported as unavailable; existing installed/archive content stays usable. Main installed versions and notes can still be read locally, while unknown historical availability stays unknown. Runtime/delivery belongs to the archive issue.

Optional CI output can aid diagnostics but expiring Actions artifacts are not the authoritative archive ledger. No extra branch, hosted registry, release tag, bot commit or per-user main-plugin manager is required.

## CI contract

One named required validation job should expose stable success/failure for later owner configuration. Its checks cover:

- Every active skill has valid instructions/resources and parseable release metadata. Reject duplicate YAML keys and unsupported structures; version and notes must be strings, and notes must be nonempty. One- to two-sentence usefulness is reviewed, not inferred from punctuation counting.
- Stable three-part versions with numeric ordering within an uninterrupted publication period, no accidental lexical comparison or exact source-identity reuse. New and returning names start at `1.0.0`; resetting an active name without a published absence is invalid.
- Compare the prospective merge with the current main snapshot and full published catalog. Changed release files/resources require a higher version. Do not bump untouched skills because another changed.
- A new increment follows one of the agreed patch/minor/major steps from the latest release in the current uninterrupted publication period. CI can validate the step but cannot prove the category is truthful.
- A version-only bookkeeping edit does not count as a substantive new skill release. Genuine note-only corrections get a patch version.
- Existing exact source records cannot be rewritten to different content. Reverting an active skill to earlier behavior requires a new version. A return after published removal starts at `1.0.0` as specified above.
- Additions/removals and plugin runtime/configuration changes require one container patch increment; manifest and marketplace versions match. Repository-only docs/CI changes do not assign skill versions. Current runtime inputs are complete skill folders and root plugin configuration; marketplace delivery changes also require a container bump. Root README, contributor docs and CI scripts are repository-only. Future shared runtime inputs must be declared and their affected skills identified for versioning rather than hidden from change detection.
- Removing a skill retires it in the active view while preserving history. Renaming is a new named skill plus retirement of the old name; migration redirects are not silently introduced.
- Parallel PRs proposing the same next version must revalidate against current main before either remaining PR merges. A check against an outdated base is insufficient.

Do not run branch PR content in a privileged publishing context. The validation and catalog builder need read access, not a token for writing history. Configuration of the required-check gate is a later owner action, not an effect of adding workflow YAML.

## Publication, failures and retention

Publication moves from **draft** (editable PR) to **validated candidate** (checks against current main) to **published snapshot** (accepted merge/squash on main). Failed checks leave a draft; a stale base requires revalidation. Catalog materialization is a derived read, not a second publication transaction. It can be retried at the same H without changing published content.

| Situation | Required outcome |
| --- | --- |
| No-op or repository-docs-only main update | No skill/container bump; existing exact record mappings remain stable. |
| One skill changes `1.0.0` to `1.0.1` | Reviewed files/version/note ship together; other skills retain versions; one container patch increment. |
| Plugin behavior/configuration changes | Container patch advances; skill versions advance where documented skill behavior changes. |
| PR has missing note or unchanged version for changed content | Fail before merge with the skill/path and required correction. |
| Valid reviewed PR merges | Main immediately contains complete current-release files/version/notes; its known commit can be indexed without a follow-up metadata write. |
| Multiple skills change in one merge | Independent new records with the same source commit; unchanged records remain stable. |
| Export one older skill from a multi-skill snapshot | Select one exact record and retrieve/verify only its complete folder and note; main and unrelated archive files remain unchanged. |
| Post-merge catalog generation fails | Main metadata is still present; history lookup is unavailable until retry. Do not advertise a partial catalog or substitute a guessed version. |
| Job or lookup reruns at the same H | Same records and mappings; no new version or publishing loop. |
| A newer PR merges during a lookup | Finish against pinned H; a later lookup can advance. Do not mix source heads. |
| Previously published note/resource corrected | New release under the immutable-content rule; previous snapshot preserved. |
| Removed skill returns | Starts at `1.0.0`; historical same-name/version records remain distinct; archives untouched. |
| All skills removed, then a skill returns | Original baseline/history survive; returning skill starts at `1.0.0`. |
| Main history is rewritten or a commit is unavailable | Fail affected historical verification; preserve current/archive files and report the actual availability. |

Preserving main ancestry retains referenced published snapshots as reachable source history. This is not a guarantee against repository deletion or deliberate history rewriting. Record preserve-history requirements in the owner setup/migration handoff.

Ordinary removal retires a skill; it does not withdraw historical availability. The initial publishing design has no withdrawal service or denylist and must not claim to detect an advisory it cannot observe. Unavailable/unverifiable sources cannot be exported. If exceptional withdrawal is needed later, define its explicit signal/policy before offering that feature; a known withdrawn source must not be silently substituted, and its exact source identity must not be rewritten. Existing user-owned archives are not remotely revoked, deleted or migrated. The archive issue owns the failure interaction.

No historical branch maintenance is required. Active latest-only support, native GT installation and existing GT archive copies remain as already agreed.

## Completion and downstream handoff

- [Define historical skill export and personal copy handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/6): consume exact generated records, handle repeated name/version matches, retain provenance and design runtime/collision/recovery behavior. No migration solely because a name returns.
- [Prototype native GT updates and personal skill restoration](https://github.com/AndrewGodlewsky/andrew-skills/issues/7): whole-bundle changes/notes, retirement/return and selection without guessing between repeated labels.
- [Prototype skill version status and concise release notes](https://github.com/AndrewGodlewsky/andrew-skills/issues/8): local metadata, exact source comparisons and publication order across resets; preserve stale/unknown states.
- [Define migration and acceptance checks for the existing skills hub](https://github.com/AndrewGodlewsky/andrew-skills/issues/9): baseline rollout, merge/check setup, history preservation and acceptance scenarios; live compatibility checks stay deferred.
- [Create the restore skill for historical personal copies](https://github.com/AndrewGodlewsky/andrew-skills/issues/11): deferred implementation consumes this contract after exporter/interaction design; do not begin it now.

No live client tests, Git publishing, branch configuration or restore-skill implementation are required to resolve this planning decision. Consumer archive choices remain with the existing downstream issues.

