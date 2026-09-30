# 2026-09-30 — The pipeline's three jobs

Reading `.github/workflows/` on its own, not the wiki, showed that the pipeline does three jobs, each a workflow of its own: checking every pull request (`pr.yml`), delivering to dev, test and prod (`pipeline.yml`), and republishing the site's content (`publish.yml`). On Eric's direction each job became a file of its own in [`pipeline/`](../pipeline/README.md), placed from the entry's new §4, and ordered by the gradient.

## What changed

- Added [`check.md`](../pipeline/check.md): what the checks run, why the web's check starts its own API, and reading a red check.

- Added [`deliver.md`](../pipeline/deliver.md): what starts a delivery, with why releases use tags and starting one by hand, and inside one run, placing the API's and the web's paths. The entry's old §4 and §5 moved here, whole.

- Added [`publish.md`](../pipeline/publish.md): why an edit needs a rebuild, how publish rebuilds, and what is planned. The web's old §3 moved here.

- The entry's §4 is now "Three jobs", placing the three files in its own prose with a picture, `pipeline/.img/jobs.svg`. `publish.md` has one for staff, `pipeline/.img/publish.svg`. Sections after it moved up one number, and every link into moved sections was rewritten.

## Found in the repository, not in the wiki before

- Commit `da06213` (cwejman, 2026-01-12) says publish is "later to be triggered through rest from the spring backend (web edit) but for now manual". Recorded in `publish.md` §3 as the author's stated plan, *held open*.

- The web's check fills its database with example data from `api/src/main/resources/data.sql`; the earlier pages called it empty.

## The fresh head

A fresh head audited the new structure against the rule, the practice and the workflow files. It found four wrong facts (the seeded database, init also watching `.github/actions/`, the web's login being secrets, and the web's build running beside the API's build as well as its deploy), links missing where a brief leaned on another page, faces that mapped their parts, and the entry's three job headings each holding only a card, which the practice places in the section's prose instead. All were fixed; two small levels folded into their parents. Its note that the story and the environments picture restate which event reaches which environment was left: the story is an illustration and the pictures are figures, not second homes of the rules.

## Files

- Added `pipeline/check.md`, `pipeline/deliver.md`, `pipeline/publish.md`, `pipeline/.img/jobs.svg`, `pipeline/.img/publish.svg`, and this entry.

- Edited `pipeline/README.md`, `pipeline/web.md`, `pipeline/reading.md`, `pipeline/writing.md`.
## The basics, made skippable

On Eric's direction, so that a developer who holds the basics is not force-fed them, everything general moved out of the entry into [`pipeline/basics.md`](../pipeline/basics.md), "Pipelines in general": delivering by hand, CI and CD, and a short list of the everyday words (commit, branch, pull request, merge, tag, build, deploy, Docker image, GitHub). The entry keeps one sentence of what a pipeline is, the road picture and why the workshops need it, and places the basics with a sentence saying who they are for and that they may be skipped. The entry's sections moved up one number.

Inline explanations of those everyday words were removed from the entry, `check.md`, `deliver.md` and `publish.md`, and a link to the list stands at each first use instead, so the words have one home and the skip rule holds. Explanations special to Hjulverkstan stay where they stand.

Two fresh reads followed. A developer skipping the basics found the pages still explained basic words inline, which led to the list; nothing they skipped was needed. A newcomer following the card understood what a pipeline is, why and CI and CD, and found the basics' first sentence repeating the entry's, and a few words unexplained (commit, build, server, joined); all were fixed.

## The intro leads with the three jobs

On Eric's direction the entry's intro no longer explains pipelines in general; that moved into `basics.md`, whose face now carries the assembly line. The intro leads with the biggest win about Hjulverkstan's pipeline: that no change reaches the workshops broken, and the three jobs that make sure of it. The three-jobs picture and the three job pages are placed in the intro itself, and the entry's former "Three jobs" section folded into it; the sections after it moved up one number. The road picture moved to `deliver.md`, the road it shows.

A reader took the intro twice, as a developer and as a workshop coordinator. The developer met no general material beyond the skippable card. The coordinator could say what the pipeline does and why, and stumbled on words the intro used without need (pull request, dev, test, prod, "by hand"), which it now avoids; a sentence that only described the page's layout now says the reader may stop.

## The overview, audited whole

On Eric's direction the briefs before the three job cards became short briefs of their own, and the entry was audited whole against the rule, the practice and the workflow files. The audit moved the story of one change into `deliver.md` as its first section, since it told two of the jobs again at the entry's depth; moved the branch picture to the word list in `basics.md`; removed `flow.svg`, which drew the road `road.svg` already draws; put watching a run and a failed run under one heading; and corrected four claims: a person makes each release, republishing is only ever started by hand, delivery can be started by a button, and nothing enforces that a check passes before a merge.

The intro was then rewritten on Eric's note that it was hard to grasp: it now says in everyday words that every improvement reaches the workshops the same safe way, tested, tried on practice versions, and released when someone says it is ready. A second audit found the briefs before the cards still echoing the cards' own faces, a release replacing both parts rather than only what changed, and the word job used for GitHub's boxes as well as the pipeline's three jobs; each was fixed.

## The intro as one story

On Eric's stress that the intro is what decides whether anyone reads on, it now opens with an archetypal story: a mechanic's bug, fixed, tested, tried on a practice version and released to every workshop with no file copied by hand. The why follows in one sentence, and then the reader is told they may stop. For those who go on, the story continues through the job briefs, so the cards are steps of the same journey rather than a menu: the fix was checked, then delivered; staff's edits to the website are republished. The jobs picture was redrawn in everyday words. Three readers (a workshop coordinator, a junior and an experienced developer) read the earlier draft; their notes, the stop line coming too late, the briefs reading as a menu, jargon in the picture and a tacked-on third job, shaped this one.

On Eric's note that the story intro went too far and lost track, the intro was set back to lead with what matters most in this holon: what Hjulverkstan's pipeline is and its three jobs, in plain words, then the why in one sentence, the basics card, the jobs picture, and a short plain brief before each job's card. The mechanic's story was removed from the intro.

On Eric's direction the fuller briefs before the three job cards were restored, each with what opening its page gives, which the rule's link principle asks of the sentence around a link; two claims in them were corrected (the checks run when a change is opened, which nothing enforces before a merge; the release copies named as dev, test and prod). The intro's face now leads with the biggest win, that nothing reaches the workshops broken and nobody copies files by hand, before the three jobs that make it so.

On Eric's note, the three job briefs now name the jobs by their common terms, checking as CI and delivering as CD, linked to the basics, and republishing as neither, since no code changes.

On Eric's note the CI and CD names moved from the three briefs into the intro's face, said once with one link to the basics.

On Eric's note the link was dropped: CI and CD now stand in brackets beside the jobs they name, in the intro's face.

On Eric's choice `basics.md` §2 was broken into 2.1 CI and 2.2 CD, each an understanding of its own, so the intro's two bracketed links, and those in `check.md` and `deliver.md`, each land on their own term.
