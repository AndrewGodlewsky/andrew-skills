# Repository rehome handoff

This is a maintainer handoff for making an independently branded copy of this
repository under another GitHub account or host. It describes the checkout as
inspected on 2026-09-22; search the new checkout again before editing. It is a
map and migration checklist, not an instruction to publish changes.

## Decide the new identity first

Record these values in the new project's change record before an agent edits
code. They are separate identities; changing a Git remote changes none of the
constants in the installed skills.

| Value | Current value | Used for |
| --- | --- | --- |
| GitHub web host and API host | `github.com`, `api.github.com` | Issue links, issue transport, credential selection, release origin |
| Repository owner/name | `AndrewGodlewsky/andrew-skills` | Fixed issue target, exporter source, manifests, install instructions |
| Numeric repository ID | `1364861754` | Issue helper's repository identity check; obtain the **new** ID from the new repository |
| Marketplace name | `andrew-skills` | `.claude-plugin/marketplace.json`, registration/update/install commands |
| Plugin name | `gt` | `plugin.json`, marketplace entry, commands such as `/gt:grill-me` |
| Human-facing collection name and maintainer | `GT`, `Andrew Godlewsky` | Skill descriptions, Help, docs, ownership/support text |
| Published branch | `main` | CI triggers, catalog reader, exporter, local validation examples |

Choose whether the new collection keeps the `gt` plugin name and whether it
keeps the existing Git history. If the new host is GitHub Enterprise, establish
its actual web/API URLs and verify that the target Copilot clients can register
and install a marketplace from it. GitHub.com commands and endpoints in this
checkout are not evidence of Enterprise compatibility.

## GT names on disk and in commands

There is **no tracked `gt/` directory** in this checkout. The repository's
plugin root is the checkout root, and its 18 source packages live in `skills/`.
The `gt` value in `plugin.json` and the marketplace entry is the plugin identity;
clients can use it to label or store an installed copy. Verify the target
client's actual installation path rather than renaming a managed cache by hand.
Renaming the local checkout directory alone does not rename the plugin.

If the new plugin name changes, review these less obvious GT-bound paths and
tokens as well as `/gt:...` commands and `gt@andrew-skills` examples:

| Source | GT-bound name or behavior |
| --- | --- |
| [`scripts/export-filesystem.mjs`](scripts/export-filesystem.mjs), [`scripts/export-source.mjs`](scripts/export-source.mjs) | `.copilot/gt-export-work/` and `.gt-export.json` are exporter work/receipt names; the source checker also detects `/gt:<skill>` as a nonportable dependency. Coordinate any rename with existing plans and receipts. |
| [`scripts/create-skills/install.mjs`](scripts/create-skills/install.mjs) | `.gt-create-skills-*.tmp` is a temporary installation filename. |
| [`scripts/skill-map.mjs`](scripts/skill-map.mjs) | The dependency candidate scanner recognizes `/gt:` and `$gt:`. A new command prefix needs a scanner and test update so the map still finds real calls. |
| [`scripts/issue-submission/runtime.mjs`](scripts/issue-submission/runtime.mjs), [`scripts/issue-submission/contract.mjs`](scripts/issue-submission/contract.mjs), [`scripts/review-handoff.mjs`](scripts/review-handoff.mjs) | HTTP User-Agent `gt-create-issue` and request `scope: "gt"` identify this collection in the submission flow. Change caller, helper, docs and tests together if the scope changes. |
| [`scripts/release-catalog.mjs`](scripts/release-catalog.mjs) | `gt-skill-folder-v1` is the content-hash domain; changing it alters release identities, so handle it through the chosen history policy. |

There are also GT-prefixed **documentation paths**, including
[`docs/gt-diagnostic-scope-design.md`](docs/gt-diagnostic-scope-design.md),
[`docs/planning/gt-onboarding-design.md`](docs/planning/gt-onboarding-design.md),
[`docs/prototypes/gt-troubleshooting-guide.md`](docs/prototypes/gt-troubleshooting-guide.md),
[`docs/research/gt-installation-diagnostic-evidence.md`](docs/research/gt-installation-diagnostic-evidence.md),
and [`docs/testing/gt-help/`](docs/testing/gt-help). Rename a path only if the
new project wants its documents renamed; repair inbound links at the same time.
These path names do not set the installed plugin name.

