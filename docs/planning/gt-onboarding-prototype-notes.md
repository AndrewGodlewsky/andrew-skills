# GT onboarding prototype — review and implementation notes

Tracking record: [issue #73](https://github.com/AndrewGodlewsky/andrew-skills/issues/73). Reader-facing asset: [README prototype](gt-onboarding-prototype.md).

**Completed:** the [owner-reviewed resolution and validation record](https://github.com/AndrewGodlewsky/andrew-skills/issues/73#issuecomment-5783440536) closes #73. The approved implementation remains in the working tree, uncommitted and unpublished. Historical round notes below are retained as evidence, not unresolved requirements.

## Decision status

### Owner review and implementation start

Andrew reviewed the draft and said: “Okay, I think this looks good. Let's get started. The only thing I would say is let's use the Grill with UI skill instead of Grill me skill”. He subsequently clarified **“Use Grill with UI for this session”**. This approves proceeding with the onboarding implementation; it changes the interview interface, not the README examples.

Availability check: `grill-with-ui` exists in Andrew's personal skills but is absent from the 18-skill GT catalog at published main `2fd61f93bf0c9acf52f671f8aedec195088e4d86`. GT's `grill-with-docs` is a different skill. The personal Grill with UI is being used to conduct this session; Help, Grill Me and Caveman Review remain the three approved README examples.

Andrew separately authorized **“Yes, fetch and fast-forward”**. The checkout was fast-forwarded from `9f40cb04e594fb5232862018f535b08828d693d1` to `2fd61f93bf0c9acf52f671f8aedec195088e4d86`, preserving both prototype files. The approved README reordering and matching manifest descriptions are now applied in the working tree. The proposed plugin version is 0.1.19 relative to published 0.1.18. All original section anchors are preserved, with an explicit legacy title anchor. No skill package changed; Help's existing guidance remains consistent. No commit, push, PR, release or client acceptance is claimed.

### Original prototype round

Andrew requested assignment and work on #73. It is assigned to AndrewGodlewsky.
When asked which audience this draft should address, he answered **“Both, new to skills”**: VS Code and Copilot CLI users unfamiliar with skills.

Issue #72 has no resolution or comments as read on September 22, 2026. The audience answer is sufficient to draft a reviewable example, but does not resolve #72's remaining choices. First-success examples, exact copy, essential-content balance and the outline remain proposals. Neither issue is complete. Record future reactions in #73 before calling this reviewed or accepted.

The paragraph above records the original round's status; it is superseded for #73 by the owner approval above and the completed [Grill with UI design record](gt-onboarding-design.md). Andrew accepted first success as choosing one installation route and receiving a useful first response from one chosen GT skill, then sent Finish. The interview server was stopped after saving the record. #72 was not closed by implication.

The Prototype skill is applied as a cheap, throwaway Markdown experiment, as specifically requested by #73. A web app, variation switcher and throwaway Git branch would add no value to reviewing README text. This pass creates no production changes or Git history; the issue comment preserves the review asset without requiring a commit. This scope follows the issue's explicit Markdown format and the owner's separate Git authorization rules.

## Sources and baseline

- Local checkout: `9f40cb04e594fb5232862018f535b08828d693d1`, GT 0.1.16. Working tree was clean before this work. It lacks the newer Help package and dependency map introduction.
- Inspected published main: `2fd61f93bf0c9acf52f671f8aedec195088e4d86`, GT 0.1.18. Read README, both manifests and `skills/help/SKILL.md` directly at that commit through GitHub's read-only API; no checkout update was performed.
- [Accepted installation targeting](https://github.com/AndrewGodlewsky/andrew-skills/issues/22#issuecomment-5752852987): alternative CLI/VS Code routes, one copy per environment by default, deliberate independent copies supported.
- [Help implementation evidence](https://github.com/AndrewGodlewsky/andrew-skills/issues/69#issuecomment-5771541571) and [owner pilot](https://github.com/AndrewGodlewsky/andrew-skills/issues/17): guidance-only Help, actual source selection and pending entry-point/client checks.
- Official [VS Code plugin documentation](https://code.visualstudio.com/docs/agent-customization/agent-plugins) and [Copilot CLI marketplace documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing), read September 22, 2026. They support marketplace registration/install and discovery routes, not GT-specific acceptance.
- Local CONTRIBUTING.md release rules: repository-only documentation needs no version bump; a manifest/bundle change needs one matching plugin patch; changed distributed skills need their own release treatment. Re-read the then-current guide before implementation.

## Proposed final README order

1. Value statement and plain-language explanation of a skill.
2. Installation choice, followed by the two short routes.
3. Three first requests under the existing “Use a skill” heading.
4. “Explore further” navigation.
5. Complete skill catalog and requirements, preserving the current detail below the first-use material.
6. Existing update guidance.
7. Maintainer material: dependency map, local testing, layout, contribution/validation and provenance.

The first implementation should reorder within the README and add navigation before splitting documentation across new files. That reduces link churn and avoids inventing a parallel maintenance guide. Keep CONTRIBUTING.md canonical. Move the dependency-map image and explanatory paragraph below onboarding; keep the live viewer, saved map, data/audit and contributor links together.

## Link and anchor inventory

Inventory is based on all headings in the published README at the inspected commit. Preserve the following anchors even if material moves lower on the page. If a future edit relocates a section to another file, leave the old heading with a short destination link until its inbound references are deliberately migrated; simply changing relative links inside this draft is not a redirect.

| Current anchor | Proposed treatment |
| --- | --- |
| `#andrew-skills` | Retain an explicit compatibility anchor if adopting the proposed new title. |
| `#install` | Keep; replace long lead-in with the route choice. |
| `#install-with-the-cli-using-powershell` | Keep the optional existing installer subsection below the two primary routes. |
| `#install-without-downloading-this-repository` | Keep for CLI setup; sequential commands avoid shell-specific chaining in the short path. Preserve existing shell notes in details. |
| `#install-from-vs-code-without-the-cli` | Keep for the VS Code route. |
| `#use-a-skill` | Keep for the three first requests; link onward to the complete catalog. |
| `#update` | Keep the current update section. |
| `#update-from-chat` | Keep the existing guided update contract and limitations. |
| `#cli-installed-plugin-including-the-installer-script` | Keep CLI ownership-specific instructions. |
| `#how-to-check-for-an-available-update` | Keep; review any dated claims during implementation. |
| `#refreshing-the-marketplace-versus-updating-the-plugin` | Keep the registration/update distinction. |
| `#vs-code-installed-plugin` | Keep native update instructions and their global-setting scope. |
| `#test-locally-before-publishing` | Keep maintainer instructions and CONTRIBUTING.md inbound link. |
| `#if-you-tested-an-earlier-installation` | Keep migration guidance reachable from local testing. |
| `#repository-layout` | Keep below onboarding. |
| `#contribute-and-validate` | Keep the link to the canonical guide. |
| `#per-skill-releases` | Keep or shorten to a linked summary under the same heading. |
| `#current-validation` | Keep current check instructions reachable. |
| `#skill-provenance` | Keep attribution and licenses reachable through top navigation. |

Proposed new catalog anchor: `#all-skills-and-requirements`. The prototype's snapshot link to `#use-a-skill` is a temporary navigation target, not the intended final catalog anchor.

Additional paths to retain: `docs/skill-map.md`, `docs/skill-map/README.md`, `docs/skill-map/map.md`, `docs/skill-map/overview.svg`, `CONTRIBUTING.md#maintain-the-dependency-map`, skill source links and bundled license links. No map assets or notices need rewriting for this outline.

Observed local inbound root-README references: CONTRIBUTING.md links to `#test-locally-before-publishing`; `docs/research/skill-submission-wsl-acceptance.md` links to `#install-without-downloading-this-repository`. `skills/caveman-compress` references its own README's `#backup-recovery`; that is unrelated and should stay untouched. This local scan does not cover newly published files absent from the checkout or external backlinks. Preserve all published anchors and repeat the scan against the implementation baseline.

## GT Help impact

Help already explains the route choice, whole-collection installation, situation-based recommendations and guidance-only behavior. It contains no root README anchor dependency in its inspected SKILL.md. Reordering the README and changing the two manifest descriptions alone appear to need no Help runtime edit.

If the owner changes the selected skills' promises or setup guidance during review, compare the accepted copy with Help's “Start with the situation” and “Marketplace and setup questions” sections. Preserve Help's manual-only invocation and its inability to run the recommended actions. Do not advertise bare `/help` or invent a verified GT slash command.

## Author walkthroughs and actual checks

These are editorial walkthroughs, not user testing or executed client checks:

| Reader or case | Observed property of the draft | Still untested |
| --- | --- | --- |
| New VS Code-only reader | Route leads to VS Code settings and marketplace installation; no CLI prerequisite. | Whether a newcomer can follow it unaided and load the intended GT skill. |
| New CLI reader | Separate registration and installation commands, with success required before installation; no VS Code setup. | Actual CLI installation, entry-point spelling and skill behavior. |
| Uses both clients | Shared CLI route is visible; no compulsory second installation. | Actual discovery for the user's client/environment. |
| Windows plus WSL or deliberate copies | Environment distinction and intended update target remain explicit. | Cross-environment acceptance and discovery. |
| No concrete task yet | Help example supplies a useful goal and expected recommendation. | Whether Help is the best first example for this audience. |
| Missing review input | Review example explicitly asks for a supplied diff or accessible code. | Actual response quality and boundary behavior. |

Source/contract review found the selected examples consistent with the inspected README, Help and existing skill instructions. Official docs were checked for the setup routes. Draft links target inspected repository files/anchors or retrieved official documentation. The local link search and published-heading inventory were performed; a full current-main link crawl was not.

No client was launched, no install/settings change or workflow submission was performed, and no production file was edited. No automated tests were added or run for this Markdown prototype. Structural or prose checks would not establish client acceptance.

## Later implementation and completion

After Andrew reviews the examples, opening, content placement and description, record his actual decisions and remaining gaps in #73. Only then can this be a reviewed handoff. Do not close #72 by implication or replace the owner pilot with this prototype.

Implementation should use the then-current main, preserve the anchors above, update both manifest descriptions consistently and check affected Help guidance. README-only edits need no release bump. Including the manifest descriptions requires one matching plugin patch relative to that published base; do not reserve 0.1.19 now. A Help package change, if needed, also requires its own skill release increment.

For implementation, verify links/anchors and Markdown rendering, run the current repository structural/release checks required for changed manifests or packages, and check map freshness if its integration changes. Keep client onboarding, discovery, invocation and Windows/WSL observations in #17. Current documentation and a successfully rendered README do not satisfy those checks.

## Completed implementation checks — September 22, 2026

Environment: Windows, Node.js 24.14.0. The independently rechecked published main remained `2fd61f93bf0c9acf52f671f8aedec195088e4d86` at completion.

- `node scripts/validate.mjs`: passed, GT 0.1.19 and 18 skills.
- `node scripts/validate.mjs --base origin/main --current-main 2fd61f93bf0c9acf52f671f8aedec195088e4d86`: passed; 25 published release records, no added/changed/removed skill, one plugin patch.
- Required release-validation, release-snapshots, skill-architecture, release-catalog and release-catalog-reader suites: **44 passed, 0 failed, 0 skipped**. Runtime approximately 235 seconds; no new tests were authored for this editorial change.
- `node scripts/build-skill-map.mjs --check`: passed, 18 skills, digest `4f1e007fb145bb4b`. No map regeneration or review attestation changed.
- Final Markdown link check: all **53 local README link/image targets**, all previous README heading anchors and local links in the three planning documents resolved.
- Rendered the README with Markdown tables and visually inspected the introduction and first-request table in a temporary local browser preview. Both were readable without clipping at the inspected desktop viewport. This is a local rendering check, not verification of GitHub's renderer or responsive/mobile layouts. The subsequent route links and optional-installation navigation were checked structurally.
- `git diff --check`: passed. Working scope is README, both manifests and three planning records. No skill package changed.

The initial sandboxed release comparison and test command could not spawn Git/Node subprocesses (`EPERM`); no assertions ran in that failed test launch. The same commands completed through the platform-approved elevated execution path. No security settings were changed.

The owner-approved fast-forward is the only Git-history operation. Implementation remains uncommitted and unpublished. No client install, sign-in, settings change or live GT invocation was performed. The first-success criterion is accepted but has not been tested with a newcomer; live acceptance remains #17.
