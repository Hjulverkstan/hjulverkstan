# 2026-10-20 — Every card in the wiki gets a graphic

Every placed file in the wiki now carries a graphic of its own, so each card shows a drawing above its title, as the rule's own cards do. [The initiative](../initiative.md), the first card, was drawn first as a try: a bicycle with a heart above it, for the bikes as the medium and the community as the heart. Once it was approved, the rest followed. On Emelie's instruction, on `feature/build-wiki`.

## What changed

- **A graphic and an icon per card**, drawn in the hand the practice sets ([practice §8.7.1](../the-rule/poc/practice.md#871-the-graphic-is-drawn-in-one-hand-with-an-icon-beside-it)): line art on a 64-unit square, one line weight, one quiet fill, coloured by the surface's roles, with a 16-unit icon beside it as `<name>.icon.svg`. The rule's `rule.svg` was the template. Each is kept in the `.img` beside its file, and a folder's entry draws as `.img/README.svg`.

- **One line above each title** names the graphic, so the card shows it. 29 files got the line: `initiative.md`, `making.md`, `reflections.md`, the transcripts' entry and its six transcripts, the portal's entry and its eight tasks, and the pipeline's entry with its eleven pages beneath.

- **The six transcripts share one graphic**, `transcripts/.img/transcript.svg`, a page headed by a sound wave, since the practice has a run of entries of one kind name one drawing. Their names tell them apart. Only the line above the title was added; no speaker's lines changed.

The subjects, card by card: the initiative a bike and a heart; how the wiki is made, an open book and a pencil; the team's reflections, a mountain mirrored in water; transcripts, a microphone. The portal is a screen with a bike on it, and its tasks are a signpost for finding your way, a wheel and a wrench for repair, wheels in line for the queue, a tagged bike for adding a loan bike, a bike leaving and a bike coming back for lending and return, two opposite arrows for giving and receiving, and a no-entry sign for problems in the portal. The pipeline is a pipe with a valve; pipelines in general an assembly line; reading a workflow, a page under a lens; good pipelines' ideas, a light bulb; checking, a shield with a check; delivering, a parcel; the API's path, stacked containers; the website's path, a browser window; republishing, a page with arrows round it; changing the pipeline, a gear and a pencil.

- **"When the portal says no" is now "Problems in the portal, and what to do"**, since the page holds more than refusals: a failed text message, and faults the portal gives no message for at all. The title names the portal and says what the page gives. *Emelie's call, after "If something goes wrong" was tried and reverted as too general.* The title changed in `portal/no.md`, and with it the card's words in `portal/README.md` and the two links that quoted it, in `portal/queue.md` and `portal/repair.md`. The file and its anchors kept their names, so no link moved, and the no-entry sign stays.

Files touched: the 29 files above. Files created: 23 graphics and their 23 icons, in `wiki/.img/`, `wiki/transcripts/.img/`, `wiki/portal/.img/`, `wiki/pipeline/.img/`, `wiki/pipeline/basics/.img/` and `wiki/pipeline/delivering/.img/`, and this entry.

## Left open

1. **The drawings are stand-ins by a session**, like the rule's own, to be drawn again by a better hand if wanted.

2. **The rule's own cards** inside `the-rule/` were left as they are, since they already carry graphics and that repository is the rule's.

## What was decided

- **The portal's task cards show no screenshot.** The practice lets a file carry an image after its title, which fills its card ([practice §8.7.2](../the-rule/poc/practice.md#872-the-image-is-what-the-file-is-of)), and a task's own screenshot could have stood there. It was not taken: it would crowd out the graphic, screenshots of forms look alike at card size, and a screenshot kept twice is two copies to keep up when the portal changes. The screenshots stay in the steps they show. *Emelie's call, 2026-10-20.*
