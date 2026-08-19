# Transcripts

The *sources* the rest of `wiki/` is distilled from. A meeting is an event; the wiki is state. Transcripts stay so anyone — human or agent — can descend from a distilled claim to the fold and minute it came from.

We call them transcripts, but they are not records of speech. Each is the knowledge a meeting presented, written up afterwards as first-class knowledge — the perfected version, not the meeting version — with the recording's folds and minutes as its skeleton.

## How the prose is written

**Written, not edited.** The writer reads the whole clean rendering, holds the folds in one head, and writes the file whole, top to bottom. Never sentence-trimming, never patching. Prose is not modular — meaning lives in transitions and in what has already been said — so a file is always written or rewritten whole.

**The knowledge speaks.** Present tense, stated as knowledge — the way a good article states it. Not "Jona said that an application is an onion" but *an application is an onion*. No dialogue lines, no script, no first-person monologue. Attribution is light and lands where it matters: at the top of a fold ("the picture Jona uses…") or on an opinion ("Jona holds that code is legacy"). The speaker's metaphors, judgments and force stay — "that is drift".

**Digest the fold; don't sequence the speech.** Within a fold, the order things were said is not the order the knowledge has. Find what the fold establishes — the claims, the reasons, the examples that carry them — and write that as knowledge: point, grounds, consequences. A fold that still follows the speaker's path is not digested, however tight its sentences. Test: could it be a section of a good article on the subject?

**What survives, without exception:** every idea, argument, example, decision, opinion, question and its answer, joke that carries a point — and the links between them: the *because*, the *so*, the *but*. Reasoning is knowledge. Uncertainty the speaker voiced stays voiced. Nothing added: no interpretation, no summary, no headings that weren't topics in the room.

**What goes:** the mechanics of talking — setups, restatements, hedges that carry no fact, breathers, audience checks, discourse about speaking (except where a concept such as *fold* is introduced), thoughts started and dropped. Logistics, pleasantries, and the speakers' evaluation of the session go too, unless a decision hangs on them.

**Personal passages are compressed less, out of respect.** Factual knowledge lives in what was said; personal knowledge lives in how it was said, and its silver lining — the reason it was shared — is what a summary loses first. When a passage is about the speaker rather than about the world, stay closer to their words, first person where that carries it, quoted if that is what it takes. Exchanges around it — a question, a compliment — still fold into a sentence. Whether it stays is the speaker's decision, later. *Open:* how personal knowledge is used in the structure; until settled, less compression is the rule.

**Length is an outcome, not a target.** A dense fold may only shrink to two thirds, a rambling one to a third, a personal one barely; about half overall is what results. Never pad or starve a fold to hit it.

**A working session keeps what it established, not what was dictated.** *(Ruled 2026-08-19, on the third meeting.)* When the recording is of someone driving an agent — instructions typed, output read aloud — the instructions are superseded by the practice they produced and are not reproduced; what survives is what each passage decided or taught, and the reasoning around it. Reading output aloud keeps the knowledge in the output, not the reading. Such a file still lands near half of the clean — what is dictated is short; what is reasoned around it is not. Before the writer starts, the fold map is put to the human for a keep / compress / exclude ruling per fold; the ruling goes into `.raw/…/ruling.md` and binds the checker too, so a compression under the ruling is not a loss.

Exemplars: [`2026-08-17-intro-pt1.md`](2026-08-17-intro-pt1.md) and [`-pt2.md`](2026-08-17-intro-pt2.md), the second written after the digest rule was named; [`2026-08-18-intro-pt3.md`](2026-08-18-intro-pt3.md) for a working session, and the first to run every step including the independent check of the clean.

## The method

Every recording, the same steps. Fresh heads per step: the one that writes never checks its own work; a rewrite is done by a head that has the report.

