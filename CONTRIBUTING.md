# Contributing skills

## Add or improve a skill

1. Create `plugins/team-core/skills/<skill-name>/SKILL.md`, or edit an existing
   skill. Use lowercase letters, numbers, and single hyphens for names.
2. Use this header, replacing the sample name and description:

   ```markdown
   ---
   name: explain-design
   description: Explain a proposed design and its tradeoffs. Use when reviewing a design.
   ---

   Write the procedure, expected outputs, and examples here.
   ```

   The name must match the directory. Describe when to use the skill as well as
   what it does. Add `disable-model-invocation: true` for manual-only skills.
   Keep header values on a single line. This repository's lightweight validator
   supports plain strings, JSON-style double-quoted strings, YAML single-quoted
   strings, and boolean flags; other YAML forms require extending the validator.

3. Put supporting files inside the skill folder and reference them with relative
   Markdown links, for example `[Template](templates/example.md)`. Keep skills
   self-contained: no personal absolute paths or undeclared skill dependencies.
4. Add the skill to the README catalog. Document any required tools or services.
5. Run `node scripts/validate.mjs` with Node.js 22 or newer.
6. Register the local plugin using the README instructions and invoke the skill
   in a fresh Copilot Chat. Check a representative input and expected behavior.
7. Submit your changes for team review. GitHub Actions runs the same validation.

Keep applicable attribution and license terms when importing someone else's
skill. Document adaptations in the README's provenance section.

## Publish an update

For each published plugin update:

1. Increment `version` in `plugins/team-core/plugin.json` (for example,
   `0.1.0` to `0.1.1` for an instruction fix).
2. Set the matching plugin entry in `.claude-plugin/marketplace.json` to the
   same version and update the README catalog version.
3. Validate and test the new behavior in VS Code.
4. The maintainer commits and pushes the reviewed changes to the branch used
   by the marketplace (normally the default branch).

A GitHub release, package registry, or extension build is not required for this
repository-contained plugin. Teammates use VS Code's plugin update mechanism;
see the README. Do not edit an installed plugin cache to contribute changes.

## Add another plugin

Create `plugins/<plugin-name>/plugin.json` and its own `skills/` folder. Copy the
existing manifest structure, then add a marketplace entry pointing to
`./plugins/<plugin-name>`. Keep its name and version consistent across both
manifests and add it to the README catalog.

Use another plugin when the team needs an independently installable bundle.
Keep broadly useful shared skills in `team-core`.

## Validation scope

The validator checks catalog entries, plugin identity and version consistency,
the supported manifest fields, skill names and descriptions, invocation flags,
nonempty instruction bodies, and inline relative Markdown resource links inside
skill folders. It requires every plugin directory to have a catalog entry.

It is a repository convention check, not a complete YAML/Markdown parser or an
official client conformance test. Use inline Markdown links for bundled resources;
reference-style links and runtime tool availability require manual review.
