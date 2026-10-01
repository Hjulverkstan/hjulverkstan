---
under: the rule
kind: brief
---

# Delivering to dev, test and prod

Checked code only helps once people can use it, so the pipeline delivers it one step at a time, and each step only happens if the one before it worked. Every merge into `main` goes to dev by itself. A release goes to test, and then to prod, the version the workshops use, only when a person decides. Read on to follow one change all the way to the workshops, to see what starts each step and why releases use tags, and to look inside one run at how the API and the web each travel.

This is the CD half of the pipeline, continuous delivery, as [pipelines in general](basics/README.md#22-cd-continuous-delivery) explains, and it is one workflow, `pipeline.yml`, that runs the same four stages every time.

*An agent's reading of the workflow files, not checked against a real run.*

## 1. One change, all the way

The simplest way to see a delivery is to follow one change on its way from a proposal, to dev, to test, and to the workshops.

![Four rows, one per event. A pull request runs only the test stage and lands nowhere. A push to main, a tag vX.Y.Z-rc.N and a tag vX.Y.Z each run init, test, build and deploy, and land in dev, test and prod](.img/road.svg)\
A pull request only runs the checks. The other events run the same four stages, and the event decides where the change lands. Note that "test" is two things: a stage that checks the change, and an environment where it lands.

*Seen, in `pr.yml` and `pipeline.yml`. The story beneath is an example, not a real run.*

### 1.1 The pull request is checked

Imagine you fix a wrong opening time on the public site. Nothing is delivered until the change has passed its checks.

You open a pull request, and [the checks](check.md) run on it. Green means they passed. Nothing is deployed yet.

*Seen, in `pr.yml`.*

### 1.2 The merge goes to dev

Once the pull request is accepted, the change goes live on dev by itself, so anyone can look at it.

The pull request is merged into `main`, and that starts the pipeline. It sees that only `web/` changed, so it tests, builds and deploys only the web. Dev is the copy of the system that always has the newest `main`.

*Seen, in `pipeline.yml`.*

### 1.3 A release goes to test, then prod

The workshops only get the change when a person decides to make a release, and it is tried on test first.

Someone adds the tag `v1.4.0-rc.1` to a commit on `main`. The "rc" means release candidate, a version to try before the real release. The pipeline runs again, now with both the API and the web, and deploys to test, the copy where a release is tried. If it works, they add the tag `v1.4.0`, and the pipeline runs once more, to prod, the copy the workshops use. Nobody copied a file by hand.

*Seen, in `pipeline.yml`.*
## 2. What starts a delivery

What a developer does decides how far a change travels. A merge into `main`, the shared version, reaches dev. A release [tag](basics/README.md#3-how-a-change-travels) reaches test when it is written `vX.Y.Z-rc.N`, and prod when it is written `vX.Y.Z`.

*Seen, in `pipeline.yml`.*

### 2.1 Why releases use tags

A tag names one exact commit, so everyone knows precisely what was released.

![A line labelled main with six commits as dots. The fourth carries the tag v1.4.0-rc.1, which goes to test. The sixth carries the tag v1.4.0, which goes to prod. A note says each dot is a commit, and a tag pins a version name to one of them](.img/tags.svg)\
Two tags on main. The release candidate goes to test. The final version, on a later commit, goes to prod.

The pipeline adds two more rules. A tag must be on a commit that is on `main`, so everything released has been reviewed and merged. And it must be written `vX.Y.Z` or `vX.Y.Z-rc.N`, called [semantic versioning](basics/README.md#3-how-a-change-travels), so people and the pipeline can both read what kind of version it is. A tag in another form is refused.

The rc tag, for release candidate, comes first, so a release is tried on test before the workshops get it. How to make a release is in the [release process](../../GUIDELINES.md#release-process-).

*Seen, in `pipeline.yml` and the guidelines.*

### 2.2 Starting a delivery by hand

Sometimes a delivery must run without a new change, so `pipeline.yml` can also be started with the *Run workflow* button in GitHub's [Actions tab](basics/README.md#5-pipelines-on-github).

The button deploys to dev, and you choose what: the API, the web, both, or whatever changed.

*Seen, in `pipeline.yml`.*

## 3. Inside one run

Every run follows the same order, so a change that fails its checks is never built or deployed. After the checks, the API and the web go separate ways, because they are built and put in place differently.

![A flow of jobs. Init leads to test. From test the road forks: build API leads to deploy API, and build web leads on to deploy web. Deploy API also leads into deploy web, so deploy web waits for both. Build web and deploy API are marked, with the note: the web is built while the API deploys](.img/run.svg)\
The jobs of one run. Deploy web waits for deploy API, most likely so the new site never goes live before the API it talks to; the files do not say why. Build web waits only for test, so it runs alongside the API's build and deploy.

There are four stages. The first, init, decides what to do. Test runs the same checks as a pull request, described in [checking every change](check.md), but only for the parts init chose. Build makes each part, and deploy puts it on the environment. In the Actions tab the workflow is called *Deploy*, the name `pipeline.yml` gives itself, and [watching a run](basics/README.md#51-watching-a-run) shows how to follow one.

*Seen, in `pipeline.yml` and `stage-test.yml`.*

### 3.1 Init decides what to deploy

Init only deploys the parts that changed, which saves time and leaves the other part untouched.

It chooses the environment from the event, and looks at which folders changed, `api/` or `web/`. It also watches a folder `.github/actions/`, which does not exist, as [what is open](open.md#3-small-faults-in-the-workflow-files) notes. If neither changed, the run stops, since there is nothing new to deliver. A tag always deploys both, because a release is the whole system at one exact version. Init writes its decisions at the top of the run's page: the environment, and whether it deploys the API, the web or both.

*Seen, in `pipeline.yml`.*

### 3.2 Build and deploy, one path for each part

The API and the web travel in different ways, because the API's package can be moved between environments and the web's files cannot. Build makes the API into a [Docker image](basics/README.md#4-from-code-to-a-running-program), and the web into a folder of finished files. Deploy puts them on the environment.

Each has a page, for when you need to know how your part is built and where it ends up.

[The API's path](api.md)

[The web's path](web.md)

*Seen, in `pipeline.yml`.*
