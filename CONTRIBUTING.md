# Contributing skills

## Add or improve a skill

1. Create `skills/<skill-name>/SKILL.md`, or edit an existing
   skill. Use lowercase letters, numbers, and single hyphens for names.
2. Use this header, replacing the sample name and description:

   ```markdown
   ---
   name: explain-design
   description: Explain a proposed design and its tradeoffs. Use when reviewing a design.
   ---

   Write the procedure, expected outputs, and examples here.
   ```

   The name must match the directory. Describe when to use the skill as well as
   what it does. Add `disable-model-invocation: true` for manual-only skills.
   Keep header values on a single line. This repository's lightweight validator
   supports plain strings, JSON-style double-quoted strings, YAML single-quoted
   strings, and boolean flags; other YAML forms require extending the validator.

3. Put supporting files inside the skill folder and reference them with relative
   Markdown links, for example `[Template](templates/example.md)`. Keep skills
   self-contained: no personal absolute paths or undeclared skill dependencies.
4. Add the skill to the README skill table. Document any required tools or services.
5. Add or update `release.yaml` and the plugin versions as described below.
   Run the validation and release tests with Node.js 22 or newer.
6. Register the local plugin using the README instructions and invoke the skill
   in a fresh Copilot Chat. Check a representative input and expected behavior.
7. Submit your changes for team review. GitHub Actions runs the same validator
   against committed snapshots, including the prospective PR merge.

Keep applicable attribution and license terms when importing someone else's
skill. Document adaptations in the README's provenance section.

## Publish an update

### Independent skill versions

The owner selected **`release.yaml` beside each `SKILL.md`**, with exactly the
author-facing information needed here: **`version`** and a short **`notes`**
string. Notes should explain the user-visible change in one or two sentences;
no separate preparation backstory is required. The note is distinct from
`SKILL.md`'s discovery description and the overall plugin version.

Keep skill folders, frontmatter names and normal entry points inside GT free of
version suffixes. Only a personal historical export receives a name such as
`grill-me-v1-2-0`; source files in the repository keep the original name. Its
exporter verifies the source before adapting the personal copy. Package skill
resources with relative internal paths; known plugin-dependent or name-bound
sources must not be silently rewritten for export. See the
[create-only export contract](docs/planning/skill-personal-export-contract.md).

```yaml
version: "1.0.0"
notes: "Initial release of this skill."
```

The supported metadata format is deliberately small: exactly these two keys,
each with a nonempty quoted string on one physical line. Use JSON-style double
quotes, or YAML single quotes with an embedded apostrophe doubled. Blank lines
and full-line comments are allowed. Plain values, duplicate or unknown keys,
inline comments, multiline scalars, collections, tags and anchors are rejected.
Versions use three integers without leading zeroes, prerelease or build suffixes.
Keep notes short and focused on the user-visible change.

Start new and returning skills at **`1.0.0`**. Numbered history begins with the first
metadata-complete release; do not invent versions for older unversioned snapshots.
Use patch increments for fixes/clarifications preserving documented usage, minor
increments for compatible additions, and major increments for incompatible
changes to commands, inputs, required tools or documented workflow/output promises.
Use the largest applicable increment and reset lower components accordingly.
Authors/agents propose the category; review verifies its meaning. CI checks
structure and consistency without a model deciding semantic compatibility.
Changing one skill must not assign new versions to unchanged skills. Every
published skill correction, including a typo or release-note correction, gets a
new version. A note-only correction requires the next patch version. Draft PR
edits do not each create a published release.

A skill absent from a published main snapshot restarts at `1.0.0` when restored,
even under the same name. A delete/re-add within one PR does not reset numbering
if no published snapshot omitted it. Historical name/version labels can repeat;
the catalog preserves their distinct commit/path sources. Existing archive copies
are not migrated. Reverting an active skill's behavior still requires a new version.

