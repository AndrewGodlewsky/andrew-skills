# Skill distribution — Round 2

> Historical interview: the owner subsequently approved native GT updates and the separate `gt-archive` collection. [Current accepted behavior](skill-versioning-decisions.md) supersedes managed pins, selective main-bundle updates, and pending runtime questions below. Original answers remain unchanged; no new answers are requested in this round.

Issue: [Choose a distribution model for independently selected skill versions](https://github.com/AndrewGodlewsky/andrew-skills/issues/4).

**Status: answered and reviewed.** Your original answers are preserved below. The local `gt` plugin, fixed-helper workflow, and separate Windows/WSL installations are accepted. [Round 3](skill-distribution-round-3.md) explains one remaining prerequisite question. No setup or testing is requested.

## What I took from your answers

You want a simple update experience backed by predictable code, with little agent reasoning or credit usage. You prefer a recognizable team prefix. Windows and WSL must work, and we cannot assume everyone has PowerShell 7. Node.js is not known to be restricted, but we have not established that it is already installed everywhere.

I agree with your idea of passing inputs into a script. The key distinction is that the agent should **call a fixed script with arguments**, rather than edit that script each time. I also missed a useful packaging option in the first round: the script can assemble a local plugin, preserving plugin grouping while selecting each skill independently.

The [revised proposal](skill-distribution-proposal.md) contains the technical detail. These four questions cover the remaining user-facing tradeoffs. Earlier decisions about rollback, pins, latest defaults, and historical Git snapshots stay settled.

## 1. Does this fixed-script workflow match the simplicity you want?

**How it would work:** Normally, a teammate invokes the update skill. A maintained helper script reads the catalog and installed versions, then returns a short list of changes and notes. The agent presents the relevant choices and passes the user's selection back. The script downloads, verifies, installs, and records the result. It does not ask a model to work out file operations.

For rollback, “restore `grill-me` 1.4.0” becomes inputs such as `operation=restore`, `skill=grill-me`, and `version=1.4.0`. The script resolves the commit and folder itself, restores the whole skill, and retains that version automatically. These are illustrative inputs, not commands that exist yet. The agent never edits the script's source or asks the user to find a commit ID.

If the update skill itself breaks, a teammate can use a short copyable terminal command to call that same helper directly. Most users never need this fallback. It should also list available versions so recovery does not depend on a working chat skill.

**Why this matters:** This puts repeatable work in tested code and keeps the chat interaction small. It also provides recovery when the chat entry point cannot run. It cannot remove client permissions or guarantee zero failures, but it can preserve the previous installation and report a clear result when something fails.

**Recommendation:** Use this workflow, including the direct-command fallback. “Automatic” means the script executes the requested update after the user's choices; it does not mean background installs or silently changing pins. Exact prompts belong to the existing interaction issue.

**Question:** Does this meet your intended experience, or would needing a copyable terminal command in the rare recovery case be unacceptable?

### Your answer
Okay, I think this works. Alternatively, maybe the restore could actually be its own skill so that we can have that skill give special context and instructions about how to actually do the restoration and stuff.
<!-- Write your answer here. -->

## 2. Should the script maintain a local `gt` plugin to preserve the prefix?

**Where the prefix comes from:** Our repository folder is called `andrew-skills`, but `plugin.json` says `"name": "gt"`. It is that plugin identity, combined with the skill name `grill-me`, that gives `/gt:grill-me` in VS Code. Merely placing a loose skill under a directory named `gt` does not create that identity. [VS Code naming documentation](https://code.visualstudio.com/docs/agent-customization/agent-skills#skillmd-file-format)

**The option I missed:** Keep a plugin named `gt`, but have our script assemble its local contents from the user's chosen versions. For example, that one plugin can contain old `grill-me` 1.4.0 and new `skills-update` 1.2.0. The script replaces only selected skill folders. GitHub remains the source of historical releases; the user's local plugin is their chosen combination.

| Option | What teammates experience | What we take on |
| --- | --- | --- |
| **Script-managed local plugin** | One setup per environment, team command grouping, selective updates through chat | Maintain the script and plugin registration; verify client behavior later. |
| Script-managed loose personal skills | Similar updates, but skills are exposed as personal skills without the true plugin prefix | Simpler packaging, plus a command migration and personal-name collision handling. |
| Keep today's native remote bundle | Familiar installation/update controls | More machinery to prevent whole-bundle updates from changing skipped or retained skills; prior override tests had command-name failures. |

VS Code documents local plugin registration, and our earlier CLI experiment loaded a local plugin directory. Those support the local-plugin option. They do **not** establish that the full Windows/WSL experience already passes; those checks remain deferred as you requested. [Local plugin documentation](https://code.visualstudio.com/docs/agent-customization/agent-plugins#use-local-plugins), [existing evidence](../research/skill-version-compatibility-results.md)

**Why this matters:** A plugin can provide the team identity you like without forcing every contained skill to use the same release. The cost is that setup must register our managed local plugin and retire the conflicting remote registration; the native remote updater must not overwrite the script's selections.

**Recommendation:** Choose the locally assembled `gt` plugin, with familiar `/gt:...` commands as the intended contract, subject to later client verification. Preserved retired skills become personal copies outside that plugin and may lose the prefix; active pinned skills stay inside it.

**Question:** Is this your preferred direction, or do you prefer another option in the table?

### Your answer
Okay, I really like this variation and idea. Let's do this. 
<!-- Write your answer here. -->

## 3. Is separate setup for Windows and WSL acceptable?

**Concrete example:** A teammate using both Windows Copilot CLI and a WSL CLI would set up the helper in each environment. Restoring a skill in WSL would retain it for projects using that WSL installation; it would not also change the Windows installation. Someone using only one environment performs setup once.

VS Code can have a Windows interface while extensions run locally or in WSL. Setup must identify the actual plugin target, and update/status should show it clearly, rather than guessing from the terminal's working directory. [VS Code WSL documentation](https://code.visualstudio.com/docs/remote/wsl)

**Why this matters:** Separate files and records give each environment a clear owner and avoid competing processes modifying one installation. The inconvenience is that someone who uses both environments manages two installations. This extends our existing “choices belong to an installation” rule to WSL; it does not introduce project-specific policies.

**Recommendation:** Use separate installations for Windows and each WSL distribution the teammate uses. Label the target in setup and results. Keep automatic synchronization outside this first version, consistent with the previously agreed scope.

**Question:** Is that acceptable for your team, or does supporting Windows and WSL need to include one shared version selection across both? If shared selection is essential, we should explicitly revisit that scope before choosing the storage design.

### Your answer
So this is fine, and for what it's worth, I have installed the current plugin through WSL, and it worked totally fine with no issues as long as I had GitHub Copilot CLI. I don't think we'll have any problems here. 
<!-- Write your answer here. -->

## 4. Is a one-time Node.js prerequisite acceptable?

**Real options:** We can write one helper in JavaScript and run it using Node.js in Windows or WSL. Setup checks the runtime and provides a clear installation instruction if it is missing. Small launchers make ordinary use convenient: PowerShell 5.1-compatible on Windows and a shell command in WSL. Users do not need to learn JavaScript or edit scripts.

Alternatively, we can distribute packaged executables so users do not separately install Node. That shifts work onto us: building, distributing, updating, and testing packages for the supported platforms. It simplifies that prerequisite for teammates but increases the system we maintain. Exact versions and packaging tools are later implementation choices.

**Why this matters:** “No restriction on Node” and “every teammate already has Node” are different. Deciding the acceptable setup burden now prevents the implementation from quietly assuming a runtime the team lacks. Neither option should require PowerShell 7.

**Recommendation:** Start with the shared Node helper and a clear prerequisite check. Keep routine updates to the same chat workflow. Choose packaged executables if avoiding a separate runtime install is a firm requirement.

**Question:** Can setup require a compatible Node.js installation in each environment being used, or should we plan for packaged executables with no separate Node installation?

### Your answer
I don't think we should need to have to do any of this. If they have problems setting up this plugin in the first place, they can come talk to me about that. I'm not super worried about this, as this feels like an edge case here that isn't worth solving. If you have a reason why we need to do this, let me know. Maybe I don't understand all the context. 
<!-- Write your answer here. -->

## After your answers

I will consolidate the selected architecture and carry its consequences into the existing publishing, retention, interaction, status, and migration issues. If a material conflict remains, I will explain that specific tradeoff. No additional questions are needed merely to reapprove already settled behavior.

This review follows [Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md): “A HITL ticket only resolves through that live exchange.” Your written answers provide that owner input. The architecture issue stays open during this review; no implementation or publishing is implied.
