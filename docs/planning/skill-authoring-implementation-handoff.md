# GT skill authoring — implementation handoff

**Status: blueprint accepted and planning issue closed September 20, 2026; implementation pending.** Decision: [Review the skill authoring blueprint and enforcement handoff — resolution](https://github.com/AndrewGodlewsky/andrew-skills/issues/21#issuecomment-5752731424). The owner accepted the [written blueprint](skill-authoring-blueprint-prototype.md), including its examples, canonical guide, evidence placement, validation boundary and implementation slices. The original answer is preserved there.

## Accepted handoff

- Use `CONTRIBUTING.md` as the single current authoring guide, containing the standard, minimal starter, resource example, checklist and release instructions. README and project AGENTS.md point authors/agents to it. Preserve historical planning answers without maintaining competing active standards.
- Keep change-specific representative requests, expected outcomes, actual checks and exception rationale in the existing issue or PR carrying the change. Choose one record and link it; do not require a third skill file or evidence schema.
- Require the four explicit header fields. Initially accept only those plus optional nonempty string `argument-hint` and `license`; additional keys need a reviewed standard/validator change. Reject neither-route invocation configurations. Preserve supported relative-link/name/body checks and describe parser limits.
- Human/client review still covers meaningful instructions, exception rationale, compatibility, attribution and dependencies. Structural validity does not establish successful invocation or behavior.
- Add explicit `user-invocable: true` to both current skills with the validator change requiring it. Preserve manual invocation intent and avoid broad instruction rewrites. Coordinate baseline/release changes with the metadata work.
- Retain the two complete examples as authoring examples, not new production skills. A model-invocable example demonstrates a reviewable exception, not blanket authorization to change current invocation defaults.

## Execution issues

| Work | Scope and relationship |
| --- | --- |
| [Publish the canonical GT skill authoring guide and examples](https://github.com/AndrewGodlewsky/andrew-skills/issues/23) | Guide, examples, checklist and authoring pointers; accurate implemented-versus-planned status. |
| [Enforce the GT skill architecture and adopt it in existing skills](https://github.com/AndrewGodlewsky/andrew-skills/issues/24) | Existing validator/CI path, meaningful structural fixtures and current-skill adoption. |
| [Add per-skill release metadata and validation](https://github.com/AndrewGodlewsky/andrew-skills/issues/12) | Existing release.yaml schema, first metadata-complete baseline, version rules and stable validation job. Reuse this work. |
| [Complete the owner pilot and team adoption readiness checks](https://github.com/AndrewGodlewsky/andrew-skills/issues/17) | Includes both new authoring slices as prerequisites, alongside the previously required feature implementation. Actual client behavior and complete adoption remain pending. |

The new execution issues are outside the planning map. The guide and architecture slices do not introduce a new blocker for settled metadata implementation. Coordinate shared validator, CI, skill and contributor-document edits; independence in the tracker is not permission to overwrite concurrent work.

When practical, make the architecture adoption edits with the first metadata-complete baseline. If release metadata already shipped, use ordinary version increments instead. Never reset a published version to fit a plan. Documentation-only changes do not bump versions; shipped skill changes follow the existing contract with one plugin patch per bundle change. Do not pin a future plugin number in advance.

## What remains outside this implementation

- Installation ownership/update targeting is accepted in the [management-skill handoff](skill-installation-targeting-handoff.md). Its implementation remains in the existing update/status/pilot issues, separate from authoring guidance and architecture adoption.
- A future skill that helps users create skills or submit feedback is still separate future work. Its retrieval flow, name and implementation are not fixed here.
- GitHub approval permissions and settings remain owner-managed. No contribution classification/routing logic, mandatory approval gates, heading quotas, evidence schema or second release system is introduced.

## Evidence and publication

The blueprint was reviewed as written examples. Its external document links and code-fence structure were checked locally; examples were not installed or invoked. Current source inspection established the missing explicit flag/release records and existing validator limits, not runtime compatibility. Deferred client checks remain in the pilot.

This handoff changes planning documentation and GitHub issues only. Skill, validator, CI and manifest implementation has not started in this decision. Local files remain uncommitted until owner publication. Issue-management permission does not grant standing commits, pushes, PRs, merges, releases or repository-settings authority.
