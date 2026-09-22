# Release catalog reader API

The catalog is derived from preserved Git history. It does not write commits, tags, a release ledger, caches, or installations. Maintainers and CI use Node 22+ and Git; ordinary native GT installation does not acquire a Node prerequisite. `skills-status` reads installed files only and does not call this reader. Historical export consumes this API in its separate implementation.

From a complete repository checkout:

```sh
node scripts/release-catalog-reader.mjs --ref origin/main
```

This prints one complete JSON result or exits nonzero without printing a partial catalog. It reads local Git objects; it does not fetch, authenticate, install prerequisites or assume that a plugin cache contains history. `origin/main` is a local ref, so callers must establish its freshness separately. CLI `--repository` can supply the credential-free repository identity when the checkout does not have `origin`. HTTPS and SSH URL origins are supported; GitHub's `git@github.com:owner/repository.git` form is normalized to HTTPS. A trailing `.git` is removed. Preserve this normalized identity in provenance.

## Format 2

`readReleaseCatalog(root, { ref = 'origin/main', repository, previousCatalog } = {})`, exported by `scripts/release-catalog-reader.mjs`, returns:

```json
{
  "formatVersion": 2,
  "repository": "https://github.com/AndrewGodlewsky/andrew-skills",
  "headCommit": "<full pinned commit ID>",
  "baselineCommit": "<accepted fresh-baseline publication commit ID>",
  "records": [
    {
      "skill": "grill-me",
      "version": "1.0.0",
      "notes": "Explain a supplied plan.",
      "period": 1,
      "history": [],
      "repository": "https://github.com/AndrewGodlewsky/andrew-skills",
      "sourceCommit": "<full first-publication commit ID>",
      "skillPath": "skills/grill-me",
      "sourceTree": "<actual Git tree object ID at that folder>",
      "contentIdentity": "sha256:<complete-folder digest>"
    }
  ],
  "active": ["<the complete exact record for each skill present at headCommit>"]
}
```

`active` contains record objects, with the same fields as `records`; the string above is explanatory. `period` and `history` match that exact publication's release.yaml; history excludes its current entry. Requests pinned before the explicit boundary fail with a development-release-unavailable error. No development release is backfilled or silently reinterpreted.

Records are ordered by first-parent publication, then by skill name as UTF-8 bytes. Active records are ordered by skill name. A record keeps its original source commit and tree when later commits change other skills or repository documentation. Removal preserves its records and removes it from `active`. A published return starts at `1.0.0` in the next consecutive period, including after an empty-collection interval. Its installed file retains every earlier post-baseline entry, including the last current entry of the preceding period. A renamed skill starts a new name/period-1 history; the retired name's catalog is preserved. Name plus version can therefore match several records. A consumer must resolve the exact repository, source commit and folder; it must never silently choose between repeated labels or sort all periods by maximum version.

The reader resolves the requested ref exactly once, then only reads that full head and its complete first-parent lineage, oldest first. Merge/squash publication is the accepted boundary. Feature-branch intermediate commits are not publications. Rebase-and-merge and arbitrary multi-commit direct-push boundaries cannot be reconstructed as one PR from this model. The owner must preserve history and configure the accepted merge methods and required validation check.

Root `release-baseline.json` declares the one-time boundary as canonical JSON:

```json
{
  "formatVersion": 2,
  "parentCommit": "fb21f2304041e078e0b85b7d4d662c6b151fbfa6"
}
```

The file uses exactly that key order, two-space JSON formatting and a final newline
(CRLF is normalized). Duplicate/unknown keys and nonregular/executable markers fail.
The first first-parent snapshot containing the marker must have its declared
parent as its actual first parent. Validate the entire cutover atomically against
that parent's plugin version and active skill names: all skills remain and reset
to 1.0.0/period 1/empty history, with one synchronized plugin patch. The baseline
includes all finished helper and instruction changes. Older development versions,
even metadata-complete 1.0.0 snapshots, are excluded. The marker cannot change or
vanish after publication. Empty collections cannot reestablish it.

Before the accepted commit exists, candidate validation uses the declaration's
parent as its comparison base, verifies current-main equality and full ancestry,
and applies the same all-skill checks. A merge or squash publication supplies the
future accepted source commit; draft branch commits are never catalog releases.
If main advances before publication, update the draft declaration to the new
base and revalidate the complete migration. This is not allowed after acceptance.

The reader's internal `migrationParent` option is used only to validate a proposed
cutover: if no boundary exists, it must equal the pinned head and returns no
release records. It is not a CLI/export option or a release-validation bypass.
`validateCatalogCandidate` still requires an exact matching new marker and all
atomic migration checks. Without it, pre-boundary requests fail explicitly.

