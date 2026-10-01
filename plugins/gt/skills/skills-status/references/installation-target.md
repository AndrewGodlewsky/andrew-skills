# Identify one managed GT installation

Use this same selection contract for status and native updates. This copy is
bundled so the skill needs no repository-only guide or another installed skill.

1. Establish the current environment and user: Windows, a particular WSL distro,
   SSH host or container. Keep the effective manager configuration/profile with
   the candidate. A desktop window and its terminal can be in different environments.
2. Start with any explicit user choice. Match it to supported manager registration
   or source evidence for `gt` from `AndrewGodlewsky/andrew-skills` (normally the
   `andrew-skills` marketplace). Verify the registration's actual provenance and
   resolved installed root, and confirm that root's `plugin.json` identifies `gt`.
   Names and a familiar path alone do not establish provenance or ownership.
3. With no explicit choice, use reliable active-skill source association from the
   client/harness when it maps to that verified registration. Merely reading a
   skill file during unrelated work is not active-source evidence.
4. Otherwise use a sole verified managed candidate in the current environment,
   provided no evidence contradicts it. A CLI installation used by VS Code remains
   CLI-owned. Independent copies are separate candidates; different paths for one
   registration are not automatically separate installations.
5. If several choices, conflicting evidence or insufficient identity remain, ask
   one concise target question. A user selection establishes intent; obtain any
   still-missing registration/provenance evidence before treating it as managed.
   Explain unavailable evidence instead of asking the user to guess cache paths.

Capture environment, user, effective manager configuration/profile, owning
manager, registration/source identity, provenance, enabled state when known and
resolved root. Do not infer which source supplied earlier chat instructions.

## Supported evidence routes

Prefer source/registration details already supplied by the current harness and
relevant local installed-plugin controls. Read only what is needed to identify GT.

For CLI-owned candidates, `copilot plugin list --json` and
`copilot plugin marketplace list --json` are documented read-only inventory
commands. Use them only when CLI access exists in the matching environment and
effective configuration. Inspect actual output rather than assuming optional
fields or treating the listed plugin version as a skill version. Current plugin
rows may expose name, marketplace, enabled state, source and installedFrom; these
must be connected to the registration and readable installed root. Do not change
configuration to make a different installation appear to match.

For VS Code, use supported installed-plugin/source details and effective profile
configuration, including configured custom locations. Recognize CLI-discovered
copies versus VS Code-managed installations and local development registrations.
If the client provides no reliable root/provenance evidence, say what is missing.
Do not invent a cache path, UI bridge or universal registration file schema.

Default locations, `COPILOT_HOME`, a `.vscode` directory, the current checkout,
presence of a CLI executable, or a folder called `gt` are discovery hints rather
than proof. Do not enumerate personal-skill directories or cross into another
environment automatically. A local development source is not a managed installation;
do not pull or update that checkout. Known disabled state is separate from absence.
Missing release metadata is separate from missing installation identity.

For status, readable verified installed evidence suffices: do not require CLI,
terminal mutation access, Node, Git or an update-capable manager merely to report.

Documentation references for maintainers; status does not fetch these at runtime:
[CLI plugin inventory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference),
[VS Code plugin sources](https://code.visualstudio.com/docs/agent-customization/agent-plugins).
