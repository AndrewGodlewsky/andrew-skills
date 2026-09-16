> Superseded historical design. See [the current GT archive contract](../skill-versioning-decisions.md). The contents below preserve the earlier decision/proposal and do not direct new work.

# Skill versioning: agreed behavior and handoff

Resolution of [Define latest-by-default updates and personal skill pins](https://github.com/AndrewGodlewsky/andrew-skills/issues/3).

Status: Accepted through Andrew's three written rounds and subsequent conversation, culminating in his approval to consolidate the decisions and close this issue. The [resolution comment](https://github.com/AndrewGodlewsky/andrew-skills/issues/3#issuecomment-5673651654) is the canonical tracker record; this file is its local working copy. The behavior issue is closed.

## Purpose and scope

The team should be able to improve its shared collection frequently while users can recover from a disruptive change to one skill. Latest is the normal path. Retaining an older version is an explicit personal choice, and no skill is pinned by default.

One team maintains the collection through the repository's main branch. Individual choices apply across projects in the user's installation. Separate team recommendation profiles, per-project version policies, team-switching workflows, and automatic cross-device synchronization are outside the initial scope.

## Agreed contract

### Updates and pins

- Fresh installations include all active skills. Normal collection updates include new active skills; a user can request a limited selection instead.
- The update flow shows installed and latest versions, concise notes, and skills deliberately held back. Ordinary eligible skills move toward latest.
- Every update run offers newer releases for pinned active skills. Make the offer convenient and grouped rather than requiring a separate conversation for every skill. Users can choose some, all, or none.
- Declining an offer for a pinned skill preserves that skill and still lets other eligible updates proceed. Canceling the whole operation leaves the installation unchanged.
- Selecting an earlier published release restores the complete skill and retains that release automatically. Users can also explicitly keep the current version. No separate pinning step is required after rollback.
- Returning to latest clears the retained-version choice after successful activation. Failure must not discard the previously usable version or its pin.
- Pins do not suppress update offers and must survive catalog refreshes and ordinary updates to other skills.
- This enhancement does not introduce background installation. Client-native update behavior must be investigated so it cannot silently defeat a promised pin.
- Unavailable catalog information leaves installed content unchanged. Report unknown or stale availability without claiming the installation is current.

The interaction prototype owns exact wording, command syntax, and presentation/confirmation sequencing. The user has accepted the above outcomes; another policy interview is not needed merely to choose the screen or prompt layout.

### Historical retrieval and support

- Maintain a catalog mapping each published skill version to a **full Git commit ID plus the skill's folder path**, with short release notes.
- Fetch the exact historical snapshot and restore only the selected skill's complete folder, including supporting files. Do not roll the user's project repository or the entire collection backward.
- Several skill releases can reference the same commit. Their folder paths and version records distinguish them, and restoring one must leave the others unchanged.
- Version only skills whose release content changed. A change to one skill does not by itself require new versions for the others.
- Preserve prior published entries and the source history needed to retrieve them. Historical branches and separately maintained older release lines are unnecessary. The team fixes and supports latest; older releases remain available as unchanged historical content.
- YAML is a candidate catalog format, not a required implementation choice. Publication timing, version-number rules, catalog generation, integrity checks, and protection of historical availability belong to the publishing ticket.

GitHub supports source archives at an exact commit. Reproducible retrieval assumes the referenced commit remains available; branch names alone are moving targets. This establishes a retrieval building block, not proof that either client will activate the selected skill correctly. [GitHub source archive documentation](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives)

### Removed skills

- Tell users which skills are being removed and offer removal or preservation at the user level.
- A preserved retired skill becomes a personal copy outside the team's normal update and support flow. Do not retain it as a permanently managed retired entry in the plugin.
- Preserve the whole skill and its version/notes before removing the plugin copy. Report where the personal copy lives and how the user can remove it. Do not repeatedly ask to remove a copy the user has already chosen to keep.
- Do not overwrite an existing personal skill. If preservation cannot complete safely, leave the original usable and report the blocked handoff. A later name collision, including reintroduction into the collection, requires an explicit choice.
- An active skill held at an older version remains tracked for update offers. A retired personal copy is no longer team-managed. These may use similar client locations but have different ownership.

## Acceptance scenarios

| ID | Situation | Required outcome |
| --- | --- | --- |
| S1 | Fresh installation | All active skills are included; none are pinned by default. |
| S2 | Ordinary full update | Show versions/notes, move eligible skills to latest, and include newly added active skills. |
| S3 | Two active skills held behind latest | Offer both conveniently; update only the held skills selected by the user plus other eligible skills. |
| S4 | User declines both held-skill offers | Retain both choices, continue other updates, and offer newer releases again on a later update run. |
| S5 | User dislikes an update | Retrieve the requested historical skill folder, restore resources as well as instructions, and retain that version automatically. |
| S6 | Several skills were published in the same commit | Resolve the requested version by commit plus path; restore only its skill folder and leave all other selections unchanged. |
| S7 | User returns a held skill to latest | Activate latest successfully before clearing the pin. |
| S8 | Update or rollback fails, or catalog is unavailable | Preserve prior usable content and selections; report the actual outcome and any unknown availability. |
| S9 | User cancels before changes | Make no installation changes. Keeping pinned versions is not cancellation. |
| S10 | Team retires a skill | Ask to remove or keep a personal copy; keep only after preserving the complete skill, then hand ownership to the user. |
| S11 | Personal-copy destination collides or preservation fails | Do not overwrite the user's files or discard the original skill. Report the conflict. |
| S12 | Normal updater encounters a previously exported retired copy | Do not resume managing it or repeat retirement prompts; identify conflicts if it would interfere with a new installation. |
| S13 | User inspects status in an existing chat | Distinguish installed version from unverified instructions already loaded in the conversation. |

## Remaining work and ownership

These are implementation/design investigations, not unresolved product-policy blockers for this issue.

- [Verify retained skill versions in isolated Copilot CLI and VS Code installations](https://github.com/AndrewGodlewsky/andrew-skills/issues/10#issuecomment-5674093165): research resolved with verified folder restoration and limited CLI activation, plus documented failures and unknowns. The owner accepts proceeding on a VS Code compatibility assumption and testing later. Architecture planning is unblocked; deferred tests transfer to migration/acceptance planning. See the [results matrix](../../research/skill-version-compatibility-results.md); no unexecuted check is reported as passed.
- [Choose a distribution model for independently selected skill versions](https://github.com/AndrewGodlewsky/andrew-skills/issues/4): select a supported installation/activation mechanism and ownership of local state. Personal overrides are a candidate; separate plugins remain an alternative. A historical snapshot source is already accepted.
- [Define automatic skill versioning and immutable release history](https://github.com/AndrewGodlewsky/andrew-skills/issues/5): design the commit/path catalog, changed-skill detection, release numbering, notes, publication ordering/retries, and durable availability.
- [Define pinning, rollback, and reliable local version changes](https://github.com/AndrewGodlewsky/andrew-skills/issues/6): design state transitions, verification, failed-operation recovery, and safe retirement handoff around this contract.
- [Prototype selective updates to latest with preserved personal pins](https://github.com/AndrewGodlewsky/andrew-skills/issues/7): validate a concise interface for these outcomes, including reminders on every update run and explicit retirement choices.
- [Prototype skill version status and concise release notes](https://github.com/AndrewGodlewsky/andrew-skills/issues/8): distinguish current, update available, held, unknown, and personal-copy ownership without implying support for retired copies.
- [Define migration and acceptance checks for the existing skills hub](https://github.com/AndrewGodlewsky/andrew-skills/issues/9): migrate the current bundled installation and turn these scenarios into end-to-end acceptance coverage.

If client evidence disproves a promised outcome, bring that specific tradeoff back to the owner. Do not silently remove rollback, replace an individual pin, or reopen the excluded team-policy scope.

## Provenance and execution limits

The written answers are preserved in [Round 1](../team-defaults-round-1.md), [Round 2](../skill-updates-round-2.md), and [Round 3](../skill-updates-round-3.md). The subsequent conversation settled latest-only maintenance, the commit/path lookup, and independence when multiple skills share a commit. That acceptance supersedes uncertainty expressed in earlier rounds.

The resolution specifies behavior and a historical source model. It does not implement the system or authorize commits, pushes, tags, PRs, releases, client installation changes, or changes to security controls. The maintainer retains control of Git publishing.
