# Create Skills — implementation and acceptance evidence

Recorded September 21, 2026 for issues
[#39](https://github.com/AndrewGodlewsky/andrew-skills/issues/39),
[#40](https://github.com/AndrewGodlewsky/andrew-skills/issues/40),
[#41](https://github.com/AndrewGodlewsky/andrew-skills/issues/41),
[#42](https://github.com/AndrewGodlewsky/andrew-skills/issues/42) and
[#43](https://github.com/AndrewGodlewsky/andrew-skills/issues/43).

## Implemented package

`skills/create-skills/` contains the manual-only specification-first workflow,
conditional interview/writing/check/submission/installation references, the
attributed MIT notice and self-contained generated local tools. New skill version:
**1.0.0**. Integrated GT version: **0.1.9**. Existing skills retain their versions
and generated helper bundles.

Maintained code is under `scripts/create-skills/`, with extracted pure validation
in `scripts/skill-package-validation.mjs` and deterministic generation in
`scripts/build-create-skills.mjs`. The existing repository validator consumes the
same extracted checks. Generated GT rules come from declared unique sections of
CONTRIBUTING.md; runtime files do not require the checkout.

Final locally checked package identity (raw file hashes/modes, Windows checkout):
`a8d14adea39fb8d82ecb605d0cc2eccbf133a9d6955dfa1f591c47a8ac450f2b`.
Rules version: 1.0.0. Identity describes these bytes, not client activation or
published availability. Line-ending conversion may change raw checkout identity.

## Checks actually executed

Host: Windows, Node **24.15.0**. No dependencies were installed.

| Check | Observed result |
| --- | --- |
| Existing architecture/release tests plus initial standalone checker tests | 32 passed at extraction. |
| Full repository run: `node --test scripts/*.test.mjs` | 142 passed, zero failures/skips, approximately 211 seconds. This ran before the final creator-only hardening/additional cases. |
| Final creator run: `node --test scripts/create-skills*.test.mjs` | 32 passed, zero failures/skips, after final installation and delivery-index changes. |
| `node scripts/build-create-skills.mjs --check` | Passed; generated tools and canonical rules match maintained sources. |
| Existing issue-submission/exporter bundle freshness | Both passed; no unrelated bundle changes. |
| Plain repository validation and bundled self-check | Passed; six skills, GT 0.1.9, creator structural result passed. |
| Published-base release comparison | Passed: added `create-skills`, no existing skill changes/removals, plugin 0.1.9. |

Release comparison used independently read current main
`feb17aa3dac040d58a6e342eccdbee75b98acc31` with both `--base` and
`--current-main`. GitHub still reported that commit on the final remote recheck.
The command validates the working-tree candidate without committing it.

## What the offline evidence establishes

- The package checker runs from a copied bundle outside the checkout and reports
  input identities, missing/invalid files, invocation defects, escaping links,
  redirected entries, count/byte/depth limits and the actual coverage boundary.
  It does not execute draft code. Existing pure repository cases retain behavior.
- Preparation preserves Unicode, BOM and LF-normalized text, fragments long files
  with safe fences and exact manifest hashes, and represents binary resources as
  pending manual attachments. Body/request bounds and a final-index reserve are
  checked before writes. A specification with no package and unrun checks remains
  valid input.
- The stateless delivery planner is exercised against the **real submission
  service** with simulated GitHub responses. Creation, comments, final index and
  read-only reconciliation compose successfully. Lost results are not replayed;
  changed/closed targets, security results and evidence mismatches stop progression.
  Label failure stays separate. No test here used live GitHub for delivery.
- Packaged CLI JSON commands run outside the checkout with shell-looking text
  preserved as data. Personal installation was exercised only in temporary,
  isolated user homes after explicitly verifying the child process's home.
- Personal copies keep the ordinary name and every resource. Input identity and
  existing destinations are checked; redirects and structural defects stop copying.
  SKILL.md is fully staged and then atomically linked without replacing an existing
  root. Simulated interruption during resources or root writing preserves visible
  task-owned partial files. A competing root is preserved. Simulated permission
  denial remains a security-stop result with no alternate destination.
- Every inline Markdown pointer in the shipped creator resolves inside its
  package. The bundled Matt notice matches the pinned reviewed source hash.

The specification-first interview, independent specification and advisory-check
policy were reviewed against the accepted handoff examples and instructions.
These are authored behavior expectations and source review, **not observed model
conversations**. The local planner cannot establish that the model invoked the
enabled dependency instead of choosing another tool.

## Environment observations and remaining acceptance

VS Code CLI reports **1.138.0**, x64, commit
`7debcd0e2acdea1c52de81bf9ee1620444407dda`. `copilot` was not on this shell's PATH.
The default VS Code CLI extension inventory returned no matching `github.copilot`
entry; this does not establish the state of every custom profile or built-in
capability. No real chat or new GT installation was exercised.

WSL inventory initially returned `Access is denied` /
`Wsl/EnumerateDistros/Service/E_ACCESSDENIED` in the sandbox. A read-only elevated
retry, covered by the owner's current authorization, succeeded and listed only
`docker-desktop`. No developer distro was installed. VS Code extension inventory
initially reported `EPERM: operation not permitted, mkdir
'c:\Users\godle\AppData\Roaming\Code\User'`; the elevated retry completed.
No security settings, ACLs, credentials or execution policies were changed.

| Environment/evidence | State |
| --- | --- |
| Windows Node 24 local implementation checks | Passed as described above. |
| Windows/Linux Node 22/24 GitHub Actions matrix | Configured, not run for these uncommitted changes. |
| Windows VS Code: actual `/gt:create-skills` discovery and model workflow | Not run. No supported native VS Code chat control was available for this task. |
| Remote WSL VS Code | Not run; no developer distro/ready client environment observed. |
| WSL Copilot CLI | Not run; no developer distro/ready client environment observed. |
| Real manual ZIP upload/download/hash verification | Not run; pending-attachment and verified-evidence branches tested offline. |
| Actual model selection of `create-issue`, issue delivery and personal activation | Not run for this new caller. Existing #35/#36 evidence does not prove it. |

Keep #43 open for the unrun matrix and client observations. Implementation closure
of #39–#42 does not waive these checks or claim the new skill is already published.

## Next client verification

After Andrew publishes or explicitly selects an isolated candidate installation,
record its exact source, package identity, client version and environment. Use a
fresh chat and the accepted meeting-actions scenario in
[the handoff](../planning/create-skills-handoff.md). Observe the interview,
independent specification, build/check attempt and actual create-issue selection.

Test a complete request, a missing requirement and an unavailable check. Verify
that failed/unrun checks are disclosed without blocking a complete specification.
Use controlled fixture content under actual submission authority. Observe long
text delivery and its verified index; retain actual IDs rather than retrying
after uncertainty. Exercise the manual ZIP branch when an essential binary exists.

Decline personal installation once and verify no files are created. On an
explicitly accepted fixture, verify ordinary-name files, correct active user
scope, client discovery and actual invocation separately. Use benign generated
behavior so this check does not implicitly authorize unrelated actions. Record
collisions or missing client capability honestly. Do not infer that a personal
name and GT-prefixed command resolve identically in every client.

No personal skills, plugin caches, releases or Git history were changed by this
implementation task. Local files remain uncommitted. Unrelated owner edits were
preserved.
