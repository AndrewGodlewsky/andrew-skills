# Bundled helper protocol

Read before executing [the entry point](../scripts/run.mjs). Resolve its absolute
path from this installed resource, including spaces. Its sibling modules are
required. No checkout, package installation, Git executable or other skill is
needed. Node 22+ and an already authenticated GitHub CLI 2.90.0+ must be available
in the same selected environment. These are prerequisites, not claims that a
particular Copilot client or runtime combination has passed acceptance.

## Execute safely

Use the host's structured process API: executable `node`, argument array
containing the resolved entry-point path, `shell: false`, and one UTF-8 JSON
request on stdin. Close stdin afterward. Capture stdout as one JSON result and
inspect it even when exit status is 1. `--help` is the only accepted argument and
does not authenticate. Do not interpolate supplied text into shell code, put
content/credentials on argv, or run a token command with agent-visible output.

If only a shell tool is available, first write the request as a UTF-8 data file
using a file tool. Use a small fixed Node launcher with `spawnSync`/`spawn`, an
argument array and `input: readFileSync(requestPath)` (or a stdin pipe). Both
paths must be supplied as data, properly quoted for the selected shell, never
constructed from issue content. Keep any temporary request file in an authorized
private workspace and remove only that task-owned file when no longer needed;
the helper creates no files. If no safe stdin facility exists, report the missing
capability rather than emitting an unsafe shell command.

Every request has `version: 1` and `operation`. Mutations also require `actorId`
(the observed positive safe integer), `scope: "gt"`, and `authorized: true`.
These assertions describe actual workflow context, not a permission mechanism.
Never assume the repo owner is the authenticated actor.

Start with `{"version":1,"operation":"read"}`. This reads the selected account
and verifies the repository without writing. Optional `actorId` checks the
expected account; optional `issue` returns an issue snapshot for a replacement
base. A null remote body becomes an empty string. Oversized/invalid remote text
is omitted with an explicit reason and must not be used as a replacement base.

All requests bind to github.com's **AndrewGodlewsky/andrew-skills**, repository
ID **1364861754**, via api.github.com. Account lookup is the only non-repository
route. No caller-selected host/repository or redirect is supported. GH_HOST and
GH_REPO cannot retarget this helper. This boundary confines this helper, not
every tool the host makes available.

## Operations

| Operation | Additional fields and behavior |
| --- | --- |
| `create` | Nonempty `title`, `body`; optional `labels`. Creates and verifies an issue before attempting labels separately. Optional `followUpTo` is an existing GT issue number whose canonical URL or `#number` must already appear in the supplied body. |
| `comment` | `issue`, nonempty `body`, and `intent` equal to `informational` or `actionable`. Authorized new comments may target another author's issue. For a closed actionable target, also supply `followUp` with `title`, `body`, optional `labels`; its body must already reference the old issue. This creates a new open issue instead of posting the original comment. Authority must cover that creation. |
| `replace` | `issue`, `changes`, `base`. Both objects contain exactly the same nonempty subset of `title` and `body`. Changes are nonempty strings; a base body may be empty. Current author must equal the actor. Fresh comparison prevents detected stale edits; readback verifies requested fields. Concurrent edits between read and write remain possible: this is not atomic compare-and-swap. |
| `labels` | `issue`, nonempty `labels` array. Requires own authorship and observed repository capability. Catalog/current-label reads must be complete. Adds only missing existing labels and preserves the current set. No label provisioning. |

Example shape only: replace the placeholder ID with the actor from `read` and
use the caller's real content and authority. Do not treat this as a body template.

```json
{
  "version": 1,
  "operation": "create",
  "actorId": 123,
  "scope": "gt",
  "authorized": true,
  "title": "Caller-prepared title",
  "body": "Caller-prepared content with its actual context and chosen layout.",
  "labels": ["enhancement-skill"]
}
```

No operation edits/deletes comments, changes another author's issue text,
reopens/closes issues, changes assignees, creates native relationships or updates
Projects. Ordinary body references are preserved as supplied. Labels are
optional on create; their failure must not repeat successful content submission.

## Recovery without replay

