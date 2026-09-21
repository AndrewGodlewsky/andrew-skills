# create-issue prototype — review outcome

Issue: [Prototype submissions from creator, update and feedback skills](https://github.com/AndrewGodlewsky/andrew-skills/issues/30).

**Status: prototype accepted with qualifications; organization scope settled.** The owner's answers are preserved in [Round 1](skill-submission-prototype-round-1.md). No second prototype review round is needed. The owner then selected “Keep the three labels; defer native relationships” in the conversation. The acceptance/implementation handoff remains separate.

## Accepted and rejected examples

- Example A was explicitly rejected. Do not use that short idea paragraph as an accepted content-quality example. The owner did not give a specific reason for rejecting A; do not infer a ban on plain-language ideas or a mandatory length/template from that answer.
- Examples B–F were acceptable as examples of received issues. The owner nevertheless expects substantially more detail in real submissions, particularly skill tweaks. Acceptance of the flow does not establish that these abbreviated examples are sufficient production drafts.
- Follow-up behavior was accepted: authorized comments on anyone's issues; explicit title/body edits only to the authenticated actor's own issues; new open issues for actionable follow-up to closed issues.
- Partial-success and uncertainty wording was accepted. Following a focused scope clarification, keep the three labels and defer native relationships; the earlier full organization proposal is not a first-version requirement.
- The owner explicitly accepted the prototype as sufficient to proceed to the handoff.

## Caller content responsibility

The calling agent must gather and supply the actual relevant context in the issue description, especially when proposing a change to an existing skill. A bare request or short summary should not displace useful context the caller already has.

Useful caller-supplied context can include the affected skill, what prompted the proposal, the relevant exchange or example, observed versus desired behavior, the requested change and its reason, and known uncertainties. These are contextual guidance, not mandatory headings, a required technical form or a fixed length. Preserve appropriate uncertainty and do not fabricate evidence. Include only relevant material suitable for disclosure; do not dump private conversations, secrets or unrelated workspace data.

The shared `create-issue` skill preserves that supplied content. It does not investigate, interview the user, manufacture missing context, expand a draft or enforce a generic body template. Missing essentials still return to the caller. The future caller workflows own preparation and content quality; implementing those workflows remains outside this map.

## Organization scope

The owner said organization should not become a major source of complexity and selected **“Keep the three labels; defer native relationships.”** Retain `new-skill`, `enhancement-skill` and `inconsistent-skill`, including one-time provisioning, appropriate selection, additive application and honest missing-label/permission results. Native parent/child and blocker operations are deferred beyond the first version. Do not implement their endpoints or make their tests a prerequisite for the initial release.

Caller-supplied ordinary references remain content and must be preserved; do not imply they created native relationships. Actionable closed-issue follow-up still creates a new open issue with the caller's reference, without native linking. Resumption in the first version concerns missing permitted labels, not relationship edges.

Projects remain deferred. If organization is retained or added later, the previously agreed authorship, permissions, additive behavior and truthful partial-result rules still apply; reducing scope does not authorize broader mutations.

## Evidence and next step

The local prototype ran 29 synthetic scenarios, with syntax checks and an interactive uncertain-write walkthrough. That demonstrates a runnable design aid, not working Copilot invocation, GitHub API correctness or Windows/WSL acceptance. No prototype sample issues were published.

The [executable companion](../prototypes/issue-submission/README.md) is now an archived review aid. Its original short-content and organization fixtures are historical and must not silently become production acceptance criteria or a production helper. Keep the owner answers and this decision when replacing or removing the companion.

Next: [Define submission-skill acceptance and implementation handoff](https://github.com/AndrewGodlewsky/andrew-skills/issues/31). Carry caller-content quality expectations, labels-only organization, fixed-repository enforcement, accepted follow-up/recovery boundaries and actual client evidence requirements into that handoff. Production implementation remains pending; no commits or pushes are part of this resolution.
