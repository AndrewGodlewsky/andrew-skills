# GT onboarding — agreed design

Andrew approved a README introduction for developers who use VS Code or Copilot CLI and are new to skills. The introduction explains GT's value, offers one appropriate installation route and helps the reader choose a useful first task. Success means choosing a route and getting a useful first response from one GT skill, rather than merely installing files or trying every example. The approved implementation keeps the full catalog, update guidance, maintainer map, validation information and provenance accessible below onboarding. It also replaces the matching descriptions in both plugin manifests. The work and evidence belong to [issue #73](https://github.com/AndrewGodlewsky/andrew-skills/issues/73). Andrew finished the Grill with UI session on September 22, 2026; no visual was requested or generated.

## Terms

- **GT:** the shared skills collection installed as the `gt` plugin from the `andrew-skills` marketplace. Avoid describing each skill as a separately required installation.
- **Skill:** instructions that help the assistant perform a particular task. Avoid requiring familiarity with plugin architecture to understand the opening.
- **First success:** a newcomer chooses one installation route and gets a useful first response from one chosen GT skill. Avoid treating installation, file presence or catalog knowledge as proof of activation.
- **User environment:** the environment in which the selected client and installation operate. Windows and WSL are separate environments. Avoid implying that a Windows installation proves WSL readiness.

## Why

The previous introduction placed the maintainer dependency map before installation and combined onboarding with extensive maintenance, validation and provenance details. The marketplace description mentioned only plan interviews and updates despite the broader collection. The prototype addressed that imbalance with a short explanation, clear route choice and concrete first requests.

Andrew selected **“Both, new to skills”** as the audience, then said **“Okay, I think this looks good. Let's get started.”** His request to use Grill with UI was clarified as **“Use Grill with UI for this session”**. That changes the interview interface; it does not replace Grill Me in the README or request that the personal UI skill be added to GT.

## Locked decisions

No new interview decision met all three durability gates: hard to reverse, surprising without context and a consequential tradeoff. These are reversible editorial choices. Existing installation ownership and release rules remain inherited constraints, as recorded in [the installation-targeting resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/22#issuecomment-5752852987) and the [authoring guide](../../CONTRIBUTING.md).

## Routine choices

- **Audience and draft (Q1, carried forward):** serve both VS Code and Copilot CLI users who are new to skills. Andrew approved the prototype's structure, wording direction and three example skills. Do not repeat the completed audience decision.
- **Success criterion (Q2, browser send #1):** choose one route and receive a useful first response from one selected GT skill. Andrew accepted recommendation A. Understanding the collection without using it was less useful as the final success criterion; requiring all three example skills would add unnecessary work. Missing access or prerequisites can take longer, so “first five minutes” is a design target, not a timing guarantee.
- **First requests:** Help for choosing a starting point, Grill Me for sharpening an idea and Caveman Review for assessing a supplied diff. Examples state intended results; they are not evidence that all client workflows passed.
- **Installation:** give VS Code-only and CLI users separate short routes, linked directly from the choice table. Recommend one installation per environment while supporting deliberate separate copies. Keep the optional PowerShell installer and shell-specific shortcuts reachable through additional installation details.
- **Opening:** “GT — skills for your development workflow”, followed by a concrete value statement and a plain-language definition of a skill.
- **Reading order:** introduction, installation, first requests, further navigation, complete catalog, updates and maintainer material. Keep documentation in the README for this pass rather than introducing a new documentation hierarchy.
- **Links:** preserve every previous README section anchor and an explicit `andrew-skills` title anchor. The new catalog section is `#all-skills-and-requirements`. Maintain existing file, map and license links.
- **Marketplace description:** use “Skills to sharpen plans, review code, and create, contribute and manage reusable AI workflows.” in both manifests.
- **Help:** retain guidance-only behavior and existing route selection. The onboarding changes do not require a Help package edit. Do not invent a verified GT Help slash command or equate bare `/help` with the GT skill.
- **Git operation:** Andrew separately approved “Yes, fetch and fast-forward”. That operation updated the checkout while preserving prototype files. No commit, push, PR, merge publication or repository settings change was requested.
- **Session completion:** browser send #2 was Finish. The personal Grill with UI session is complete; the implementation still needs its actual validation results recorded.

## Verified facts

- Published main and the updated checkout were `2fd61f93bf0c9acf52f671f8aedec195088e4d86`, GT 0.1.18, when implementation began. The prior local checkout was `9f40cb04e594fb5232862018f535b08828d693d1`, GT 0.1.16.
- The published collection contains 18 skills including Help. It does not contain `grill-with-ui`; that skill is available personally and was used only to conduct this interview.
- The README, both manifests, Help instructions and accepted installation-targeting record were inspected. Official VS Code and Copilot CLI setup documentation was read on September 22, 2026. This supports documentation choices, not GT-specific client acceptance.
- Working changes update the README and both descriptions, proposing GT 0.1.19. No distributed skill files were changed, so no skill-version increment is appropriate.
- Structural validation, the published-history/release comparison and dependency-map freshness passed during implementation. Markdown was rendered, and local link/anchor checks were performed. Final regression and link-check results are recorded separately in the [implementation notes](gt-onboarding-prototype-notes.md) and issue #73.
- The current authoring rule requires one matching plugin patch for the manifest change. README-only documentation would not need a bump. The dependency map's content and source review remain unchanged by this editorial reordering.

## Risks

- Live discovery, invocation and loaded-source behavior remain client-specific. A readable README, valid manifests or files on disk do not prove those behaviors. The [owner pilot](https://github.com/AndrewGodlewsky/andrew-skills/issues/17) retains those checks.
- Installation prerequisites and trust/authentication prompts can prevent an immediate first response. Preserve that limitation without claiming the five-minute target as a measured outcome.
- Existing external backlinks are not enumerable from this checkout. Keeping all old section anchors reduces that risk; future relocations should retain a heading and destination link.
- Published main may advance before these changes are committed or published. Recheck the base and version transition at that time.
- A manifest patch and documentation improvements do not establish team-adoption readiness or resolve outstanding WSL acceptance.

## Deferred

No interview question was deferred. Actual newcomer walkthroughs, Windows/WSL client checks and observed first-response quality remain in the existing owner pilot. They resume with an identified candidate, available client/environment and Andrew's participation where required. This task does not install clients, sign in or change repository settings.

## Open threads

No interview discussion thread remains open. Issue #72 retains its own status; this document records the audience and first-success choices made while working #73 without silently closing a second ticket. Publication remains subject to Andrew's separate authorization.
