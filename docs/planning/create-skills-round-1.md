# Create Skills — interaction review, round 1

Issue: [Plan Create Skills authoring and submission workflow](https://github.com/AndrewGodlewsky/andrew-skills/issues/38).

Add your answers under the four questions at the end. The examples below are
fictional design illustrations, not real user reports, existing GT features,
completed tests or submissions. None of their sample content has been published.

Already decided: support creating and improving skills; use Matt's former
authoring workflow and current writing guidance; bundle an attributed adaptation;
allow both proposals and checked packages; allow incomplete proposals with their
gaps recorded; submit through GT's existing `create-issue` dependency.

## Example A — turn a need into a useful proposal

**User:** “Create a skill that helps me prepare a project handoff. I keep leaving
out the reasons behind decisions, and the next person has to ask me again. I
want to propose it first, without building the whole thing.”

**Creator:** “I’ll help shape the proposal. What would you normally give it as
input, what should the next person receive, and what was missing from a recent
handoff?”

**User, in this fictional example:** “I’d paste meeting notes and my own bullets.
For our last website update, the handoff listed the remaining pages but didn't
explain why we postponed search. I'd want decisions and their reasons, unfinished
work, and questions for the next person. Don't invent owners or deadlines.”

The creator has enough context for this requested proposal. It does not make
the user choose a folder name, release number or technical file layout.

**Proposed issue preview:**

> **Title:** Propose a handoff skill that preserves decision reasons
>
> I want a GT skill that turns pasted meeting notes and personal bullets into a
> handoff for the next person on a project. Our recent website handoff captured
> unfinished pages but omitted why search had been postponed; the next person
> had to reconstruct that decision.
>
> The useful result would group decisions with their stated reasons, unfinished
> work, and open questions. It should identify missing reasons, owners or dates
> instead of inventing them. The input should be the material the user supplies;
> broad searches through private project files are not part of this proposal.
>
> This is a proposal for discussion. No skill package, structural validation or
> client behavior test is included. The maintainer should consider whether an
> existing GT workflow already covers this need before choosing a new skill.

The user can revise the preview. Once the conversation establishes that this
content is ready to submit and submission is authorized, the creator hands it
to `create-issue` with the `new-skill` label. It reports the actual returned
issue link and any incomplete label result. It does not present an invented
successful result or ask again for permission already supplied.

## Example B — improve an identified skill and submit its complete draft

For this illustration only, suppose a fictional GT `handoff-notes` skill at
version 1.2.0 exists at an identified published revision.

**User:** “Improve handoff-notes. It turns unresolved questions into action items.
Here are my input notes and the output that went wrong. I want a draft I can
submit for review.”

The creator reads the identified source and the supplied example. It establishes
which output should change and what should stay the same. It can group related
questions, such as whether an item without an owner belongs among open questions
and whether the current decisions section should remain unchanged.

It writes a separate draft, preserving the installed original. It applies the
writing guidance to make the question-versus-action distinction explicit and
adds a representative scenario for review. It prepares `SKILL.md`, `release.yaml`
and only the references/scripts that the draft actually uses.

**Draft review preview, with illustrative statuses:**

| Item | What the creator would show |
| --- | --- |
| Source | Exact `handoff-notes` revision and version used; separately note the user's installed version if different. |
| Change | Unresolved questions stay questions; stated tasks remain tasks. Existing decision formatting is preserved. |
| Files | Each proposed file and its complete contents, plus a concise explanation of changes. |
| Version | Proposed 1.2.1 if this restores the documented behavior; rationale included. Maintainer revalidates against current main. |
| Package check | Only say passed after the checker actually runs on those exact files. Name the rules/checker version. |
| Writing review | Explain how the draft distinguishes the cases and handles missing information. |
| Behavior | Identify the supplied example and actual checks performed; Copilot behavior remains unrun unless observed. |

These are the expected evidence fields, not a claim that this fictional package
has passed anything. For the checked-package route, the submitted issue contains
the complete draft files, source identity, real motivating context, change
summary, proposed version and actual results. A path that exists only on the
user's computer is not a complete package handoff to a remote maintainer.

### If something is incomplete

Suppose the draft refers to a missing reference file, or Node is unavailable and
the checker cannot run. The creator explains that exact gap. It can repair the
draft when the necessary information is present, or offer to submit an incomplete
proposal. The user chooses whether to continue drafting or submit that proposal.
The issue says what files/results are missing; it is not called a checked package.

If creation succeeded but labeling failed, the creator reports both outcomes.
If delivery is uncertain, it preserves the available evidence and uses read-only
reconciliation. Neither case starts the authoring workflow over or blindly
creates another issue.

## Questions for this round

### 1. How should people start the workflow?

**Recommendation:** `/gt:create-skills` is a command users deliberately invoke,
covering both creation and improvement. The internal `create-issue` dependency
remains model-invocable. This follows GT's current default for user workflows.

Alternative: also let the model select Create Skills from ordinary conversation
when the user asks to create or improve a GT skill.

**Your answer:**
People are definitely going to need to start this workflow with the Create Skills, and I do want them to deliberately call it. One of the things this Create Skill has to do is assess whether the user has provided it enough context to create an effective skill. If they haven't, it should be using things like the Grill me skill or should be invoking those kinds of skills to ask the user more questions to make sure it has a complete picture and understanding. Once The model has a complete picture of how the skill should work and what it should do. It should create the issue using the Create Issues skill with all the information of the proposed skill inside of it. When this issue is created, I, as a maintainer, at the end of the week or month, can review and decide if I want to add that skill into the library. One of the other options that we should allow people to do (and this should be a question that is asked after the issue is created with the full skill in it) is to ask the user if they want to create that skill at their user level. If they say they do, then it should take that skill and add it to their user level so that it works for them immediately. It's just not part of the marketplace plugin. I do want to add as a note that we will have a different skill for improving or changing or tweaking skills, so this create skill should not really be used to tweak a skill once it is created. 

### 2. Does this review rhythm fit?

**Recommendation:** gather related missing details in small question groups,
show a concrete proposal or draft, then iterate on the user's comments. When
they indicate it is ready and submission authority exists, submit without a
second generic approval prompt. If the initial request supplies complete final
content and explicitly asks to submit it, do not force an extra review round.

In particular, are Examples A and B collecting enough useful context and showing
the right amount of detail, or is anything important missing?

**Your answer:**
Example B is kind of incorrect because we don't want to be using the create skill in that way. As for example A, it is definitely not anywhere near enough information. I'm expecting this skill to either:
- outright create the entirety of the skill and add it to the issue
- have a very detailed understanding of exactly what the skill needs to be, the limits, the specifications, and the constraints, so that I can create the skill separately on my own
There can't be any questions left unanswered for me.

### 3. How should it choose between an idea and a complete draft?

**Recommendation:** follow the user's expressed intent. “Propose this idea” takes
the proposal route; “build me a skill draft” takes the package route. If intent
is unclear, ask once whether they want a proposal or a complete draft. Do not
make everyone choose at the beginning when their request already answers it.

Alternative: default to a complete draft unless the user explicitly requests
only a proposal.

**Your answer:**
I think this should always be working towards building the skill itself, not a draft or proposal, because ultimately this is going to submit an issue that I will then take and build the skill. That's what I need this to do: a very, very detailed issue that I will use to build the skill. If the user wants to build the skill on their own local version, it's fine if it does that as well, but that's their own thing. 

### 4. What should happen when the complete package cannot fit in an issue?

The existing submission helper accepts at most 60,000 UTF-8 bytes in an issue
body; a package may also contain binary resources that do not fit as readable
file contents.

**Recommendation for the first version:** include complete text files directly
when they fit. Otherwise keep the local draft, explain exactly what could not
be included, and let the user choose an incomplete proposal or keep working on
the draft. An existing user-provided accessible artifact link can be preserved,
but automatic artifact uploads, split issues and branch pushes are outside this
first version. Never silently truncate or claim that local-only files were sent.

Alternative: design a separate attachment/upload workflow before shipping the
creator, with the storage destination and access behavior explicitly agreed.

**Your answer:**
I'm not sure. Can you do some research on this? Is there any other way that we can make this happen? Maybe this is a scenario where we create sub-issues, or can we just add comments or discussion notes? I would be interested in alternative ideas, but because I want very detailed information, there might be a lot of characters in the body that I'm going to need. 

