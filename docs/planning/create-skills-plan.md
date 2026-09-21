# Create Skills — workflow and implementation plan

Status: decisions settled after the owner's round 2 answers, September 21, 2026.
No production skill or validation behavior has changed.

Tracking: [issue 38](https://github.com/AndrewGodlewsky/andrew-skills/issues/38),
assigned to Andrew. Original answers remain in [round 1](create-skills-round-1.md).
Final owner answers remain in [round 2](create-skills-round-2.md).
See the [implementation handoff and acceptance cases](create-skills-handoff.md).
See [architecture notes](create-skills-architecture-notes.md) and
[submission research](../research/create-skills-submission-options.md).

## Confirmed purpose and scope

Create Skills helps a user define a **new skill** thoroughly enough for a
maintainer to build and evaluate it without another requirements interview.
It submits that handoff to `AndrewGodlewsky/andrew-skills` through the existing
model-invocable `create-issue` skill. Andrew may review submissions weeks later;
the issue must stand on its own without the original conversation or local files.

The owner's round 1 answers supersede the earlier create-or-improve and lightweight
proposal branches for this workflow:

- Users deliberately invoke `/gt:create-skills`. Use GT's explicit header with
  user invocation enabled and model invocation disabled.
- Assess supplied context and interview for missing decisions. Investigate
  discoverable facts rather than asking the user to research them. Adapt question
  depth and grouping to the user; avoid repeating answered questions.
- Produce the detailed specification first; it is the primary deliverable. Then
  attempt to build the skill. Submit the specification and any generated package
  visibly and independently in the same issue so the maintainer can rebuild from
  the specification without adopting the generated implementation.
- Attempt the applicable checks and report passed, failed and unrun outcomes.
  Neither a successful build nor passing checks is required to submit the issue.
  A detailed specification alone is acceptable when no package can be produced.
- Do not treat an idea paragraph or known unanswered requirements as a completed
  submission. Preserve unfinished local work when the user pauses.
- A separate future workflow will handle changing existing skills. Disclose
  catalog overlap; do not silently turn creation into an update.
- After the complete handoff has been submitted, ask whether the user wants a
  personal installation. Install only if they say yes. It remains separate from
  the marketplace plugin and its publication process.
- Personal copies use the skill's ordinary name, without an imposed `-personal`
  suffix. Their later maintenance and coexistence with marketplace releases are
  the user's responsibility; do not build migration or synchronization machinery.
- Bundle an attributed adaptation of Matt Pocock's former `write-a-skill`
  workflow and current `writing-for-agents` guidance inside GT.
- Reuse existing authorization for submission; ask only when the concrete action
  lacks authority. Content review is not a redundant permission ceremony.

This higher completion bar applies to **Create Skills**. It does not repeal
CONTRIBUTING.md's general permission to submit plain-language ideas through other
routes. Issue creation is still review intake, not acceptance or publication.

## Agreed workflow

1. **Understand the new skill.** Establish the actual need, intended users,
   invocation, representative inputs and desired outputs. Check relevant GT
   overlap. If the request is an improvement, explain this workflow's scope and
   retain the context for the separate change workflow; do not invent an installed
   dependency that does not exist.
2. **Resolve the requirements.** Work through the ordinary path, missing or
   conflicting input, failure cases, dependencies, permissions, limitations and
   non-goals. Use small related question groups when helpful. Record user decisions
   and verify technical facts. Never fill a product gap with an undisclosed guess.
3. **Specify, then build.** Write the complete specification first, including
   representative input/output examples and observable acceptance scenarios.
   Attempt the full package afterward. Keep the specification independent from
   implementation details, and reconcile any discovered requirement changes with
   the user. Include all generated files and resources, plus explicit gaps when
   the attempted package is incomplete. A complete specification remains useful
   even when the build cannot be completed.
4. **Review and check.** Review the result with the user, resolve known product
   questions, and attempt applicable checks against GT's architecture. Try to fix
   defects within the task, but do not turn build/check success into an issue
   submission gate. Report expected behavior, actual results, failures and unrun
   checks separately. Maintainers independently build or verify before adoption.
5. **Submit the whole handoff.** The creator owns title, substantive content,
   organization and any splitting. `create-issue` owns fixed-repository transport,
   authorization, ownership checks and recovery. Agreed long-text design:
   one issue with an index and numbered comments, verified before claiming that
   the handoff is complete. Use a manual ZIP attachment for essential binaries
   when text cannot represent them; prefer avoiding unnecessary binaries.
6. **Offer personal use.** Only after complete verified submission, offer a
   personal installation. If accepted, prepare the installable package if one
   does not yet exist, attempt checks and report remaining limitations. Add any
   newly produced files or substantive corrections to the same issue through the
   submission dependency. Use the ordinary skill name and active user scope.
   Missing essential files or an unsafe destination can prevent installation;
   they do not undo successful issue submission. Do not promise runtime success
   merely because files were copied.

Submission and installation have separate outcomes. A successfully created issue
with promised supplemental content still undelivered is a partial handoff. A
specification and accurately described failed/absent build can be a complete
handoff: artifact quality and transport completeness are different. A complete issue does
not become a failed submission merely because personal installation is declined
or unavailable. Report the actual state and preserve known issue/comment IDs.

## Handoff completeness

The proposed readiness review covers these questions, with content tailored to
the skill rather than a mandatory public form or word count:

- Who uses it, for what recurring task, and when should it be invoked?
- What is required, optional or discoverable input? How are absent, ambiguous
  and conflicting inputs handled?
- What exact output does success produce? What steps and decisions produce it?
- Which tools, resources and environments are required? What happens when they
  are missing? Which external actions need authorization?
- What must it avoid doing? Where does its responsibility end?
- What examples demonstrate ordinary use, edge cases, cancellation and failure?
- What package files, invocation settings and initial release metadata are
  required? What checks ran, what failed, and what remains untested?

The goal is no **known unresolved requirements** for the maintainer. This is a
reviewable completeness criterion, not a guarantee against all future discoveries.
Approval to include the skill and final release integration remain maintainer
decisions. Never convert unrun verification into a claimed pass.

## Architecture and release standards

CONTRIBUTING.md remains the single authoring authority. A generated runtime
excerpt and bundled checker must share a maintained update path and freshness
check; the installed skill must not depend on a repository checkout.

A package intended for repository adoption needs a valid folder/name, `SKILL.md`, `release.yaml`, the
four explicit supported header fields, nonempty instructions, required resources
and valid release metadata. A new skill starts at 1.0.0. Review relative resource
links, executable dependencies and portability; format checks alone cannot prove
runtime compatibility. These checks are advisory at issue intake and required
by the repository's existing adoption rules. Do not execute draft scripts during
structural checking. Behavior checks need their own appropriate authorization.

Extract existing pure single-package validation into a shared module and reuse
the release parser. Keep repository-wide manifests, published-base comparison
and release integration in the existing validator. The standalone reader must
confine reads to the chosen package, enforce file/path/size bounds and reject
unsupported entries. See architecture notes for existing coverage and design.

Keep three evidence levels distinct: structural checks, instruction/behavior
review, and maintainer release integration. Issue authors do not reserve plugin
versions or edit plugin manifests to submit a package. Incorporation requires
current-base checks, an appropriate plugin version, README/provenance changes
and the repository's normal validation.

## Submission and installation boundaries

Use the existing `new-skill` label where available. No new issue classification
system is needed. Keep `create-issue` focused on submission rather than moving
interviewing, specification writing or package assembly into it.

The agreed comment design uses complete sections and file manifests, preserves
UTF-8 content and checks serialized request limits. The existing helper limits
each body/comment to 60,000 UTF-8 bytes; this is a helper bound, not an asserted
GitHub service limit. Large files may need ordered fragments. Local paths alone
are not a remote handoff. Manual ZIP attachments are an accepted exception for
essential binary resources; verify availability and report any inaccessible part.

Numbered comments are not an atomic upload. Retain each result, stop on partial
or uncertain delivery, and use the dependency's read-only reconciliation rules
for any possibly sent operation. Do not replay a whole batch or create a second
issue to recover. Pace writes and respect service errors. Only mark the issue's
index complete after verifying all required content and the final index update.

For personal installation, use the active client's user scope, preserve existing
files, include the full package, and keep plugin caches untouched. Windows and
WSL homes are separate. Use the ordinary name with matching folder/header and
complete internal resources; copying only SKILL.md is insufficient. The intended
user interaction distinguishes a personal skill from GT's prefixed entry point,
but record actual client discovery rather than guaranteeing name resolution in
every client. Do not add suffixes, coexistence management or automatic migration.
Successful file creation and successful client discovery/invocation are separate
checks. No automatic synchronization or marketplace acceptance is implied.

## Source adaptation and implementation sequence

The historical [write-a-skill source](https://github.com/mattpocock/skills/blob/985d8fce764dae479e7b77b632429abe38891ee8/write-a-skill/SKILL.md)
supplies requirements, drafting and user review. Installed Matt plugin 1.2.3's
`writing-for-agents` supplies writing guidance and skill mechanics. Preserve its
MIT notice and record exact source identities and adaptations. Architecture
notes contain source hashes. GT's rules supersede obsolete hard line-count caps,
fixed headings and unverified client-specific assumptions.

Execution slices:

1. Shared package validation, bounded standalone reader and deterministic bundle,
   with parity and cross-platform offline checks.
2. Creator entry point, bundled interviewing/writing guidance and canonical GT
   rules, with new-skill-only scope and explicit completeness review.
3. Issue serialization/composition, including long text, manifest verification,
   partial delivery and uncertainty, using the existing submission dependency.
4. Optional personal package preparation/installation, collision handling and
   active-environment selection, with separate installation verification.
5. Release/docs integration and actual Windows/WSL Copilot acceptance. Existing
   dependency evidence in issues 35/36 does not establish creator behavior and
   does not block planning or offline implementation.

Execution issues and dependencies are listed in the implementation handoff.
No commits, pushes, PRs, releases, repository settings or unrelated skill changes
are authorized as a consequence of this plan. Preserve unrelated local work.
