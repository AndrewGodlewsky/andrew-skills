# Caveman for GT

Two chat styles: **light** and **full**. Full is the default. Upstream `lite` is
accepted as an alias for light. `off`, `stop caveman` and `normal mode` stop the
style; no other intensity is available.

Examples in a client that exposes GT slash commands:

```text
/gt:caveman light
/gt:caveman full Explain this function.
/gt:caveman off
```

In Codex, select the GT `caveman` skill through the skill picker or `$gt:caveman`.
Command alias support depends on the client. Keep the selected mode within the
current conversation; new sessions do not inherit a mode automatically. This is
a style instruction, not an enforced
token limit or a guaranteed token-saving percentage.

## Requirements and activation

The host must discover and enable the GT plugin and load [SKILL.md](SKILL.md)
when invoked. This package permits manual and model
selection for explicit Caveman-style requests. It needs no API key, runtime,
daemon, MCP server or companion skill. The other GT Caveman skills are independent
workflows, not dependencies of this style.

The upstream Claude plugin's SessionStart and UserPromptSubmit hooks are separate
installation features. They are not needed for this session-scoped skill and are
not bundled or activated here. GT does not automatically apply Caveman to every
new session. The upstream CLI, proxy, memory engine and tool-output compression
services are also separate products, not prerequisites for these two chat modes.

Repository source files under `skills/` are the distributed GT package. An
installed marketplace copy changes only after the owner publishes the package
and that installation is updated. Source preparation alone does not establish
installed-client discovery or marketplace publication.
Do not edit managed plugin caches to install this adaptation.

## Provenance

Adapted from [JuliusBrussee/caveman at 2fd153c6](https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/skills/caveman/SKILL.md),
copyright (c) 2026 Julius Brussee, under the bundled [MIT license](LICENSE).
The pinned [licensing scope](https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/LICENSING.md)
classifies the source skill directory as MIT. This independent adaptation does
not imply upstream sponsorship.

GT keeps light/full styles, exact technical content, language preservation,
conversation persistence, stop controls and clarity/external-artifact boundaries.
It removes the other intensities, accepts light as the public name for lite,
clarifies unsupported-mode handling and preserves host-required progress updates.
It removes unverified tokenizer-specific claims and preserves evidence-based
uncertainty. GT header fields and release metadata are added. No upstream hooks,
runtime binaries, external service configuration or provider settings are copied.
