# caveman-explore

Delegate repository localization and return verified file/line citations.

## Provenance

Adapted from [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman/tree/2fd153c67988e980fb0b2455c90832159a6a5a25/skills/caveman-explore),
copyright (c) 2026 Julius Brussee, under the bundled [MIT license](LICENSE).
The pinned upstream [licensing scope](https://github.com/JuliusBrussee/caveman/blob/2fd153c67988e980fb0b2455c90832159a6a5a25/LICENSING.md)
classifies `skills/` as MIT. The license is reproduced from the submitted package;
its upstream repository scope note refers to that upstream repository. This
independent adaptation does not imply upstream sponsorship.

GT adds explicit invocation flags, MIT metadata and initial release metadata.
The reviewed adaptation replaces the original Haiku and Read/Glob/Grep header
requirements with native host delegation, the configured model and available
read/search tools. It retains separate-context exploration, parallel independent
searches, bounded follow-up and verified citation-only completed results. It adds
missing-input, unavailable-capability, failure and cancellation handling, and
distinguishes instructed read-only behavior from host-enforced tool confinement.

Model invocation is an exception to GT's manual default because a solver needs
to discover and delegate broad localization during other work. User invocation
remains available. Review decisions and verification belong to
[issue #57](https://github.com/AndrewGodlewsky/andrew-skills/issues/57).
The original development package and Haiku-specific static tests remain in that
intake record; they are not runtime resources of this adapted skill.
