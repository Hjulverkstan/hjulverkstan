# 2026-10-22 — What's to come gets a card of its own

What Hjulverkstan's software still lacks is gathered in one page, [What's to come](../to-come.md), placed as a part of its own in [the root](../README.md), after *How it's built*. It is a place for bugs, wishes and ideas, a to-do list and a vision board in one. On Emelie's instruction, on `feature/build-wiki`, after she approved an outline.

## What was decided

- **Its own card on the root**, not a part of an existing one. It stands after *How it's built*, since its items stand on the portal and on how the software is built. *The team's decision.*

- **The title, *What's to come***, chosen from four offered: *What Hjulverkstan still lacks*, *Where it goes next* and *Open ends* were the others.

- **Grouped by kind**: broken now, asked for and not built, ideas, and last how an item is added and taken away. Within a kind, by part: Shop, website and Web edit, under the hood. Grouping by part first was offered and not chosen. *The team's decision.*

- **One line per item**, with how it is known and a link to its home where it has one. Detail already written elsewhere, in the portal guide or *How it's built*, stays there.

- **The workshops' open questions about their routines are left out**, such as whose name a child borrows under; they stay in the portal guide. *The team's decision.*

- **No GitHub issues, and no links to them, for now.** The bugs were found by agent sessions and the team has not tried them; they are tried first, and an issue is made once they have been. *The team's decision.*

- **The home page's *Work with us* and *Become a partner* lead nowhere**, and need a document from Save the Children with what the forms should hold. Given by Emelie; the links were read in `web/src/root/Home.tsx`.

## Drawn from

The log's entries, above all the portal guide's of [2026-10-12](2026-10-12-portal-guide-begun.md) and the Web edit page's of [2026-10-22](2026-10-22-web-edit-page.md); the approved transcripts of Frölunda (§3.2, §4.3–4.4), the October client meeting (§10) and the Web edit workshop (§5.1, §5.4.1, §6); and the open findings in `how-its-built/`. Not yet drawn from, on the team's go to start without them: the issues on GitHub, and the spring's document of the website's last fixes that Jona is to hand over.

## Found on the way

Read in the code, not tried:

- The home page's card on donating material opens the repair service.

- The contact page's questions say the workshops offer rentals.

- `how-its-built/README.md` gives the address as hjulverkstan.se where the deployed one is hjulverkstan.org, as [2026-10-22](2026-10-22-web-edit-page.md#bugs-found-not-reported) already found. It is the wiki's own fault, not the software's, so it is not on the page, and it is not mended here.

## How it was made

1. An outline, then the page, its graphic and icon (a seedling), and the root's card and confidence line.

2. **A fresh head** read it cold against the rule, and one round followed:
   - Shop and Web edit are now given where the page first uses them, and the words a Save the Children reader would not hold are plainer.
   - The estimates now say whose they are.
   - The face no longer says nothing is on GitHub, only that the team has not reported it.
   - Running it in AWS moved under *Broken now*, and the wizard under *Not built yet*, since it is offered to the interns to build. *Asked for, not built* became *Not built yet*, since two of its items were found missing rather than asked for.
   - Every brief now closes with its own confidence line.

   Its other points, words a developer holds in the part written for developers, were left.

3. **Checked** with the surface's `--check` from `wiki/`: 392 briefs traced from `README.md`, no faults, and no face flagged in the new page.

Files touched: `wiki/to-come.md`, `wiki/.img/to-come.svg` and `to-come.icon.svg` (new), `wiki/README.md`, and this entry.

## Left open

1. **The team's trial of the bugs**, before any issue is made.

2. **Whether Save the Children's feedback comes in here**, as the one place Alten took on to arrange in the Web edit workshop.

3. **The two sources not yet drawn from**, above.
