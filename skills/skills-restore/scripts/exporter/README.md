# Historical personal export

This fixed Node helper creates one personal copy from an exact published GT
source. It never updates, overwrites, removes, registers or monitors that copy.
The `skills-restore` chat skill bundles the same helper under its own
`scripts/exporter/` directory. Invoke `/gt:skills-restore` in a client that has
discovered the skill to browse and select a proposed personal copy. Keep every
helper file together. The same direct entry point also works from a trusted
complete repository checkout; its root `exporter/` remains available for recovery.

Use the latest patched Node 22 or 24 LTS (24 recommended) and Git 2.43 or later
installed in the selected Windows or WSL environment. The helper checks the
Node major, Git minimum and filesystem capabilities; it does not contact a
runtime registry to certify patch freshness. Ask Andrew about missing tools or
security blocks. It installs nothing and never changes execution policy.
Instruction-only native GT skills do not need these tools.

## Commands

Run `node <absolute-path-to-this-bundle>/run.mjs` with one operation below.
Every operation requires `--environment windows|wsl --home <absolute-home>`.
Use the intended user's home in that environment. WSL commands must actually
run inside the selected distribution. UNC/extended Windows paths and redirected
homes are unsupported. There is no automatic Windows/WSL copy or target guess.

| Operation | Additional arguments | Result |
| --- | --- | --- |
| `list` | None, or `--checkout <trusted-complete-checkout>`, or `--offline-cache <cache-path>` | Catalog records, pinned head, cache path and freshness. |
| `plan` | `--cache <cache-path> --skill <source-name> --commit <full-source-commit>`; optional `--review-source` | Exact source/target/manifests. With review requested, returns an envelope containing `plan` and verified original `files`; save only its nested plan for export. |
| `export` | `--plan <saved-plan.json> --portability-reviewed` | Created location, source, intended personal command and publication state. |
| `inspect` | `--name <source-name-vM-m-p>` | Read-only publication, receipt consistency and lock status. |

`list` normally retrieves the public repository's main head. A checkout uses
its existing `origin/main`, without fetching or changing that project. Its
remote freshness is unverified. An explicitly selected offline cache is
reverified against its saved catalog and reports that its head may be stale.
There is no silent fallback to stale data after a network/authentication error.
All subsequent plan/export operations bind that cached head, which may have
advanced remotely; list again to select a new head.

For example in Windows PowerShell, replacing the bundle/home placeholders:

```powershell
node '<bundle>\run.mjs' list --environment windows --home '<home>'
node '<bundle>\run.mjs' plan --environment windows --home '<home>' --cache '<returned-cache>' --skill grill-me --commit '<full-source-commit>' | Set-Content -Encoding utf8 '<plan.json>'
node '<bundle>\run.mjs' export --environment windows --home '<home>' --plan '<plan.json>' --portability-reviewed
node '<bundle>\run.mjs' inspect --environment windows --home '<home>' --name grill-me-v1-0-0
```

Before supplying `--portability-reviewed`, use `plan --review-source` with the
same arguments to review the complete selected source, including scripts and
resources. Its nested plan must match the selected plan. Text files are UTF-8;
binary data is base64. The fixed helper verifies original bytes and isolates Git
environment settings; do not substitute ad hoc retrieval scripts. The flag is
the caller's semantic portability attestation, not a result of static checks.
Planning checks recognizable dependencies but cannot prove arbitrary code or
prose independent of its original name, plugin, working directory or tools.
Historical scripts are copied as data and are never executed by the helper.

The default copy is `<home>/.copilot/skills/<source>-vM-m-p/`. Only the supported
frontmatter name line is adapted; other instruction bytes, BOM/line endings,
resources and release metadata remain unchanged. Windows records source modes
without claiming POSIX permission bits; WSL checks executable semantics.
Full names over 64 characters fail without truncation. Source paths use a
conservative printable ASCII subset, at most 100 characters per component and
220 total. Final and staged absolute paths are limited to 240 on Windows and
4000 on WSL. Unsupported paths, links/reparse points, nested `SKILL.md`, reserved
`.gt-export.json`, case collisions, submodules, LFS pointers and recognized
outside/plugin/self dependencies stop the operation.

