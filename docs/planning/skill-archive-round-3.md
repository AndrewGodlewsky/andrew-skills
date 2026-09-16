# Personal skill export — Round 3

Issue: [Define historical skill export and GT archive lifecycle](https://github.com/AndrewGodlewsky/andrew-skills/issues/6).

**Status: answered and reviewed.** Original answers are preserved. Version suffixes apply only to personal exports; plugin skills retain their normal names. Node and Git are accepted for historical export only. The [export contract](skill-personal-export-contract.md) completes the technical handoff. No further questionnaire or setup is required for these decisions.

## What your answers settle

Restoration ends when the personal copy has been created. The user owns it and can change it freely. There is no archive management, synchronization, edit monitoring, backup system or importing changes into the team repository.

Your suggestion to put the version in the personal skill's name is a good fit: it makes its origin recognizable while aiming to leave the main skill independently available. A separate archive plugin is no longer needed for that naming approach.

## 1. Does this version-suffix convention match your idea?

**Recommendation:** Use the original skill name followed by `-v` and the source version with hyphens instead of dots.

| Source skill/release | Personal folder and skill name |
| --- | --- |
| `grill-me` `1.2.0` | `grill-me-v1-2-0` |
| `skills-update` `1.0.1` | `skills-update-v1-0-1` |

The intended personal command is, for example, `/grill-me-v1-2-0`. It has no archive-plugin prefix. Exact client discovery/invocation remains a later check.

**Why this matters:** VS Code documents lowercase letters, digits and hyphens for skill names, a 64-character limit, and matching folder/frontmatter names. Thus `grill-me-1.2.0` cannot simply become the skill's name. Both the folder and the `name:` field must change. If the full generated name exceeds the limit, stop with a clear naming error rather than silently truncate it. [Skill naming rules](https://code.visualstudio.com/docs/agent-customization/agent-skills#skillmd-file-format)

The copy keeps the original version and short note, plus a small record of the exact source and the deliberate rename. `1.2.0` describes where the copy started; it does not track the user's later edits. The exporter verifies original source bytes before the name adaptation and records that adaptation, rather than claiming the renamed copy exactly equals the source.

This preserves your earlier **one personal copy per source skill** choice. If a recognizable prior copy exists, restoration stops and the user handles it before trying another version. No automatic replacement or deletion. If a removed source returns with a reused version, the catalog still identifies the exact snapshot and an occupied personal destination still blocks creation.

Renaming the entry point is not a guarantee that arbitrary old scripts or instructions are portable. The exporter must report unsupported dependencies/self-references rather than silently rewrite behavior. We will define those checks as technical work.

**Question:** Is `<skill>-v<major>-<minor>-<patch>` the naming convention you want, or would you prefer a different suffix spelling?

### Your answer
I think this is fine, but for the skills inside the plugin, I do not want to have the versions after them. I just want it to be the skills themselves. 
<!-- Write your answer here. -->

## 2. Is an export-only Node and Git prerequisite acceptable?

**Recommendation:** Ship one maintained exporter with the restore skill, using Node.js and Git in the environment where the user requests the copy. Node runs the fixed verification/naming/copying code; Git reads the published history and exact source files. Neither is a new requirement for ordinary GT installation or updates.

I know the earlier runtime discussion became frustrating because it sounded like we were replacing plugin installation. That is no longer the design. This code runs only when someone asks to export a historical copy, or invokes its direct recovery command. It does not run a manager or maintain their personal skill afterward.

**Why this matters:** The copy must come from the selected historical source, include every resource, receive the correct personal name, and stop safely if a destination exists. One shared implementation avoids maintaining separate versions of those rules for Windows and WSL. The tradeoff is that someone without a usable Node/Git installation in that environment would need help before exporting.

Having Copilot installed does not prove Node is independently available: GitHub documents several installation methods, with Node required for the npm method. We would check prerequisites before creating personal files, give a short message directing setup problems to you, and never install tools automatically. No PowerShell 7 requirement is introduced by this proposal. The precise supported runtime versions belong in the implementation contract. [Copilot installation methods](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)

The alternative is a fixed exporter implemented separately for the Windows and WSL environments using their shell/system tools, with its own explicit prerequisites and duplicated behavior to maintain. That avoids requiring Node specifically; it does not eliminate retrieval and verification code. A packaged executable is another option but would add a build/distribution task you have not requested.

I also checked GitHub CLI's native skill installer. It can select a Git source revision, but it adds update-tracking metadata and does not document our version-suffixed naming, one-copy rule or exact export receipt. I would not assume that one install command already fulfills this contract. [GitHub CLI skill installer](https://cli.github.com/manual/gh_skill_install)

**Question:** Can people who use historical export be required to have Node and Git, with missing-tool setup referred to you, or should avoiding a Node prerequisite take priority over a shared implementation?

### Your answer
Okay, I like your recommendation. Let's go with that. 
<!-- Write your answer here. -->

## What follows

Your answers will settle the visible name and remaining setup tradeoff. I will then finish the source/installed record design, create-only filesystem sequence, conflict handling and recovery contract, and carry the results into the interaction, status and migration issues. The actual restore skill remains deferred.

This records the owner exchange required by [Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md): “A HITL ticket only resolves through that live exchange.” Naming and export-only runtime are now accepted; implementation and installation remain future work.
