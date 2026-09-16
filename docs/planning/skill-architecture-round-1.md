# Skill architecture — Round 1

Issue: [Define the standard skill structure and invocation policy](https://github.com/AndrewGodlewsky/andrew-skills/issues/19), assigned to AndrewGodlewsky.

**Status: answered and reviewed.** You chose manual invocation by default with deliberate model-invocation exceptions, and lean packages with supporting files only when needed. You asked where the required content belongs so skills stay small; that placement is not settled yet. Original answers remain below. [Round 2](skill-architecture-round-2.md) explains a concrete minimum without requiring four runtime sections.

## Starting point

We are defining a standard people and a future skill-creator can follow. Creating that skill-creator remains later work. The agreed `release.yaml` version/notes format, native GT updates and personal-export rules stay in place.

Both existing GT skills are manual-only today. That is the current implementation, not yet a rule for every future skill. The [technical notes](skill-architecture-notes.md) separate repository behavior, documented client capabilities and decisions still open.

## 1. Should new GT skills require explicit invocation by default?

**Recommendation — A:** Make new skills manual-only by default, with a deliberate per-skill exception when automatic selection is useful. Keep them user-invocable. Record both flags explicitly so the policy is visible during review.

Here, *manual-only* means the user invokes the skill rather than the model selecting it because the task seems relevant. *Model-invocable* means the model may select it; it does not mean background scheduling or permission to perform every action described in it.

Proposed default header, using an illustrative skill:

```yaml
---
name: explain-design
description: Explain a proposed design and its tradeoffs. Use when reviewing a design.
user-invocable: true
disable-model-invocation: true
---
```

A reviewed automatically selectable skill would use `disable-model-invocation: false`. **Alternative — B:** Make automatic selection the default, with explicit manual-only exceptions for workflows such as updating or restoring skills. Either approach can require both flags to be written out.

Both VS Code and Copilot CLI document these two flags; omission permits automatic selection by default. Those platform defaults need not be GT's authoring default. Documentation is not a new live compatibility test. [VS Code skill fields](https://code.visualstudio.com/docs/agent-customization/agent-skills#skillmd-file-format), [CLI skill fields](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skill-frontmatter-fields).

**Why this matters:** It determines when teammates encounter a workflow and how much control they have over starting it. An explicit default helps a future authoring agent avoid accidentally making an action-oriented skill automatically selectable. Exceptions still let useful guidance skills be selected when relevant.

**Question:** Do you prefer A, manual-only by default with deliberate exceptions, or B, model-invocable by default with manual-only exceptions? Is explicitly declaring both flags right for GT?

### Your answer
Yeah, I think by default we want them to be user-invoked. I'm sure there are going to be some scenarios where we want model-invoked to be fine, but let's, by default, have them user-invoked. 
<!-- Write your answer here. -->

## 2. What must every skill explain, without becoming a long form?

**Recommendation:** Require clear coverage of four things, while allowing authors to combine sections and use headings appropriate to the skill:

| Required content | What it answers |
| --- | --- |
| Purpose and when to use it | What problem does this skill solve, and when is it relevant? |
| Inputs and procedure | What context does it need, and what steps should it follow? |
| Expected result | What should the user receive, and how does the skill know it is finished? |
| A representative example | What does a normal request and useful outcome look like? A short example is enough. |

Require extra instructions **when relevant**: tools/services and setup, supporting resources, changes it makes, necessary user choices, failure/cancellation behavior, or constraints specific to that skill. A simple explanatory skill should not need empty scripts, error-handling or prerequisites sections. Existing user permissions still apply; the standard would not require a new confirmation before every harmless action.

For example, an explanation skill might be a few paragraphs plus an example. An updater needs precise commands, success/failure checks and a result format. Both can meet the same standard without having identical bodies.

**Why this matters:** Required information makes skills understandable and reviewable. Mandatory boilerplate headings can instead produce pages of “not applicable,” which are harder for people and agents to use. The standard should require useful instructions, not length for its own sake.

**Question:** Is this a sufficient minimum, with conditional sections where needed, or do you want a fixed set of headings every skill must use? Note any missing required content.

### Your answer
I think this is fine. I would like a little bit more of an explanation. When we're saying "require coverage of four things," does that have to be in the skill itself, or will that be outside? I do want to make sure that we have a solid minimum architecture for every single skill, so we know they'll all be consistent, objectively. I also want to make sure we don't bloat the context of the agent that's actually loading in the skill itself, because a lot of our skills should be very minimal by design. 
<!-- Write your answer here. -->

## 3. Should the skill package be minimal, with supporting folders only when used?

**Recommendation:** Require only `SKILL.md` and the already agreed `release.yaml` in each published skill. Use conventional supporting folders when useful; do not create empty folders or a second per-skill README just to satisfy a template.

```text
skills/<skill-name>/
  SKILL.md          # Identity, invocation policy and instructions
  release.yaml      # Version and short release note — already decided
  scripts/          # Optional executable helpers
  references/       # Optional supporting documentation
  templates/        # Optional reusable starting files
  assets/           # Optional non-instruction resources
```

Bundled resources are linked with paths relative to the skill folder. Keep the complete skill self-contained for historical export. External tools or services can still be prerequisites, but must be explained; do not assume private absolute paths or hide dependencies on another GT skill. Do not add machine-readable dependency metadata unless a concrete requirement justifies it.

Larger worked examples can live in `references/` or a clearly named example file. Attribution or license files belong in the package when applicable. Behavior tests can follow the repository's later testing convention rather than forcing a `tests/` folder into every distributed skill.

**Why this matters:** A small predictable package is easy to create, review, version and export. Conditional folders leave room for more capable skills without making every author maintain unused scaffolding. It also keeps the version record in the single location we already selected.

**Question:** Does this minimal package with optional conventional folders fit, or are there additional files you want required for every skill?

### Your answer
Yes, I think we should have a well-defined structure, and I think a lot of what you're proposing here is already well-defined. Everything should be optional and not included unless we build a skill that requires them. I do want everything to be minimal and lean, because my idea of skills ultimately is not workflows. We're going to try and avoid having skills that are super large with super lots of everything in them, but it is good that we have a solid architecture like this, so we know where things are going to go. I think this looks good. 
<!-- Write your answer here. -->

## What follows

Your answers set the foundation. The next review can address remaining metadata/exception choices, such as optional hints or client-specific fields, using concrete examples rather than adding a broad schema in advance. The contribution-process and final-template issues will use the architecture decision afterward.

[Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md) requires that “A HITL ticket only resolves through that live exchange.” These recommendations stay open until you answer. No production skill, validator or publishing behavior changed.
