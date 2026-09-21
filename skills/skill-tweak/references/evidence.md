# Gathering incident evidence

Collect enough relevant context for maintainers to assess the experience without
access to the private conversation. Include the original task, relevant constraints,
client/environment, invocation, chronology, user corrections, actual outcome,
impact and desired future behavior. Preserve short exact excerpts with source
turn/time references when available. Mark summaries as summaries. Do not quote
compaction summaries as an exact transcript or claim to have recovered missing
turns. State which evidence was unavailable, omitted or redacted.

Keep the intent recap and ordered interview record alongside incident evidence,
following the [intent capture guide](intent-capture.md). Incident evidence explains
what happened; the record preserves what the requester wants and why. Either may
contain an explicit gap, but an agent's proposed explanation is not a user answer.

Where useful, inspect the instruction in the affected skill that bears on the
incident. Distinguish a possible instruction defect from agent noncompliance,
tool failure and a user preference. These are hypotheses unless evidence
establishes them. Do not reproduce an external action to strengthen the report.

## Diagnostics

Use a value or `unavailable: <reason>` for every field. Record source and
observation time/turn, distinguish incident-time from report-time data, and label
user-reported values and inferences. Preserve conflicting sources explicitly.
Never fill gaps with a guessed model, version, capacity or percentage.

### Affected skill

- Ordinary skill name and selected GT installation identity.
- Skill release version from release.yaml for the artifact that actually ran,
  if recoverable. Keep plugin version separate from the skill version.
- Current installed version separately if it is all that can be observed. It
  does not establish what ran earlier, particularly after an update.
- Local modification status if known; record unversioned/modified copies
  explicitly. An optional content hash identifies an observed artifact without
  proving historical execution. Unknown modification status stays unknown.
- Avoid publishing identifying absolute filesystem paths; use a redacted source
  description or package-relative path.

### Model

Record the exact incident model ID and reasoning setting when exposed by the
client's relevant execution metadata. Record the current reporting model
separately if available. A configured default, advertised model name or generic
self-description does not prove the incident model. Do not replace unavailable
incident metadata with current values.

### Context capacity and occupancy

Capture current readings near invocation, then seek incident-time evidence if
available through permitted task-specific metadata. For each snapshot record:

- Effective context capacity in tokens.
- Used tokens, remaining tokens and percent full where available.
- Observation time/turn and source, including the source's measurement meaning.
- Observed compaction/truncation, and whether only a summary survives.

Calculate percent full as `100 * used / capacity` only when both numbers refer
to compatible measurements from the same snapshot, capacity is positive, and
used is between zero and capacity. Remaining tokens may then be calculated as
capacity minus used. Label calculations. If only a client-displayed percentage
is known, preserve it without inventing counts; preserve rounding/approximation.
Do not reconcile contradictory readings by quietly clamping or combining them.

A model catalog's maximum, configured context override, compaction threshold,
cumulative token consumption and account rate-limit utilization are distinct
from actual active-context occupancy. Do not query account limits as a proxy
for context fullness. Do not estimate a full window from the length of visible
messages. A later or post-compaction reading cannot establish earlier fullness.
Unavailable telemetry is an explicit diagnostic limitation, not a reason to
keep questioning the user or reject a useful report.
