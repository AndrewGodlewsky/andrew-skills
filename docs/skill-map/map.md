# GT skill dependency map

Snapshot: `4f1e007fb145bb4b8baf769918612ce3e38bc4298f13c6c171fb28f45e2e7ee3`. Source: current working files when generated.
Saved output cannot detect later edits. Recorded review is current for this snapshot.

A → B means A relies on B; dashed arrows are conditional. Potential impact means review scope, not proven breakage.

```mermaid
flowchart LR
  n0["caveman"]
  n1["caveman-commit"]
  n2["caveman-compress"]
  n3["caveman-explore"]
  n4["caveman-review"]
  n5["create-issue"]
  n6["create-skills"]
  n7["domain-modeling"]
  n8["grill-me"]
  n9["grill-with-docs"]
  n10["grilling"]
  n11["help"]
  n12["skill-steal"]
  n13["skill-tweak"]
  n14["skills-restore"]
  n15["skills-status"]
  n16["skills-update"]
  n17["why-not"]
  n6 --> n8
  n6 -.-> n5
  n13 --> n8
  n13 -.-> n5
  n12 -.-> n8
  n12 -.-> n5
  n9 --> n10
  n9 --> n7
  n11 -.-> n0
  n11 -.-> n1
  n11 -.-> n2
  n11 -.-> n3
  n11 -.-> n4
  n11 -.-> n5
  n11 -.-> n6
  n11 -.-> n7
  n11 -.-> n8
  n11 -.-> n9
  n11 -.-> n10
  n11 -.-> n12
  n11 -.-> n13
  n11 -.-> n14
  n11 -.-> n15
  n11 -.-> n16
  n11 -.-> n17
```

## All skills

| Skill | Relies on | Callers to review | Review |
| --- | --- | --- | --- |
| caveman | None recorded | help | Reviewed |
| caveman-commit | None recorded | help | Reviewed |
| caveman-compress | None recorded | help | Reviewed |
| caveman-explore | None recorded | help | Reviewed |
| caveman-review | None recorded | help | Reviewed |
| create-issue | None recorded | create-skills, help, skill-steal, skill-tweak | Reviewed |
| create-skills | grill-me, create-issue | help | Reviewed |
| domain-modeling | None recorded | grill-with-docs, help | Reviewed |
| grill-me | None recorded | create-skills, help, skill-steal, skill-tweak | Reviewed |
| grill-with-docs | grilling, domain-modeling | help | Reviewed |
| grilling | None recorded | grill-with-docs, help | Reviewed |
| help | caveman, caveman-commit, caveman-compress, caveman-explore, caveman-review, create-issue, create-skills, domain-modeling, grill-me, grill-with-docs, grilling, skill-steal, skill-tweak, skills-restore, skills-status, skills-update, why-not | None recorded | Reviewed |
| skill-steal | grill-me, create-issue | help | Reviewed |
| skill-tweak | grill-me, create-issue | help | Reviewed |
| skills-restore | None recorded | help | Reviewed |
| skills-status | None recorded | help | Reviewed |
| skills-update | None recorded | help | Reviewed |
| why-not | None recorded | help | Reviewed |

## All shared and bundled resources

| Resource | Present | Skills to review |
| --- | --- | --- |
| CONTRIBUTING.md | Yes | create-skills, help, skill-steal |
| exporter/bundle.json | Yes | None recorded |
| exporter/export-cli.mjs | Yes | None recorded |
| exporter/export-filesystem.mjs | Yes | None recorded |
| exporter/export-protocol.mjs | Yes | None recorded |
| exporter/export-source.mjs | Yes | None recorded |
| exporter/README.md | Yes | help, skills-restore |
| exporter/release-catalog-reader.mjs | Yes | None recorded |
| exporter/release-catalog.mjs | Yes | None recorded |
| exporter/release-snapshots.mjs | Yes | None recorded |
| exporter/release-validation.mjs | Yes | None recorded |
| exporter/run.mjs | Yes | None recorded |
| scripts/build-create-skills.mjs | Yes | create-skills, help, skill-steal |
| scripts/build-exporter.mjs | Yes | help, skills-restore |
| scripts/build-issue-submission.mjs | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| scripts/build-skill-steal.mjs | Yes | help, skill-steal |
| scripts/build-skill-tweak.mjs | Yes | help, skill-tweak |
| scripts/create-skills/install.mjs | Yes | create-skills, help |
| scripts/create-skills/package.mjs | Yes | create-skills, help, skill-steal |
| scripts/create-skills/run.mjs | Yes | create-skills, help |
| scripts/create-skills/submission.mjs | Yes | create-skills, help, skill-steal |
| scripts/export-cli.mjs | Yes | help, skills-restore |
| scripts/export-filesystem.mjs | Yes | help, skills-restore |
| scripts/export-launcher.mjs | Yes | help, skills-restore |
| scripts/export-protocol.mjs | Yes | help, skills-restore |
| scripts/export-source.mjs | Yes | help, skills-restore |
| scripts/intent-capture.md | Yes | create-skills, help, skill-tweak |
| scripts/intent-record.mjs | Yes | create-skills, help, skill-steal, skill-tweak |
| scripts/issue-submission/api.mjs | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| scripts/issue-submission/contract.mjs | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| scripts/issue-submission/run.mjs | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| scripts/issue-submission/runtime.mjs | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| scripts/issue-submission/service.mjs | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| scripts/release-catalog-reader.mjs | Yes | help, skills-restore |
| scripts/release-catalog.mjs | Yes | help, skills-restore |
| scripts/release-snapshots.mjs | Yes | help, skills-restore |
| scripts/release-validation.mjs | Yes | create-skills, help, skill-steal, skills-restore |
| scripts/review-handoff.mjs | Yes | create-skills, help, skill-steal, skill-tweak |
| scripts/skill-package-validation.mjs | Yes | create-skills, help, skill-steal |
| scripts/skill-steal/run.mjs | Yes | help, skill-steal |
| scripts/skill-tweak/run.mjs | Yes | help, skill-tweak |
| scripts/skill-tweak/submission.mjs | Yes | help, skill-tweak |
| skills/caveman-commit/LICENSE | Yes | None recorded |
| skills/caveman-commit/README.md | Yes | None recorded |
| skills/caveman-commit/SKILL.md | Yes | caveman-commit, help |
| skills/caveman-compress/LICENSE | Yes | caveman-compress, help |
| skills/caveman-compress/README.md | Yes | caveman-compress, help |
| skills/caveman-compress/scripts/&#95;&#95;init&#95;&#95;.py | Yes | caveman-compress, help |
| skills/caveman-compress/scripts/&#95;&#95;main&#95;&#95;.py | Yes | caveman-compress, help |
| skills/caveman-compress/scripts/benchmark.py | Yes | caveman-compress, help |
| skills/caveman-compress/scripts/cli.py | Yes | caveman-compress, help |
| skills/caveman-compress/scripts/compress.py | Yes | caveman-compress, help |
| skills/caveman-compress/scripts/detect.py | Yes | caveman-compress, help |
| skills/caveman-compress/scripts/validate.py | Yes | caveman-compress, help |
| skills/caveman-compress/SECURITY.md | Yes | caveman-compress, help |
| skills/caveman-compress/SKILL.md | Yes | caveman-compress, help |
| skills/caveman-explore/LICENSE | Yes | None recorded |
| skills/caveman-explore/README.md | Yes | None recorded |
| skills/caveman-explore/SKILL.md | Yes | caveman-explore, help |
| skills/caveman-review/LICENSE | Yes | None recorded |
| skills/caveman-review/README.md | Yes | None recorded |
| skills/caveman-review/SKILL.md | Yes | caveman-review, help |
| skills/caveman/LICENSE | Yes | caveman, help |
| skills/caveman/README.md | Yes | caveman, help |
| skills/caveman/SKILL.md | Yes | caveman, help |
| skills/create-issue/references/helper.md | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| skills/create-issue/references/labels.md | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| skills/create-issue/scripts/api.mjs | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| skills/create-issue/scripts/contract.mjs | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| skills/create-issue/scripts/run.mjs | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| skills/create-issue/scripts/runtime.mjs | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| skills/create-issue/scripts/service.mjs | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| skills/create-issue/SKILL.md | Yes | create-issue, create-skills, help, skill-steal, skill-tweak |
| skills/create-skills/assets/matt-pocock-license.txt | Yes | create-skills, help |
| skills/create-skills/references/intent-capture.md | Yes | create-skills, help |
| skills/create-skills/references/package-rules.md | Yes | create-skills, help |
| skills/create-skills/references/personal-installation.md | Yes | create-skills, help |
| skills/create-skills/references/specification.md | Yes | create-skills, help |
| skills/create-skills/references/submission.md | Yes | create-skills, help, skill-steal |
| skills/create-skills/references/tools.md | Yes | create-skills, help, skill-steal |
| skills/create-skills/references/writing.md | Yes | create-skills, help |
| skills/create-skills/scripts/install.mjs | Yes | create-skills, help |
| skills/create-skills/scripts/intent-record.mjs | Yes | create-skills, help |
| skills/create-skills/scripts/package.mjs | Yes | create-skills, help |
| skills/create-skills/scripts/release-validation.mjs | Yes | create-skills, help |
| skills/create-skills/scripts/review-handoff.mjs | Yes | create-skills, help |
| skills/create-skills/scripts/run.mjs | Yes | create-skills, help |
| skills/create-skills/scripts/skill-package-validation.mjs | Yes | create-skills, help |
| skills/create-skills/scripts/submission.mjs | Yes | create-skills, help |
| skills/create-skills/SKILL.md | Yes | create-skills, help |
| skills/domain-modeling/ADR-FORMAT.md | Yes | domain-modeling, grill-with-docs, help |
| skills/domain-modeling/assets/matt-pocock-license.txt | Yes | domain-modeling, grill-with-docs, help |
| skills/domain-modeling/CONTEXT-FORMAT.md | Yes | domain-modeling, grill-with-docs, help |
| skills/domain-modeling/SKILL.md | Yes | domain-modeling, grill-with-docs, help |
| skills/grill-me/SKILL.md | Yes | create-skills, grill-me, help, skill-steal, skill-tweak |
| skills/grill-with-docs/assets/matt-pocock-license.txt | Yes | grill-with-docs, help |
| skills/grill-with-docs/SKILL.md | Yes | grill-with-docs, help |
| skills/grilling/assets/matt-pocock-license.txt | Yes | grill-with-docs, grilling, help |
| skills/grilling/SKILL.md | Yes | grill-with-docs, grilling, help |
| skills/help/assets/matt-pocock-license.txt | Yes | help |
| skills/help/SKILL.md | Yes | help |
| skills/skill-steal/references/clarification.md | Yes | help, skill-steal |
| skills/skill-steal/references/package-rules.md | Yes | help, skill-steal |
| skills/skill-steal/references/source.md | Yes | help, skill-steal |
| skills/skill-steal/references/submission.md | Yes | help, skill-steal |
| skills/skill-steal/references/tools.md | Yes | help, skill-steal |
| skills/skill-steal/scripts/intent-record.mjs | Yes | help, skill-steal |
| skills/skill-steal/scripts/package.mjs | Yes | help, skill-steal |
| skills/skill-steal/scripts/release-validation.mjs | Yes | help, skill-steal |
| skills/skill-steal/scripts/review-handoff.mjs | Yes | help, skill-steal |
| skills/skill-steal/scripts/run.mjs | Yes | help, skill-steal |
| skills/skill-steal/scripts/skill-package-validation.mjs | Yes | help, skill-steal |
| skills/skill-steal/scripts/submission.mjs | Yes | help, skill-steal |
| skills/skill-steal/SKILL.md | Yes | help, skill-steal |
| skills/skill-tweak/references/evidence.md | Yes | help, skill-tweak |
| skills/skill-tweak/references/intent-capture.md | Yes | help, skill-tweak |
| skills/skill-tweak/references/submission.md | Yes | help, skill-tweak |
| skills/skill-tweak/scripts/intent-record.mjs | Yes | help, skill-tweak |
| skills/skill-tweak/scripts/review-handoff.mjs | Yes | help, skill-tweak |
| skills/skill-tweak/scripts/run.mjs | Yes | help, skill-tweak |
| skills/skill-tweak/scripts/submission.mjs | Yes | help, skill-tweak |
| skills/skill-tweak/SKILL.md | Yes | help, skill-tweak |
| skills/skill-tweak/templates/issue.md | Yes | help, skill-tweak |
| skills/skills-restore/references/operations.md | Yes | help, skills-restore |
| skills/skills-restore/scripts/exporter/bundle.json | Yes | help, skills-restore |
| skills/skills-restore/scripts/exporter/export-cli.mjs | Yes | help, skills-restore |
| skills/skills-restore/scripts/exporter/export-filesystem.mjs | Yes | help, skills-restore |
| skills/skills-restore/scripts/exporter/export-protocol.mjs | Yes | help, skills-restore |
| skills/skills-restore/scripts/exporter/export-source.mjs | Yes | help, skills-restore |
| skills/skills-restore/scripts/exporter/README.md | Yes | help, skills-restore |
| skills/skills-restore/scripts/exporter/release-catalog-reader.mjs | Yes | help, skills-restore |
| skills/skills-restore/scripts/exporter/release-catalog.mjs | Yes | help, skills-restore |
| skills/skills-restore/scripts/exporter/release-snapshots.mjs | Yes | help, skills-restore |
| skills/skills-restore/scripts/exporter/release-validation.mjs | Yes | help, skills-restore |
| skills/skills-restore/scripts/exporter/run.mjs | Yes | help, skills-restore |
| skills/skills-restore/SKILL.md | Yes | help, skills-restore |
| skills/skills-status/references/installation-target.md | Yes | help, skills-status |
| skills/skills-status/SKILL.md | Yes | help, skills-status |
| skills/skills-update/references/installation-target.md | Yes | help, skills-update |
| skills/skills-update/references/update-report.md | Yes | help, skills-update |
| skills/skills-update/SKILL.md | Yes | help, skills-update |
| skills/why-not/SKILL.md | Yes | help, why-not |

## All declared dependencies and source provenance

