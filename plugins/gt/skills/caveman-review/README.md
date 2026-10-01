# caveman-review

One-line PR comments. Location, problem, fix. No throat-clearing.

## What it does

Generates code review comments in `L<line>: <severity> <problem>. <fix>.` format. One line per finding. Severity emoji: 🔴 bug, 🟡 risk, 🔵 nit, ❓ question. Drops "I noticed that...", hedging, and restating what the diff already shows. Keeps exact line numbers, backticked symbols, and concrete fixes.

Auto-clarity: drops terse mode for CVE-class security findings, architectural disagreements, and onboarding contexts where the author needs the *why*. Resumes terse for the rest.

Output only — does not approve, request changes, or run linters.

## How to invoke

```
/caveman-review
```

Also triggers on "review this PR", "code review", "review the diff".

## Example output

```
L42: 🔴 bug: `user` can be null after `.find()`. Add guard before `.email`.
L88-140: 🔵 nit: 50-line fn does 4 things. Extract `validate`/`normalize`/`persist`.
L23: 🟡 risk: no retry on 429. Wrap in `withBackoff(3)`.
L107: ❓ q: why drop the cache here? Reads on next request will miss.
```

## See also

- [`SKILL.md`](./SKILL.md) — full LLM-facing instructions
- [Caveman README](https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/README.md) — repo overview

## GT provenance

Imported from [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/skills/caveman-review), copyright (c) 2026 Julius Brussee, under the bundled [MIT license](LICENSE). [Upstream licensing scope](https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/LICENSING.md) classifies skills/ as MIT. The intake recorded an exact source match to that pinned revision; GT adaptations are listed below. This independent adaptation does not imply upstream sponsorship.

GT adds explicit invocation flags, MIT metadata, release 1.0.0 and provenance; repairs the repository-overview link; clarifies missing/inaccessible context and no-findings handling; and aligns examples with the existing backticked-symbol rule. Both invocation routes preserve the source's phrase triggers as an exception to GT's manual default. Alias and client discovery support require client verification. Review evidence and the exception rationale are recorded in [issue #56](https://github.com/AndrewGodlewsky/andrew-skills/issues/56).
