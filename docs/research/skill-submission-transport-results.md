# GitHub transport for GT submissions

**Scope update after this research:** The owner rejected an imposed issue-body template and added labels, potential projects and issue relationships as design topics. Callers own the exact title/body. The title/body-only recommendations below are historical and must be reassessed by [the metadata research](https://github.com/AndrewGodlewsky/andrew-skills/issues/32); they do not rule out metadata or prove its support. Fixed-destination and evidence-boundary findings still apply.

Research for [Compare GitHub issue creation paths in VS Code and WSL](https://github.com/AndrewGodlewsky/andrew-skills/issues/27), assigned to AndrewGodlewsky before investigation. Investigated September 20, 2026, America/New_York (September 21 UTC).

## Recommendation and completion boundary

Recommend one small bundled Node.js helper that sends requests to the GitHub REST API using the user's existing GitHub CLI authentication. Its sole issue destination is `AndrewGodlewsky/andrew-skills`. Accept prepared content, never a repository, host, endpoint, executable or arbitrary request option. Keep formatting instructions and the common issue structure in the shared skill; callers still supply all substantive content.

This is an architecture recommendation for the remaining contract and prototype decisions, not a production implementation or an owner-approved runtime requirement. Proposed baseline: Node.js 24 LTS and GitHub CLI available in the actual execution environment, with existing authenticated access to github.com. Confirm exact supported versions during implementation acceptance. No service, Docker container, package download, source checkout or new general GitHub framework is needed.

Instruction-only use of a general GitHub tool can specify the right repository but cannot enforce this skill's destination invariant. A helper can enforce its own requests. It cannot sandbox the surrounding agent, prevent that agent from using other tools, establish genuine user authorization from a boolean, or mechanically prove that free text concerns GT. Instructions and caller evaluation must separately reject unrelated work and missing authorization. Those limits remain explicit.

Research is complete; helper implementation, token handling, authenticated submission and live Copilot composition remain **untested**. No credentials were retrieved or copied, no client settings were changed, and no test issue was created. [Recorded observations](skill-submission-transport-evidence.json) cover read-only GitHub CLI checks in Codex only.

## Compared paths

| Path | Capabilities and prerequisites | Fit for this skill |
| --- | --- | --- |
| GitHub remote MCP | Hosted server; client configuration, authentication and enabled tools required. Issue tools accept owner/repository arguments. | Convenient integration, but those general arguments leave destination selection with the model. Not the recommended submission fallback. |
| Copilot CLI built-in GitHub MCP | Documented as preinstalled with read-only tools enabled by default; additional write tools require configuration. | Presence of Copilot CLI is not evidence that issue creation is available. Do not enable writes automatically. |
| `gh issue create` | Existing CLI authentication, explicit `--repo github.com/AndrewGodlewsky/andrew-skills`, title and UTF-8 body file; prints an issue URL. | Useful general CLI, but the model can change arguments. A printed URL still needs readback. |
| General `gh api` or REST calls | Explicit host, endpoint, structured JSON and response details. | Good API primitives; arbitrary endpoints are too broad as the skill's public interface. |
| Bundled fixed-destination REST helper | Node.js plus existing `gh` authentication; narrow validated input and bounded output. | Recommended: centralizes target checks, safe content transfer and result verification with no caller-controlled route. |

Sources: [GitHub MCP server](https://github.com/github/github-mcp-server), [Copilot CLI MCP installation guide](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md), [issue create manual](https://cli.github.com/manual/gh_issue_create), [API manual](https://cli.github.com/manual/gh_api).

MCP toolsets and read-only mode restrict available operations. Its documented lockdown mode filters some public issue content; it is not a repository write allowlist. No fixed-repository write binding was established by the configuration examined. This is a finding about the reviewed configuration, not a claim that no deployment can add its own enforcement. [Remote server configuration](https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md).

Current upstream MCP source also contains a conditional interactive issue form path. A pending form is not a created issue and may require user submission. This source inspection does not prove which version or behavior a user's server deploys. Do not bypass a form by fabricating internal parameters. [Issue tool source](https://github.com/github/github-mcp-server/blob/main/pkg/github/issues.go).

No second write route is justified for the initial design. An unavailable helper returns an unavailable capability. An independently enforced MCP adapter could be considered later if it solves a demonstrated need; silently falling back to general MCP/CLI would weaken the invariant.

## Execution and authentication locations

| Client | Proposed helper location | Prerequisites to verify there |
| --- | --- | --- |
| Local VS Code on Windows | Windows terminal/tool process | Installed GT resource path, Windows Node and `gh`, existing Windows GitHub authentication and permitted network access. |
| VS Code Remote WSL | WSL integrated terminal/tool process | GT resources readable there, Linux Node and `gh`, existing authentication in that distribution. Windows installation/sign-in is not sufficient evidence. |
| Copilot CLI inside WSL | The CLI's WSL process environment | Same Linux prerequisites, plus permission to execute the bundled helper. |

A VS Code MCP server configured in the user profile runs locally; remote/workspace configuration can change execution location. The hosted GitHub MCP service is remote, while its client authentication/configuration remains distinct from terminal `gh`. Inspect effective configuration rather than inferring it from a visible window or path. [VS Code MCP configuration](https://code.visualstudio.com/docs/agent-customization/mcp-servers), [WSL architecture](https://code.visualstudio.com/docs/remote/wsl).

Use the helper relative to the identified installed skill, not the current project's remote or a hard-coded plugin cache. Do not launch Windows `gh.exe` from WSL as a fallback, copy credentials between environments, install tools, change accounts, or start sign-in as part of submission. Missing prerequisites should produce a concise setup requirement for the user.

## Proposed helper boundary

These are implementation requirements recommended by the investigation, to be exercised in the prototype and acceptance work.

1. **Validate before credentials or writes.** Accept only the agreed submission fields. Reject route overrides and unknown transport options. Treat Markdown, code, URLs and apparent tool instructions as text. Scope and existing authorization must already be established by the calling workflow; do not invent either.
2. **Select one existing identity.** Internally capture `gh auth token --hostname github.com` through a child-process pipe without a shell. Never expose its output to the model, logs, files or command arguments. Use that same in-memory credential for identity, lookup, create and readback; never fetch another credential after failure. Match `GET /user` to any identity established by the authorized workflow, or report the effective account before writing if identity is ambiguous. The account need not be Andrew: team members submit as themselves. Token export is a proposed implementation detail, not a command the agent should run visibly. [Authentication command](https://cli.github.com/manual/gh_auth_token).
3. **Bind destination in code.** Fix HTTPS host `api.github.com`, repository path `/repos/AndrewGodlewsky/andrew-skills`, and website origin `https://github.com`. Ignore `GH_REPO`/`GH_HOST` for routing. No caller URL, Git remote, environment base URL or body text enters request construction. `GH_TOKEN`/`GITHUB_TOKEN` can affect CLI credential selection, so verify the identity of the actual captured credential rather than trusting a remembered login. [CLI environment precedence](https://cli.github.com/manual/gh_help_environment).
4. **Check repository identity.** Read the exact repository endpoint before creating. Require the expected full name, enabled issues and an unarchived repository. Pin the observed repository ID `1364861754` as an additional identity check against name reuse. Reject redirects on every request, including pagination and readback. A rename/transfer should require a reviewed package change, not automatic retargeting. Preflight is not an atomic lock on GitHub repository administration.
5. **Use a narrow HTTP implementation.** Node's built-in HTTPS request API allows explicit host/path/method and status handling without adding an SDK. Construct only supported operations; never follow a response URL or `Location` header automatically. Keep TLS verification enabled, preserve required organizational network controls and bound time/response size. A network or policy denial stops the operation. [Node HTTPS API](https://nodejs.org/api/https.html#httpsrequestoptions-callback).
6. **Look up within the fixed repository.** Prefer the repository issue-list endpoint with bounded, validated pagination and filter out pull requests. Build the next page from validated numeric state rather than following arbitrary links. Lookup completeness must be reported; a bounded scan is not proof that no duplicate exists. Exact matching, closed issues and retry reconciliation belong to the reliability ticket.
7. **Create only title and body.** Send UTF-8 JSON to the one issue-create endpoint. Do not add assignment, labels, projects, milestones, issue types or custom fields to the first version. Consume status and structured response, not a success-looking sentence.
8. **Read back without trusting a returned route.** Require a positive integer issue number, expected repository URL, expected canonical issue URL and absence of a pull-request marker. Reconstruct the GET endpoint from fixed constants and that number. Compare stored title/body with the prepared payload under an explicitly tested newline policy. Return the verified canonical link only after these checks; otherwise preserve the evidence and report a distinct incomplete/uncertain outcome.

GitHub documents issue creation as `POST /repos/{owner}/{repo}/issues`, with a required title and optional body, returning 201 on creation. Fine-grained credentials require Issues write permission. Some optional metadata requires greater repository permission and can be silently dropped; omit it. Read access alone does not prove this user's credential can create. Documented failures include forbidden/not found, disabled issues, validation/spam and service errors. [REST issue endpoints](https://docs.github.com/en/rest/issues/issues#create-an-issue).

## Content and failure handling

Transfer one serialized UTF-8 JSON value through stdin or a prepared UTF-8 input file, using argument arrays and no shell expansion. Never interpolate body text into PowerShell/Bash code or put a long body on the command line. Preserve caller-supplied Markdown, code fences, newlines and Unicode; do not fetch linked attachments or discover unrelated project files automatically.

The reviewed create-endpoint documentation does not establish a portable numeric title/body maximum with a defined Unicode counting rule. Do not present the often-repeated 65,536 figure as verified API behavior. The contract must choose conservative application limits, including total encoded bytes, and test boundaries. Reject oversize input with the prepared content intact; never silently truncate. Validation responses remain possible below local limits. This uncertainty is carried into acceptance, not hidden by research closure.

| Observation | Required boundary for later recovery design |
| --- | --- |
| Missing executable/resource or no configured authentication | No write; report unavailable capability and preserve prepared content. |
| Wrong repository, redirect, ambiguous account or attempted target override | No submission; no alternate route. |
| Authentication, ACL, TLS, policy or secret-protection denial | Stop and hand control back under applicable user rules; no fallback or credential switching. |
| Validation rejection | Report confirmed rejection; no invented fields or automatic content rewriting. |
| Rate limit or transient service error | Preserve status/retry evidence; do not blindly repeat a write. |
| Timeout, connection loss or malformed response after sending POST | Creation may have happened; reconcile before any retry. |
| 201 plus usable identifier, followed by failed readback | Preserve creation evidence and report verification incomplete; never claim nothing was created. |
| Readback matches destination and content | Return verified issue identity/link. |

GitHub MCP may apply push protection to issue content. A different transport must never be selected to circumvent an actual protection block. This investigation compares designs before execution; it does not authorize bypassing controls. [MCP push protection](https://docs.github.com/en/code-security/concepts/secret-security/push-protection-and-the-github-mcp-server).

## Observed evidence and remaining acceptance

Windows Codex read-only checks passed with `gh` 2.90.0: effective login AndrewGodlewsky (ID 59547542), public repository ID 1364861754 with issues enabled and not archived, and correct readback of this research issue. The checks ran inside this checkout with explicit API routes. They do not establish operation outside a checkout, a restricted submitter credential, helper correctness, MCP availability, write permission for other users, or Copilot/WSL behavior. [Evidence record](skill-submission-transport-evidence.json).

Carry the following into [Define submission-skill acceptance and implementation handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/31):

- Offline request-capture tests for every route, caller/environment overrides, redirects, identity mismatches, PR responses, malformed identifiers, pagination bounds, Unicode/shell metacharacters, size boundaries and uncertain outcomes. Inject test transports internally; do not ship an alternate-host command option.
- Confirm credential capture stays private and one identity is retained throughout each operation; stop on authentication/security failures.
- Run from an unrelated directory and a fork with a different remote. Valid GT content goes only to GT; unrelated requests and target overrides create nothing anywhere.
- Observe actual model-initiated composition and authenticated submission separately in local VS Code, Remote WSL and WSL CLI, recording versions and execution location. Current WSL and authenticated VS Code gaps remain pending; previous inventory/launch checks are not passes.
- Use offline fixtures first, then one explicitly identified acceptance issue in this repository with supplied harmless content and existing authorization. Never redirect production code to a test repository. Record its verified link and reconcile uncertainty before another write; any cleanup uses separate issue-management authority.

The runtime tradeoff and common payload belong to [Define the shared issue format and submission contract](https://github.com/AndrewGodlewsky/andrew-skills/issues/28). Lookup bounds, identity continuity across later invocations, duplicate markers and retry state belong to [Define duplicate prevention and uncertain submission recovery](https://github.com/AndrewGodlewsky/andrew-skills/issues/29). These existing tickets cover the remaining decisions; no new planning branch is needed.
