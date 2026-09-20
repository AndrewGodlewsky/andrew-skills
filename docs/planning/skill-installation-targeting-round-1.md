# Installation and updates — Round 1: use the intended copy

Issue: [Define installation ownership and update targeting across Copilot CLI and VS Code](https://github.com/AndrewGodlewsky/andrew-skills/issues/22).

**Status: owner accepted September 20, 2026.** The owner answered: "Yeah, I think this all looks good." This file preserves the reviewed proposal and original answer as the decision evidence. See the [accepted implementation handoff](skill-installation-targeting-handoff.md). This is not a working installation detector or an update to any installed plugin. No live client setup or test was run.

## What is already settled

- Recommend one hub installation per user environment so normal onboarding does not accidentally install twice. Someone deliberately maintaining separate copies may continue doing so.
- Update the whole selected GT plugin, including additions/removals, then report verified changes. No per-skill selection, removal confirmation or required preview.
- Personal historical copies are user-owned and outside ordinary update/status management. Windows, WSL and remote environments are distinct.
- Installed files and instructions retained in an existing chat are different things. Updating files does not prove the conversation switched instructions.

These come from the issue and the accepted [update flow](skill-interaction-prototype-notes.md) and [status contract](skill-status-prototype-notes.md).

## Proposed user experience

**Recommendation:** Work on one clearly identified installation per request. Use its owning manager. Ask only when the intended copy or environment cannot be established, and allow deliberate separate copies without requiring cleanup.

For onboarding, keep two alternatives: CLI installation for people using the CLI (including those also using VS Code), or VS Code installation for VS Code-only users. An existing suitable installation should lead to using/updating that copy rather than instructions to install another one. Ordinary VS Code skill use does not acquire a CLI prerequisite.

| Situation | Proposed behavior |
| --- | --- |
| One verified CLI-managed GT installation | Name the target briefly, refresh its marketplace, then update GT through the CLI in the same user/environment/configuration. Report the observed result. |
| VS Code uses that same CLI-managed installation | Treat it as one copy. Use the CLI-owned update route if the required terminal access is available. The visible app does not change installation ownership. |
| One verified VS Code-managed installation | Guide the user through native VS Code update controls. Do not run a CLI update against a different copy or require installing CLI. Reinspect the same target afterward when accessible. |
| Two independently managed copies | If the user named one, or the active skill's source reliably identifies one, use that copy. Otherwise show the identified choices once and ask which to update. Do not remove, merge or automatically update both. |
| The user deliberately wants both copies updated | Treat each as an explicitly selected target, in sequence, with separate results. This is reuse of the single-target flow, not a new bulk updater. Stop the sequence on a failure or unresolved target and explain what already happened. |
| A local development checkout supplies the skill | Identify it as a development source. Do not pull or modify the checkout through the managed-plugin updater. A separately named managed installation can be selected explicitly. |
| GT is absent, disabled or cannot be located | Distinguish absence, known disabled state and unknown location. Do not automatically install/enable/repair it. A known disabled installation remains a possible explicit update target if its native manager supports that action; updating must not silently enable it. |
| Terminal runs in WSL/SSH/container while the target is elsewhere | Do not assume that terminal can update the desktop copy. Use the matching environment or provide precise instructions for it. Cross-environment execution is not automatic. |
| Manager is known, but required tool/access is unavailable | Explain the missing capability and give the native user route when established. Do not install prerequisites, switch managers or claim the update ran. |

The explicit “both” case is a proposal for this review; previous approval of deliberate duplicates did not already select a bulk-update feature.

## How to identify the target without guessing

The implementation should use the evidence the client actually exposes, not build a general scanner of the user's computer.

1. **Start with explicit intent.** If the user named a manager, location or environment, match that request to available registration/source evidence. A choice establishes intent; it does not prove that an arbitrary folder is a native managed installation.
2. **Otherwise use source association when available.** A skill source/base directory supplied by the active harness can be matched to the installed plugin's registration and root manifest. Inspect the association; a file read from the repository during unrelated work is not proof it supplied the invoked skill.
3. **If no source association is available, use a sole verified managed GT candidate in the current environment only when nothing contradicts that selection.** State the selected target. This identifies the operation's target; it does not prove which source supplied earlier chat instructions.
4. **If evidence is missing, conflicting or gives several plausible targets, ask once.** Offer readable choices such as “Windows — CLI-managed GT” and “Windows — VS Code-managed GT,” with paths when they help distinguish copies. If candidates cannot be verified, explain the missing evidence rather than asking users to guess a hidden cache path.

Identify GT using the plugin identity and repository/marketplace provenance, not its name alone. Preserve the environment, user, effective manager configuration/profile, registration/source identity and resolved root location when available. Use that target identity again after the update. A changed cache directory can still represent the same manager registration; a new directory alone does not prove continuity.

Default paths are discovery hints. The current working directory, model/provider, presence of a CLI executable, a `.vscode` folder, or any folder merely named `gt` is insufficient proof of ownership. Read only relevant supported registration information and the selected collection. Do not inventory personal historical copies or scan every environment.

## Native update and reporting boundary

For a verified CLI target with the appropriate access, retain the current updater's two-step sequence. These are proposed runtime actions, not commands being run in this planning session:

```sh
copilot plugin marketplace update andrew-skills
copilot plugin update gt
```

Run the second only if the first succeeds. Before a name-based mutation, the implementation must establish that these fixed names resolve to the selected GT source in that same effective configuration. No `--all`, cache edits or changing configuration to make a different target appear correct.

For a verified VS Code target, explain where GT appears in the installed-plugin view and use an available GT-specific native update action when established for that client. The documented fallback is **Extensions: Check for Extension Updates**, followed by any required native GT update action. That check is broader than GT; do not describe it as an isolated GT-only command or as proof that GT changed. This investigation has not established a supported skill-callable bridge to invoke the VS Code action automatically. Do not infer that such a bridge is impossible; verify one before relying on it.

Before the operation, capture available per-skill metadata and source identity. Keep that small snapshot outside replaceable plugin files, with a supported task/session mechanism, long enough to finish reporting if the updater replaces itself. No new permanent inventory database or installed-cache mutation is proposed.

After a user-performed VS Code action, resume when the user says they completed it, then reread the same selected installation if possible. Distinguish user-reported completion from an observed native result and verified file changes. If a fresh chat loses the before-state, report the installed state and comparison limit; do not reconstruct an invented previous version.

Unknown release metadata does not block a correctly targeted native update. Report only verified transitions in the accepted Skill / Previous version / Updated version / What changed table. Without comparable before/after evidence, give available installed values and explain the limit. A command failure stays a failure even if some files changed. No-change, partial and cancelled outcomes follow the existing update contract; no automatic rollback or retry through a security block.

## What a teammate would see

**Clear shared installation:** “Updating the Windows CLI-managed GT installation used by this session.” Perform the native update, then report verified changes and suggest a fresh chat.

**Ambiguous copies:** “I found separate CLI-managed and VS Code-managed GT installations on Windows. Which one do you want to update?” After the choice, proceed without another target-confirmation step.

**VS Code-managed copy:** “This copy is managed by VS Code. Use its native update controls for GT. When you finish, I can check the same installation and report what changed.” Explain the documented check action if needed; do not claim it has already run.

These are proposed transcripts, not observed product behavior.

## Status and implementation handoff

`skills-status` should reuse the same target-identification rules for a read-only installed report. It need not have an update-capable manager/terminal when the selected installed collection can be identified and read reliably. Keep its three installed-value columns; no remote comparison, personal-copy inventory or update action. Distinguish an empty collection, absent installation, unlocated target and incomplete reads.

Once reviewed, extend the existing [update reporting](https://github.com/AndrewGodlewsky/andrew-skills/issues/15), [installed status](https://github.com/AndrewGodlewsky/andrew-skills/issues/16) and [owner pilot](https://github.com/AndrewGodlewsky/andrew-skills/issues/17) issues. Avoid another updater, installation manager or separate status project. Update onboarding documentation through that handoff where needed.

The pilot must cover each table case, CLI-only/VS Code-only/shared and deliberate duplicate setups, configured locations/profiles, development sources, disabled/absent/unknown cases, and Windows/WSL or remote mismatches. Record what each client exposes, how GT source/ownership is verified, native update behavior and how the same target is reidentified. Include a lost before-snapshot and changed cache path. Treat unsupported evidence as a limitation to resolve, not a pass. Live setup remains deferred.

## Documentation checked September 20

- [GitHub CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference): documents named-plugin updates, catalog refresh, and `copilot plugin list --json`. Its current inventory rows expose name, optional marketplace/version, enabled state, source and optional installedFrom. Effective CLI configuration can vary; the documented inventory is a candidate input, not proof of an active session's skill source. Exact field meaning and supported installed-version output must be verified in implementation.
- [VS Code agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins): documents discovery of CLI-installed plugins, installed-plugin controls, local plugin registration and its native update check. Discovery alone does not establish which copy supplied a particular session or establish an automated bridge from a skill to the UI.
- [Earlier source research and limits](../research/skill-context-loading-evidence.md): some inspected source paths expose the activated skill's base directory. That evidence is specific to the inspected harness/route, not every VS Code or CLI session.

The flow and evidence rules above are our proposed design. No local installed-plugin inventory was scanned and no client was launched or updated for this review.

## Your review

**Question:** Does this fit the experience you want: use the intended copy automatically when it is clear, ask once when it is ambiguous, guide native VS Code updates when direct execution is unavailable, and allow explicitly requested separate copies to be handled one at a time?

### Your answer
Yeah, I think this all looks good. 
<!-- Write your answer here, or answer in chat. -->
