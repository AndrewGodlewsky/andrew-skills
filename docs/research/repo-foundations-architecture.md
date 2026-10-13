# Repository foundations: architecture, decisions, contracts, and navigation

Research date: October 7, 2026. Scope: input to a proposed repository-creation skill; no skill implementation or repository policy change is made here.

## Reading the evidence

The file outlines and setup workflow below are **proposed synthesis**, tailored to a skill creating a new repository. The cited architecture methods are established practitioner guidance, and OpenAPI is a technical specification. None proves that this exact file bundle improves coding-agent outcomes.

There is relevant empirical content research: a September 2026 preprint analyzes 4,316 ADRs from 547 repositories. It identifies missing or misplaced alternatives and decision drivers. Its automated taxonomy agreement with human labels was 46–66%, and its filters exclude projects with fewer than five ADRs. Treat it as evidence of documentation gaps, not a universal quality score or an agent-performance experiment. [Miccio, Tommasel, and Diaz-Pace](https://arxiv.org/html/2609.07375v1)

The useful objective is **answerability**: can the next agent find where a behavior belongs, distinguish current facts from proposals, understand a consequential choice, and check the constraints it must preserve?

## 1. ARCHITECTURE.md: a map of the system

**Purpose and creation trigger.** Explain the system's important parts, relationships, and boundaries. Create a compact map once there is an agreed initial design or meaningful code; a tiny repository can keep this in its README. Matklad recommends a short document focused on stable structure, coarse modules, architectural invariants, and crosscutting concerns. His original recommendation targets roughly 10k–200k-line open-source projects, so applying the filename to every newborn repository is an extrapolation. [ARCHITECTURE.md](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)

**Domains and subdomains to consider.** Use these as prompts, not mandatory empty headings:

- System boundary: actors, external services, inputs/outputs, and responsibilities outside this repository.
- Structural map: major packages or modules, their responsibilities, entry points, data ownership, and public interfaces.
- Dependency rules: allowed directions, prohibited imports, isolation boundaries, and important absences.
- Runtime behavior: one or two representative request, job, or event flows; state transitions; concurrency and failure boundaries when relevant.
- Deployment shape: executable units, persistent stores, external infrastructure, and environment differences that affect design.
- Crosscutting concerns: authentication, authorization, configuration, errors, observability, serialization, caching, and migrations, selecting only consequential topics.
- Quality constraints: measurable architectural requirements and known risks, linked to their canonical requirement or decision records.

arc42 supplies a broader menu covering context, building blocks, runtime, deployment, quality, risks, and crosscutting concerns. It explicitly allows tailoring; its twelve sections need not become twelve files. [arc42 overview](https://arc42.org/overview/)

**Questions the setup skill should ask.** What will run independently? Where is state owned? Which integrations or trust boundaries are already committed? What interactions must remain impossible? Which quality goals actually influence design? Which parts are deliberately undecided?

**Infer versus decide.** Read package manifests, entry points, imports, deployment configuration, and existing contracts to describe observable structure. In a new repository, label an unimplemented design as proposed. Never infer an accepted business boundary, service split, performance target, or permission policy merely from common templates. A directory called `services` does not establish a microservices architecture.

**Minimal outline.** `Status and scope → System context → Module/responsibility table → Allowed dependency directions and invariants → Representative flow → Crosscutting concerns → Risks and linked decisions`.

**Validation and upkeep.** Check named paths and interfaces exist, diagrams agree with the map, and dependency rules have executable checks where feasible. Review after changing a boundary, public interface, deployment unit, or state owner. Stable explanatory prose needs semantic review; generated inventories need regeneration. Do not require rewriting the map for every internal function change.

**Keep elsewhere.** Product purpose belongs in `INTENT.md`; term definitions in `GLOSSARY.md`; command recipes in development docs; detailed rationale in ADRs; task status in issues/plans. Link those sources.

**Diagrams.** C4 distinguishes context, container, component, and code views and says most teams need only context and container views. The skill should add only diagrams that resolve a real question, with labeled relationships and a plain-text explanation. For a library, a public API/module map may be more useful than a deployment diagram. [C4 diagrams](https://c4model.com/diagrams)

## 2. docs/decisions/: durable decision records

**Purpose and creation trigger.** Preserve why a consequential choice was made. Nygard's ADR pattern uses one small record per significant decision, with context, decision, status, and consequences. Keep superseded records and point to their replacements. A setup skill can initialize a template and index, but should write an accepted ADR only for a real choice the owner has made. [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

**Domains and subdomains.** Candidate decisions include component boundaries, data ownership, storage, protocols, dependencies, deployment, compatibility, consequential workflow constraints, and crosscutting security or reliability approaches. Within each record capture the specific problem; relevant constraints and priorities; actual considered options; chosen option; reasons; benefits; costs; consequences; affected contracts; and any revisit trigger. Describe rejected options honestly. Do not invent an evaluation process after the fact.

**Questions.** What decision is being made now? What alternatives were genuinely considered? Which requirement favored the winner? What cost are we accepting? Who can accept the choice? What evidence or changed condition would justify revisiting it?

**Infer versus decide.** An installed database proves a dependency exists; it does not prove why it was selected. If rationale is unavailable, record the observed state and the missing rationale explicitly. Ask for consequential preferences; identify drafts as proposed. Avoid a fictional first ADR declaring every generated convention accepted.

**Minimal outline.** `Identifier/title → Status/date → Context and drivers → Considered options → Decision and rationale → Consequences → Links/revisit conditions`.

**Validation and upkeep.** Check unique identifiers, nonempty project-specific rationale, explicit status, and reciprocal supersession links. An accepted decision must match actual owner authorization. When a choice changes, write the replacement record and preserve the former context. Correct factual errors without rewriting history to imply the replacement was always intended. An index lists current and superseded decisions; it does not duplicate their arguments.

**Separation.** Architecture describes the current structure. An ADR explains a particular choice. Intent establishes the project-level priority; the ADR records how that priority influenced one decision. A transient debugging guess usually belongs in an issue, not an ADR.

## 3. Module interfaces, contracts, and the dependency map

**Purpose and creation trigger.** Give independently changing parts an explicit agreement. A new repository needs enough structure to keep responsibilities clear; it does not automatically need a `CONTRACTS.md`, schema directory, and graph generator. Add stronger machinery when there are independently consumed APIs, multiple packages, external data formats, or important layering constraints.

arc42's building-block guidance offers a useful per-module baseline: responsibility, interface, location, relevant quality characteristics, and risks. It recommends selectively expanding surprising, risky, or complex blocks. This supports describing a module as a useful boundary instead of duplicating all implementation details. [arc42 building-block view](https://docs.arc42.org/section-5/)

**Domains and subdomains.** Our proposed contract checklist covers:

- Ownership: responsibility, state owned, callers, dependencies, and public entry points.
- Shape: input/output types, required fields, identifiers, units, nullability, validation, and version semantics.
- Behavior: side effects, invariants, error categories, partial failure, ordering, idempotency, retries, and cancellation where applicable.
- Change: compatibility promises, deprecation, migration responsibilities, examples, and executable contract checks.
- Dependency map: nodes, relationship kinds and direction, source evidence, generated versus reviewed content, and exclusions with reasons.

**Questions.** Who consumes this boundary? What compatibility do we promise? What must callers never access directly? Can a call be repeated safely? Who owns data migrations? Which relationships can be extracted mechanically, and which are semantic?

**Infer versus decide.** Extract imports, exports, signatures, schema fields, and declared dependencies. Confirm intended public stability and behavior separately. Import absence does not prove a deliberate prohibition. An auto-generated graph describes detected relationships; it cannot certify that those relationships are good architecture.

**Minimal outline.** A module table plus native interface declarations usually suffices: `Module → Responsibility → Public interface → Owned state → Dependencies → Invariants → Verification`. Put HTTP details in an OpenAPI document when applicable: operations, request/response schemas, parameters, errors, and security descriptions. OpenAPI is specifically a human- and machine-readable description for HTTP APIs, not a universal module-contract format. [OpenAPI specification](https://spec.openapis.org/oas/v3.2.1.html)

**Validation and upkeep.** Type-check interfaces; validate schemas and examples; exercise important boundary behavior; compare consumer expectations with providers; flag unintended breaking changes. For JavaScript/TypeScript, dependency-cruiser is a concrete example of a tool that extracts dependencies, checks configured rules, and generates diagrams. Its existence shows these checks are implementable; selection still depends on the stack. [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)

**Separation.** Keep machine-readable declarations canonical. Architecture summarizes boundaries and links to contracts. Avoid a second manually maintained field catalog in Markdown. Generated graph checks and semantic relationship review are different responsibilities.

## 4. docs/README.md: a navigation and authority index

**Purpose and creation trigger.** Help a new human or agent locate the appropriate source. Create an index when there are enough documents to make navigation useful; a short root README section can initially serve the same purpose.

Diátaxis separates learning tutorials, task-oriented how-to guides, factual reference, and explanatory material. Those distinctions can prevent a repository's command recipes, design rationale, and API descriptions from becoming one difficult document. It does not require a particular Markdown filename or agent loading policy. [Diátaxis](https://diataxis.fr/)

**Domains and subdomains.** Provide a starting route; a document table with purpose and when to consult it; the canonical location of requirements and work status; markers for proposed, current, generated, and historical material; and links to the documentation update process. Group by reader need rather than duplicating the directory tree.

**Questions.** What will someone need to find first? Which sources are authoritative? Does work live in repository files, issues, or an external tracker? Which materials are historical? Who owns unresolved contradictions?

**Infer versus decide.** Inventory existing documents and links automatically. The owner establishes authority when sources conflict. A setup skill must not silently make its newly generated document outrank established specifications or instructions.

**Minimal outline.** `Start here → Document/purpose/consult-when table → Current work and decisions → Reference material → Historical material → Maintenance`.

**Validation and upkeep.** Check links, orphaned important documents, incorrect current/historical status, and contradictory ownership. Update the index when documents move or become canonical. Keep it short; route the reader instead of copying content.

## Proposed creation sequence and acceptance criteria

1. Inventory the actual repository and existing owner decisions; identify canonical material to reuse.
2. Ask only the unresolved questions that affect boundaries, compatibility, authority, or irreversible choices.
3. Produce the smallest applicable set, with clear proposed/observed/accepted status and no fake implementation claims.
4. Connect navigation, architecture, decisions, contracts, and checks without repeating their substantive contents.
5. Run available structural validation; distinguish checks passed from semantic review and unimplemented verification.

Accept the output when another agent can answer where a representative change belongs, which boundary it must preserve, why a key choice exists, where the authoritative contract lives, and how to verify the change. These are proposed evaluation tasks for the eventual skill, not claims established by the cited research.
