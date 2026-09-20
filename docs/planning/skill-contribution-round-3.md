# Skill contribution process — Round 3: improve a skill or add one?

Issue: [Define the process for proposing and accepting new skills](https://github.com/AndrewGodlewsky/andrew-skills/issues/20).

**Status: owner direction recorded September 20, 2026; contribution planning complete.** Users may submit freely, while maintainers decide skill boundaries, type and invocation within the accepted architecture. The owner does not want classification logic or an elaborate contribution process. The proposed rule below is preserved as discussion history, not adopted policy. See the [accepted contribution contract](skill-contribution-contract.md).

## What is settled

Users can submit ideas, completed drafts, change requests and confusing behavior through issues. Maintainers turn suitable submissions into repository changes on branches. You will handle GitHub rules and approval permissions; those questions are outside this discussion. See the [working decisions](skill-contribution-notes.md).

The next decision is about keeping the hub useful as it grows: avoiding several almost identical skills without making one skill responsible for too many different tasks.

## 1. When should a submission become a separate skill?

**Recommendation:** Improve an existing skill when the submission serves the same user task and expected result. Add a separate skill when it serves a distinct task or produces a substantially different result that users would want to invoke independently.

Compare the purpose, typical request and expected result, rather than just the name or topic. Two skills can discuss the same subject but do different jobs. Conversely, two differently named skills may duplicate the same job.

Keep this assessment with the maintainer preparing the contribution. Users can submit a rough idea or a completed variation without researching every existing skill first. Record the reuse/new-skill reasoning briefly in the contribution record; its final location will be addressed with the evidence checklist.

### Examples

| Submission | Proposed treatment | Reason |
| --- | --- | --- |
| “The interview skill asks confusing questions. Here is a clearer wording.” | Improve `grill-me`. | Same task and result; the existing skill needs clearer instructions. |
| “My version of `grill-me` produces the same interview but uses slightly different phrasing.” | Compare the useful changes and incorporate them where appropriate. Do not add a duplicate automatically. | A variation is useful input without necessarily needing its own command. |
| “Explain a supplied design and its tradeoffs in one response.” | Consider a separate `explain-design` skill. | Producing an explanation is a different task from interviewing someone to resolve a design. |
| “Also make the interview skill implement the design, deploy it and send an announcement.” | Keep those tasks separate from the focused interview skill. | The request adds distinct outcomes and actions beyond the skill's purpose. |

An improvement still follows the agreed versioning contract. Calling a change an improvement does not make it backward compatible; incompatible changes to documented usage need the appropriate version increment. Duplicate or unsuitable requests can receive an explanation without forcing a new skill into the collection.

**Tradeoff:** This keeps discovery clearer and maintenance smaller. It may mean a user's complete variant contributes only selected improvements. A separate variant can still make sense when its purpose or result is clearly different; superficial wording differences alone would not justify it.

**Question:** Does this rule fit your hub: improve an existing skill for the same task/result, and add a new one for a distinct task/result, with the maintainer doing that comparison?

### Your answer
Ultimately, this shouldn't be that complicated. We can let the users of the plugin submit whatever they want. If they think it should be the same skill, they can do that. If they think it should be a new skill, they can do that. It's on the reviewers and maintainers of the repository to actually choose what the skill type is, how it can be invoked, and all these additional pieces of information.

We don't have to build all of this logic into anything, because I will know it and will be able to appropriately affect it. As long as we have the architecture of what a skill can be (which I believe was already completed, but maybe there's more on that, and I'm not sure), then this whole thing is easy to maintain. We don't have to go too overboard with the contribution piece. Ultimately, the way I envision this is that it's just going to be a skill. I will create a skill, maybe one that's called "Creating Skills" or something like that, that will help walk the user through how to write a good skill and what that is. We'll submit the GitHub issue explaining that, or submit the GitHub issue for the new pending skill.

If a user doesn't understand what a skill did, we will have an issue submitted just so that I can review it, in case, as models change and things happen over time, maybe the skills are no longer quite as relevant. If a user wants to modify a skill, they can submit an issue for that. We can have a skill submit an issue for that so that I can look through it, and we'll figure it out and get it done. 
<!-- Write your answer here, or answer in chat. -->
