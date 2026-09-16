# Skill distribution — Round 3

> Historical interview: the owner subsequently approved native GT updates and the separate `gt-archive` collection. [Current accepted behavior](skill-versioning-decisions.md) supersedes managed pins, selective main-bundle updates, and pending runtime questions below. Original answers remain unchanged; no new answers are requested in this round.

Issue: [Choose a distribution model for independently selected skill versions](https://github.com/AndrewGodlewsky/andrew-skills/issues/4).

**Status: latest follow-up reviewed; scope simplification under discussion.** Your answers are preserved. You are reconsidering managed rollback and proposing separate saved copies. Read [the simpler alternatives](skill-distribution-simplification.md). The sections below record the earlier discussion; this is no longer just a runtime-prerequisite question. No installation or testing is requested.

## What is now settled

- A fixed helper handles updates and restoration; the agent passes inputs rather than editing the script.
- The helper assembles a local `gt` plugin containing the selected version of each skill.
- Windows and each WSL environment have separate installations and selections.
- Setup problems can be brought to you; we should keep that support process simple.

Your report that the current plugin works in WSL is useful baseline experience. The future helper still has its own behavior to verify later, as already agreed.

Your dedicated restore-skill idea fits well. I recommend a skill that lists older versions and notes, explains the choice, and calls the same restoration helper. I am carrying that into the interaction issue. The direct command remains a fallback if the plugin itself cannot load. We do not need a second restoration implementation or another architecture question about this entry point.

## 1. Can Node be a prerequisite if setup problems simply come to you?

**Why I asked:** Today's installer asks Copilot to install the plugin. Our proposed helper adds a program that runs on the teammate's machine. If we write that program in JavaScript, Node runs it. We need Node for that implementation even when Copilot and the existing plugin already work.

GitHub offers several CLI installation methods and lists Node as a prerequisite for the npm method. Having Copilot installed therefore does not establish that the machine has a separately usable Node command. Windows and WSL also need that runtime in the environment where the helper runs. [GitHub's installation documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)

**Why this matters:** We can leave uncommon setup problems to you, as you suggested, while still documenting what the program needs to run. That is much smaller than building an automatic Node installer or shipping packaged executables. If you mean that no additional runtime can be required at all, we need a different implementation choice. Node is a candidate for sharing code across platforms, not an inherent requirement of versioning skills.

**Recommendation:** Use Node as a documented prerequisite. Add a small check before any installation changes. If it is missing or incompatible, stop with a short message such as “This updater needs a compatible Node.js installation. Contact Andrew for setup help.” Do not automatically install it, repair the environment, or build packaged executables for this first version. Choose the exact supported Node version during the implementation design.

**Question:** Is that acceptable, or did you mean the helper must work without any additional runtime prerequisite?

You can answer **“Node is fine; send setup problems to me”** or **“No additional runtime requirement”**, or explain your preference.

### Your answer
So I'm still a little confused. Would this be used to actually install the plugin? I don't understand why we can't use the Copilot CLI to install the plugin. What actual advantage will this provide to us? Explain to me why we need to run This at all. If this is just about the setup of the plugin, I didn't have any issues when I was trying to set this up.
<!-- Write your answer here. -->

## Explanation after reading your answer

**Yes, Copilot CLI can still install/register the plugin.** Your existing installation worked. The proposed script adds the per-skill version management that this enhancement requires. I made its purpose harder to understand by focusing on setup prerequisites before explaining its everyday role.

Today, our update skill runs `copilot plugin update gt`, which updates the bundled plugin. The new behavior you want is more specific: “Update this skill, leave that skill alone, and remember which older release I chose.” The documented plugin update command operates on a plugin; it does not take an independent release selection for each skill inside our bundle. CLI also supports local plugin sources, so it can remain responsible for registering/loading the collection our code prepares. [Copilot CLI plugin commands](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)

### What happens when someone dislikes an update

Suppose the installed collection contains `grill-me` 1.5 and `skills-update` 1.2. The teammate wants only `grill-me` restored to 1.4. These are illustrative versions.

1. The restore skill receives that request and passes the skill name and version to our fixed version-management script.
2. The script looks up 1.4 in the catalog, downloads its historical Git snapshot, and restores only the complete `grill-me` folder.
3. It records that 1.4 is retained and leaves `skills-update` 1.2 unchanged.
4. Copilot loads that chosen combination from the local `gt` plugin in a fresh session, subject to our deferred client checks.
5. During a later update, the script reads the retained choice, offers a newer version, and leaves 1.4 in place if the user declines.

That script runs for normal updates, restoration, and version reporting throughout the installation's life. It is the deterministic code you originally requested so an agent does not have to invent file operations each time.

### Where installation fits

| Responsibility | Proposed component |
| --- | --- |
| Prepare the initial collection of selected skill files and records | Our version-management script, initially selecting latest for all active skills. |
| Register that local plugin with Copilot CLI and load its skills | Copilot CLI's supported plugin mechanism. VS Code uses its own registration path. |
| Change selected skill versions later and preserve retained choices | Our version-management script, normally called by the update or restore skill. |

So **the script does participate in initial setup**, because it prepares the managed collection. It is not a replacement for Copilot's plugin loader, and its main benefit is the ongoing per-skill behavior. The old remote-marketplace installation alone would not create this new managed state. A one-time setup/migration flow must connect the pieces; we have not established that today's exact install commands can remain unchanged. That user flow belongs in the existing migration issue.

### Why Node entered the discussion

Node is simply my proposed way to run that script using one implementation across Windows and WSL. It provides no special plugin-installation capability. We need deterministic version-management code for the selected design; choosing JavaScript/Node for that code is a separate implementation decision. The script could be written another way, with different maintenance and prerequisite tradeoffs.

My recommendation remains: let Copilot handle registration/loading, let a small shared Node script handle individual versions, and send uncommon prerequisite problems to you. The normal user experience remains the update or restore skill. The existing independent recovery command remains available if those skills cannot load.

### Your follow-up
Honestly, I think I'm starting to sour on this whole allowing users to restore a previous version idea. I still definitely want to have each of the skills have versions so we know what version we're updating to and stuff, but I really hate the idea, or I'm starting to worry about the idea, of trying to maintain an old version and a new version.

Maybe a simpler way to go about this would be to just have a separate folder, as in we have the GT directory and maybe we have a GT pinned directory or something else. When the user uses the /restore skill, it just adds that version of that skill into that new directory. This way, it can be completely separate so that it doesn't have to mess with the updating process for the main directory.

I don't know. Any thoughts on alternate ideas around this? 
<!-- After reading the explanation, say whether the script's role now makes sense and whether the proposed Node runtime is acceptable, or describe what remains unclear. No setup or testing is needed. -->

## After this clarification

If this resolves the prerequisite choice, I can finalize the architecture issue and its downstream handoff. If you require no additional runtime, I will compare the smallest practical implementation alternatives while keeping the accepted local-plugin design. The [updated architecture record](skill-distribution-proposal.md) already distinguishes your accepted decisions from this remaining question.

This remaining clarification follows [Grilling](C:/Users/godle/.agents/skills/grilling/SKILL.md): “The decisions, though, are mine — put each one to me and wait for my answer.” Your Round 2 answer questioned the prerequisite, so I am explaining its purpose rather than assuming you accepted it. [Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md) likewise requires: “A HITL ticket only resolves through that live exchange.”
