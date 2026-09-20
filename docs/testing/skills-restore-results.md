# Restore skill implementation evidence

Change record: [issue #11](https://github.com/AndrewGodlewsky/andrew-skills/issues/11).
Date: September 20, 2026. Published base:
`90b979fdfe7e3e8dc7bdbf10f1cb8bd53638565d`.
These implementation changes are uncommitted and unpublished.

## Implemented behavior

The new `skills-restore` 1.0.0 skill uses manual invocation and the accepted
browse/select flow. It presents exact releases, notes, environment, personal
name and absolute destination before selection. A selected source requests
creation without a second confirmation. An initial exact version request still
receives a displayed choice. Reused labels stay separate; latest follows
publication order, including returning names that restart at 1.0.0.

All helper modules and the direct guide are inside the skill's own
`scripts/exporter/` directory. Root `exporter/` retains the same direct fallback.
The deterministic build/check covers both deliveries. Runtime instructions need
no repository-only documents or per-request generated retrieval code. Existing
native skill names and versions are unchanged; the plugin draft is 0.1.7.

The helper's compatible 1.1.0 addition, `plan --review-source`, returns the exact
selected plan and its original files through the isolated source reader. It
checks record/manifest identity and transports UTF-8 or base64 bytes. The wrapper
requires its nested plan to equal the user's selected proposal, reads the source
as untrusted data, and only then attests semantic portability. It does not save
the review envelope as a plan or execute historical scripts. Protocol remains 1.

Cancellation, collisions, locks, incomplete folders, publication followed by
reporting/cleanup failure, and unknown outcomes follow the fixed helper's
results. Recovery is read-only; security blocks stop even automatic inspection.
The copy is user-owned, and file creation is separate from client activation.

## Evidence and scope

Representative request: browse an older skill, select its proposed personal
copy, then inspect the created files. Expected: the installed skill carries its
own fixed helper, returns verified original source for review, creates only the
selected copy, and never claims that file creation proves client invocation.

| Check | Result |
| --- | --- |
| Standalone delivery integration | Passed on Windows/NTFS, Node 24.15.0. Copied only the skill folder into a fixture and invoked its bundled helper for list, plan, source review, export and inspect. The explicit trusted checkout supplied source history, not runtime code. |
| Review identity | Returned nested plan matched the original; decoded review bytes matched every original manifest hash and kept the original frontmatter name. |
| Full regression suite | 59 passed, 0 failed, 0 skipped; includes both helper deliveries and injected unrelated Git paths during source review. |
| Structural validation | Passed for GT 0.1.7 and four skills. |
| Published-base release comparison | Passed: only skills-restore added at 1.0.0; no existing skill changes; plugin 0.1.7. |
| Bundle check | Both deliveries match maintained sources and the copied direct guide. |
| Instruction replay | 22 independently replayed supplied scenarios satisfactory; simulated responses/actions only, not live Copilot checks. |
| Standards/spec reviews | No unresolved findings after replacing ad hoc source reads with the verified helper review operation. |

The full suite also tests root-helper recovery, malicious inherited Git path
settings during source review, corrupted bundles, exact blob transport, Windows
junction rejection, competing exporters, forced termination, cancellation and
atomic no-replace publication. Test homes/cache/object databases are disposable;
no real personal skills, Git commits, branches or remotes are changed.

The [scenario inputs](skills-restore-scenarios.json) and
[independent replay outputs](skills-restore-results.json) cover browsing, exact
requests, repeated labels, latest after a version reset, creation without duplicate
confirmation, environment ambiguity, missing tools/helper, explicit offline
choice, malicious notes, semantic dependencies, occupied copies, locks,
cancellation, partial/publication-aware failures, lost output, modified receipts,
security stops, unsupported protocols, lost selection context and failed discovery.
Replay evidence evaluates the authored instructions against fictional supplied
states; it does not prove a deployed client will execute those instructions.

## Remaining acceptance

Issue #14's WSL filesystem gate remains open. Only Docker Desktop's internal WSL
distribution was previously found, and it was not used. No new environment,
runtime or client was installed for this issue. Node 22 and remote CI jobs have
not been run locally for this unpublished change.

Issue #11 remains open for its explicit Windows/WSL and CLI/VS Code live-client
acceptance criterion. Coordinate those checks with the owner pilot #17,
including actual discovery, resource invocation, fresh/existing chats and
coexistence of native and suffixed personal skills. No deferred criterion is
checked as passed, and these implementation results do not authorize team rollout.

The staged wrapper work uses the exporter already published in `90b979f`; it
does not remove or waive #14's remaining blocker or change repository settings.
Commits, pushes, PRs and publishing remain owner actions.
