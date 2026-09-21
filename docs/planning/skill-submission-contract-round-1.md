# Shared issue submission — Round 1: the common format

Issue: [Define the shared issue format and submission contract](https://github.com/AndrewGodlewsky/andrew-skills/issues/28).

**Status: owner correction recorded.** The Summary/Details proposal below was not adopted. The caller owns the title and body, including its structure. Continue with [Round 2](skill-submission-contract-round-2.md); the original proposal and owner answer are preserved here as discussion history.

## Already settled

- Other skills supply all substantive content. This skill formats and submits it.
- Use one flexible format for every submission, without issue-type selection or classification.
- Submit only GT-related material, exclusively to AndrewGodlewsky/andrew-skills, even when called from another workspace.
- Permit model invocation and use existing workflow authorization; ask only when authorization is missing.
- Maintainers decide what to accept and how to change the collection.

## Proposed common format

Require only a caller-supplied **title** and a short **summary** of the idea, request or observation. Add **Details** only when the caller supplies more material.

```markdown
## Summary
<Caller-supplied idea, request or observation>

## Details
<Additional caller-supplied material, if any>
```

The title is the GitHub issue title, not a repeated heading in the body. Omit Details entirely when empty. Inside Details, preserve supplied Markdown and any useful existing headings. This leaves room for skill names/versions, examples, expected and actual behavior, proposed changes, links or a complete draft without requiring any of them.

Do not add empty sections, guessed facts, automatic issue-type prefixes or a technical questionnaire. A caller may simply supply an idea and a title. If a required input is missing, return that specific gap to the caller instead of composing missing substance.

### Minimal example

Caller-supplied title: **A GT skill for explaining designs**

```markdown
## Summary
I'd like a GT skill that explains a supplied design and its tradeoffs in plain language.
```

### Example with supporting content

Caller-supplied title: **Clarify an ambiguous grill-me question**

```markdown
## Summary
One question in grill-me was hard for me to understand.

## Details
### What happened
It asked whether the design was "sufficiently bounded." I didn't know what that meant.

### Suggested wording
"Is it clear what this design includes and what it leaves out?"
```

These are invented illustrations of the format, not observed defects or submissions to publish. Both use exactly the same outer structure; supporting headings come from the caller's content.

## One question for this round

**Does requiring a title and Summary, with Details only when supplied, give you the right balance of consistency and flexibility?**

Recommendation: use this minimal structure. It gives maintainers a predictable starting point without forcing future calling skills to fill out a long form.

### Your answer
I feel like this is too specific to a single format. This really feels like them submitting a skill, but the truth is, these issues can be used a lot more, or I want them to be able to use them a lot more flexibly than that. To a degree, the actual contents of the issue aren't determined by this skill. This skill is going to be called to physically create the issues in the repo, whatever The other skill that they're already using is going to determine the actual contents, as in the title and the details of the issue itself. Really, what I need this skill to do is:
- Have a way to ensure that the issues are created for this repo.
- Have the ability to add or instruct the other agent making the changes about the label system and maybe the projects.
- Maybe ensure that skills are appropriately linked to one another, so one skill can block another and things like that.
That's what I kind of need this to do. I don't know all the details because this is still kind of in my head, but that's what I need.
<!-- Write your answer here, or answer in chat. -->

## Still to settle after this answer

Final skill name; the exact caller handoff and missing-input behavior; content-preservation and size rules; concise result information; and whether the proposed Node.js/gh prerequisites fit the intended users. Detailed duplicate and retry policy remains in the separate recovery ticket. These are later topics, not additional questions for this round.
