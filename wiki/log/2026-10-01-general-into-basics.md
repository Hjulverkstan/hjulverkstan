# 2026-10-01 — Everything general under the basics

On Eric's direction, everything general about pipelines now stands under [Pipelines in general](../pipeline/basics/README.md), and the pipeline's own pages keep only what is special to Hjulverkstan. The basics became a folder, so it can hold pages beneath it.

## What was decided

- The basics hold §1–3 as before, then §4 *Watching a run*, with a failed run folded in, and §5 placing [Reading a workflow](../pipeline/basics/reading.md) and a new page, [What a good pipeline is built on](../pipeline/basics/ideas.md). Eric's approval of the outline.

- `reading.md` keeps Hjulverkstan's own files as its examples, and its face says so. Eric's approval.

- The basics' face says that its last two sections are for anyone working with GitHub Actions, so the promise that a reader who knows pipelines may skip it still holds. Eric's approval.

- `writing.md` is now *Changing our pipeline*, only ours: how ours follows each idea, linked to the general page rather than restating it, then making a change and the questions before you merge. The subsection headings were kept, so links into it hold.

- The entry's §2 is *When a run fails*, our four failures. The entry's old §3 and §4 are now one section, *Maintaining the pipeline*, placing `writing.md` and `open.md`, since both are for whoever changes the pipeline and a heading over a single card of the same title earned nothing.

## Moved, and given one home

- Watching a run, and finding why it failed, moved from the entry into the basics. The name *Deploy* and what init's summary holds moved to `deliver.md` §3.

- The five ideas moved from `writing.md` into `ideas.md`, written generally. Two general GitHub facts moved into `reading.md`: that GitHub hides only a secret itself, not a changed version of it, and that a pull request runs the workflows from its own branch. actionlint and act moved into `ideas.md`.

- Our own facts left the basics. The stage files' `run` input went from `reading.md` to `writing.md` §1.4, and the pointer to the infrastructure readme's list of names went to `writing.md` §2.3.

- *Container* and *environment* were added to the basics' word list, since the basics used both before giving them. The entry's §1 links to it.

## The fresh head

A fresh head read the rule and the changed pages cold. It found the restated ideas in `writing.md` §1 to be copies, one of them already different from `ideas.md`. It also found general GitHub facts still on our pages, words used in the basics before they were given, and dependencies on `deliver.md` without a link. All of those were fixed. Its point that promoting by renaming was unclear without Docker tags led to a plainer paragraph.

## Left open

The fresh head found these, but they were there before this session and were left as they are:

- The entry's lines 8 and 10 both say that nothing reaches the workshops untested.

- The basics give *merge* in §2.1 and again in §3.

- `.github/workflows/` is given in §3 of the basics and again in `reading.md` §1.

- `secrets: inherit` is explained in `reading.md` §4 and again in `writing.md` §2.3.1.

- The basics' §2.1 and §2.2 each name Hjulverkstan's job in a sentence.

## How it was checked

The surface's `--check` from `wiki/` traced 222 briefs from `README.md` with no faults. The 69 faces past 400 characters are all in the transcripts and predate this session. Every link and anchor in `pipeline/` was checked against its target.

## Files

- Moved `pipeline/basics.md` to `pipeline/basics/README.md`, `pipeline/reading.md` to `pipeline/basics/reading.md`, and `by-hand.svg` and `branch.svg` to `pipeline/basics/.img/`.

- Added `pipeline/basics/ideas.md` and this entry.

- Edited `pipeline/README.md`, `pipeline/writing.md`, `pipeline/deliver.md`, `pipeline/check.md`, `pipeline/publish.md`, `pipeline/api.md`, `pipeline/open.md`.