If the request was attempted, add `previous` to the original envelope, with
`status` equal to `uncertain`, `acknowledged` or `verified`; supply known `issue`
and `comment` IDs. Optional `operation` records the actual previous operation
(e.g. a closed actionable comment became a create). Optional `since` is an ISO
UTC timestamp. This routes to read-only reconciliation, never another mutation.

Alternatively use `operation: "reconcile"`, `actorId`, and an `attempt` object:

```json
{
  "version": 1,
  "operation": "reconcile",
  "actorId": 123,
  "attempt": {
    "operation": "comment",
    "status": "uncertain",
    "issue": 7,
    "body": "Exact caller-supplied text that may have been posted.",
    "since": "2026-09-21T00:00:00Z"
  }
}
```

Attempt operations are `create`, `comment`, `replace`, `labels`. Non-create
attempts require the known issue. Include a known comment ID and expected
title/body/labels when relevant. Known identities are read directly. Otherwise
bounded lookups produce candidates, not proof of delivery or non-delivery.
Matching expected state at a known target is `present`, without attribution to
this attempt. Empty or truncated searches remain uncertain. Read-only recovery
does not automatically repair labels or submit missing content. Preserve all
available evidence in the workflow; no persistent receipts, caches, markers or
exactly-once guarantee exist. Losing evidence can permit duplicate independent
calls; never deliberately discard evidence to retry.

## Interpret and report

The result includes `version`, fixed `repository`, aggregate `status`, verified
`actor` when available, and `operations`. Each operation retains its own status,
known issue/comment identities, canonical URL, verification flag and detail.
Return those separate outcomes even if a later operation fails.

| Status | Meaning / next step |
| --- | --- |
| `not_submitted` | No submission for this operation; inspect the missing/invalid prerequisite. |
| `rejected` | The request was rejected; inspect safe detail, do not automatically replay. |
| `acknowledged` | A write was acknowledged but verification is incomplete; preserve evidence and reconcile only. |
| `verified` | This operation was verified; report its link and any separate incomplete operations. |
| `present` | Expected state observed now, without attributing creation to this attempt. |
| `partial` | Some work succeeded and another step did not; report both. |
| `uncertain` | Delivery remains unknown; read-only reconciliation, no manual or automatic resubmit. |
| `conflict` | Requested replacement base no longer matches; return for resolution from a fresh read. |
| `security_stop` | Halt and return control with safe detail; no alternate account/tool/environment or bypass. |

The aggregate prioritizes security/uncertainty and can be `verified` when all
operations are verified/present. Exit 0 corresponds to a verified/present
aggregate; exit 1 does not mean that nothing was saved. If the process ends
without a usable result after a possible send, retain uncertainty and reconcile;
never infer non-delivery from cancellation, timeout or missing stdout.

For a genuinely missing prerequisite on a fresh create, `manual` can carry the
unchanged title/body/labels and fixed new-issue page, explicitly not submitted.
Known uncertainty and security stops suppress this. Missing Node itself must be
reported by the caller because the helper cannot run without it.

## Credentials and limits

The helper privately captures the existing gh credential once, with no shell,
and keeps it only in memory. Never call that token acquisition yourself or expose
its stdout. Raw remote/CLI diagnostics are withheld and the selected token is
redacted from result serialization. No automatic installation/login/account
fallback or credential copying occurs. TLS verification and trusted-CA
configuration stay enabled. Configured HTTP(S)/ALL_PROXY environments stop
before authentication: proxy integration is not implemented. Do not unset a
required proxy or otherwise bypass this stop.

Application bounds: request 256 KiB UTF-8 JSON; title 1,024 bytes; body/comment/base
body 60,000 bytes; 10 distinct labels of 128 bytes; response 2 MiB. Unknown fields,
invalid Unicode and oversized content are rejected, not silently rewritten or
truncated. Sent text is unchanged; verification alone normalizes CRLF to LF.

Requests/subprocesses have 15-second deadlines within a 120-second operation
budget. Reads have at most three attempts; relevant lists at most three pages of
30 items. Rate-limit waits must fit the budget. Security denials are not retried.
Mutations are serial, at least one second apart, and each is sent at most once.
Reporting failure never triggers another write or background polling.
