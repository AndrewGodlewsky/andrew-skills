# Create-issue acceptance — offline fixture evidence

Supporting evidence for [Windows VS Code acceptance #35](https://github.com/AndrewGodlewsky/andrew-skills/issues/35) and [Remote WSL / WSL Copilot CLI acceptance #36](https://github.com/AndrewGodlewsky/andrew-skills/issues/36).

## Run and scope

Acceptance candidate: **5466ab67f3818a3772222e2633963aa8e2784de7**, GT **0.1.8**, `create-issue` **1.0.0**. This run exercises the current workspace's authored helper and packaged helper; it does not identify or validate any client-installed copy. Client evidence must separately identify the actual loaded package and its bytes.

On **2026-09-20**, the following command completed locally on **Windows x64 (`win32`), Node v24.15.0**:

```text
node --test --test-timeout=30000 scripts/issue-submission*.test.mjs
```

Result: **57 tests passed; 0 failed, cancelled, skipped or todo**. Reported test duration: **192.7362 ms**. Runtime inventory used `node --version` and `node -p "JSON.stringify({node:process.version,platform:process.platform,arch:process.arch})"`.

The three files run were [service tests](../../scripts/issue-submission.test.mjs), [transport/CLI tests](../../scripts/issue-submission.transport.test.mjs), and [package tests](../../scripts/issue-submission-package.test.mjs). External service/transport/process boundaries use injected fixtures. The standalone package subprocess checks invoke help and invalid input only. This run acquired no real credentials, made no live network requests or GitHub mutations, and changed no runtime or test source. Simulated authentication/security failures below are fixture outcomes, not actual security denials encountered during execution.

## Boundary mapping

Test names below are exact names in the test files, enabling targeted reruns. They describe observed helper assertions, not observed model behavior.

“Outside this evidence” below means outside this fixture run. Separate direct
Windows owner-account creation/comment/edit/label/readback evidence is now
recorded in [the Windows report](skill-submission-windows-acceptance.md) and
[live helper record](skill-submission-windows-helper-live.json). It does not fill
the unobserved Copilot/client or ordinary-participant rows.

| Acceptance concern | Passing fixture evidence | What remains outside this evidence |
| --- | --- | --- |
| Missing authority/content and unrelated work | `missing context, unrelated scope and unsupported operations do not acquire credentials` rejects `authorized: false`, non-GT scope, empty body, unsupported fields/operations, invalid Unicode and oversized text before authentication. | The model must recognize absent authorization, actual GT relevance and missing caller content. The helper receives assertions rather than independently understanding workflow consent or relevance. |
| Fixed repository and destination override | `a destination override is rejected before credentials or requests`; `runtime rejects unsupported routes before requesting the network`; `transport ignores routing environment variables and sends UTF-8 JSON with verified TLS`; `CLI rejects route override without credentials or files`. | Actual client behavior must preserve the fixed destination and avoid alternate tools, including from an unrelated workspace. No current Git remote is consulted by these tests. |
| Body instructions stay data | `body instructions remain inert and CRLF verification does not rewrite the sent body` sends a quoted request to use another repository unchanged while the fixture accepts only the fixed GT route. | The model must not obey redirection embedded in supplied content before invoking the helper. This is not a model prompt-injection test. |
| Caller content and Unicode | `creation sends exact caller content only to GT and verifies its returned identity`; `UTF-8 byte bounds count emoji bytes without truncating at the limit`; the transport UTF-8 test above. CLI tests reject malformed UTF-8/JSON and oversized JSON. | Actual client preparation must preserve the caller's title, layout, quotes, code and Unicode without inventing substantive content. Live readback remains pending. |
| Actor and returned target identity | `the actual account must match the caller’s expected stable identity`; the foreign repository, PR, malformed identity and unsafe returned URL comment tests. | Fixture actor IDs and API responses are synthetic. Each real participant must authenticate as themselves and establish their own observed account identity. |
| Own-issue edit and conflict | `own-issue replacement sends only explicitly requested fields`; `detected changes to the replacement base return a conflict`; `even an admin cannot replace another author’s issue`. | A real authorized own-issue edit/readback and model refusal to edit another author's issue remain unobserved. Replacement is not atomic compare-and-swap. |
| Comments and closed actionable follow-up | `comments can add caller content to another author’s issue`; `a closed actionable comment creates a new open issue instead of posting into the closed queue`; `a closed actionable comment with no new-issue content saves nothing`; the different-issue-number prefix test. | Client classification of actionable versus informational context, preservation of caller-supplied follow-up content, and authorized live comment/follow-up behavior remain pending. |
| Ordinary submitter without label privilege | `a non-owner credential can create an issue but cannot claim label capability` returns partial success when the fixture reports `permissions.push: false`, and makes no label request. | This is mocked repository permission data for synthetic actor 10, not ordinary-participant acceptance. It does not establish real token privileges, scope, membership or client behavior. |
| Partial labels, preservation and continuation | `successful creation is preserved when a requested label is missing`; `label resume adds only missing labels and preserves the existing set`; `finding requested labels within a bounded incomplete list does not claim complete verification`; `a security denial during labels stops further work without erasing creation`. | The model must report per-operation results accurately and resume only explicitly authorized missing work. Live additive label behavior requires a participant with appropriate real authority. |
| Missing tools and manual handoff | `missing tools supply a prepared manual handoff only without earlier uncertainty`; `an old CLI is not upgraded or asked for credentials`; `missing and rejected authentication remain distinct without exposing stderr`. | No real tool was removed or real authentication denied. The model must distinguish unavailable prerequisites from security stops and avoid automatic installation, login or fallback. |
| Uncertain/acknowledged writes are not replayed | `an uncertain send has exactly one mutation attempt`; `a cancelled write remains uncertain with no second attempt`; `malformed acknowledged identity is reported as acknowledged, never recreated`; transport tests preserve acknowledgements after stalled, malformed and oversized bodies. | Actual model result wording and preservation of evidence across chat turns remain pending. No live mutation was deliberately interrupted. |
| Repeated invocation with previous evidence is read-only | `a known previous write is reconciled without sending it again`; `read-only reconciliation of a known comment never posts another`; `bounded reconciliation returns matching candidates without attribution`; `no reconciliation candidates does not prove a timed-out create failed`. | These requests include prior-attempt evidence. `each independent caller is allowed to submit; no durable exactly-once promise is made` separately confirms that independent new requests may create again. There is no durable deduplication or exactly-once guarantee after evidence loss. |
| Security, privacy and network controls | `security failures do not retry and body diagnostics are not echoed`; transport tests preserve received 301/401/403 without waiting for a stalled body; `CLI credentials stay in private capture and errors never expose captured output`; `configured proxy stops before credentials instead of silently bypassing it`; `credential acquisition cannot switch identities during one operation`. | These are injected failures/captures, not live credential or network-security acceptance. Real denials still require stopping under the active user's rules. |
| Standalone package resources and copied location | `bundle is deterministic, checks without writing, and refuses unexpected entries`; `the shipped helper matches sources and runs from an unrelated renamed package`; `existing exporter conservatively refuses the fixed API paths without rewriting the destination`. | Help and invalid input run from a copied path with spaces. This does not demonstrate Copilot discovery, resource loading, model composition, an authenticated submission from that location, or personal-export eligibility. |

## Remaining client evidence

The suite is reusable supporting evidence for all three client lanes, but this run was **Windows Node 24 only**. It is not a Remote WSL execution or a WSL Copilot CLI session. Existing CI results, if cited elsewhere, must retain their own platform/runtime attribution.

No model took part in these tests. The following still require separately recorded client observations against an identified package:

- Windows VS Code, VS Code Remote WSL and WSL Copilot CLI discovery, source resolution, bundled resource loading and model-only invocation; no advertised manual slash-menu entry.
- Fresh and existing chats, absent/disabled/shadowed dependencies, actual GT relevance from an unrelated workspace, missing authority/content, body redirection and unchanged caller content.
- Model handling of read-only reconciliation, partial success, missing tools and security stops. The offline helper suite alone does not establish that the surrounding agent respects those outcomes.
- Controlled authenticated creation and representative comment, own-edit and label readback, using separate benign test issues per environment. Record links and results; reconcile any uncertainty before a retry.
- Ordinary-submitter evidence from that participant's own authorized credentials, or an explicit remaining gap. Owner credentials and synthetic permission fixtures do not substitute for it.

These fixtures support acceptance preparation; they do **not** close issues #35 or #36 or establish broad client compatibility.
