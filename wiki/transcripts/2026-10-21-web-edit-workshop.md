---
under: the rule
kind: brief
---

![A page whose head is a voice's sound wave, with lines of text beneath](.img/transcript.svg)

# Workshop on Web edit — 2026-10-21

Jona and the interns took Linda, new at Save the Children, through the knowledge base and the portal, the web app for the workshops, ending in Web edit, the part that changes the public website. Web edit already holds what the website shows, in several languages; publishing safely is the spring's work. Faults were found, the opening hours need more, and each side took on actions.

*Source: `2026-10-21-WebEdit-workshop.vtt` (64 min, in Swedish), kept outside the repo in `.raw/` with a rendering of it as timestamped text. Participants, as given by Emelie: Jona (Alten); the interns Emelie, Eric and Sanna, in the last week of their first period; and Linda from Save the Children. The recorder attributed every cue to Jona; other voices are inferred from content, and questions are left unattributed where the speaker is unclear. Most of the meeting was a screen shared on a TV, and what was shown is written as far as the words carry it. Written under [the rule](../the-rule/rule.md) from the recording directly, without a separate 1:1 clean, and ordered by the knowledge rather than by the clock; timestamps point back to the minute. What is said about the portal is as said and shown in the meeting, not checked against the code.*

*Status: draft, not approved; nothing is drawn from it until every voice has approved it.*

Contents:

- [1. The knowledge base](#1-the-knowledge-base--0345)
- [2. The portal: three environments, three parts](#2-the-portal-three-environments-three-parts--0654)
- [3. Built for a power user](#3-built-for-a-power-user--1145)
- [4. Admin](#4-admin--2436)
- [5. Web edit](#5-web-edit--2536)
- [6. Faults found](#6-faults-found--2640)
- [7. What each side took on](#7-what-each-side-took-on--5502)
- [8. Saturday's event](#8-saturdays-event--6213)
- [9. On transcribing](#9-on-transcribing--0003)

## 1. The knowledge base · 03:45

The knowledge base is what the team builds with AI from every recorded meeting: knowledge of the whole operation and of the portal, to be a working tool from here on. It is not yet on an address of its own, and needs no login to read.

It is early. The interns are in the tenth and last week of their first period, and come back for a second in the spring. The first six weeks went to building this way of working, and perhaps two to the knowledge itself. Jona will put in an hour here and there over the winter.

Its root holds the background, an important cornerstone, and the portal. It does not yet hold Web edit, and this meeting is for that.

The portal guide goes through each task with screenshots. Some of what it shows may be workarounds rather than how the portal is meant to work, and that will be looked at.

The guide covers giving bikes away, and how such a bike is taken out of the inventory. Save the Children is unsure how relevant it is. It happens, but rarely, when needed or at an event, and it should not be signposted: it is a happy bonus, or it becomes "why don't I get one?". Taking the bike out of the inventory could be covered some other way.

The young people in the workshops are meant to use it, as they would instruction videos, and it is only in English for now. That matters, since some of them are fluent and some have no English at all. Translating it is a fair question, but it has a technical challenge behind it, and it is not certain it would work.

*Open:* whether and how the knowledge base is translated.

Linda was taken with the knowledge base. Of the work as a whole, she said at the end: "It's still fantastic that you do this. I don't really understand it all yet, but I think it's so lovely, it warms my heart." Pointing out typos felt to her like looking a gift horse in the mouth.

## 2. The portal: three environments, three parts · 06:54

The portal is three applications. *Shop* is the heart that everything revolves around, with three tabs: inventory, tickets and customers. A ticket brings together an employee, a bike and a customer in one action; Shop has no tab for employees. *Admin* and *Web edit* are the other two.

It runs in three environments. On dev.hjulverkstan.org the developers work. Test is where new versions, features and fixes are put to be tried, and the workshops can try things there too: it is a playground. hjulverkstan.org is production, with real information. Whoever wants to learn the portal by clicking does it in test.

The public website has no button to the portal, which is not meant to be fronted. Adding `/portal` to the address opens the login.

A login lands in Shop. An admin login also reaches Admin and Web edit. The login on each workshop's computer, open all the time, reaches only Shop.

## 3. Built for a power user · 11:45

The traditional way to build an application is to get to know the users, map every goal and how it is reached, and design iteratively, together. That is not how the portal was built. Jona took the measure of the situation and built intuitively, with limited resources, never knowing whether he would be sent out on an assignment the next week. He has worked many weekends on it.

So he made one central solution, a power user application: the same pattern everywhere, sometimes cumbersome, but able to do almost anything. Every page, in Shop, Admin or Web edit, is a table. A click on a row shows more on the right, where it can be changed or removed, and the add button opens the same panel blank.

The table chooses its columns, sorts, and above all filters. No one chooses who they are at login: the location is just a filter, so another workshop can be looked at too. A search takes one word only. Bikes can be drilled down by size, gears and more.

What it lacks is a dashboard. A question such as "what am I responsible for that is ongoing?" has to be asked through the filters each time. Jona thinks that is enough for the instructors: how many our workshop has in a given state, what each person has.

### 3.1 What it costs, and the wizard · 16:02

The portal should take as few clicks as possible, and preferably be easier than writing on paper. Today it is a bit cumbersome. The plan was always a basic level that works first, and more when it is reached.

When someone comes in, staff search the customers tab, create the customer if missing, go back to the inventory and find the bike again. A shortcut, the ⋯ menu on a row, can create a ticket from there, though Jona is not sure it works.

Started from the tickets tab instead, the bike is searched by its four-letter name and the customer again, and several customers can share a name. It lacks smoothness.

The more tailored solution is the wizard, sketched in the spring from the feedback of Daniel, the mechanic in Frölunda, and already described [in that workshop](2026-09-16-frolunda.md#43-the-wizard--pt2-5203). Jona showed it again. The location is remembered, and the wizard asks, one step at a time:

- what is done: lending (not renting) or repair;

- the ticket's own fields, and nothing else;

- a person or an organisation, since bikes can be lent to another workshop for an event;

- the customer, found and previewed with earlier tickets ("you left a bike for repair in 2023"), or created;

- the bike, from a list already filtered to what fits.

A repair also asks whether it is for a customer or for Hjulverkstan itself. It may offer the bike the customer had repaired before, so no copy is made, though Jona was unsure whether that belongs to repairs.

It might be made simpler still, but that is what Jona has sketched. The power user pages stay, for looking at the information freely, and a dashboard of the usual questions is simple to make now, with AI.

The interns are welcome to build the wizard, with AI as the team now works: while back at school if they are keen, and otherwise in the spring.

## 4. Admin · 24:36

Admin holds the locations, the employees and the logins. A location can be a workshop or a place bikes are stored, and a new one is created here. A login is separate from an employee: being an employee does not mean being able to log in, and no one has a private login.

The workshop's login is kept by whoever is responsible at the workshop, and the staff do not know its password. When it has been logged out, after two weeks, the responsible person logs it in again. Saving the password instead is a question of security.

There is no "forgot password". A password is changed in Admin, on the user's row: edit, and the new password twice. Whoever forgets theirs goes to someone already logged in, so passwords propagate from person to person.

## 5. Web edit · 25:36

Web edit changes what the public website shows. It has a language button, and several languages are in place. Save the Children chooses which to work in at first, and its own people translate.

Linda found it intuitive: easy to see what to do. She learns by clicking, and asks a great deal, since what she has heard so far came in fragments.

### 5.1 What Web edit still lacks · 29:15

Web edit has no publish button, and a change does not reach the website on its own. The website is built from a snapshot of Web edit's data, and for now Alten publishes, [as the October meeting said](2026-10-15-client-meeting.md#6-the-portal-is-ready--3307).

Publishing safely is what Web edit lacks, and the hardest part of it. It is sketched, not finished, and it is the work of the interns' second period: technically deep, and no interns so far have been able to take it on. These are the first who can, and Jona would rather their period did not end, so it could be done now.

Publishing needs a system to work in. An editor needs to know whether they are in a draft or in something queued to publish, and publishing sends out what is queued. Then comes history: seeing what was published, what an update looked like three versions ago, and rolling a publication back. Since the infrastructure is laid anyway, these come with it, and they keep anyone out of trouble.

Seeing changes live is missing too, and it is not complicated. Both the website and Web edit are React in the same application, so the website can be placed inside Web edit and fed its data live, a preview beside the editing, in about two hours, plus some design.

The step after is to click a text on the website and change it in place, or add an update with a plus. With AI, these extras Jona always saw but could never prioritise are within reach.

### 5.2 The tabs · 33:55

Web edit has five tabs. *Text*, *Shops* and *Stories* hold what the website shows. *Courses* and *Partners* have no page on the website yet; they are possibilities.

### 5.3 Stories · 35:06

Stories are the website's updates; the four shown, in dev, were made up. Fields in purple are translatable, the title and the text; fields in grey are not, the slug, the name in the address, and the image.

The text is rich text, the first in the application, written in an editor with bold, headings and lists. It cannot yet hold images or videos, a fairly small feature and a priority: the rest of the website is pared down, and the updates are the one place to build content organically, to give it warmth and soul.

Jona thinks only Swedish and English are published, switched on by hand, so a translation added in another language would not appear. For now Save the Children has to keep track itself that both are filled, which the table shows, since a missing translation stands empty; switching a story to English showed nothing yet.

A new story could not be added in the meeting, probably because one can be created only in Swedish, the main language. Where a translation is missing, the published website falls back to the main language, so it comes first.

### 5.4 Shops · 39:23

A shop in Web edit is the facade of a workshop, what the website shows of it, and it is linked to one of the six locations in Admin. The link is what lets the website show the bikes at that workshop, and the shop's name comes from it.

Bikes are always somewhere, at a workshop or in storage, and the Shop app and Admin existed before Web edit, so the location was there first. A shop in Web edit is published in versions, and thinking aloud, Jona doubted it could be merged with the Admin location for that reason. It can be simpler, though: Web edit could forbid adding a shop and offer only those that exist.

A shop has no translatable fields: name, address, latitude and longitude. The coordinates are there for Google Maps, since, Jona believes, an address does not always land the pin right; the reason can be double-checked.

Opening hours are filled in per day, and the website shows them compactly, "Tuesday to Wednesday". A box marks them as temporary, which shows a small flag, with no dates.

Rental is switched on per shop, and for now it is off at every one, since no workshop has photographed and put up its bikes yet; so the workshops can be onboarded one at a time. Switched on, the shop's page shows its bikes, each with a page of details. Those are Hjulverkstan's own bikes, never customers', in good condition and not lent out.

#### 5.4.1 The opening hours need more · 40:58

The flag is too little. The workshops close to customers at the turn of November, and will likely open two hours a week each over the winter, to help change to winter tyres but not for repairs; that is not yet decided.

Whether hours change beyond the winter was put as a question, and the first lean was probably not, perhaps two weeks in the summer. Then came the bike club, nine weeks with containers moved around the city in a collaboration, when the workshops cut their hours for lack of people. And the workshops are usually closed at weekends, but open for an event, such as Saturday's. Such things come up.

What to build depends on the changes. If they are only summer and winter, a tailored winter message would do; if they are free, a free message about the temporary hours.

The needs pull different ways. Hours that change for one week need someone to remove the flag afterwards; dates that switch on their own add complexity; showing this week's hours hides the ordinary ones.

Meanwhile Save the Children can put in a message for the winter, [as it took on](#7-what-each-side-took-on--5502).

Holidays are another need: not everyone knows which days are red. Google handles them itself, and Save the Children wants to keep Google up to date, but a website with clear hours is where people go when they do not trust Google. Opening hours are one of the website's most important faces toward its visitors.

Jona finds the card dull and uninviting, and it needs an upgrade.

*Open:* what changes to opening hours there are beyond the winter, for Save the Children to answer, and the card's design, for which the winter gives time.

### 5.5 Text · 50:57

Text holds 59 rows, the larger texts of the website, each named by the page it stands on, such as Services. The basic vocabulary, the buttons, is translated in the code.

New items cannot be added from here. A text comes with its place in the design, and every new one must also be translated, so changing what the website holds is done together; Save the Children owns the content.

## 6. Faults found · 26:40

Three faults were found on the website and one in Web edit's data, and the portal itself failed during the meeting.

Two were found by browsing the website, the first by Linda the day before:

- **A misspelt heading.** On a workshop's page, the heading for available bikes is misspelt. Linda can change it in Web edit, and it reaches the website when it is [published](#51-what-web-edit-still-lacks--2915).

- **A blank page.** From the page of Backa, one of the workshops, clicking on to another workshop gave a blank page.

Two more stood out in the meeting:

- **The support page.** Its arrows and "contact us" lead only to the home page, as was said when the two sides met [the week before](2026-10-15-client-meeting.md#10-two-wishes-for-the-website--6126). The form behind them is missing. At least one form was made but never linked.

- **A text with no name** in Web edit's Text tab.

The support page goes back to the spring. Getting the last things fixed before going live took long, with cumbersome communication, and Jona, Samir of Save the Children and others had a document of what remained; not all of it was done.

The portal loaded without end, which is a fault in the refresh-token mechanism, and reloading logged Jona out.

It was also unusually slow. No one looks after the infrastructure in AWS now: there is no operations protocol for following changes and upgrading, and that may be the cause.

## 7. What each side took on · 55:02

The faults, the opening hours and Linda's start in the portal left actions on both sides.

- **Jona** finds the spring's document of the website's last fixes and gives it to the interns, to be read into the knowledge base with the faults found here, as he took on in [the October meeting](2026-10-15-client-meeting.md#10-two-wishes-for-the-website--6126).

- **Linda** is trying to get an email address for Hjulverkstan at Save the Children, so the contacts on the website do not hang on one person. It waits on her manager. Addresses in the form document may be out of date.

- **Save the Children** comes back on the opening hours, [as above](#541-the-opening-hours-need-more--4058), and puts in a message for the winter meanwhile.

- **Jona** sketches the opening hours card further.

- **Alten** comes back with a login for Linda; Jona could not make one in the meeting, without access to production's Admin. It comes with a simple password she changes as her first task. She is then who helps Chiaco, of Save the Children, and Daniel, in Frölunda, when they forget theirs.

- **Alten** looks through the knowledge base together, puts it out, and pings Linda so she can read it.

- **Alten** arranges one place to collect feedback.

## 8. Saturday's event · 62:13

Chiaco has sent word about the event on Saturday, [24 October](2026-10-15-client-meeting.md#9-the-day-on-24-october--4720). Alten's part comes last, so that it is not diluted by what follows.

It is held at Returhuset, as [the October meeting](2026-10-15-client-meeting.md#9-the-day-on-24-october--4720) said; a doubt raised late in this meeting, about another building, was answered by Emelie afterwards.

## 9. On transcribing · 00:03

The last meeting's transcript was in Swedish, which brought more mishearings, so time went to correcting it and giving it context. It also repeated a good deal, since much was gone over again for Linda. The lessons are to be collected, so the next is done better; this recording's are in [the mishearings](mishearings.md).

A transcript strikes a balance: the most important knowledge goes in, and nothing is to be lost. What the last one should have left out was the questions the room had agreed to skip, and the filler and humour of talk. It was to be checked before use, since the recordings are the participants' own; the transcripts' [approval](README.md#2-approval) says who approves.
