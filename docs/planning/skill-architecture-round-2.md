# Skill architecture — Round 2: a small runtime, a clear standard

**Historical decision record.** The proposals, observations and owner answers below are preserved as recorded. For current authoring requirements, examples, release checks and evidence placement, use [CONTRIBUTING.md](../../CONTRIBUTING.md). For implementation status, see the [authoring handoff](skill-authoring-implementation-handoff.md).

Issue: [Define the standard skill structure and invocation policy](https://github.com/AndrewGodlewsky/andrew-skills/issues/19).

**Status: confirmed September 17, 2026.** After reviewing and discussing the requested research, you confirmed the compact runtime/review-evidence split, four explicit header fields and reviewed-extension policy. See the [accepted architecture contract](skill-architecture-contract.md). Original questions and answers below are preserved as the interview record; their provisional wording describes the earlier review stage.

## What is settled

- Manual invocation is the default; deliberate exceptions can allow model invocation.
- A skill should be small and focused. We should not turn the standard into a requirement for large workflows.
- `SKILL.md` and the already agreed `release.yaml` form the package minimum. Supporting folders/files are optional and included only when used; no empty scaffolding.

This is a direction toward focused skills, not an arbitrary size limit or a request to remove the existing update skill.

## 1. Should we separate execution instructions from authoring evidence like this?

**Recommendation:** Yes. The four content requirements mean “the author can demonstrate these things,” not “every `SKILL.md` needs four headings and a long example.” Keep enough in the skill for the agent to perform the task independently; keep reviewer-only material outside the runtime instructions.

| Information | Proposed location |
| --- | --- |
| Skill identity, purpose and when to use it | `SKILL.md` header: name and concise description. Do not repeat the description in a mandatory purpose section. |
| Inputs, essential behavior and expected result | Short `SKILL.md` body, using prose or bullets. Include a missing-input rule when needed. No mandatory headings. |
| Tools, action boundaries, failure behavior | In the body only where the skill actually needs them. Essential constraints must not exist only in reviewer documentation. |
| Longer guidance needed for some requests | Optional bundled reference, with a relative link and a clear condition for when to read it. Do not instruct every skill to load every reference. |
| Example request and expected outcome used to review/test the skill | Authoring/review evidence outside the distributed skill folder by default. Include an example in the skill only if it materially helps execution. |
| Version and short release note | `release.yaml`, as already decided. Ordinary execution need not read it unless the task needs release information. |

The contribution/blueprint issues will choose the canonical location for review evidence—such as a repository example/test record—and how authors submit it. This does not require a third mandatory file in every skill or a new metadata manifest. Published runtime behavior must not depend on repository-only review files: historical export carries the complete skill folder, not those external records.

### Example: the entire instruction file could be this small

```markdown
---
name: explain-design
description: Explain a proposed design and its tradeoffs. Use when reviewing a design.
user-invocable: true
disable-model-invocation: true
---

Read the supplied design and the user's goal. If either is missing, ask for it.
Explain the approach in plain language, identify the three most important
tradeoffs, and finish with a recommendation tied to the goal. Do not implement
the design as part of this skill.
```

Separately, a reviewer could record: “Given a design with two storage options, the response explains the approach, discusses three relevant tradeoffs, recommends an option and makes no implementation changes.” That review record is not text the skill must load on every use. This is a design example, not a newly created production skill.

### What can be checked objectively?

Automation can check required files, exact field names/types, matching names, valid release metadata, a nonempty body and resource paths. A reviewer still has to judge whether the instructions are clear and actually cover the task. Counting headings cannot prove useful behavior.

VS Code documents progressive loading of descriptions, instructions and referenced resources. The proposed layout uses that distinction, but does not guarantee a fixed token count or prevent an agent from reading other files when a task requires it. [VS Code loading behavior](https://code.visualstudio.com/docs/agent-customization/agent-skills#how-copilot-uses-skills).

**Why this matters:** This gives every skill the same verifiable package and header structure while allowing very short instructions. It also prevents an “efficient” skill from becoming unusable because its essential rules were hidden in documentation that does not travel with it.

**Question:** Does this split give you the consistency you want: a fixed minimal package/header, concise task instructions in the skill, and review examples outside it unless needed for execution?

### Your answer
Yeah, I think this is ultimately what I want. I like this idea. Can you spin off a quick subagent to do some deep research into actually understanding, when an agent calls a skill, what is it reading into the window? What context gets loaded into the window without the skill being called, and then what actually happens when a skill is called?

I'm just trying to figure out and make sure that I understand: if we add extra architecture or categories, a) it won't mess up anything that is supposed to happen, and b) it'll actually be helpful or useful.

If you spin off a subagent to do this work, just create me an HTML file so that I can review and broaden my understanding of how skills are actually working in depth. I'm looking for a very detailed understanding of this. I already have a good understanding of harnesses and stuff like that, so you can dive deep on this research and give me a very technical explanation. 
<!-- Write your answer here. -->

## 2. Should the header use a small required set, with extra fields reviewed explicitly?

**Recommendation:** Require these four fields to be written explicitly in every skill:

| Field | GT rule proposed |
| --- | --- |
| `name` | Matches the source folder; no plugin prefix or version suffix. |
| `description` | Briefly explains the capability and when to use it. |
| `user-invocable` | `true` by default. |
| `disable-model-invocation` | `true` by default, matching your manual-invocation choice. |

Allow `argument-hint` when helpful and license metadata when applicable. Other fields require a documented reason and client-support review before they become part of GT's accepted field set. Catch misspelled or unreviewed keys rather than silently treating them as meaningful configuration. Detailed review ownership and enforcement placement belong to the next two issues.

For a deliberate model-invocable exception, set `disable-model-invocation: false` and keep the exception's rationale in the authoring review, not as boilerplate runtime prose. Keep it user-invocable too unless there is a separately reviewed reason to hide it. Reject a configuration that intentionally leaves neither invocation route available in a published active skill.

Do not copy fields from other agent formats or add tool allowances just to document prerequisites. For example, the CLI reference describes `allowed-tools` as affecting automatic tool allowance; it is not merely a list of tools the author expects to exist. Such client-sensitive fields need their own reason and review. [CLI skill fields](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skill-frontmatter-fields).

This keeps the standard extensible without adding fields for owner, dependencies, model choice or runtime configuration to every skill. Existing version/notes remain solely in `release.yaml`.

**Why this matters:** The body can stay flexible while the header gives us a small, objectively checkable contract. Writing the flags explicitly also keeps the default obvious to reviewers and future authoring agents. Optional capabilities should earn their place rather than appearing in every template.

**Question:** Do you agree with this four-field header and reviewed-extension policy, including explicit invocation flags and separately reviewed exceptions?

### Your answer
Yeah, I think this is what we're going to end up going with: we're going to have a very small required set of fields and then maybe have extra optional fields. I would like to see and understand the research from the above subagent first before confirming any of this stuff. 
<!-- Write your answer here. -->

## Next step

The [accepted architecture contract](skill-architecture-contract.md) consolidates this round and the research for the contribution-process and blueprint issues. They still own evidence location, review responsibilities, final authoring documentation and enforcement/adoption planning. No production skill or validator has changed.

[Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md) requires that “A HITL ticket only resolves through that live exchange.” The owner supplied final confirmation in conversation on September 17, 2026: “Okay, I confirm. Let's continue with the current issue.”
