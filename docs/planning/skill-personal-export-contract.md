# Personal historical export — implementation contract

Historical decision record: [issue #79](https://github.com/AndrewGodlewsky/andrew-skills/issues/79) supersedes development release numbering, the two-field metadata schema and automatic baseline discovery. Current rules are in [CONTRIBUTING.md](../../CONTRIBUTING.md) and the [catalog contract](../release-catalog.md). Uncompleted client/WSL pilot acceptance remains open.

**Status: resolved; planning handoff, not implemented.** Canonical [Define historical skill export and personal copy handoff — resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/6#issuecomment-5689786832). Original answers: [Round 1](skill-archive-round-1.md), [Round 2](skill-archive-round-2.md), [Round 3](skill-archive-round-3.md).

**Implementation update (September 20, 2026):** The contract below preserves the
accepted planning text. Issue #14 now has a [fixed helper](../../exporter/README.md)
and Windows test coverage in the working tree. WSL acceptance remains outstanding;
the chat wrapper belongs to #11 and live client activation to #17. See the
[implementation evidence](../testing/exporter-results.md) for verified scope.

## Behavior and naming

- Native GT stays a whole-plugin installation/update. **Plugin skill names never gain version suffixes**: folder and frontmatter stay `grill-me`, for example. Source version/notes are separate metadata.
- Personal exports use `<source-name>-v<major>-<minor>-<patch>`: `grill-me-v1-2-0`. Folder and frontmatter names match. The intended personal command is `/grill-me-v1-2-0`; activation remains in deferred client tests.
- Export creates a personal copy and finishes. No archive plugin/registration, monitoring, synchronization, backups, managed replacement/removal or repository import.
- Existing destinations are never overwritten, even if apparently identical. One recognizable copy per repository/source name is the supported workflow. Users manage previous files before exporting again; the tool does not police later renames or copies.
- Native updates, retirement and returning-name version resets never change personal copies. Repeated version labels still require selection of an exact commit/path source record.

## Runtime and delivery

Node and Git are accepted **only for historical export**. Normal native GT installation/update and use of instruction skills acquire no exporter requirement.

Initial support targets: latest patched Node 22 or 24 LTS, recommending 24 for new setup, and Git 2.43 or later. These are implementation support choices, not claims that all other versions are incapable. Validate versions/capabilities before writing personal files. Future runtime majors require declared/tested support. [Node release status](https://nodejs.org/en/about/previous-releases)

Use tools installed in the target Windows or WSL environment. Missing prerequisites get a concise message referring setup to Andrew. No automatic tool installer, PowerShell 7 requirement, packaged-executable project or execution-policy changes.

Bundle the maintained JavaScript exporter/catalog reader and parser dependencies with the current restore skill. No runtime npm install or model-generated scripts. Record exporter/protocol versions separately from the source skill version. Freeze code and dependencies in a private run directory so a native update cannot mix versions during an operation.

The future API provides `list`, `plan`, `export` and read-only `inspect` operations. The skill and direct fallback call the same entry point using Node and explicit arguments. These are design names, not commands implemented today. Plans carry exact source, target and protocol and are revalidated before writing.

Direct recovery uses the exporter from the current installed bundle or a trusted complete repository checkout when chat cannot load. A missing/corrupt bundle is repaired through ordinary native setup or a trusted checkout; do not improvise retrieval code. Unknown schemas/protocols fail clearly. Invoke Git with argument arrays, never shell-interpolated inputs; use existing approved repository credentials without copying/logging secrets. Authentication/security blocks stop.

## Target and source

Default destination: `<target-home>/.copilot/skills/<personal-name>/`. Resolve the selected Windows or WSL home and show the absolute path. Clarify an ambiguous target rather than inferring VS Code's extension host from a terminal. No automatic cross-environment copies.

Both [CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) and [VS Code](https://code.visualstudio.com/docs/agent-customization/agent-skills) document this personal location. Clients sharing a home may discover it. Custom settings/trust/existing chats can affect visibility; file creation proves neither discovery nor loaded instructions. No settings edits or plugin registration are required.

Keep source cache/staging/run diagnostics outside discovery roots, for example `<target-home>/.copilot/gt-export-work/`. Reject symlink/reparse redirection, escaping/unsafe paths, reserved names and case collisions. Do not scan unrelated user folders. Recognizable export receipts for the same repository/source name, or canonical version-suffixed folders matching that source, block another export. Malformed matching candidates stop with their location; they are not adopted. Receipts are untrusted input, never authority for arbitrary writes.

Use the [publishing catalog](skill-publishing-notes.md) pinned to head H. Resolve one exact repository/full-commit/skill-path record, not a name/version dictionary. Verify membership, source tree and release version/notes. Read tracked Git blobs from an isolated exporter-owned object cache without checkout filters/newline conversion or touching the user's project. Incomplete history fails; a previously verified offline cache may be used only with explicit stale-head reporting.

Copy every tracked resource. Preserve executable semantics on supported targets and record source modes. Reject symlinks, submodules, LFS pointer-only payloads and unsupported external resources in the first implementation. Historical scripts are data during export, never executed.

## Naming adaptation and portability

Derive the full name; reject over-64-character names instead of truncating. Safely parse frontmatter, reject duplicate/ambiguous name fields, and change only its name field. Preserve the instruction body/resources and unchanged `release.yaml`. A parser unable to preserve that edit boundary stops rather than reformatting the whole skill. Folder/frontmatter matching and permitted characters follow [VS Code naming rules](https://code.visualstudio.com/docs/agent-customization/agent-skills#skillmd-file-format).

Verify original source bytes first, then calculate a separate installed-file manifest after the name adaptation. Never claim the renamed bytes equal the source tree.

Supported sources are self-contained skill folders. Check structural resource paths and recognizable plugin/self references, and require author review for semantic portability. Static scanning cannot prove arbitrary prose/scripts portable. Known hard-coded original invocations, plugin-relative dependencies or unsupported absolute paths must be reported before creation; do not blindly rewrite every reference or silently produce a known-broken copy. This constraint belongs in authoring and acceptance guidance.

## Source receipt

Reserve `.gt-export.json` inside the copy; a source using that reserved path is unsupported. A travelling receipt avoids a central managed registry.

```json
{
  "schemaVersion": 1,
  "exporterVersion": "<implementation version>",
  "operationId": "<unique run id>",
  "createdAt": "<UTC timestamp>",
  "source": {
    "repository": "https://github.com/AndrewGodlewsky/andrew-skills",
    "skill": "grill-me",
    "version": "1.2.0",
    "commit": "<full source commit>",
    "path": "skills/grill-me",
    "tree": "<verified Git tree identity>",
    "notes": "<original release note>"
  },
  "installed": {
    "name": "grill-me-v1-2-0",
    "transform": "frontmatter-name-v1",
    "files": [
      { "path": "SKILL.md", "sha256": "<adapted-file hash>", "sourceMode": "100644" }
    ]
  }
}
```

Actual manifests list every copied source file; the example has one entry only for illustration. Exclude the receipt itself to avoid self-hashing. Paths are relative, and the creation timestamp is not release order.

This records origin and initial adaptation, not ongoing verification or a signature. The later [status resolution](skill-status-prototype-notes.md) excludes personal copies and receipt inspection from `skills-status`. Explicit exporter recovery inspection remains separate; missing/edited/unknown provenance cannot be called verified. User edits never trigger repair, upload or monitoring.

## Create-only publication and recovery

1. **Preflight:** validate tools, target, plan and source. Take an exclusive lock keyed by repository/source name and target home, outside discovered skills. Another exporter reports busy; do not steal an uncertain stale lock.
2. **Stage:** retrieve, verify and adapt complete files plus receipt in a private non-discovered directory on the destination filesystem.
3. **Recheck:** while holding the lock, check destination/recognizable-copy/name collisions again. Occupied always means stop, not request overwrite permission.
4. **Reserve:** exclusively create the final directory, nonrecursively. Write resources and receipt with exclusive creation, leaving the root `SKILL.md` absent. Reject nested discoverable `SKILL.md` packages in this initial layout. Recheck directory identity against redirection.
5. **Publish last:** expose the fully written root instruction with an atomic no-replace operation only after all other files verify. A same-filesystem hard link from completed staged `SKILL.md` to final `SKILL.md` is the reference mechanism. It avoids streaming a partial instruction and refuses an occupied file. Never fall back to an overwrite-capable rename/copy. Unsupported filesystems stop before activation.
6. **Finish:** report created location/source/intended command and fresh-session guidance. Release the lock and remove only private staging names/data; never modify published files.

This uses [Node filesystem APIs](https://nodejs.org/docs/latest-v22.x/api/fs.html) as a design requiring Windows/WSL filesystem tests, not a tested guarantee. Locks protect cooperating exporters; no promise is made against a hostile process continuously mutating the same user's filesystem.

Before reservation, failure leaves no personal folder. Between reservation and publication, failure may leave an incomplete folder without root `SKILL.md`; preserve/report it and run diagnostics. A later export refuses that occupied path. Read-only inspection explains the state; user/Andrew handles partial-folder or stale-lock removal. No automatic recursive cleanup of personal content.

If publication succeeded but reporting crashed, inspection can recognize a completed copy without replaying writes. Never delete a published copy because client discovery fails. Cancellation before publication reports any partial path; after publication it reports completion rather than pretending nothing changed. No rollback/replacement service is introduced.

## Acceptance and downstream handoff

| Case | Required outcome |
| --- | --- |
| Native plugin update | Normal names, independent versions/notes, personal files unchanged; no exporter needed. |
| Historical multi-skill snapshot | Only selected complete folder exported, with controlled rename and receipt. |
| Unsafe name/path, unsupported dependency or failed integrity | Clear failure before publication; no guessed adaptation. |
| Source name/version reused after retirement | Exact source selected; an occupied personal destination still blocks. |
| Earlier personal export or unrelated/edited destination | Stop; no overwrite or automatic removal. |
| Two versions requested concurrently | One source lock; competing operation reports busy/collision. |
| Missing runtime/auth/history | Accurate error; existing content preserved. |
| Crash/cancel before or after publish point | Partial destination identified without root instruction, or completed copy recognized read-only. |
| User edits/renames/deletes copy | No background response or repository import. |
| Windows/WSL and shared-home clients | Explicit environment; no assumed client-exclusive visibility or synchronization. |
| Copy exists but client cannot discover it | File outcome separate from activation; keep files and provide client guidance. |
| Restore chat skill cannot load | Same fixed direct exporter through a trusted complete bundle/checkout. |

Implementation tests cover schema/identity, complete resources/modes, exact transformation, reserved paths, malformed receipts, locking/races, no-replace publication and crash recovery on supported Windows/WSL filesystems. Live client coexistence/invocation, resource loading and fresh/existing chats remain deferred by the owner; earlier evidence is still partial.

The [reviewed interaction](skill-interaction-prototype-notes.md) uses create-only personal export; [status](skill-status-prototype-notes.md) shows only installed GT versions/notes and excludes personal origins. Migration covers export-only Node/Git plus native personal discovery. The restore skill remains deferred implementation. No code, installations, settings or Git publishing are authorized by this planning document.
