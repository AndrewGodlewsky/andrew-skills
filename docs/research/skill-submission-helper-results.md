# Fixed-repository submission helper — implementation evidence

Issue: [Build the fixed-repository issue submission helper](https://github.com/AndrewGodlewsky/andrew-skills/issues/33), assigned to Andrew before implementation.

## Delivered boundary

Authored implementation under `scripts/issue-submission/`: validated JSON input, fixed-repository API session, private gh credential capture, bounded HTTPS transport, operation/recovery handling and CLI entry point. The adjacent README documents the actual interface and limits. No installed skill, plugin bump, label provisioning or client configuration is included; [Package the model-invocable create-issue skill](https://github.com/AndrewGodlewsky/andrew-skills/issues/34) owns that integration.

Creation, comments, explicit own-issue title/body replacements, additive labels and read-only reconciliation are implemented. All API routes are fixed to GT; returned identities and content are checked. New comments can target other authors' issues; editing/labeling cannot. Closed actionable follow-up creates an open issue only with caller-supplied content/reference. Unknown fields, unsupported actions, destination overrides and missing essentials produce no mutation.

Each operation retains its own evidence. A later label/verification failure does not erase creation. A received write acknowledgement survives malformed, oversized or stalled response bodies; security/redirect headers stop immediately. Known previous writes are read back without replay. No local receipt/cache/state directory or marker is created. Available context cannot provide exactly-once delivery after evidence loss.

## Local checks

- Windows, Node **24.15.0**. Working-tree baseline inspected at **a8eda1ac4f8c7179b516cb2588bd58adb09fc293**. All new helper files remain uncommitted; the earlier untracked implementation-handoff document was preserved.
- `node --test scripts/issue-submission*.test.mjs`: **54 passed, 0 failed**. Covers service behavior, process/network capture and CLI input handling. Tests are offline; no credentials or live mutations are needed.
- `node scripts/validate.mjs`: passed, existing GT **0.1.7**, **4 skills**. This helper task adds no installed skill or release transition.
- `node scripts/build-exporter.mjs --check`: passed; unrelated exporter bundles remain current.
- `node --test --test-timeout=30000 scripts/release-validation.test.mjs scripts/skill-architecture.test.mjs scripts/release-catalog.test.mjs`: **36 passed, 0 failed**.
- `node scripts/issue-submission/run.mjs --help`: passed without authentication.
- New-file whitespace check: passed. Git history and existing tracked files were not changed by this task.

The complete `node --test scripts/*.test.mjs` run did not finish or return test output during this session and was interrupted. It is **incomplete, not passed**; no cause has been established. The isolated helper suite completes successfully. Packaging must investigate/re-run the broader regression suite before claiming a complete integrated candidate; this helper result does not waive that check.

## Review

The Implement workflow's Code Review stage inspected uncommitted additions against the issue/handoff and repository standards. Standards review found no documented-standard violations or significant maintainability findings. Spec review found two defects: lost HTTP acknowledgement/denial on stalled bodies, and overclaiming completeness for bounded label reads. Both had failing regression tests added, were corrected and were rechecked by the reviewer with no remaining critical defect reported. Final local boundary checks also corrected issue-reference prefix matching and explicitly omit oversized remote text from read snapshots rather than truncating it.

## Remaining evidence and limitations

- Node **22**, Linux and remote CI results are unrun here. The packaging task owns the Windows/Linux Node 22/24 CI matrix and bundle check; local Windows Node 24 tests are not substitutes for that evidence.
- No live GitHub request was made through the helper. GitHub issue-management calls used to track this task are not acceptance tests of the helper. Actual credentials, permission variations and Copilot invocation remain in the [Windows](https://github.com/AndrewGodlewsky/andrew-skills/issues/35) and [WSL](https://github.com/AndrewGodlewsky/andrew-skills/issues/36) acceptance tasks.
- Initial CLI support floor is gh **2.90.0**; tests capture process execution and credential handling offline. No automatic installation/login or credential fallback is implemented.
- Configured HTTP(S)/ALL_PROXY environments stop before authentication pending a reviewed proxy integration. The helper does not silently bypass a required proxy. TLS verification remains enabled.
- Replacement detects changes to the caller's base, but cannot guarantee atomic compare-and-swap. No claim of exactly-once submission, global deduplication or durable recovery is made.
- The surrounding agent still owns actual GT relevance and workflow authorization. JSON assertions and helper confinement do not sandbox its other tools.

The authored helper and focused checks are ready for integration, with the broader regression-run limitation recorded above. Packaging and live acceptance remain separate from helper implementation completion. No commit, push, PR or publication was performed.
