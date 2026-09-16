# Skill distribution — Round 1

> Historical interview: the owner subsequently approved native GT updates and the separate `gt-archive` collection. [Current accepted behavior](skill-versioning-decisions.md) supersedes managed pins, selective main-bundle updates, and pending runtime questions below. Original answers remain unchanged; no new answers are requested in this round.

Issue: [Choose a distribution model for independently selected skill versions](https://github.com/AndrewGodlewsky/andrew-skills/issues/4).

**Status: answered and reviewed.** Your original answers are preserved below. Continue in [Round 2](skill-distribution-round-2.md), which explains the alternatives and revises the recommendation. The recommendations below are historical proposals, not accepted decisions. No Copilot setup or testing is requested.

I am using the [grilling](C:/Users/godle/.agents/skills/grilling/SKILL.md) and [domain-modeling](C:/Users/godle/.agents/skills/domain-modeling/SKILL.md) skills with your requested Markdown-round format. The supporting [architecture proposal](skill-distribution-proposal.md) compares options and traces a complete update/rollback example.

## Short version

I recommend keeping GitHub as the source and adding a small local helper that manages each skill's complete installed folder. Users would normally interact through the update skill; the helper would track versions and perform file changes. All active skills, including `skills-update`, would have independent releases and selections.

The main reason is selective updating: replacing a whole plugin can also change skills a user wanted to leave alone. Separately managed folders make the intended boundary explicit. The tradeoff is maintaining our own installer/update helper and changing the current marketplace-only setup.

Already settled: latest by default, optional retained versions, Git history as the archive, complete-resource restoration, no separate team defaults, and later live testing. These questions do not reopen those choices.

## 1. Should a local helper own installation and updates for every skill?

**Why this matters:** The component that replaces files must honor the user's choices. If the native plugin updater continues replacing the complete collection, our version records alone cannot protect a skipped or retained skill. Giving a helper ownership of every installed skill makes selective updates and retirement handling consistent, but creates software the team must maintain. It also means teammates need to run a setup command and permit the update skill to use terminal tools when updating.

**Recommendation:** Use helper-managed complete skill folders for all active skills. Keep the ordinary experience in chat. Use a one-time setup/migration command instead of installing each skill separately; do not require Copilot CLI solely to manage a VS Code user's files. Start with a local script/helper rather than a new extension or hosted service.

**Question:** Do you accept that installation model and its local-helper requirement, or is keeping installation and updates entirely inside the native plugin marketplace important enough to choose a different approach?

### Your answer
I'm not sure. What are my real options here? Ultimately, I need this to be a very, very simple process so that it is basically foolproof. When we are updating skills, that's going to end up being automatic using the skill update skill. When that runs and it runs the script to pull all the skills, we have to have some sort of deterministic way of solving this problem or something. I'm a little worried about having an agent do this because I feel like it'll spend a lot of credits and might not always get it right. Whatever this is, that has to be simple and pretty much foolproof, but I'm open to ideas. 
<!-- Write your answer here. If you prefer another approach, explain which installation experience must be preserved. -->

## 2. Is changing the existing plugin-qualified skill commands acceptable?

**Why this matters:** Today's documentation uses `/gt:grill-me` and `/gt:skills-update`. Skills installed outside a plugin may use different invocation names. Our CLI experiment also found that a personal override could hide a plugin skill and make its qualified name unavailable. Promising the same old command for every retained version would therefore add a compatibility problem to solve.

**Recommendation:** Permit a documented, one-time command change during migration. Preserve each skill's canonical name and exact release content. Bare names such as `/grill-me` and `/skills-update` illustrate the intended experience; exact client syntax remains subject to the deferred tests. Do not create duplicate aliases or silently rewrite historical skills merely to preserve the `gt:` prefix. Existing personal-name collisions must be resolved explicitly without overwriting user files.

**Question:** Can migration change those commands, or must existing `/gt:...` commands continue to invoke the selected version? If keeping that prefix is mandatory, the architecture must be adjusted before acceptance.

### Your answer
I don't think I really understand what you're asking here. Can you further explain this? I understand keeping the prefix because it's in that folder. Is that not technically true? Do we not need to have the prefix at all? I am going to be honest. I do like the idea of having some sort of prefix so the user knows that this skill is coming from our plugin and not on their local, but I'm open to ideas here. If you can present me with more of a thought process and walk me through the facts 
<!-- Write your answer here. -->

## 3. Can recovery use a terminal command independent of the update skill?

**Why this matters:** `skills-update` is itself a skill you want to version and potentially roll back. An older or broken version should not leave users unable to repair their installation. Recovery therefore needs an entry point that does not depend on loading that skill successfully. This also separates a skill's retained behavior from the helper's ability to understand local version records.

**Recommendation:** Provide a short documented repair/update command for the local helper, alongside the normal chat workflow. Keep `skills-update` independently versioned and eligible for retention. Give the helper its own software version and compatibility rules; an incompatible old skill should receive an explanation and repair path, not silently lose its pin. Helper upgrades remain explicit, with no background installer.

**Question:** Is a terminal-based fallback acceptable for your team when the chat update skill cannot work, or do you require recovery entirely through a client interface?

### Your answer
Again, I need this process to be super simple. The way I would think this would work (but I'm not sure) is that I'd be looking for your suggestions. We have some sort of deterministic script that will run to roll back and get the previous version of a skill, and maybe just have the agent change some of the variables in that script (or inputs for that script) so that when it runs, it pulls the right version of the right skill. I'm open to ideas here. It just has to be simple, and I don't want to massively inconvenience the majority of users who aren't going to use this feature. 
<!-- Write your answer here. -->

## 4. Which operating systems must the first managed installation support?

**Why this matters:** The existing installer is PowerShell-based, but a medium-to-large team may use different operating systems. That affects the helper runtime, setup steps, and maintenance burden. We should choose those after knowing the required platforms rather than accidentally turning a Windows implementation choice into a team restriction.

**Recommendation:** Keep the file/state design portable. Use Windows as the initial installer target only if that covers the initial team; include macOS or Linux from the outset if teammates need them. This does not change the already agreed Copilot CLI and VS Code client scope.

**Question:** Does the initial team need Windows only, Windows and macOS, or Windows/macOS/Linux? Note any restriction on installing a helper runtime, such as Node.js or PowerShell 7, if you know of one. “Unknown” is a valid answer; it will remain an explicit planning assumption.

### Your answer
So it has to be Windows and WSL compatible. I don't think I have any restrictions on Node.js. I'm not sure if everyone has PowerShell 7, so we have to try and keep this as flexible as possible, assuming different team members might be using different things. 
<!-- Write your answer here. -->

## What happens after this round

I will read your answers, revise the architecture recommendation, and ask only about remaining tradeoffs. Catalog/version-number rules, update wording, and detailed failure recovery already have their own issues. This issue remains open until we agree on the distribution architecture; answering these questions does not authorize implementation, commits, or publishing.

This review follows [Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md): “A HITL ticket only resolves through that live exchange.” Your Markdown answers supply that owner input; the recommendations above do not stand in for your decisions.