Increment the overall plugin patch version once per bundle change (including
skill additions/removals and plugin behavior/configuration), and keep root and
marketplace versions equal. A skill major bump does not require a plugin major
bump. Repository-only documentation changes need neither bump.

Include the skill version, notes and matching plugin versions in the reviewed
change. The validator compares the complete skill folder, including resources
and Git file modes. A version-only or metadata-formatting-only edit is rejected;
it is not a substantive release. Keep draft version bumps relative to the same
published base, rather than incrementing on every draft edit.

Release metadata and adjacent-snapshot validation are implemented. The historical
catalog, exports, restore skill and enhanced update/status reporting remain future
work. The catalog will enforce history-wide rules over preserved merge/squash
snapshots on `main`; these checks do not yet prove historical integrity or prevent
a reset after an earlier invalid published snapshot. See
[the publishing notes](docs/planning/skill-publishing-notes.md) and
[reviewed answers](docs/planning/skill-publishing-round-3.md).

### Plugin publishing procedure

For each published plugin update:

1. Update each changed skill's metadata using the rules above. For a bundle
   change, increment `version` in root `plugin.json` by one patch and update
   `.claude-plugin/marketplace.json` to match. Leave both unchanged for docs only.
2. Run the checks below and test changed skill behavior in VS Code.
3. The maintainer publishes through a validated PR using merge or squash into
   `main`. The accepted merged snapshot is the release boundary; intermediate
   draft commits are not separate releases. The maintainer controls all commits,
   pushes, PR creation and merges.

A GitHub release, package registry, or extension build is not required for this
plugin. Teammates update their entire `gt` installation using the
command or VS Code steps in the README. Do not edit an installed plugin cache
to contribute changes. This repository ships one plugin; all skills belong in
its root `skills/` folder.

## Run validation

These commands require Node.js 22 or newer. Git is also required for release
comparisons and the snapshot tests; no package installation is needed.

```sh
node --test scripts/release-validation.test.mjs scripts/release-snapshots.test.mjs
node scripts/validate.mjs
node scripts/validate.mjs --base origin/main --current-main origin/main
```

The plain command checks the working files, including required metadata. Adding
`--base` checks release transitions against that published ref and requires it
to be an ancestor of the current checkout. Ensure `origin/main` is up to date
before using it: the local command does not contact GitHub. `--current-main`
accepts an independently obtained current-main commit ID or local ref and rejects
a different comparison base. Passing the same local ref twice cannot establish
that it matches the remote.

For a committed candidate, add `--candidate <commit-or-ref>`. This reads Git's
stored bytes and file modes without checking out files or writing Git objects.
Working-file comparison includes untracked files inside skill folders and
accounts for Git line-ending conversion. It rejects active Git clean filters;
use committed snapshots for repositories that require those filters.

The **Validate skills and releases** CI job runs these tests and checks the
prospective PR merge against its first parent and GitHub's current `main`. It
fails if that base is stale or `main` advances during validation. Pushes to
`main` validate the published snapshot against its first parent. A manual run
on another ref compares it with current `main`. The job is read-only.

Andrew will configure this job as a required check, with an up-to-date branch
requirement, later. A passing run cannot prevent `main` advancing afterward;
repository settings must enforce revalidation before merging. No required-check
settings are changed by this implementation.

## Validation scope

The validator checks the root plugin identity and version format, the marketplace
entry's root source and matching identity/version,
the supported manifest fields, skill names and descriptions, invocation flags,
nonempty instruction bodies, and inline relative Markdown resource links inside
skill folders. Each skill directory must contain `SKILL.md` and `release.yaml`.
Release comparisons check the complete initial `1.0.0` baseline, exact allowed
skill version steps, unchanged skills, retirement/return, and one matching plugin
patch bump per bundle change. An empty collection after retiring all skills is
allowed. Review still chooses whether a change is a patch, minor or major release.

It is a repository convention check, not a complete YAML/Markdown parser or an
official client conformance test. Use inline Markdown links for bundled resources;
reference-style links and runtime tool availability require manual review.
