# GT troubleshooting guide: walkthroughs and example summaries

Published artifact: [complete review packet on #78](https://github.com/AndrewGodlewsky/andrew-skills/issues/78#issuecomment-5784431308).

For [#78](https://github.com/AndrewGodlewsky/andrew-skills/issues/78). Reviewed September 22, 2026 against the [guide prototype](../prototypes/gt-troubleshooting-guide.md), the [scope decision](../gt-diagnostic-scope-design.md), and [research #74](https://github.com/AndrewGodlewsky/andrew-skills/issues/74#issuecomment-5783719920).

**These are fictional inputs and authored example outputs.** The checks are manual documentation walkthroughs, not client executions, model simulations, novice usability tests or observed behavior on Andrew's machine. “Pass” means the written route supports the expected limited conclusion and one next check without crossing the agreed boundaries. No Copilot client, installation, skill workflow or authentication was exercised.

## Timing and review scope

After the interview left Q8 open, Andrew asked to get work underway following the recommendation to draft now and check these six scenarios. That resolves drafting before completion of the live pilot. The review criterion is that each case reaches one useful next check or handoff without requiring GT to load, a mandatory CLI installation or a full log dump. Exact report wording is an authored proposal for review, not a verbatim user requirement.

## 1. VS Code without Copilot CLI

**Given:** A user on native Windows cannot find GT Help. They have no CLI. The affected VS Code Installed view shows enabled GT with the expected public repository source, but has not supplied requested-skill discovery or resolved-root details.

**Walkthrough:** Start with those four context facts in guide section 1. Use the VS Code branch of section 2, then section 3's enabled-entry route. Request only the GT Help entry in this window's skill/customization view. Do not send the user to a terminal or guess the installation root.

```text
Symptom: GT Help missing from the skill picker.
Target: VS Code, native Windows, profile-A; harness unknown.
Source: Installed entry identifies GT and AndrewGodlewsky/andrew-skills.
Observed: The entry is enabled in the affected workspace, per its Installed view.
Unknown: Requested-skill discovery/source and resolved installed root.
Next: Inspect GT Help's entry in this window's skill/customization view.
```

**Result: Pass.** No CLI, Node, Git, working GT invocation or complete report is required. The entry establishes only the facts supplied, not successful loading. If the client exposes no further detail, the same route ends with an explicit evidence gap.

## 2. GT disabled in the relevant scope

**Given:** The correct source is identified, and the affected workspace's installed-plugin entry explicitly marks GT disabled. The requested skill is missing from the menu.

**Walkthrough:** Section 2 records the effective scope. Section 3's first row supplies a focused handoff. Later discovery and loading checks are unnecessary for this first result.

```text
Symptom: Grill Me missing from the skill picker.
Target: VS Code, native Windows, workspace-A.
Source: GT-copy-A; expected GT repository, identified in the Installed view.
Observed: That entry is disabled for workspace-A.
Inference: Disabled state is a plausible explanation for the missing entry.
Unknown: Whether other problems would remain if that state were changed.
Next: Hand this state to the workspace owner to decide whether it should change.
```

**Result: Pass.** Disabled is distinct from absent. The guide does not toggle, repair, promise that enabling will solve everything, or gather unrelated evidence. A relevant inference remains labeled.

## 3. Competing copies with uncertain selection

**Given:** The same native environment contains two deliberately installed GT copies, one CLI-owned and one VS Code-owned, with verified registration/source evidence. Both are enabled. The user has not specified which copy should supply the requested skill; the menu exposes insufficient source detail.

**Walkthrough:** Section 2's source-association branch asks one target question. Section 3 preserves ambiguity rather than treating the second copy as corruption. Selecting a copy would resolve intent only; client source association would still need evidence.

```text
Symptom: The requested GT entry cannot be distinguished in the picker.
Target: VS Code, native Windows; intended GT copy undecided.
Source: GT-copy-A is CLI-owned; GT-copy-B is VS Code-owned.
Observed: Both registrations identify GT and are enabled; picker source is unclear.
Unknown: Which copy is intended and which copy the client selected.
Next: Ask which of the two verified copies the user intends to use here.
```

**Result: Pass.** No duplicate cleanup, personal-directory inventory, guessed qualified command or arbitrary source substitution occurs. The summary retains both unknowns without demanding they be answered simultaneously.

## 4. Windows evidence for a WSL problem

**Given:** GT appears in a Windows CLI inventory, but the reported failure occurs in Copilot CLI inside a developer WSL distribution. No evidence from that WSL client is available.

**Walkthrough:** Section 1 detects that the supplied evidence belongs to another environment and stops the current chain. Request the WSL client's own installed-entry evidence. The user may supply it through a supported route in that environment; this does not authorize automatic cross-environment inspection.

```text
Symptom: Grill Me unavailable in Copilot CLI.
Target: Copilot CLI in WSL distro-A.
Observed: Supplied inventory shows GT in native Windows only.
Unknown: GT registration, enabled state and skill discovery in distro-A.
Next: Obtain the affected WSL client's own installed-plugin entry.
```

**Result: Pass.** Windows success does not become WSL success or WSL absence. There is no distribution installation, tool installation, home/profile change, credential copying or authentication workaround.

## 5. Unsupported inventory syntax

**Given:** A user's earlier `copilot plugin list --json` returned `unknown option --json`. That build's supported listing has not yet been established. This fictional case is consistent with the historical CLI 1.0.83 finding in #74, but is not a fresh execution of it.

**Walkthrough:** Section 2's CLI failure branch treats this as a capability gap. The next check is `copilot plugin list --help`. If help supports a plain list, that becomes the subsequent check; if inventory remains unavailable, keep GT unlocated. Do not run a series of commands merely to populate the summary.

```text
Symptom: Cannot inspect GT with the suggested JSON listing.
Target: Copilot CLI in native Windows; version unknown.
Observed: Earlier plugin list --json returned “unknown option --json”.
Inference: This installed build does not support that requested option.
Unknown: GT registration and the listing syntax supported by this build.
Next: Inspect copilot plugin list --help in this same environment.
```

**Result: Pass.** An unsupported option never becomes “GT not installed.” The guide neither upgrades the CLI nor swaps configurations. Authentication/security rejection would take the stop branch instead of this ordinary syntax fallback.

## 6. Discovery known, chat loading unknown

**Given:** A selected GT source and requested skill are recorded as enabled/discovered. The user reports an unexpected response. No source-linked instruction evidence from that request has yet been provided.

**Walkthrough:** Section 4 asks for the affected response's existing References/source evidence where available. A result for another chat or readable installed file would not settle this request. If References are unavailable, hand off the evidence gap for a separately scoped reproduction rather than silently invoking the skill again.

```text
Symptom: The response did not appear to follow GT Help.
Target: VS Code, native Windows, affected request-A.
Source: GT-copy-A, associated with the requested skill's discovered entry.
Observed: The client lists that skill as enabled/discovered.
Unknown: Whether request-A included instructions from that GT source.
Next: Inspect the existing References on response-A for the skill/source association.
```

**Result: Pass.** Discovery does not become loading or compliance. The next step does not require new chat execution, logging changes, an export or full prompt disclosure. This case identifies the boundary of the initial missing/invocation scope rather than diagnosing all unexpected model behavior.

## Cross-case boundary review

| Additional branch reviewed in the written guide | Required distinction | Review result |
| --- | --- | --- |
| Missing GT | Complete relevant manager inventory versus missing menu/path | Absence is only asserted in a verified scope; otherwise unlocated/incomplete |
| Partial metadata or changing installation | Unknown fields versus coherent installed state | Missing metadata remains unknown; mixed revisions are qualified |
| Complete empty inventory | Empty versus failed listing | Empty requires a verified root and complete inventory |
| Model-only or manual-only skill | Invocation policy versus missing installation | Header inspection is data; a hidden menu/model entry alone is not absence |
| Same-name personal source | Source association versus filename match | No substitution or personal directory scan |
| Security denial | Access rejection versus ordinary unsupported syntax | Stop and report; no alternate-tool or environment retry |
| Support handoff | Useful small excerpt versus broad data export | Aliases and relevant facts only; no automatic submission |
| Skill starts then fails | Invocation problem versus workflow prerequisites | Exact failure is handed off; no universal tool checklist or repair |

These are editorial consistency checks, not additional runtime tests. No automated behavior tests were written for this Markdown prototype.

Structural validation also passed: 11 local links/anchors across the guide, walkthroughs and sequencing addendum resolve; table widths and code fences are consistent; whitespace and unfinished-placeholder checks pass. All six required scenarios have an explicit result. These checks verify the artifacts, not client compatibility.

## Proposed entry points for later adoption

The prototype lives outside the GT package and can be read without installed GT. These are proposed integration text, not changes already shipped to README or Help:

- **README, Explore further:** “Can't find or start a GT skill? Read the troubleshooting guide.” Link to the adopted guide in repository documentation; keep the actual flow off the introductory README.
- **Help, existing ‘Why can't I see a skill?’ answer:** “The GT troubleshooting guide walks through the installed entry, selected source and available request evidence. Follow the branch for your client; it ends with one next check or a short support summary.” Link to the published guide once adopted. Help still only explains steps and uses its currently permitted resource reads; it does not run the guide's commands.

Reviewed `skills/help/SKILL.md`, including its guidance-only/source-reading rules and current missing-skill advice. The prototype is consistent with those rules. No installed Help guidance, skill version, manifest or dependency-map source was changed for this draft. Adoption should add the published link and follow Help's normal release/map review in the same change. Skills Status requires no expanded output or new dependency.

## What remains for the owner pilot

The six walkthroughs pass their documentation criterion, but no novice has tried them and no real client route was executed here. [#17](https://github.com/AndrewGodlewsky/andrew-skills/issues/17) still needs real client evidence for VS Code-only use, shared/separate-copy selection, the actual CLI build's syntax, developer WSL, and existing-versus-fresh request loading. Exact GT command spellings and unexpected client UI differences must be established there rather than inferred from these examples.

A later human review can change wording or the number of prompts if the guide is too burdensome. Agent-assisted installation remains deferred. This artifact validates the proposed decision flow; it does not publish the guide as client-certified support instructions.
