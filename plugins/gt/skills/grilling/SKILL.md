---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
user-invocable: true
disable-model-invocation: false
---

Use the supplied plan, decision or idea and any previous answers. If no topic is
available, ask for it before starting. Honor the user's requested question pacing
when supplied; otherwise use the rounds below.

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), use a read-only sub-agent when delegation is available and authorized, or inspect it yourself. Don't block independent questions on a running exploration: it is an unsettled prerequisite, so only questions downstream of it wait for the result. If access is unavailable, state the missing evidence and request only what is needed to resolve it. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.

Summarize the settled decisions for that confirmation. Recording agreed terms or
decisions through a caller's requested documentation workflow is permitted during
the interview; it does not authorize implementing the plan. If the user pauses
or cancels, stop and identify unresolved branches rather than inventing answers.

Adapted from Matt Pocock's `grilling`. Preserve the bundled
[MIT notice](assets/matt-pocock-license.txt) when copying or redistributing this skill.
