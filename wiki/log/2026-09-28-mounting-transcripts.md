# 2026-09-28 — Transcripts mounted under the rule

The five transcripts are placed in [`transcripts/README.md`](../transcripts/README.md) under [the rule](../the-rule/rule.md), so the surface traces them from the README as one body.

## What was decided

- All transcripts open with a summary, as the Frölunda transcript does, and number their headings as it does. Both on Sanna's instruction.

- The README and the five transcripts carry the stamp, `under: the rule`, `kind: brief`. `methods.md` and `mishearings.md` stay unstamped and are linked in prose.

- The README's new §3 places the transcripts oldest first, since the intro parts stand on each other in that order. *Lean*, the session's; newest first, as a record is kept, was offered and not chosen.

## How it was made

1. **Summaries written** for the four older transcripts from a whole reading of each, placed after the status line as in Frölunda. They say what the meeting presented and add nothing, but they are new prose in transcripts still pending approval.

2. **Headings numbered** by script: every heading of the body, h2 as `1.` and deeper as `1.1`, `1.1.1`; *Contents* and *Notes* left unnumbered, as in Frölunda. Contents entries carry the numbers and their anchors were rewritten; every anchor was checked to resolve before and after. No links from elsewhere pointed into the renumbered headings.

3. **Checked** with `bun the-rule/poc/surface/surface.ts transcripts --check`, run from `wiki/`: no link or placement faults.

4. **The summary made the face.** The surface takes the first paragraph as the face, and in all five files that was the italic source note, so each card showed it. On Sanna's instruction the source and status lines were moved beneath the summary in all five, Frölunda included; each card now shows the summary. The summaries run 655–678 characters, past the 400-character flag.

5. **Contents made a plain line.** The unnumbered `## Contents` counted as a section, so the check flagged every numbered heading as standing one later, 115 flags across the five. On Sanna's instruction the heading became a plain line, `Contents:`, in all five; the flags cleared, and nothing linked to `#contents`. The check now traces 143 briefs, with no faults.

## Left open

- 69 faces past the 400-character flag, the five summaries among them, most of the rest in the four older transcripts; not read in this session.

## Files

- Changed `transcripts/README.md` (stamp, §3), `transcripts/2026-08-17-intro-pt1.md`, `-pt2.md`, `2026-08-18-intro-pt3.md`, `2026-08-19-client-meeting.md` (stamp, summary, numbering, source and status beneath the summary, `Contents:` as a line), `2026-09-16-frolunda.md` (stamp, source and status beneath the summary, `Contents:` as a line).
- Added this entry.
