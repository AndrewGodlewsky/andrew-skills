# Create Skills — review round 2

For [issue 38](https://github.com/AndrewGodlewsky/andrew-skills/issues/38).
Add your answers beneath each question. Recommendations below are proposals;
they have not been recorded as your decisions.

## What your answers settled

This is a deliberately invoked workflow for **new skills only**. It must assess
the context, interview until requirements are understood, and submit enough
detail for you to build the skill without another requirements interview. A
short idea or knowingly unfinished specification is not a successful result.
Changing existing skills belongs in a separate workflow.

After submitting the complete handoff through `create-issue`, it should offer to
install a personal copy. Accepting that offer does not publish to the marketplace.
Your original answers remain untouched in [round 1](create-skills-round-1.md).

The updated [plan](create-skills-plan.md) reflects this direction. I also researched
comments, sub-issues, attachments and Discussions; the comparison and sources are
in [submission options](../research/create-skills-submission-options.md).

## Questions

### 1. Should it normally build the complete files before submitting?

You accepted either the entire skill or a sufficiently detailed specification.
The remaining choice is what this workflow should normally aim to deliver.

**Recommendation:** normally produce **both** a complete package and a detailed
implementation explanation before submission. The explanation records why the
skill exists, its inputs/outputs, workflow, dependencies, permissions, limits,
failure handling and acceptance examples. The package supplies SKILL.md, release
metadata and every needed resource. You receive something concrete to inspect
and a clear account of what it is supposed to do.

When the environment prevents producing the package, allow a complete
specification with that limitation stated; do not lower the requirements bar.
If the user subsequently requests personal installation, build and check the
package first, and add those files to the same issue before installing.

**Alternative:** normally produce the detailed specification only. Build the
files after submission only when the user accepts personal installation, or when
they explicitly requested a package from the outset. This leaves more initial
implementation work with you.

Which default do you want?

**Your answer:**
Ultimately, I wanted to produce the detailed specification first because that's the most important thing. Then I would like for it to actually try and build the skill, but I do need it to submit both the detailed specifications and the skill. I don't want to say separately, but visibly and independently in the same issue, because I still have to vet the skill and I may want to rebuild it. That's why the specifications are more important to me than the skill itself, but it would be nice if they try and build the skill so I can get an even better understanding of their intent. 

### 2. What evidence must exist before it can submit?

There is a difference between “we have not decided how missing input should work”
and “we have defined that behavior but have not run it in a second Copilot client.”
The first is unfinished requirements; the second is missing execution evidence.

**Recommendation:** resolve all known requirements questions and fix known
package defects before submission. Run the available package checks and exercise
representative behavior where possible. Allow the complete handoff to include
clearly identified **unrun** checks when the necessary client or tools are absent.
Record what needs testing and the expected result so you can verify it later.
Never call such a package fully verified. A discovered failure requires a fix or
continued local work, not a claimed success.

For example, a package with complete requirements and passing structural checks
could be submitted with “WSL Copilot invocation not tested.” A package missing a
required reference file, or a specification with undecided external-write
permissions, would stay in progress.

**Alternative:** require actual checks in every supported target client before
submission. This gives stronger evidence but prevents many contributors from
submitting until they can access all of those environments.

Is the recommended distinction right for your maintainer review?

**Your answer:**
I think ultimately it should try and run all of the required checks, but I don't know if those must be available for it to submit. Remember, I'm okay with it just submitting very detailed specs about what the skill needs to be and the intent behind what it is going to be used for. They don't necessarily have to build the skill themselves.

We should default to trying to run all of these requirements and show what's been run, what passed, and what didn't. I don't want that to be a hard requirement before they can submit, because submitting is just creating an issue. I will still then build the skill separately and independently, or verify what they've built and run all the checks myself to confirm everything works and is correct. Per the repo standards 

### 3. Can long submissions use comments, with a manual exception for binaries?

**Recommendation for long text:** one issue containing the summary and an index,
followed by numbered comments holding the full specification and package files.
The workflow verifies every part and updates the index when the handoff is
complete. If interrupted, it reports the partial submission and reconciles what
was sent before continuing. It does not silently start another issue.

This uses the existing helper's comment support. Sub-issues would split a single
review across tasks and require additional repository permissions. Discussions
would introduce another system without an established size advantage. The
helper's 60,000-byte limit applies to each body/comment, so a long handoff can
span several comments while retaining an understandable reading order.

**Recommendation for essential binary files:** prepare a ZIP and guide the user
through attaching it to that same issue in GitHub's browser interface. Verify
the attachment and manifest before declaring the handoff complete. The current
helper has no upload operation. If the user cannot attach it or the artifact
cannot be verified, preserve the work and report what remains incomplete.

Alternatives: make the first version text-only, or design automatic binary
upload support as additional implementation work before shipping. Do not omit
required resources just to fit the submission path.

Are you happy with **numbered comments for text** and **manual ZIP attachment
for essential binaries**, or would you change either part?

**Your answer:**
Yeah, I think this is totally fine. I'm comfortable with numbered comments for text. And the zip attachments are also okay, but hopefully we can avoid those. That would be fine. 

### 4. How should personal copies coexist with later marketplace releases?

**Recommendation:** after successful submission and the user's explicit yes,
install a distinct personal copy, such as `meeting-prep-personal`, into their
active environment's user skills folder. Copy all required resources, keep the
internal skill name consistent, and never overwrite an existing skill. Show the
destination and check whether the client discovers the new copy.

The personal copy has its own lifecycle: it does not automatically update or
become the marketplace version. If you later publish `meeting-prep` in GT, the
user can deliberately switch and remove the personal copy. In WSL, the default
destination is that Linux user's home; it does not also install into Windows.

This avoids duplicate-name ambiguity. Copilot CLI documents precedence between
skill sources; a same-named personal copy can affect which version runs. We must
still verify discovery in each supported client rather than assuming the rules
are identical everywhere.

**Alternative:** retain the proposed marketplace name for the personal copy,
with explicit conflict handling and a later replacement/removal step when GT
publishes it.

Do you prefer the distinct personal name and independent lifecycle?

**Your answer:**
Personal copies are completely within the user's responsibility. We are not going to worry about how they coexist with later marketplace releases. The difference will realistically be that their personal copy will just be the name of the skill, whereas the marketplace release will have the Prefix and then the name of the skill. They won't really get mixed up as to whether they're using their personal copy or the marketplace's skill. 

## After this round

Once these choices are settled, finish the concrete interaction/acceptance
examples and split implementation into execution issues: shared checks, creator
workflow, complete issue delivery, personal installation, and release/client
verification. No production implementation or Git history changes were made
for this planning round.