### caveman → skills/caveman/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### caveman-commit → skills/caveman-commit/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### caveman-compress → skills/caveman-compress/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### caveman-explore → skills/caveman-explore/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### caveman-review → skills/caveman-review/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### create-issue → skills/create-issue/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### create-skills → skills/create-skills/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### domain-modeling → skills/domain-modeling/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### grill-me → skills/grill-me/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### grill-with-docs → skills/grill-with-docs/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### grilling → skills/grilling/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### help → skills/help/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### skill-steal → skills/skill-steal/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### skill-tweak → skills/skill-tweak/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### skills-restore → skills/skills-restore/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### skills-status → skills/skills-status/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### skills-update → skills/skills-update/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### why-not → skills/why-not/SKILL.md

entry; current. Skill entry instructions

Discovered skill entry instructions.

### create-skills → grill-me

skill; current. During the required intent interview

- [skills/create-skills/SKILL.md:16](../../skills/create-skills/SKILL.md#L16) (current): Resolve and invoke the selected enabled &#42;&#42;GT grill-me&#42;&#42; skill for the interview,
- [scripts/intent-capture.md:5](../../scripts/intent-capture.md#L5) (current): Create Skills and Skill Tweak must resolve and invoke &#42;&#42;GT grill-me&#42;&#42; through the
- [skills/create-skills/references/intent-capture.md:5](../../skills/create-skills/references/intent-capture.md#L5) (current): Create Skills and Skill Tweak must resolve and invoke &#42;&#42;GT grill-me&#42;&#42; through the
- [skills/create-skills/references/specification.md:5](../../skills/create-skills/references/specification.md#L5) (current): selected GT grill-me dependency using the &#91;intent guide&#93;(intent-capture.md).

### create-skills → create-issue

skill; current. When submitting the handoff (conditional)

- [skills/create-skills/SKILL.md:41](../../skills/create-skills/SKILL.md#L41) (current):    enabled GT &#42;&#42;create-issue&#42;&#42; model-invocable dependency using the client-supplied
- [scripts/review-handoff.mjs:69](../../scripts/review-handoff.mjs#L69) (current): // Stateless next-action calculation. Only the enabled create-issue skill executes
- [skills/create-skills/references/personal-installation.md:33](../../skills/create-skills/references/personal-installation.md#L33) (current): create-issue before copying, under actual authority. A later partial submission
- [skills/create-skills/references/submission.md:3](../../skills/create-skills/references/submission.md#L3) (current): Resolve and invoke the intended enabled GT create-issue dependency. It supplies
- [skills/create-skills/scripts/review-handoff.mjs:69](../../skills/create-skills/scripts/review-handoff.mjs#L69) (current): // Stateless next-action calculation. Only the enabled create-issue skill executes

### skill-tweak → grill-me

skill; current. During the required incident/intent interview

- [skills/skill-tweak/SKILL.md:29](../../skills/skill-tweak/SKILL.md#L29) (current):    &#42;&#42;GT grill-me&#42;&#42; skill using the intent guide's handoff rules. Pass the original
- [scripts/intent-capture.md:5](../../scripts/intent-capture.md#L5) (current): Create Skills and Skill Tweak must resolve and invoke &#42;&#42;GT grill-me&#42;&#42; through the
- [skills/skill-tweak/references/intent-capture.md:5](../../skills/skill-tweak/references/intent-capture.md#L5) (current): Create Skills and Skill Tweak must resolve and invoke &#42;&#42;GT grill-me&#42;&#42; through the

### skill-tweak → create-issue

skill; current. When publication is intended; draft-only work does not require it (conditional)

- [skills/skill-tweak/SKILL.md:48](../../skills/skill-tweak/SKILL.md#L48) (current):    resolve the enabled GT create-issue dependency before final preview from the client-supplied
- [scripts/review-handoff.mjs:69](../../scripts/review-handoff.mjs#L69) (current): // Stateless next-action calculation. Only the enabled create-issue skill executes
- [skills/skill-tweak/references/submission.md:33](../../skills/skill-tweak/references/submission.md#L33) (current): ## Delivery through create-issue
- [skills/skill-tweak/scripts/review-handoff.mjs:69](../../skills/skill-tweak/scripts/review-handoff.mjs#L69) (current): // Stateless next-action calculation. Only the enabled create-issue skill executes

### skill-steal → grill-me

skill; current. When intent is unclear or compatibility work could change behavior (conditional)

- [skills/skill-steal/SKILL.md:26](../../skills/skill-steal/SKILL.md#L26) (current):    selected enabled GT &#42;&#42;grill-me&#42;&#42;. Pass findings, conflicts, previous answers and
- [skills/skill-steal/references/clarification.md:3](../../skills/skill-steal/references/clarification.md#L3) (current): Use the client-supplied selected GT installation identity. Resolve &#42;&#42;grill-me&#42;&#42;
- [skills/skill-steal/references/source.md:29](../../skills/skill-steal/references/source.md#L29) (current): contract. Identify these effects, preserve supported semantics, and use Grill Me

### skill-steal → create-issue

skill; current. When submitting the review handoff (conditional)

- [skills/skill-steal/SKILL.md:46](../../skills/skill-steal/SKILL.md#L46) (current):    and deliver one handoff through the selected enabled GT &#42;&#42;create-issue&#42;&#42;.
- [scripts/review-handoff.mjs:69](../../scripts/review-handoff.mjs#L69) (current): // Stateless next-action calculation. Only the enabled create-issue skill executes
- [skills/skill-steal/references/clarification.md:4](../../skills/skill-steal/references/clarification.md#L4) (current): for necessary clarification and &#42;&#42;create-issue&#42;&#42; when submission is intended,
- [skills/skill-steal/references/submission.md:5](../../skills/skill-steal/references/submission.md#L5) (current): Resolve and invoke the intended enabled GT create-issue dependency. It supplies
- [skills/skill-steal/scripts/review-handoff.mjs:69](../../skills/skill-steal/scripts/review-handoff.mjs#L69) (current): // Stateless next-action calculation. Only the enabled create-issue skill executes

### grill-with-docs → grilling

skill; current. Before starting the composed interview/document workflow

- [skills/grill-with-docs/SKILL.md:13](../../skills/grill-with-docs/SKILL.md#L13) (current): Before starting, resolve and invoke both enabled dependencies, &#96;grilling&#96; and<br>&#96;domain-modeling&#96;, from the same selected GT installation using the client's

### grill-with-docs → domain-modeling

skill; current. Before starting the composed interview/document workflow

- [skills/grill-with-docs/SKILL.md:13](../../skills/grill-with-docs/SKILL.md#L13) (current): Before starting, resolve and invoke both enabled dependencies, &#96;grilling&#96; and<br>&#96;domain-modeling&#96;, from the same selected GT installation using the client's

### exporter/export-cli.mjs → exporter/export-filesystem.mjs

resource; current. When loading this module

- [exporter/export-cli.mjs:4](../../exporter/export-cli.mjs#L4) (current): import { checkedPath, inspectCopy, targetPaths } from './export-filesystem.mjs';

### exporter/export-cli.mjs → exporter/export-protocol.mjs

resource; current. When loading this module

- [exporter/export-cli.mjs:3](../../exporter/export-cli.mjs#L3) (current): import { acquireCatalog, checkRuntime, executePlan, makePlan, reviewPlan } from './export-protocol.mjs';

### exporter/export-cli.mjs → exporter/export-source.mjs

resource; current. When loading this module

- [exporter/export-cli.mjs:5](../../exporter/export-cli.mjs#L5) (current): import { PROTOCOL&#95;VERSION, requireExport } from './export-source.mjs';

### exporter/export-filesystem.mjs → exporter/export-source.mjs

resource; current. When loading this module

- [exporter/export-filesystem.mjs:7](../../exporter/export-filesystem.mjs#L7) (current): import { EXPORTER&#95;VERSION, PROTOCOL&#95;VERSION, REPOSITORY, prepareSource, requireExport, sha256, validateSourcePath } from './export-source.mjs';

### exporter/export-protocol.mjs → exporter/export-filesystem.mjs

resource; current. When loading this module

- [exporter/export-protocol.mjs:7](../../exporter/export-protocol.mjs#L7) (current): import { checkedPath, createCopy, ensureDirectory, isSecurityError, targetPaths } from './export-filesystem.mjs';

### exporter/export-protocol.mjs → exporter/export-source.mjs

resource; current. When loading this module

- [exporter/export-protocol.mjs:8](../../exporter/export-protocol.mjs#L8) (current): import { EXPORTER&#95;VERSION, PROTOCOL&#95;VERSION, REPOSITORY, fileManifest, prepareSource, requireExport, sha256 } from './export-source.mjs';

### exporter/export-protocol.mjs → exporter/release-catalog-reader.mjs

resource; current. When loading this module

- [exporter/export-protocol.mjs:5](../../exporter/export-protocol.mjs#L5) (current): import { readReleaseCatalog, repositoryIdentity } from './release-catalog-reader.mjs';

### exporter/export-protocol.mjs → exporter/release-snapshots.mjs

resource; current. When loading this module

- [exporter/export-protocol.mjs:6](../../exporter/export-protocol.mjs#L6) (current): import { readFirstParentCommits, readGitFiles, readGitSkillTrees, readRepositoryOrigin, resolveCommit } from './release-snapshots.mjs';

### exporter/export-source.mjs → exporter/release-catalog.mjs

resource; current. When loading this module

- [exporter/export-source.mjs:4](../../exporter/export-source.mjs#L4) (current): import { skillContentIdentity } from './release-catalog.mjs';

### exporter/export-source.mjs → exporter/release-validation.mjs

resource; current. When loading this module

- [exporter/export-source.mjs:3](../../exporter/export-source.mjs#L3) (current): import { parseRelease } from './release-validation.mjs';

### exporter/release-catalog-reader.mjs → exporter/release-catalog.mjs

resource; current. When loading this module

- [exporter/release-catalog-reader.mjs:4](../../exporter/release-catalog-reader.mjs#L4) (current): import { buildReleaseCatalog } from './release-catalog.mjs';

### exporter/release-catalog-reader.mjs → exporter/release-snapshots.mjs

resource; current. When loading this module

- [exporter/release-catalog-reader.mjs:5](../../exporter/release-catalog-reader.mjs#L5) (current): import { readFirstParentCommits, readGitFiles, readGitSkillTrees, readRepositoryOrigin, resolveCommit } from './release-snapshots.mjs';

### exporter/release-catalog.mjs → exporter/release-validation.mjs

resource; current. When loading this module

- [exporter/release-catalog.mjs:3](../../exporter/release-catalog.mjs#L3) (current): import { parseRelease, validateReleaseChange } from './release-validation.mjs';

### scripts/create-skills/install.mjs → scripts/create-skills/package.mjs

resource; current. When loading this module

- [scripts/create-skills/install.mjs:5](../../scripts/create-skills/install.mjs#L5) (current): import { checkPackage, readPackage, regularDirectory } from './package.mjs';

### scripts/create-skills/package.mjs → scripts/skill-package-validation.mjs

resource; current. When loading this module

- [scripts/create-skills/package.mjs:4](../../scripts/create-skills/package.mjs#L4) (current): import { validateSkill } from '../skill-package-validation.mjs';

### scripts/create-skills/run.mjs → scripts/create-skills/install.mjs

resource; current. When loading this module

- [scripts/create-skills/run.mjs:6](../../scripts/create-skills/run.mjs#L6) (current): import { installPackage } from './install.mjs';

### scripts/create-skills/run.mjs → scripts/create-skills/package.mjs

resource; current. When loading this module

- [scripts/create-skills/run.mjs:3](../../scripts/create-skills/run.mjs#L3) (current): import { checkDirectory } from './package.mjs';

### scripts/create-skills/run.mjs → scripts/create-skills/submission.mjs

resource; current. When loading this module

- [scripts/create-skills/run.mjs:4](../../scripts/create-skills/run.mjs#L4) (current): import { prepareSubmission, nextSubmission, submissionLimits } from './submission.mjs';

### scripts/create-skills/submission.mjs → scripts/create-skills/package.mjs

resource; current. When loading this module

- [scripts/create-skills/submission.mjs:1](../../scripts/create-skills/submission.mjs#L1) (current): import { sha256, readPackage } from './package.mjs';

### scripts/create-skills/submission.mjs → scripts/intent-record.mjs

resource; current. When loading this module

- [scripts/create-skills/submission.mjs:3](../../scripts/create-skills/submission.mjs#L3) (current): import { intentSections } from '../intent-record.mjs';

### scripts/create-skills/submission.mjs → scripts/review-handoff.mjs

resource; current. When loading this module

- [scripts/create-skills/submission.mjs:2](../../scripts/create-skills/submission.mjs#L2) (current): import { requireText, bytes, lf, split, fenced, prepareHandoff } from '../review-handoff.mjs';

### scripts/export-cli.mjs → scripts/export-filesystem.mjs

resource; current. When loading this module

- [scripts/export-cli.mjs:4](../../scripts/export-cli.mjs#L4) (current): import { checkedPath, inspectCopy, targetPaths } from './export-filesystem.mjs';

### scripts/export-cli.mjs → scripts/export-protocol.mjs

resource; current. When loading this module

- [scripts/export-cli.mjs:3](../../scripts/export-cli.mjs#L3) (current): import { acquireCatalog, checkRuntime, executePlan, makePlan, reviewPlan } from './export-protocol.mjs';

### scripts/export-cli.mjs → scripts/export-source.mjs

resource; current. When loading this module

- [scripts/export-cli.mjs:5](../../scripts/export-cli.mjs#L5) (current): import { PROTOCOL&#95;VERSION, requireExport } from './export-source.mjs';

### scripts/export-filesystem.mjs → scripts/export-source.mjs

resource; current. When loading this module

- [scripts/export-filesystem.mjs:7](../../scripts/export-filesystem.mjs#L7) (current): import { EXPORTER&#95;VERSION, PROTOCOL&#95;VERSION, REPOSITORY, prepareSource, requireExport, sha256, validateSourcePath } from './export-source.mjs';

### scripts/export-protocol.mjs → scripts/export-filesystem.mjs

resource; current. When loading this module

- [scripts/export-protocol.mjs:7](../../scripts/export-protocol.mjs#L7) (current): import { checkedPath, createCopy, ensureDirectory, isSecurityError, targetPaths } from './export-filesystem.mjs';

### scripts/export-protocol.mjs → scripts/export-source.mjs

resource; current. When loading this module

- [scripts/export-protocol.mjs:8](../../scripts/export-protocol.mjs#L8) (current): import { EXPORTER&#95;VERSION, PROTOCOL&#95;VERSION, REPOSITORY, fileManifest, prepareSource, requireExport, sha256 } from './export-source.mjs';

### scripts/export-protocol.mjs → scripts/release-catalog-reader.mjs

resource; current. When loading this module

- [scripts/export-protocol.mjs:5](../../scripts/export-protocol.mjs#L5) (current): import { readReleaseCatalog, repositoryIdentity } from './release-catalog-reader.mjs';

### scripts/export-protocol.mjs → scripts/release-snapshots.mjs

resource; current. When loading this module

- [scripts/export-protocol.mjs:6](../../scripts/export-protocol.mjs#L6) (current): import { readFirstParentCommits, readGitFiles, readGitSkillTrees, readRepositoryOrigin, resolveCommit } from './release-snapshots.mjs';

### scripts/export-source.mjs → scripts/release-catalog.mjs

resource; current. When loading this module

- [scripts/export-source.mjs:4](../../scripts/export-source.mjs#L4) (current): import { skillContentIdentity } from './release-catalog.mjs';

### scripts/export-source.mjs → scripts/release-validation.mjs

resource; current. When loading this module

- [scripts/export-source.mjs:3](../../scripts/export-source.mjs#L3) (current): import { parseRelease } from './release-validation.mjs';

### scripts/intent-record.mjs → scripts/review-handoff.mjs

resource; current. When loading this module

- [scripts/intent-record.mjs:1](../../scripts/intent-record.mjs#L1) (current): import { requireText } from './review-handoff.mjs';

### scripts/issue-submission/api.mjs → scripts/issue-submission/contract.mjs

resource; current. When loading this module

- [scripts/issue-submission/api.mjs:2](../../scripts/issue-submission/api.mjs#L2) (current): import { API, LIMITS, REPOSITORY, REPOSITORY&#95;ID, WEBSITE, SubmissionError, positiveId } from './contract.mjs';

### scripts/issue-submission/run.mjs → scripts/issue-submission/contract.mjs

resource; current. When loading this module

- [scripts/issue-submission/run.mjs:2](../../scripts/issue-submission/run.mjs#L2) (current): import { LIMITS, REPOSITORY, SubmissionError, decodeInput } from './contract.mjs';

### scripts/issue-submission/run.mjs → scripts/issue-submission/runtime.mjs

resource; current. When loading this module

- [scripts/issue-submission/run.mjs:3](../../scripts/issue-submission/run.mjs#L3) (current): import { createRuntime } from './runtime.mjs';

### scripts/issue-submission/run.mjs → scripts/issue-submission/service.mjs

resource; current. When loading this module

- [scripts/issue-submission/run.mjs:4](../../scripts/issue-submission/run.mjs#L4) (current): import { submit } from './service.mjs';

### scripts/issue-submission/runtime.mjs → scripts/issue-submission/contract.mjs

resource; current. When loading this module

- [scripts/issue-submission/runtime.mjs:4](../../scripts/issue-submission/runtime.mjs#L4) (current): import { API, LIMITS, SubmissionError } from './contract.mjs';

### scripts/issue-submission/service.mjs → scripts/issue-submission/api.mjs

resource; current. When loading this module

- [scripts/issue-submission/service.mjs:2](../../scripts/issue-submission/service.mjs#L2) (current): import { Session, issueRecord, commentRecord, sameText } from './api.mjs';

### scripts/issue-submission/service.mjs → scripts/issue-submission/contract.mjs

resource; current. When loading this module

- [scripts/issue-submission/service.mjs:1](../../scripts/issue-submission/service.mjs#L1) (current): import { API, LIMITS, REPOSITORY, WEBSITE, validateRequest, SubmissionError } from './contract.mjs';

### scripts/release-catalog-reader.mjs → scripts/release-catalog.mjs

resource; current. When loading this module

- [scripts/release-catalog-reader.mjs:4](../../scripts/release-catalog-reader.mjs#L4) (current): import { buildReleaseCatalog } from './release-catalog.mjs';

### scripts/release-catalog-reader.mjs → scripts/release-snapshots.mjs

resource; current. When loading this module

- [scripts/release-catalog-reader.mjs:5](../../scripts/release-catalog-reader.mjs#L5) (current): import { readFirstParentCommits, readGitFiles, readGitSkillTrees, readRepositoryOrigin, resolveCommit } from './release-snapshots.mjs';

### scripts/release-catalog.mjs → scripts/release-validation.mjs

resource; current. When loading this module

- [scripts/release-catalog.mjs:3](../../scripts/release-catalog.mjs#L3) (current): import { parseRelease, validateReleaseChange } from './release-validation.mjs';

### scripts/skill-package-validation.mjs → scripts/release-validation.mjs

resource; current. When loading this module

- [scripts/skill-package-validation.mjs:2](../../scripts/skill-package-validation.mjs#L2) (current): import { parseRelease } from './release-validation.mjs';

### scripts/skill-steal/run.mjs → scripts/create-skills/package.mjs

resource; current. When loading this module

- [scripts/skill-steal/run.mjs:4](../../scripts/skill-steal/run.mjs#L4) (current): import { checkDirectory } from '../create-skills/package.mjs';

### scripts/skill-steal/run.mjs → scripts/create-skills/submission.mjs

resource; current. When loading this module

- [scripts/skill-steal/run.mjs:5](../../scripts/skill-steal/run.mjs#L5) (current): import { prepareSubmission, nextSubmission, submissionLimits } from '../create-skills/submission.mjs';

### scripts/skill-tweak/run.mjs → scripts/skill-tweak/submission.mjs

resource; current. When loading this module

- [scripts/skill-tweak/run.mjs:2](../../scripts/skill-tweak/run.mjs#L2) (current): import { prepareSubmission, nextSubmission, submissionLimits } from './submission.mjs';

### scripts/skill-tweak/submission.mjs → scripts/intent-record.mjs

resource; current. When loading this module

- [scripts/skill-tweak/submission.mjs:2](../../scripts/skill-tweak/submission.mjs#L2) (current): import { intentSections } from '../intent-record.mjs';

### scripts/skill-tweak/submission.mjs → scripts/review-handoff.mjs

resource; current. When loading this module

- [scripts/skill-tweak/submission.mjs:1](../../scripts/skill-tweak/submission.mjs#L1) (current): import { requireText, prepareHandoff } from '../review-handoff.mjs';

### skills/caveman-commit/README.md → skills/caveman-commit/LICENSE

resource; current. When copying or redistributing this package/guidance; preserve the notice (conditional)

- [skills/caveman-commit/README.md:58](../../skills/caveman-commit/README.md#L58) (current): The skill is covered by the &#91;MIT license&#93;(LICENSE); upstream &#91;licensing scope&#93;(https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/LICENSING.md) classifies skills/ as MIT. This independent GT adaptation does not imply upstream sponsorship.

### skills/caveman-commit/README.md → skills/caveman-commit/SKILL.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/caveman-commit/README.md:51](../../skills/caveman-commit/README.md#L51) (current): - &#91;&#96;SKILL.md&#96;&#93;(./SKILL.md) — full LLM-facing instructions

### skills/caveman-compress/README.md → skills/caveman-compress/LICENSE

resource; current. When copying or redistributing this package/guidance; preserve the notice (conditional)

- [skills/caveman-compress/README.md:85](../../skills/caveman-compress/README.md#L85) (current): copyright (c) 2026 Julius Brussee, under the exact bundled &#91;MIT license&#93;(LICENSE).

### skills/caveman-compress/README.md → skills/caveman-compress/scripts/&#95;&#95;main&#95;&#95;.py

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/caveman-compress/README.md:18](../../skills/caveman-compress/README.md#L18) (current): &#91;entry point&#93;(scripts/&#95;&#95;main&#95;&#95;.py) invokes the &#91;CLI&#93;(scripts/cli.py). A missing

### skills/caveman-compress/README.md → skills/caveman-compress/scripts/benchmark.py

resource; current. When optionally measuring two files with the benchmark helper (conditional)

- [skills/caveman-compress/README.md:71](../../skills/caveman-compress/README.md#L71) (current): The optional &#91;benchmark helper&#93;(scripts/benchmark.py) compares two explicit files:

### skills/caveman-compress/README.md → skills/caveman-compress/scripts/cli.py

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/caveman-compress/README.md:18](../../skills/caveman-compress/README.md#L18) (current): &#91;entry point&#93;(scripts/&#95;&#95;main&#95;&#95;.py) invokes the &#91;CLI&#93;(scripts/cli.py). A missing

### skills/caveman-compress/README.md → skills/caveman-compress/scripts/compress.py

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/caveman-compress/README.md:53](../../skills/caveman-compress/README.md#L53) (current): The &#91;orchestrator&#93;(scripts/compress.py) masks code and separates frontmatter for

### skills/caveman-compress/README.md → skills/caveman-compress/scripts/validate.py

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/caveman-compress/README.md:59](../../skills/caveman-compress/README.md#L59) (current): The &#91;validator&#93;(scripts/validate.py) checks heading text/order, extracted code

### skills/caveman-compress/README.md → skills/caveman-compress/SECURITY.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/caveman-compress/README.md:6](../../skills/caveman-compress/README.md#L6) (current): preservation rules, and &#91;SECURITY.md&#93;(SECURITY.md) for provider and file effects.

### skills/caveman-compress/README.md → skills/caveman-compress/SKILL.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/caveman-compress/README.md:5](../../skills/caveman-compress/README.md#L5) (current): replaced on success. Read &#91;SKILL.md&#93;(SKILL.md) for the workflow and intended

### skills/caveman-compress/scripts/&#95;&#95;main&#95;&#95;.py → skills/caveman-compress/scripts/cli.py

resource; current. When loading this module

- [skills/caveman-compress/scripts/&#95;&#95;main&#95;&#95;.py:1](../../skills/caveman-compress/scripts/__main__.py#L1) (current): from .cli import main

### skills/caveman-compress/scripts/cli.py → skills/caveman-compress/scripts/compress.py

resource; current. When loading this module

- [skills/caveman-compress/scripts/cli.py:31](../../skills/caveman-compress/scripts/cli.py#L31) (current): from .compress import backup&#95;dir&#95;for, compress&#95;file

### skills/caveman-compress/scripts/cli.py → skills/caveman-compress/scripts/detect.py

resource; current. When loading this module

- [skills/caveman-compress/scripts/cli.py:32](../../skills/caveman-compress/scripts/cli.py#L32) (current): from .detect import detect&#95;file&#95;type, should&#95;compress

### skills/caveman-compress/scripts/compress.py → skills/caveman-compress/scripts/detect.py

resource; current. When loading this module

- [skills/caveman-compress/scripts/compress.py:360](../../skills/caveman-compress/scripts/compress.py#L360) (current): from .detect import should&#95;compress

### skills/caveman-compress/scripts/compress.py → skills/caveman-compress/scripts/validate.py

resource; current. When loading this module

- [skills/caveman-compress/scripts/compress.py:361](../../skills/caveman-compress/scripts/compress.py#L361) (current): from .validate import validate

### skills/caveman-compress/SECURITY.md → skills/caveman-compress/README.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/caveman-compress/SECURITY.md:4](../../skills/caveman-compress/SECURITY.md#L4) (current): backup and validating a staged candidate. Read &#91;backup recovery&#93;(README.md#backup-recovery)

### skills/caveman-compress/SECURITY.md → skills/caveman-compress/SKILL.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/caveman-compress/SECURITY.md:44](../../skills/caveman-compress/SECURITY.md#L44) (current): in &#91;SKILL.md&#93;(SKILL.md). No historical third-party security rating is claimed as a

### skills/caveman-compress/SKILL.md → skills/caveman-compress/README.md

resource; current. For requested backup restoration or deliberate recompression (conditional)

- [skills/caveman-compress/SKILL.md:51](../../skills/caveman-compress/SKILL.md#L51) (current): follow &#91;backup recovery&#93;(README.md#backup-recovery); never overwrite or discard a

### skills/caveman-compress/SKILL.md → skills/caveman-compress/scripts/&#95;&#95;main&#95;&#95;.py

resource; current. During the documented workflow; follow the quoted instruction

- [skills/caveman-compress/SKILL.md:29](../../skills/caveman-compress/SKILL.md#L29) (current): 3. From this skill directory, run the &#91;bundled entry point&#93;(scripts/&#95;&#95;main&#95;&#95;.py):

### skills/caveman-compress/SKILL.md → skills/caveman-compress/SECURITY.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/caveman-compress/SKILL.md:24](../../skills/caveman-compress/SKILL.md#L24) (current):    &#91;runtime/data-flow notes&#93;(SECURITY.md) before running. The contents may be sent

### skills/caveman-explore/README.md → skills/caveman-explore/LICENSE

resource; current. When copying or redistributing this package/guidance; preserve the notice (conditional)

- [skills/caveman-explore/README.md:8](../../skills/caveman-explore/README.md#L8) (current): copyright (c) 2026 Julius Brussee, under the bundled &#91;MIT license&#93;(LICENSE).

### skills/caveman-review/README.md → skills/caveman-review/LICENSE

resource; current. When copying or redistributing this package/guidance; preserve the notice (conditional)

- [skills/caveman-review/README.md:37](../../skills/caveman-review/README.md#L37) (current): Imported from &#91;JuliusBrussee/caveman&#93;(https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/skills/caveman-review), copyright (c) 2026 Julius Brussee, under the bundled &#91;MIT license&#93;(LICENSE). &#91;Upstream licensing scope&#93;(https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/LICENSING.md) classifies skills/ as MIT. The intake recorded an exact source match to that pinned revision; GT adaptations are listed below. This independent adaptation does not imply upstream sponsorship.

### skills/caveman-review/README.md → skills/caveman-review/SKILL.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/caveman-review/README.md:32](../../skills/caveman-review/README.md#L32) (current): - &#91;&#96;SKILL.md&#96;&#93;(./SKILL.md) — full LLM-facing instructions

### skills/caveman/README.md → skills/caveman/LICENSE

resource; current. When copying or redistributing this package/guidance; preserve the notice (conditional)

- [skills/caveman/README.md:44](../../skills/caveman/README.md#L44) (current): copyright (c) 2026 Julius Brussee, under the bundled &#91;MIT license&#93;(LICENSE).

### skills/caveman/README.md → skills/caveman/SKILL.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/caveman/README.md:23](../../skills/caveman/README.md#L23) (current): The host must discover and enable the GT plugin and load &#91;SKILL.md&#93;(SKILL.md)

### skills/caveman/SKILL.md → skills/caveman/LICENSE

resource; current. When copying or redistributing this package/guidance; preserve the notice (conditional)

- [skills/caveman/SKILL.md:97](../../skills/caveman/SKILL.md#L97) (current): when redistributing this package. Preserve the bundled &#91;MIT notice&#93;(LICENSE).

### skills/caveman/SKILL.md → skills/caveman/README.md

resource; current. For installation questions or redistribution (conditional)

- [skills/caveman/SKILL.md:96](../../skills/caveman/SKILL.md#L96) (current): &#91;usage and provenance guide&#93;(README.md); read it for installation questions or

### skills/create-issue/references/helper.md → skills/create-issue/scripts/run.mjs

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/create-issue/references/helper.md:3](../../skills/create-issue/references/helper.md#L3) (current): Read before executing &#91;the entry point&#93;(../scripts/run.mjs). Resolve its absolute

### skills/create-issue/scripts/api.mjs → skills/create-issue/scripts/contract.mjs

resource; current. When loading this module

- [skills/create-issue/scripts/api.mjs:2](../../skills/create-issue/scripts/api.mjs#L2) (current): import { API, LIMITS, REPOSITORY, REPOSITORY&#95;ID, WEBSITE, SubmissionError, positiveId } from './contract.mjs';

### skills/create-issue/scripts/run.mjs → skills/create-issue/scripts/contract.mjs

resource; current. When loading this module

- [skills/create-issue/scripts/run.mjs:2](../../skills/create-issue/scripts/run.mjs#L2) (current): import { LIMITS, REPOSITORY, SubmissionError, decodeInput } from './contract.mjs';

### skills/create-issue/scripts/run.mjs → skills/create-issue/scripts/runtime.mjs

resource; current. When loading this module

- [skills/create-issue/scripts/run.mjs:3](../../skills/create-issue/scripts/run.mjs#L3) (current): import { createRuntime } from './runtime.mjs';

### skills/create-issue/scripts/run.mjs → skills/create-issue/scripts/service.mjs

resource; current. When loading this module

- [skills/create-issue/scripts/run.mjs:4](../../skills/create-issue/scripts/run.mjs#L4) (current): import { submit } from './service.mjs';

### skills/create-issue/scripts/runtime.mjs → skills/create-issue/scripts/contract.mjs

resource; current. When loading this module

- [skills/create-issue/scripts/runtime.mjs:4](../../skills/create-issue/scripts/runtime.mjs#L4) (current): import { API, LIMITS, SubmissionError } from './contract.mjs';

### skills/create-issue/scripts/service.mjs → skills/create-issue/scripts/api.mjs

resource; current. When loading this module

- [skills/create-issue/scripts/service.mjs:2](../../skills/create-issue/scripts/service.mjs#L2) (current): import { Session, issueRecord, commentRecord, sameText } from './api.mjs';

### skills/create-issue/scripts/service.mjs → skills/create-issue/scripts/contract.mjs

resource; current. When loading this module

- [skills/create-issue/scripts/service.mjs:1](../../skills/create-issue/scripts/service.mjs#L1) (current): import { API, LIMITS, REPOSITORY, WEBSITE, validateRequest, SubmissionError } from './contract.mjs';

### skills/create-issue/SKILL.md → skills/create-issue/references/helper.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/create-issue/SKILL.md:44](../../skills/create-issue/SKILL.md#L44) (current): 2. Read the &#91;helper protocol&#93;(references/helper.md) before any helper call. Use

### skills/create-issue/SKILL.md → skills/create-issue/references/labels.md

resource; current. When labels are relevant to submission (conditional)

- [skills/create-issue/SKILL.md:50](../../skills/create-issue/SKILL.md#L50) (current): 3. Read the &#91;label meanings&#93;(references/labels.md) when labels are relevant.

### skills/create-issue/SKILL.md → skills/create-issue/scripts/run.mjs

resource; current. During the documented workflow; follow the quoted instruction

- [skills/create-issue/SKILL.md:45](../../skills/create-issue/SKILL.md#L45) (current):    its &#91;bundled entry point&#93;(scripts/run.mjs) and adjacent runtime modules from

### skills/create-skills/references/personal-installation.md → skills/create-skills/references/tools.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/create-skills/references/personal-installation.md:25](../../skills/create-skills/references/personal-installation.md#L25) (current): Read &#91;local tools&#93;(tools.md) before running the bundled &#96;install&#96; command. Show the

### skills/create-skills/references/specification.md → skills/create-skills/references/intent-capture.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/create-skills/references/specification.md:5](../../skills/create-skills/references/specification.md#L5) (current): selected GT grill-me dependency using the &#91;intent guide&#93;(intent-capture.md).

### skills/create-skills/references/submission.md → skills/create-skills/references/intent-capture.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/create-skills/references/submission.md:25](../../skills/create-skills/references/submission.md#L25) (current): &#91;intent capture guide&#93;(intent-capture.md), plus optional &#96;packageDirectory&#96;.

### skills/create-skills/references/submission.md → skills/create-skills/references/tools.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/create-skills/references/submission.md:17](../../skills/create-skills/references/submission.md#L17) (current): Read &#91;local tools&#93;(tools.md) before using the bundled &#96;prepare&#96; command to produce

### skills/create-skills/references/tools.md → skills/create-skills/scripts/run.mjs

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/create-skills/references/tools.md:3](../../skills/create-skills/references/tools.md#L3) (current): Resolve &#91;the entry point&#93;(../scripts/run.mjs) from this installed package, including

### skills/create-skills/scripts/install.mjs → skills/create-skills/scripts/package.mjs

resource; current. When loading this module

- [skills/create-skills/scripts/install.mjs:5](../../skills/create-skills/scripts/install.mjs#L5) (current): import { checkPackage, readPackage, regularDirectory } from './package.mjs';

### skills/create-skills/scripts/intent-record.mjs → skills/create-skills/scripts/review-handoff.mjs

resource; current. When loading this module

- [skills/create-skills/scripts/intent-record.mjs:1](../../skills/create-skills/scripts/intent-record.mjs#L1) (current): import { requireText } from './review-handoff.mjs';

### skills/create-skills/scripts/package.mjs → skills/create-skills/scripts/skill-package-validation.mjs

resource; current. When loading this module

- [skills/create-skills/scripts/package.mjs:4](../../skills/create-skills/scripts/package.mjs#L4) (current): import { validateSkill } from './skill-package-validation.mjs';

### skills/create-skills/scripts/run.mjs → skills/create-skills/scripts/install.mjs

resource; current. When loading this module

- [skills/create-skills/scripts/run.mjs:6](../../skills/create-skills/scripts/run.mjs#L6) (current): import { installPackage } from './install.mjs';

### skills/create-skills/scripts/run.mjs → skills/create-skills/scripts/package.mjs

resource; current. When loading this module

- [skills/create-skills/scripts/run.mjs:3](../../skills/create-skills/scripts/run.mjs#L3) (current): import { checkDirectory } from './package.mjs';

### skills/create-skills/scripts/run.mjs → skills/create-skills/scripts/submission.mjs

resource; current. When loading this module

- [skills/create-skills/scripts/run.mjs:4](../../skills/create-skills/scripts/run.mjs#L4) (current): import { prepareSubmission, nextSubmission, submissionLimits } from './submission.mjs';

### skills/create-skills/scripts/skill-package-validation.mjs → skills/create-skills/scripts/release-validation.mjs

resource; current. When loading this module

- [skills/create-skills/scripts/skill-package-validation.mjs:2](../../skills/create-skills/scripts/skill-package-validation.mjs#L2) (current): import { parseRelease } from './release-validation.mjs';

### skills/create-skills/scripts/submission.mjs → skills/create-skills/scripts/intent-record.mjs

resource; current. When loading this module

- [skills/create-skills/scripts/submission.mjs:3](../../skills/create-skills/scripts/submission.mjs#L3) (current): import { intentSections } from './intent-record.mjs';

### skills/create-skills/scripts/submission.mjs → skills/create-skills/scripts/package.mjs

resource; current. When loading this module

- [skills/create-skills/scripts/submission.mjs:1](../../skills/create-skills/scripts/submission.mjs#L1) (current): import { sha256, readPackage } from './package.mjs';

### skills/create-skills/scripts/submission.mjs → skills/create-skills/scripts/review-handoff.mjs

resource; current. When loading this module

- [skills/create-skills/scripts/submission.mjs:2](../../skills/create-skills/scripts/submission.mjs#L2) (current): import { requireText, bytes, lf, split, fenced, prepareHandoff } from './review-handoff.mjs';

### skills/create-skills/SKILL.md → skills/create-skills/assets/matt-pocock-license.txt

resource; current. When copying or redistributing this package/guidance; preserve the notice (conditional)

- [skills/create-skills/SKILL.md:65](../../skills/create-skills/SKILL.md#L65) (current): &#91;Matt Pocock license notice&#93;(assets/matt-pocock-license.txt); read it when copying

### skills/create-skills/SKILL.md → skills/create-skills/references/intent-capture.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/create-skills/SKILL.md:14](../../skills/create-skills/SKILL.md#L14) (current): 1. Read the &#91;intent capture guide&#93;(references/intent-capture.md) at the start,

### skills/create-skills/SKILL.md → skills/create-skills/references/package-rules.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/create-skills/SKILL.md:25](../../skills/create-skills/SKILL.md#L25) (current):    drafting instructions and the &#91;GT package rules&#93;(references/package-rules.md)

### skills/create-skills/SKILL.md → skills/create-skills/references/personal-installation.md

resource; current. After verified submission, only if the user requests a personal copy (conditional)

- [skills/create-skills/SKILL.md:52](../../skills/create-skills/SKILL.md#L52) (current):    user says yes, read &#91;personal installation&#93;(references/personal-installation.md)

### skills/create-skills/SKILL.md → skills/create-skills/references/specification.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/create-skills/SKILL.md:15](../../skills/create-skills/SKILL.md#L15) (current):    then the &#91;interview and specification guide&#93;(references/specification.md).

### skills/create-skills/SKILL.md → skills/create-skills/references/submission.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/create-skills/SKILL.md:40](../../skills/create-skills/SKILL.md#L40) (current): 4. Read &#91;submission and recovery&#93;(references/submission.md). Resolve the intended

### skills/create-skills/SKILL.md → skills/create-skills/references/tools.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/create-skills/SKILL.md:32](../../skills/create-skills/SKILL.md#L32) (current): 3. Read &#91;local tools and checks&#93;(references/tools.md). Attempt applicable

### skills/create-skills/SKILL.md → skills/create-skills/references/writing.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/create-skills/SKILL.md:24](../../skills/create-skills/SKILL.md#L24) (current):    Read the &#91;writing guidance&#93;(references/writing.md) before

### skills/domain-modeling/SKILL.md → skills/domain-modeling/ADR-FORMAT.md

resource; current. When an ADR is warranted and authorized (conditional)

- [skills/domain-modeling/SKILL.md:87](../../skills/domain-modeling/SKILL.md#L87) (current): If any of the three is missing, skip the ADR. Use the format in &#91;ADR-FORMAT.md&#93;(./ADR-FORMAT.md).

### skills/domain-modeling/SKILL.md → skills/domain-modeling/assets/matt-pocock-license.txt

resource; current. When copying or redistributing this package/guidance; preserve the notice (conditional)

- [skills/domain-modeling/SKILL.md:96](../../skills/domain-modeling/SKILL.md#L96) (current): the bundled &#91;MIT notice&#93;(assets/matt-pocock-license.txt) when copying or redistributing them.

### skills/domain-modeling/SKILL.md → skills/domain-modeling/CONTEXT-FORMAT.md

resource; current. When recording agreed domain terms (conditional)

- [skills/domain-modeling/SKILL.md:75](../../skills/domain-modeling/SKILL.md#L75) (current): When a term is resolved, update &#96;CONTEXT.md&#96; right there. Don't batch these up: capture them as they happen. Use the format in &#91;CONTEXT-FORMAT.md&#93;(./CONTEXT-FORMAT.md).

### skills/grill-with-docs/SKILL.md → skills/grill-with-docs/assets/matt-pocock-license.txt

resource; current. When copying or redistributing this package/guidance; preserve the notice (conditional)

- [skills/grill-with-docs/SKILL.md:35](../../skills/grill-with-docs/SKILL.md#L35) (current): &#91;MIT notice&#93;(assets/matt-pocock-license.txt) when copying or redistributing this skill.

### skills/grilling/SKILL.md → skills/grilling/assets/matt-pocock-license.txt

resource; current. When copying or redistributing this package/guidance; preserve the notice (conditional)

- [skills/grilling/SKILL.md:42](../../skills/grilling/SKILL.md#L42) (current): &#91;MIT notice&#93;(assets/matt-pocock-license.txt) when copying or redistributing this skill.

### skills/skill-steal/references/submission.md → skills/skill-steal/references/clarification.md

resource; current. When intent is unclear or adaptation could change behavior (conditional)

- [skills/skill-steal/references/submission.md:27](../../skills/skill-steal/references/submission.md#L27) (current): &#91;clarification guide&#93;(clarification.md), plus optional &#96;packageDirectory&#96;.

### skills/skill-steal/references/submission.md → skills/skill-steal/references/tools.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/skill-steal/references/submission.md:19](../../skills/skill-steal/references/submission.md#L19) (current): Read &#91;local tools&#93;(tools.md) before using the bundled &#96;prepare&#96; command to produce

### skills/skill-steal/references/tools.md → skills/skill-steal/scripts/run.mjs

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/skill-steal/references/tools.md:5](../../skills/skill-steal/references/tools.md#L5) (current): Resolve &#91;the entry point&#93;(../scripts/run.mjs) from this installed package, including

### skills/skill-steal/scripts/intent-record.mjs → skills/skill-steal/scripts/review-handoff.mjs

resource; current. When loading this module

- [skills/skill-steal/scripts/intent-record.mjs:1](../../skills/skill-steal/scripts/intent-record.mjs#L1) (current): import { requireText } from './review-handoff.mjs';

### skills/skill-steal/scripts/package.mjs → skills/skill-steal/scripts/skill-package-validation.mjs

resource; current. When loading this module

- [skills/skill-steal/scripts/package.mjs:4](../../skills/skill-steal/scripts/package.mjs#L4) (current): import { validateSkill } from './skill-package-validation.mjs';

### skills/skill-steal/scripts/run.mjs → skills/skill-steal/scripts/package.mjs

resource; current. When loading this module

- [skills/skill-steal/scripts/run.mjs:4](../../skills/skill-steal/scripts/run.mjs#L4) (current): import { checkDirectory } from './package.mjs';

### skills/skill-steal/scripts/run.mjs → skills/skill-steal/scripts/submission.mjs

resource; current. When loading this module

- [skills/skill-steal/scripts/run.mjs:5](../../skills/skill-steal/scripts/run.mjs#L5) (current): import { prepareSubmission, nextSubmission, submissionLimits } from './submission.mjs';

### skills/skill-steal/scripts/skill-package-validation.mjs → skills/skill-steal/scripts/release-validation.mjs

resource; current. When loading this module

- [skills/skill-steal/scripts/skill-package-validation.mjs:2](../../skills/skill-steal/scripts/skill-package-validation.mjs#L2) (current): import { parseRelease } from './release-validation.mjs';

### skills/skill-steal/scripts/submission.mjs → skills/skill-steal/scripts/intent-record.mjs

resource; current. When loading this module

- [skills/skill-steal/scripts/submission.mjs:3](../../skills/skill-steal/scripts/submission.mjs#L3) (current): import { intentSections } from './intent-record.mjs';

### skills/skill-steal/scripts/submission.mjs → skills/skill-steal/scripts/package.mjs

resource; current. When loading this module

- [skills/skill-steal/scripts/submission.mjs:1](../../skills/skill-steal/scripts/submission.mjs#L1) (current): import { sha256, readPackage } from './package.mjs';

### skills/skill-steal/scripts/submission.mjs → skills/skill-steal/scripts/review-handoff.mjs

resource; current. When loading this module

- [skills/skill-steal/scripts/submission.mjs:2](../../skills/skill-steal/scripts/submission.mjs#L2) (current): import { requireText, bytes, lf, split, fenced, prepareHandoff } from './review-handoff.mjs';

### skills/skill-steal/SKILL.md → skills/skill-steal/references/clarification.md

resource; current. When intent is unclear or adaptation could change behavior (conditional)

- [skills/skill-steal/SKILL.md:25](../../skills/skill-steal/SKILL.md#L25) (current):    &#91;clarification and dependencies&#93;(references/clarification.md) and invoke the

### skills/skill-steal/SKILL.md → skills/skill-steal/references/package-rules.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skill-steal/SKILL.md:19](../../skills/skill-steal/SKILL.md#L19) (current): 2. Read the bundled &#91;GT package rules&#93;(references/package-rules.md) before deciding

### skills/skill-steal/SKILL.md → skills/skill-steal/references/source.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skill-steal/SKILL.md:14](../../skills/skill-steal/SKILL.md#L14) (current):    crawl unrelated directories. Read &#91;source inspection&#93;(references/source.md)

### skills/skill-steal/SKILL.md → skills/skill-steal/references/submission.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skill-steal/SKILL.md:45](../../skills/skill-steal/SKILL.md#L45) (current):    evidence. Read &#91;submission and recovery&#93;(references/submission.md) to prepare

### skills/skill-steal/SKILL.md → skills/skill-steal/references/tools.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skill-steal/SKILL.md:38](../../skills/skill-steal/SKILL.md#L38) (current): 5. Read &#91;local tools and checks&#93;(references/tools.md). Use the bundled checker and

### skills/skill-tweak/references/evidence.md → skills/skill-tweak/references/intent-capture.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/skill-tweak/references/evidence.md:12](../../skills/skill-tweak/references/evidence.md#L12) (current): following the &#91;intent capture guide&#93;(intent-capture.md). Incident evidence explains

### skills/skill-tweak/references/submission.md → skills/skill-tweak/references/intent-capture.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/skill-tweak/references/submission.md:12](../../skills/skill-tweak/references/submission.md#L12) (current): from the &#91;intent capture guide&#93;(intent-capture.md). &#96;report&#96; follows the

### skills/skill-tweak/references/submission.md → skills/skill-tweak/scripts/run.mjs

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/skill-tweak/references/submission.md:3](../../skills/skill-tweak/references/submission.md#L3) (current): Use the bundled &#91;entry point&#93;(../scripts/run.mjs) with Node 22+:

### skills/skill-tweak/references/submission.md → skills/skill-tweak/templates/issue.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/skill-tweak/references/submission.md:13](../../skills/skill-tweak/references/submission.md#L13) (current): &#91;issue template&#93;(../templates/issue.md); keep the recap and interview separate

### skills/skill-tweak/scripts/intent-record.mjs → skills/skill-tweak/scripts/review-handoff.mjs

resource; current. When loading this module

- [skills/skill-tweak/scripts/intent-record.mjs:1](../../skills/skill-tweak/scripts/intent-record.mjs#L1) (current): import { requireText } from './review-handoff.mjs';

### skills/skill-tweak/scripts/run.mjs → skills/skill-tweak/scripts/submission.mjs

resource; current. When loading this module

- [skills/skill-tweak/scripts/run.mjs:2](../../skills/skill-tweak/scripts/run.mjs#L2) (current): import { prepareSubmission, nextSubmission, submissionLimits } from './submission.mjs';

### skills/skill-tweak/scripts/submission.mjs → skills/skill-tweak/scripts/intent-record.mjs

resource; current. When loading this module

- [skills/skill-tweak/scripts/submission.mjs:2](../../skills/skill-tweak/scripts/submission.mjs#L2) (current): import { intentSections } from './intent-record.mjs';

### skills/skill-tweak/scripts/submission.mjs → skills/skill-tweak/scripts/review-handoff.mjs

resource; current. When loading this module

- [skills/skill-tweak/scripts/submission.mjs:1](../../skills/skill-tweak/scripts/submission.mjs#L1) (current): import { requireText, prepareHandoff } from './review-handoff.mjs';

### skills/skill-tweak/SKILL.md → skills/skill-tweak/references/evidence.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skill-tweak/SKILL.md:20](../../skills/skill-tweak/SKILL.md#L20) (current):    &#91;evidence guide&#93;(references/evidence.md) and

### skills/skill-tweak/SKILL.md → skills/skill-tweak/references/intent-capture.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skill-tweak/SKILL.md:21](../../skills/skill-tweak/SKILL.md#L21) (current):    &#91;intent capture guide&#93;(references/intent-capture.md) now. Capture available

### skills/skill-tweak/SKILL.md → skills/skill-tweak/references/submission.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skill-tweak/SKILL.md:60](../../skills/skill-tweak/SKILL.md#L60) (current):    Read &#91;submission and recovery&#93;(references/submission.md) and prepare the bounded

### skills/skill-tweak/SKILL.md → skills/skill-tweak/templates/issue.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skill-tweak/SKILL.md:38](../../skills/skill-tweak/SKILL.md#L38) (current):    &#91;issue template&#93;(templates/issue.md) when drafting. Separate observed behavior,

### skills/skill-tweak/templates/issue.md → skills/skill-tweak/references/submission.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/skill-tweak/templates/issue.md:6](../../skills/skill-tweak/templates/issue.md#L6) (current): interview record using the &#91;submission guide&#93;(../references/submission.md); both

### skills/skills-restore/references/operations.md → skills/skills-restore/scripts/exporter/README.md

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/skills-restore/references/operations.md:5](../../skills/skills-restore/references/operations.md#L5) (current): Read the &#91;direct guide&#93;(../scripts/exporter/README.md) for runtime, filesystem and

### skills/skills-restore/references/operations.md → skills/skills-restore/scripts/exporter/run.mjs

resource; current. When following the source guidance or its documented branch (conditional)

- [skills/skills-restore/references/operations.md:4](../../skills/skills-restore/references/operations.md#L4) (current): &#91;entry point&#93;(../scripts/exporter/run.mjs) from the loaded skill's directory.

### skills/skills-restore/scripts/exporter/export-cli.mjs → skills/skills-restore/scripts/exporter/export-filesystem.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/export-cli.mjs:4](../../skills/skills-restore/scripts/exporter/export-cli.mjs#L4) (current): import { checkedPath, inspectCopy, targetPaths } from './export-filesystem.mjs';

### skills/skills-restore/scripts/exporter/export-cli.mjs → skills/skills-restore/scripts/exporter/export-protocol.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/export-cli.mjs:3](../../skills/skills-restore/scripts/exporter/export-cli.mjs#L3) (current): import { acquireCatalog, checkRuntime, executePlan, makePlan, reviewPlan } from './export-protocol.mjs';

### skills/skills-restore/scripts/exporter/export-cli.mjs → skills/skills-restore/scripts/exporter/export-source.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/export-cli.mjs:5](../../skills/skills-restore/scripts/exporter/export-cli.mjs#L5) (current): import { PROTOCOL&#95;VERSION, requireExport } from './export-source.mjs';

### skills/skills-restore/scripts/exporter/export-filesystem.mjs → skills/skills-restore/scripts/exporter/export-source.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/export-filesystem.mjs:7](../../skills/skills-restore/scripts/exporter/export-filesystem.mjs#L7) (current): import { EXPORTER&#95;VERSION, PROTOCOL&#95;VERSION, REPOSITORY, prepareSource, requireExport, sha256, validateSourcePath } from './export-source.mjs';

### skills/skills-restore/scripts/exporter/export-protocol.mjs → skills/skills-restore/scripts/exporter/export-filesystem.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/export-protocol.mjs:7](../../skills/skills-restore/scripts/exporter/export-protocol.mjs#L7) (current): import { checkedPath, createCopy, ensureDirectory, isSecurityError, targetPaths } from './export-filesystem.mjs';

### skills/skills-restore/scripts/exporter/export-protocol.mjs → skills/skills-restore/scripts/exporter/export-source.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/export-protocol.mjs:8](../../skills/skills-restore/scripts/exporter/export-protocol.mjs#L8) (current): import { EXPORTER&#95;VERSION, PROTOCOL&#95;VERSION, REPOSITORY, fileManifest, prepareSource, requireExport, sha256 } from './export-source.mjs';

### skills/skills-restore/scripts/exporter/export-protocol.mjs → skills/skills-restore/scripts/exporter/release-catalog-reader.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/export-protocol.mjs:5](../../skills/skills-restore/scripts/exporter/export-protocol.mjs#L5) (current): import { readReleaseCatalog, repositoryIdentity } from './release-catalog-reader.mjs';

### skills/skills-restore/scripts/exporter/export-protocol.mjs → skills/skills-restore/scripts/exporter/release-snapshots.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/export-protocol.mjs:6](../../skills/skills-restore/scripts/exporter/export-protocol.mjs#L6) (current): import { readFirstParentCommits, readGitFiles, readGitSkillTrees, readRepositoryOrigin, resolveCommit } from './release-snapshots.mjs';

### skills/skills-restore/scripts/exporter/export-source.mjs → skills/skills-restore/scripts/exporter/release-catalog.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/export-source.mjs:4](../../skills/skills-restore/scripts/exporter/export-source.mjs#L4) (current): import { skillContentIdentity } from './release-catalog.mjs';

### skills/skills-restore/scripts/exporter/export-source.mjs → skills/skills-restore/scripts/exporter/release-validation.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/export-source.mjs:3](../../skills/skills-restore/scripts/exporter/export-source.mjs#L3) (current): import { parseRelease } from './release-validation.mjs';

### skills/skills-restore/scripts/exporter/release-catalog-reader.mjs → skills/skills-restore/scripts/exporter/release-catalog.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/release-catalog-reader.mjs:4](../../skills/skills-restore/scripts/exporter/release-catalog-reader.mjs#L4) (current): import { buildReleaseCatalog } from './release-catalog.mjs';

### skills/skills-restore/scripts/exporter/release-catalog-reader.mjs → skills/skills-restore/scripts/exporter/release-snapshots.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/release-catalog-reader.mjs:5](../../skills/skills-restore/scripts/exporter/release-catalog-reader.mjs#L5) (current): import { readFirstParentCommits, readGitFiles, readGitSkillTrees, readRepositoryOrigin, resolveCommit } from './release-snapshots.mjs';

### skills/skills-restore/scripts/exporter/release-catalog.mjs → skills/skills-restore/scripts/exporter/release-validation.mjs

resource; current. When loading this module

- [skills/skills-restore/scripts/exporter/release-catalog.mjs:3](../../skills/skills-restore/scripts/exporter/release-catalog.mjs#L3) (current): import { parseRelease, validateReleaseChange } from './release-validation.mjs';

### skills/skills-restore/SKILL.md → skills/skills-restore/references/operations.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skills-restore/SKILL.md:16](../../skills/skills-restore/SKILL.md#L16) (current): Read the bundled &#91;operation procedure&#93;(references/operations.md) before calling

### skills/skills-restore/SKILL.md → skills/skills-restore/scripts/exporter/README.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skills-restore/SKILL.md:21](../../skills/skills-restore/SKILL.md#L21) (current): modules or substitute another implementation. The bundled &#91;direct guide&#93;(scripts/exporter/README.md)

### skills/skills-restore/SKILL.md → skills/skills-restore/scripts/exporter/run.mjs

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skills-restore/SKILL.md:17](../../skills/skills-restore/SKILL.md#L17) (current): tools. Use only the fixed &#91;exporter entry point&#93;(scripts/exporter/run.mjs) beside

### skills/skills-status/SKILL.md → skills/skills-status/references/installation-target.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skills-status/SKILL.md:15](../../skills/skills-status/SKILL.md#L15) (current): Read &#91;the installation selection procedure&#93;(references/installation-target.md).

### skills/skills-update/SKILL.md → skills/skills-update/references/installation-target.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skills-update/SKILL.md:17](../../skills/skills-update/SKILL.md#L17) (current): Read &#91;the installation selection procedure&#93;(references/installation-target.md),

### skills/skills-update/SKILL.md → skills/skills-update/references/update-report.md

resource; current. During the documented workflow; follow the quoted instruction

- [skills/skills-update/SKILL.md:18](../../skills/skills-update/SKILL.md#L18) (current): then &#91;the snapshot and reporting procedure&#93;(references/update-report.md) before

### exporter/run.mjs → exporter/bundle.json

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [exporter/run.mjs:12](../../exporter/run.mjs#L12) (current):   const manifestBytes = readFileSync(join(bundle, 'bundle.json'));

### exporter/run.mjs → exporter/export-cli.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [exporter/run.mjs:17](../../exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### exporter/run.mjs → exporter/export-filesystem.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [exporter/run.mjs:17](../../exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### exporter/run.mjs → exporter/export-protocol.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [exporter/run.mjs:17](../../exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### exporter/run.mjs → exporter/export-source.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [exporter/run.mjs:17](../../exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### exporter/run.mjs → exporter/release-catalog-reader.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [exporter/run.mjs:17](../../exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### exporter/run.mjs → exporter/release-catalog.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [exporter/run.mjs:17](../../exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### exporter/run.mjs → exporter/release-snapshots.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [exporter/run.mjs:17](../../exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### exporter/run.mjs → exporter/release-validation.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [exporter/run.mjs:17](../../exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### skills/skills-restore/scripts/exporter/run.mjs → skills/skills-restore/scripts/exporter/bundle.json

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [skills/skills-restore/scripts/exporter/run.mjs:12](../../skills/skills-restore/scripts/exporter/run.mjs#L12) (current):   const manifestBytes = readFileSync(join(bundle, 'bundle.json'));

### skills/skills-restore/scripts/exporter/run.mjs → skills/skills-restore/scripts/exporter/export-cli.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [skills/skills-restore/scripts/exporter/run.mjs:17](../../skills/skills-restore/scripts/exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### skills/skills-restore/scripts/exporter/run.mjs → skills/skills-restore/scripts/exporter/export-filesystem.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [skills/skills-restore/scripts/exporter/run.mjs:17](../../skills/skills-restore/scripts/exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### skills/skills-restore/scripts/exporter/run.mjs → skills/skills-restore/scripts/exporter/export-protocol.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [skills/skills-restore/scripts/exporter/run.mjs:17](../../skills/skills-restore/scripts/exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### skills/skills-restore/scripts/exporter/run.mjs → skills/skills-restore/scripts/exporter/export-source.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [skills/skills-restore/scripts/exporter/run.mjs:17](../../skills/skills-restore/scripts/exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### skills/skills-restore/scripts/exporter/run.mjs → skills/skills-restore/scripts/exporter/release-catalog-reader.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [skills/skills-restore/scripts/exporter/run.mjs:17](../../skills/skills-restore/scripts/exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### skills/skills-restore/scripts/exporter/run.mjs → skills/skills-restore/scripts/exporter/release-catalog.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [skills/skills-restore/scripts/exporter/run.mjs:17](../../skills/skills-restore/scripts/exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### skills/skills-restore/scripts/exporter/run.mjs → skills/skills-restore/scripts/exporter/release-snapshots.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [skills/skills-restore/scripts/exporter/run.mjs:17](../../skills/skills-restore/scripts/exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### skills/skills-restore/scripts/exporter/run.mjs → skills/skills-restore/scripts/exporter/release-validation.mjs

resource; current. Exporter verifies the manifest and every declared module before running any operation

- [skills/skills-restore/scripts/exporter/run.mjs:17](../../skills/skills-restore/scripts/exporter/run.mjs#L17) (current):   for (const &#91;name, digest&#93; of Object.entries(manifest.files)) {

### skills/caveman-compress/scripts/&#95;&#95;main&#95;&#95;.py → skills/caveman-compress/scripts/&#95;&#95;init&#95;&#95;.py

resource; current. Python initializes the scripts package for the documented -m invocation

- [skills/caveman-compress/SKILL.md:32](../../skills/caveman-compress/SKILL.md#L32) (current):    python3 -B -m scripts "&lt;absolute&#95;filepath&gt;"

### help → caveman

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:139](../../skills/help/SKILL.md#L139) (current): &#96;caveman&#96;

### help → caveman-commit

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:137](../../skills/help/SKILL.md#L137) (current): &#96;caveman-commit&#96;

### help → caveman-compress

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:141](../../skills/help/SKILL.md#L141) (current): &#96;caveman-compress&#96;

### help → caveman-explore

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:132](../../skills/help/SKILL.md#L132) (current): &#96;caveman-explore&#96;

### help → caveman-review

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:135](../../skills/help/SKILL.md#L135) (current): &#96;caveman-review&#96;

### help → create-issue

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:107](../../skills/help/SKILL.md#L107) (current): &#96;create-issue&#96;

### help → create-skills

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:89](../../skills/help/SKILL.md#L89) (current): &#96;create-skills&#96;

### help → domain-modeling

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:156](../../skills/help/SKILL.md#L156) (current): &#96;domain-modeling&#96;

### help → grill-me

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:71](../../skills/help/SKILL.md#L71) (current): &#96;grill-me&#96;

### help → grill-with-docs

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:74](../../skills/help/SKILL.md#L74) (current): &#96;grill-with-docs&#96;

### help → grilling

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:153](../../skills/help/SKILL.md#L153) (current): &#96;grilling&#96;

### help → skill-steal

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:98](../../skills/help/SKILL.md#L98) (current): &#96;skill-steal&#96;

### help → skill-tweak

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:94](../../skills/help/SKILL.md#L94) (current): &#96;skill-tweak&#96;

### help → skills-restore

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:120](../../skills/help/SKILL.md#L120) (current): &#96;skills-restore&#96;

### help → skills-status

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:113](../../skills/help/SKILL.md#L113) (current): &#96;skills-status&#96;

### help → skills-update

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:116](../../skills/help/SKILL.md#L116) (current): &#96;skills-update&#96;

### help → why-not

skill; current. Only when the question needs details missing from Help: read this skill's GT instructions and necessary explanations as data; never invoke or delegate its workflow. (conditional)

- [skills/help/SKILL.md:32](../../skills/help/SKILL.md#L32) (current): When they<br>lack information needed for an answer, use a supported read-only file/resource<br>capability to read the relevant GT skill's &#96;SKILL.md&#96; and necessary bundled<br>explanations as data. Do not activate the skill through an invocation tool.
- [skills/help/SKILL.md:78](../../skills/help/SKILL.md#L78) (current): &#96;why-not&#96;

### skills/help/SKILL.md → skills/help/assets/matt-pocock-license.txt

resource; current. When copying or redistributing this adaptation, retain the bundled notice. (conditional)

- [skills/help/SKILL.md:198](../../skills/help/SKILL.md#L198) (current): &#91;Matt Pocock MIT notice&#93;(assets/matt-pocock-license.txt).

### skills/create-skills/scripts/package.mjs → scripts/create-skills/package.mjs

source; current. Generated from this maintained source

- [scripts/build-create-skills.mjs:25](../../scripts/build-create-skills.mjs#L25) (current):   const files = new Map(maintained.map(name =&gt; &#91;&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts/create-skills', name), 'utf8')).replaceAll("from '../", "from './")&#93;));

### skills/create-skills/scripts/package.mjs → scripts/build-create-skills.mjs

build; current. Generated by this builder

- [scripts/build-create-skills.mjs:25](../../scripts/build-create-skills.mjs#L25) (current):   const files = new Map(maintained.map(name =&gt; &#91;&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts/create-skills', name), 'utf8')).replaceAll("from '../", "from './")&#93;));

### skills/create-skills/scripts/run.mjs → scripts/create-skills/run.mjs

source; current. Generated from this maintained source

- [scripts/build-create-skills.mjs:25](../../scripts/build-create-skills.mjs#L25) (current):   const files = new Map(maintained.map(name =&gt; &#91;&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts/create-skills', name), 'utf8')).replaceAll("from '../", "from './")&#93;));

### skills/create-skills/scripts/run.mjs → scripts/build-create-skills.mjs

build; current. Generated by this builder

- [scripts/build-create-skills.mjs:25](../../scripts/build-create-skills.mjs#L25) (current):   const files = new Map(maintained.map(name =&gt; &#91;&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts/create-skills', name), 'utf8')).replaceAll("from '../", "from './")&#93;));

### skills/create-skills/scripts/submission.mjs → scripts/create-skills/submission.mjs

source; current. Generated from this maintained source

- [scripts/build-create-skills.mjs:25](../../scripts/build-create-skills.mjs#L25) (current):   const files = new Map(maintained.map(name =&gt; &#91;&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts/create-skills', name), 'utf8')).replaceAll("from '../", "from './")&#93;));

### skills/create-skills/scripts/submission.mjs → scripts/build-create-skills.mjs

build; current. Generated by this builder

- [scripts/build-create-skills.mjs:25](../../scripts/build-create-skills.mjs#L25) (current):   const files = new Map(maintained.map(name =&gt; &#91;&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts/create-skills', name), 'utf8')).replaceAll("from '../", "from './")&#93;));

### skills/create-skills/scripts/install.mjs → scripts/create-skills/install.mjs

source; current. Generated from this maintained source

- [scripts/build-create-skills.mjs:25](../../scripts/build-create-skills.mjs#L25) (current):   const files = new Map(maintained.map(name =&gt; &#91;&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts/create-skills', name), 'utf8')).replaceAll("from '../", "from './")&#93;));

### skills/create-skills/scripts/install.mjs → scripts/build-create-skills.mjs

build; current. Generated by this builder

- [scripts/build-create-skills.mjs:25](../../scripts/build-create-skills.mjs#L25) (current):   const files = new Map(maintained.map(name =&gt; &#91;&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts/create-skills', name), 'utf8')).replaceAll("from '../", "from './")&#93;));

### skills/create-skills/scripts/skill-package-validation.mjs → scripts/skill-package-validation.mjs

source; current. Generated from this maintained source

- [scripts/build-create-skills.mjs:26](../../scripts/build-create-skills.mjs#L26) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts', name), 'utf8')));

### skills/create-skills/scripts/skill-package-validation.mjs → scripts/build-create-skills.mjs

build; current. Generated by this builder

- [scripts/build-create-skills.mjs:26](../../scripts/build-create-skills.mjs#L26) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts', name), 'utf8')));

### skills/create-skills/scripts/release-validation.mjs → scripts/release-validation.mjs

source; current. Generated from this maintained source

- [scripts/build-create-skills.mjs:26](../../scripts/build-create-skills.mjs#L26) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts', name), 'utf8')));

### skills/create-skills/scripts/release-validation.mjs → scripts/build-create-skills.mjs

build; current. Generated by this builder

- [scripts/build-create-skills.mjs:26](../../scripts/build-create-skills.mjs#L26) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts', name), 'utf8')));

### skills/create-skills/scripts/review-handoff.mjs → scripts/review-handoff.mjs

source; current. Generated from this maintained source

- [scripts/build-create-skills.mjs:26](../../scripts/build-create-skills.mjs#L26) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts', name), 'utf8')));

### skills/create-skills/scripts/review-handoff.mjs → scripts/build-create-skills.mjs

build; current. Generated by this builder

- [scripts/build-create-skills.mjs:26](../../scripts/build-create-skills.mjs#L26) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts', name), 'utf8')));

### skills/create-skills/scripts/intent-record.mjs → scripts/intent-record.mjs

source; current. Generated from this maintained source

- [scripts/build-create-skills.mjs:26](../../scripts/build-create-skills.mjs#L26) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts', name), 'utf8')));

### skills/create-skills/scripts/intent-record.mjs → scripts/build-create-skills.mjs

build; current. Generated by this builder

- [scripts/build-create-skills.mjs:26](../../scripts/build-create-skills.mjs#L26) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, normalize(readFileSync(join(base, 'scripts', name), 'utf8')));

### skills/create-skills/references/intent-capture.md → scripts/intent-capture.md

source; current. Generated from this maintained source

- [scripts/build-create-skills.mjs:27](../../scripts/build-create-skills.mjs#L27) (current):   files.set('references/intent-capture.md', normalize(readFileSync(join(base, 'scripts/intent-capture.md'), 'utf8')));

### skills/create-skills/references/intent-capture.md → scripts/build-create-skills.mjs

build; current. Generated by this builder

- [scripts/build-create-skills.mjs:27](../../scripts/build-create-skills.mjs#L27) (current):   files.set('references/intent-capture.md', normalize(readFileSync(join(base, 'scripts/intent-capture.md'), 'utf8')));

### skills/create-skills/references/package-rules.md → CONTRIBUTING.md

source; current. Generated from this maintained source

- [scripts/build-create-skills.mjs:28](../../scripts/build-create-skills.mjs#L28) (current):   files.set('references/package-rules.md', guidance(readFileSync(join(base, 'CONTRIBUTING.md'), 'utf8')));

### skills/create-skills/references/package-rules.md → scripts/build-create-skills.mjs

build; current. Generated by this builder

- [scripts/build-create-skills.mjs:28](../../scripts/build-create-skills.mjs#L28) (current):   files.set('references/package-rules.md', guidance(readFileSync(join(base, 'CONTRIBUTING.md'), 'utf8')));

### skills/skill-tweak/scripts/run.mjs → scripts/skill-tweak/run.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-tweak.mjs:8](../../scripts/build-skill-tweak.mjs#L8) (current):   for (const name of &#91;'run.mjs', 'submission.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, readFileSync(join(base, 'scripts/skill-tweak', name), 'utf8').replaceAll("from '../", "from './"));

### skills/skill-tweak/scripts/run.mjs → scripts/build-skill-tweak.mjs

build; current. Generated by this builder

- [scripts/build-skill-tweak.mjs:8](../../scripts/build-skill-tweak.mjs#L8) (current):   for (const name of &#91;'run.mjs', 'submission.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, readFileSync(join(base, 'scripts/skill-tweak', name), 'utf8').replaceAll("from '../", "from './"));

### skills/skill-tweak/scripts/submission.mjs → scripts/skill-tweak/submission.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-tweak.mjs:8](../../scripts/build-skill-tweak.mjs#L8) (current):   for (const name of &#91;'run.mjs', 'submission.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, readFileSync(join(base, 'scripts/skill-tweak', name), 'utf8').replaceAll("from '../", "from './"));

### skills/skill-tweak/scripts/submission.mjs → scripts/build-skill-tweak.mjs

build; current. Generated by this builder

- [scripts/build-skill-tweak.mjs:8](../../scripts/build-skill-tweak.mjs#L8) (current):   for (const name of &#91;'run.mjs', 'submission.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, readFileSync(join(base, 'scripts/skill-tweak', name), 'utf8').replaceAll("from '../", "from './"));

### skills/skill-tweak/scripts/review-handoff.mjs → scripts/review-handoff.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-tweak.mjs:9](../../scripts/build-skill-tweak.mjs#L9) (current):   for (const name of &#91;'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, readFileSync(join(base, 'scripts', name), 'utf8'));

### skills/skill-tweak/scripts/review-handoff.mjs → scripts/build-skill-tweak.mjs

build; current. Generated by this builder

- [scripts/build-skill-tweak.mjs:9](../../scripts/build-skill-tweak.mjs#L9) (current):   for (const name of &#91;'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, readFileSync(join(base, 'scripts', name), 'utf8'));

### skills/skill-tweak/scripts/intent-record.mjs → scripts/intent-record.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-tweak.mjs:9](../../scripts/build-skill-tweak.mjs#L9) (current):   for (const name of &#91;'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, readFileSync(join(base, 'scripts', name), 'utf8'));

### skills/skill-tweak/scripts/intent-record.mjs → scripts/build-skill-tweak.mjs

build; current. Generated by this builder

- [scripts/build-skill-tweak.mjs:9](../../scripts/build-skill-tweak.mjs#L9) (current):   for (const name of &#91;'review-handoff.mjs', 'intent-record.mjs'&#93;) files.set(&#96;scripts/${name}&#96;, readFileSync(join(base, 'scripts', name), 'utf8'));

### skills/skill-tweak/references/intent-capture.md → scripts/intent-capture.md

source; current. Generated from this maintained source

- [scripts/build-skill-tweak.mjs:10](../../scripts/build-skill-tweak.mjs#L10) (current):   files.set('references/intent-capture.md', readFileSync(join(base, 'scripts/intent-capture.md'), 'utf8'));

### skills/skill-tweak/references/intent-capture.md → scripts/build-skill-tweak.mjs

build; current. Generated by this builder

- [scripts/build-skill-tweak.mjs:10](../../scripts/build-skill-tweak.mjs#L10) (current):   files.set('references/intent-capture.md', readFileSync(join(base, 'scripts/intent-capture.md'), 'utf8'));

### skills/skill-steal/scripts/run.mjs → scripts/skill-steal/run.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-steal.mjs:23](../../scripts/build-skill-steal.mjs#L23) (current):   files.set('scripts/run.mjs', read('scripts/skill-steal/run.mjs').replaceAll("from '../create-skills/", "from './"));

### skills/skill-steal/scripts/run.mjs → scripts/build-skill-steal.mjs

build; current. Generated by this builder

- [scripts/build-skill-steal.mjs:23](../../scripts/build-skill-steal.mjs#L23) (current):   files.set('scripts/run.mjs', read('scripts/skill-steal/run.mjs').replaceAll("from '../create-skills/", "from './"));

### skills/skill-steal/scripts/package.mjs → scripts/create-skills/package.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-steal.mjs:25](../../scripts/build-skill-steal.mjs#L25) (current):     files.set(&#96;scripts/${name}&#96;, read(&#96;scripts/create-skills/${name}&#96;).replaceAll("from '../", "from './"));

### skills/skill-steal/scripts/package.mjs → scripts/build-skill-steal.mjs

build; current. Generated by this builder

- [scripts/build-skill-steal.mjs:25](../../scripts/build-skill-steal.mjs#L25) (current):     files.set(&#96;scripts/${name}&#96;, read(&#96;scripts/create-skills/${name}&#96;).replaceAll("from '../", "from './"));

### skills/skill-steal/scripts/submission.mjs → scripts/create-skills/submission.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-steal.mjs:25](../../scripts/build-skill-steal.mjs#L25) (current):     files.set(&#96;scripts/${name}&#96;, read(&#96;scripts/create-skills/${name}&#96;).replaceAll("from '../", "from './"));

### skills/skill-steal/scripts/submission.mjs → scripts/build-skill-steal.mjs

build; current. Generated by this builder

- [scripts/build-skill-steal.mjs:25](../../scripts/build-skill-steal.mjs#L25) (current):     files.set(&#96;scripts/${name}&#96;, read(&#96;scripts/create-skills/${name}&#96;).replaceAll("from '../", "from './"));

### skills/skill-steal/scripts/skill-package-validation.mjs → scripts/skill-package-validation.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-steal.mjs:27](../../scripts/build-skill-steal.mjs#L27) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) {

### skills/skill-steal/scripts/skill-package-validation.mjs → scripts/build-skill-steal.mjs

build; current. Generated by this builder

- [scripts/build-skill-steal.mjs:27](../../scripts/build-skill-steal.mjs#L27) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) {

### skills/skill-steal/scripts/release-validation.mjs → scripts/release-validation.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-steal.mjs:27](../../scripts/build-skill-steal.mjs#L27) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) {

### skills/skill-steal/scripts/release-validation.mjs → scripts/build-skill-steal.mjs

build; current. Generated by this builder

- [scripts/build-skill-steal.mjs:27](../../scripts/build-skill-steal.mjs#L27) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) {

### skills/skill-steal/scripts/review-handoff.mjs → scripts/review-handoff.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-steal.mjs:27](../../scripts/build-skill-steal.mjs#L27) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) {

### skills/skill-steal/scripts/review-handoff.mjs → scripts/build-skill-steal.mjs

build; current. Generated by this builder

- [scripts/build-skill-steal.mjs:27](../../scripts/build-skill-steal.mjs#L27) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) {

### skills/skill-steal/scripts/intent-record.mjs → scripts/intent-record.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-steal.mjs:27](../../scripts/build-skill-steal.mjs#L27) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) {

### skills/skill-steal/scripts/intent-record.mjs → scripts/build-skill-steal.mjs

build; current. Generated by this builder

- [scripts/build-skill-steal.mjs:27](../../scripts/build-skill-steal.mjs#L27) (current):   for (const name of &#91;'skill-package-validation.mjs', 'release-validation.mjs', 'review-handoff.mjs', 'intent-record.mjs'&#93;) {

### skills/skill-steal/references/package-rules.md → CONTRIBUTING.md

source; current. Generated from this maintained source

- [scripts/build-skill-steal.mjs:30](../../scripts/build-skill-steal.mjs#L30) (current):   files.set('references/package-rules.md', guidance(read('CONTRIBUTING.md')));

### skills/skill-steal/references/package-rules.md → scripts/build-create-skills.mjs

source; current. Generated from this maintained source

- [scripts/build-skill-steal.mjs:30](../../scripts/build-skill-steal.mjs#L30) (current):   files.set('references/package-rules.md', guidance(read('CONTRIBUTING.md')));

### skills/skill-steal/references/package-rules.md → scripts/build-skill-steal.mjs

build; current. Generated by this builder

- [scripts/build-skill-steal.mjs:30](../../scripts/build-skill-steal.mjs#L30) (current):   files.set('references/package-rules.md', guidance(read('CONTRIBUTING.md')));

### skills/skill-steal/references/tools.md → skills/create-skills/references/tools.md

source; current. Generated from this maintained source

- [scripts/build-skill-steal.mjs:32](../../scripts/build-skill-steal.mjs#L32) (current):   files.set('references/tools.md', notice + replaceOnce(read('skills/create-skills/references/tools.md'), 'preparation and installation commands', 'preparation commands'));

### skills/skill-steal/references/tools.md → scripts/build-skill-steal.mjs

build; current. Generated by this builder

- [scripts/build-skill-steal.mjs:32](../../scripts/build-skill-steal.mjs#L32) (current):   files.set('references/tools.md', notice + replaceOnce(read('skills/create-skills/references/tools.md'), 'preparation and installation commands', 'preparation commands'));

### skills/skill-steal/references/submission.md → skills/create-skills/references/submission.md

source; current. Generated from this maintained source

- [scripts/build-skill-steal.mjs:33](../../scripts/build-skill-steal.mjs#L33) (current):   files.set('references/submission.md', notice + submissionGuidance(read('skills/create-skills/references/submission.md')));

### skills/skill-steal/references/submission.md → scripts/build-skill-steal.mjs

build; current. Generated by this builder

- [scripts/build-skill-steal.mjs:33](../../scripts/build-skill-steal.mjs#L33) (current):   files.set('references/submission.md', notice + submissionGuidance(read('skills/create-skills/references/submission.md')));

### skills/create-issue/scripts/api.mjs → scripts/issue-submission/api.mjs

source; current. Generated from this maintained source

- [scripts/build-issue-submission.mjs:11](../../scripts/build-issue-submission.mjs#L11) (current):   const files = runtimeNames.map(name =&gt; &#91;name, Buffer.from(readFileSync(join(source, name), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'))&#93;);

### skills/create-issue/scripts/api.mjs → scripts/build-issue-submission.mjs

build; current. Generated by this builder

- [scripts/build-issue-submission.mjs:11](../../scripts/build-issue-submission.mjs#L11) (current):   const files = runtimeNames.map(name =&gt; &#91;name, Buffer.from(readFileSync(join(source, name), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'))&#93;);

### skills/create-issue/scripts/contract.mjs → scripts/issue-submission/contract.mjs

source; current. Generated from this maintained source

- [scripts/build-issue-submission.mjs:11](../../scripts/build-issue-submission.mjs#L11) (current):   const files = runtimeNames.map(name =&gt; &#91;name, Buffer.from(readFileSync(join(source, name), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'))&#93;);

### skills/create-issue/scripts/contract.mjs → scripts/build-issue-submission.mjs

build; current. Generated by this builder

- [scripts/build-issue-submission.mjs:11](../../scripts/build-issue-submission.mjs#L11) (current):   const files = runtimeNames.map(name =&gt; &#91;name, Buffer.from(readFileSync(join(source, name), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'))&#93;);

### skills/create-issue/scripts/run.mjs → scripts/issue-submission/run.mjs

source; current. Generated from this maintained source

- [scripts/build-issue-submission.mjs:11](../../scripts/build-issue-submission.mjs#L11) (current):   const files = runtimeNames.map(name =&gt; &#91;name, Buffer.from(readFileSync(join(source, name), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'))&#93;);

### skills/create-issue/scripts/run.mjs → scripts/build-issue-submission.mjs

build; current. Generated by this builder

- [scripts/build-issue-submission.mjs:11](../../scripts/build-issue-submission.mjs#L11) (current):   const files = runtimeNames.map(name =&gt; &#91;name, Buffer.from(readFileSync(join(source, name), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'))&#93;);

### skills/create-issue/scripts/runtime.mjs → scripts/issue-submission/runtime.mjs

source; current. Generated from this maintained source

- [scripts/build-issue-submission.mjs:11](../../scripts/build-issue-submission.mjs#L11) (current):   const files = runtimeNames.map(name =&gt; &#91;name, Buffer.from(readFileSync(join(source, name), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'))&#93;);

### skills/create-issue/scripts/runtime.mjs → scripts/build-issue-submission.mjs

build; current. Generated by this builder

- [scripts/build-issue-submission.mjs:11](../../scripts/build-issue-submission.mjs#L11) (current):   const files = runtimeNames.map(name =&gt; &#91;name, Buffer.from(readFileSync(join(source, name), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'))&#93;);

### skills/create-issue/scripts/service.mjs → scripts/issue-submission/service.mjs

source; current. Generated from this maintained source

- [scripts/build-issue-submission.mjs:11](../../scripts/build-issue-submission.mjs#L11) (current):   const files = runtimeNames.map(name =&gt; &#91;name, Buffer.from(readFileSync(join(source, name), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'))&#93;);

### skills/create-issue/scripts/service.mjs → scripts/build-issue-submission.mjs

build; current. Generated by this builder

- [scripts/build-issue-submission.mjs:11](../../scripts/build-issue-submission.mjs#L11) (current):   const files = runtimeNames.map(name =&gt; &#91;name, Buffer.from(readFileSync(join(source, name), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'))&#93;);

### exporter/export-cli.mjs → scripts/export-cli.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/export-cli.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/export-filesystem.mjs → scripts/export-filesystem.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/export-filesystem.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/export-protocol.mjs → scripts/export-protocol.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/export-protocol.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/export-source.mjs → scripts/export-source.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/export-source.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/release-catalog-reader.mjs → scripts/release-catalog-reader.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/release-catalog-reader.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/release-catalog.mjs → scripts/release-catalog.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/release-catalog.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/release-snapshots.mjs → scripts/release-snapshots.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/release-snapshots.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/release-validation.mjs → scripts/release-validation.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/release-validation.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### exporter/bundle.json → scripts/export-cli.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### exporter/bundle.json → scripts/export-filesystem.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### exporter/bundle.json → scripts/export-protocol.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### exporter/bundle.json → scripts/export-source.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### exporter/bundle.json → scripts/release-catalog-reader.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### exporter/bundle.json → scripts/release-catalog.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### exporter/bundle.json → scripts/release-snapshots.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### exporter/bundle.json → scripts/release-validation.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### exporter/bundle.json → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### exporter/run.mjs → scripts/export-launcher.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### exporter/run.mjs → scripts/export-cli.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### exporter/run.mjs → scripts/export-filesystem.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### exporter/run.mjs → scripts/export-protocol.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### exporter/run.mjs → scripts/export-source.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### exporter/run.mjs → scripts/release-catalog-reader.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### exporter/run.mjs → scripts/release-catalog.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### exporter/run.mjs → scripts/release-snapshots.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### exporter/run.mjs → scripts/release-validation.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### exporter/run.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### skills/skills-restore/scripts/exporter/export-cli.mjs → scripts/export-cli.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/export-cli.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/export-filesystem.mjs → scripts/export-filesystem.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/export-filesystem.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/export-protocol.mjs → scripts/export-protocol.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/export-protocol.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/export-source.mjs → scripts/export-source.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/export-source.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/release-catalog-reader.mjs → scripts/release-catalog-reader.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/release-catalog-reader.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/release-catalog.mjs → scripts/release-catalog.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/release-catalog.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/release-snapshots.mjs → scripts/release-snapshots.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/release-snapshots.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/release-validation.mjs → scripts/release-validation.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/release-validation.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:11](../../scripts/build-exporter.mjs#L11) (current): const files = new Map(names.map(name =&gt; &#91;name, source(name)&#93;));

### skills/skills-restore/scripts/exporter/bundle.json → scripts/export-cli.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### skills/skills-restore/scripts/exporter/bundle.json → scripts/export-filesystem.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### skills/skills-restore/scripts/exporter/bundle.json → scripts/export-protocol.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### skills/skills-restore/scripts/exporter/bundle.json → scripts/export-source.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### skills/skills-restore/scripts/exporter/bundle.json → scripts/release-catalog-reader.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### skills/skills-restore/scripts/exporter/bundle.json → scripts/release-catalog.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### skills/skills-restore/scripts/exporter/bundle.json → scripts/release-snapshots.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### skills/skills-restore/scripts/exporter/bundle.json → scripts/release-validation.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### skills/skills-restore/scripts/exporter/bundle.json → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:14](../../scripts/build-exporter.mjs#L14) (current): files.set('bundle.json', manifest);

### skills/skills-restore/scripts/exporter/run.mjs → scripts/export-launcher.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### skills/skills-restore/scripts/exporter/run.mjs → scripts/export-cli.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### skills/skills-restore/scripts/exporter/run.mjs → scripts/export-filesystem.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### skills/skills-restore/scripts/exporter/run.mjs → scripts/export-protocol.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### skills/skills-restore/scripts/exporter/run.mjs → scripts/export-source.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### skills/skills-restore/scripts/exporter/run.mjs → scripts/release-catalog-reader.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### skills/skills-restore/scripts/exporter/run.mjs → scripts/release-catalog.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### skills/skills-restore/scripts/exporter/run.mjs → scripts/release-snapshots.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### skills/skills-restore/scripts/exporter/run.mjs → scripts/release-validation.mjs

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### skills/skills-restore/scripts/exporter/run.mjs → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:15](../../scripts/build-exporter.mjs#L15) (current): files.set('run.mjs', Buffer.from(source('export-launcher.mjs').toString().replace('&#95;&#95;MANIFEST&#95;HASH&#95;&#95;', hash(manifest))));

### skills/skills-restore/scripts/exporter/README.md → exporter/README.md

source; current. Generated from this maintained source

- [scripts/build-exporter.mjs:16](../../scripts/build-exporter.mjs#L16) (current): const guide = Buffer.from(readFileSync(join(root, 'exporter/README.md'), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'));

### skills/skills-restore/scripts/exporter/README.md → scripts/build-exporter.mjs

build; current. Generated by this builder

- [scripts/build-exporter.mjs:16](../../scripts/build-exporter.mjs#L16) (current): const guide = Buffer.from(readFileSync(join(root, 'exporter/README.md'), 'utf8').replaceAll('&#92;r&#92;n', '&#92;n'));

## Findings

No mechanical findings. Semantic review and runtime compatibility remain distinct.

## Candidate classifications

- CONTRIBUTING.md → file:docs/planning/skill-migration-acceptance-notes.md: excluded. Repository authoring/navigation material outside the two extracted package-rule ranges; not a dependency of the bundled guidance.
- CONTRIBUTING.md → file:docs/planning/skill-personal-export-contract.md: excluded. Repository authoring/navigation material outside the two extracted package-rule ranges; not a dependency of the bundled guidance.
- CONTRIBUTING.md → file:docs/planning/skill-publishing-notes.md: excluded. Repository authoring/navigation material outside the two extracted package-rule ranges; not a dependency of the bundled guidance.
- CONTRIBUTING.md → file:docs/planning/skill-publishing-round-3.md: excluded. Repository authoring/navigation material outside the two extracted package-rule ranges; not a dependency of the bundled guidance.
- CONTRIBUTING.md → file:docs/release-catalog.md: excluded. Repository authoring/navigation material outside the two extracted package-rule ranges; not a dependency of the bundled guidance.
- CONTRIBUTING.md → file:docs/skill-map/map.json: excluded. Repository maintainer discovery, review, generation and validation instructions outside the extracted runtime guidance; not a packaged skill dependency.
- CONTRIBUTING.md → file:docs/skill-map/map.md: excluded. Repository maintainer discovery, review, generation and validation instructions outside the extracted runtime guidance; not a packaged skill dependency.
- CONTRIBUTING.md → file:docs/skill-map/README.md: excluded. Repository maintainer discovery, review, generation and validation instructions outside the extracted runtime guidance; not a packaged skill dependency.
- CONTRIBUTING.md → file:docs/skill-map/relationships.json: excluded. Repository maintainer discovery, review, generation and validation instructions outside the extracted runtime guidance; not a packaged skill dependency.
- CONTRIBUTING.md → file:exporter/README.md: excluded. Repository authoring/navigation material outside the two extracted package-rule ranges; not a dependency of the bundled guidance.
- CONTRIBUTING.md → file:README.md: excluded. Repository authoring/navigation material outside the two extracted package-rule ranges; not a dependency of the bundled guidance.
- CONTRIBUTING.md → file:templates/summary.md: excluded. Repository authoring/navigation material outside the two extracted package-rule ranges; not a dependency of the bundled guidance.
- CONTRIBUTING.md → skill:explain-design: excluded. Illustrative package names in authoring examples, outside the guidance ranges bundled into skills; not invocations.
- CONTRIBUTING.md → skill:skills-restore: excluded. Authoring/release documentation about the exporter packaging, not an invocation dependency of the extracted package rules.
- CONTRIBUTING.md → skill:summarize-notes: excluded. Illustrative package names in authoring examples, outside the guidance ranges bundled into skills; not invocations.
- exporter/README.md → skill:grill-me: excluded. Illustrative historical export input/version, not a requirement to invoke Grill Me.
- exporter/README.md → skill:skills-restore: excluded. Describes an alternative chat entry point for the same exporter; the direct helper does not invoke the skill.
- scripts/build-create-skills.mjs → skill:create-skills: excluded. Build/source path or output identity; file reuse is recorded in resource/provenance edges, not a skill invocation.
- scripts/build-exporter.mjs → skill:skills-restore: excluded. Build/source path or output identity; file reuse is recorded in resource/provenance edges, not a skill invocation.
- scripts/build-issue-submission.mjs → skill:create-issue: excluded. Build/source path or output identity; file reuse is recorded in resource/provenance edges, not a skill invocation.
- scripts/build-skill-steal.mjs → file:scripts/clarification.md: excluded. Literal link text being rewritten into bundled guidance; not a file read relative to the builder. Actual output references are recorded on the generated guidance.
- scripts/build-skill-steal.mjs → file:scripts/intent-capture.md: excluded. Literal link text being rewritten into bundled guidance; not a file read relative to the builder. Actual output references are recorded on the generated guidance.
- scripts/build-skill-steal.mjs → skill:create-skills: excluded. Build/source path or output identity; file reuse is recorded in resource/provenance edges, not a skill invocation.
- scripts/build-skill-steal.mjs → skill:skill-steal: excluded. Build/source path or output identity; file reuse is recorded in resource/provenance edges, not a skill invocation.
- scripts/build-skill-tweak.mjs → skill:skill-tweak: excluded. Build/source path or output identity; file reuse is recorded in resource/provenance edges, not a skill invocation.
- scripts/intent-capture.md → skill:create-skills: excluded. Names the consumers of this shared guide, not a dependency invoked by the consumer.
- scripts/intent-capture.md → skill:grilling: excluded. Explicitly forbidden substitute for the required GT grill-me dependency; no grilling invocation.
- scripts/intent-capture.md → skill:skill-tweak: excluded. Names the consumers of this shared guide, not a dependency invoked by the consumer.
- scripts/issue-submission/run.mjs → skill:create-issue: excluded. Names the owning create-issue helper protocol in CLI help; does not invoke the skill.
- scripts/skill-steal/run.mjs → skill:create-skills: excluded. Build/source path or output identity; file reuse is recorded in resource/provenance edges, not a skill invocation.
- skills/caveman-commit/README.md → skill:caveman: excluded. Upstream attribution, product/style terminology or CLI description; does not invoke the GT caveman skill.
- skills/caveman-commit/README.md → skill:caveman-commit: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman-commit/SKILL.md → skill:caveman-commit: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman-compress/README.md → skill:caveman: excluded. Upstream attribution, product/style terminology or CLI description; does not invoke the GT caveman skill.
- skills/caveman-compress/README.md → skill:caveman-compress: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman-compress/scripts/&#95;&#95;init&#95;&#95;.py → skill:caveman: excluded. Upstream attribution, product/style terminology or CLI description; does not invoke the GT caveman skill.
- skills/caveman-compress/scripts/&#95;&#95;init&#95;&#95;.py → skill:caveman-compress: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman-compress/scripts/benchmark.py → skill:caveman-compress: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman-compress/scripts/cli.py → skill:caveman: excluded. Upstream attribution, product/style terminology or CLI description; does not invoke the GT caveman skill.
- skills/caveman-compress/scripts/cli.py → skill:caveman-compress: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman-compress/scripts/cli.py → skill:help: excluded. argparse help= describes a CLI argument; it does not use GT Help.
- skills/caveman-compress/scripts/compress.py → skill:caveman: excluded. Upstream attribution, product/style terminology or CLI description; does not invoke the GT caveman skill.
- skills/caveman-compress/scripts/compress.py → skill:caveman-compress: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman-compress/scripts/detect.py → skill:caveman: excluded. Upstream attribution, product/style terminology or CLI description; does not invoke the GT caveman skill.
- skills/caveman-compress/scripts/validate.py → skill:caveman: excluded. Upstream attribution, product/style terminology or CLI description; does not invoke the GT caveman skill.
- skills/caveman-compress/SKILL.md → skill:caveman: excluded. Upstream attribution, product/style terminology or CLI description; does not invoke the GT caveman skill.
- skills/caveman-compress/SKILL.md → skill:caveman-compress: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman-explore/README.md → skill:caveman: excluded. Upstream attribution, product/style terminology or CLI description; does not invoke the GT caveman skill.
- skills/caveman-explore/README.md → skill:caveman-explore: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman-explore/SKILL.md → skill:caveman-explore: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman-review/README.md → skill:caveman: excluded. Upstream attribution, product/style terminology or CLI description; does not invoke the GT caveman skill.
- skills/caveman-review/README.md → skill:caveman-review: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman-review/SKILL.md → skill:caveman-review: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman/README.md → skill:caveman: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman/release.yaml → skill:caveman: excluded. Release-note description of an already recorded behavior, not an executable workflow or a separate dependency declaration.
- skills/caveman/SKILL.md → skill:caveman: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/caveman/SKILL.md → skill:caveman-commit: excluded. Explicitly forbids implicitly invoking the named companion skills; style alone has no such workflow dependency.
- skills/caveman/SKILL.md → skill:caveman-compress: excluded. Explicitly forbids implicitly invoking the named companion skills; style alone has no such workflow dependency.
- skills/create-issue/scripts/run.mjs → skill:create-issue: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/create-issue/SKILL.md → skill:create-issue: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/create-skills/references/intent-capture.md → skill:create-skills: excluded. Names the consumers of this shared guide, not a dependency invoked by the consumer.
- skills/create-skills/references/intent-capture.md → skill:grilling: excluded. Explicitly forbidden substitute for the required GT grill-me dependency; no grilling invocation.
- skills/create-skills/references/intent-capture.md → skill:skill-tweak: excluded. Names the consumers of this shared guide, not a dependency invoked by the consumer.
- skills/create-skills/release.yaml → skill:grill-me: excluded. Release-note description of an already recorded behavior, not an executable workflow or a separate dependency declaration.
- skills/create-skills/SKILL.md → skill:create-skills: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/domain-modeling/CONTEXT-FORMAT.md → file:skills/domain-modeling/src/billing/CONTEXT.md: excluded. Illustrative context-map links inside the format example, not files required by this skill.
- skills/domain-modeling/CONTEXT-FORMAT.md → file:skills/domain-modeling/src/fulfillment/CONTEXT.md: excluded. Illustrative context-map links inside the format example, not files required by this skill.
- skills/domain-modeling/CONTEXT-FORMAT.md → file:skills/domain-modeling/src/ordering/CONTEXT.md: excluded. Illustrative context-map links inside the format example, not files required by this skill.
- skills/domain-modeling/SKILL.md → skill:domain-modeling: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/grill-me/SKILL.md → skill:grill-me: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/grill-with-docs/SKILL.md → skill:grill-with-docs: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/grilling/SKILL.md → skill:grilling: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/help/SKILL.md → skill:help: excluded. Own identity, headings and self references; no self-call or lookup dependency.
- skills/skill-steal/references/clarification.md → skill:create-skills: excluded. Explicitly states the bundled tools do not require invoking or locating Create Skills; source reuse is recorded separately.
- skills/skill-steal/SKILL.md → skill:skill-steal: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/skill-tweak/references/intent-capture.md → skill:create-skills: excluded. Names the consumers of this shared guide, not a dependency invoked by the consumer.
- skills/skill-tweak/references/intent-capture.md → skill:grilling: excluded. Explicitly forbidden substitute for the required GT grill-me dependency; no grilling invocation.
- skills/skill-tweak/references/intent-capture.md → skill:skill-tweak: excluded. Names the consumers of this shared guide, not a dependency invoked by the consumer.
- skills/skill-tweak/release.yaml → skill:grill-me: excluded. Release-note description of an already recorded behavior, not an executable workflow or a separate dependency declaration.
- skills/skill-tweak/SKILL.md → skill:skill-tweak: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/skill-tweak/templates/issue.md → skill:skill-tweak: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/skills-restore/scripts/exporter/README.md → skill:grill-me: excluded. Illustrative historical export input/version, not a requirement to invoke Grill Me.
- skills/skills-restore/scripts/exporter/README.md → skill:skills-restore: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/skills-restore/SKILL.md → skill:help: excluded. Opening English verb "Help the user" describes the restore task, not the GT Help skill.
- skills/skills-restore/SKILL.md → skill:skills-restore: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/skills-status/SKILL.md → file:skills/skills-status/release.yaml: excluded. Describes reading each selected installed skill release record as user-requested data, not depending on this package release note as a runtime resource.
- skills/skills-status/SKILL.md → skill:skills-status: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/skills-update/SKILL.md → skill:skills-restore: excluded. Optional recommendation for a separately requested workflow; expressly forbids automatic restore invocation.
- skills/skills-update/SKILL.md → skill:skills-update: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
- skills/why-not/SKILL.md → skill:why-not: excluded. Skill identity, invocation documentation or attribution to itself; no recursive invocation instruction.
