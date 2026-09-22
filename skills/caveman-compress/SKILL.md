---
name: caveman-compress
description: "Compress a memory file such as CLAUDE.md or a todo list into caveman format to save input tokens, keeping a readable backup. Trigger: /caveman-compress."
user-invocable: true
disable-model-invocation: false
license: MIT
---

# Caveman Compress

## Purpose

Compress natural language files (CLAUDE.md, todos, preferences) into caveman-speak to reduce input tokens. Compressed version overwrites original. Human-readable backup saved as `<filename>.original.md`, but NOT beside the source file — it lives in an out-of-tree data dir (`$XDG_DATA_HOME/caveman-compress/backups/<parent-dir-name>/`, or `%LOCALAPPDATA%\caveman-compress\backups\<parent-dir-name>\` on Windows) so skill auto-loaders don't re-ingest it as a live file.

## Trigger

`/caveman-compress <filepath>` or when user asks to compress a memory file.

## Process

1. Use the file explicitly selected by the user. If no path is supplied or the
   intended file is ambiguous, ask for it. Resolve it to an absolute path.
2. Requires Python 3.10+ and an already configured Claude provider. Read the
   [runtime/data-flow notes](SECURITY.md) before running. The contents may be sent
   to Claude, including code and frontmatter during repair, and provider use may
   incur charges. Establish that this data transfer is within the user's request;
   if it is not, stop before invoking the helper. If the provider is unavailable,
   report the prerequisite rather than installing or configuring it automatically.
3. From this skill directory, run the [bundled entry point](scripts/__main__.py):

   ```sh
   python3 -B -m scripts "<absolute_filepath>"
   ```

   Use `python` if that is the local Python 3.10+ executable. Quote the path.
   The CLI detects file type, compresses prose, validates a staged candidate,
   and makes at most one targeted repair call: two validation attempts total.
   A successful candidate replaces the original after an exact-byte backup.
4. Report success or refusal, source/backup paths, and the actual checks. Review
   the resulting diff for meaning, numbers, names, list nesting and table layout;
   the structural validator does not establish semantic equivalence or token
   savings. Report discrepancies instead of treating a validation pass as proof.
   Exit 0 can also mean an unsupported-file skip; inspect the output.

Ordinary validation exhaustion leaves the source unchanged and removes staging
and backup files. A cancellation, provider failure or other exception may retain
auxiliary files; stop and report their paths, checking the source against the
backup before cleanup or another attempt. Do not blindly rerun on failure.

Existing backups stop compression. For deliberate restoration or recompression,
follow [backup recovery](README.md#backup-recovery); never overwrite or discard a
backup to make a retry succeed without the user's request to do so.

## Intended preservation and validation limits

The rules below describe the intended output. The helper protects recognized
frontmatter and code, and checks heading text/order, extracted code blocks,
URL sets, certain lost paths and lost inline-code occurrences. Heading levels,
bullet-count drift and some added paths/code are warnings; warnings do not block
replacement. It does not fully check semantics, tables, list nesting, numbers,
proper nouns or every Markdown form. Frontmatter is removed from the initial
prompt; changed frontmatter in a repair is rejected. Mixed source line endings
are normalized in output; the readable backup retains exact original bytes.

## Compression Rules

### Remove
- Articles: a, an, the
- Filler: just, really, basically, actually, simply, essentially, generally
- Pleasantries: "sure", "certainly", "of course", "happy to", "I'd recommend"
- Hedging: "it might be worth", "you could consider", "it would be good to"
- Redundant phrasing: "in order to" → "to", "make sure to" → "ensure", "the reason is because" → "because"
- Connective fluff: "however", "furthermore", "additionally", "in addition"

### Preserve EXACTLY (never modify)
- Code blocks (fenced ``` and indented)
- Inline code (`backtick content`)
- URLs and links (full URLs, markdown links)
- File paths (`/src/components/...`, `./config.yaml`)
- Commands (`npm install`, `git commit`, `docker build`)
- Technical terms (library names, API names, protocols, algorithms)
- Proper nouns (project names, people, companies)
- Dates, version numbers, numeric values
- Environment variables (`$HOME`, `NODE_ENV`)

### Preserve Structure
- All markdown headings (keep exact heading text, compress body below)
- Bullet point hierarchy (keep nesting level)
- Numbered lists (keep numbering)
- Tables (compress cell text, keep structure)
- Frontmatter/YAML headers in markdown files

### Compress
- Use short synonyms: "big" not "extensive", "fix" not "implement a solution for", "use" not "utilize"
- Fragments OK: "Run tests before commit" not "You should always run tests before committing"
- Drop "you should", "make sure to", "remember to" — just state the action
- Merge redundant bullets that say the same thing differently
- Keep one example where multiple examples show the same pattern

CRITICAL RULE:
Anything inside ``` ... ``` must be copied EXACTLY.
Do not:
- remove comments
- remove spacing
- reorder lines
- shorten commands
- simplify anything

Inline code (`...`) must be preserved EXACTLY.
Do not modify anything inside backticks.

If file contains code blocks:
- Treat code blocks as read-only regions
- Only compress text outside them
- Do not merge sections around code

## Pattern

Original:
> You should always make sure to run the test suite before pushing any changes to the main branch. This is important because it helps catch bugs early and prevents broken builds from being deployed to production.

Compressed:
> Run tests before push to main. Catch bugs early, prevent broken prod deploys.

Original:
> The application uses a microservices architecture with the following components. The API gateway handles all incoming requests and routes them to the appropriate service. The authentication service is responsible for managing user sessions and JWT tokens.

Compressed:
> Microservices architecture. API gateway route all requests to services. Auth service manage user sessions + JWT tokens.

## Boundaries

- ONLY compress natural language files (.md, .mdc, .markdown, .rst, .txt, .typ, .typst, .tex, extensionless prose)
- NEVER modify: .py, .js, .ts, .json, .yaml, .yml, .toml, .env, .lock, .css, .html, .xml, .sql, .sh
- If file has mixed content (prose + code), compress ONLY the prose sections
- If unsure whether something is code or prose, leave it unchanged
- Original file is backed up as FILE.original.md before overwriting — in the out-of-tree backup data dir (see Purpose), not beside the source file
- Never compress FILE.original.md (skip it)
- Known build filenames, code/config and unknown extensions skip. UTF-8 input is required; files over 500,000 bytes and sensitive-looking paths are refused. Filename heuristics do not scan contents for secrets.
