# create-issue organization and troubleshooting research

Research for [Verify labels, projects and issue relationships for shared issue creation](https://github.com/AndrewGodlewsky/andrew-skills/issues/32), assigned to AndrewGodlewsky before investigation. This consumes the [settled caller contract](../planning/skill-submission-contract.md).

## Conclusion

Keep the fixed-repository helper, with separate creation and additive organization steps. Ordinary users can submit public issues but cannot be assumed to apply labels, parent/child links or blockers. Return a verified created issue with precise outstanding organization when needed. This is the partial-success behavior already accepted by the owner, not a new approval requirement.

For missing local prerequisites, support an agent-facing troubleshooting result and a manual browser handoff to the fixed repository. No automatic general MCP, shell or credential fallback is justified by this research. Projects stay outside the initial implementation.

The research question is resolved. Production implementation, ordinary-contributor writes, private credential capture, model-only composition and Windows/WSL acceptance remain untested. No submission test, metadata test write, label provisioning, project configuration, token retrieval or authentication change occurred. Issue assignment and eventual research-record updates are administrative work, not feature acceptance.

## Permission and capability matrix

Account access, token permissions and workflow authorization are separate conditions. A token cannot grant its owner repository privileges they do not possess. Fine-grained PATs also have documented gaps for contributions to public repositories where the user is not a member and for outside/repository collaborators. Therefore, “authenticated gh” and an Issues-write checkbox are not universal proof of a usable contributor credential. Use an existing suitable session and report limitations; do not automatically mint tokens, broaden scopes or switch credential types. [GitHub token documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

| Operation | Documented account access | Token/API consideration | Initial helper behavior |
| --- | --- | --- | --- |
| Create an issue | Read access where issues are enabled | Authenticated creation; fine-grained endpoint permission is Issues write where that token type is applicable | Create supplied title/body using the selected existing identity. |
| Read public labels/issues/relationships | Public read | Public read routes do not establish write capability | Use bounded lookups and validate repository identity. |
| Apply existing labels | Triage or greater | Add-label endpoint accepts Issues write or Pull requests write; choose Issues for this capability | Add only validated existing labels; read back actual labels. |
| Add parent/child relationship | Triage or greater | Issues write | Apply explicit same-repository intent, then verify. |
| Add blocking dependency | Triage or greater | Issues write | Apply explicit direction and verify that exact edge. |
| Create labels | Write access | Separate provisioning operation | Maintainer setup only; never a runtime fallback. |
| Project placement | Separate project configuration/access | Not established or requested for version one | No Project operations or required Project scope. |

Account-access sources: [creating issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue), [labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels), [sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues), [dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies). Endpoint requirements: [issues API](https://docs.github.com/en/rest/issues/issues#create-an-issue), [labels API](https://docs.github.com/en/rest/issues/labels#add-labels-to-an-issue), [sub-issues API](https://docs.github.com/en/rest/issues/sub-issues#add-sub-issue), [dependencies API](https://docs.github.com/en/rest/issues/issue-dependencies#add-a-dependency-an-issue-is-blocked-by).

This repository reports owner type **User**, not Organization. GitHub documents personal repositories with owner/collaborator access, and collaborators can push changes. Do not promise a narrowly scoped organization-style triage role here or recommend granting every submitter collaborator access just to obtain labels. The owner account's successful operations do not demonstrate an ordinary submitter's rights. [Personal repository permissions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/permission-levels-for-a-personal-account-repository).

Creation with embedded labels is especially misleading: the issue-create API documents labels being silently dropped without push access. Its current schema also supports `parent_issue_id`, with triage access required to both involved repositories. Recommend a title/body-only creation request followed by distinct organization steps so results can be reported separately. A successful creation status alone does not certify metadata. [Create-issue endpoint](https://docs.github.com/en/rest/issues/issues#create-an-issue).

One documentation inconsistency deserves explicit treatment: the dependency POST reference includes an unauthenticated-public-resource sentence alongside its Issues-write requirement. The feature guide requires triage. Do not interpret that sentence as permission to write anonymously; no anonymous-write test was performed. [API reference](https://docs.github.com/en/rest/issues/issue-dependencies#add-a-dependency-an-issue-is-blocked-by), [feature access rule](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies).

## Observed repository and CLI state

[Command evidence](skill-submission-organization-evidence.json) records seven successful read-only checks in Windows Codex, with the UTC observation time and exact arguments:

- `gh` version 2.90.0; effective user AndrewGodlewsky, ID 59547542.
- Repository ID 1364861754, owner type User, issues enabled, unarchived. The current account reports admin/maintain/push/triage/pull permissions. This is owner evidence only.
- Fourteen labels were returned. `new-skill`, `enhancement-skill` and `inconsistent-skill` are absent; the agreed setup step is still required. No substitute label was created.
- This research issue's parent is the planning map, and the recovery issue's dependency list includes this research issue. Existing native relationships can be read under this account.
- Installed `gh issue create --help` does **not** list the `--parent`, `--blocked-by` or `--blocking` flags shown in current GitHub feature documentation. Do not assume a documented newer CLI feature exists in the deployed version. Fixed REST operations avoid dependence on those particular flags.

These reads did not test an unrelated working directory, ordinary-user permissions, metadata mutation through the proposed helper, browser submission, WSL or live Copilot composition. No Project inventory was needed because Projects are deferred.

## Recommended minimal operation surface

All routes below use HTTPS `api.github.com` and the compiled-in prefix `/repos/AndrewGodlewsky/andrew-skills`. Retain repository-name/ID checks, one selected credential, redirect refusal, safe UTF-8 content transfer and bounded pagination from the earlier transport research. Callers supply issue references and relationship intent, not global database IDs, hosts or arbitrary endpoints.

| Purpose | Request under the fixed prefix | Required evidence |
| --- | --- | --- |
| Resolve an issue | `GET /issues/{number}` | Positive issue number; matching repository, canonical issue URL and database ID; reject pull requests. |
| Catalog labels | `GET /labels` | Requested label exists and is usable; report incomplete lookup rather than absence when pagination is truncated. |
| Create | `POST /issues` with title/body only | Capture creation evidence and then read back the issue at a reconstructed route. |
| Add labels | `POST /issues/{number}/labels` with nonempty validated names | Read `GET /issues/{number}/labels` and compare the requested additions. |
| Parent/child | `POST /issues/{parent}/sub_issues` with resolved child's `sub_issue_id` | `GET /issues/{child}/parent` verifies the expected parent; parent child-list readback can support reconciliation. |
| Blocked by | `POST /issues/{blocked}/dependencies/blocked_by` with resolved blocker's `issue_id` | `GET /issues/{blocked}/dependencies/blocked_by` contains the exact blocker identity. |

Endpoint schemas and readback routes: [labels](https://docs.github.com/en/rest/issues/labels), [sub-issues](https://docs.github.com/en/rest/issues/sub-issues), [dependencies](https://docs.github.com/en/rest/issues/issue-dependencies). Use additive label POST, not label replacement, so unrelated existing labels survive.

Design constraints for implementation:

1. Resolve **both ends** of every relationship through this repository before a mutation, and derive database IDs from those responses. A globally valid ID can belong elsewhere. GitHub can support broader linking than this skill permits; the helper must enforce the stricter same-repository boundary.
2. Never reparent an issue automatically. Leave `replace_parent` false/omitted; a different existing parent is a conflict to report. Do not remove/reorder existing children, remove blockers, edit body content or change state as a repair action.
3. Validate explicit direction: “A is blocked by B” writes B's ID on A's blocked-by endpoint. Parent/child does not imply blocking. Reject self-links; detect known conflicts/cycles before mutation when possible, and treat server validation as authoritative. Do not claim a bounded graph scan proves acyclicity.
4. Keep known limits in view: GitHub documents at most 100 children per parent and eight hierarchy levels. Do not silently spread excess children across invented parents. [Sub-issue limits](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues).
5. Use available repository permission information as a preflight hint, not proof that the selected token can execute every endpoint. If organization capability is known absent or cannot be established safely, skip that optional mutation and report it. Do not probe an expected denial just to prove the limit. Unexpected authentication/policy denial stops under the active user's rules; success on public GET is not proof of authenticated write access.
6. Track the created issue independently from each label/edge. A readback failure does not erase creation evidence; an absent edge does not mean the issue is absent. Query observed state before any permitted metadata retry. Existing edges are not reasons to duplicate, remove or replace them. Exact retry/concurrency policy belongs to the recovery issue.

No automatic maintainer bot is introduced. A caller-facing report of missing labels/links is not guaranteed to reach maintainers if the caller never passes it on. Do not silently append an invented metadata block or open a second issue to solve that. The initial contract accepts incomplete organization; a later automatic maintainer intake workflow would be a separately authorized feature.

## Missing-prerequisite troubleshooting

| Condition, established without a denied action | Supported first-version response |
| --- | --- |
| Node.js absent | Preserve payload; explain the runtime prerequisite to the calling agent. Offer the manual handoff below. |
| `gh` absent or no configured session discovered without attempting a rejected request | Explain the missing CLI/authentication setup; let the user arrange it separately. No installer, credential capture request or automatic login. |
| Tools run in the wrong Windows/WSL environment | Report where the tools/resources are missing. Do not copy credentials or launch the other environment's executable as a fallback. |
| Labels absent or organization rights known unavailable | If issue creation is available and authorized, create the content and return the missing organization precisely. |
| Any actual authentication, ACL, policy, TLS or network-security rejection | Stop and hand control back. The manual route is not a way to evade that rejection; follow the user's required approval boundary before further action. |
| A write may already have succeeded | Reconcile first. Do not offer a fresh submission as if nothing happened. |

**Manual handoff:** return the prepared title and body, requested labels/relationships, and `https://github.com/AndrewGodlewsky/andrew-skills/issues/new`. The caller can explain that the user must sign in normally if needed and submit. Label the result **prepared, not submitted**. A browser page or filled form is not evidence of creation. If a resulting URL is later supplied, validate the fixed repository and distinguish a reported link from API-verified creation when readback tools are still unavailable.

Prefer the plain fixed URL and separate copyable content. GitHub supports prefilled title/body URLs, but URL-length limits and permissions on metadata query parameters complicate them. This handoff does not put full issue content into URL history or imply that a `labels` parameter grants permission. [Issue creation and URL parameters](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue).

General MCP or direct shell/API commands remain useful GitHub tools, but they let the agent choose a repository and may use different authentication. They are not equivalent enforced substitutes for the proposed helper. A second bundled runtime or restricted MCP adapter would require another implementation and acceptance surface; no demonstrated need justifies that now. This recommendation follows the [transport comparison](skill-submission-transport-results.md), rather than silently accepting a weaker fallback. Browser automation is not part of the first-version fallback.

## Deferred Projects and acceptance handoff

Do not add a Project ID, Project mutation, Project scope refresh or board dependency to the first version. Future integration needs a separately approved fixed Project identity, authorized fields, permissions and its own result verification. Keep issue creation and organization outcomes distinct so that adding Project membership later does not change caller-authored content.

Carry these concrete tests into the implementation handoff:

- Capture requests offline: all endpoints and both relationship IDs stay in GT; malicious URLs/global IDs, reversed blockers, redirects and pull-request references cannot redirect writes.
- Exercise missing labels, incomplete pagination, absent role information, insufficient known capability, silently missing labels, existing/conflicting parents, existing edges, self-links, graph limits, validation errors and response loss.
- Verify additive labels and no automatic reparenting/removal. Reconcile a partial success without creating another issue, preserving evidence on a security stop.
- Compare actual ordinary-contributor behavior with owner/maintainer behavior using separately authorized controlled acceptance, not simulated identity or borrowed owner credentials. Include a token that can read publicly but cannot write; token-type limits are not repository privileges.
- Verify the three setup labels, model-only loading, missing-tool guidance, plain manual handoff and actual Windows/WSL execution separately. Latest website documentation is not evidence of installed CLI flags.
- Pin and test the API/runtime versions used by implementation. Current API examples use `2026-03-10`; that was documentation evidence, not a version-specific mutation test here.

These are pending checks. The existing recovery, prototype and implementation tickets cover them; no new service, project or additional planning issue is needed.
