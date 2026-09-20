# Release catalog reader API

The catalog is derived from preserved Git history. It does not write commits, tags, a release ledger, caches, or installations. Maintainers and CI use Node 22+ and Git; ordinary native GT installation does not acquire a Node prerequisite. `skills-status` reads installed files only and does not call this reader. Historical export consumes this API in its separate implementation.

From a complete repository checkout:

```sh
node scripts/release-catalog-reader.mjs --ref origin/main
```

This prints one complete JSON result or exits nonzero without printing a partial catalog. It reads local Git objects; it does not fetch, authenticate, install prerequisites or assume that a plugin cache contains history. `origin/main` is a local ref, so callers must establish its freshness separately. CLI `--repository` can supply the credential-free repository identity when the checkout does not have `origin`. HTTPS and SSH URL origins are supported; GitHub's `git@github.com:owner/repository.git` form is normalized to HTTPS. A trailing `.git` is removed. Preserve this normalized identity in provenance.

## Format 1

`readReleaseCatalog(root, { ref = 'origin/main', repository, previousCatalog } = {})`, exported by `scripts/release-catalog-reader.mjs`, returns:

```json
{
  "formatVersion": 1,
  "repository": "https://github.com/AndrewGodlewsky/andrew-skills",
  "headCommit": "<full pinned commit ID>",
  "baselineCommit": "<full first metadata-baseline commit ID>",
  "records": [
    {
      "skill": "grill-me",
      "version": "1.0.0",
      "notes": "Initial release.",
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

`active` contains record objects, with the same fields as `records`; the string above is explanatory. `baselineCommit` is `null` and both arrays are empty when preserved history has no complete baseline yet. This is known pre-system history, not a history-access failure. There is no automatic backfill.

Records are ordered by first-parent publication, then by skill name as UTF-8 bytes. Active records are ordered by skill name. A record keeps its original source commit and tree when later commits change other skills or repository documentation. Removal preserves its records and removes it from `active`. A published return starts at `1.0.0`, including after an empty-collection interval. Name plus version can therefore match several records. A consumer must resolve the exact repository, source commit and folder; it must never silently choose between repeated labels or sort all periods by maximum version.

The reader resolves the requested ref exactly once, then only reads that full head and its complete first-parent lineage, oldest first. Merge/squash publication is the accepted boundary. Feature-branch intermediate commits are not publications. Rebase-and-merge and arbitrary multi-commit direct-push boundaries cannot be reconstructed as one PR from this model. The owner must preserve history and configure the accepted merge methods and required validation check.

The first snapshot with at least one active skill, valid metadata for every active skill and all versions `1.0.0` establishes the baseline. Earlier snapshots remain unnumbered. From the baseline onward, missing/invalid metadata fails; empty collections do not reset the baseline. All later release and container transitions use the same rules as author validation. Unsupported skill paths, symlinks and submodules are rejected rather than followed.

## Complete-folder integrity

`sourceTree` is the actual Git object ID for the selected folder, not a fabricated tree ID. `contentIdentity` independently covers the complete folder's relative tracked paths, regular file modes and exact stored blob bytes, including `release.yaml` and every resource. Checkout line endings are not the source bytes.

Format 1 uses SHA-256 over this unambiguous byte stream:

1. ASCII `gt-skill-folder-v1` followed by one NUL byte.
2. For each regular file, sorted by the unsigned lexicographic order of its relative UTF-8 path bytes: encode the relative path, six-character mode (`100644` or `100755`), and exact content bytes, in that order.
3. Each of those three fields is encoded as its byte length in ASCII decimal, a colon, and the field bytes, with no other separator. All fields use UTF-8 except blob content, which is uninterpreted bytes.

The result is lowercase hex prefixed by `sha256:`. `skillContentIdentity(folderFiles)` in `scripts/release-catalog.mjs` exposes this encoding for exporter verification. Its input is a `Map` from skill-relative paths to `{ mode, data: Buffer }`. It never executes resources. The exporter still owns its stricter portability, personal-name adaptation, destination and collision checks.

## Validation, retry and failures

`buildReleaseCatalog({ repository, headCommit, snapshots, previousCatalog })` is the pure format-1 builder in `scripts/release-catalog.mjs`. `snapshots` is a synchronous iterable of complete `{ commit, firstParent, files, skillTrees? }` objects, oldest first, beginning at the root (`firstParent: null`) and ending exactly at `headCommit`. `files` uses repository-relative paths mapped to `{ mode, data: Buffer }`; `skillTrees`, when supplied, maps skill names to actual tree IDs. The Git reader always supplies trees. Pure fixtures or equivalent source adapters may omit them, producing records without `sourceTree`; the SHA-256 identity is still mandatory. Consumers requiring Git trees must reject such records rather than invent IDs. Supplied blob identity hints never override the builder's exact-byte comparison.

All results are returned after validation completes. A missing object, shallow or grafted history, broken lineage, invalid post-baseline snapshot, or generation exception fails the whole read. To recognize and ignore unsupported pre-system snapshots, the history reader reads link blobs as inert bytes and represents unsupported non-blob entries such as submodules with an unsupported mode and empty placeholder. It never follows links or loads submodule content. Such entries cannot establish a baseline or pass validation after it; placeholders are never claimed as complete verified sources. Normal candidate reads retain strict mode rejection. Replacement refs are disabled for Git reads; automatic lazy fetching and terminal credential prompts are disabled. Existing installed or personal files remain untouched. An unavailable history read is not an empty catalog and does not justify guessing a replacement release.

Supplying a previously validated catalog compares its entire prior result against a rebuilt prefix at its head. A missing prior head, changed repository/format, or conflicting exact mapping fails. This detects rewritten or truncated known history. Without a prior trusted catalog or source receipt, a reader cannot prove that an otherwise coherent repository history replaced a previously observed one. No registry or withdrawal service is implied. Callers should retain trusted provenance when they need that comparison.

`validateCatalogCandidate(catalog, baseFiles, candidateFiles, { baseCommit, currentMainCommit })` binds the full published catalog to the candidate comparison. It verifies the catalog head and active source identities against the base, rejects stale main, prevents a post-baseline metadata reset, and then applies normal skill/container transition rules. A prospective candidate is not added to published catalog records before Git has created its accepted main snapshot. CI should build the catalog at current main, validate the prospective state, and recheck main freshness; required-check and up-to-date-branch enforcement remain owner settings.

Retrying the same pinned head produces the same records without a publishing transaction. A later read can choose a newer head. No claim is made that generating a catalog or passing fixtures proves a live client can activate an exported copy; those checks belong to the owner pilot.
