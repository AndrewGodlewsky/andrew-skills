# Interview toward a rebuildable specification

Start from the user's actual task and examples. Look up facts in the selected
available sources and pass them, prior answers and the topics below to the
selected GT grill-me dependency using the [intent guide](intent-capture.md).
Grill Me owns the questions, recommendations, one-at-a-time pacing and confirmation
of shared understanding. Complete initial context needs no redundant questions,
but still needs that confirmation before the caller resumes.

Write enough detail for these topics, using headings that fit the actual skill:

- Intent: who uses it, the recurring problem, desired result and why existing GT
  capabilities do not meet the need. Check the available catalog, state overlap
  or catalog uncertainty, and avoid silently modifying an existing skill.
  Catalog overlap is context for the maintainer, not a verdict on the idea's merit.
- Invocation: when to start, required and optional input, what may be discovered,
  and how missing, contradictory or unreadable input is handled.
- Behavior: ordered steps, consequential choices, exact useful outputs and
  observable completion criteria. Include a representative input/output pair.
- Boundaries: non-goals, limits, cancellation, failure paths, private data and
  external writes. Explain actual authorization and prerequisite requirements.
- Dependencies: necessary tools, services, resources and other skills, how to
  resolve them, and the result when they are absent or unavailable.
- Acceptance: normal use, missing input and a relevant failure/edge case with
  expected observations. Separate expectations from tests actually performed.

Make defaults and interpretations visible. Choose routine implementation details
consistent with the supplied intent and record them. Cover each applicable topic
with a decision, non-goal, supported fact or explicit unresolved question. The
specification must explain settled intent independently of generated code and
identify what the maintainer still needs to clarify. Unresolved intent does not
block intake. If implementation uncovers ambiguity, update the record and scope
of the attempt rather than silently choosing consequential behavior.

A missing runtime or failing generated script is an implementation finding, not
necessarily a missing requirement. For example, a fully specified output with
“Node unavailable; structural check not run” is valid review intake. “Decide later
whether the skill sends the email” is an unresolved consequential requirement;
record it for maintainer follow-up. Implement useful settled portions independently,
or skip implementation with a reason when that decision determines core behavior.

Preserve the specification as its own artifact alongside the intent recap and
interview record. Review the attempt against the settled specification and disclose
unimplemented or unresolved behavior. The maintainer must be able to compare the
specification with the requester's words and replace the generated implementation
without losing intent; an agent interpretation is not evidence of user agreement.
