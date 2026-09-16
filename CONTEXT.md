# GT skills

A team-maintained collection with independently versioned skills and optional user-owned historical copies.

## Language

**GT collection**:
The current team-distributed collection, updated as one plugin. Its skills can have different release versions.

**Personal skill copy**:
A user-owned copy initially exported from a complete historical skill release, outside the GT plugin. The user may edit it freely; the team tooling stops managing it after creation and never imports those edits into the repository.
_Avoid_: Managed pin, GT archive plugin

**Personal skill name**:
The source name followed by its origin version in the form `grill-me-v1-2-0`. Only exported personal copies use this form; names inside the GT collection stay unchanged.

**Skill release**:
A published snapshot of one skill, labeled with an independent three-part version and including its instructions, supporting resources and release note. A returning skill restarts its numbering, so its name and version alone need not identify a unique historical release.

**Release note**:
A short user-facing explanation of what changed in a skill release. It differs from the skill description, which explains when to use the skill.

**Release catalog**:
The record of available skill releases, their version identifiers, release notes, and exact source snapshots.
_Avoid_: Team recommendation profile

**Source snapshot**:
The complete files for one skill at a specific Git commit and folder path. Different skill releases may refer to the same commit while identifying different folders.

**Latest release**:
The most recently published release of a skill, determined by publication order rather than the largest version number across removals and returns.

**Installed version**:
The skill release present in the GT collection, or the recorded origin version of a personal copy. An origin version does not prove a personal copy is unmodified or identify instructions already loaded into an existing chat.

**Skill installation**:
A user's collection in one environment, used across projects in that environment. Windows and each WSL environment have separate installations.

**Restoration**:
Creating a personal copy from an earlier skill release without replacing the corresponding skill in the main GT collection. The supported workflow keeps one personal copy per source skill and leaves existing files to the user.
_Avoid_: In-place rollback

**Retired skill**:
A skill the team has removed from its actively distributed collection; historical releases can still be exported as personal copies.

**Returning skill**:
A previously removed skill reintroduced under the same name, starting again at `1.0.0`. Its return does not migrate or replace existing personal copies.

