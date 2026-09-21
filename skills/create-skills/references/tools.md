# Local tools and checks

Resolve [the entry point](../scripts/run.mjs) from this installed package, including
spaces. Its adjacent modules are required. Node 22+ is needed for these local
tools; missing Node means a check is not run, not a blocked issue submission.
Do not install runtimes implicitly or switch environments after a security stop.

Use a structured process API: executable `node`, an argument array, `shell: false`,
and captured stdout/stderr. `check` takes one selected package directory:

```text
node <absolute-entry-point> check <absolute-draft-directory>
```

The JSON result names exact files/hashes and the maintained rules version. The
checker reads only bounded regular files, rejects redirects/unsupported entries,
and never executes package code. Coverage is GT metadata/header format and
supported inline resource links in SKILL.md. Review links in other resources,
script imports, external dependencies, behavior and invocation separately. Bounds
are 100 files, 2 MiB per file, 8 MiB total and 12 nested directories. Unsupported
paths or larger packages need a reported limitation, not truncated input.

For data-driven preparation and installation commands described in their branch
guides, pass one JSON object on UTF-8 stdin. If only shell tools exist, write JSON
as data in an authorized temporary file, then use a fixed Node launcher with an
argument array and `input: readFileSync(requestPath)`. Issue content is never shell
source or command-line arguments. Use the selected shell's proper path quoting.
Remove only the task-owned temporary input when finished; retain user artifacts.

Build a check report with the request, expected result, actual result/status and
package identity. Attempt applicable checks with available tools and actual
authority. Avoid running scripts from an unreviewed draft merely to validate its
structure. Fix feasible defects and report any remaining failed/unrun checks.
The issue may still be submitted with the specification, explicit unresolved
intent and those findings.
Security denials remain stops, not ordinary unavailable-test results.
