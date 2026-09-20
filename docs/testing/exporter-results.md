# Historical exporter implementation evidence

Date: September 20, 2026. Change record:
[issue #14](https://github.com/AndrewGodlewsky/andrew-skills/issues/14).
Published comparison base: `701a95f63a6e92c3e4ed57c3d6cdf0edccd1864e`.
Implementation is in the working tree, uncommitted and unpublished.

## Result

The fixed [exporter bundle](../../exporter/README.md) implements `list`, `plan`,
`export` and read-only `inspect`. All JavaScript dependencies are bundled;
there is no npm installation or generated per-request implementation. Code is
manifest-verified and frozen per operation. The restore chat wrapper remains
issue #11; this complete bundle is its delivery input. Live client acceptance
remains issue #17. Issue #14 remains open for WSL filesystem acceptance.

The representative request selected the first published `grill-me` record by
full commit from an isolated catalog cache, reviewed a bound plan, and exported
it under a temporary personal home. Expected: one complete version-suffixed
folder with only the header name changed, a travelling receipt, no overwrite,
and no claim of client activation. Observed: complete publication, matching
installed receipt manifest, `activation: not-verified`; read-only inspection
created no work directory when run against a fresh home.

## Executed checks

Host: Windows, NTFS temporary fixture homes, Node `24.15.0`, Git
`2.55.0.windows.3`. No real personal skill directories were modified. Fixtures
copied existing Git objects into private temporary object databases; no test
created a commit or changed a repository branch or remote.

| Check | Observed result |
| --- | --- |
| Full release/catalog/architecture/export suite | 58 passed, 0 failed, 0 skipped. |
| `node scripts/build-exporter.mjs --check` | Generated bundle exactly matches maintained sources. |
| `node scripts/validate.mjs` | GT `0.1.6`, three existing skills valid. |
| Release comparison against published base | Passed; plugin `0.1.6`, no changed/added/removed skills. |
| `git diff --check` | Passed. |
| Public GitHub retrieval through bundled `list` | Pinned `701a95f63a6e92c3e4ed57c3d6cdf0edccd1864e`, five release records, private object cache verified. |
| Complete direct CLI sequence | List, exact plan, create and inspect passed; missing portability attestation rejected. |
| Original/adapted bytes | CRLF/BOM, binary resources, executable source modes, unchanged release metadata and separate manifests covered. Historical scripts were copied, not executed. |
| Path/header/dependency rejection | Unsafe/reserved/nested/case-colliding names, links/submodules, LFS pointers, ambiguous headers and recognized outside/plugin/self dependencies rejected. |
| Legitimate resources | `.link-probe` resource, Markdown fragments and percent-encoded filenames preserved/supported. |
| Existing copies | Identical, renamed, edited/malformed-receipt and unrelated occupied destinations preserved and refused. |
| Windows reparse protection | A real fixture junction redirecting `.copilot` was rejected before writes through it. |
| Competing versions | A real child process held the source lock; another version was refused as busy. |
| Forced process termination | Termination after locking, resource writes and publication preserved locks; inspection reported not-created, incomplete and complete respectively. |
| Cancellation and no-replace publication | Pre/post-publication exceptions retained accurate outcomes; a competing root instruction was not overwritten. |
| Corrupt bundle | Changed module bytes rejected before module execution. |

Suite command:

```text
node --test scripts/release-validation.test.mjs scripts/release-snapshots.test.mjs scripts/skill-architecture.test.mjs scripts/release-catalog.test.mjs scripts/release-catalog-reader.test.mjs scripts/export-source.test.mjs scripts/export-filesystem.test.mjs scripts/export-protocol.test.mjs scripts/export-cli.test.mjs
```

The suite runs real filesystem checks only in Windows or WSL. Generic Linux
does not count as WSL. New CI jobs target Windows with Node 22 and 24; those
remote jobs have not run for this unpublished change. Node 22 was not locally
tested. The helper checks supported Node majors/Git minimums, not live registry
patch freshness. Setup documentation calls for the latest patched release.

## Reviews and compatibility exception

Independent standards and specification reviews found no unresolved findings
after corrections for SSH origin normalization, dependency scanning, probe
name isolation and valid Markdown fragments/encoded paths. Regression tests
cover each correction.

Historical exported headers may omit invocation flags that current authors
must now declare. Published `grill-me` 1.0.0 predates its explicit user-invocable
flag; inserting one during export would violate the name-only adaptation.
The helper preserves such omissions, validates supplied flag types and rejects
an explicitly inaccessible invocation combination. This is a documented export
compatibility exception, not a relaxation of the current authoring validator.
Historical client behavior still requires the owner pilot.

## Outstanding acceptance

Elevated WSL enumeration succeeded after the owner explicitly authorized retry
of the earlier `Wsl/EnumerateDistros/Service/E_ACCESSDENIED` error. It returned
only `docker-desktop`. No supported development distribution was available;
Docker's internal distribution was not used and no distribution was installed.

Run the exporter suite in the intended WSL distribution/filesystem before
closing issue #14. In particular, verify executable semantics, same-filesystem
hard-link publication, competing exporters, redirection rejection and crash
recovery. Windows results do not establish these WSL guarantees. Live Copilot
discovery, resource invocation and fresh/existing-chat behavior remain #17.

Static dependency checks plus explicit author review establish eligibility for
this conservative exporter, not proof of arbitrary program/prose portability.
Receipt consistency does not authenticate provenance or certify client
activation. The helper never repairs or deletes a personal copy.
