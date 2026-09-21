# GT fixed-repository submission helper

Implementation for [Build the fixed-repository issue submission helper](https://github.com/AndrewGodlewsky/andrew-skills/issues/33). This is the authored helper. Run `node scripts/build-issue-submission.mjs` from the checkout root to bundle its five runtime modules under `skills/create-issue/scripts/`; use `--check` to verify freshness without writing. Installed usage is documented in the skill's self-contained [helper reference](../../skills/create-issue/references/helper.md). Do not edit generated runtime copies manually.

Run `node scripts/issue-submission/run.mjs` with **one UTF-8 JSON request on stdin**. No positional arguments, repository/host flags or test-host environment setting are accepted. `--help` does not authenticate or write. Do not interpolate issue text into shell code, put bodies/tokens on the command line, or run an authentication command whose secret stdout is visible to the agent. Use the host's structured process API with argument arrays and a stdin pipe. A UTF-8 file prepared by the caller can be fed to that pipe; the helper itself creates no files.

Requires Node 22+ and existing authenticated GitHub CLI 2.90.0+ in the selected Windows or Linux environment. There is no npm dependency, checkout requirement, automatic installation/login or cross-environment fallback. Initial local checks use Node 24.15.0 on Windows; Node 22/Linux CI and actual Copilot client evidence belong to downstream integration/acceptance and are not claimed here.

## Request envelope

Every request has `version: 1` and an `operation`. Mutations require `actorId` (a positive safe integer), `scope: "gt"` and `authorized: true`. These are caller assertions about an already-established workflow, not a substitute for actual relevance/consent/host permission. The instruction layer must reject unrelated work and missing authority. The helper verifies the selected credential's account against `actorId`; it does not assume the owner account or accept a username as authorship proof.

Use `{"version":1,"operation":"read"}` to discover the actual actor and verify the fixed repository without writing. Read can also take `actorId` and/or `issue`. An issue read returns a snapshot for an explicit replacement base. It reports that no new material was saved. Null remote bodies become empty base strings. Remote text beyond the helper's content bounds (or invalid Unicode) is explicitly omitted with a reason, never silently truncated or usable as a replacement base.

There is no repository argument. Every API request binds to `api.github.com/repos/AndrewGodlewsky/andrew-skills` (plus `/user` for identity), pinned repository ID 1364861754. Public links use that repository on github.com. Current checkout, forks, GH_HOST/GH_REPO, quoted body instructions and arbitrary URLs cannot retarget it. Redirects are refused. The helper confines its own requests, not other tools available to an agent.

### Create

```json
{
  "version": 1,
  "operation": "create",
  "actorId": 123,
  "scope": "gt",
  "authorized": true,
  "title": "Caller-authored descriptive title",
  "body": "The caller supplies the actual relevant context and its own layout.",
  "labels": ["enhancement-skill"]
}
```

The account ID above is a placeholder, not an account to impersonate. Title/body are required nonempty strings. Labels are optional, additive, and applied only after verified creation with separate results. Label names must already exist in the bounded catalog lookup. The skill's semantic policy selects appropriate labels; the helper cannot mechanically judge their meaning or GT relevance. No labels, native relationships or Projects are created by this helper. Catalog absence or unavailable organization capability produces an incomplete label result without another issue creation.

Optional `followUpTo` identifies an existing issue in this repository. Its canonical URL or `#number` reference must already be in the caller's body; the helper validates rather than inserts that reference. It creates no native edge.

### New comment

Supply `operation: "comment"`, `issue`, nonempty `body`, and `intent: "informational"` or `"actionable"`, plus the mutation envelope. Authorized new comments can go on any author's issue. Comment editing/deletion is not supported.

When the target is closed and intent is actionable, supply `followUp: {"title":"...","body":"...","labels":["..."]}`. The workflow authorization must cover that requested new issue. The follow-up body must contain the old issue reference. The helper creates/verifies an open issue and does not post the original comment, reopen the old issue or add an automatic backlink. Without new-issue content it returns missing input and saves nothing. An informational comment can remain on a closed issue.

### Explicit replacement

Supply `operation: "replace"`, `issue`, `changes` and `base`, plus the envelope. Each object contains exactly the same nonempty subset of `title` and `body`. `base` is the caller's observed prior text; changes contain the intended nonempty replacement. A previously null body is represented as an empty base body. No other PATCH fields are accepted. The current issue author must equal the authenticated actor, regardless of admin privileges.

The helper freshly reads and compares the requested fields. A detected intervening change returns `conflict` without PATCH. After sending, readback checks the requested content. This is not atomic compare-and-swap: concurrent edits between read and write remain possible. A later caller observes fresh state rather than retrying with a stale base.

### Add/resume labels

Supply `operation: "labels"`, `issue` and a nonempty `labels` array, plus the envelope. Requires own-authorship and observed organization capability. Skip requested labels already present; add only missing labels using the additive endpoint, then read back. Never replace the existing label set. Incomplete catalog/current-label visibility is reported explicitly. No labels are automatically provisioned at runtime.

### Read-only reconciliation

Add `previous: {"status":"uncertain|acknowledged|verified","issue":7,"comment":80}` to the original request when this request has already been attempted. Status is one of those literal values, not the pipe-separated example. Optional `operation` identifies the actual previous operation when different, e.g. a closed actionable comment created a new issue. Optional `since` is an ISO UTC timestamp. Known evidence always routes to read-only reconciliation; no mutation is sent again. Keep content expectations and identity evidence in the active conversation. Do not clear `previous` merely to evade uncertainty.

Alternatively use:

```json
{
  "version": 1,
  "operation": "reconcile",
  "actorId": 123,
  "attempt": {
    "operation": "comment",
    "status": "uncertain",
    "issue": 7,
    "body": "Exact caller-supplied comment that may have been posted.",
    "since": "2026-09-21T00:00:00Z"
  }
}
```

Attempt operations are create/comment/replace/labels. Non-create attempts require the known issue. Supply comment identity when available, expected title/body or labels when relevant. An acknowledged identity is read directly. Without one, lookups are limited to the actor's relevant issues or comments on the known issue. A known target with expected content produces `present`, explicitly without attribution; matching search candidates or an empty/truncated search remain uncertain. Read-only reconciliation never automatically submits missing content, repairs labels or offers an unqualified manual resubmit shortcut.

There is no persistent receipt, state directory, cache or body/comment marker. New independent calls without previous evidence can create similar issues; this is not an exactly-once service. Callers must preserve available evidence and act on uncertain outcomes. The helper cannot detect lost context or mechanically prove two requests are the same intent.

## Results, failures and credentials

One JSON result is written to stdout: version, fixed repository, aggregate status, verified actor when available, and an `operations` array. Each operation preserves its own status and available issue/comment identity, canonical URL, verification flag and concise detail. Aggregate status prioritizes security stops/uncertainty; successful earlier operations remain in the array. `partial` means some work succeeded and another step did not. A read-only `present` operation means the expected state was observed now, not that this attempt created it.

Statuses include `not_submitted`, `rejected`, `acknowledged` (write acknowledged; verification incomplete), `verified`, `present`, `partial`, `uncertain`, `conflict` and `security_stop`. Exit 0 indicates verified/present aggregate results; exit 1 requires inspecting the JSON. Never infer delivery solely from exit code. Reporting failure never triggers another mutation.

Creation/comment acknowledgements preserve validated returned identities even if later readback fails. An accepted response with malformed identity remains acknowledged but unverified. A timeout after send remains uncertain. No mutation is automatically replayed. Rejections, security controls and incomplete reads are not interchangeable. All authentication/permission/TLS/execution-policy failures stop further work; no alternate account/tool/environment is attempted.

For a genuinely missing prerequisite on a fresh create, the result can include `manual` with unchanged prepared title/body/labels and the fixed `/issues/new` page, explicitly not submitted. A prior uncertain attempt or a security stop suppresses that handoff. Missing Node itself must be explained by the calling skill since an absent runtime cannot execute this command.

The runtime captures `gh auth token --hostname github.com` privately once, without a shell, and uses that in-memory credential throughout. CLI stderr and raw remote errors are not reported. Result serialization redacts the selected token even if a response reflects it. No credential is written to disk. Existing authentication configuration is read by gh; the helper does not configure or copy it.

TLS verification stays enabled. Configured HTTP(S)/ALL_PROXY environments currently stop before authentication because proxy integration has not been implemented or verified; the helper must not bypass a configured organizational proxy. This is a disclosed limitation, not permission to unset a proxy. Existing trusted-CA configuration remains in place.

## Bounds and tests

Application bounds are not GitHub service maxima: request 256 KiB UTF-8 JSON; title 1,024 bytes; each body/comment/base body 60,000 bytes; 10 distinct labels of 128 bytes each; HTTP response 2 MiB. Invalid Unicode, unknown fields and oversized content are rejected, never silently truncated. Payload text is sent unchanged; only verification comparisons normalize CRLF to LF. No other text normalization occurs.

Subprocess/HTTP requests have a 15-second deadline, with a 120-second operation budget. GETs have at most 3 attempts; relevant lists have at most 3 pages of 30 items. Rate-limit waits must fit the total budget. Actual security denials are not retried. Mutations are serial, at least one second apart, one send per requested mutation; no background polling. CLI input/cancellation is bounded too.

Run `node --test scripts/issue-submission*.test.mjs` from the repository root. Tests inject process/network/time boundaries internally and require no credentials or live mutations. The command exposes no such injection controls. No actual GitHub write, Copilot invocation or WSL compatibility claim follows from an offline pass.
