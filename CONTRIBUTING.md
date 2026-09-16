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
5. Run `node scripts/validate.mjs` with Node.js 22 or newer.
6. Register the local plugin using the README instructions and invoke the skill
   in a fresh Copilot Chat. Check a representative input and expected behavior.
7. Submit your changes for team review. GitHub Actions runs the same validation.

Keep applicable attribution and license terms when importing someone else's
skill. Document adaptations in the README's provenance section.

## Publish an update

### Planned independent skill versions

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
new version. Draft PR edits do not each create a published release.

A skill absent from a published main snapshot restarts at `1.0.0` when restored,
even under the same name. A delete/re-add within one PR does not reset numbering
if no published snapshot omitted it. Historical name/version labels can repeat;
the catalog preserves their distinct commit/path sources. Existing archive copies
are not migrated. Reverting an active skill's behavior still requires a new version.

Increment the overall plugin patch version once per bundle change (including
skill additions/removals and plugin behavior/configuration), and keep root and
marketplace versions equal. A skill major bump does not require a plugin major
bump. Repository-only documentation changes need neither bump.

The intended authoring workflow includes the version and release information in
the reviewed change. CI should validate that each skill meets the release
requirements on pull requests to `main`. Agents authoring skills must account for
this convention; agents do not decide when to commit or publish.

**This publishing contract is not implemented yet.** The catalog derives exact
release records from preserved merge/squash snapshots on `main`; no handwritten
history ledger or bot commits are required. Andrew will
configure required merge checks later; do not change repository settings as part
of this planning work. See [the publishing notes](docs/planning/skill-publishing-notes.md)
and [reviewed answers](docs/planning/skill-publishing-round-3.md). Do not claim the
current validator already checks skill releases.

### Current plugin publishing procedure

For each published plugin update:

1. Increment `version` in the root `plugin.json` (for example,
   `0.1.3` to `0.1.4` for an instruction fix). Update the plugin entry in
   `.claude-plugin/marketplace.json` to the same version.
2. Validate and test the new behavior in VS Code.
3. The maintainer commits and pushes the reviewed changes to the default branch.

A GitHub release, package registry, or extension build is not required for this
plugin. Teammates update their entire `gt` installation using the
command or VS Code steps in the README. Do not edit an installed plugin cache
to contribute changes. This repository ships one plugin; all skills belong in
its root `skills/` folder.

## Validation scope

The validator checks the root plugin identity and version format, the marketplace
entry's root source and matching identity/version,
the supported manifest fields, skill names and descriptions, invocation flags,
nonempty instruction bodies, and inline relative Markdown resource links inside
skill folders. Each skill directory must contain a `SKILL.md` file.

It is a repository convention check, not a complete YAML/Markdown parser or an
official client conformance test. Use inline Markdown links for bundled resources;
reference-style links and runtime tool availability require manual review.
