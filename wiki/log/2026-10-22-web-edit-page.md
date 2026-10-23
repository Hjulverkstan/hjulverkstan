# 2026-10-22 — Web edit gets its page in the portal guide

The portal guide's empty link to Web edit is now [a page](../portal/web-edit.md), *Changing the website*, for whoever keeps the website at Save the Children. It was written from the [Web edit workshop](../transcripts/2026-10-21-web-edit-workshop.md), then tried on a local copy of the portal with screenshots. On Emelie's instruction, after she approved an outline and sample.

## What was decided

- **The Web edit transcript is approved**, as given by Emelie.

- **The page's place:** one file, `portal/web-edit.md`, placed in the guide's §2 where the empty link stood. Its reader is the person keeping the website, not workshop staff, and the guide's face now says it holds that one page.

- **The start page is mended.** The portal's address (hjulverkstan.org/portal), the workshop's always-open login, who keeps its password, and the test environment are now given, from the transcript. Workshop staff lock the computer rather than log out, since they cannot log in again.

- **The test environment's address is given**, test.hjulverkstan.org/portal, in the Web edit page and the start page, on Emelie's go: it is public, and changes still need a login there. It was found in public DNS beside dev.hjulverkstan.org, not opened. Test has its own logins, and its website, too, is published only by Alten for now, by hand or with a release candidate's tag.

- **Where the run and the transcript disagree, the run wins,** and the page says so in its confidence lines.

## How it was made

1. **Written from the transcript**, whole, before the portal was opened.

2. **Ran the portal locally**, never production, as the guide's first pages were: the API and website from this repository against the local `hjulverkstan_guide` database, reset to the seed data, with no AWS keys and a dummy image bucket. Images could not be uploaded.

3. **Walked Web edit** with a scripted browser: every tab, an update made in Swedish and seen in English, a workshop's opening hours and temporary hours, a text changed, a Somali text added, updates deleted, and the public website after each.

4. **Six screenshots**, on fresh seed data, with the development tools' button hidden, in `portal/.img/web-edit-*.png`, with the page's graphic and icon.

5. **Seven fresh heads**, the page rewritten after each, until the last found only words and one gap, where to find a new workshop's map numbers, which was filled. Two of their readings of the code were tried in the run and corrected it: an untranslated update shows as an empty card rather than being left out, and deleting a translation in **Text** takes a stray language off the website again.

6. **The order changed** on the way: how Web edit's tabs work now stands before languages, which lean on them, and the page warns where a reader would do harm: a third language, an update left without English for a publish, and **Delete** in **Shops**.

## Found in the run, against the transcript

- **Temporary hours are saved but never shown** on the website; no code reads them. The transcript has them showing a flag.

- **A language is offered on the website as soon as anything is translated into it.** The transcript believed only Swedish and English were switched on by hand. One Somali text put a Somali website live, with every other text blank and code names such as *availableBikes* on its buttons and headings.

- **An update with no English shows as an empty card** on the English website.

- **The misspelt heading, *Tillgänliga cyklar*, is in the code** (`web/src/data/translations/sv.ts`), not in Web edit, so it cannot be corrected there as the transcript has it.

- **A workshop page's name and address come from Admin**, through its location, not from fields of its own.

- **Deleting an update** works from Swedish, even when it has an English translation, and removes it in every language.

- **Deleting a translation in Text** takes its language off the website again.

- **Delete in Shops** removes a workshop's whole page whatever language is chosen, though its confirm box speaks of a translation.

## Bugs found, not reported

On the pattern of the guide's first pages, no GitHub issue was made; these are for the team to look at.

- Temporary hours are stored and never shown.

- A single translation into a language without the code's own words publishes a broken website in that language.

- An untranslated update shows as an empty card instead of being left out or falling back to Swedish.

- *Tillgänliga cyklar* is misspelt in `sv.ts`.

- Some texts in **Text** carry raw names from the code, such as *enumTextShopDetailsAllVehicleBorrowedBold*.

- **Delete in Shops** confirms deleting a "translation of shop" with a language other than Swedish chosen, but removes the whole page.

- `how-its-built/README.md` gives the address as hjulverkstan.se, from the CDK README; the deployed hosted zone in `cdk/cdk.context.json` is hjulverkstan.org.

Files touched: `wiki/portal/web-edit.md` (new), its graphic, icon and six screenshots in `wiki/portal/.img/`, `wiki/portal/README.md` (placed, face and §2), `wiki/portal/start.md` (§1 and face), `wiki/transcripts/2026-10-21-web-edit-workshop.md` (approved), and this entry.

## Talked about: publishing from Web edit

Emelie asked how a saved change reaches the website, and the session read it from the code. The website is built ahead of time from a copy of Web edit's data. Nothing in Web edit, the API or the repository starts that build. It runs only when someone at Alten starts *Publish (web)* (`publish.yml`, `workflow_dispatch` alone) by hand, or as a side effect of a code delivery through `pipeline.yml`, which takes along whatever is saved, ready or not.

Building ahead of time is by design: `web/README.md` gives load times and search engines as the reason. Contacting Alten for every publish is not. The same README says pressing a publish button in Web edit is meant to trigger the build and deploy, and names its own flaw, that a code release sends out unpublished edits ([issue #31](https://github.com/Hjulverkstan/hjulverkstan/issues/31)). The button exists in the code, `PortalWebEditPublish.tsx`, but is not shown or connected.

From an editor's side, Emelie found that wanting: a person keeping the website should see their changes, or at least publish them, without asking Alten each time. The session outlined the smallest fix, about a day's work:
- an API endpoint, admin only, that asks GitHub to run `publish.yml` for its own environment;
- a GitHub token kept as a secret for the API, never in the browser, preferably a GitHub App, since a personal token expires and publishing then fails silently;
- the existing button shown in Web edit;
- a `concurrency` group in `publish.yml`, so two clicks queue instead of overlapping.

A live preview and drafts with history were named as the steps after.

*Acknowledged and talked about, 2026-10-22; not decided, not built, and on Emelie's word not written up as an issue.*

## Left open

1. **How Save the Children tells Alten** a change is ready, until a place for feedback is arranged.

2. **The winter message** has no place in Web edit; what the website should say over the winter waits on Save the Children.

3. **Images** in Web edit could not be tried locally.

4. **A publish button in Web edit**, as talked about above: whether and when to build it.
