---
under: the rule
kind: brief
---

![A seedling with two leaves growing from a mound of soil](.img/to-come.svg)

# What's to come

What Hjulverkstan's software still lacks is gathered here: what is broken now, what is asked for and not yet built, and the ideas not yet decided. It is one place for the team and Save the Children to see what lies ahead, so that no fault or wish lives only in someone's head or in one meeting.

Each item is one line: what it is, how it is known, and where it is written in more detail. Most were found by agent sessions while the wiki was written. The team has not yet tried the bugs or reported them on GitHub, though some may already be there. Anyone may add an item, as [the last section](#4-adding-an-item-and-taking-it-away) says.

*Drawn from the wiki's log and its approved transcripts, 2026-10-22; each item carries its own ground. Grouping by kind, and leaving the workshops' open questions about their routines to the portal guide, are the team's decisions, 2026-10-22. Not yet drawn from: the issues on GitHub, and the spring's document of the website's last fixes.*

## 1. Broken now

These work wrong today, for staff in the workshops, for visitors to the website, or for whoever keeps the software running, so they come first. *Seen in a run* means an agent saw it on a local copy of the portal; *read in the code* means it was only read, not tried.

*Gathered 2026-10-22, from the sessions and meetings each item names.*

### 1.1 Shop

Shop is the part of the portal the workshops' staff use every day, for bikes, customers and tickets. The portal guide says how to work around the ones that touch them, in [Problems in the portal](portal/no.md#i-things-that-go-wrong-without-a-message).

- **A bike's comment is never saved**, when the bike is made or edited. Seen in a run and in the code, [2026-10-12](log/2026-10-12-portal-guide-begun.md#bugs-found-not-reported).

- **Editing a loan bike sets it to *Unavailable***, so it drops off the website without anyone noticing. Seen in a run and in the code, 2026-10-12.

- **Editing a ticket sets it back to *Ready***, even a closed one. Seen in a run and in the code, 2026-10-12.

- **Giving a bike away does not archive it**, though the portal says it will. Seen in a run and in the database, 2026-10-12.

- **A loan bike needs a brand, but the form does not say so**; the portal only says it failed. Seen in a run, 2026-10-12.

- **When the *Create* button stays grey, some of its messages name no field.** Seen in a run, 2026-10-12.

- **Choosing a ticket's type a second time clears it.** Seen in a run, [2026-10-12](log/2026-10-12-portal-guide-begun.md#found-in-the-run).

- **The success message misses the number.** Cosmetic. Seen in a run, 2026-10-12.

*Seen by an agent on a local copy, not yet by the team.*

### 1.2 Website and Web edit

Web edit is the part of the portal where the website's texts, updates and workshop pages are kept. Visitors meet some of these faults on the website, and whoever keeps it meets the rest in Web edit; [Changing the website](portal/web-edit.md) tells them how to avoid the ones that do harm.

- **Temporary hours are saved but never shown** on the website; no code reads them. Seen in a run and in the code, [2026-10-22](log/2026-10-22-web-edit-page.md#found-in-the-run-against-the-transcript).

- **One translation into a new language puts a broken website live** in that language, its other texts blank and code names on its buttons. Seen in a run, 2026-10-22.

- **An update with no English shows as an empty card** on the English website. Seen in a run, 2026-10-22.

- **Some texts in Web edit carry raw names from the code**, and one has no name at all. Seen in a run, 2026-10-22, and in [the Web edit workshop](transcripts/2026-10-21-web-edit-workshop.md#6-faults-found--2640).

- ***Delete* in *Shops* removes a workshop's whole page**, though its confirm box speaks of one translation. Seen in a run, 2026-10-22.

- **The heading *Tillgänliga cyklar* is misspelt**, in the code rather than in Web edit, so only Alten can correct it. Read in the code, 2026-10-22.

- **Going from one workshop's page, Backa's, to another's gives a blank page.** Seen in the Web edit workshop, 2026-10-21; not tried.

- **The support page's arrows and "contact us" lead only to the home page.** Seen in the Web edit workshop, 2026-10-21; not tried.

- **The donating-material card on the home page opens the repair service**, not anything about donating. Read in the code, `web/src/root/Home.tsx`, 2026-10-22; not tried.

- **The contact page's questions say the workshops offer rentals**, where they lend. Read in the code, `web/src/root/Contact.tsx`, 2026-10-22.

*Seen by an agent on a local copy, seen in a meeting, or read in the code, as each item says; none tried by the team.*

### 1.3 Under the hood

These are for whoever develops or runs the software, and use its words, which [How it's built](how-its-built/README.md) gives. Most have their home there, marked open.

- **The portal can load without end**, a fault in how a login is renewed, and reloading logs the user out. Seen in the Web edit workshop, [§6](transcripts/2026-10-21-web-edit-workshop.md#6-faults-found--2640); not tried.

- **The website's build can fail while the API restarts**, and nothing stops two runs from working on one environment at once. Read in the workflows; see [when a delivery fails](how-its-built/pipeline/delivering/README.md#5-when-a-delivery-fails) and [runs do not wait](how-its-built/pipeline/delivering/README.md#15-runs-do-not-wait-for-each-other).

- **The key the API signs logins with is in the code**, the same in every environment. Read in the code; see [what a delivery does not change](how-its-built/pipeline/delivering/README.md#3-what-a-delivery-does-not-change).

- **The example data gives three administrator accounts with one known password**, and whether test and prod still hold them cannot be seen. Read in the code; see [what the fill leaves behind](how-its-built/pipeline/delivering/README.md#62-what-the-fill-leaves-behind).

- **No tool changes the database's tables**, so every change to them is made by hand in each environment. Read in the code; see [the tables](how-its-built/api.md#3-the-tables).

- **The check is narrow**: the API's only test makes sure it starts, the website's types are not checked, and its lint is not run. Read in the workflows; see [what the check does not catch](how-its-built/pipeline/checking.md#3-what-it-does-not-catch).

- **No one looks after the software in AWS**: there is no routine for following changes and upgrading, which may be why the portal was slow in the Web edit workshop. Said in the workshop, [§6](transcripts/2026-10-21-web-edit-workshop.md#6-faults-found--2640); the cause not checked.

- **The readmes are partly out of date** against the code. Read 2026-10-05 and 2026-10-20; see [running it locally](how-its-built/working.md#1-running-it-locally) and [2026-10-05](log/2026-10-05-pipeline-next.md#found-in-the-source-beyond-what-the-old-pages-said).

*Read in the code and the workflows, or said in a meeting, as each item says; none tried.*

## 2. Not built yet

The software does not have these yet. Most were asked for, by the workshops or by Save the Children, and a few were found missing while the wiki was written. None has a decision on when.

*Carried from the meetings and sessions named, not checked with whoever asked.*

### 2.1 Web edit

What Web edit most lacks is a way to put a change on the website, and the steps that make publishing safe come after it.

- **A publish button.** Today only Alten can put a saved change on the website, and a code delivery sends out whatever is saved, ready or not. The button exists in the code but is not shown or connected; the smallest fix was outlined at about a day's work, the session's estimate. Talked about, [2026-10-22](log/2026-10-22-web-edit-page.md#talked-about-publishing-from-web-edit).

- **A live preview** beside the editing, about two hours' work plus design by Jona's estimate, not checked. Said in the [Web edit workshop](transcripts/2026-10-21-web-edit-workshop.md#51-what-web-edit-still-lacks--2915), 2026-10-21.

- **Drafts, history and rollback**: knowing what is a draft and what is queued, seeing what was published, and going back. Meant for the interns' second period. Said in the Web edit workshop, 2026-10-21.

- **Opening hours that can change**: more than the *Temporary hours* switch, a message for the winter, public holidays, and a livelier card. It waits on Save the Children saying what changes there are. Said in the [Web edit workshop](transcripts/2026-10-21-web-edit-workshop.md#541-the-opening-hours-need-more--4058), 2026-10-21.

*Said in the meeting or talked about in a session, as each item says.*

### 2.2 Website

Both of these were asked for by Save the Children in [the October meeting](transcripts/2026-10-15-client-meeting.md#10-two-wishes-for-the-website--6126), and Alten took both on.

- **Forms for those who want to take part.** The home page's *Work with us* and *Become a partner* lead nowhere today: the first has no link, and the second only reaches the general contact page. What the forms should hold needs a document from Save the Children with the information. Asked for 2026-10-15; the links read in `web/src/root/Home.tsx`, 2026-10-22.

- **A page of success stories**: young people who started at a workshop and went on, for sponsors and for young people thinking of joining. Asked for 2026-10-15.

*Asked for in the meeting; the links read in the code.*

### 2.3 Shop

Most come from the workshop in Frölunda, where the staff said what they want from the portal next.

- **The wizard, "Trinity"**: a redesign from the spring that asks what you are doing and leads you through it, at least halving the clicks. Designed, not built, and offered to the interns to build, or else in the spring. Said in [Frölunda](transcripts/2026-09-16-frolunda.md#43-the-wizard--pt2-5203), 2026-09-16, and in the [Web edit workshop](transcripts/2026-10-21-web-edit-workshop.md#31-what-it-costs-and-the-wizard--1602), 2026-10-21.

- **A repair queue on a dashboard**, showing what to repair next. Asked for in [Frölunda](transcripts/2026-09-16-frolunda.md#44-what-the-workshop-wants-next--pt2-5723), 2026-09-16.

- **A reminder when a repair has waited too long**, so a bike is not forgotten in a corner. Asked for in Frölunda, 2026-09-16.

- **A text on completion saying what was done**, perhaps from checkboxes following the workshop's protocol. Asked for in Frölunda, 2026-09-16.

- **Loan bikes found by when they are free**, with an overview of when bikes come back and help to plan. Asked for in [Frölunda](transcripts/2026-09-16-frolunda.md#32-what-the-workshop-needs-from-a-system--pt2-0740), 2026-09-16.

- **A digital borrowing contract by text message**, to go to Save the Children's legal support first. Asked for in [Frölunda](transcripts/2026-09-16-frolunda.md#35-lending-bikes-and-tools--pt2-2239), 2026-09-16.

- **"Borrow" rather than "rent"** in the portal's words. Asked for in Frölunda, [2026-09-16](log/2026-09-24-frolunda-transcript.md#the-meeting).

- **A way for a received bike to become a loan bike**; none was found. Seen in a run, [2026-10-12](log/2026-10-12-portal-guide-begun.md#found-in-the-run).

- **Foreign phone numbers**; the portal accepts only Swedish ones. Seen in a run, 2026-10-12; see [a phone number is refused](portal/no.md#c-a-phone-number-is-refused).

*Asked for in the meetings named, or seen missing in a run.*

## 3. Ideas

These are further off: talked about, not asked for as needs, and not decided.

- **What a mechanic repaired, built into a record of their skills**, toward a résumé or diploma. Talked about in [Frölunda](transcripts/2026-09-16-frolunda.md#44-what-the-workshop-wants-next--pt2-5723), 2026-09-16.

- **Changing a text by clicking it on the website**, or adding an update with a plus. Talked about in the [Web edit workshop](transcripts/2026-10-21-web-edit-workshop.md#51-what-web-edit-still-lacks--2915), 2026-10-21.

- **Inventory and knowledge in one place** at the planned new centre, beyond this product. Talked about in Frölunda, 2026-09-16.

*Talked about in the meetings named; none decided, 2026-10-22.*

## 4. Adding an item and taking it away

An item is added as one line under its kind and part: what it is, how it is known, and a link to where it is written in more detail, if anywhere. The detail stays in its own home, and only the line stands here.

A bug is tried by the team before it is reported, and becomes a GitHub issue once it has been; its line then links the issue, and the issue holds the work. When an item is fixed or dropped, its line is taken away, and git keeps it.

*The team's decision, 2026-10-22, that bugs are tried before any issue is made. Whether Save the Children's feedback, which Alten took on to collect in one place, comes in here is open.*
