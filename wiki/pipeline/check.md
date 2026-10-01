---
under: the rule
kind: brief
---

# Checking every change

A mistake is cheapest to fix before anyone has accepted it, so every [pull request](basics/README.md#3-how-a-change-travels) is checked automatically as soon as it is opened, and nothing is deployed. The checks answer the two questions a reviewer cannot answer by reading the code: does the API still work, and can the web still be built?

The result shows on the pull request as green or red. This is the CI half of the pipeline, continuous integration, as [pipelines in general](basics/README.md#21-ci-continuous-integration) explains.

The workflow is `pr.yml`. It runs one stage file, `stage-test.yml`, with both checks turned on. The same stage file runs again before every delivery, so nothing reaches dev, test or prod without passing it, as [inside one run](deliver.md#3-inside-one-run) shows.

*An agent's reading of the workflow files, not checked against a real run.*

## 1. What the checks run

There is one check for each of those two questions.

- The API's tests run with `mvn test`, against a real Postgres database that the job starts beside itself and throws away afterwards.

- The web is installed with `npm ci` and built with `npm run build`, the same build a deploy makes.

A pull request always runs both, whatever it changed.

*Seen, in `pr.yml` and `stage-test.yml`.*

## 2. Why the web's check starts its own API

The web's build reads the site's text and images from an API, because they are stored in the API's database. A check must not touch a real environment, so it starts an API of its own.

It builds the API from the pull request's own code, starts it against the check's database, and lets it create its tables and fill them with example data from `api/src/main/resources/data.sql`. That example data is what the web is built from. It waits up to two minutes for the API to answer, then builds the web against it. So the web is checked against the API in the same pull request, not against an old one.

*Seen, in `stage-test.yml` and `data.sql`.*

## 3. Reading a red check

A red check always says why, in the log of the step that failed. Open the check from the pull request, then the red step.

Run the same thing on your own machine, as the [setup guide](../../SETUP.md) shows, before pushing a fix. If the web's check says the API it started did not become healthy, its log will not show why, because of a known fault listed in [what is open](open.md#3-small-faults-in-the-workflow-files).

*Seen, in `stage-test.yml`. Not checked against a failing run.*