## Where the current identity lives

**Published package and user entry points**

| Location | Rehome work |
| --- | --- |
| [`plugin.json`](plugin.json) and [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) | Set plugin, marketplace, publisher and repository fields consistently. Keep the marketplace entry's `source: "./"` if the plugin remains at the repository root. Their plugin versions must match. |
| [`install.ps1`](install.ps1) and [`README.md`](README.md) | Replace marketplace registration, `plugin@marketplace` installation, update/uninstall examples, command names, repository URLs, local path examples, and old-name migration advice with tested instructions for the new environment. An old installed `gt` copy will not turn into the new plugin through a Git remote change. |
| [`skills/help/SKILL.md`](skills/help/SKILL.md), [`skills/skills-update/SKILL.md`](skills/skills-update/SKILL.md), [`skills/skills-status/references/installation-target.md`](skills/skills-status/references/installation-target.md), [`skills/skills-update/references/installation-target.md`](skills/skills-update/references/installation-target.md) | Update answers, target selection, source/provenance checks, marketplace refresh and plugin update commands. Review all skill descriptions and cross-skill instructions for the collection name and invocation prefix. |
| [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CONTEXT.md`](CONTEXT.md), [`AGENTS.md`](AGENTS.md) | Adapt maintainer/authoring language and links. `AGENTS.md` contains Andrew-specific ownership and GitHub-issue permissions: a new owner must establish their own authority; the copied text does not grant it. Machine-level instructions outside this repository are not cloned. |

**Operations that remain bound to Andrew's repository after a clone**

| Maintained source | What must be reviewed |
| --- | --- |
| [`scripts/issue-submission/contract.mjs`](scripts/issue-submission/contract.mjs), [`api.mjs`](scripts/issue-submission/api.mjs), [`runtime.mjs`](scripts/issue-submission/runtime.mjs) | The helper pins the repository full name **and numeric ID**, web/API URL shapes, `gh auth token --hostname github.com`, HTTP host, and accepted routes. Its request envelope uses `scope: "gt"`. Retarget these together, then update the helper's offline tests. Keep its repository and response identity checks; a textual URL swap is insufficient, especially on Enterprise. |
| [`skills/create-issue/SKILL.md`](skills/create-issue/SKILL.md) and [`references/helper.md`](skills/create-issue/references/helper.md) | Replace the fixed destination, new-issue link, documented host/ID, relevance and approval language. Inspect [`references/labels.md`](skills/create-issue/references/labels.md) against labels actually created in the new repository. This skill can be invoked from another workspace, so a cloned old package would still submit to Andrew's repository. |
| [`scripts/review-handoff.mjs`](scripts/review-handoff.mjs), [`skills/create-skills/SKILL.md`](skills/create-skills/SKILL.md), [`skills/skill-steal/SKILL.md`](skills/skill-steal/SKILL.md), [`skills/skill-tweak/SKILL.md`](skills/skill-tweak/SKILL.md), their submission references and [`skills/skill-tweak/templates/issue.md`](skills/skill-tweak/templates/issue.md) | Retarget generated issue/comment links, descriptions and the three calling workflows. The new issue numbers and labels are independent of the old repository. |
| [`scripts/export-source.mjs`](scripts/export-source.mjs), [`export-protocol.mjs`](scripts/export-protocol.mjs), [`release-catalog-reader.mjs`](scripts/release-catalog-reader.mjs) | Historical Restore pins the repository URL, verifies checkout origin, reads `origin/main` or remote `refs/heads/main`, and stores the source identity in plans/cache/receipts. Review host normalization and Git URL forms; the reader explicitly normalizes GitHub.com's scp-style SSH URL. Do not reinterpret old receipts as new-repository receipts. |

**Repository validation, CI and derived files**

| Location | Rehome work |
| --- | --- |
| [`scripts/validate.mjs`](scripts/validate.mjs), [`scripts/release-validation.mjs`](scripts/release-validation.mjs), [`scripts/release-catalog.mjs`](scripts/release-catalog.mjs) | Validators require the literal `gt` plugin and `andrew-skills` marketplace in current and historical snapshots. Release rules compare full skill folders and manifest configuration. Review the catalog's `gt-skill-folder-v1` hash domain as a format identifier, not a casual marketing string. See the history decision below. |
| [`release-baseline.json`](release-baseline.json), [`docs/release-catalog.md`](docs/release-catalog.md) | The marker names an exact parent commit from this repository's one-time release baseline. It is immutable within preserved history. Rework the release model deliberately if starting new history; do not search/replace its commit ID. |
| [`.github/workflows/validate.yml`](.github/workflows/validate.yml) | It assumes `main`, GitHub Actions, `GITHUB_REPOSITORY`, `github.token`, `gh api`, Node 22/24 and the current validation scripts. Confirm new host runner/API support and configure required checks, branch protection, Actions access and repository permissions in the new GitHub settings; those settings are not in the clone. |
| [`scripts/*.test.mjs`](scripts) and [`scripts/fixtures/releases.mjs`](scripts/fixtures/releases.mjs) | Fixtures assert the old marketplace, plugin, origin, issue target/ID, `api.github.com`, and `scope: "gt"`. Update expected new behavior while retaining tests that prove foreign repositories or responses are rejected. |
| [`docs/skill-map/relationships.json`](docs/skill-map/relationships.json), [`map.json`](docs/skill-map/map.json), [`map.md`](docs/skill-map/map.md) | When skill/source text changes, review quoted dependency evidence, exclusions and each affected review digest. Then regenerate the two map outputs. Do not refresh review digests merely to silence validation. |

The README also embeds [`docs/skill-map/overview.svg`](docs/skill-map/overview.svg),
a saved overview with GT wording. Review it as a separate visual artifact; the
map builder above writes JSON and Markdown, not this SVG.

The maintained code is in `scripts/`. Several installed packages contain
generated copies: `skills/create-issue/scripts/`, `skills/create-skills/scripts/`
and `references/package-rules.md`, `skills/skill-tweak/scripts/`,
`skills/skill-steal/scripts/`, root `exporter/`, and
`skills/skills-restore/scripts/exporter/`. Edit their maintained sources and
guidance, then run the corresponding `scripts/build-*.mjs` builders. The
builders' `--check` mode verifies copies without rewriting them. Check
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the current release and dependency-map
procedure before changing any skill.

**State that a Git clone does not carry:** the new remote URL and its credentials,
GitHub repository ID, issues and labels, branch rules/required checks, Actions
availability and settings, Copilot marketplace registrations, installed plugin
copies, client profile settings, and the new owner's permissions. Recreate or
verify each in the target environment. Old issue links and issue numbers do not
become links to matching records in the new repository.

## Resolve release history before rebranding

The release catalog walks **complete first-parent Git history** from the root,
locates the baseline declared by `release-baseline.json`, validates each later
published snapshot, and gives each release an exact commit/tree identity. A
shallow clone is insufficient. Current validation requires the old manifest
names even when reading old snapshots. Merely changing validators to require
new names makes preserved historical snapshots fail. Merely allowing the old
names is also a product decision: historical Restore could then offer original
GT skills containing links and workflows aimed at Andrew's repository.

Choose and implement one explicit policy:

1. **Preserve full history.** Keep the existing baseline marker and old commits.
   Add an intentional old/new identity transition to release validation and the
   catalog, decide how old releases are attributed and whether Restore exposes
   them, and test snapshots on both sides of the transition. Do not silently
   relabel old content as a new branded release. Current skill edits require
   each affected `release.yaml` to append its prior release and advance one
   version step; a bundle/config change advances the plugin by one patch with
   both manifests synchronized.
2. **Start an independent publication history.** Copy the permitted source into
   a new repository history and establish a new baseline/release policy before
   enabling catalog validation or Restore. The current marker's parent commit
   will not describe that history, and old commit-pinned exports cannot be
   offered as releases of the new repository. Preserve upstream attribution and
   licenses separately. Decide how new versions start; do not present an
   unverified copied `release.yaml` history as new publications.

Repository-only documentation edits need no plugin or skill version bump under
the current rules. Changing a distributed skill or its generated resources
does. A bulk rename is a real skill change, not a release-metadata shortcut.

## What to preserve or review, not blindly replace

- The repository slug `andrew-skills` appears throughout documentation, not
  just in the manifest and installer. Current explanations and examples include
  [`README.md`](README.md), [`CONTRIBUTING.md`](CONTRIBUTING.md),
  [`docs/release-catalog.md`](docs/release-catalog.md), and the proposed
  [`GT troubleshooting guide`](docs/prototypes/gt-troubleshooting-guide.md).
  Update live setup instructions, example repository identities and support
  text to the new name/host. Search bare `andrew-skills`, the full
  `AndrewGodlewsky/andrew-skills` slug, URL forms and local checkout paths;
  editing only GitHub links will miss marketplace commands and prose.
- [`docs/planning/`](docs/planning), [`docs/research/`](docs/research),
  [`docs/testing/`](docs/testing), [`CONTEXT.md`](CONTEXT.md) and provenance
  sections of the README contain old decision links, results, machine paths and
  issue numbers. Those are historical evidence, not new-repository issues.
  Keep accurate source attribution or write a new decision record; only use a
  new issue link after that issue exists in the new repository.
- The root [`Andrew skills plan .docx`](Andrew%20skills%20plan%20.docx) is a
  separate binary planning artifact. Text search will not inventory its contents;
  inspect or retire it deliberately if the new repository carries it forward.
- Imported skills have upstream licenses and attribution in their `LICENSE`,
  `assets/` and README files. Retain applicable upstream notices when
  redistributing adapted material. Review any new author/publisher claim
  separately from upstream authorship.
- The exporter uses `.gt-export.json`, `gt-export-work` and a
  `gt-skill-folder-v1` content-hash domain. These are receipt, workspace and
  format identifiers. Renaming them affects recognition of existing personal
  copies, cache integrity or content IDs; decide compatibility before changing.
- Absolute paths in research artifacts and the README local-install example
  describe this machine. Replace active setup examples for the new environment;
  do not present old observed test output as a new validation result.

## Suggested order for the receiving agent

1. Record the seven target identities above, the target default branch, the
   history policy, and whether the new host is GitHub.com or Enterprise.
   Inspect the new repository read-only to obtain its numeric ID, issue/label
   availability and actual web/API URL forms. Confirm the destination and
   current authentication before testing any write-capable workflow.
2. Search the complete checkout, including hidden files, before editing. From
   its root: `rg -n -i --hidden -g '!.git/**' -e 'AndrewGodlewsky' -e 'andrew-skills' -e '1364861754' -e 'api.github.com' -e 'github.com' -e '/gt:' -e 'gt@' -e 'gt-export' -e 'gt-create' -e 'GT' .`.
   Classify each match as active code, installed instruction, current guidance,
   fixture, historical record, external documentation or format identifier.
   Search again after edits, including the generated bundles.
3. Update package manifests and active instructions. Retarget the issue helper
   as one identity/transport change; retarget Restore/catalog separately.
   Adapt `AGENTS.md` and maintainer policy to the new owner's explicit rules.
4. Follow [`CONTRIBUTING.md`](CONTRIBUTING.md): update affected `release.yaml`
   files and plugin version as required by the chosen history policy; review
   [`skills/help/SKILL.md`](skills/help/SKILL.md) for affected advice; maintain
   `docs/skill-map/relationships.json` and its generated map with real semantic
   review.
5. Rebuild packages with `node scripts/build-issue-submission.mjs`,
   `node scripts/build-create-skills.mjs`, `node scripts/build-skill-tweak.mjs`,
   `node scripts/build-skill-steal.mjs`, and `node scripts/build-exporter.mjs`
   after their sources change. Run each again with `--check`.
6. Run `node scripts/validate.mjs`, the relevant `node --test` suites in
   [`CONTRIBUTING.md`](CONTRIBUTING.md#run-validation), and
   `node scripts/build-skill-map.mjs --check`. Once history is valid, run the
   release comparison against the new current `main` and test a complete
   catalog and an exact historical Restore plan. Offline tests do not prove
   client discovery, authentication or live issue routing.
7. In a fresh client installation, verify marketplace registration, the shown
   publisher/source, one skill invocation, update/status target selection, and
   issue-helper read-only preflight against the **new** repository ID. Only test
   issue creation when separately authorized for the new destination. Confirm
   CI and required-check behavior on the new host before publication.

The current repository's Git write rules leave commits, pushes, PRs and merges
to its owner unless that exact action is requested. The receiving agent must
follow the new environment's actual authorization and security controls.
