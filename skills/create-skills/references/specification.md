# Interview toward a rebuildable specification

Start from the user's actual task and examples. Look up facts in the selected
available sources; ask the user for decisions. Give a recommendation with each
meaningful choice. Group related questions when useful, or slow to one question
when the user prefers. Reuse previous answers; do not require a prescribed number
of rounds. For a complete request, proceed without an artificial interview.

Write enough detail for these topics, using headings that fit the actual skill:

- Intent: who uses it, the recurring problem, desired result and why existing GT
  capabilities do not meet the need. Check the available catalog, state overlap
  or catalog uncertainty, and avoid silently modifying an existing skill.
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

Make defaults visible. Ask about undecided user-impacting behavior; choose routine
implementation details consistent with the agreed intent and record them. The
specification is complete when it can explain intended behavior independently of
generated code, with no known unresolved product decision. This is not a promise
that implementation cannot uncover another question. If it does, resolve the
question and update the specification rather than silently changing the product.

A missing runtime or failing generated script is an implementation finding, not
necessarily a missing requirement. For example, a fully specified output with
“Node unavailable; structural check not run” is valid review intake. “Decide later
whether the skill sends the email” is an unresolved consequential requirement.

Preserve the specification as its own artifact. Then attempt the complete package
and review it against that specification. The issue must expose each independently
so a maintainer can replace the generated implementation without losing intent.
