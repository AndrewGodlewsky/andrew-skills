# Issue submission logic prototype

Run from the repository root:

```powershell
node docs/prototypes/issue-submission/run.mjs
```

Question: can creator, update, feedback and planning callers keep their own content and structure while receiving clear results for submission, organization and recovery? The model follows the agreed [caller contract](../../planning/skill-submission-contract.md) and [recovery contract](../../planning/skill-submission-recovery-contract.md).

**Archived, entirely simulated design aid; owner review complete.** The owner accepted the interaction prototype with qualifications: Example A was rejected, callers should provide richer actual context, and only labels remain in first-version organization. Native parent/child and blocker links are deferred. See the [review outcome](../../planning/skill-submission-prototype-notes.md). The fixtures preserve the reviewed version; they are not all accepted production requirements.

There are no GitHub requests, subprocesses, workspace scans or persistent submission records. Fixture identifiers such as `OWN-FIXTURE` are not real GitHub issues. Resetting a scenario resets the imaginary world; it is not a supported way to forget a real uncertain submission. No production skill, label provisioning or actual Copilot/WSL verification is included.

Node is already used by this repository and was the accepted helper direction. No dependencies or installation are needed. The local smoke run used Node v24.15.0; this does not set the eventual minimum supported version.

## Try it

The terminal shows current state and shortcuts. Type a key followed by Enter. Use `i` to inspect exact caller content, `s` to simulate submission and `w` for the fixture's actor/permissions/responses. Press `s` again to see that the same active request is not written twice. Use `c` for read-only reconciliation, `n`/`p` or a scenario number to move, and `q` to quit.

For example, scenario 23 loses its creation response: `s`, `s`, `c` leaves one simulated write and an uncertain result. Scenario 24 has an acknowledged identity: `s`, `c` verifies that identity without a second write. Scenario 27 resumes organization and adds only the missing parent edge, preserving labels already present.

To print every fixture, exact caller input and final result:

```powershell
node docs/prototypes/issue-submission/run.mjs --all
```

The all-scenarios view submits, repeats and reconciles each fixture. It is an offline demonstration, not a test suite or actual submission log. The interactive views may require scrolling on small terminals, especially for the full Markdown draft.

## Limits and review

- `scenarios.mjs` supplies synthetic authorization evidence, GT relevance, actor identity, fresh issue observations, label choices and permissions. A boolean or a caller claim alone will not prove these in production. This prototype does not implement the agent's semantic classification, authentication, API transport, identity validation, pagination or permissions detection.
- `model.mjs` is a small pure state sketch. It preserves supplied title/body/comment text, gates modeled operations and shows separate results. It is not hardened input validation, a proposed public wire schema or a reusable security boundary. Do not ship it as the helper.
- `run.mjs` is the throwaway terminal shell. It imports only the fixture model and Node's terminal APIs. Returning a simulated verification result does not prove any GitHub endpoint, atomic update guarantee or client behavior.
- The fixture label catalog assumes later setup has provisioned the three agreed labels. The real labels were absent in the prior research; scenario 8 models that condition. Projects are deferred.
- Known lack of organization capability yields partial completion without attempting the forbidden step. An actual security/permission denial instead stops further work. The model includes a preflight security-stop example; production must preserve prior successes when a later operation is denied.
- Reconciliation is one bounded synthetic observation per requested check. Numeric retry budgets, response limits and real concurrency behavior belong to the implementation handoff.

The owner's answers are preserved in [Round 1](../../planning/skill-submission-prototype-round-1.md), with the accepted qualifications in the [review outcome](../../planning/skill-submission-prototype-notes.md). This companion is retired from active design work and retained as a historical demonstration; do not ship it as the helper.
