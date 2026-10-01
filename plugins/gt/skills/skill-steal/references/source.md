# Inspect and preserve the source

Inspect only the selected package and directly relevant references in authorized
scope. A pointer outside the package identifies a dependency; it does not grant
access to unrelated directories. Resolve external resources explicitly, asking
when their identity or access scope is unclear. Report missing resources,
redirected paths, platform assumptions and tools without executing source code.

Record origin, version when available, attribution, notices and applicable reuse
terms. Local availability is not permission to republish. Inventory required
files, referenced templates/assets and script imports. Record hashes of source
bytes before adaptation using permitted read-only tools, including authorized
external resources separately. Do not force an arbitrary source through the GT
checker: its directory naming, file types or metadata may not meet GT rules yet.
If a full inventory/hash cannot be captured, state that evidence limit.

Resolve the source and proposed draft locations, including redirects, before
writing. Use a fresh destination outside the source tree and managed caches;
never overwrite an existing destination. Keep review evidence outside the runtime
skill folder. Preserve the exact original and its notices. After adaptation,
compare the original inventory and hashes, including additions/deletions; report
any difference and stop claiming the original is unchanged. Do not restore or
overwrite concurrent user edits. If the source changed during the work, reconcile
the version being imported before claiming the draft represents that source.

Follow relevant references when reconstructing the behavior contract. Removing
tool-allowance metadata, renaming an entry point, changing model invocation,
substituting a helper or embedding another skill's instructions can change the
contract. Identify these effects, preserve supported semantics, and use Grill Me
for consequential choices. Propose supported GT invocation exceptions for review;
do not silently erase the original trigger behavior to meet manual defaults.
Unknown client-specific fields cannot simply be retained in a GT header either.

Check the selected GT catalog for naming conflicts. If the proposed name already
exists, report that fact and clarify a distinct name or retain the import as an
unresolved proposal. Do not edit the existing skill, silently rename a name-bound
dependency, or invoke another workflow without the user's intent. Catalog checks
are limited to the identified installation; record that limit for maintainers.

Preserve applicable licenses and attribution with the adapted package and propose
README provenance text in the handoff. If redistribution permission is unclear,
withhold the affected content and explain the gap; a safe specification can still
be submitted. Do not copy protected source text into that specification as a
substitute for withheld files.

Before preparation, review every outgoing file and evidence section for secrets,
private data and identifying local paths. If anything must be withheld, build a
separate shareable draft containing only reviewed files, or omit packageDirectory
for a specification-only submission. The preparer includes all regular files in
its input directory, not just those linked by SKILL.md. Never point it at the
original, an unreviewed draft, or a directory still containing withheld files.
Explain omitted resources and changed/redacted behavior. Retain private evidence
locally and do not label a sanitized partial package complete.
