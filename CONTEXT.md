# GT skills

A team-maintained collection with independently versioned skills and optional user-owned historical copies.

## Language

**GT Help**:
A user-invoked guide to the GT marketplace, skills and workflows that answers questions and recommends next steps without performing those steps. It is not available for model invocation.
Scope: [Plan GT Help as a user-invoked marketplace and skills guide](https://github.com/AndrewGodlewsky/andrew-skills/issues/64).

**GT collection**:
The current team-distributed collection, updated as one plugin. Its skills can have different release versions.

**GT troubleshooting guide**:
Documentation available outside the installed GT collection that helps a user investigate why an installed GT skill cannot be found or invoked. Agent-assisted installation is a separate, deferred concern.
Scope: [Choose GT diagnostic delivery, scope and evidence boundaries](https://github.com/AndrewGodlewsky/andrew-skills/issues/75).
_Avoid_: Diagnostic skill, setup agent

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

**GT installation target**:
The particular installed GT collection selected for an update or status request. Several copies may coexist; selecting one does not establish which instructions an existing chat retains.

**Installation owner**:
The client that manages a GT installation, such as Copilot CLI or VS Code. Another client may use that same installation without becoming its owner.

**Restoration**:
Creating a personal copy from an earlier skill release without replacing the corresponding skill in the main GT collection. The supported workflow keeps one personal copy per source skill and leaves existing files to the user.
_Avoid_: In-place rollback

**Retired skill**:
A skill the team has removed from its actively distributed collection; historical releases can still be exported as personal copies.

**Returning skill**:
A previously removed skill reintroduced under the same name, starting again at `1.0.0`. Its return does not migrate or replace existing personal copies.

**Skill submission**:
A user's proposed skill idea, completed draft or variation, change request, or feedback about confusing skill behavior, offered for maintainer consideration. A submission is not yet an accepted part of the GT collection.

**Submission caller**:
A skill that supplies the title and body of an issue for the GT repository, including its content and structure. Its work may concern proposals, feedback, planning or other work for this repository. The shared submission skill does not take over that content creation.

**Calling agent**:
The agent carrying out the submitting workflow. It receives missing-input guidance and submission results from the shared capability and decides when the workflow needs human input.

**Own-authored issue**:
An issue submitted by the currently authenticated GitHub user. Assignment, repository ownership or permission to edit someone else's issue does not make it own-authored.

**Submission skill**:
The shared GT capability that creates caller-authored issues exclusively in AndrewGodlewsky/andrew-skills, supports authorized follow-up comments, and applies agreed title/body edits and labels only to own-authored issues. Native relationships are deferred. It uses existing workflow authorization, asks when authorization is missing, and does not impose a body template, submit unrelated work or act as a general repository issue manager.

**Issue organization**:
Repository metadata and relationships used to organize issues, such as labels, project membership, parent/child relationships and blocking dependencies. This is separate from the caller-authored issue title and body.

## Skill map language

Scope discussion: [issue #51](https://github.com/AndrewGodlewsky/andrew-skills/issues/51).
Recording and verification: [issue #52](https://github.com/AndrewGodlewsky/andrew-skills/issues/52).

**Simple skill map**:
A view showing every skill and its actual dependencies on other skills, including skills with no dependencies. Recommendations and casual mentions are excluded.

**Expanded skill map**:
A broader view that includes skill dependencies and actual dependencies on shared resources, such as scripts and guidance.

**Skill dependency**:
A relationship in which one skill's workflow uses and relies on another skill, including use limited to a particular branch. Merely recommending or mentioning another skill does not establish a dependency.

**Conditional skill dependency**:
A skill dependency used only under a stated condition, such as submitting feedback. It remains part of the simple skill map, with its condition retained.

**Skill map source**:
The current repository working files, including local edits, from which the map is derived. The map identifies that source state explicitly; it does not imply the same state is published or installed.

**Direct caller**:
A skill whose workflow uses another skill directly. In the map, A -> B means A relies on B, so A is a direct caller of B.

**Indirect caller**:
A skill that relies on another skill through one or more intermediate skills. In A -> B -> C, A is an indirect caller of C.

**Review impact**:
The direct and indirect callers that may need review when a dependency changes, with their dependency paths and conditions retained. In the expanded map this also includes consumers of changed shared resources; inclusion indicates potential impact, not proven breakage.

**Missing dependency target**:
A referenced dependency that cannot be resolved in the map's source. References left behind after a rename remain visibly unresolved rather than being silently redirected to a guessed replacement.

**Dependency cycle**:
A chain of dependencies that returns to a skill already on the path, such as A -> B -> A. The map shows the cycle explicitly rather than hiding it.

**Dependency record**:
An explicit repository-owned declaration of a dependency, supported by the skill instructions and maintained by the agent adding or changing the skill. Automated checks flag missing or stale information; discovering a skill in the inventory does not establish that its dependency records are complete.

**Dependency evidence**:
A source-file reference and short quoted instruction supporting a dependency and its conditions. Current line links are derived from the source; missing or changed supporting text calls for review rather than silently preserving an unsupported claim.

**Dependency review status**:
Whether a skill's dependencies have been reviewed against its current instructions and relevant resources. New or changed sources need review; an empty dependency list alone does not mean the skill has been reviewed and has none.

**Dependency candidate**:
A possible dependency reference awaiting classification, kept separate from asserted dependency edges. The authoring agent resolves it from context or leaves it visibly unresolved for maintainer input when genuinely ambiguous.

**Dependency exclusion**:
A reviewed candidate that does not establish a dependency, with its supporting context and reason retained. A changed context requires reviewing the classification again.

**Shared-source provenance**:
The relationship between a maintained source, its generated copies and the skill packages consuming it. Generated copies do not count as independently authored sources, while each genuine consumer remains represented.
