---
under: the rule
kind: brief
---

# The pipeline

Every change to Hjulverkstan's portal and website is tested, tried and released the same safe way, so nothing reaches the workshops broken and nobody copies files by hand. The pipeline does this in three jobs: it checks each proposed change ([CI](basics/README.md#21-ci-continuous-integration)), delivers it step by step to the version the workshops use ([CD](basics/README.md#22-cd-continuous-delivery)), and rebuilds the website when staff edit its text.

The workshops rely on the portal every day, so nothing reaches them untested, and a person decides when a change does.

If pipelines, git, GitHub or GitHub Actions are new to you, begin with the basics.

[Pipelines in general](basics/README.md)

![A table of the three jobs. Check: happens whenever someone proposes a change; gives a yes or no, and nothing goes live. Deliver: happens when a change is accepted or released; puts a new version live. Republish: happens when someone asks for it; gives the website with its newest text](.img/jobs.svg)\
The pipeline's three jobs, when each happens, and what each gives.

Checking is the first gate. Every proposed change is tested by machines as soon as it is opened, so a mistake is caught while it still costs least, and nothing is deployed. A developer meets it on their first pull request, as a green or red mark. Opening it tells you what the checks actually run, why the web's check starts its own copy of the API, and what to do when a check turns red.

[Checking every change](check.md)

Delivering takes checked code to the people who use it, in two steps. Every change accepted into the shared code goes by itself to dev, a practice version for developers. Prod, the version the workshops use, only changes when someone makes a release, and a release is tried on test, a second practice version, first. Opening it tells you how a release is kept safe, what happens inside one run, and how the API and the web each travel.

[Delivering to dev, test and prod](deliver.md)

Republishing is for the public site's content. Staff edit its text and images in the portal, but visitors keep seeing the old text until the site is built again. Republishing does that rebuild from the code already running, so only the content moves on. Opening it tells you why an edit needs a rebuild, how it finds the right version, and the plan to let staff start it themselves.

[Republishing the site's content](publish.md)

*Everything in these pages is an agent's reading of `.github/workflows/` on 2026-09-30, not checked against a real run.*

## 1. Three copies of the system

Three separate copies are what make it safe to try things: a mistake on one copy cannot harm the others. The copies are Hjulverkstan's [environments](basics/README.md#3-the-words): dev, test and prod. Each has its own web (the public site and the portal staff use), API (the server program that holds the data) and database, and they differ only in what is allowed onto them.

![Three columns headed dev, test and prod, each listing website, API and database. Under dev: updated by each merge to main, where a change is seen first. Under test: updated by a tag vX.Y.Z-rc.N, where a release is tried. Under prod: updated by a tag vX.Y.Z, what the workshops use](.img/environments.svg)\
The same three parts in each environment. Only what updates them, and who uses them, is different.

The data is separate too: a bike you add on dev never appears in prod.

*Seen, in `cdk/assets-ec2/docker-compose.yml` and `cdk/README.md`. What each is for is reasoned from the [release process](../../GUIDELINES.md#release-process-).*

## 2. When a run fails

When one of our runs fails, its log says why, as [watching a run](basics/README.md#4-watching-a-run) shows. The reason is usually one of four.

- A test fails. [Reading a red check](check.md#3-reading-a-red-check) says what to do.

- A [tag](basics/README.md#3-the-words) is refused. It is in the wrong form, or its commit is not on `main`, as [why releases use tags](deliver.md#21-why-releases-use-tags) explains. Delete it with `git tag -d <tag>` and `git push --delete origin <tag>`, then tag the right commit.

- The API does not start. If it has not started after two minutes, the log shows what was running and its last lines. [The API's path](api.md#3-deployed-on-the-server) shows the server.

- The first deploy to a new environment fails. This is expected: its database is empty, so [the web's build](web.md#1-built-into-finished-pages) finds no content. The [infrastructure readme](../../cdk/README.md) says how to fill it.

*Seen, in the workflow files and `cdk/README.md`. Not checked against a failing run.*

## 3. Maintaining the pipeline

What remains is for whoever changes the pipeline itself.

When you are ready to change it, this says how ours follows the ideas of a good pipeline, where each kind of change belongs, and how to try one safely. It stands on [reading a workflow](basics/reading.md) and [what a good pipeline is built on](basics/ideas.md), in the basics, and on [inside one run](deliver.md#3-inside-one-run).

[Changing our pipeline](writing.md)

A handful of small mismatches turned up while these pages were written, and they are worth knowing before you change anything.

[What is open](open.md)

*Seen, in `.github/workflows/`. What is open was recorded 2026-09-28 and read again 2026-09-29.*