---
name: skills-update
description: Refresh the andrew-skills marketplace and update the installed gt plugin when the user requests shared skill updates.
disable-model-invocation: true
---

Update the user's CLI-managed `gt` plugin from the `andrew-skills` marketplace.
Invoking this skill requests both operations below; respect the client's terminal
approval requirements.

## Prerequisites

Use a terminal on the same machine and under the same user account as the
installation being updated. A terminal in WSL, SSH, or a container may target a
different installation from desktop VS Code; clarify the target if uncertain.

The user needs GitHub Copilot CLI (`copilot`), terminal tool access, an installed
`gt` plugin, and the registered `andrew-skills` marketplace. If a prerequisite is
missing, report it and stop. Do not install tools, register marketplaces, migrate
installations, or change settings as part of this update.

If the user is updating a VS Code-managed installation instead, direct them to
**Extensions: Check for Extension Updates**. If they use a locally registered
checkout, explain that these commands update the CLI installation, not that
checkout. Do not modify or pull their project repository.

## Update sequence

Run the following as two separate terminal operations and inspect the exit status
and output of each. Do not run the second operation unless the first finishes
successfully. In PowerShell, inspect `$LASTEXITCODE` immediately after the command;
do not mistake successful terminal invocation for command success.

1. Refresh the catalog:

   ```sh
   copilot plugin marketplace update andrew-skills
   ```

2. After a successful refresh, update the plugin and all of its bundled skills:

   ```sh
   copilot plugin update gt
   ```

Use these fixed names; do not substitute user-provided shell arguments. Do not
run `install`, `uninstall`, or an update of all plugins. Stop on command failure
and report the failed step and relevant error. On an authentication, permission,
or security-policy block, hand control back to the user without retrying through
another tool, elevating, or changing protections.

## Report the result

Distinguish a successful catalog refresh from a successful plugin update. Report
whether the CLI says the plugin changed or was already current; include a version
only if the output provides it. If the output only confirms success, say the
update completed without claiming a version change. Never claim an update ran
if terminal access or approval was unavailable.

After success, recommend a fresh Copilot chat so revised skill instructions can
load. This skill may itself have changed on disk during the update; finish with
the command results and do not invoke it recursively. It updates on demand and
does not enable automatic updates or notifications.
