# Shared issue creation — Round 4: labels, intake and invocation

Issue: [Define the shared issue-creation and organization contract](https://github.com/AndrewGodlewsky/andrew-skills/issues/28).

**Status: owner answers recorded; contract discussion complete.** Labels, model-only invocation and the proposed prerequisites are accepted. Projects are deferred with future extension preserved. The owner requested troubleshooting alternatives for missing prerequisites. See the [consolidated contract](skill-submission-contract.md) and [working decisions](skill-submission-contract-notes.md). Original recommendations and answers are preserved below.

## What I took from your answers

- This capability normally works with the calling agent. The caller handles the human conversation and supplies the content.
- Prefer one issue per problem, with links and sub-issues when useful. The shared capability should not invent or split the work itself.
- Keep successful issue creation even when some organization cannot be completed, and report exactly what is missing.
- Prefer the name `create-issue`; consider making it available to the model without a manual slash command.
- Use meaningful skill labels and propose an approach that will stay readable when the repository receives many issues.

The remaining questions below refine that direction rather than reopening the body-format discussion.

## 1. Confirm the three labels and their meanings

Your answer named three labels but described two of the categories explicitly. I interpret enhancement as a requested change to an existing skill. I recommend these lowercase spellings to match the repository's current label style:

| Proposed label | Meaning | Example |
| --- | --- | --- |
| `new-skill` | Propose adding a skill that is not currently in the collection. | “A skill to explain design tradeoffs.” |
| `enhancement-skill` | Request an addition or improvement to an existing skill. | “Let restore show a preview before exporting.” |
| `inconsistent-skill` | Report unexpected, confusing or inconsistent behavior in an existing skill. | “The same request produces conflicting instructions.” |

These describe the caller's intent, not acceptance, priority or proof of a defect. A skill can behave consistently but still unexpectedly; I propose including that under `inconsistent-skill` so users do not have to prove inconsistency to report a problem.

Choose one of these as the main label when it fits a skill-related issue. Use caller context to select it, and return ambiguity to the calling agent. For other work in this repository, retain suitable existing labels such as `documentation` or a caller-declared Wayfinder label rather than forcing every issue into a skill category. Additional labels should add useful information, not repeat the same category.

These three labels are **not currently present**. A reviewed implementation/setup task would provision them once; the runtime skill would use existing labels and report a missing one instead of creating arbitrary labels.

**Question:** Do these names, meanings and treatment of other repository work match what you intended?

### Your answer
Yeah, I think these look good. I'm open if you have any ideas for any other labels you think we should include, but I think those make sense to me. 
<!-- Answer here. -->

## 2. A concrete approach to handling many issues

**Recommendation for the first version:** Use the three labels to give maintainers separate lists of new-skill ideas, improvements and behavior reports. Keep issue titles specific, and have callers include the affected skill's name when known. Put that advice in the caller guidance; do not silently rewrite supplied titles or require a template.

For a known relationship, use a parent issue to collect a larger effort and explicit blockers to show ordering. The submitting skill does not assign priority, accept a proposal, assign maintainers, close duplicates or start implementation. Related-issue lookup can help avoid duplicate intake; its exact policy is already a separate planning ticket.

**Useful later addition:** A GitHub Project named **GT Intake**, with columns **Inbox**, **Ready**, **In progress** and **Done**. New entries would start in Inbox. Maintainers, or an independently authorized maintainer workflow, would decide what becomes Ready and move it through implementation. Views could separate the three labels without changing the underlying issues. GitHub Projects supports table/board views and filtering; this board is a proposal, not an existing configuration. [GitHub Projects documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects).

I would start with labels and issue lists, then add that project when you need an implementation queue. This keeps project access from becoming a submission prerequisite. If you want the board in the first version, its exact identity, intake permissions and partial-failure behavior need to be included in the metadata research before implementation.

**Question:** Start with labels and filtered issue lists, with GT Intake as a later addition, or include the proposed board in the initial plan?

### Your answer
I definitely want to think about this going forward in the future, but as long as what we're building today isn't going to cause problems and can be enhanced or iterated upon in the future, I'm fine with that. 
<!-- Answer here. -->

## 3. Make create-issue a background capability

**Recommendation:** Use `create-issue` with model invocation enabled and manual slash-command visibility disabled. The calling agent loads it when an authorized issue submission is ready; missing content or setup information goes back to that agent, which decides whether to ask the user.

The documented flags are `disable-model-invocation: false` and `user-invocable: false`. VS Code documents hiding the slash-menu entry while permitting automatic loading; Copilot CLI documents the corresponding invocation controls. This does not make the skill secret, hide it from every settings/catalog view, grant write permission or guarantee model selection. [VS Code skill controls](https://code.visualstudio.com/docs/agent-customization/agent-skills), [Copilot CLI skills reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skills-reference).

Your proposed role supplies a reason for this exception to GT's manual-invocation default: it is a shared dependency whose caller manages the human conversation. The authoring guide permits this flag combination with recorded rationale; actual client behavior still needs testing.

**Question:** Shall we adopt model-only invocation for `create-issue`, with no manual slash-menu entry?

### Your answer
Yeah, I like this. 
<!-- Answer here. -->

## 4. Decide the acceptable setup cost

The transport research recommends a small bundled helper that fixes this repository in code, rather than relying solely on an instruction to a general GitHub tool. The proposed implementation uses Node.js and the user's existing authenticated GitHub CLI (`gh`) in the environment where it runs. Neither dependency is assumed to be available just because Copilot is installed.

**Recommendation:** Accept those prerequisites for the first version, subject to the remaining metadata research. On a machine or WSL environment that lacks them, return an actionable setup requirement to the calling agent. Do not install anything, copy credentials or switch environments automatically. Ordinary users should not need a checkout of this repository.

The benefit is one small, testable submission path with a fixed destination. The cost is that some users need setup before they can submit. The helper restricts its own requests; it cannot restrict every other tool the surrounding agent can access. A requirement to work with no additional local tools would need us to revisit the transport design and its enforcement limits.

**Question:** Is the Node.js plus authenticated GitHub CLI prerequisite acceptable, or must the initial version work using only an already configured Copilot GitHub integration?

### Your answer
Yeah, I'm fine with accepting these. I would like to have some alternate ways to troubleshoot to be able to create this issue, even if those things aren't available, but we can assume that they are for now. 
<!-- Answer here. -->

## Proposed caller flow for review

1. Caller supplies a title/body, purpose, existing authorization context and any intended labels or issue relationships. There is no repository argument.
2. `create-issue` returns any missing essentials to the caller, preserving the material. It does not start its own human interview or invent missing facts.
3. Once ready, create the issue in this repository and apply the agreed organization when possible. Prefer one issue for the problem; the caller may repeat the operation to create explicitly requested sub-issues and link their returned identities. Native blocking and parent/child relationships are distinct operations, not inferred from a mention in the body.
4. Return the verified issue link, applied labels/links and any incomplete steps to the caller. A timeout or uncertain result is never permission to blindly create another issue. Existing security stops and tool approval prompts still apply.

This is a proposed integration flow, not a promise of a separate agent or universal callable-skill API. Any extra relationship operations needed to connect newly created issues must be explicit, fixed to this repository and covered by the metadata/recovery design.

## After this round

We can consolidate the owner-facing contract from these answers. The metadata research and duplicate/recovery decisions then determine exact operations, limits and verification before the caller examples and implementation handoff. No labels, projects, production skill or runtime settings have been created by this review round.
