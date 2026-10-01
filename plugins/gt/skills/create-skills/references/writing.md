# Writing skill instructions

Adapted from Matt Pocock's requirements → draft → user-review workflow and
writing-for-agents guidance. The bundled MIT notice applies to this adaptation.
GT's package rules govern metadata and invocation; upstream client assumptions
and old fixed line-count limits are not carried forward.

Write ordered actions with observable completion criteria. Put rules next to the
step they govern. Prefer concrete inputs, decisions and outputs over “be thorough”
or a generic instruction to do a good job. A reader should be able to distinguish
done from incomplete at every consequential step.

Keep instructions needed on every run in SKILL.md. Move branch-specific material
to bundled references when it earns a separate file. Every pointer must state
both what the reference contains and when to read it. A heading inside a loaded
file does not create a separate loading boundary. Include resources actually
used by the workflow; preserve applicable provenance and licenses.

Give each rule one maintained home. Keep definitions, exceptions and failure
handling together. Remove duplicated instructions, empty scaffolding and vague
no-ops. State the intended behavior positively; keep explicit prohibitions for
important boundaries such as unauthorized writes or data being treated as code.

Review the whole generated package against the specification. Check ordinary
use, missing information, dependency failure and cancellation. Record discrepancies
and actual observations. A source review or a structural pass is not evidence
that a model selected or executed the skill in a real client.
