---
under: the rule
kind: brief
---

# What is open

These are places where the pipeline, or what is written about it, does not match. None is fixed yet. They are listed so they can be fixed.

*Open. Each seen in the files on 2026-09-28 and read again 2026-09-29, unless marked otherwise.*

## 1. The guidelines are out of date

The [release process](../../GUIDELINES.md#release-process-) in the guidelines describes the pipeline in two ways that are no longer true.

- It names the workflow `.github/workflows/release.yml`. There is no such file. It is `pipeline.yml`.

- It names the image tags `dev-latest`, `test-latest` and `latest`. The real names come from the variable `DOCKER_API_IMAGE_TAG`, which `cdk/README.md` gives as `dev-release`, `test-release` and `release`. [The API's path](api.md#2-promoted-by-renaming) explains image tags.

*Open.*

## 2. Small faults in the workflow files

Each of these is a line in a workflow that does less than it seems to.

- Init watches the folder `.github/actions/` for changes. There is no such folder.

- If the API started for the web's check does not answer in time, the step prints `backend.log`. Nothing writes that file, so the error shows none of the API's output.

- The API's deploy step is named "health-gated", meaning it waits until the API is healthy. But the server gives the API no health check, a command that asks whether it answers. So the step only waits until the API has started, not until it answers. [The API's path](api.md#3-deployed-on-the-server) shows the server.

*Open.*

## 3. The web may read an old API

The web is built while the API deploys. So when a run deploys both, the site is built from the API as it was before the run. [The web's path](web.md#1-built-into-finished-pages) explains this.

*Open. Reasoned from the order of the jobs, not seen in a run.*

## 4. The infrastructure is made by hand

The pipeline deploys the application, not what it runs on. The servers, the file storage and the caches are made by hand with CDK, AWS's tool for describing them in code, as the [infrastructure readme](../../cdk/README.md) shows. The [project readme's roadmap](../../README.md#roadmap-) still lists pipelines for CDK as a task.

*Open.*

## 5. The web's lint is not run

The web has a lint, `npm run lint`, but no workflow runs it. [Writing a pipeline](writing.md#22-example-adding-the-webs-lint) shows how to add it.

*Open, found 2026-09-29.*
