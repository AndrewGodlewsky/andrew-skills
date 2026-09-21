# Create Skills — submission and personal-installation research

Researched September 21, 2026 for [issue 38](https://github.com/AndrewGodlewsky/andrew-skills/issues/38).
These are design recommendations for [round 2](../planning/create-skills-round-2.md),
not implemented behavior or recorded owner choices. No trial uploads or issues
were created for this research.

**Decision update after round 2:** the owner accepted numbered comments and manual
ZIP attachments (prefer text where possible), but rejected the proposed personal
suffix/coexistence policy. Use the ordinary personal skill name; its future
lifecycle belongs to the user. The original comparison below preserves research
history. The [current plan](../planning/create-skills-plan.md) is the decision record.

## Long submissions

Recommendation: keep a single review issue, place short handoffs directly in its
body, and add indexed, numbered comments for long specifications and text files.
This preserves one maintainer decision and uses operations already implemented
by GT's submission helper.

| Route | Evidence and practical tradeoff | Recommendation |
| --- | --- | --- |
| One issue body | Existing helper supports it, but caps the body at 60,000 UTF-8 bytes. | Use when everything fits. |
| Issue plus comments | GitHub documents creating and retrieving comment bodies; the helper already supports both. Several writes can partially succeed. | Default overflow route, with an index and verified completion. |
| Native sub-issues | GitHub describes these as breaking work into smaller tasks. Adding them requires at least triage permission. The current helper has no native relationship operations. | Reserve for genuinely separate work, not fragments of one specification. |
| ZIP or other attachment | GitHub documents browser uploads, including ZIP, into issues/comments. Current helper has no upload operation. | Useful manual exception for binary resources; would need an explicit handoff step. |
| Discussion | GitHub exposes a separate GraphQL API and discussion categories. Current helper does not implement it; reviewed docs establish no larger payload allowance. | Adds another destination without solving this workflow's core need. |
| Repository files or branch | Can represent a large package well, but requires a separate Git contribution workflow and authorization. | Do not make it an automatic consequence of issue submission. |

Sources: [issue comments REST API](https://docs.github.com/en/rest/issues/comments),
[adding sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues),
[file attachments](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files),
[Discussions API](https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions).

The **60,000-byte** figure comes from
[the local helper contract](../../skills/create-issue/references/helper.md),
not a verified universal GitHub character limit. UTF-8 bytes, Markdown framing
and JSON escaping must be measured at their respective boundaries. The helper
also caps the whole JSON request at 256 KiB and responses at 2 MiB. Comments do
not remove service validation, rate limits, or practical package-size limits.

## Proposed comment protocol

1. Finish the specification/package locally. Build a manifest of sections and
   files, expected parts, exact file lengths and content hashes for reconstruction.
   Validate all payload sizes before the first write. Establish a finite batch
   bound during implementation; do not promise unlimited comments.
2. Create the issue with a readable summary, manifest and explicit status that
   supplemental content is being submitted. Small submissions need no such phase.
3. Submit numbered parts sequentially through `create-issue`. Prefer section/file
   boundaries; split an oversized file into ordered fragments without losing
   bytes. Use fences that cannot be closed by embedded file contents.
4. Preserve each operation's IDs, URLs and verification outcome. Verify exact
   content and reconstruction, using known comment IDs so large lists are not
   mistaken for complete retrieval. The existing helper has bounded pagination.
5. Replace the creator-authored issue body through the helper's fresh-base check
   with an index of verified links and a complete status. Verify that update too.
   Concurrent edits must not be overwritten. Only then offer personal installation.

This is caller orchestration, not a new guarantee of atomic or exactly-once
submission. A possibly sent write must be reconciled read-only; never retry all
parts or infer absence from a partial list. If recovery remains uncertain,
preserve the local package and report the partial issue for explicit recovery.
Known never-attempted parts are distinct from uncertain parts. The current helper
does not edit or delete comments; do not design recovery around those operations.

Human-readable part numbers and hashes describe the actual deliverable. They
must not become hidden replay markers or a new persistent transport ledger.
Maintain operation evidence through the conversation/manual handoff under the
existing helper contract. Any additional persistent resume mechanism needs its
own reviewed design.

Pace writes across helper calls, and stop according to the helper's rate-limit
and uncertainty results. GitHub advises avoiding concurrent writes and spacing
mutations; service limits still apply to an otherwise valid multipart handoff.
See [REST best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api).

## Binary resources

ZIP attachments preserve resources that cannot be carried as readable text.
GitHub's documented browser workflow uploads immediately when a file is attached,
before the comment is posted. Public-repository uploads are accessible without
authentication; the documented limit for non-image/video files is 25 MB.
See [attachment documentation](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files).

The reviewed issue/comment REST documentation did not provide a general ZIP
upload operation. This is not a claim that no other GitHub upload facility exists.
The current helper does not support uploads. Recommend a clearly identified
manual browser attachment step for essential binaries, if accepted in round 2,
with a manifest and explicit verification result. Do not declare completion
based on an inaccessible link or a local-only file. A declined/unverifiable
attachment leaves the handoff incomplete rather than omitting required content.

## Personal copies after submission

VS Code documents personal skill directories including `~/.copilot/skills/`
and `~/.agents/skills/`; it requires the skill name to match its folder.
[VS Code agent skills](https://code.visualstudio.com/docs/agent-customization/agent-skills).

Copilot CLI also documents both locations. Its discovery uses precedence and
first-found handling for duplicate names, so a same-named personal copy can
affect which skill runs. A distinct personal name is a design recommendation,
not a promise of identical discovery behavior in all clients.
[CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

GitHub's CLI guide describes installing the whole skill folder and refreshing
skills with `/skills reload` or a new session. Include resources, then verify
the chosen client's discovery; writing files alone does not prove invocation.
[Adding CLI skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills).

Recommend a new `<name>-personal` package under the active environment's
`~/.copilot/skills/`, after an explicit yes. Show its actual path, keep the name
within GT's length rules, update internal references consistently and reject
existing destinations. Windows and WSL need separate target resolution. Do not
copy into both homes, a plugin cache or a marketplace source folder by default.

No automatic updates or migration into the marketplace are implied. If GT later
publishes the skill, the user can deliberately retire the personal copy. Existing
GT historical exporters operate on identified published catalog releases; they
are not a generic installer for newly authored packages and should not be
silently repurposed for this branch.
