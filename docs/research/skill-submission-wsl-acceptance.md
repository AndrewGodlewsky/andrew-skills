# create-issue — Remote WSL and WSL CLI acceptance

Tracking: [issue #36](https://github.com/AndrewGodlewsky/andrew-skills/issues/36).
Environment inventory: September 20, 2026 America/New_York (September 21 UTC).

**Status: environment gate incomplete; neither WSL client is accepted.** WSL is
installed, but the only registered distribution is Docker Desktop's internal
distribution. There is no ordinary developer distribution in which to verify
the Linux tools, authentication, installed GT resources or either client.
This does not block the independent Windows acceptance work in
[issue #35](https://github.com/AndrewGodlewsky/andrew-skills/issues/35).

## Observed environment

Read-only `wsl.exe --version` and `wsl.exe --list --verbose` ran from the Windows
workspace with approved elevated execution. They returned the following:

| Item | Observed value |
| --- | --- |
| WSL | 2.6.3.0 |
| Kernel | 6.6.87.2-1 |
| WSLg | 1.0.71 |
| Windows build reported by WSL | 10.0.26200.9457 |
| Registered distributions | `docker-desktop` only; default, Stopped, WSL version 2 |
| Ordinary developer distribution | None registered |

The Windows process output included UTF-16 NUL characters; the displayed values
above remove that transport artifact. Both commands produced their expected
inventory output, without an observed security or authentication error. No
distribution was started or modified. Docker Desktop was not used as a substitute
developer environment. No Linux authentication, helper invocation or test issue
creation was attempted.

The published candidate for the next run is
[`5466ab67f3818a3772222e2633963aa8e2784de7`](https://github.com/AndrewGodlewsky/andrew-skills/commit/5466ab67f3818a3772222e2633963aa8e2784de7):
GT **0.1.8**, `create-issue` **1.0.0**. That identifies the source to install;
it does not establish a WSL installation. Record actual installed paths and bytes
when setup exists. The earlier
[package hash manifest](skill-submission-package-hashes.json) describes the
pre-commit Windows working tree and must not be relabeled as observed Linux
installation evidence.

The [earlier owner pilot](owner-pilot-windows-20260920.md) tested a separate
Windows installation of GT 0.1.7, before `create-issue` existed. Its discovery
and launch results are not WSL acceptance. Linux CI verifies offline helper
behavior, not WSL client loading, permissions or authenticated composition.

The candidate's Linux Node 22/24 issue-submission jobs passed in
[CI run 35558497205](https://github.com/AndrewGodlewsky/andrew-skills/actions/runs/35558497205).
The [shared offline fixture report](skill-submission-acceptance-fixtures.md)
maps boundary coverage. Neither result supplies either missing WSL client row.

## VS Code Remote WSL

| Required evidence | Current result |
| --- | --- |
| Named developer distribution, Linux tool paths and versions | Not run: no developer distribution |
| Remote window, VS Code/Copilot versions and tool execution location | Not run |
| Enabled GT source path and exact package identity | Not installed or inspected in WSL |
| Effective Linux helper actor and fixed repository preflight | Not run |
| Fresh/existing chat model handoff and bundled-resource loading | Not run |
| No manual slash entry; absent/disabled/shadowed dependency handling | Not run |
| Rich caller content from unrelated workspace; create/readback | Not run; no Remote WSL test issue |
| Comment, explicit own-edit and additive label outcomes | Not run |
| Scope, authorization, content and redirection boundary cases | Not run in this client |
| Prepared/manual, partial-label, uncertain/repeat-request results | Not run in this client |
| Ordinary submitter with their own authorized identity | Not run |

## Copilot CLI inside WSL

| Required evidence | Current result |
| --- | --- |
| Named developer distribution, Linux Node/gh/Copilot versions and paths | Not run: no developer distribution |
| Enabled GT source path and exact package identity | Not installed or inspected in WSL |
| Effective Linux helper actor and fixed repository preflight | Not run |
| Fresh/existing session model handoff and bundled-resource loading | Not run |
| No manual slash entry; absent/disabled/shadowed dependency handling | Not run |
| Rich caller content from unrelated workspace; create/readback | Not run; no WSL CLI test issue |
| Comment, explicit own-edit and additive label outcomes | Not run |
| Scope, authorization, content and redirection boundary cases | Not run in this client |
| Prepared/manual, partial-label, uncertain/repeat-request results | Not run in this client |
| Ordinary submitter with their own authorized identity | Not run |

## Owner setup before resuming

These are proposed setup steps for Andrew, not changes performed by this task.
Stop on an actual security, authentication or policy denial and retain its error;
do not disable controls or substitute credentials/tools from Windows.

1. Install a normal WSL developer distribution. Because WSL already exists,
   use `wsl --list --online` to choose a distribution, then, for example,
   `wsl --install -d Ubuntu` from an administrator PowerShell. Follow the
   installation prompts and create the Linux user account. Use
   `wsl --distribution Ubuntu` explicitly so the existing Docker default is
   not accidentally selected. These commands and first-launch setup follow
   [Microsoft's WSL installation guide](https://learn.microsoft.com/en-us/windows/wsl/install).
2. In that distribution, install Linux Node **22+** and GitHub CLI **2.90.0+**
   using their official installation guidance. These are this package's
   engineering floors, not a claim that the distribution's default packages
   meet them. Verify the actual versions afterward.
   [Node downloads](https://nodejs.org/en/download),
   [GitHub CLI Linux installation](https://github.com/cli/cli/blob/trunk/docs/install_linux.md).
3. Complete your own Linux GitHub CLI sign-in using its normal interactive flow,
   such as `gh auth login --hostname github.com`. Do not copy a Windows token or
   run Windows `gh.exe` from WSL. A visible `gh auth token` command is not part of
   acceptance: the bundled helper captures its selected credential privately.
   [GitHub CLI authentication](https://cli.github.com/manual/gh_auth_login).
4. Install Copilot CLI inside Linux and complete its normal interactive sign-in
   under your account. One documented option with Node 22+ is
   `npm install -g @github/copilot`; follow the installed client's login prompts.
   Preserve its normal trust/tool approvals. Do not alter organization policy
   to manufacture access.
   [Copilot CLI installation](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli),
   [authentication](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/authenticate-copilot-cli).
5. For Remote WSL, use Windows VS Code with its WSL extension. In VS Code's
   Command Palette choose **WSL: Connect to WSL using Distro** and select the
   developer distribution. Confirm the WSL indicator and open a Linux terminal
   in that window. Record where Copilot's tools actually execute; the window
   indicator alone is insufficient evidence of the helper's execution location.
   [VS Code WSL setup](https://code.visualstudio.com/docs/remote/wsl).
6. Install the GT marketplace plugin in the chosen Linux environment using the
   [repository's installation instructions](../../README.md#install-without-downloading-this-repository).
   Resolve its actual enabled source separately in each client. Do not assume
   Windows installation, shared discovery, plugin inventory or a version label
   proves that either WSL client loaded this candidate.

## Resume procedure and evidence

Record the named distribution and Linux identity, actual executable paths and
versions (`node`, `gh`, `copilot`), client/Copilot versions, enabled GT source,
and all installed `create-issue` package hashes. Linux tools must resolve to
Linux executables. Inspect only the intended installation and synthetic test
workspace; no unrelated private project collection is needed.

Begin with the bundled helper's documented **read** request to verify the actual
actor and pinned GT repository. Only then run each client's controlled cases
from the [acceptance handoff](../planning/skill-submission-implementation-handoff.md#definition-of-done-and-evidence).
Keep separate issues and transcripts for Remote WSL and WSL CLI. The caller
must supply the complete benign content and existing authority; the dependency
must resolve its own installed helper and preserve that content.

Record verified creation/comment links and explicit own-edit/label outcomes.
Use offline request capture for unsafe mutation cases, and label that evidence
as offline; a passing helper fixture is not observed model behavior. Keep
missing ordinary-submitter coverage explicit. If a real write becomes uncertain,
preserve its evidence and reconcile read-only before any further mutation.

Both client tables remain incomplete until their required observed loading,
authenticated submissions and boundaries are recorded. No compatibility claim,
issue closure, version bump, commit or publishing action follows from this
environment inventory alone.
