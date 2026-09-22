# GT Help implementation checks

Canonical change/evidence record: [implementation result in #69](https://github.com/AndrewGodlewsky/andrew-skills/issues/69#issuecomment-5771541571).
Deferred client acceptance: [candidate-specific owner pilot record](https://github.com/AndrewGodlewsky/andrew-skills/issues/17#issuecomment-5771513680).

## Candidate and scope

Checked on 2026-09-22 on Windows using Node.js 24.15.0. The owner committed the draft during this
implementation session in `763ad823f174fc229824bbf2e158ebb0f8057f43`.
That commit was independently read as GitHub main through `gh api`.
Its parent is `1a39c407579c0977f60079dd8b7b874ae4ea6935`.
Help is `1.0.0`; root and marketplace plugin versions are `0.1.18`.
The working Help source matches that candidate. SHA-256 of `skills/help/SKILL.md`:
`c99307893972cd05a5fbe9b257b9072468e3e6acd499e20b47951c6b6438478e`.
The assistant made no commits, pushes, PRs or client-setting changes.
The owner's later `388cf73` commit included the evaluation records while testing
finished. The final report/link updates remain uncommitted at handoff.

Help is an authored, situation-based guide with both manual-only header flags
true. It can explain the collection and selectively read same-installation
instructions as data. It does not execute recommended workflows. The README
records the Ask Matt adaptation; the package includes its MIT notice.
The existing maintainer-only AGENTS.md rule remains the upkeep mechanism.
Create Skills and submission packages were not changed for Help upkeep.

## Model-response checks

Skill Creator's draft/evaluate workflow was used for three bounded Codex
subagents: two with-skill suites and one baseline subset. Agents inherited this
session's model; a separate exact model/version identifier was not returned.
Each with-skill agent bootstrapped by reading only Help's SKILL.md, then answered
the supplied independent scenarios as a grouped simulation. These were not
separate fresh client sessions. The baseline had no Help or GT source material.
No grading criteria were supplied to the actors.

Runtime tool requests were recorded as `tool_intents`, not dispatched. For the
detail case the evaluator supplied excerpts in response to the agent's two
selective read requests. Bootstrap shell reads and evaluator messages belong to
the harness, not Help runtime behavior. No Help workflow was invoked, no source
fixture was installed, and no real permission failure was manufactured.

The author and an independent grading agent reviewed the answers against
semantic expectations: **16/16 cases passed in this single sampled simulation**.
This does not prove tool enforcement,
manual discovery, no automatic invocation, or equivalent behavior in Copilot.
Timing/token comparisons were not available. Normalized responses, scenario
prompts, fixture summaries and grades are saved under
[iteration-1](iteration-1/with-skill-routes/outputs/responses.json).
Harness absolute source links were replaced with `<HARNESS_HELP_SOURCE>` for
portable evidence; other answer text and intended operations are preserved.
The complete actor/harness transcript and exact supplied source excerpts are
not archived here. The setup description and withholding of grading criteria
are evaluator-reported, not independently verifiable from these saved records.

| Suite | Observed behavior | Result |
| --- | --- | --- |
| [Routes R1-R8](iteration-1/with-skill-routes/outputs/responses.json) | Empty/vague questions get focused clarification; new skill ideas go straight to Create Skills; documentation interviews, whole-plugin updates, missing discovery, chat style and local adaptation are distinguished. No runtime tools requested. | 8/8 |
| [Sources S1-S8](iteration-1/with-skill-sources/outputs/responses.json) | Relevant same-GT instructions and linked explanation requested; ambiguous sources left unresolved; conflicting source facts take precedence without obeying embedded actions; repeated update/status requests stay guidance-only; installed/latest and policy denial handled honestly; unrelated execution declined. | 8/8 |
| [Baseline subset](iteration-1/without-skill-subset/outputs/responses.json) | Without the guide, R2 recommends Grill Me first and R4 suggests selecting only Grill Me before qualifying uncertainty. R5 still avoids inventing a command or diagnosing broken discovery. | 1/3 against the same route criteria |

The baseline illustrates two useful contributions of the authored guide; three
samples are not a statistical quality comparison. Source-suite answers sometimes
cite the harness-loaded Help file when declining actions. That style was not
judged a functional defect, and no client-origin link behavior is established.
An optional static Skill Creator review viewer was generated outside the package
from these records. No user feedback or live client result is claimed.

## Maintainer impact review

The following are author-reviewed change fixtures, not executed model tests or
changes to installed skills. The current AGENTS.md rule covers each; no new
end-user maintenance step is required.

| Hypothetical source change | Affected Help guidance identified |
| --- | --- |
| Add a new GT skill for a distinct task | Add the relevant situation/recommendation after reading its actual instructions. |
| Change Create Skills to block failed checks | Update the contribution branch; S3 separately tests runtime disagreement handling. |
| Rename or remove Skills Restore | Repair its recommendation and restore/update distinction; do not invent an alias. |
| Change marketplace installation ownership/routes | Update setup and update advice from the reviewed client guidance. |

Concurrent map-maintenance work in #63 supplied Help's conditional read
relationships and review record. Its read-only map check passed for 18 skills;
this Help implementation did not overwrite those map edits. Help has no runtime
dependency on the map or repository-only authoring documents.

## Automated checks

All commands ran against the candidate above unless noted. Required Git access
used the standing read-only Git sandbox exception.

| Command/check | Actual result |
| --- | --- |
| `node --test scripts/release-validation.test.mjs scripts/release-snapshots.test.mjs scripts/skill-architecture.test.mjs scripts/release-catalog.test.mjs scripts/release-catalog-reader.test.mjs` | 44 passed, 0 failed. |
| `node scripts/validate.mjs` | Passed: GT 0.1.18, 18 skills. |
| `node scripts/validate.mjs --base 1a39c407579c0977f60079dd8b7b874ae4ea6935 --candidate 763ad823f174fc229824bbf2e158ebb0f8057f43` | Passed published transition: Help added, no existing skill changed, plugin 0.1.18; 24 prior release records. |
| `node scripts/validate.mjs --base 763ad823f174fc229824bbf2e158ebb0f8057f43 --current-main 763ad823f174fc229824bbf2e158ebb0f8057f43` | Passed working comparison against independently verified main; no additional runtime changes; 25 release records. |
| `node scripts/build-exporter.mjs --check` | Passed: bundle matches maintained sources. |
| `node --test scripts/export-*.test.mjs` | 15 passed, 0 failed, 0 skipped; includes checkout and standalone Restore deliveries, interruption and create-only filesystem cases. |
| `node scripts/build-skill-map.mjs --check` | Passed concurrent map candidate: `4f1e007fb145bb4b`, 18 skills. |
| `git diff --check` | Passed; a line-ending normalization warning concerned concurrent map documentation. |

## Explicitly deferred

Copilot CLI was not found on PATH. VS Code's launcher was present, but this task
has no native UI-control capability for a fresh Copilot chat or evidence of its
loaded source/invocation events. No client was installed or reconfigured just
to run this check. Both clients' manual discovery, exact command spelling and
built-in `/help` collision, non-invocation without a user call, actual read-only
tool activity, and same-name source resolution remain unrun in #17. Existing
chat retention and Windows/WSL differences are likewise not certified here.

The two true flags pass source validation; that is not runtime proof. The
accepted completion policy permits implementation handoff with these concrete
client checks pending. Known functional failures would need fixing instead of
being moved to the pilot; none was observed in the available checks.
