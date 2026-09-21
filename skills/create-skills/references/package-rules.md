# GT package rules

Generated from the canonical authoring guide; edit its source, then rebuild.
These are repository adoption rules. Failed/unrun checks do not block issue intake.

## Skill standard

Each active skill lives in `skills/<name>/` and contains `SKILL.md` and
`release.yaml`. Source names use lowercase letters, numbers and single hyphens,
match the folder, and contain neither a plugin prefix nor a release suffix.
Only add `scripts/`, `references/`, `templates/` or `assets/` when used.

The supported `SKILL.md` header has these fields:

| Field | Rule |
| --- | --- |
| `name` | Required nonempty string matching the source folder, up to 64 characters. |
| `description` | Required string of 1–1024 characters explaining the useful task and when to invoke it. |
| `user-invocable` | Required boolean; `true` by default. |
| `disable-model-invocation` | Required boolean; `true` by default. |
| `argument-hint` | Optional nonempty string when useful for supplying inputs. |
| `license` | Optional nonempty string when applicable. |

Keep values on one physical line. The lightweight header parser supports plain
strings, JSON-style double-quoted strings, YAML single-quoted strings and
boolean flags. Quote numeric, boolean or null text used as a string; invocation
flags must be the unquoted lowercase `true` or `false`. Unknown or misspelled
keys are rejected. Another field requires
an explicit reviewed standard and validator change, with its purpose and
intended-client support documented in the change record.

GT defaults to manual invocation: both flags are `true`. A reviewed exception
can set `disable-model-invocation: false`; keep user invocation available unless
a separate reviewed reason supports hiding it. The validator permits both
invocation routes or either route, and rejects `user-invocable: false` together
with `disable-model-invocation: true`. A valid combination does not establish
that an exception is justified or that a client implements it. Flags do not
authorize tools or actions. Do not use tool-allowance or agent-specific metadata
as a substitute for documenting prerequisites.

The body must explain the needed inputs, essential behavior and useful result.
Include missing-input handling, prerequisites, consequential actions, necessary
user choices and failure/cancellation boundaries when relevant. No fixed
headings, workflow engine, line limit or empty scaffolding is required.

Bundle required runtime resources inside the skill folder, reference them with
inline relative Markdown links and explain when to read them. Do not depend on
personal absolute paths or undeclared skills. Review external tools/services and
dependencies tied to another skill's name or plugin location: renaming a folder
does not make those portable. A heading is not a loading boundary, and a bundled
reference does not guarantee a fixed context saving. Keep review-only evidence
outside the distributed skill by default. Include an example inside the skill
only when it helps execution.

Keep applicable attribution and license terms for imported material and record
adaptations in the README's provenance section. A submitted draft is not proof
of permitted reuse, successful execution or client compatibility.

## Release metadata

The supported metadata format is deliberately small: exactly these two keys,
each with a nonempty quoted string on one physical line. Use JSON-style double
quotes, or YAML single quotes with an embedded apostrophe doubled. Blank lines
and full-line comments are allowed. Plain values, duplicate or unknown keys,
inline comments, multiline scalars, collections, tags and anchors are rejected.
Versions use three integers without leading zeroes, prerelease or build suffixes.
Keep notes short and focused on the user-visible change.

Start new and returning skills at **`1.0.0`**. Numbered history begins with the first
metadata-complete release; do not invent versions for older unversioned snapshots.
Use patch increments for fixes/clarifications preserving documented usage, minor
increments for compatible additions, and major increments for incompatible
changes to commands, inputs, required tools or documented workflow/output promises.
Use the largest applicable increment and reset lower components accordingly.
Authors/agents propose the category; review verifies its meaning. CI checks
structure and consistency without a model deciding semantic compatibility.
Changing one skill must not assign new versions to unchanged skills. Every
published skill correction, including a typo or release-note correction, gets a
new version. A note-only correction requires the next patch version. Draft PR
edits do not each create a published release.
