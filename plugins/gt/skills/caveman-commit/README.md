# caveman-commit

Terse Conventional Commits. Why over what.

## What it does

Generates commit messages in Conventional Commits format. Aim for a subject ≤50 chars, hard cap 72. Imperative mood. Add a body for non-obvious rationale, migration notes or linked issues. A body is always required for breaking changes, security fixes, data migrations and reverts. Omit AI attribution unless the user's rule requires a trailer; permit project-required emoji.

Outputs only the message. Does not stage, commit, or amend.

## How to invoke

```
/caveman-commit
```

Also triggers on phrases like "write a commit", "commit message", "generate commit".

These phrases describe intended selection; the package does not register slash
aliases. Use the skill name exposed by your client. Fresh-client discovery and
alias support remain unverified.

Supply the diff or a change description and any needed rationale, project
conventions, issue references and attribution rules. Missing, ambiguous or
unreadable context prompts a request for the intended input before drafting.

## Example output

Diff: new endpoint for user profile.

```
feat(api): add GET /users/:id/profile

Mobile client needs profile data without the full user payload
to reduce LTE bandwidth on cold-launch screens.

Closes #128
```

Diff: breaking API rename.

```
feat(api)!: rename /v1/orders to /v1/checkout

BREAKING CHANGE: clients on /v1/orders must migrate to /v1/checkout
before 2026-06-01. Old route returns 410 after that date.
```

## See also

- [`SKILL.md`](./SKILL.md) — full LLM-facing instructions
- [Caveman README](https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/README.md) — repo overview

## Provenance and GT adaptation

Adapted from [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/skills/caveman-commit/SKILL.md), copyright (c) 2026 Julius Brussee. The local SKILL.md and README.md matched this upstream revision byte for byte.

The skill is covered by the [MIT license](LICENSE); upstream [licensing scope](https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/LICENSING.md) classifies skills/ as MIT. This independent GT adaptation does not imply upstream sponsorship.

GT changes: one-line description, explicit user/model invocation flags, license metadata, release 1.0.0, this provenance notice and a repaired repository-overview link. Integration clarifies prerequisites and missing-context handling, makes the mandatory-body precedence explicit, and aligns this overview with the operational rules. Model invocation is an exception to GT's manual default to retain phrase-based selection alongside user invocation; it grants no repository-write authority. Review and verification are recorded in [issue #55](https://github.com/AndrewGodlewsky/andrew-skills/issues/55).