From the baseline onward, missing/invalid metadata fails. Every changed skill
must append exactly the preceding current entry and advance one valid version
step; unchanged files retain the same record. History is additionally compared
with every actual publication for that name, including retired periods. This
rejects invented/missing/reordered/revised releases, not just malformed YAML.
Note-only corrections require a patch and retain the old published note.
Unsupported paths, symlinks and submodules fail rather than being followed.

## Complete-folder integrity

`sourceTree` is the actual Git object ID for the selected folder, not a fabricated tree ID. `contentIdentity` independently covers the complete folder's relative tracked paths, regular file modes and exact stored blob bytes, including `release.yaml` and every resource. Checkout line endings are not the source bytes.

Format 2 retains the original folder encoding: SHA-256 over this unambiguous byte stream:

1. ASCII `gt-skill-folder-v1` followed by one NUL byte.
2. For each regular file, sorted by the unsigned lexicographic order of its relative UTF-8 path bytes: encode the relative path, six-character mode (`100644` or `100755`), and exact content bytes, in that order.
3. Each of those three fields is encoded as its byte length in ASCII decimal, a colon, and the field bytes, with no other separator. All fields use UTF-8 except blob content, which is uninterpreted bytes.

The result is lowercase hex prefixed by `sha256:`. `skillContentIdentity(folderFiles)` in `scripts/release-catalog.mjs` exposes this encoding for exporter verification. Its input is a `Map` from skill-relative paths to `{ mode, data: Buffer }`. It never executes resources. The exporter still owns its stricter portability, personal-name adaptation, destination and collision checks.

## Validation, retry and failures

`buildReleaseCatalog({ repository, headCommit, snapshots, previousCatalog, migrationParent })` is the pure format-2 builder in `scripts/release-catalog.mjs`. `snapshots` is a synchronous iterable of complete `{ commit, firstParent, files, skillTrees? }` objects, oldest first, beginning at the root (`firstParent: null`) and ending exactly at `headCommit`. `files` uses repository-relative paths mapped to `{ mode, data: Buffer }`; `skillTrees`, when supplied, maps skill names to actual tree IDs. The Git reader always supplies trees. Pure fixtures or equivalent source adapters may omit them, producing records without `sourceTree`; the SHA-256 identity is still mandatory. Consumers requiring Git trees must reject such records rather than invent IDs. Supplied blob identity hints never override the builder's exact-byte comparison.

All results are returned after validation completes. A missing object, shallow or grafted history, broken lineage, invalid post-baseline snapshot, or generation exception fails the whole read. To recognize and ignore unsupported pre-system snapshots, the history reader reads link blobs as inert bytes and represents unsupported non-blob entries such as submodules with an unsupported mode and empty placeholder. It never follows links or loads submodule content. Such entries cannot pass cutover or post-baseline validation; placeholders are never claimed as complete verified sources. Normal candidate reads retain strict mode rejection. Replacement refs are disabled for Git reads; automatic lazy fetching and terminal credential prompts are disabled. Existing installed or personal files remain untouched. An unavailable history read is not an empty catalog and does not justify guessing a replacement release.

Development format-1 catalogs are rejected explicitly. Protocol/helper version 2 and receipt schema 2 likewise prevent old plans, caches and receipts being treated as new releases. The metadata history never creates source records by attaching old labels to current bytes.

Supplying a previously validated catalog compares its entire prior result against a rebuilt prefix at its head. A missing prior head, changed repository/format, or conflicting exact mapping fails. This detects rewritten or truncated known history. Without a prior trusted catalog or source receipt, a reader cannot prove that an otherwise coherent repository history replaced a previously observed one. No registry or withdrawal service is implied. Callers should retain trusted provenance when they need that comparison.

`validateCatalogCandidate(catalog, baseFiles, candidateFiles, { baseCommit, currentMainCommit })` binds the full published catalog to the candidate comparison. It verifies the catalog head and active source identities against the base, rejects stale main, prevents a post-baseline metadata reset, and then applies normal skill/container transition rules. A prospective candidate is not added to published catalog records before Git has created its accepted main snapshot. CI should build the catalog at current main, validate the prospective state, and recheck main freshness; required-check and up-to-date-branch enforcement remain owner settings.

Retrying the same pinned head produces the same records without a publishing transaction. A later read can choose a newer head. No claim is made that generating a catalog or passing fixtures proves a live client can activate an exported copy; those checks belong to the owner pilot.
