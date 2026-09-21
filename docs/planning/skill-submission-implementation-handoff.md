# create-issue — implementation and acceptance handoff

Decision: [Define submission-skill acceptance and implementation handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/31), assigned to Andrew.

Recorded [resolution and execution links](https://github.com/AndrewGodlewsky/andrew-skills/issues/31#issuecomment-5754770315).

**Status: implementation handoff defined; execution issues created. No production skill built by this decision.** The owner-approved [prototype outcome](skill-submission-prototype-notes.md) is the latest scope. This document defines the build tasks and their completion evidence, not another prototype review round.

## What will be built

An installed, model-only `skills/create-issue/` package containing `SKILL.md`, `release.yaml`, the fixed-repository helper and the small references it actually uses. Its header has `user-invocable: false` and `disable-model-invocation: false`. The shared-dependency use case is the reviewed exception to the repository's manual default.

The calling agent supplies all substantive content and structure, with the actual relevant context in descriptions, especially for skill changes. The helper preserves that content. No mandatory body template, content drafting, automatic investigation or human interview belongs in this skill. Reject missing essentials without inventing them; do not reinterpret rejection of prototype Example A as a ban on plain-language ideas.

Supported work is limited to GT submissions in **AndrewGodlewsky/andrew-skills**, including submissions from unrelated workspaces. The initial operations are creation, new comments, explicit own-issue title/body replacements, additive own-issue labels, and bounded read-only verification/reconciliation. Comments may be added to another author's issue. No admin exception permits changing another author's title/body/labels.

Retain `new-skill`, `enhancement-skill` and `inconsistent-skill` with their agreed meanings. Preserve the existing policy for appropriate already-existing descriptive labels on other GT work; do not invent categories or infer maintainer priority/acceptance. Provision only the three agreed new labels once during packaging/setup, after checking current state. They were still absent at this handoff's read-only catalog check. Runtime never creates labels.

Native parent/child and blocker links, Projects, assignments, closing/reopening, comment edits/deletes, arbitrary endpoints and repository overrides are outside the first version. Caller-authored ordinary references remain content. Closed-issue follow-up that needs action creates a new open issue with supplied title/body/reference, not only a comment on the closed issue.

## Build boundaries and order

| Task | Owns | Depends on |
| --- | --- | --- |
| [Build the fixed-repository issue submission helper](https://github.com/AndrewGodlewsky/andrew-skills/issues/33) | Narrow Node/gh transport, operation validation, ownership/recovery logic, offline request-capture tests | This resolved handoff |
| [Package the model-invocable create-issue skill](https://github.com/AndrewGodlewsky/andrew-skills/issues/34) | Actual skill folder, helper bundling, caller instructions/references, three-label setup, README, release metadata and validation wiring | Helper |
| [Verify create-issue in Windows VS Code](https://github.com/AndrewGodlewsky/andrew-skills/issues/35) | Observed model composition, controlled live submission/follow-up, exact source/version evidence | Package |
| [Verify create-issue in Remote WSL and WSL Copilot CLI](https://github.com/AndrewGodlewsky/andrew-skills/issues/36) | Two separately recorded Linux execution/client checks | Package |

Build the helper first, then integrate its actual interface into the skill; do not create parallel implementations or competing interface guesses. After packaging, Windows and WSL acceptance can proceed independently against the same candidate. Use separate evidence files and controlled test issues per environment to avoid overlapping writes. An unavailable WSL environment does not block helper, package or Windows work, but WSL support remains unverified until both WSL client checks pass.

Execution issues are native children of this handoff issue. This planning map's native tracker relationships do not add relationship operations to the runtime skill. Leave execution issues unassigned until claimed. Andrew is the setup/acceptance coordinator; each participant authenticates as themselves. Do not borrow owner credentials to claim contributor support.

## Helper implementation contract

Maintain authored helper modules under `scripts/issue-submission/` and tests under `scripts/issue-submission*.test.mjs`. Packaging copies only required runtime modules into `skills/create-issue/scripts/` using a deterministic build/check script; there is one authored implementation. The deployed folder must run without a checkout, root scripts, tests or planning documents. Do not reuse the archived prototype as production code.

Accept one bounded UTF-8 JSON request on stdin, using shell-free argument arrays for subprocesses. No body text or credential on the command line. Keep the public operations narrow: create, comment, replace title/body, add labels and read/reconcile. Reject unknown operation/transport fields, invalid identifiers and null/ambiguous replacement intent. Explicit replacement includes the caller's observed base content for the fields being replaced; the helper rereads before sending. The implementation owns exact JSON field spelling and must document and fixture-test it before packaging.

The instruction layer establishes GT relevance, substantive caller intent and actual workflow authorization; a boolean in JSON cannot prove those. The helper enforces its own mechanical boundary, not every tool the surrounding agent can use. Use existing authorization without repeated approval loops. Missing authority or content returns to the calling agent.

Capture existing `gh` authentication privately through a pipe with no shell. Never emit a token to a model-visible command result, logs, files or diagnostics. Use one in-memory credential, verify the actual actor ID with it, and surface mismatches with the authorized identity before writing. No automatic login, installation, cross-environment credential reuse or alternate route after a security denial.

Bind HTTPS to `api.github.com`, repository path `AndrewGodlewsky/andrew-skills`, and repository ID **1364861754**. Verify full name/ID, enabled issues and unarchived state. Reject redirects, arbitrary host/repo/base-URL options and unvalidated response/pagination routes. Preserve required TLS/network controls. Caller text, current Git remote, forks, `GH_REPO` and `GH_HOST` must not alter routing. Credential-selection environment variables can change the effective account, so verify that actual account rather than assuming a remembered login.

Read issue targets inside this repository, reject PRs, and compare stable actor and issue-author IDs for replacements/labels. Apply only explicitly requested title/body fields. Freshly check restricted operations even on issues created manually or by other workflows. Authorship eligibility does not grant GitHub permissions.

### Endpoint and concurrency findings

Use issue creation/readback; new-comment POST and comment GET/list; title/body-only issue PATCH; additive label POST and label readback. The documented comment-create response is 201 and fine-grained credentials need write permission for the relevant resource. Comment identities must resolve to the validated issue before reporting success. [GitHub comment API](https://docs.github.com/en/rest/issues/comments#create-an-issue-comment).

GitHub permits issue authors and certain privileged users to edit issues, but this skill deliberately permits only own-authored replacements. Its PATCH allowlist must exclude state, assignees, labels and other general issue fields; use the separate additive label operation. [GitHub issue update API](https://docs.github.com/en/rest/issues/issues#update-an-issue).

The reviewed documentation describes conditional GET caching, not an atomic compare-and-swap contract for issue PATCH. Do not treat an ETag or `updated_at` comparison as an atomic write guard. Reread intended fields, stop on a detected change, then verify results; document that a race can still occur between read and write. A stronger guard requires endpoint-specific evidence before any claim. Respect rate-limit guidance; if the necessary wait exceeds the operation budget, return the remaining work without retrying early. [GitHub REST best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api).

### Initial engineering bounds

These are application defaults for implementation, not claims about GitHub's maximum accepted sizes. Test boundaries and disclose server-side rejection below them. Adjust only with recorded evidence in the implementation issue; do not silently truncate.

| Item | Initial bound |
| --- | --- |
| Runtime target | Node 22 or newer; automated checks on Node 22 and 24. This matches repository validation; live-client compatibility is still pending. |
| GitHub CLI target | 2.90.0 or newer as the initial conservative support floor; no reliance on newer relationship flags. Probe needed commands and record the actual tested version. |
| Request input | 256 KiB encoded UTF-8 JSON total, including any comparison base |
| Content | Title up to 1,024 UTF-8 bytes; each body/comment/base body up to 60,000 bytes; nonempty required content; reject invalid Unicode rather than silently replacing it |
| Label inputs | At most 10 distinct names, each up to 128 UTF-8 bytes; catalog validation and agreed semantic policy still apply |
| HTTP response | 2 MiB maximum buffered body, with a bounded/redacted error summary |
| Request / operation time | 15 seconds per subprocess or HTTP request; 120 seconds total including delays; cancellation preserves any sent-write uncertainty |
| Temporary read retry | At most 3 attempts total per GET within the total budget; no retry of security/auth/policy failures |
| Reconciliation lists | At most 3 pages of 30 items for each relevant list, within the total budget; report incomplete coverage; do not run a broad similarity search |
| Mutations | One send per requested mutation per attempt; serial execution with at least one second between mutations; no automatic replay of ambiguous writes |

The helper passes caller text unchanged. Readback comparison may normalize CRLF/LF only if explicitly documented and tested; any other content change is surfaced, not silently rewritten. A label list exceeding bounded visibility cannot be reported complete.

### Recovery and result contract

Return structured, bounded, credential-free results for each operation: not submitted, existing target selected with no new material saved, rejected, acknowledged with verification incomplete, verified, partial, uncertain, conflict or security stop. Preserve target IDs/links and available evidence; mark unverified links. Distinguish “present now” from proof that this attempt caused it. An exit code alone is insufficient evidence of delivery.

No persistent receipt/cache/state directory or hidden tracking marker. Keep evidence in the active operation/conversation. Known uncertainty about the same request prevents a fresh create/comment and prevents an unqualified manual resubmit handoff. If an identity was acknowledged, read that exact target. Otherwise use bounded relevant reads; identical text or no result does not settle attribution. No exactly-once or durable recovery guarantee is offered.

Missing Node/gh/resources can return the prepared content, intended labels and `https://github.com/AndrewGodlewsky/andrew-skills/issues/new`, explicitly not submitted, only when no unresolved write or security stop blocks that route. Actual denial stops further actions under the active user's security rules. Label failure never erases successful creation; resume only missing authorized labels after fresh ownership/state checks.

## Package and release requirements

Use [CONTRIBUTING.md](../../CONTRIBUTING.md) as the authoring standard. New skill version is `1.0.0`; bump root and marketplace plugin patch once from the actual implementation base (currently both `0.1.7`, so `0.1.8` only if that base remains unchanged). Do not bump existing skill releases or version this planning-only change.

Keep discovery wording specific to GT submissions and caller handoff; make the fixed destination explicit even for copies installed elsewhere. Bundle the agreed label meanings and helper usage/results only where they are needed. No runtime imports of local planning docs, personal paths or undeclared future caller skills. Callers explicitly resolve the installed GT dependency; absence, disabling or shadowing yields an unavailable result, not a guessed tool fallback.

Do not declare the package generally portable to other repositories. Relative helper resources can travel, but its GT destination must remain fixed. Review rename/export behavior against the existing exporter, including its conservative path/dependency checks. If export eligibility cannot be proven, report that limitation; do not relax exporter guards or change restore behavior as incidental work. Personal copies must never redirect their issue destination.

Run the authoring guide's structural/release checks against a freshly verified published base, plus the new helper tests and generated-bundle check. Integrate meaningful offline tests into CI without requiring secrets or live mutations. Request-capture tests inject transport internally; the shipped command must not expose a test-host override.

## Definition of ready

Ready to implement when the accepted scope/contracts and this handoff are available, each execution issue has concrete ownership boundaries and blockers, and no new owner policy choice is required. Node/gh/client setup for future live tests can remain incomplete without blocking offline implementation. Before coding, inspect the current tree and preserve unrelated uncommitted work.

## Definition of done and evidence

**Helper done:** meaningful offline request-capture and failure tests pass; all emitted routes are fixed; payload, authorship, authorization-boundary documentation, result readback, limits and recovery checks match the contract. Test Windows/Linux and supported Node versions in CI; local results and unrun CI jobs are reported separately. No actual model/client compatibility is inferred.

**Package done:** `skills/create-issue/` exists with complete self-contained resources and release metadata; bundled helper matches authored source; README/discovery and validation wiring are updated; the three labels exist or any setup block remains explicit and keeps that task incomplete. Model-only exception and ownership/failure boundaries are recorded. The working-tree package is reviewable without committing or publishing it.

**Each client accepted:** record candidate identity (published commit if available, otherwise uncommitted status plus exact package file hashes), installed source path, client/Copilot version, Node/gh version, OS/distribution, effective actor and execution location. Record the caller request, expected behavior, actual loading/resource evidence, verified live issue/comment links, failures and unrun checks. Never store tokens or unrelated private context.

Exercise in fresh and existing chats: model-initiated GT dependency loading, absent/disabled/shadowed dependency, no manual slash-menu entry, valid GT submission from an unrelated workspace, unrelated-work refusal, argument/body redirection, missing authorization, content/Unicode preservation, own-issue follow-up and appropriate incomplete-label/manual/uncertain result wording. Use richer caller-authored samples, not the rejected prototype paragraph. Host approvals remain real; no fabricated consent.

Run controlled authenticated creation and representative comment/own-edit/label readback only in the fixed repository with benign content. Model-level misuse/refusal checks can use offline fixture transport, provided the report distinguishes them from real writes. Ordinary-submitter permissions need that participant's own authorized evidence or remain an explicit gap; do not weaken privileges or borrow credentials to manufacture coverage. Do not edit another real author's issue to test refusal—capture the request boundary offline and use authorized read-only targets for client checks.

Use clearly identified test issues per environment, reconcile uncertain sends before any retry, and record links before any separately authorized cleanup. A helper cannot assign/close its acceptance issues; maintainer cleanup is a separate workflow. If a client exposes unsupported flags, cannot load bundled resources, or fails the fixed-target path, the client task stays open for the specific failure.

**Feature acceptance done:** helper and package checks pass, Windows VS Code is observed, and both Remote WSL and WSL Copilot CLI are observed. Missing WSL is a tracked environment gap, not a pass or a reason to stop Windows implementation. Publishing and broad compatibility claims remain separate owner actions.

## Existing evidence and gaps

Prior local evidence: Node 24.15.0, gh 2.90.0, VS Code 1.138.0 and Copilot CLI 1.0.83 inventories/pilot observations. Those exact observations did not execute this new skill. Re-inventory actual acceptance environments instead of freezing old client versions as universal supported minima.

No ordinary developer WSL distribution or authenticated new-skill client run has been established here. Andrew coordinates any missing installation/sign-in; the execution agent may inventory and prepare the instructions, but must not bypass security failures or silently install/configure an environment. Reuse [Complete the owner pilot and team adoption readiness checks](https://github.com/AndrewGodlewsky/andrew-skills/issues/17) only for relevant setup/evidence; neither it nor unrelated export/versioning work is a blanket dependency.

The planning decision can close once the execution issues/dependencies exist and this handoff is recorded. That closure does not mean the production skill exists, is installed, published or client-accepted.
