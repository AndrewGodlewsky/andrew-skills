# Existing agent supervisors: implementation shortlist

Research date: October 3, 2026. Scope: an external system that repeatedly runs an agent, checks its actual work, persists progress, and resumes. Windows and Codex compatibility matter. This is source inspection, not installation or execution of the candidates. No Git writes were performed.

## Findings and recommendation

Two promising starting points emerged: **Agent Orchestrator** for a maintained desktop workflow driven by GitHub issues, pull requests and CI; **ralph-gold** for a configurable local task/check/retry loop. Neither should be presented as automatically proving arbitrary objectives complete. A small pilot with explicit acceptance checks remains necessary.

### Agent Orchestrator

The former ComposioHQ repository redirects to Untrivial-ai. Its current platform documentation describes native Windows support through ConPTY and Codex integration; the daemon persists state in SQLite. The latest release inspected by the research team was v0.13.3, October 1, 2026. This is the strongest desktop-oriented candidate from this screening. [Repository](https://github.com/Untrivial-ai/agent-orchestrator), [platforms](https://docs.orchestrator.inc/platforms/), [releases](https://github.com/Untrivial-ai/agent-orchestrator/releases).

Its current lifecycle loop routes CI failure names/links and review feedback to the owning agent, asks for conflict resolution, and deduplicates unchanged feedback. That is useful externally observed feedback, but does not establish a generic acceptance checker for research or repository maintenance objectives. Old `reactions` YAML and associated retry-budget/automatic-merge advice were retired; do not use outdated configuration examples. [Current lifecycle automation](https://docs.orchestrator.inc/configuration/lifecycle-automation/).

### ralph-gold: closest configurable run/check/run mechanism

The project runs fresh Codex, Claude Code or Copilot CLI sessions against a task tracker, with filesystem records under `.ralph/`. It exposes single-step, bounded run, and longer-running supervise commands. Its external supervisor calls one iteration at a time, reads task state, handles invocation-rate waiting, and stops on completion, blocked work, no progress, errors, or a runtime limit. [README](https://github.com/jscraik/ralph-gold), [supervisor source](https://github.com/jscraik/ralph-gold/blob/fc5bb897326bda18e7283989f8e934db7b78406d/src/ralph_gold/supervisor.py#L78).

The loop executes configured gate commands outside the worker and records results. Its exit decision checks tracker completion, clean Git state, and enabled gate/judge/review outcomes. Persistent state includes task attempts and iteration history. Failed attempts can automatically block tasks. This is a real host-run validation mechanism when configured, although semantic correctness still depends on the checks selected. [Gate execution](https://github.com/jscraik/ralph-gold/blob/fc5bb897326bda18e7283989f8e934db7b78406d/src/ralph_gold/loop.py#L1130), [completion enforcement](https://github.com/jscraik/ralph-gold/blob/fc5bb897326bda18e7283989f8e934db7b78406d/src/ralph_gold/loop.py#L2982).

The supplied configuration is a material adoption caveat:

- The template sets `auto_commit = true`, despite its header describing false as a safe default.
- Custom gate commands are empty, and independent review is disabled.
- Smart gate skipping is enabled for Markdown, docs, TOML, YAML and JSON—the principal artifacts in this skill repository.

For this repository, configure real validation commands, disable that skipping, and reconcile automated commit behavior with the owner's separate Git-write authorization. Disabling auto-commit alone is insufficient to promise completion, because the loop also expects clean Git state; the worker prompt asks for one commit per iteration. These are implementation changes/configuration decisions to resolve in a pilot, not permissions granted by this research. [Configuration template](https://github.com/jscraik/ralph-gold/blob/fc5bb897326bda18e7283989f8e934db7b78406d/src/ralph_gold/templates/ralph.toml#L67), [worker prompt construction](https://github.com/jscraik/ralph-gold/blob/fc5bb897326bda18e7283989f8e934db7b78406d/src/ralph_gold/loop.py#L630).

Windows-specific implementation exists: gate commands use `cmd /c` on Windows, and the package conditionally installs `windows-curses`. The inspected CI test job runs on Ubuntu, so native Windows reliability is not verified here. Requires Python >=3.10, Git and an installed agent CLI. [Shell dispatch](https://github.com/jscraik/ralph-gold/blob/fc5bb897326bda18e7283989f8e934db7b78406d/src/ralph_gold/loop.py#L804), [package requirements](https://github.com/jscraik/ralph-gold/blob/fc5bb897326bda18e7283989f8e934db7b78406d/pyproject.toml), [CI](https://github.com/jscraik/ralph-gold/blob/fc5bb897326bda18e7283989f8e934db7b78406d/.github/workflows/pr-pipeline.yml).

Operational limits: the supervisor checks its total runtime between iterations, not as a hard mid-iteration deadline. It resets the no-progress streak when started. Persistent task state therefore does not imply an exactly-once crash-recovery service or a lifetime stall budget. The inspected supervisor contains no monetary budget. [Supervisor implementation](https://github.com/jscraik/ralph-gold/blob/fc5bb897326bda18e7283989f8e934db7b78406d/src/ralph_gold/supervisor.py#L93).

Live GitHub API inspection found MIT licensing, 2 stars, 3 forks, a July 11, 2026 default-branch head, an August 4 repository push timestamp, and an empty releases list. Treat it as a small project with useful mechanisms, not established operational maturity. [Repository metadata](https://api.github.com/repos/jscraik/ralph-gold), [inspected commit](https://github.com/jscraik/ralph-gold/commit/fc5bb897326bda18e7283989f8e934db7b78406d), [releases API](https://api.github.com/repos/jscraik/ralph-gold/releases).

### Codex-Looper: availability prevents recommendation

Search-indexed first-party README content describes isolated implementation, host-controlled deterministic checks, independent review, bounded repair, receipts, and local commits. It claims Apache-2.0 licensing and requires Node 20+, Codex CLI, MEX, Ralphex and a configured CloseRouter route. This is conceptually relevant but a heavier stack. [Indexed repository](https://github.com/DatenpflegeNordHL/Codex-Looper).

However, live unauthenticated GitHub API retrieval returned HTTP 404 during this research. Raw README URLs on both main and master also failed, and source/status-page browsing failed. The repository may have moved, become private, or been removed; the cause is unknown. The indexed README is not proof of current availability or implementation. Do not recommend installing it until a working public source location is established. [API endpoint checked](https://api.github.com/repos/DatenpflegeNordHL/Codex-Looper).

## Other screened candidates

| Candidate | Useful properties | Limitation for this request |
| --- | --- | --- |
| [mikeyobrien/ralph-orchestrator](https://github.com/mikeyobrien/ralph-orchestrator) | Codex, role-based stages, task state and limits; inspected release 2.10.1 dated June 22 | Recommend WSL on this Windows machine based on supplied macOS/Linux binaries. Its backpressure parser recognizes report strings such as `tests: pass`; independent execution of checks is not established by that parser. [Source](https://github.com/mikeyobrien/ralph-orchestrator/blob/main/crates/ralph-core/src/event_parser.rs). |
| [subsy/ralph-tui](https://github.com/subsy/ralph-tui) | Codex, terminal visibility, headless operation, pause/resume | Completion code uses a promise marker in agent stdout and then completes the tracker task; additional independent verification would be needed. [Completion implementation](https://github.com/subsy/ralph-tui/blob/main/src/engine/index.ts#L1351). |
| [snarktank/ralph](https://github.com/snarktank/ralph) | Simple repeat-until-complete pattern | Inspected shell runner supports Amp/Claude and stops on a COMPLETE promise string; poor match for Codex plus independently checked completion. [Runner](https://github.com/snarktank/ralph/blob/main/ralph.sh). |
| [SantanderAI/ralph](https://github.com/SantanderAI/ralph) | Native PowerShell runner, iteration bound and stop file | Inspected defaults bypass Codex approvals/sandbox; not an appropriate unchanged supervisor for this repository. [Runner](https://github.com/SantanderAI/ralph/blob/main/ralph-loop.ps1). |

## Proposed pilot acceptance criteria

Use a disposable repository and one bounded objective. Inject a failed deterministic check, a worker that reports success without doing the work, an interrupted process, and repeated unchanged output. Accept a candidate only if it prevents false completion, recovers understandable state, stops at configured limits, and respects the owner's Git authority. These are proposed checks; none were executed in this research.