Historical compatibility exception: older published headers may omit invocation
flags that the current authoring guide now requires (for example `grill-me`
1.0.0). Export preserves those omissions rather than inserting new behavior.
Present flags must be booleans and an explicitly inaccessible combination is
rejected. Current authored skills still require all four fields. Client handling
of historical omissions remains part of the owner pilot.

## Publication and recovery

The helper keeps verified object caches, frozen code, locks and diagnostic runs
under `<home>/.copilot/gt-export-work/`, outside skill discovery. Each mutating
operation validates the bundle manifest, snapshots its modules in memory and
freezes those exact modules in a private code directory. Inspection uses only
the verified in-memory snapshot and creates no files. Unknown versions or an
incomplete/changing bundle stop; recover the complete bundle through ordinary
native setup or a trusted checkout, without inventing replacement scripts.

An exclusive source/home lock covers every version of that source. Any occupied
canonical destination or recognizable prior copy blocks creation, including
identical, edited or incomplete copies. Renamed copies with matching receipts
also block. Collision checks examine only immediate personal skill packages.
An unreadable, redirected or malformed receipt candidate stops conservatively
because its source cannot be established. Receipts never authorize writes.

The exporter stages files on the destination filesystem, exclusively reserves
the final directory, and writes resources and the receipt before exposing the
root instructions. Publication uses an atomic no-replace hard link from the
completed staged `SKILL.md`; there is no copy/rename fallback. Existing content
is preserved, including a competing instruction created just before publication.
Locks protect cooperating exporters, not a hostile process continuously
changing the same user's filesystem.

| Observed state | Meaning and next step |
| --- | --- |
| `not-created` | No destination exists. A crash may still have left a private lock/run. |
| `incomplete` | The destination exists without root instructions. Keep it and its diagnostics; ask Andrew to inspect before any manual cleanup. |
| `complete`, `matches-receipt` | All declared installed bytes match the receipt. This can recognize publication after a reporting crash. |
| `unverified`, `modified` or `unverifiable` | Existing contents do not establish a complete consistent export. Inspection performs no repair. |
| Lock present | Ownership/liveness is unknown. The helper never steals or removes an uncertain lock. |

Normal completion releases its own lock and removes only its known private
stage files. Failed runs and incomplete/published personal folders are retained.
Security blocks stop further work and leave evidence; ask Andrew before
proceeding. There is no automatic recursive cleanup of personal content, rollback,
replacement, backup, repository import or response to later edits/deletion.

The travelling schema-1 receipt records exporter version, operation/time, exact
source identity and separate original/adapted manifests, excluding itself.
`matches-receipt` proves internal consistency only. The receipt is editable,
is not a signature and does not authenticate provenance; inspection labels it
`unverified-receipt`. Protocol and exporter versions are independent of the
historical source version. Plans are completely revalidated before creation.

Created files do not prove client discovery or loaded instructions. Start a
fresh Copilot session and try the reported personal command. Clients sharing
the same home may see the same files; settings and trust can affect discovery.
Keep a completed copy if activation fails. Live client behavior belongs to the
owner pilot, and Windows/WSL test status is recorded in issue #14.

## Maintainer build

In a maintainer checkout, maintain modules under root `scripts/` and this guide
at root `exporter/README.md`, then run `node scripts/build-exporter.mjs`. The build
produces both root and skill-contained helper copies from the same sources.
`node scripts/build-exporter.mjs --check` checks both deliveries, including the
skill's copied guide. Runtime use requires no maintainer checkout or npm install.
Helper/guide changes now change the restore skill's complete package: update its
release metadata and the plugin patch, without changing unrelated skill versions.
