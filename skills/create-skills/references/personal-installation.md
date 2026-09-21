# Optional personal copy

After complete verified issue delivery, ask whether the user wants this skill
installed for personal use. A decline writes nothing. Submission authority alone
does not authorize installation. If no usable package exists, explain that this
branch must first build one; attempt it and report limitations without undoing
the successful issue submission.

Use the ordinary skill name, matching its folder/header. The user owns maintenance
and any future marketplace coexistence. Do not impose a suffix, set up syncing,
remove a future marketplace version or build lifecycle management. An existing
personal destination is a collision to report, not permission to overwrite or
silently rename.

The `install` stdin request is `{packageDirectory, expectedIdentity, approved}`.
Use the latest check report's `identity`, the selected absolute draft directory,
and `approved: true` only after the user's yes. The helper re-reads the package
and rejects changed bytes or structural defects before copying. It resolves the
current process user's home itself; no request field can choose a different home.
Use the intended environment from the start. It stages SKILL.md and publishes it
last without replacing an existing file. The filesystem must support hard links;
an unsupported operation is reported without an overwrite fallback. It leaves
task-owned partial output visible on failure, without automatic deletion/retry.

Read [local tools](tools.md) before running the bundled `install` command. Show the
resolved active user destination, normally `~/.copilot/skills/<name>`. Use the
home of the actual selected environment; WSL and Windows are separate. Include
every resource. Preserve managed plugin caches and other users' files. Missing
essential resources, unsupported paths or unsafe destinations prevent copying.
Report failed/unrun behavior checks; successful copying does not prove behavior.

Add newly built files or substantive corrections to the same issue through
create-issue before copying, under actual authority. A later partial submission
must be resolved before installing an unrecorded package. Check the selected
client's discovery after copying and attempt invocation only with appropriate
authority for what that skill does. Report copied files, discovery and behavior
as separate observations. If the client cannot be checked, say so. Do not promise
that ordinary versus GT-prefixed names resolve identically in all clients.

On cancellation or failure, preserve unrelated files and report any task-owned
partial destination. The helper does not recursively delete or automatically
retry it. A security denial stops the branch; changing target or environment is
not a fallback. Personal installation never publishes to GT or accepts the issue.
