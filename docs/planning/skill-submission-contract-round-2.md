# Shared issue creation — Round 2: repository organization

Issue: [Define the shared issue-creation and organization contract](https://github.com/AndrewGodlewsky/andrew-skills/issues/28).

**Status: owner answer recorded.** The shared skill should apply agreed organization itself when authorized and help create understandable issues with titles, descriptions and identifying labels. The owner invited recommendations for additional useful behavior. Specific policies remain open in [Round 3](skill-submission-contract-round-3.md). The proposal and answer below are preserved as discussion history.

## Your correction

The caller owns the issue's title, body and structure. This shared skill physically creates the issue in the right repository and helps with the repository's labels and potentially projects and relationships. It must serve more than proposals for new skills.

The previous Summary/Details template is withdrawn. There is no required body layout and no submission-type classification. A caller can supply its own planning ticket, investigation, bug report, proposal or other issue concerning this repository. The fixed destination and existing-authorization rules remain unchanged.

I am interpreting “one skill can block another” as GitHub **issues** representing that work being linked with blocking relationships. That is distinct from making one installed skill a runtime dependency of another. Correct this interpretation if needed.

## Proposed division of responsibility

| Caller | Shared issue-creation skill |
| --- | --- |
| Supplies the exact title and Markdown body. | Preserves that content and creates the issue only in AndrewGodlewsky/andrew-skills. |
| Explains the purpose and supplies any intended relationships, such as “this issue depends on that issue.” | Knows the repository conventions, checks referenced issues, and applies supported organization when authorized. |
| Owns the substantive reasoning and any missing content. | Reports the created issue link and separately reports any organization that could not be completed. |

Recommendation: make this capability perform the agreed organization itself when available and authorized, and provide precise guidance when it cannot. Do not require every future caller to reimplement the GitHub operations or know the exact label spelling.

This is a proposed responsibility boundary. It does not yet settle how labels are selected, which project is allowed, whether a single call creates multiple issues, or recovery after partial success. Never infer a blocking relationship merely because two issues sound related. Project membership must not introduce a caller-configurable write destination outside the agreed scope.

## What exists already

The repository currently has labels including `bug`, `enhancement`, `documentation`, `question`, and `wayfinder:map`, `wayfinder:research`, `wayfinder:grilling`, `wayfinder:prototype`. These are observed labels, not a complete selection policy. Labels such as `duplicate`, `invalid` and `wontfix` also exist; their presence does not authorize this skill to make maintainer decisions.

This planning map already uses native parent/child and blocking relationships. Project configuration has not been inventoried. Availability to the owner does not prove that ordinary plugin users can apply the same metadata.

The earlier transport research covered title/body creation. [Verify labels, projects and issue relationships for shared issue creation](https://github.com/AndrewGodlewsky/andrew-skills/issues/32) now tracks the focused follow-up needed before the implementation contract is finalized. In particular, an issue may be created even when a later organization step cannot be completed. We must report that accurately and avoid creating another issue just to retry metadata.

## One question for this round

**Should this shared skill apply the agreed labels and issue relationships itself when authorized, returning precise guidance when it cannot, or should it only explain the conventions and leave those operations to the calling skill?**

Recommendation: apply them itself when authorized. That keeps the GitHub mechanics in one reusable place. This does not authorize inventing relationships, creating labels/projects or changing repository settings.

### Your answer
Yeah, I think it's totally fine if it applies them itself. What I need this skill to do is actually help with the creation of the GitHub issue itself and ensure that it follows the guidelines for GitHub issues for this repo. As in, it has a title, a description, and labels to identify it.

I would be open to you thinking about and coming up with, and proposing to me, some ideas around what else this skill should do, because I really just want this to be very flexible. I want to ensure that issues, when they're created, are standardized and are going to be nice for me to understand what they are, so that I can review them quickly and easily, or have another agent do so. 
<!-- Write your answer here, or answer in chat. -->
