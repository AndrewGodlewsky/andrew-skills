# Create-issue package — implementation evidence

Change record: [Package the model-invocable create-issue skill](https://github.com/AndrewGodlewsky/andrew-skills/issues/34), assigned to Andrew before implementation.

## Candidate and delivered behavior

The actual package is `skills/create-issue/`, version **1.0.0**, inside the proposed
GT **0.1.8** bundle. It is an **uncommitted working-tree candidate**, based on
published main **a8eda1ac4f8c7179b516cb2588bd58adb09fc293**. No publication, installed
cache change or Git history write is part of this task. The complete local-byte
identity is in [the package hash manifest](skill-submission-package-hashes.json).
It includes every file in the skill, not only the entry point. Line-ending
conversion or any later edit requires new candidate hashes for client evidence.

The model-only exception is intentional and owner-approved: this is a shared
dependency for callers that already own content, context and authorization.
`user-invocable: false` hides the manual entry point;
`disable-model-invocation: false` permits model selection. These flags do not
grant consent or establish that a client honors them. Missing, disabled or
shadowed dependencies return unavailable instead of executing another copy.

Caller-provided titles, bodies and layouts are preserved. All helper routes stay
fixed to GT, including when the package is copied or used in another workspace.
One flexible interface supports creation, comments, explicit own-issue changes,
additive existing labels and read-only reconciliation. It does not become a
drafting/interviewing workflow. Native relationships and Projects remain deferred.

`scripts/build-issue-submission.mjs` maintains exactly five runtime modules in
the installed package from authored `scripts/issue-submission/` sources. It
normalizes CRLF to LF, checks without writing, detects missing/stale files, and
refuses unexpected bundle entries without deleting them. Runtime documentation
and label meanings are self-contained relative resources. The root helper help
text was adjusted to avoid pointing installed users at a nonexistent README.

## Checks and review

Observed environment: **Windows, Node 24.15.0, gh 2.90.0**. The initial gh version
inventory encountered a sandbox configuration-file access denial. Work stopped;
Andrew explicitly authorized elevated retry and continuation. The elevated
read-only version check then succeeded. No ACL or security settings were changed.

- Helper/package, release, architecture, and exporter source tests: **107 passed**.
  This includes 54 helper tests, three package tests and 50 existing regression
  checks. No credentials or live helper writes were used.
- Exporter filesystem tests: **6 passed**, including real process interruption
  and recovery boundaries.
- Exporter protocol tests: **1 passed**.
- Exporter CLI integration tests: **2 passed**, covering checkout and standalone
  delivery, in approximately **164 seconds**.
- `node scripts/build-issue-submission.mjs --check`: passed.
- `node scripts/build-exporter.mjs --check`: passed; existing exporter code and
  generated bundles are unchanged.
- Structural and release comparison: passed against freshly queried published
  main above, with only `create-issue` added, no existing skill release changed,
  and matching root/marketplace **0.1.8** versions.
- `git diff --check`: passed.

Package checks exercise build/check drift handling and launch the complete skill
from a renamed path with spaces outside the checkout. Help and invalid-input
paths execute without authentication; alternate GH_HOST/GH_REPO values do not
retarget the result. Existing source-export checks reject the package at
`scripts/api.mjs` under their conservative absolute-path dependency rule. The
test records that refusal; no guard was relaxed, route rewritten or restore
behavior changed. Copyability is not general-repository or personal-export
eligibility.

The earlier combined regression run was interrupted without a result. This
round ran all 12 test files across separate invocations: **116 passed, 0 failed,
0 skipped**. The helper/package/release/source group used `node --test
--test-timeout=30000 scripts/issue-submission*.test.mjs scripts/release-*.test.mjs
scripts/skill-architecture.test.mjs scripts/export-source.test.mjs`; the remaining
three files ran directly with Node to expose their completion results. The
interrupted combined runs are not counted as passes. The CLI integration tests
did complete successfully when allowed to finish; the exact cause of the older
whole-suite stall was not established. No regression test or exporter check was
weakened to obtain these results.

Independent Code Review axes: Standards **0 findings**; Spec identified one
missing disabled/shadowed-dependency instruction. It was corrected and the spec
reviewer confirmed **0 remaining findings**. Review-only evidence stays outside
the distributed skill.

Representative expected behavior: a caller supplies a GT skill-change title,
real observed context/body and existing submission authority from an unrelated
workspace; this dependency preserves that content and targets only GT. A missing
body is returned to the caller, not invented. An acknowledged/uncertain attempt
is reconciled read-only, not repeated. These instruction expectations are not
claims of observed Copilot model composition.

## Maintainer label setup

The live catalog initially had none of the three agreed labels. Only these were
created, then all were observed in the catalog; unrelated definitions were left
unchanged:

| Name | Color | Description |
| --- | --- | --- |
| `new-skill` | `0E8A16` | Propose adding a skill to GT |
| `enhancement-skill` | `A2EEEF` | Propose an improvement to an existing GT skill |
| `inconsistent-skill` | `D73A4A` | Report confusing or inconsistent behavior in an existing GT skill |

This was one-time authorized maintainer setup. The runtime still has no label
creation operation. GitHub task-management calls are not helper acceptance tests.

## Remaining acceptance

The offline CI matrix is wired for Windows/Linux and Node 22/24, with no live
credentials or mutations. **Remote jobs have not run for this uncommitted
candidate.** Node 22/Linux execution is not inferred from the local Windows
Node 24 result. The gh 2.90.0 minimum is distinct from client compatibility.

[Windows VS Code acceptance](https://github.com/AndrewGodlewsky/andrew-skills/issues/35)
and [Remote WSL / WSL Copilot CLI acceptance](https://github.com/AndrewGodlewsky/andrew-skills/issues/36)
must identify the installed candidate by these hashes (or a later published
commit) and observe dependency discovery, resources, model invocation and
controlled authenticated submissions. They remain open. No normal developer
WSL setup or live helper submission has been established here.

Configured HTTP(S)/ALL_PROXY environments stop before authentication pending
reviewed proxy integration; do not unset required controls. Replacements are not
atomic compare-and-swap, and recovery cannot guarantee exactly-once delivery
after lost context. These limits remain explicit in the package.
