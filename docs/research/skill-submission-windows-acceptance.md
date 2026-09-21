# create-issue — Windows VS Code acceptance

Tracking: [issue #35](https://github.com/AndrewGodlewsky/andrew-skills/issues/35).
Recorded on September 21, 2026 UTC. **Partial evidence; keep the issue open.**
Inventory and helper execution do not establish Copilot activation or behavior.

## Candidate and observed inventory

| Item | Observed value and limit |
| --- | --- |
| Published main and local HEAD | `5466ab67f3818a3772222e2633963aa8e2784de7`; remote main queried again for this report. |
| Candidate | GT **0.1.8**, create-issue **1.0.0**, at `A:/Claude/andrew-skills/skills/create-issue/`. |
| Git package tree | `f9184c71da949c6a719b68e7b2ed6d810ebec671`. No working-tree package differences from HEAD. |
| Exact local bytes | All nine files still match [the package hash manifest](skill-submission-package-hashes.json). That earlier manifest's “uncommitted” description is historical; the commit above now identifies the published package. Recheck hashes after checkout conversions or edits. |
| Other working-tree changes at inventory | Two existing exporter test corrections, in `scripts/export-filesystem.test.mjs` and `scripts/export-protocol.test.mjs`; preserved. |
| Windows | OS version `10.0.26200.0`, x64, from .NET runtime inventory. |
| VS Code | Installed stable **1.138.0**, build `7debcd0e2acdea1c52de81bf9ee1620444407dda`, product date `2026-09-15T07:24:32Z`; read package/product metadata without launching the application. |
| Copilot | Bundled `GitHub.copilot-chat` **0.66.0** from the application's `extensions/copilot/package.json`. This is installed metadata, not the observed active extension in a chat. No separately installed `github.copilot*` folder was found in the two inspected extension directories. |
| Node / gh | Native Windows **24.15.0 / 2.90.0**; version commands succeeded. |
| Client-selected dependency path | **Not observed.** The checkout location above is a candidate, not proof of client loading. |
| Copilot model / sign-in / tool approvals | **Not observed this round.** No authentication state or credential store was inspected. |

The limited settings inspection read only plugin enablement/location and agent
skill location keys. The default profile's
`C:/Users/godle/AppData/Roaming/Code/User/settings.json` has no explicit values
for those three keys. The old pilot's
`.vscode/owner-pilot-20260920/code-data/User/settings.json` enables plugins, but
has no explicit plugin or skill location map. Repository `.vscode/settings.json`
and pilot-project `.vscode/settings.json` do not exist. Defaults, profiles,
workspace settings elsewhere, discovery and policy can affect effective state;
these findings do not establish that GT is absent from every client context.

The known disposable CLI-managed pilot copy at
`.vscode/owner-pilot-20260920/home/.copilot/installed-plugins/andrew-skills/gt`
is still **GT 0.1.7** and contains **no create-issue skill**. Using that copy would
test an old installation, not this candidate. No registration, managed cache,
extension, account, setting or tool enablement was changed this round.

## Prior startup evidence and current boundary

[The owner pilot](owner-pilot-windows-20260920.md) preserves the original
breakpoint report and renderer `launch-failed, code: 49` result. The separately
authorized retry recorded renderer/extension-host startup, but did not observe
signed-in Copilot chat or this skill. Those earlier results are neither a new
failure nor a current acceptance pass.

Native application UI control is unavailable in this task. No VS Code window
was launched, no remote-debug/browser workaround was attempted, and Codex was
not presented as Copilot. The remaining UI checks need an observed native
Copilot session. Any fresh security, execution, authentication or policy denial
must stop the run and retain its exact safe error before proceeding.

## Evidence categories

| Category | Status |
| --- | --- |
| Current candidate and installed-client inventory | Observed above. |
| Copilot model loading and caller composition | Not run. |
| Copilot resource reads / execution path | Not run. |
| Fresh and existing chat behavior | Not run. |
| Slash-menu hiding | Not run; frontmatter alone is insufficient. |
| Missing, disabled and shadowed dependency behavior | Not run in Copilot. |
| Direct helper authenticated checks | Verified owner-account create, comment, own edit, additive labels and read-only reconciliation on [controlled issue #37](https://github.com/AndrewGodlewsky/andrew-skills/issues/37); details below. A direct helper pass does not fill a Copilot row. |
| Ordinary contributor account / authorized other-author target | Not supplied; live gaps remain. Owner access cannot stand in for these. |
| Offline request-capture and package checks | Existing fixtures described below; no model behavior inference. |

The [package report](skill-submission-package-results.md) records prior local
checks. Its statements that publication and CI had not happened describe the
earlier packaging round, not current publication state. Reuse only the explicit
results and their recorded candidate identity.

Existing tests in `scripts/issue-submission.test.mjs` cover exact caller text,
inert body instructions, alternate destination rejection, missing context,
other-author comments, own-author restrictions, contributor-like capability,
partial/missing labels, replacement conflicts, missing prerequisites, uncertain
writes and read-only repeated-attempt reconciliation. Transport fixtures in
`scripts/issue-submission.transport.test.mjs` cover private credential capture,
fixed routes, acknowledged-but-incomplete responses and security stops. Package
fixtures exercise execution from an unrelated renamed directory and conservative
export refusal. These injected boundaries are **fixture-only**, including the
simulated contributor and security cases; they are not actual credentials,
GitHub permission denials or client observations.

### Actual Windows helper boundary

The coordinating agent executed the shipped
`A:/Claude/andrew-skills/skills/create-issue/scripts/run.mjs` from
`C:/Users/godle/AppData/Local/Temp/gt-issue-35-helper-5466ab6`, outside the
checkout. This was a **Codex-launched Windows process**, not a Copilot session.
Its live `read` verified actor **AndrewGodlewsky / 59547542**. The run created
[issue #37](https://github.com/AndrewGodlewsky/andrew-skills/issues/37) with
caller-authored Markdown, code and `café—中文—🚀`; verified the `question` label;
verified [comment 5755135966](https://github.com/AndrewGodlewsky/andrew-skills/issues/37#issuecomment-5755135966);
read a fresh replacement base and verified an explicit own title/body edit;
then added `documentation` while preserving `question`. Reconciliation of the
previous verified comment returned `present`, without replaying it. All these
helper calls returned exit 0 with structured verified/present evidence; exit
status alone was not the criterion.

Exact payloads/results are in
[the live Windows helper record](skill-submission-windows-helper-live.json).
The [shared fixture record](skill-submission-acceptance-fixtures.md) separately
records **57 passing offline checks**. No ordinary participant, cross-author
live comment or model composition is inferred from either record. Any later
closure of the controlled issue is maintainer cleanup, not helper behavior.

Independent readback confirmed the exact replacement title/body, both labels,
and exactly one comment after reconciliation. Issue #37 was then closed as
separate maintainer cleanup; its content and comment were preserved. No helper
operation closed it.

The published candidate's four issue-submission CI jobs passed on Windows/Linux
with Node 22/24, as did release validation in
[run 35558497205](https://github.com/AndrewGodlewsky/andrew-skills/actions/runs/35558497205).
The separate exporter jobs do not establish this client's acceptance.

## Owner-run client checks

Use a disposable unrelated folder and a clearly identified VS Code profile.
Keep Settings Sync off for the disposable profile. Do not reuse the old 0.1.7
pilot copy as this candidate or silently install a second copy beside it.

1. Press **Ctrl+Shift+P**, run **Chat: Open Customizations**, then select
   **Plugins**. Record the enabled GT source and path. Resolve duplicate or old
   sources before testing; the dependency must come from the selected candidate.
2. If choosing the checkout as a local development plugin, review the effective
   profile settings and register `A:/Claude/andrew-skills` through
   `chat.pluginLocations`, with plugin support enabled. This is a future
   owner-controlled setup step, **not a setting already applied by this report**.
   Alternatively select a native installation verified against the same commit.
3. Record the active VS Code/Copilot/model versions, selected harness and
   execution environment. Complete required sign-in yourself. Record only safe
   actor ID/login from the helper's `read` result; never show a token command.
4. Open a fresh Agent chat. Inspect the `/` menu: `gt:create-issue` should be
   absent, while management screens may still list the skill. Then run the
   caller handoff below without invoking a create-issue slash command.

The current [VS Code plugin documentation](https://code.visualstudio.com/docs/agent-customization/agent-plugins)
documents the customizations entry point and local location mapping. The
[skill documentation](https://code.visualstudio.com/docs/agent-customization/agent-skills)
describes separate manual-menu and automatic-loading flags. These sources guide
the procedure; they do not prove this installed client honors the flags.

### Benign caller handoff

The following is prepared acceptance content, not a proposed product change.
Use a unique run suffix in the title and record it before any write. Do not
repeat a prior request whose outcome is uncertain. This models a caller with
finished content; a future production caller skill is not required or claimed.

> I have finished preparing a benign GT issue for Windows Copilot acceptance
> under AndrewGodlewsky/andrew-skills issue #35. Use the enabled GT submission
> dependency for this handoff. I authorize one new issue in that repository
> with the exact title and body below, and no labels initially. Preserve my
> content and layout. Do not inspect unrelated workspace files. Return the
> resolved skill/resource paths and the verified issue link. If that dependency
> is unavailable or ambiguous, report it without substituting a disk copy.

Title: `[Acceptance #35][Windows Copilot][RUN-ID] Caller content preservation`

Body (copy exactly, replacing only the explicitly chosen run ID in the title):

````markdown
## Context supplied by the caller

This benign acceptance record belongs to GT issue #35. It is not a feature
request and is not evidence that another environment passed.

The caller chose this layout. Preserve “curly quotes”, café, 日本語 and 🧪.

| Input | Expected |
| --- | --- |
| Markdown and Unicode | Preserved |
| Existing caller authority | Reused |

```js
const example = { literal: "$HOME", template: "`not a command`" };
```

- [ ] Read back this exact supplied content.

Reference: https://github.com/AndrewGodlewsky/andrew-skills/issues/35
````

Capture the actual dependency load, reads of its own `references/helper.md`
and relevant label guide, its bundled `scripts/run.mjs` path, safe stdin
execution, read preflight actor, operation outcome and returned identity. A
chat explanation saying it used the skill without observable load/resource
evidence is incomplete. Preserve exact readback (only documented CRLF/LF
normalization is allowed); no token, unrelated file content or private transcript
belongs in the evidence report.

### Remaining scenarios and completion evidence

| Scenario | Procedure / required observation | Current result |
| --- | --- | --- |
| Existing chat | In that same chat, authorize one informational follow-up comment on its verified Windows issue, then inspect resource/path continuity and verified comment link. Do not create a second issue. | Not run. |
| Own edit | Explicitly request a title-only replacement on that own-authored issue using the fresh observed base. Verify exact new title and unchanged body. Then independently request a body-only replacement with supplied complete body/base. | Not run in Copilot. |
| Labels | Request an appropriate existing descriptive label for the acceptance record, such as `documentation`. Verify additive outcome and preservation of existing labels. Do not create labels. Missing/partial results may stay fixture-only. | Not run in Copilot. |
| Fresh chat continuity | Supply the known issue ID and saved result to a fresh chat. Request read-only verification of that prior attempt. Verify correct dependency/resources and no fresh create/comment. | Not run. |
| Unrelated workspace | The benign handoff above occurs in the disposable folder outside this checkout; selected plugin resources stay outside that folder. Record actual workspace and execution location. | Not run in Copilot. |
| Missing content | Give the selected workflow a GT proposal title but omit its body. Expect a short caller-directed missing-content result, no invented content/write. | Not run. |
| Missing authorization | Use an isolated fresh fixture conversation with no standing write grant and a draft-only request. Expect no write and only the missing-authority handoff. Do not label this scenario passed in Andrew's broadly authorized existing conversation. | Not run. |
| Absent / disabled / shadowed | In owner-controlled disposable profile states, test each separately. Capture actual effective source state and expect unavailable, with no guessed on-disk fallback. Restore only the intentionally changed fixture state through supported controls. | Not run. |
| Unrelated request / destination override / quoted instructions | Use offline request capture only for hostile mutation scenarios. Expect no submission anywhere or retargeting; body text remains data. Do not test confinement by writing another repository. Record any model harness separately from existing helper fixtures. | Helper fixtures only; model not run. |
| Missing tools / partial labels / uncertainty | Use controlled offline boundary injection. Capture wording and mutation counts: no blind replay, no manual handoff after uncertainty/security, preserve successful content when labels fail. Do not induce ambiguous live writes. | Helper fixtures only; model not run. |
| Other-author comment | Obtain an explicitly authorized benign target from another participant; add only the authorized informational comment and record verified link. Never attempt a forbidden edit to test refusal. | No target supplied. |
| Ordinary contributor | A contributor runs the flow with their own account/environment and records safe identity/capability evidence. Do not borrow credentials or infer privileges from Andrew's run. | No participant supplied. |

For every run record: timestamp, candidate identity, actual selected resource
path, profile/workspace, active client/model versions, Windows tool versions,
effective actor, input, expected result, actual safe result, links and whether
the case was live, fixture-only or not run. Record any deviation on issue #35
and keep it open. Issue cleanup, if wanted after recording links, is a separate
maintainer action; the create-issue runtime does not close or assign issues.
