---
under: the rule
kind: brief
---

# The pipeline

Every change to Hjulverkstan reaches its users the same way. When you open a pull request, a machine checks it. When it is merged to `main`, the machine builds it and puts it on the dev environment. When someone tags a release, marking a commit with a version number, the same happens for the test or prod environment. Nobody deploys by hand, so what runs is what was checked.

This is the whole road for a developer new to the project. Beneath it are the two things that travel it, the API and the web, and how to read the workflow files yourself.

*Seen, in `.github/workflows/` as it stands on 2026-09-28; an agent's reading.*

## 1. The road a change travels

A pipeline is a program that runs on its own when something happens in the repository. Ours lives in `.github/workflows/` and runs on GitHub Actions, GitHub's machines. What starts a run decides where the change ends up.

There are three environments, each a full copy of the system with its own server, database and website. Dev always holds the newest `main`. Test holds a release candidate, a version tried before it is trusted. Prod is the one the workshops use.

![Four rows, one per event. A pull request runs only the test stage and lands nowhere. A push to main, a tag vX.Y.Z-rc.N and a tag vX.Y.Z each run init, test, build and deploy, and land in dev, test and prod respectively](.img/road.svg)\
A pull request runs only the checks. Every other event runs the same four stages, and the event decides which environment the change lands in.

A few things the picture leaves out:

- The pull request's checks are a workflow of their own, `pr.yml`: the API's tests and a build of the web. The result shows on the pull request; nothing is deployed.

- Merging a pull request is a push to `main`. Pushes and tags run `pipeline.yml`, and a tag is only accepted on a commit that is on `main`.

- `pipeline.yml` can also be started by hand from the Actions tab, choosing to deploy the API, the web or both to dev.

How to cut a release, the branch, the changelog and the tag, is in the [release process in the guidelines](../../GUIDELINES.md#release-process-); this page only says what the pipeline does with it.

*Seen, in `pr.yml` and `pipeline.yml`; what each environment is for is reasoned from its name and the guidelines, an agent's reading.*

## 2. What one run does

A run of `pipeline.yml` has four stages, and each one waits for the one before it. Each stage is written in a file of its own, `stage-test.yml` and so on, which `pipeline.yml` calls.

- **Init** decides what this run is. It reads the event to pick the environment, and looks at which folders changed, `api/` or `web/`, to decide what to deploy. On a push only what changed is deployed, and if neither changed, the run stops here. A tag always deploys both, and init first checks that the tag is a proper version on a commit on `main`.

- **Test** runs the checks for what is about to be deployed: the API's tests, the web's build, or both.

- **Build** makes the thing that will run. The API becomes a Docker image, a sealed package of the application; the web becomes a folder of finished files.

- **Deploy** puts it in place, the API on the environment's server and the web on its file storage.

At build the road splits in two, because the API and the web are built and deployed in different ways. Each has its own page.

[The API's path](api.md)

[The web's path](web.md)

*Seen, in `pipeline.yml`; an agent's reading.*

## 3. Reading a workflow file

Everything above can be checked in the files themselves, and a developer who can read them can find out the rest. They are short once you know about a dozen words of GitHub Actions, and the page beneath teaches them on our own files.

[Reading a workflow](reading.md)

*Seen, in `.github/workflows/`; an agent's reading.*

## 4. When a run fails

A failed run is shown in red in the repository's Actions tab, and in the pull request if it came from one. Open the run, then the failed job, then the failed step: its log is where the error is. The init stage also writes a short summary at the top of every deploy run, saying which environment it aimed at and what it decided to deploy.

- **A test fails.** The API's test output or the web's build error is in the step's log. Run the same thing locally, as the [setup guide](../../SETUP.md) shows, before pushing a fix.

- **A tag is refused.** Init stops a tag that is not written `vX.Y.Z` or `vX.Y.Z-rc.N`, or whose commit is not on `main`. Delete the tag and tag the right commit.

- **The API does not come up.** The deploy step prints the containers' state and their last log lines when docker compose fails, so the reason is usually in that step's log.

- **A brand new environment fails its first deploy.** This is expected: its database is empty. The [infrastructure readme](../../cdk/README.md) says how to initialise it and run again.

*Seen, in the workflow files and `cdk/README.md`; not checked against a failing run, an agent's reading.*

## 5. What is open

Reading the files for this page turned up places where the pipeline, or what is written about it, does not match. None of them is fixed here; they are recorded so they can be.

- The guidelines name the release workflow `.github/workflows/release.yml`. There is no such file; it is `pipeline.yml`.

- The guidelines call the environment image tags `dev-latest`, `test-latest` and `latest`. The tags actually come from the variable `DOCKER_API_IMAGE_TAG`, which `cdk/README.md` gives as `dev-release`, `test-release` and `release`.

- Init watches `.github/actions/**` for changes, and that folder does not exist.

- When the backend does not come up in time in the test stage, the step prints `backend.log`, which nothing writes, so the failure shows no backend output.

- The deploy calls docker compose's wait "health-gated", but the compose file on the server gives the API no health check, so the wait ends when the container has started, not when the API answers.

- The web may be built from the API as it was before the same run deployed a new one, as [the web's path](web.md#1-built-into-static-files-with-the-content-inside) explains.

- The pipeline does not deploy the infrastructure itself. The server, buckets and CDN are made with CDK by hand, as the roadmap in the [project readme](../../README.md#roadmap-) says is still to do.

*Open, each seen in the files on 2026-09-28; the last-but-one reasoned from the order of the jobs, not seen in a run.*
