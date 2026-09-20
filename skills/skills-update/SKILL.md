---
name: skills-update
description: Update the intended managed GT collection through its native manager and report verified per-skill changes when the user requests shared skill updates.
user-invocable: true
disable-model-invocation: true
---

Update the whole selected `gt` plugin from `AndrewGodlewsky/andrew-skills`,
normally registered through the `andrew-skills` marketplace. Invoking this skill
requests the native update once its target is established. Respect the client's
native tool approvals. No per-skill selection, removal approval, preservation
prompt or release preview is needed. Native updates replace managed GT edits;
do not back them up, import them or modify personal/project skills.

## Select and prepare the target

Read [the installation selection procedure](references/installation-target.md),
then [the snapshot and reporting procedure](references/update-report.md) before
any update. Both resources must be readable; report a missing resource and stop.
Use the selection procedure to verify registration, provenance, root identity,
owning manager and matching user/environment/effective configuration. State the
selected target briefly. A CLI-owned copy used by VS Code is one installation.

Ask one concise target question only when identity or intent remains ambiguous.
Resume after the answer without another target-confirmation step, while verifying
any still-missing ownership evidence. Do not substitute a development checkout,
another profile or another environment. Distinguish absent, disabled, unlocated
and incomplete targets; do not install, enable, repair, migrate or pull anything.
A known disabled copy may be explicitly updated only when its native manager
supports updating without silently enabling it. Otherwise explain the limitation.

For explicitly requested multiple copies, handle each selected registration in
sequence with its own snapshot and result. Never update every discovered copy by
default. Stop the sequence on failure or unresolved identity and report completed
work separately from targets not attempted.

Preserve the small before-snapshot described in the reporting procedure through
a supported task/session mechanism outside replaceable plugin files. Capture
available evidence; ordinary missing release metadata or unavailable preview
details do not block a correctly targeted update. If preservation is unavailable,
state that before/after comparison may be lost and proceed with that limitation.
Do not add a permanent inventory database or require Node, Git, a release catalog
or an exporter for ordinary updates.

## CLI-owned installation

Use terminal access to Copilot CLI in the selected target's same environment,
user account and effective configuration, including its effective `COPILOT_HOME`
when applicable. Before name-based mutation, verify that `andrew-skills` and `gt`
resolve to the selected registration and expected source there. Do not alter
configuration or substitute user-provided shell arguments to force a match.

If matching CLI/terminal access is unavailable, explain the missing capability.
Provide these native steps for the verified environment when appropriate, then
resume with observed evidence after the user performs them. Do not install CLI
or claim any operation ran merely because instructions were supplied.

Run these as two separate terminal operations. Inspect exit status and output
immediately after each; in PowerShell inspect `$LASTEXITCODE`. A successful tool
invocation alone is not proof that its command succeeded.

1. Refresh the marketplace:

   ```sh
   copilot plugin marketplace update andrew-skills
   ```

2. Only after the refresh succeeds, update the entire GT plugin:

   ```sh
   copilot plugin update gt
   ```

Do not run `--all`, `install`, `uninstall`, direct cache edits or a selective
skill update. If the first command fails, do not run the second. If either fails
or is cancelled, stop the sequence, report that operation's result and follow
the failure-reporting rules below. No automatic retry or rollback.

## VS Code-owned installation

Use the selected profile's native installed-plugin controls for GT. Guide the
user to a GT-specific update action when established for that client. The
documented fallback is **Extensions: Check for Extension Updates**, followed by
any required native GT update action. Explain that this check is broader than GT
and neither its invocation nor completion proves GT changed. No supported direct
skill-to-UI bridge is assumed. Do not substitute a different CLI-managed copy or
require CLI installation for this route.

Retain the before-snapshot while the user performs the action. Resume when they
report completion, distinguish their report from observed native results, and
reidentify the same registration before reading after-state. A new cache path is
acceptable only when registration/source evidence establishes continuity. A
fresh chat without the snapshot can report current installed values and the
comparison limit; it cannot reconstruct previous versions.

## Complete and report

Apply [the reporting procedure](references/update-report.md) to the actual
after-state. Separate marketplace refresh, native update outcome and verified
file transitions. Show only verified changed rows in the four-column result
table, and explain incomplete evidence outside it. A partial native failure
remains a failure even if files changed. Cancellation does not promise rollback.

After success, recommend a fresh Copilot chat so revised instructions can load;
installed files do not establish what this chat retains. Finish with the captured
operation results even if this skill replaced itself. Do not reload or recursively
invoke the new updater during reporting, and do not schedule future updates.

When the separately delivered `skills-restore` is available, mention it briefly
as an optional, separately requested historical-copy route. For a removed skill,
offer that route when historical source availability is verified; otherwise say
availability has not been checked. Do not invoke restore, export or inspect
personal copies automatically, and do not claim an unverified release is restorable.

A permission, authentication or security-policy rejection stops all further
operations, including after-state inspection. Report the exact failed action
and error and hand control back to the user. Do not retry through elevation,
another tool/environment, changed protection or repair. For ordinary non-security
failures, read-only reinspection of the same verified target may establish partial
changes; if it cannot, report the outcome as unknown rather than successful.
