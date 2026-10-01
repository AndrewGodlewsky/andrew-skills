# Runtime and data flow

This helper overwrites the user-selected file only after creating an exact-byte
backup and validating a staged candidate. Read [backup recovery](README.md#backup-recovery)
when restoring a file or preparing a deliberate second compression.

## Provider

File content is sent to a Claude provider. Initial compression excludes recognized
frontmatter and masks code blocks; a repair prompt contains the full original,
current candidate and errors, including code and frontmatter. Only process
content the user is authorized to send. Filename guards are heuristics, not
secret detection or content sanitization.

With `ANTHROPIC_API_KEY` set and the `anthropic` package importable, the helper
uses its SDK, `CAVEMAN_MODEL` (default `claude-sonnet-4-5`), 8192 maximum output
tokens and a 300-second call timeout. Import failure falls back to the `claude`
CLI; other SDK failures propagate. Without that SDK route, it invokes the
configured CLI using a fixed argument list (`--print --setting-sources ""
--strict-mcp-config`) and UTF-8 stdin/stdout. No shell interpolation is requested.
The CLI needs its own working authentication; desktop login equivalence is not
assumed. SDK/CLI configuration and service behavior are external dependencies.
Provider use can incur charges; credentials are not bundled.

## Files and locking

The helper reads the selected source, creates an application-data backup and lock,
and uses sibling staging and temporary files for atomic writes. The Python
runtime and external provider tools can access their own dependencies/configuration.
The CLI may read extensionless inputs during type detection before core guards.
Core checks refuse files over 500,000 bytes, sensitive-looking paths, invalid UTF-8,
empty bodies and existing backups. These checks are not a filesystem sandbox.

Locks use `msvcrt` on Windows and `fcntl` on POSIX, keyed by backup identity
(parent-directory name and source stem). Colliding identities serialize and then
refuse an existing backup. Contention waits up to 900 seconds. Unsupported locking
can warn and continue without coordination; symlink defenses are best-effort.
Avoid simultaneous writers. Atomic replacement does not protect against a separate
editor changing the source while a model call runs.

Ordinary validation exhaustion removes staging and the new backup. Exceptions or
interruption may retain auxiliary files. Inspect source and backup before cleanup.
Structural checks do not prove semantic equivalence; their limits are documented
in [SKILL.md](SKILL.md). No historical third-party security rating is claimed as a
verified assessment of this GT package.
