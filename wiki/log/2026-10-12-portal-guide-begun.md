# 2026-10-12 — The portal guide

A guide to the portal for the people working in the workshops, [`portal/`](../portal/README.md), is written under [the rule](../the-rule/rule.md): its entry and eight task pages, each with screenshots. The entry and the repair were written first as a sample, and the rest once Emelie had approved it. Nothing is committed.

## What was decided

- The guide is for the people working in the workshops first: how to do the everyday work in the portal, task by task. Everyone else may read it to learn how the portal is used. On Emelie's instruction.

- It is written in English for now; translating it is for later. On Emelie's instruction.

- It lives in `wiki/portal/`, placed in [the wiki's entry](../README.md). That it stands first there is a *lean*, the session's.

- The wizard and Samir's part in the education are left out for now. On Emelie's instruction.

- The tasks follow a workshop's day, most common first: finding your way, a bike in for repair, working the queue, adding a loan bike, lending, a loan bike coming back, giving and receiving, when the portal says no. The order was approved by Emelie with adding a loan bike after lending; the session moved it before, since lending needs one. *Lean*, the session's.

- *When the portal says no* is a level of letters, a set to look things up in rather than read through.

## How it was made

1. **Read** the approved transcripts for how the workshops run, the [Frölunda workshop](../transcripts/2026-09-16-frolunda.md) in full and the parts of the [client meeting](../transcripts/2026-08-19-client-meeting.md) on the portal and education. See [the approval](2026-10-12-transcripts-approved.md).

2. **Ran the portal locally**, never production: the API and website from this repository against a separate local database, `hjulverkstan_guide`, filled with the repository's seed data and made-up records, and reset to the seed data between rounds. No AWS credentials exist on the machine, so no image could be uploaded and no SMS sent; the bucket was set to a dummy name as well.

3. **Walked every task** with a scripted browser: a repair from customer to closed, the queue's filter, adding a loan bike and setting it available, lending and return, giving away and receiving, the phone view, the public website's shop page, and the messages that stop you. Each claim is marked as seen in that run, or as from the transcripts, the code, or the session's reading.

4. **Screenshots** were taken with made-up data only, a customer "Amina Larsson" and an employee "Kim Lund"; 21 are in `portal/.img/`.

5. **Checked** with the surface's `--check`, and read by a fresh head holding only the rule and the draft, as a workshop reader: once for the sample, once for the rest.

6. **A round after each fresh head.** After the first, the screenshots were taken again on freshly seeded data, so the bike's number (#10) and the ticket's (#9) differ, and the sample was rewritten: what *Ready* means, what the red marks mean, that the portal switches to *Tickets* by itself, one word for the workshop's bikes ("loan bike"), the portal's words for giving and receiving, plainer confidence lines and plainer English. After the second, the other pages were mended: the bike statuses given in the entry before any page uses them, when a loan bike leaves the website said once, the archived customer's bike said to stay in the list, the delete rule corrected (a bike can be deleted once its tickets are, which the guide advises against), a caption that misread the screenshot, the paper-plane mark, and plainer English. The ticket list's order, newest made first, was checked in the code.

7. **A third fresh head read all nine pages together,** and still found substance, so a third round followed. Tested again in the run: a loan bike turns *Unavailable* as soon as its lending ticket is made, not when it is collected, which the pages had wrong; changing a ticket's employee through **Edit**; a lending ticket never collected; a returning customer's bike; and a repair ticket on a loan bike. Mended: the bike statuses now have one home, in the entry; facts said on several pages (the faults, *Create* staying grey) now live in *When the portal says no* and are linked from the steps; and the steps the reader missed were added (who is the employee, a returning customer's bike, an organisation's fields, a child borrower, a loan never collected, a loan bike's repair). The rounds have not yet reached one that changes only words.

## Bugs found, not reported

On Emelie's instruction no GitHub issue was made; these may already be reported, and are to be looked at later. The guide tells staff how to work around the ones that touch them.

- **A bike's comment is never saved.** The portal sends it, but the API's `VehicleDto.applyToEntity` does not write it, on create or on edit. Seen in the run and in the code.

- **Editing a loan bike sets it to *Unavailable*.** `VehicleDto.applyToEntity` sets the status on every save, not only on create. An *Available* loan bike that is edited drops off the public website without anyone noticing. Seen in the run and in the code.

- **Giving a bike away does not archive it.** The portal's confirmation says the bikes "will be archived", but after a *Donate* ticket the bike is still *Unavailable*; it has to be archived by hand. Seen in the run and in the database.

- **A loan bike needs a brand, but the form does not say so.** The form lets one be created without, and the API refuses it ("brand is required for this operation"); the portal shows only "Failed to create the Vehicle. Try again soon or contact your local developer." Seen in the run.

- **Editing a ticket sets it back to *Ready*,** even a closed one. The edit form sends no status, and the API's `TicketDto.applyToEntity` sets a missing status to *Ready* for repair and lending tickets. Seen in the run and in the code.

- **The success message misses the number**, as in "Successfully managed to create the Customer: ." and "…update the vehicle statuses: undefined". Seen in the run; cosmetic.

- **Some messages behind a grey *Create* name no field**, such as "Invalid input: expected string, received undefined". Seen in the run.

## Found in the run

- The meeting's bug, that *Create ticket* from a bike did not fill in the bike, is fixed.

- A received bike stays a customer's bike after the *Receive* ticket; how it becomes a loan bike in the portal was not found.

- Choosing a ticket's type a second time clears it.

## Left open

- **Where to resume:** a fourth fresh head over the whole guide, and a round after it, until a round changes only words. Paused here on Emelie's word, 2026-10-12.

- How a bike in for repair is marked, so it is found later: the paper note with the portal's number is a suggestion, not decided.

- What to do for a customer with a foreign phone number, since the portal accepts only Swedish numbers.

- Whether the young adults are listed as employees in the portal, so they can be named on a ticket.

- The portal's address, which logins a workshop has, who knows the password, and whose phone is used to photograph bikes.

- How the repair of one of the workshop's own bikes is recorded, before it is set *Available* again. The portal allows a repair ticket on a loan bike when the customer is an organisation, such as the workshop itself; whether workshops do this is open.

- Whose name goes in the portal when a child borrows: the child's or the parent's.

- Whether the person who starts work on a repair should always be named its employee, and whether a returning customer's bike is added again or reused; the guide suggests both.

- What the workshop does when a loan bike is late.

- How a received bike becomes a loan bike.

- Photo upload and the SMS could not be tried locally.

## Files

- Added `portal/README.md` and its eight pages (`start.md`, `repair.md`, `queue.md`, `loan-bike.md`, `lending.md`, `return.md`, `give-receive.md`, `no.md`), 21 screenshots in `portal/.img/`, and this entry.
- Changed `README.md`, placing the guide.
