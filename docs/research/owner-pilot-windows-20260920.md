# Windows owner pilot — September 20, 2026

Tracking: [issue #17](https://github.com/AndrewGodlewsky/andrew-skills/issues/17).
This is partial execution evidence, not adoption approval or a completed pilot.
Machine-readable records: [Windows evidence](owner-pilot-windows-20260920.json).
Earlier [compatibility results](skill-version-compatibility-results.md) remain
valid within their stated limits; the checks below supersede only matching cases.

## Environment and isolation

- Windows, native workspace; no WSL execution. A volume-information query
  returned `Get-Volume: Access denied`; filesystem type was not independently
  confirmed by that query. Work stopped and Andrew authorized investigation.
- Copilot CLI **1.0.83**, using the previously acquired portable runtime.
  Executable SHA-256:
  `d3f3bb7b8bbf68357ad29f514a179d09f76135483d8bfb643131b8600f671ee2`.
- VS Code **1.138.0**, commit `7debcd0e2acdea1c52de81bf9ee1620444407dda`, x64.
- Node **24.15.0**, Git **2.55.0.windows.3**, exporter **1.1.0**, protocol **1**.
- Published catalog head and local tested checkout:
  `d53987de6b158d6d1f42fed88eaae01d91beb83c`; installed GT **0.1.7**.
- Disposable state is under `.vscode/owner-pilot-20260920/` in this checkout,
  excluded from Git. Child processes receive isolated `HOME`, `USERPROFILE`,
  `APPDATA`, `LOCALAPPDATA`, `COPILOT_HOME`, and `COPILOT_CACHE_HOME`.
  Token/provider override variables are removed; no credentials were copied.
  The VS Code process uses dedicated user-data and extension directories and
  `--sync off`. Native automatic updates are disabled only in the fixture
  environment so they cannot interfere with the manual checks.
- Initial normal-profile extension enumeration failed with
  `EPERM: operation not permitted, mkdir 'c:\Users\godle\AppData\Roaming\Code\User'`.
  Work stopped; Andrew explicitly authorized continuation using isolation.
  Enumeration then succeeded in the disposable profile, returning no extensions.
  No ACLs or security settings were changed.

## Actual results

| Scenario | Result and boundary |
| --- | --- |
| Native remote marketplace registration | Passed: `plugin marketplace add AndrewGodlewsky/andrew-skills`. |
| Native remote install | Passed: `plugin install gt@andrew-skills` installed GT 0.1.7 and four skills. Native registration identifies marketplace and managed path. |
| Native discovery | Passed for inventory: all four GT skills have plugin source and paths beneath the disposable managed installation. Not a chat activation claim. |
| No-new-release update with a managed edit | Passed: appended a unique test marker to the disposable managed `grill-me/SKILL.md`, refreshed the marketplace, then ran `plugin update gt@andrew-skills`. CLI reported success, version 0.1.7 already latest, and four updated skills. Marker disappeared and all **135 file hashes** matched the pristine installation. No custom reset, backup or preservation prompt was used. |
| Native uninstall/reinstall | Passed: native uninstall removed the managed files; native install restored them. All 135 file hashes matched the original installation. |
| Personal/project preservation | Passed for two synthetic skills, each containing two files. All names and SHA-256 hashes remained identical after update, uninstall and reinstall. No actual personal inventory was read for this check. |
| Published historical source retrieval | Passed: online exporter list pinned main at the full commit above. Chose `grill-me` 1.0.0 from `bf74bca587d80502394f27fc5984816081c92a12`. |
| Complete source review and personal creation | Passed: reviewed both verified original files (`SKILL.md`, `release.yaml`); no external resource, plugin or self-name dependencies were present. Saved only the returned nested plan and exported with the portability attestation into the disposable home. Publication completed as `grill-me-v1-0-0`. This tests the direct checkout helper; invoking the bundled helper through restore chat is still pending. |
| Personal/current coexistence | Passed for CLI discovery only: `grill-me-v1-0-0` is personal-copilot source while current `grill-me` remains plugin source. Neither inventory nor file creation proves that slash commands load correctly. |
| Read-only inspection | Reported complete publication, no lock, integrity `matches-receipt`, provenance `unverified-receipt`, activation `not-verified`. Receipt consistency is not independent provenance verification. |
| VS Code initial isolated profile launch | Failed: despite CLI exit zero, Andrew saw a breakpoint dialog. The main log recorded renderer `launch-failed, code: 49`, registry access failure and a mutex warning. No chat test ran. |
| VS Code authorized launch retry | Andrew explicitly authorized retry outside the agent execution sandbox. The same isolated profile launched with VS Code security protections unchanged. At 20:18 EDT the new logs show the renderer performance baseline, extension host startup and agent host startup; the prior registry/renderer failures did not recur in the inspected startup logs. The mutex warning remains. No GitHub session is signed in; user-visible plugin discovery and chat behavior remain pending. |

The CLI registration field named `source_sha` contains a 64-character value;
it is preserved as client metadata and is **not** presented as a Git commit.
The catalog independently supplies the 40-character pinned Git commit.

## Owner interaction prepared

The disposable VS Code window is titled **GT WINDOWS PILOT — disposable profile**.
Its `project/PILOT.md` gives the first checks: see whether VS Code discovers the
CLI-managed GT copy, invoke `/gt:skills-status`, then invoke `/gt:grill-me` and
`/grill-me-v1-0-0` in separate fresh chats. Keep Settings Sync off. Andrew handles
normal sign-in and trust prompts. No second GT installation is needed for this
shared-copy check.

Expected status rows: grill-me 1.0.1, skills-update 1.1.0, skills-status 1.0.0,
skills-restore 1.0.0. Personal/project fixtures and the historical copy must be
excluded. Record the actual resolved paths, table and errors before marking
anything passed.

The prepared UI steps follow the current
[VS Code plugin documentation](https://code.visualstudio.com/docs/agent-customization/agent-plugins).
That source documents shared CLI discovery and native plugin controls; this
reference is not runtime proof of either behavior on this machine.

## Remaining acceptance

Issue #17 remains open. Pending: authenticated CLI/VS Code chat activation;
main/personal resource reads; installed restore-chat helper execution; actual
update/status instruction behavior; existing-chat refresh; VS Code-owned
install/update/reinstall; automatic updates; the old 0.1.3 transition; remaining
targeting states and cross-environment cases; WSL filesystem/client checks;
final onboarding integration and owner-controlled required-check/history policy.
No repository settings, commits, pushes, releases or PRs were created.

The earlier pinned external-marketplace failure is not resolved by the successful
ordinary remote marketplace test. The successful no-new-release CLI update does
not establish release-transition or VS Code update behavior. Do not use these
partial results to close #11, #14 or #17 or recommend team adoption yet.