0. **Bundle.** The `.vtt` into `.raw/YYYY-MM-DD-<slug>/` (gitignored; nothing in `.raw/` leaves the machine).
1. **Clean** *(agent A)* — `.vtt` → `.raw/…/clean.md`: 1:1, speakers attributed, filler and false starts removed, mis-hearings fixed with `mishearings.md` (extend it), folds as timestamped headings. Nothing condensed, nothing added.
2. **Check the clean** *(agent B, fresh)* — `.vtt` against `clean.md`, fold by fold; lists content-bearing utterances missing or altered. A fixes; B re-checks until empty.
3. **Write** *(agent C, fresh)* — `clean.md` → the transcript, per the rules above and the shape below, whole file in one pass.
4. **Check the writing** *(agent D, fresh)* — the lossless gate. Enumerate from the clean, fold by fold, every idea, argument, example, decision, opinion, question, answer, reasoning link, personal reflection; locate each in the transcript. Report to `.raw/…/check-<n>.md`: missing · altered in meaning · added · personal passage over-compressed. Flag *knowledge, not wording*: a claim, an example, a reason, an answer, a stated uncertainty about a fact, an opinion — flag if missing or changed; a hedge that changes a claim's strength ("probably" → "most") is a change. Intensifiers, discourse, restatement, logistics, pleasantries, how the session felt — not knowledge, do not flag. Mechanical alongside: every speaker's contributions present; `[?]` and `[Ed: …]` marks accounted for; TOC anchors resolve; headings and timestamps intact.
5. **Rewrite** *(agent E, fresh)* — with the clean, the transcript and the report, writes the file whole again. Restore *knowledge* in the written register — a missing item is usually one clause — never the clean's phrasing; if the file grows by more than a tenth, wording is being restored. Back to 4 until clean. The header records the passes.
6. **Approve.** Every voice approves before upload. Each speaker reviews their own lines and keeps, trims or removes them; that edit is final and needs no justification. The *Candidates for human decision* list is the speaker's TL;DR of what personal content they are approving. An agent never publishes or ingests from a transcript whose status is not `approved`. *Open:* the mechanism — a PR each speaker approves, or an in-file checklist; until decided, an explicit go from each speaker counts.

Personal content stays in the transcript if its speaker approves it; it is distilled into the wiki only *generalised* — an insight about how people learn or feel safe belongs in `lore/` or `conventions/`; a profile of a person belongs nowhere. What happens *with* an approved transcript — ingestion, the log entry — is a separate practice.

## In the meeting: the ball

Recorders attribute speech badly when several people share a room. One "ball": whoever speaks takes it and says their name first; passing it on is a name too. Foolproof attribution at the source, at no cost.

*Open (Jona, 2026-08-19):* the ball may not be necessary — the transcript is not an audit of who said what; what is discussed is what matters, and personal passages by anyone but the speaker who owns them are written unattributed anyway (see the third meeting). Kept as a proposal until a meeting has tried it.

## The shape of a transcript

1. **Header** — title with date; an italic block: source (`.vtt` name, kept outside the repo, duration), participants (everyone present), attribution caveats, check passes, and **status** (`pending approval` · `approved`).
2. **Contents** — nested TOC of the folds.
3. **Body** — folds as nested headings, each suffixed ` · mm:ss`. Where the speaker folded, follow the speaker; where the meeting had no fold structure, impose topical folds, still timestamped. `[?]` marks a guessed word or attribution; `[Ed: …]` an editorial note on a factual point, original wording kept.
4. **Notes** — *Deliberately left out* (whole passages, timestamped), *Candidates for human decision* (personal content, per speaker), *Unresolved* (`[?]` items). Transcriber slips are corrected silently and recorded once in `mishearings.md`.

## Files

- `YYYY-MM-DD-<slug>.md` — one meeting; long ones split `-pt1`, `-pt2`. Date first so meetings sort together and apart from the non-dated files.
- `mishearings.md` — what the transcriber makes of our vocabulary; consult when cleaning, extend when you find more.
- `.raw/` — gitignored: recordings, cleans, check reports.

## Current

- `2026-08-17-intro-pt1.md`, `-pt2.md` — the intro meetings. Written and checked (part 1: two passes, clean on the second; part 2: three, clean on the third). Status: pending approval — Jona has reviewed part 1's personal content; Shudong and the interns have not reviewed their lines; three room voices in part 2 are attributed to Mauricio `[?]` pending his word; the ball didn't exist yet. Step 2 was not run for these — the `.vtt` files are with Jona, not in `.raw/`.
- `2026-08-18-intro-pt3.md` — the working session of the day after, in which the intro transcripts were processed; it precedes the sessions that shaped the draft (its first agent session runs inside it) and was transcribed retroactively on 2026-08-19, so its proposals are the state of that morning. First run of the full method: clean checked independently (two passes, clean on the second), written under a per-fold ruling from Jona, writing checked four times, three rewrites (the second to compress, after Jona's first read). Status: pending approval — Jona has ruled on the personal content's shape and read it once; Mauricio's positions and the interns' unattributed passages await their word.
