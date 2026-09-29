---
under: the rule
kind: brief
---

# The pipeline

The pipeline is how a change reaches the people who use Hjulverkstan. You open a pull request, and GitHub's machines check it. You merge it, and they build it and deploy it to a copy of the system for developers. A release sends it on to the copy the workshops use. If you know these steps, you know where your change is, and where to look when it fails.

This page shows the whole pipeline. Below it are links to the API's path, the web's path, and how to read and write the workflow files.

*Everything in these pages is an agent's reading of `.github/workflows/` on 2026-09-29, not checked against a real run.*

## 1. One change, from pull request to the workshops

Imagine you fix a wrong opening time on the public site. You push your branch and open a pull request. Soon a check appears on it: GitHub's machines have run the API's tests and checked that the web still builds. Green means both passed. Nothing is deployed yet.

The pull request is merged into `main`. That starts the pipeline. It sees that only `web/` changed, so it tests, builds and deploys only the web, to dev. Dev is the copy of the system that always has the newest `main`. A little later your fix is on dev, and anyone can look at it.

Later someone makes a release. They add a git tag, a name on a commit, to a commit on `main`: `v1.4.0-rc.1`. The "rc" means release candidate, a version to try before the real release. The pipeline runs again, now with both the API and the web. This time it deploys to the test environment, where a release is tried. If it works, they add the tag `v1.4.0`, and the pipeline runs once more, to prod. Prod is the copy the workshops use. Nobody copied a file by hand.

![Four rows, one per event. A pull request runs only the test stage and lands nowhere. A push to main, a tag vX.Y.Z-rc.N and a tag vX.Y.Z each run init, test, build and deploy, and land in dev, test and prod](.img/road.svg)\
A pull request only runs the checks. The other events run the same four stages, and the event decides where the change lands. Note that "test" is two things: a stage that checks the change, and an environment where it lands.

*Seen, in `pr.yml` and `pipeline.yml`. The story is an example, not a real run.*

## 2. Three copies of the system

Dev, test and prod are the three environments. Each is a full copy of the system, with its own website, API and database. They differ in what is allowed onto them.

![Three columns headed dev, test and prod, each listing website, API and database. Under dev: updated by each merge to main, where a change is seen first. Under test: updated by a tag vX.Y.Z-rc.N, where a release is tried. Under prod: updated by a tag vX.Y.Z, what the workshops use](.img/environments.svg)\
The same three parts in each environment. Only what updates them, and who uses them, is different.

Because they are separate, a mistake on dev stays on dev. The data is separate too: a bike you add on dev never appears in prod.

*Seen, in `cdk/assets-ec2/docker-compose.yml` and `cdk/README.md`. What each is for is reasoned from the [release process](../../GUIDELINES.md#release-process-).*

## 3. What starts a run

A workflow is a file in `.github/workflows/` that GitHub runs when something happens. Which thing happened decides where the change goes.

- A pull request runs `pr.yml`: the API's tests and the web's build. It deploys nothing.

- A push to `main`, such as a merge, runs `pipeline.yml` and deploys to dev.

- A tag runs `pipeline.yml` too. `vX.Y.Z-rc.N` deploys to test, and `vX.Y.Z` to prod. A tag in another form, or on a commit that is not on `main`, is refused.

- The *Run workflow* button in the Actions tab starts `pipeline.yml` by hand. You choose to deploy the API, the web, both, or what changed.

One more workflow, `publish.yml`, is only started by its button. It rebuilds the web when only the content has changed, as [the web's path](web.md#3-publish-rebuilding-when-only-the-content-changed) explains. How to make a release is in the [release process](../../GUIDELINES.md#release-process-).

*Seen, in `pr.yml`, `pipeline.yml` and `publish.yml`.*

## 4. Inside one run

A run of `pipeline.yml` has four stages. Init decides what to do, test checks it, build makes it, and deploy puts it on the environment. After test, the API and the web go separate ways.

![A flow of jobs. Init leads to test. From test the road forks: build API leads to deploy API, and build web leads on to deploy web. Deploy API also leads into deploy web, so deploy web waits for both. Build web and deploy API are marked, with the note: the web is built while the API deploys](.img/run.svg)\
The jobs of one run. Deploy web waits for deploy API. Build web waits only for test, so it runs while the API deploys.

- Init chooses the environment from the event. It also looks at which folders changed, `api/` or `web/`, and deploys only those. If neither changed, the run stops. A tag always deploys both. Init writes its decisions at the top of the run's page.

- Test runs the checks for what will be deployed: the API's tests, or a build of the web. The web's build needs an API to read content from, so the check starts one just for this.

- Build makes the API into a Docker image, a packaged app, and the web into a folder of finished files.

- Deploy puts them on the environment.

[The API's path](api.md)

[The web's path](web.md)

*Seen, in `pipeline.yml` and `stage-test.yml`.*

## 5. Reading and writing a workflow

You can check everything on these pages in the files themselves. The files are short once you know about a dozen words of GitHub Actions. The first page teaches them using our own files.

[Reading a workflow](reading.md)

The second page is for changing the pipeline: the ideas it is built on, where a change belongs, and how to try it.

[Writing a pipeline](writing.md)

*Seen, in `.github/workflows/`.*

## 6. Looking at a run

Every run can be watched on GitHub. Look at a green run once, and a red one becomes much easier to read. Try it:

1. Open the Actions tab and choose *Deploy* on the left. That is the name `pipeline.yml` gives itself, in its first line.

2. Open the newest run. The summary at the top is from init: the environment, and whether it deployed the API, the web or both.

3. Below it is the graph of jobs from [§4](#4-inside-one-run). A job with nothing to do is shown as skipped.

4. Open a job, then a step. Its log is what the machine printed.

A pull request's checks look the same. Open them from the pull request.

*Reasoned, from how GitHub shows a run. Not tried in this repository.*

## 7. When a run fails

A failed run is red in the Actions tab, and on the pull request if it came from one. Open the run, then the red job, then the red step. The error is in its log.

- A test fails. Read the log, then run the same check locally, as the [setup guide](../../SETUP.md) shows.

- A tag is refused. The tag is in the wrong form, or its commit is not on `main`. Delete it with `git tag -d <tag>` and `git push --delete origin <tag>`, then tag the right commit.

- The API does not start. The deploy restarts the API on its server, as [the API's path](api.md#3-deployed-on-the-server) shows. If it has not started after two minutes, the log shows what was running and its last lines.

- The first deploy to a new environment fails. This is expected: its database is empty, so the web's build finds no content. The [infrastructure readme](../../cdk/README.md) says how to fill it.

*Seen, in the workflow files and `cdk/README.md`. Not checked against a failing run.*

## 8. For whoever maintains the pipeline

Some parts of the pipeline, or of what is written about it, do not match. They matter mostly to whoever maintains the pipeline.

[What is open](open.md)

*Open, recorded 2026-09-28.*
