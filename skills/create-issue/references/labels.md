# Existing label selection

Read when the caller requests labels or supplies enough context to select one.
Labels describe the material; they do not impose an issue-body format.

| Label | Meaning |
| --- | --- |
| `new-skill` | Propose adding a skill to GT. |
| `enhancement-skill` | Propose a change or improvement to an existing GT skill. |
| `inconsistent-skill` | Report confusing, inconsistent or unexpected behavior in an existing GT skill. |

For other GT work, use appropriate descriptive labels already in the live
catalog, such as `bug`, `documentation`, `enhancement`, `question` or
`accessibility`, when their meaning fits the supplied context. Do not force a
skill label onto unrelated GT infrastructure work, attach workflow labels just
because they exist, or invent a label. More than one relevant label is allowed.
If context is insufficient, omit optional labels or return the gap to the caller.

The helper checks the existing catalog and ownership/capability, preserves
unrelated labels, and reports labeling separately from content creation. Missing
labels or incomplete visibility do not justify another issue creation. This
skill never provisions labels. Maintainer setup is separate.
