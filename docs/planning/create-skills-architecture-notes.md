# Create Skills — implementation design notes

Issue: [Plan Create Skills authoring and submission workflow](https://github.com/AndrewGodlewsky/andrew-skills/issues/38).
Status: implementation design after owner review; no production implementation.
Confirmed scope follows the owner's [round 1 answers](create-skills-round-1.md):
new skills only, implementation-ready handoff and optional personal installation
after submission. [Round 2](create-skills-round-2.md) settles specification-first
delivery, best-effort builds/checks, numbered comments/manual ZIPs and ordinary
personal names. [Implementation handoff](create-skills-handoff.md) defines cases.

## Existing code and extraction boundary

`scripts/validate.mjs` contains an internal `validateSkill(files, name)` function
and header/resource helpers. `validateFiles` calls it after validating repository
manifests and supported file modes. `scripts/skill-architecture.test.mjs` already
exercises header types, invocation combinations, content and relative resources.
`scripts/release-validation.mjs` separately exports `parseRelease` and full
release comparison functions. Its format parser is already reusable.

Recommended extraction:

1. Move the single-package structural checks and the private functions they need
   to a pure module, accepting a package name and a map of relative file bytes
   and modes. Return a clear result or diagnostic without reading disk or running
   any package code. Keep whole-repository manifest/history checking in place.
2. Reuse the existing `parseRelease` export rather than moving it out of the
   historical exporter dependency tree. The creator can bundle that existing
   module with the new validator. This avoids an incidental change to restore
   bundles and their releases solely to reorganize a shared parser.
3. Have repository validation and a standalone draft-check CLI call the same
   pure implementation. Preserve existing accepted/rejected cases and useful
   diagnostics. The standalone path must explicitly check all regular-file modes
   and paths that the repository wrapper currently checks outside validateSkill.
4. Bundle the required maintained modules deterministically. A check mode must
   reject stale/missing/unexpected files without changing them. Test the bundled
   checker from a copied directory outside the checkout on Windows/Linux Node
   22/24. Keep specification authoring useful without Node; package checks remain unrun
   when their runtime is unavailable.

No code has been moved. Exact function/CLI names can be settled during the
implementation handoff; they are not user-facing product choices.

## What structural checking does and does not cover

The current resource-link scan checks supported inline links in the SKILL.md
instruction body. It is not a recursive Markdown parser, a JavaScript import
resolver, a dependency installer, a behavioral evaluator or an export guarantee.
Do not describe extracted legacy checks as proving every dependency is complete.

Recommended companion package-integrity check: inspect supported relative
Markdown resource links across the selected package, with explicit diagnostics
for unsupported link syntax or unresolved dependencies. Keep external URLs as
references rather than automatically fetching them. Review executable dependency
imports separately; do not infer an installed environment from an import string.
Any expansion of repository enforcement needs explicit scoped regression cases
and a check against existing skills rather than silently changing the baseline.

The filesystem boundary reads only the explicitly selected draft tree, with
bounds on file count/bytes and supported paths. Reject redirected or unsupported
entries, inaccessible files and paths escaping the root; do not execute supplied
scripts, import draft modules or install dependencies. A detected security denial
must remain distinguishable from a missing resource or malformed draft.

Package reports identify exact input files/hashes, schema/rules identity and
actual results. Separate these fields:

- Structural format: passed, failed or not run.
- Resource/dependency review: actual findings and unresolved items.
- Initial version: 1.0.0 for a new source. Final repository release integration
  remains a maintainer check against the then-current published base.
- Behavior: named observed checks versus expectations and deferred client work.

This creator has no successful incomplete-idea branch. Known unresolved
requirements need further interviewing. Build failure, failed package checks or
unavailable checks do not block a complete specification's submission. Include
the actual artifacts and clearly report their state. A checked-package claim requires the
stated mandatory checks to have run on the submitted bytes; it does not assert
every client or integration check passed.

## Authoritative guidance and bundled resources

CONTRIBUTING.md remains the authoring authority. Use a generated, self-contained
runtime excerpt for the creator's relevant architecture/release guidance, with
declared source sections and a freshness check. Missing/ambiguous sections or
remaining repository-only links must fail generation. Do not manually maintain
the same rule in two editable files. The build should change when canonical
guidance changes, making a changed creator bundle visible to release validation.

Keep the attributed writing guidance separate from GT-specific rules. The
creator loads writing guidance when drafting/revising, package guidance when
preparing a package, and submission guidance when preparing the issue. Users
should not have to answer technical packaging questions before describing
their need. A concrete package layout could be:

```text
skills/create-skills/
  SKILL.md
  release.yaml
  references/
    interviewing.md
    writing.md
    package-rules.md       generated from canonical repository guidance
    submission.md
    personal-installation.md
  scripts/                deterministic checker bundle
  assets/
    matt-pocock-license.txt
```

Names are proposed. Add only resources actually linked with a loading condition.
Include applicable attribution/license notices with the adapted material and
record the adaptation in README provenance. Do not make the installed skill read
the root CONTRIBUTING.md, a local plugin cache or these planning documents.

GT's current `grill-me` is user-invocable with model invocation disabled. Do not
promise that the creator can automatically invoke it. Recommend bundled interview
guidance using the same requirements-discovery approach, so the creator assesses
gaps and asks follow-up questions itself. A shared model-enabled interview skill
would require a separate dependency/interface change; it is not necessary just
to achieve the owner's requested interview behavior. Record provenance for any
adapted interview material, too.

## Submission composition and personal installation

The owner accepted the [research note's](../research/create-skills-submission-options.md)
one indexed issue plus numbered comments for long text. The creator owns splitting,
manifest/reconstruction checks and final completeness reporting. The helper's
existing create/comment/read/reconcile/own-body replacement operations remain
the transport boundary. Confirm per-operation limits and bounded retrieval before
implementing a finite batch limit. No atomic multi-comment guarantee, comment
editing or silent replay is available. Essential binary resources may use manual
ZIP attachments. Keep specification, generated package and check evidence as
separate visible sections. Transport completeness must not imply check success;
a specification-only handoff can be complete when build absence is explicit.

The personal-installation branch follows explicit user acceptance after complete
submission. It needs a bounded, create-only filesystem boundary for a newly
authored package, active Windows/WSL home selection, collision detection, name
consistency and resource checks. Existing historical exporters require published
catalog identity; do not silently reuse them as arbitrary package installers.
Use the ordinary skill name, no imposed suffix, and no coexistence or update
management. The user owns the personal copy after installation. Verify file
creation separately from client discovery/invocation. A filesystem security block
remains a security block, not a reason to select a less restricted destination.

## Source identity recorded for adaptation

Historical workflow: `mattpocock/skills`, commit
`985d8fce764dae479e7b77b632429abe38891ee8`, `write-a-skill/SKILL.md`, read through
GitHub's content API. Current reference source: installed Matt plugin **1.2.3**.
Exact local SHA-256 values recorded on September 21, 2026:

| Source in that plugin | SHA-256 |
| --- | --- |
| `skills/productivity/writing-for-agents/SKILL.md` | `1c0c4ebf2d221917591144f0ced4fe46dae13301cb3d6d93fc88ecf0dda6aed2` |
| `skills/productivity/writing-for-agents/SKILL-MECHANICS.md` | `86f112c08d785cc224c13dcda75c0724b74bd62622cc61d4b7ab3dbbaf37f6fc` |
| `LICENSE` | `4981c5f6a90eb3a969dacabb9350f5a75695ff3910b39b6534952908dfdc5ff7` |

These identify the reviewed current guidance without claiming an unverified
upstream commit. Preserve its MIT notice during adaptation. The current guidance
and GT rules supersede the old workflow's hard line-count limits and generic
invocation assumptions.

## Suggested implementation slices after interaction review

1. Shared package checker and standalone reader: parity with existing rules,
   explicit resource-scan scope, confinement/bounds, deterministic bundle and
   cross-platform offline tests. No arbitrary draft execution.
2. Creator package: new-skill discovery, completeness review, specification and
   package paths as settled in round 2, adapted references, canonical guidance
   generation and real `create-issue` dependency resolution.
3. Issue serialization and composition: preserve all submitted text, use fences
   longer than any embedded fence, calculate UTF-8 bytes, distinguish local-only
   drafts and complete payloads, carry authorization and previous-write evidence.
   Include numbered comments, final index verification and interrupted submissions.
4. Optional personal installation: complete package preparation, create-only
   writes, name/resource consistency, collisions and client discovery evidence.
5. Release/docs and acceptance: new skill 1.0.0, one appropriate plugin patch from
   the actual published base, unchanged unrelated skill versions, offline
   scenarios and separately recorded Windows/WSL Copilot observations.

Planning decisions are settled; execution links are in the handoff document. No
version number is reserved for the future plugin release. Existing issue35/36
dependency evidence does not prove creator composition, and their incomplete
client checks do not prevent offline implementation work.
