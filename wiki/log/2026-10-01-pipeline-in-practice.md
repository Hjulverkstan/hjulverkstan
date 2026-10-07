# 2026-10-01 — The pipeline's practical side gets a folder of its own

On Emelie's observation that the entry's numbered sections read as the pipeline changing its style halfway, rather than as a different kind of knowledge, the practical side of the pipeline was given its own folder, `pipeline/in-practice/`, placed as one card at the end of the entry. It is framed by `basics/` before the jobs and `in-practice/` after them, so it still reads as the pipeline's own. Only `wiki/pipeline/` was changed.

## What was decided

- `in-practice/` holds what is looked up when you work with the pipeline: *When a run fails*, *Changing our pipeline* and *What is open*. Emelie's choice of shape and name, from an agent's proposal.

- The entry's §2 *When a run fails* became `in-practice/failing.md`, its four reasons as a level of letters, a to d, since each is looked up alone and none stands on another.

- The entry's §3 *Maintaining the pipeline* is gone. Its two cards, `writing.md` and `open.md`, moved into the folder with `callers.svg`, and its sentence on what changing the pipeline stands on went into the folder's entry.

- The entry's §1 *Three copies of the system* was not practical but ground for the jobs, and stood after the card that relies on it. It is now prose before the jobs, opened with "All three jobs work on three copies of the system". The agent's decision, from the proposal Emelie approved.

- The entry now has no numbered sections: the brief, the copies, the three jobs and the one card.

- The copies' confidence line, left mid-entry when the headings went, was folded into the entry's closing line, so the one brief has one. A finding of the fresh head's reading under *Left open*, applied the next day; Emelie's choice over bringing the headings back.

- The placement of *Working with the pipeline* named the same two moments as the card's face, and said how the pipeline is explained as the face does. It now says only why the card stands last: "What is left stands on all three jobs, so it comes last." The fresh head suggested "looked up, not read through", but the card's face already says that, so the agent gave the order's ground instead. A finding under *Left open*, applied the next day at Emelie's request.

- The copies' opening, "All three jobs work on…", became "The pipeline's three jobs all work on…", so it names the jobs again after the card and rule that stand between it and where they were named. A finding under *Left open*, applied the next day at Emelie's request.

- The entry's second paragraph, "The workshops rely on the portal every day, so nothing reaches them untested, and a person decides when a change does.", was removed, since it repeated the first. That a person decides when a change reaches the workshops has its home in `deliver.md`. A finding under *Left open*, applied the next day at Emelie's request.

- `in-practice/README.md` had two confidence lines that disagreed: one mid-page copying the pipeline entry's ("not checked"), and a closing one whose dates copied `open.md`'s own line ("Seen"). The mid-page line was removed, and the closing line now gives only this page's own ground: "Reasoned, from the pages it places and an agent's reading of `.github/workflows/` on 2026-09-30, not checked against a real run." `open.md` keeps its dates in its own line. A finding under *Left open*, applied the next day at Emelie's request.

- The placement of *Changing our pipeline* in `in-practice/README.md` restated `writing.md`'s face ("takes more care"). It now gives only the order's reason: "Changing the pipeline itself comes after, since fewer meet it, and later." Its "stands on" sentence moved into `writing.md`'s own paragraph, which already named two of the three grounds and now names *inside one run* too, so every reader meets the ground however they arrive. This departs from the fresh head, who would have kept the sentence in the placement; Emelie's choice from the agent's proposal.

- The face of `in-practice/README.md` read "These are for…" with no noun, and named only two of its three cards. It now reads "These three pages are for working with it yourself: what to do when a run of yours fails, how to change a workflow safely, and the problems in it that are known but not yet fixed", and "when its moment comes" became "when it is needed", since *What is open* is no moment. A finding under *Left open*, applied the next day at Emelie's request.

- In `failing.md`, the face's "and it says what to do" became "each says what to do", since it was the sections and not the log that say it. Section a, only a pointer, now says what the reader sees: "The pull request shows a red check, and the log of its red step names what failed." What to do stays in `check.md` §3, its one home. Its title became *A check fails*, since the web's check is a build and not a test, which moved its anchor; nothing linked to it. Findings under *Left open*, the title the agent's, applied the next day at Emelie's request.

## Moved

- `pipeline/writing.md` → `pipeline/in-practice/writing.md`, `pipeline/open.md` → `pipeline/in-practice/open.md`, `pipeline/.img/callers.svg` → `pipeline/in-practice/.img/callers.svg`. Their links outward and the links into them from `basics/ideas.md`, `check.md`, `deliver.md` and `web.md` were rewritten. Links in older log entries were left as history.

- The entry's anchors `#1-three-copies-of-the-system`, `#2-when-a-run-fails` and `#3-maintaining-the-pipeline` no longer exist. Nothing in the repository linked to them.

## Left open

- A fresh head read the entry, `in-practice/README.md` and `failing.md` cold. All anchors resolve, the entry reads in one style, and the folder reads as the pipeline's own. Its findings below are *Open*, kept for revision another day. Those applied since stand under *What was decided*.

  - `failing.md` c, *The API does not start*, says no action, and links to `api.md` §3 where the two-minute rule is in §3.2 (`#32-what-a-deploy-does`). Say to read the step's last log lines, and that a failing API in the web's check belongs under a. A missing setting as a common cause, pointing to `api.md` §4, is the fresh head's lean, not checked.

  - `failing.md` b, *A tag is refused*, could give the right forms inline, `vX.Y.Z` or `vX.Y.Z-rc.N`. In d, "finds no content" could say "finds none of the site's text".

  - `failing.md` c's confidence line could name `stage-deploy-api.yml`.

- Whether *Three copies* belongs in the entry's prose or in `deliver.md` is a lean, not settled. Placing it in `deliver.md` as a new first section would renumber the sections that other pages link to.

## How it was checked

The surface's `--check` from `wiki/` traced 227 briefs from `README.md` with no faults, and it reports `failing.md` as a level of letters. Every relative link in `pipeline/` resolves to a file.

## Files

- Edited `pipeline/README.md`, `pipeline/basics/ideas.md`, `pipeline/check.md`, `pipeline/deliver.md`, `pipeline/web.md`.

- Moved and edited `pipeline/in-practice/writing.md`, `pipeline/in-practice/open.md`, and moved `pipeline/in-practice/.img/callers.svg`.

- Added `pipeline/in-practice/README.md`, `pipeline/in-practice/failing.md` and this entry.
