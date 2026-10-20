---
under: the rule
kind: brief
---

![A shield with a check mark](.img/checking.svg)

# Checking every change

A green check is worth less than it looks: a change to how the data is stored, or a type error in the website, passes it and can still fail on an environment. Knowing where its edge lies tells you what is still yours to try, and where to look when it is red.

*Seen, in `pr.yml` and `stage-test.yml`, read 2026-10-05; not checked against a real run.*

## 1. What the check runs

A pull request runs one check, shown as *Test / test*, whatever it changed, and it deploys nothing. Its workflow, `pr.yml`, only calls `stage-test.yml`, a [stage](basics/reading.md#4-reusable-workflows-the-stage-files) a delivery calls too.

A pull request is run on a trial merge into the branch it targets, made when the pull request is opened, reopened or given new commits. A later change to the target branch does not run it again, and a pull request that cannot be merged without a conflict is not run at all.

The stage has two parts, and a pull request turns on both.

- The API's part runs its tests with `mvn test`, against a real Postgres database the check starts for itself and throws away afterwards. Today there is one test, and it only makes sure the application starts.

- The website's part installs and builds the website with `npm ci` and `npm run build`, the same commands a delivery runs, against an API the check starts for itself, as §2 explains.

*Seen, in `pr.yml`, `stage-test.yml` and `api/src/test/`. How a pull request is run is from [GitHub's documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request), read 2026-10-06, not tried here; that a later change to the target branch does not run it again is reasoned from the events the documentation lists.*

## 2. Why the website's part starts its own API

The website's build fetches the site's text from an API, as [the website's path](delivering/web.md#1-built-with-its-text-inside) explains, since the text is kept in the database and not in the code. A check must not touch a real environment, so it starts an API of its own.

It builds the API from the change and starts it against the check's database. There it lets the API make its tables from the code, which no delivery lets it do, as [what a delivery does not change](delivering/README.md#3-what-a-delivery-does-not-change) says, and fills them with the example data in `api/src/main/resources/data.sql`. It waits up to two minutes for the API to answer, then builds the website against it. So the website is built against the API of the same change, and with example data rather than an environment's.

*Seen, in `stage-test.yml` and `application.properties`.*

## 3. What it does not catch

A green check says nothing about how the website looks or behaves, since nothing tests it beyond its build. The build does not check the website's TypeScript types either, so a type error passes. The website's lint, `npm run lint`, is never run by the pipeline; a pre-commit hook lints and tidies the website's changed code files, for whoever has run the project's setup script.

It does not catch a change to how the data is stored either. The check's API makes its tables to fit the code, as §2 says, but no delivery changes the tables on an environment. So such a change passes here and can fail on dev, test or prod.

And the check's database is Postgres 15, while the environments run Postgres 17, so a difference between the two would not show.

*Seen, in `stage-test.yml`, `application.properties`, `web/package.json`, `web/vite.config.js`, `.hooks/pre-commit`, `setup.sh` and `cdk/assets-ec2/docker-compose.yml`. That a change to the tables then fails is reasoned. Whether to close each gap is open.*

## 4. When the check is red

A red check says why in the log of the step that failed. Open the check from the pull request, then the red step, as [watching a run](basics/README.md#51-watching-a-run) shows. Run the same commands on your own machine, set up as the [setup guide](../../../SETUP.md) says, before you push a fix.

The two parts run one after the other in one job. So if the API's tests fail, the website's part never runs, and a red check says nothing yet about the website.

One failure shows less than it should. If the API started for the website's part does not answer in time, the step prints a file, `backend.log`, that nothing writes, so the API's own output shows only in part, in the log of the step that started it. Start the API locally to see why it fails.

*Seen, in `stage-test.yml`; the lost output is open. Not checked against a failing run.*
