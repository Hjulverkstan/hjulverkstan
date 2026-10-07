---
under: the rule
kind: brief
---

# The pipeline

The pipeline is the automatic road every change to Hjulverkstan's software takes on its way to the workshops. Its steps are written once and run the same way every time, so every version the workshops get has passed the same check, and is named, so the team knows which one runs. Everyone working with Hjulverkstan, whether or not they write code, can read here what happens to a change and when it reaches the workshops.

The software has two parts. The website is both the public site and the portal where staff work, among other things writing the site's text. The API is the program behind the website; it keeps the data in a database, and the site's images in a store of their own.

The software runs in three [environments](basics/README.md#4-from-code-to-a-running-program): dev, where the team sees a change first; test, where a release is tried before it reaches prod; and prod, the one the workshops and visitors use. Each has its own website, API and database, so trying a change in one leaves the others as they were.

![Three columns headed dev, test and prod, each listing website, API and database. Under dev: updated by each merge to main, where a change is seen first. Under test: updated by a tag vX.Y.Z-rc.N, where a release is tried. Under prod: updated by a tag vX.Y.Z, what the workshops use](.img/environments.svg)\
The same three parts in each environment. Only what updates them, and who uses them, is different.

People decide when, and the pipeline does the work. A developer proposes a change as a [pull request](basics/README.md#3-how-a-change-travels), and the pipeline checks it. Merging it into the shared code puts it on dev, and a release puts it on test or prod. When staff edit the site, a developer republishes the website so that visitors see the edit.

![A table of the three parts. Check: happens whenever someone proposes a change; gives a yes or no, and nothing goes live. Deliver: happens when a change is accepted or released; puts a new version live. Republish: happens when someone asks for it; gives the website with its newest text](.img/jobs.svg)\
The pipeline's three parts, when each happens, and what each gives.

*Pipelines in general* is for anyone new to pipelines or to GitHub, the site where the code is kept. It also explains the words linked on this page.

[Pipelines in general](basics/README.md)

*Seen, in `.github/workflows/`, read 2026-10-05; not checked against a real run, nor against the repository's settings on GitHub.*

## 1. Every proposed change is checked

Another developer reviews each pull request, but reading a change does not show whether it still runs. So every pull request is checked automatically, and shows green or red before it is merged. The check [builds](basics/README.md#4-from-code-to-a-running-program) the API and the website from the change, and runs the API's tests. A change that breaks a build, or fails a test, turns the check red.

The check is narrow. The API's only test today makes sure it starts, and nothing tests how the website behaves, so whether the software works as it should is still for people to try. Whether a red check also stops the merge is a setting on GitHub, outside the pipeline's files.

[Checking every change](checking.md)

*Seen, in `pr.yml`, `stage-test.yml` and `api/src/test/`; the review is the team's practice, from the [guidelines](../../GUIDELINES.md).*

## 2. Merged changes reach dev, releases reach the workshops

A merged change to the code goes to dev by itself. Like every delivery, it first runs the check again, for the parts it delivers, and a red one stops it there.

The workshops get a change only through a release. A developer makes one by putting a [tag](basics/README.md#3-how-a-change-travels) on the code, a name for one exact version. A release candidate, a version to try, goes to test, and a final release goes to prod. The pipeline does not make a final release wait for a candidate; trying one on test first is up to the team.

While a new API is put in place, it is offline, likely for a minute or two, and the portal cannot reach its data until it is back.

A delivery changes the API and the website, but not the database's tables. A change to how the data is stored has to be made in each environment by hand, or the new API meets tables that do not fit it. For the same reason, when a developer puts an earlier version back on prod, the database is not taken back with it.

[Delivering a change](delivering/README.md)

*Seen, in `pipeline.yml`, the stage files it calls, `application.properties` and `api/pom.xml`, where nothing changes the tables. How long the API is offline, what the portal does meanwhile, what an unchanged table does to a new API, and going back are reasoned, not tried.*

## 3. Edits to the site show after a republish

The website is built anew for each environment, with that environment's text and choice of images written into its public pages, so each page is ready before a visitor asks for it.

Staff write the text and choose the images in web edit, the part of the portal made for it, and an edit is saved at once. But it reaches visitors only when the website is built again.

Republishing does that for one environment: it rebuilds the website running there with the text and images as they are now. It brings in no new code, so it is not a delivery and runs no check. Each environment keeps its own text and images, so an edit made in test's portal is not carried to prod.

Today a developer starts a republish by hand on GitHub. It is meant to be started from the portal itself, so staff will not need to ask.

[Republishing the website](republishing.md)

*Seen, in `stage-build-web.yml` and `publish.yml`. The plan is held open: the author's, stated in commit `da06213`, 2026-01-12; nothing starts a republish from the portal yet.*

## 4. Changing the pipeline itself

The pipeline is code like the rest, changed by a pull request, and a mistake in it can stop every delivery or let a broken one through. So a developer about to change it has a page of its own, read step by step when that moment comes.

It says where each kind of change belongs, how to try it safely, and what to ask before merging. Anyone else can skip it, and since it stands on all three parts above, it comes last.

[Changing our pipeline](changing.md)

*Reasoned, from the page it places.*
