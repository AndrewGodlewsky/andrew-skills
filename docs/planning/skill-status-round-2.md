# Skill version status — Round 2: keep it simple

Issue: [Prototype skill version status and concise release notes](https://github.com/AndrewGodlewsky/andrew-skills/issues/8).

**Status: answered and accepted.** You approved the installed-only, three-column report with no latest-release comparison. Your original answer and the [Round 1 answers](skill-status-round-1.md) are preserved. The [status handoff](skill-status-prototype-notes.md) records the final design. Examples below are mockups, not real installation results.

## What your feedback settles

- Add the read-only source skill `skills-status`.
- Report only skills installed as part of the GT collection in the selected environment.
- Do not scan, list, count or inspect personal copies. There is no personal section, receipt inspection mode or “no personal copies found” message.
- Keep the feature simple. Showing what an update would make available is optional, not a requirement.

## One remaining question: does this minimal report fit?

**Recommendation:** In the first version, read the installed GT skill metadata and show three columns: skill, installed version and short release note. Omit the latest-release column and remote catalog lookup entirely. This is useful on its own and does not require comparison logic, freshness labels or online access.

### Ordinary report

> **GT skills — Windows, CLI-managed installation**
>
> | Skill | Installed version | Release note |
> | --- | --- | --- |
> | `grill-me` | 1.2.0 | Added an optional summary at the end. |
> | `skills-update` | 1.0.1 | Clarified update-failure messages. |
> | `skills-restore` | 1.0.0 | Added personal export of historical skills. |
> | `skills-status` | 1.0.0 | Added the installed GT skill overview. |
>
> These are installed files; an existing chat may have loaded earlier instructions. Nothing was changed.

The note belongs to the installed release. It is not a description of everything since the user's previous update or an announcement of a newer version. Show all observed installed GT skills, including unchanged ones. The plugin version can remain installation detail, not another skill row.

### Older installation without per-skill metadata

> | Skill | Installed version | Release note |
> | --- | --- | --- |
> | `grill-me` | Unknown | Release note unavailable. |

Do not invent `1.0.0`, use the container version, or fetch GitHub's current version and call it installed. Missing fields do not prevent showing the fields that are readable.

### If GT cannot be located

> I couldn't locate the GT installation for this environment. Nothing was changed.

Distinguish “could not locate” from verified absence. If there are multiple plausible installations, establish which one to inspect. A readable, verified GT installation with no skills gets “No skills found in this GT installation”; incomplete evidence gets an explicit limitation instead. Permission/authentication/security errors stop and hand control back, as usual.

### What happens after removals or returns?

The report lists what is currently installed. A removed skill disappears only once the native update actually removes it locally. A returning skill displays its installed version, even if that is `1.0.0` again. There is no “latest,” “outdated,” “retired” or update-availability claim to calculate here.

**Why this matters:** Your main need is for teammates to see what GT skills they have and the short notes attached to those releases. Local metadata answers that without building another update checker or personal-copy manager. `skills-update` already handles updating and explains actual changes afterward; `skills-restore` separately handles historical selection.

**Question:** Shall we use this installed-only, three-column report for the first version of `skills-status`, with no latest-release comparison? If you would rather omit the status skill entirely, or change the report, note that here.

### Your answer
Okay, I think this is fine. 

<!-- Write your answer here. -->

## What follows

Your answer resolves the status interface decision. The consolidated handoff carries the acceptance cases into migration planning. Implementation and deferred CLI/VS Code checks remain later work.

[Wayfinder](C:/Users/godle/.agents/skills/wayfinder/SKILL.md) requires that “A HITL ticket only resolves through that live exchange.” Both rounds now contain your answers, and the simplified final report is accepted.
