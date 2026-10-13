# Repository foundations for purpose language and acceptance

Research checked October 7, 2026. A repository setup skill should discover and preserve four distinct kinds of knowledge: why the project exists, what its terms mean, how someone starts using it, and which observable behavior a change must deliver. The proposed structure below separates these concerns while allowing small projects to keep them together. These are design recommendations, not a claim that every repository needs four new files.

**Evidence types:** empirical findings describe observed repositories; first-party practices document a tool or author's approach; proposed design describes the suggested setup skill. None of the sources establishes that a particular filename automatically improves coding-agent performance. Tool loading behavior must be configured separately; writing `INTENT.md`, `GLOSSARY.md`, or `spec.md` alone does not establish that an agent reads it.

## Evidence base

1. **Empirical:** [Prana and colleagues, Categorizing the Content of GitHub README Files](https://arxiv.org/abs/1802.06997), first submitted in 2018, manually annotated 4,226 sections from 393 randomly sampled repositories. Descriptions of functionality and usage were common; explanations of purpose and project status were often missing. This supports explicitly checking those omissions, not prescribing a universal template.
2. **Platform practice:** [GitHub's README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) identifies purpose, usefulness, getting started, help, and maintainers as typical contents. GitHub surfaces a README from `.github`, repository root, or `docs`, in that order.
3. **Vendor workflow:** [Anthropic's Capture as intent.md](https://academy.claude.com/courses/ai-native-sdlc-playbook/capture-intent) describes a human-reviewed proto-spec for an idea, ticket, or incident. An `intent/` directory is suggested for one product. This is a change-level workflow convention, not a universal specification for a root `INTENT.md`.
4. **Practitioner concept:** [Fowler on Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html) explains developing shared language with domain experts and using it consistently in discussion and code.
5. **Practitioner concept:** [Fowler on Bounded Context](https://martinfowler.com/bliki/BoundedContext.html) explains that a coherent model has a defined boundary; meanings can differ across contexts and their relationships need explicit treatment.
6. **Documentation framework:** [arc42's glossary guidance](https://docs.arc42.org/section-12/) includes important domain and technical terms, with optional translations, so stakeholders understand words consistently.
7. **Executable authoring practice:** GitHub Spec Kit's [spec template](https://github.com/github/spec-kit/blob/main/templates/spec-template.md) and [clarification workflow](https://github.com/github/spec-kit/blob/main/templates/commands/clarify.md) separate user scenarios, requirements, entities, measurable outcomes, and assumptions; clarification checks missing scope, data, UX, quality, integration, failure, terminology, and completion decisions. These are maintained templates, not empirical proof of effectiveness.
8. **Executable specification practice:** [Cucumber's Gherkin reference](https://cucumber.io/docs/gherkin/reference/) connects an initial situation, an event, and an observable result. Scenarios become executable only when supported by corresponding step definitions and a runner.

## Project intent

**Purpose and creation trigger.** Proposed design: preserve the durable reason for this repository, especially when several plausible implementations would satisfy an immediate feature request but serve different long-term goals. Create a dedicated intent document when scope, priorities, or exclusions would otherwise disappear into chat. A short README purpose section may be sufficient for a small utility. Preserve an existing product brief, charter, or intent record as authoritative rather than generating a competing one.

Anthropic's source describes a different, useful granularity: each proposed change has its own intent record, reviewed by its product owner before progressing. A setup skill should ask whether the user wants durable project intent, change proposals, or both, and make the distinction visible. [Capture as intent.md](https://academy.claude.com/courses/ai-native-sdlc-playbook/capture-intent).

**Proposed content domains:**

- Problem and evidence: today's difficulty, affected people, concrete examples, source links, and assumptions requiring validation.
- Desired outcome: the capability or improvement sought, the main beneficiaries, and how success would be recognized.
- Scope: included work, explicit exclusions, first-release boundary, and relationships to adjacent products.
- Decision priorities: which outcome wins when simplicity, speed, control, extensibility, cost, or accuracy conflict.
- Constraints: externally imposed boundaries, their owners, and the distinction between hard requirements and preferences.
- Open decisions: what remains unresolved, who can resolve it, and which work depends on it.

**Discovery questions.** Who has this problem, and what can they not accomplish today? What observable change would make the project worthwhile? What must it never become? Which attractive feature should be rejected? What commitments already constrain the answer? Who can change the goal?

**Inference boundary.** The skill can extract candidate goals and contradictions from supplied conversations and existing records. It can summarize an explicitly approved decision. It should not silently infer market demand, promised deadlines, numerical targets, stakeholder agreement, or which value wins a trade-off from code alone. Unconfirmed interpretations remain proposals, with their source and uncertainty.

**Minimal outline.** `Purpose → People and problem → Desired outcome → Scope and exclusions → Priorities and constraints → Unresolved decisions → Authoritative links`. Optional metadata identifies owner and status. Illustrative content: “Help volunteer coordinators fill uncovered shifts; payroll and staff performance scoring are outside scope.” This is an example, not an assumed requirement.

**Validation and upkeep.** Ask the owner to test the draft against one desirable and one deliberately rejected feature. Revisit intent when the audience, mission, or material constraint changes. Keep detailed feature acceptance in specs, implementation rationale in ADRs, and contributor procedures in their own guide. A README can summarize the purpose and link to intent; it should not maintain a second set of exclusions.

## Glossary and domain context

**Purpose and creation trigger.** Proposed design: create a glossary when an overloaded word, relationship, lifecycle, or invariant can change behavior. Resolve the first meaningful ambiguity before accumulating a long dictionary. Reuse `GLOSSARY.md`, `CONTEXT.md`, or an existing domain guide. In this repository's domain-modeling convention, `CONTEXT.md` means a glossary; its name must not become permission to add arbitrary project notes.

Shared vocabulary supports communication between developers and domain experts; where meanings differ legitimately, scope the definitions rather than forcing one global interpretation. [Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html), [Bounded Context](https://martinfowler.com/bliki/BoundedContext.html).

**Proposed content domains:**

- Actors and roles: who does what, and distinctions such as person, organization, member, administrator, and service account.
- Business objects: identity, ownership, meaningful relationships, and what makes two instances distinct.
- Lifecycle vocabulary: states, transitions, events, and the difference between an action and its completed result.
- Rules expressed as definitions: invariants and distinctions needed to understand a concept.
- Boundaries and translations: context-specific meanings, synonyms, deprecated terms, external-system mappings, units, and time conventions.
- Examples and counterexamples: one instance that belongs and a similar one that does not.

arc42 includes technical terminology too. Proposed adaptation: include only project-specific technical meanings that readers can realistically confuse; do not reproduce a programming dictionary. [arc42 glossary](https://docs.arc42.org/section-12/).

**Discovery questions.** Does “account” mean a login, customer, or billing relationship? Can one person hold several memberships? Is cancellation reversible? Does “published” mean visible, approved, or delivered? Does a word mean something different in another subsystem? Which terms do domain experts actually use?

**Inference boundary.** Names and schemas reveal candidate vocabulary and implemented relationships. They do not establish that the business meaning is correct. The skill should surface disagreement between code and owner descriptions, not automatically choose the code. Owners resolve business semantics; observed code can be marked as current implementation.

**Minimal outline.** `Scope → Terms → Relationships → Context differences → Unresolved vocabulary`. A useful entry is `Term | Meaning | Scope | Example or distinction`. Example: “Reservation: a temporary claim on capacity; expires unless confirmed. Booking: a confirmed allocation.” For a simple project, prose definitions alone suffice.

**Validation and upkeep.** Walk through counterexamples, plural ownership, duplicates, missing states, and boundary transitions. Search documentation and code for conflicting names. Update the canonical entry when meaning changes; record significant migration rationale elsewhere. Keep API field shapes in contracts, database storage in schemas, future requirements in specs, and decision history in ADRs. Introduce a context map only when multiple models actually need explanation.

## README

**Purpose and creation trigger.** This is the visitor's entry point and the usual minimal documentation for a newly shareable repository. It answers whether the project is relevant, what exists now, and how to reach a useful first result. GitHub's guidance directly supports this role. [About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes).

**Proposed content domains:** identity and purpose; current maturity and limitations; intended users; a concrete usage example; prerequisites and installation; first successful execution; expected output; documentation navigation; support and maintainers; contribution and license links. Separate using a released tool from developing its source when those paths differ. Avoid presenting planned capabilities as available.

**Discovery questions.** Who arrives here first: end users, contributors, operators, or evaluators? What should they accomplish in five minutes? Is installation from a release, package manager, or checkout? Which environments are supported? Where should a person report a problem? Is the project experimental or production-supported?

**Inference boundary.** The skill can inspect package metadata, existing license text, runnable commands, and examples. It can report checks it actually performed. It cannot infer a support commitment, compatibility guarantee, license choice, maturity label, or contact owner's consent merely from the repository's existence.

**Minimal outline.** `What this does → Status and audience → Quick start → Example and expected result → Documentation → Help and contributing → License`. Purpose and status deserve deliberate attention because the empirical README study found these were often missing. [Prana et al.](https://arxiv.org/abs/1802.06997).

**Validation and upkeep.** Try the quick start in an appropriate clean environment or clearly state which steps remain unverified. Check links and referenced files, commands, prerequisites, and output. Update it when installation, user-visible behavior, or support routes change. Summarize architecture rather than copying its full document; link contribution rules and detailed references. For an empty new repository, describe the planned state explicitly and avoid fictional executable examples.

## Specifications and acceptance criteria

**Purpose and creation trigger.** Proposed design: create a spec for an agreed change when behavior, edge cases, interfaces, or measurable quality need coordination. A small fix can use acceptance criteria in its existing issue; do not create a second spec solely to satisfy a filename checklist. Reuse an established Spec Kit, OpenSpec, issue, or requirements workflow.

**Proposed content domains:** actors and prioritized journeys; inputs and outputs; authorization and ownership; identity and lifecycle; success, empty, loading, and failure states; integration failures; concurrency and retry behavior; externally relevant compatibility; measurable quality constraints; exclusions, assumptions, and open questions. Apply only relevant domains and explain deliberate omissions. This coverage adapts Spec Kit's clarification categories; its proposed interviews prioritize questions whose answers materially alter implementation or validation. [Clarification workflow](https://github.com/github/spec-kit/blob/main/templates/commands/clarify.md).

**Discovery questions.** What exact behavior would make the owner accept this change? Which negative case must fail? Who can perform each action? What happens on a duplicate request or unavailable dependency? What existing consumer must remain compatible? Which quality targets are commitments, and how will they be measured?

**Inference boundary.** Existing tests and APIs provide evidence of current behavior and candidate regression constraints. They do not authorize a new product policy. The skill can propose examples, identify missing cases, and derive checks from explicit requirements; owners decide changed behavior, risk tolerance, retention, authorization rules, priorities, and numerical service targets.

**Minimal outline.** `Change and source intent → User scenarios → Requirements → Acceptance examples → Edge cases → Quality constraints → Assumptions and unresolved decisions → Validation evidence`. Spec Kit's template uses identified requirements and measurable outcomes; adopting its complete directory layout is optional. [Spec template](https://github.com/github/spec-kit/blob/main/templates/spec-template.md).

Illustrative criterion: “Given a full shift, when another volunteer requests it, then the request is rejected with a capacity explanation and no reservation is created.” State the result visible to an actor or external system. Plain Markdown criteria are valid documentation; Gherkin becomes an executable test only with its implementation and runner. [Gherkin reference](https://cucumber.io/docs/gherkin/reference/).

**Validation and upkeep.** Require each accepted requirement to have a checkable outcome, and distinguish a proposed check from executed evidence. Exercise a normal, denied, boundary, and recovery case where applicable. Trace implementation and tests back to requirements; revise the spec when intent changes, preserving the decision record. Keep work sequencing in plans/tasks, reusable definitions in the glossary, and enduring architectural decisions in ADRs. A spec describes the contract; a green test run is evidence about that contract, not automatic proof that every requirement was covered.

## Proposed setup skill contract

The skill should first inventory existing authoritative documents and detect competing statements. It should draft an artifact map before choosing new filenames, extract verifiable facts, and ask only owner questions that change meaning or acceptance. Each unresolved point should be marked as unknown, proposed, or deferred with its consequence. Completion means useful documents with consistent terms, valid links, exercised examples where feasible, and a clear record of owner decisions—not a complete directory of empty templates.
