# Research on agent instruction file contents

Research checked October 7, 2026. Several empirical studies compare the contents of `AGENTS.md`, `CLAUDE.md`, and related files across GitHub repositories. The most useful combination is a human-coded content taxonomy, a study specifically about `AGENTS.md` writing styles, and downloadable real examples. These studies describe existing practice; prevalence alone does not establish that an instruction improves agent performance.

## Agent READMEs

[Agent READMEs](https://arxiv.org/html/2511.12884v2), first submitted November 17, 2025 and revised August 9, 2026, collected **2,303 files across 1,925 repositories**: 922 Claude Code, 694 Codex, and 687 Copilot files. Its **content percentages apply to a proportional, English-language sample of 332 files**, manually classified with multiple labels per file. They are not percentages of all GitHub repositories.

| Content category | Sample containing it |
|---|---:|
| Testing | 75.9% |
| Implementation details and code style | 70.8% |
| Architecture | 68.1% |
| Development process | 65.1% |
| Build and run | 63.0% |
| System overview | 59.0% |
| Maintenance | 44.6% |
| Configuration and environment | 38.9% |
| Documentation and references | 26.8% |
| Debugging | 25.3% |
| AI integration and agent roles | 24.1% |
| DevOps | 18.4% |
| Security | 14.8% |
| Performance | 14.5% |
| UI and UX | 8.7% |
| Project management | 5.4% |

Source: [version 2, section 4.3 and Table 3](https://arxiv.org/html/2511.12884v2#S4.SS3). It includes representative repository examples and an appendix defining category boundaries. The [replication package](https://github.com/woraamy/Agent-Context-File-Analysis) is the starting point for further analysis.

Use version 2: version 1 describes its content sample differently and reports slightly different percentages. This study explicitly extends the authors' earlier [253-file Claude Code study](https://arxiv.org/abs/2509.14744); those papers should not be counted as wholly independent evidence.

## Content and writing styles in AGENTS.md

[Context Engineering for AI Agents in Open-Source Software](https://arxiv.org/html/2510.21413v1), October 24, 2025, examined adoption in 10,000 repositories, found 466 with supported configuration files, and investigated a collected set of 155 `AGENTS.md` files. Its content analysis applies additional exclusions and focuses on recurring first- and second-level headings.

Its 14 categories distinguish coding conventions, contribution procedures, architecture, build commands, project descriptions, test execution, test strategy, metadata, dependencies, setup, references, troubleshooting, examples, and security. Its table counts headings, not percentages of repositories. It also identifies five ways of expressing instructions: **descriptive, prescriptive, prohibitive, explanatory, and conditional**. This is useful when comparing how files communicate rules, beyond which subjects they mention. [Sections 4.2 and Table 1](https://arxiv.org/html/2510.21413v1#S4.SS2); [supplementary material](https://doi.org/10.5281/zenodo.17428770).

## Recent practitioner studies and examples

| Study | Scope and usefulness | Main limitation |
|---|---|---|
| [Stride census](https://www.stride.page/research/agents-md-claude-md-study-2026), September 27, 2026 | 7,370 active public repositories with at least 5,000 stars; 1,864 root `AGENTS.md` files. Heading topics include testing (55.7%), code style (54.3%), repository structure (54.3%), and Git or PR workflow (47.6%). Provides downloadable per-repository metrics. | Large popular repositories; root files; automated heading and pattern matching. A missing matching heading does not establish missing guidance. |
| [willhama/md-file-study](https://github.com/willhama/md-file-study), August 3, 2026 snapshot | 511 instruction files from 50 popular AI coding projects, with a broader set of 1,666 files across 289 repositories. Includes frozen raw files, analysis, and pipeline scripts. Particularly useful for reading and comparing actual instructions. | A deliberately selected AI-project corpus. The 50-repository primary sample is part of the 289-repository set, not independent replication. |

These percentages are not directly interchangeable with Agent READMEs: they use different dates, repository selection, file scopes, and classification methods. Stride's [methodology](https://www.stride.page/research/agents-md-claude-md-study-2026/methodology) explains its automated detectors; willhama's [methodology](https://github.com/willhama/md-file-study/blob/main/METHODOLOGY.md) explains corpus selection.

## Related research with a different emphasis

[Configuring Agentic AI Coding Tools](https://arxiv.org/html/2602.14690v1), February 16, 2026, studies 2,926 repositories with detected configuration artifacts, including context files, skills, and subagents. It is more useful for configuration organization and cross-file references than a detailed taxonomy of instruction subjects.

[Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988) studies task performance with context files. It answers a different question from what developers put in those files and should not substitute for the descriptive content studies above.
