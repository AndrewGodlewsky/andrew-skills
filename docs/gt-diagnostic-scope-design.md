# GT troubleshooting guide: scope decision

Published decision record: [resolution on #75](https://github.com/AndrewGodlewsky/andrew-skills/issues/75#issuecomment-5784265334).

Decision session for [#75](https://github.com/AndrewGodlewsky/andrew-skills/issues/75), finished September 22, 2026, using Grill with UI and Domain Modeling. Andrew chose documentation reachable outside GT, focused first on a user who installed GT but cannot find or invoke a skill. The guide will address both VS Code and Copilot CLI, distinguish Windows from each WSL environment, collect evidence one check at a time, and end with a short copyable summary and one useful next check or handoff. Agent-assisted installation is deferred. The final question about drafting before or after the live pilot was unanswered when Andrew pressed Finish; neither timing option is accepted. No diagnostic implementation or client verification was performed in this session.

## Terms

**GT troubleshooting guide**: Documentation available outside the installed GT collection that helps a user investigate why an installed GT skill cannot be found or invoked. Agent-assisted installation is a separate, deferred concern.
_Avoid_: Diagnostic skill, setup agent.

**GT installation target**: The particular installed GT collection selected for inspection. Selection does not establish which instructions an existing chat loaded.
_Avoid_: No additional forbidden synonyms agreed; use the established term consistently.

**Installation owner**: The client managing an installation, even when another client uses that same copy.
_Avoid_: Do not use the current client as a synonym for owner without source evidence.

The established installation terms come from [CONTEXT.md](../CONTEXT.md) and the accepted [installation ownership decision](https://github.com/AndrewGodlewsky/andrew-skills/issues/22). The troubleshooting-guide term was added to the glossary during this session.

## Why

Andrew accepted this primary problem and first result: “A user installed GT but cannot find or invoke a skill: identify where it stops and give one next check.”

The guide must be available during GT discovery failures. A diagnostic that exists only as an installed GT skill may be inaccessible to precisely that user. A README link and Help recommendation can point to documentation outside the installation, with detailed material kept out of the introductory README.

Andrew also raised a broader idea: “we can make a ‘for agents’ file or something along those lines,” giving an agent instructions for getting GT installed and set up, while keeping the README clean. After discussing a combined entry guide with distinct setup and troubleshooting routes, he selected troubleshooting first and deferred agent-assisted installation. That idea remains recorded; it is not authorization to build an installation agent or setup route now.

## Locked decisions

No separate architectural decision record was warranted. These documentation choices do not meet all three gates of being hard to reverse, surprising without context, and the result of a significant enduring trade-off. Accepted choices are recorded below; “routine” does not mean they were left to agent discretion.

## Routine choices

- **Q1 — Primary support situation: A, accepted recommendation.** Start with installed GT whose skill cannot be found or invoked. Locate the point where evidence stops and give one next check. Tool-dependent workflow failures and unexpected behavior were alternative primary scopes; they were not selected. They may require a handoff, but comprehensive diagnosis of those cases is outside this initial focus.
- **Q2 — Delivery: A, accepted recommendation.** A short troubleshooting guide linked from README and Help, usable even when GT is unavailable. A separate diagnostic skill and an executing extension of Help were not selected. Documentation is directly reachable during discovery failures and avoids maintaining a new runtime capability before the useful checks are established. Its cost is that users may gather some evidence themselves. Keep the README introduction clean by linking to detail.
- **Q3 — Agent-assisted setup: B, explicit option selection.** Deliver troubleshooting guidance first and defer agent-assisted installation. The suggested combined entry guide with separately scoped setup and troubleshooting tracks was not selected. Do not imply that the setup idea is approved for implementation or open a setup implementation ticket from this decision.
- **Q4 — Coverage: A, accepted recommendation after exploring all options.** Cover VS Code and Copilot CLI; treat native Windows and WSL environments separately and mark untested paths. Windows-only and CLI-only initial coverage were not selected. Both groups already appear in onboarding, and useful documented evidence routes exist for both. Coverage does not claim successful live verification. The cost is maintaining distinct branches and their evidence labels.
- **Q5 — Evidence collection: A, accepted recommendation.** Begin with client, environment, requested skill and symptom. Ask only for the evidence needed for the next branch, instead of requiring a complete report before giving help. Use the established installation-selection rules. A short flow can identify a disabled plugin or different client without asking for irrelevant versions or logs. The trade-off is that support may need a follow-up exchange when evidence is incomplete.
- **Q6 — Evidence routes: A, accepted recommendation.** Offer client UI evidence, narrow file/resource reads, and optional read-only inventory/help/version commands available in the selected environment. A UI-only guide was not selected. VS Code users do not need CLI; unsupported commands or unavailable source details produce explicit unknowns and a useful handoff. The cost is maintaining version-aware command fallbacks and keeping each check tightly scoped.
- **Q7 — Result: A, accepted recommendation.** Provide a short copyable summary: selected client/environment/source, relevant observed facts, clearly labeled inference, unknowns, and one next check or handoff. Merely showing the next instruction without a standard support summary was not selected. Relevant unknowns stay visible; irrelevant fields can be omitted. The format must not force extra collection merely to fill every field. Sharing or submission is a separate user action.

### User-visible contract

The guide starts with a concrete symptom and identifies the intended client and environment. It uses an explicit target choice and reliable registration/source evidence; if several candidates or conflicting evidence remain, it asks a concise target question. A choice expresses intent but does not itself verify ownership. Multiple copies can be deliberate and are not a defect.

For the selected target, a branch requests the smallest relevant observation available through the user's client. UI, readable installed resources and supported read-only commands are alternative evidence routes; none automatically becomes a universal prerequisite. Do not require a standalone CLI for VS Code-only users or infer WSL state from a Windows command result.

The result separates observations from interpretation. Files present on disk, client discovery/enabled state, instructions loaded for a particular request, and successful workflow behavior are different facts. When the evidence cannot establish one, say what remains unknown and name one useful next observation or handoff. Do not promise a fix or report a generic “working” flag from file presence.

The small support summary is a format to develop in the follow-up, not an implemented report here. Its accepted content is client/environment/source, relevant observations, labeled inference, unknowns, and the next check or handoff. Use aliases where identifying paths would otherwise be exposed. Do not request credentials, complete logs, full conversations, unrelated plugin inventories or broad environment dumps. A user may share the summary separately; the guide does not automatically submit it.

### Boundaries carried into the decision

The diagnostic remains read-only. It does not install, update, enable, repair, clean up duplicates, configure authentication or broadly scan environments. It does not bypass permission, authentication or security failures by changing tools or environments. A missing tool or ordinary unsupported option is an evidence limitation; a security denial is a stop.

Help retains its existing guidance-only boundary. It may explain the guide and supported reads, but this decision does not add command execution or skill invocation to Help. Skills Status retains its narrow installed-version contract; the richer support summary belongs to the guide rather than new Status columns or behavior. Runtime skills and manifests were not changed for this session.

## Verified facts

- [Research #74](https://github.com/AndrewGodlewsky/andrew-skills/issues/74#issuecomment-5783719920) distinguishes current documentation, inspected GT contracts, historical observations and untested cases. Its [local report](research/gt-installation-diagnostic-evidence.md) supplies the capability and installation matrices. No Copilot client was run during this decision session.
- Existing GT ownership rules distinguish the manager from a client sharing its installation. The selection contract requires source evidence rather than cache-path guesses, and treats Windows and WSL as distinct environments.
- VS Code has a documented native evidence route without standalone CLI. That documented capability is not proof that the owner's current VS Code setup has passed discovery or loading checks.
- Historical CLI 1.0.83 evidence and current documentation differ on some inventory syntax. The guide needs unsupported-command handling rather than assuming every installed version accepts current options.
- Existing research leaves request-specific loading, resource use and several client/environment cases unverified. Inventory output and process success alone cannot settle them.
- [#17](https://github.com/AndrewGodlewsky/andrew-skills/issues/17) owns live client acceptance. This session neither closes it nor replaces it with a documentation walkthrough.

## Risks

- A guide covering untested client paths could be mistaken for verified operational instructions. Label documented capabilities, historical observations and untested paths separately, and update exact steps when the pilot provides evidence.
- Command syntax and UI details can change. Check the actual supported capabilities and preserve meaningful unsupported-operation results instead of guessing.
- Too many report fields would undermine the agreed short flow. Gather only what the branch needs, and permit explicit unknowns and irrelevant-field omission.
- Users can confuse the manager with the client displaying a skill, or mistake a duplicate for corruption. Keep source selection explicit and avoid automatic cleanup conclusions.
- Existing-chat instructions may differ from current package bytes. The report must retain this uncertainty unless there is evidence tied to the particular request.
- A future agent-facing setup guide could blur inspection and mutation. That proposal remains deferred and needs its own scope decision before implementation.

## Deferred

- **Agent-assisted installation:** explicitly deferred by Q3. Reopen when Andrew chooses to address setup assistance as a separate scope. Preserve the preference for a clean README and an accessible detailed file. Do not assume a repository URL causes an arbitrary agent to find or read that file.
- **A dedicated diagnostic skill or executing Help extension:** not selected for initial delivery. Reconsider only if experience shows the documented flow imposes recurring effort that justifies a new maintained capability or a separately accepted contract change.
- **Comprehensive tool/prerequisite and unexpected-behavior diagnosis:** not the selected first support situation. Revisit based on concrete support cases rather than silently expanding this guide.
- **Live client acceptance:** remains in #17, including real source selection/loading and Windows/WSL behavior. No documentation prototype can certify those outcomes.

## Open threads

**Q8 — Prototype sequencing and acceptance:** unanswered at Finish. The proposed next artifact is a Markdown troubleshooting-guide draft plus example support summaries. The recommendation was to review scenario walkthroughs now while retaining live acceptance in #17; the alternative was to wait for #17 before drafting. Neither option is recorded as Andrew's answer.

The proposed walkthroughs cover VS Code without CLI, disabled GT, competing copies, Windows/WSL mismatch, unsupported inventory syntax and unknown chat loading. The proposed success criterion is reaching one useful next check without requiring GT to load, a CLI installation, or a full log dump. These are recommendations to resolve in the follow-up ticket, not accepted test results or an approved implementation schedule.

The concrete documentation/report prototype is tracked in [child issue #78](https://github.com/AndrewGodlewsky/andrew-skills/issues/78), with the unanswered sequencing decision prominent. The prototype was not started under this decision session. There was no visual request or visual artifact to export.
