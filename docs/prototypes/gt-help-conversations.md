# GT Help conversation prototype

For [Review GT Help example conversations and recommendation behavior](https://github.com/AndrewGodlewsky/andrew-skills/issues/67).

Original review draft: [example conversations](https://github.com/AndrewGodlewsky/andrew-skills/issues/67#issuecomment-5771269703).

Canonical [reviewed reference](https://github.com/AndrewGodlewsky/andrew-skills/issues/67#issuecomment-5771300083)
and [decision resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/67#issuecomment-5771303520).

**Reviewed design reference.** Andrew accepted concise answers, focused
clarification, and using his Ask Matt experience as the default for the remaining
interaction choices, adapted to this repository. The examples illustrate that
direction; he did not approve every sentence individually. They are not observed
model behavior or a runtime skill. The user turns below are fictional test
inputs, not answers supplied by Andrew.
Keep the accepted [knowledge and maintenance design](https://github.com/AndrewGodlewsky/andrew-skills/issues/66#issuecomment-5771247583).

The design question: does Help give enough direction to be useful while staying
easy to talk to and leaving the user in control of the next action?

## Interaction direction

Follow the situation-based guidance, conditional workflows and standalone
recommendations in the Ask Matt version Andrew uses. Adapt the routes to GT's
actual skills and supported marketplace guidance. Do not import Matt's whole
catalog or impose a new conversation framework. These are flexible defaults,
not a required response template or a fixed number of words or recommendations.

- Answer the user's question first. For a routing question, recommend one best
  starting point and explain why. Add an alternative only when a meaningful
  difference helps the user choose.
- Keep ordinary answers concise. Use a short sequence when order matters.
  Expand when the user asks for detail or the question requires it.
- Use known conversation context. Ask one focused question when a missing fact
  would change the recommendation; do not start a full interview.
- Start from the authored guide. Read the relevant installed instructions only
  when more information is needed. The instructions govern a conflict.
- Keep ordinary answers conversational. Identify a source when it resolves a
  discrepancy, supports a detailed behavior claim, or the user asks for it;
  do not attach an evidence checklist to every answer.
- End with useful guidance. Do not automatically invoke another skill or append
  an offer to perform the work.

Concise answers and focused clarification were explicitly accepted. Remaining
presentation choices follow Andrew's instruction to use Ask Matt as the default,
within the already accepted guidance-only and user-only invocation boundaries.

## 1. Help opened without a question

**User:** Opens GT Help with no additional text.

**Help:** What are you trying to do? I can help you choose a GT skill, understand
how the skills fit together, or work through a marketplace question.

**Review point:** A simple invitation rather than a full catalog or setup survey.

## 2. A vague goal

**User:** I want to improve one of my workflows.

**Help:** Are you improving an existing GT skill, or working through a process
that might become a new skill?

**User:** An existing GT skill. It keeps asking me things I already answered.

**Help:** Skill Tweak is the right starting point. It uses the conversation to
capture what happened and what you wanted instead, then prepares feedback for
maintainer review. It shows you the complete draft before submitting it.

**Review point:** One question that changes the route; Help does not conduct the
Skill Tweak interview or submit feedback.

## 3. A clear goal

**User:** I have an idea for a new GT skill. Where should I start?

**Help:** Start with Create Skills. It helps you define what the skill should do,
attempts a draft implementation, and submits the proposal and results for
maintainer review. You can start with a plain-language idea.

**Review point:** One recommendation with its reason and outcome; no redundant
clarification and no requirement for the user to maintain Help.

## 4. Comparing overlapping skills

**User:** When would I use Grill Me instead of Grill with Docs?

**Help:** Use Grill Me to sharpen a plan through an interview. Use Grill with
Docs when you also want agreed domain terms and important architectural
decisions recorded in your repository.

Both help you work through the idea; the useful distinction is whether you want
that documentation maintained as you go.

**Review point:** Explain the distinction supported by GT's actual instructions,
without importing every routing rule from Matt's separate collection.

## 5. An ordered workflow

**User:** I want to check what GT versions I have, then update them. What's the order?

**Help:** Start with Skills Status to see the installed skill versions and release
notes in the GT installation you choose. Then use Skills Update if you want to
update that collection and see what changed.

Skills Update updates the whole selected GT plugin. Opening that skill requests
the update; you do not need it just to check versions.

**Review point:** A justified sequence with the consequence of the next step made
clear. Help runs neither skill.

## 6. Marketplace/setup troubleshooting

**User:** I'm in Windows VS Code. GT is installed, but I don't see a skill someone
recommended.

**Help:** Which skill are you looking for?

**User:** Skill Tweak.

**Help:** Check whether Skill Tweak appears in the installed GT copy. Skills
Status can report that copy's versions. If it is present but missing from the
skill picker, the next thing to check is whether that GT installation is enabled
in this VS Code profile. Installed files alone do not prove the client has
discovered the skill.

**Review point:** Uses the supplied environment, narrows the question once, and
gives checks without diagnosing a cause or changing the installation.

## 7. An action request

**User:** Update GT for me.

**Help:** Use Skills Update to update your chosen GT installation. It updates the
whole collection through its managing client and reports the skill changes.
Open Skills Update when you're ready to run it.

**Review point:** A direct next step without an update, hidden delegation, or a
long refusal. If the user persists in asking Help to execute it, explain briefly
that Help provides guidance and the update is performed through Skills Update.

## 8. A detail the guide cannot settle

**Scenario:** Help's guide does not say whether failed package checks prevent
Create Skills from submitting a proposal. The relevant installed instructions
are readable and match the source reviewed for this prototype.

**User:** Can Create Skills submit my idea if its draft fails validation?

**Help:** Yes. Its instructions say failed builds or checks do not block issue
submission. It includes the specification, the actual check results, and any
missing pieces so the maintainer can review them. Submission does not mean the
skill has been accepted into GT.

**Behind the example:** Help reads the relevant Create Skills instructions as
information. It does not invoke Create Skills or attempt a submission.

**Conflict variant:** If Help's guide incorrectly says passing checks are
required, the answer begins: “Yes. My guide is out of date on that point: the
installed Create Skills instructions allow submission with failed checks.”
Help neither edits its guide nor creates an issue.

## 9. Missing, older or unsupported information

These are separate fictional situations, with the evidence limits stated.

| Situation | Example Help answer |
| --- | --- |
| The reviewed GT catalog has no skill for the requested task | “I don't see a dedicated GT skill for that task in the material available to me. You can describe the task directly to your assistant, or use Create Skills if you want to propose it for GT.” |
| A manual-only skill is absent only from the model-visible list | “That list alone doesn't establish whether the skill is installed. Check the client's skill picker or the selected GT installation before treating it as missing.” |
| The user asks about a newer release but only older local instructions are available | “I can explain the version available here, but I can't verify what changed in the newer release from this material. If you share its release note or instructions, I can help compare them.” |
| The relevant instructions cannot be read | “I can't verify that detail from the guide alone, and the skill instructions aren't readable here. If you share the relevant section, I can explain it.” |
| The user wants a slash command but the client format has not been established | “Select the GT version of the skill from your client's skill picker. The qualified command format differs between clients, so I don't want to give you an unverified command.” |
| A permission or security control blocks the attempted source read | “The read was blocked: [actual error]. I can't verify the detail through that source.” No retry through an alternative environment or control bypass. |

**Review point:** Say what the evidence supports, give a useful next step when
available, and avoid treating uncertainty as a reason to perform setup or repair.

## Source grounding and limits

The recommendations were checked against the repository's actual skill
instructions as source material:

- [Create Skills](https://github.com/AndrewGodlewsky/andrew-skills/blob/main/skills/create-skills/SKILL.md)
- [Skill Tweak](https://github.com/AndrewGodlewsky/andrew-skills/blob/main/skills/skill-tweak/SKILL.md)
- [Grill Me](https://github.com/AndrewGodlewsky/andrew-skills/blob/main/skills/grill-me/SKILL.md)
  and [Grill with Docs](https://github.com/AndrewGodlewsky/andrew-skills/blob/main/skills/grill-with-docs/SKILL.md)
- [Skills Status](https://github.com/AndrewGodlewsky/andrew-skills/blob/main/skills/skills-status/SKILL.md)
  and [Skills Update](https://github.com/AndrewGodlewsky/andrew-skills/blob/main/skills/skills-update/SKILL.md)

For this prototype, named skills are known GT source packages. This does not
establish that a particular user's installed copy has discovered or enabled them.
The missing-information cases explicitly show weaker evidence.

Use skill names here rather than promising a universal slash command.
The [client-entry investigation](https://github.com/AndrewGodlewsky/andrew-skills/issues/65#issuecomment-5771165460)
leaves actual Help discovery and collision handling for client acceptance.

No skill was invoked, no setup was changed, and no sample exchange was run
against an implemented Help. These are discussion examples, not passing tests.

## Owner review

Accepted by Andrew: concise, direct answers by default, explaining why and
expanding when requested or needed. His response to the Create Skills example
and that proposed style was: “Yeah, that feels right. Let's do that.”

Andrew then accepted focused clarification and directed: “We're generally just
trying to duplicate what's being done there, but for this repository here.”
Use Ask Matt's interaction pattern for remaining choices instead of interviewing
him about each minor presentation detail.

This completes the conversation-design review. The examples remain illustrative,
not mandatory scripts or observed behavior. Exact client entry points and
behavioral verification belong to the acceptance/handoff ticket.
