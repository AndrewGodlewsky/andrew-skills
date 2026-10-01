# caveman-compress

Compress a selected natural-language memory or todo file into shorter prose,
with an out-of-tree readable backup and structural validation. The source is
replaced on success. Read [SKILL.md](SKILL.md) for the workflow and intended
preservation rules, and [SECURITY.md](SECURITY.md) for provider and file effects.

## Run

Requires Python 3.10+ and either an authenticated `claude` CLI, or the `anthropic`
Python package with `ANTHROPIC_API_KEY`. From this skill directory:

```sh
python3 -B -m scripts "<absolute_filepath>"
```

Use `python` when that names the local Python 3.10+ executable. The module
[entry point](scripts/__main__.py) invokes the [CLI](scripts/cli.py). A missing
argument prints usage and exits 2. Unsupported files skip with exit 0; successful
compression also exits 0. Core refusal/validation exhaustion exits 2, exceptions
exit 1, and an interrupted core operation exits 130. Inspect the message as well
as the exit code.

Supported prose extensions are `.md`, `.mdc`, `.markdown`, `.rst`, `.txt`, `.typ`,
`.typst` and `.tex`. Extensionless files use content heuristics. Known build
filenames, code/config, unknown extensions and `*.original.md` skip. Strict UTF-8,
a 500,000-byte maximum and sensitive-path heuristics apply.

## Backup recovery

Backups live at `<data-root>/caveman-compress/backups/<parent-name>/<stem>.original.md`.
Windows uses `LOCALAPPDATA`, falling back to the user's `AppData/Local` directory.
Other platforms use `XDG_DATA_HOME`, falling back to `~/.local/share`.
The reported backup is the exact pre-compression bytes, separate from the live
file so an agent's file loader does not also load it.

An existing backup blocks another run, including when unrelated paths share the
same parent-directory name and stem. Editing that backup and running the skill
does not re-compress it; backup-named inputs skip.

For a requested restoration, inspect the backup and live diff, then copy the
backup bytes to the live path, preserving the backup. For requested recompression,
first preserve any desired current version, restore or edit the live file, and
move the previous backup to a distinct archival name before running again. Ask
when the version to restore is ambiguous. Do not delete the only readable copy.

Ordinary validation exhaustion removes staging and the newly created backup,
leaving the original unchanged. Exceptions or cancellation can leave backup,
staging or temporary files; inspect these before retrying or cleaning up.

## Actual checks

The [orchestrator](scripts/compress.py) masks code and separates frontmatter for
initial compression. It saves/verifies a backup, stages output, validates, then
atomically replaces the source. It performs two validation attempts with at most
one repair call. A repair with changed frontmatter is rejected. Recognized code
markers must survive the initial call exactly.

The [validator](scripts/validate.py) checks heading text/order, extracted code
blocks, URL sets, definite lost paths and lost inline-code occurrences. Heading
levels, bullet counts and some added paths/code only warn. Full semantics,
numeric values, names, tables, list nesting and every Markdown syntax are not
validated. Warnings do not block replacement. Compare the result with the backup
before relying on it. A pass cannot establish semantic equivalence.

The body must be shorter by stripped character count; this is not a tokenizer
measurement. Mixed line endings normalize to a majority convention, while the
backup retains original bytes. Locking and path restrictions have limits
described in [SECURITY.md](SECURITY.md).

The optional [benchmark helper](scripts/benchmark.py) compares two explicit files:

```sh
python3 -B scripts/benchmark.py original.md compressed.md
```

It uses `tiktoken` if installed (its encoding assets may be required), otherwise
reports word counts as a proxy. Its inherited no-argument fixture mode requires
upstream repository fixtures not included in this package. No inherited benchmark
numbers are presented as GT measurements.

## Provenance

Adapted from [JuliusBrussee/caveman at 2fd153c](https://github.com/JuliusBrussee/caveman/tree/2fd153c67988e980fb0b2455c90832159a6a5a25/skills/caveman-compress),
copyright (c) 2026 Julius Brussee, under the exact bundled [MIT license](LICENSE).
The upstream [licensing scope](https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/LICENSING.md)
classifies skills as MIT; no Engine implementation is included. This independent
GT adaptation does not imply upstream sponsorship.

[Issue #58](https://github.com/AndrewGodlewsky/andrew-skills/issues/58) supplies the
import and review record. All 12 submitted fragments were reconstructed and
verified against its byte/hash manifest before adaptation. GT adds explicit
invocation flags, MIT metadata and initial release 1.0.0; model invocation
preserves requests to compress memory files without naming the skill. GT also
corrects runtime documentation and rejects repair output that changes YAML
frontmatter. Other Python files retain their submitted bytes. Client discovery,
live providers, POSIX locking and multiprocess contention remain unverified.
