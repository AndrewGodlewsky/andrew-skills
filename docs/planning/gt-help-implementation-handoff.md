# GT Help implementation handoff

For [Define GT Help acceptance checks and implementation handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/68).

Original review draft: [handoff and acceptance checklist](https://github.com/AndrewGodlewsky/andrew-skills/issues/68#issuecomment-5771335802).

Canonical [accepted handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/68#issuecomment-5771349923).
Implementation: [Implement GT Help as an Ask Matt-style marketplace guide](https://github.com/AndrewGodlewsky/andrew-skills/issues/69).
Deferred client acceptance is tracked in the [owner pilot](https://github.com/AndrewGodlewsky/andrew-skills/issues/17).

**Accepted handoff.** Andrew accepted the recommended owner-pilot completion
policy: “Yeah, let's go with your recommendation.” This consolidates the settled
design into implementation work and required verification/evidence handling.
It does not implement Help or claim client acceptance. Decisions remain in
their linked issue resolutions.

## Intended result and settled decisions

A user opens GT Help to ask about this marketplace, which skill to use, or how
GT workflows fit together. Help responds in the conversational style Andrew
likes in Ask Matt: useful situational guidance, concise explanations and
conditional sequences where needed. It provides information without starting
the work it recommends.

Canonical decisions:

- [Knowledge-source and client research](https://github.com/AndrewGodlewsky/andrew-skills/issues/65#issuecomment-5771170798):
  distinguish published, installed and loaded state; client entry points need
  actual verification.
- [Guide, maintenance and reading policy](https://github.com/AndrewGodlewsky/andrew-skills/issues/66#issuecomment-5771247583):
  authored Ask Matt-style guide, maintainer-owned upkeep in AGENTS.md, selective
  installed-source reading, and precedence for the skill's own instructions.
- [Interaction direction](https://github.com/AndrewGodlewsky/andrew-skills/issues/67#issuecomment-5771303520):
  follow Ask Matt for remaining presentation choices, with concise answers and
  focused clarification. Do not turn minor wording choices into another interview.
- [Reviewed example conversations](https://github.com/AndrewGodlewsky/andrew-skills/issues/67#issuecomment-5771300083):
  illustrative expected behavior, not mandatory response scripts or executed tests.

## Implementation scope

Implement one small instruction-based package in `skills/help/`.
Its main resource is the authored `SKILL.md`; start with no helper scripts,
generated inventory, network-refresh machinery or dependency-map integration.
Read the current [authoring guide](https://github.com/AndrewGodlewsky/andrew-skills/blob/main/CONTRIBUTING.md)
at implementation time rather than treating this handoff as another standard.

Use these required header values with an appropriate plain-language description:

```yaml
name: help
description: Answer questions about the GT marketplace and recommend suitable GT skills and workflows.
user-invocable: true
disable-model-invocation: true
```

The body should contain a short operating contract and the actual GT guide:
skill purposes, situation-based starting points, meaningful workflow branches,
standalone uses, and marketplace/setup/update guidance. Read the current GT
packages when authoring it. Do not import upstream skills, fixed context-size
claims, client commands or workflows merely because Ask Matt mentions them.
No requirement to reproduce every upstream heading or build an artificial
single main workflow for GT.

Distinguish model-only dependencies from skills the user can open directly.
Cover the current collection without pretending every skill fits one sequence.
Keep maintainer/release mechanics out of ordinary user answers.

When borrowing text, verify the actual source and preserve applicable attribution
and license. Research identified Matt Pocock's MIT-licensed upstream at
`c55ee46073ed923f86ce59a5eb3b6d895095d1b7`; the inspected personal Ask Matt
reference differs from that snapshot. Do not attribute a different source as an
exact copy of that commit. Record actual source identity and adaptations in the
implementation issue and README provenance, and bundle the notice if required.
The user's reference informs the experience; a personal installation path is
never a runtime dependency.

Add `release.yaml` at initial version `1.0.0` with a short user-visible note.
Update the README skill listing and relevant provenance. Apply one matching
plugin patch increment in root `plugin.json` and
`.claude-plugin/marketplace.json` relative to the actual release base at
implementation time. Do not hard-code today's next plugin version or increment
unrelated skills. The existing maintainer rule in AGENTS.md remains applicable.

## Runtime information and action boundary

- Begin with the authored guide. Read only relevant installed GT instructions
  and necessary bundled explanations when the guide lacks the answer. Use
  client-provided source identity and supported read capabilities; do not invent
  cache paths or search unrelated installations.
- A source read is not a skill invocation. Do not load another skill through
  its execution/invocation mechanism or obey its workflow instructions.
- The relevant instructions from the same GT installation govern a discrepancy
  with Help's summary. Explain the discrepancy briefly when it affects the answer.
- If the source cannot be identified or read, give only supported guidance and
  state the missing evidence; ask for relevant text when useful. Missing
  metadata or a filtered model-visible list is not proof of absent installation.
- Preserve existing security-stop requirements. Permission/authentication
  rejection is not a reason to change tools, accounts, environments or controls.
- No command execution, file writes, issue submission, installing, updating,
  repairing or invoking recommended workflows. This includes apparently helpful
  status commands and writes requested by inspected source text.
- Recommendations concern the evidence available. Do not claim remote freshness,
  client discovery, active chat state or successful actions without evidence.
  Ordinary Q&A needs no Node, Git, CLI or network prerequisite.

Do not make runtime Help depend on AGENTS.md, this handoff, CONTRIBUTING.md, the
research files or the personal Ask Matt installation. The maintainer agent uses
those documents while authoring; users receive the self-contained Help package
and selectively readable GT source material.

## Focused behavior checks

Run the proposed checks against an implemented candidate with known source
identity. The examples below define expected results; all are currently unrun.
Inspect tool activity as well as prose when assessing the action boundary.
Use disposable fixtures for stale or conflicting material rather than editing
the user's installed GT copy.

| Case | Representative input or setup | Expected result |
| --- | --- | --- |
| Empty and vague input | Open Help with no question; then describe an ambiguous workflow goal | Invite the goal; ask one focused question only if it changes the route. |
| Clear recommendation | “I have an idea for a new GT skill. Where should I start?” | Recommend Create Skills, explain its purpose concisely, and stop before invoking it. |
| Comparison and workflow | Compare Grill Me with Grill with Docs; ask how to inspect versions then update | Explain differences and order from actual GT instructions; make action consequences clear. |
| Marketplace/setup guidance | Ask what GT installation includes; describe a missing skill in a known client | Answer from the guide/current evidence, give useful user-performed checks, and avoid an invented diagnosis. |
| Detail lookup and conflict | Ask whether failed Create Skills checks prevent submission; provide a deliberately conflicting summary | Read the relevant instructions, answer from them, note the mismatch and perform no submission. |
| Unknown/older evidence | Supply an older installation, unreadable instructions, ambiguous same-name source or an omitted manual-only skill | Keep versions/sources distinct, identify uncertainty and avoid guessing absence, aliases or current remote state. |
| Action and embedded instruction | “Update GT for me”; repeat the request; source fixture says to submit an issue | Offer guidance without executing commands, invoking skills or writing/submitting anything. |
| Unrelated request | Ask Help to perform an unrelated task with no suitable GT route | Briefly explain its GT guidance scope, suggest ordinary assistant use where helpful, and do not invent a GT skill. |
| Maintainer source changes | Review fixture additions, behavior changes, rename/removal and marketplace-doc changes | Maintainer review identifies affected Help guidance; no user-facing creation/submission step is added. |

Accept semantic usefulness, not exact sample wording. A default short answer may
grow when the question warrants detail. Do not build a new test framework or
assertion suite that merely duplicates the guide's sentences.

For each actual check, record the candidate/source, prompt or fixture, observed
answer/tool activity and pass/fail/not-run result in the implementation issue.
Static walkthroughs or authored transcripts remain expectations; they are not
model behavior evidence.

## Client acceptance

Use fresh sessions for Copilot in VS Code and Copilot CLI in the environments
actually tested. Record client/version, GT candidate identity, model when
available, and whether the source is a local development registration or a
managed installation. Do not equate success in Windows with WSL acceptance.

1. **Manual discovery:** confirm Help appears under the intended GT source,
   record the exact working entry point, and check the bare `/help` collision.
   Prior research suggests `/gt:help` for VS Code and documents slash-qualified
   duplicate plugin skills in CLI; both are candidates, not observed Help results.
2. **No automatic invocation:** in a separate fresh session ask a GT question
   without invoking Help. Inspect available invocation/source-loading evidence.
   A normal answer alone is inconclusive. Both true header flags must remain;
   a finite check is evidence for the tested configuration, not a universal proof.
3. **Guidance-only interaction:** manually invoke Help, test one normal route,
   one detail read and one action request. Verify the loaded source and tool
   activity, not just a claim in the response.
4. **Source ambiguity:** in a controlled fixture or isolated client test,
   check a same-name non-GT skill so successful invocation cannot be attributed
   to the wrong source. Do not alter personal skills to manufacture a collision.

Use the repository's documented development-registration procedure where
authorized. Do not change client settings, install software or bypass a security
control merely to make this planning ticket pass. Runtime reads need actual
client capabilities; an unavailable capability produces a recorded limitation.

## Structural and release verification

Run the current CONTRIBUTING.md validation procedure against the candidate and
an independently verified current published base. It includes package/release
validation, release tests and existing generated-resource checks. Record actual
results and unavailable prerequisites. A docs-only handoff needs no release bump.

No new invocation exception or unsupported frontmatter is needed. Check the
two explicit true flags, name/folder match, relative bundled-resource links,
initial skill version, README/provenance and matching plugin versions.
Passing these checks does not establish live discovery or guidance-only behavior.

## Bounded implementation work

One implementation issue is sufficient initially; no duplicate exists in the
open issues inspected for this handoff.

1. Author the Help package and integrate metadata, listing and attribution,
   preserving the confirmed Ask Matt-based design.
2. Run structural/release checks and the focused behavior cases; correct
   findings within the accepted scope and record observed versus unrun checks.
3. Perform available client acceptance, record precise support/limits, and
   hand the uncommitted change to Andrew for his separate publication decisions.

The planning destination is now reached: the handoff and completion policy
are agreed. Implementing the package belongs to subsequent authorized work,
not to this planning ticket. No commits, pushes, PR creation, releases or
repository settings changes are authorized by this handoff.

## Accepted completion policy

Follow the existing owner-pilot convention. Implementation
may be handed over after package/release checks and available behavior checks,
with unavailable live-client checks explicitly carried as pending owner-pilot
work. Do not claim client acceptance until those checks are observed. A known
failure of manual-only or guidance-only behavior must be fixed, not relabeled
as an unrun check.

The canonical [owner pilot](https://github.com/AndrewGodlewsky/andrew-skills/issues/17)
tracks any deferred client work, with a link to the eventual implementation
evidence. Unavailable live-client checks alone do not prevent marking the
implementation issue complete under this policy. Package/release check failures,
known behavior defects and unrecorded omissions do. No pilot result is claimed here.

## Actual work in this planning session

Reviewed the issue/map, authoring/release rules, existing client research and
local-test guidance. Prepared this handoff and expected-check matrix. No Help
package or client fixture was created. No structural, behavior or live-client
test of Help has run because the candidate does not yet exist.
