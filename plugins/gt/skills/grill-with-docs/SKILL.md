---
name: grill-with-docs
description: Sharpen a plan or design through an interview while recording agreed domain terms and architectural decisions.
user-invocable: true
disable-model-invocation: true
---

Combine the **GT grilling** interview with **GT domain-modeling** in the target
repository. Use the supplied plan, decision or repository-documentation goal and
previous answers. Ask for the topic or target repository if either is missing
and cannot be established from the conversation.

Before starting, resolve and invoke both enabled dependencies, `grilling` and
`domain-modeling`, from the same selected GT installation using the client's
skill mechanism. Pass the topic, target repository, known facts, previous answers
and open decisions to both. Do not substitute a personal skill with the same name.
If either dependency is missing, disabled or ambiguous, identify it and stop the
composed workflow, preserving the supplied context. Both must be loaded before
interviewing or writing documents; loading one does not complete this step.

Apply both disciplines throughout the same session: Grilling orders questions
by their decision prerequisites; Domain Modeling challenges vocabulary, records
terms as they are agreed and offers ADRs for qualifying decisions. Follow the
user's requested question pacing when supplied. Reading the repository and
writing its domain documents require the corresponding file access; if unavailable,
explain the limitation and return proposed document text without claiming a save.

Agreed glossary entries and accepted ADRs are the documentation this invocation
requests during the interview. They may be written as decisions settle; implementing
the proposed plan still waits for confirmed shared understanding and applicable
action authorization. On cancellation, stop and preserve already confirmed edits.
At the end, report the documents actually changed and any unresolved decisions.

Adapted from Matt Pocock's `grill-with-docs`. Preserve the bundled
[MIT notice](assets/matt-pocock-license.txt) when copying or redistributing this skill.
