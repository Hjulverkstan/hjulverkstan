---
under: the rule
kind: brief
---

# Changing our pipeline

Every change on its way to the workshops passes through our pipeline, so a mistake in the pipeline itself can stop every delivery, or let a broken one through. A change to it is ordinary code, made on a branch and merged with a pull request, but it takes more care.

What keeps it safe is knowing where in ours each kind of change belongs, where ours falls short of a good pipeline's ideas, and how to try a change before it reaches anyone.

This page is for the developer about to make such a change, and is read step by step when that moment comes. It uses the words from [reading a workflow](basics/reading.md), the ideas from [what a good pipeline is built on](basics/ideas.md), and the steps from [what a run does](delivering/README.md#1-what-a-run-does).

*An agent's reading of our files, read again 2026-10-06. Our pipeline's authors have not written its ideas down.*

## 1. The ideas our pipeline follows

A good pipeline is built on a few shared ideas, given in [what a good pipeline is built on](basics/ideas.md). Ours follows each of them, though not all of them fully, and where it falls short is where a change needs the most care.

*Seen, in the workflow files, read 2026-10-06.*

### 1.1 Fail early, where it is cheap

Ours [fails early](basics/ideas.md#1-fail-early-where-it-is-cheap) in three places. A pull request is checked before anything is merged. In a delivery, the check comes before the build. And when the decide step finds that a merge [changed neither part](delivering/README.md#12-what-it-delivers), the rest of the run is skipped.

*Seen, in `pr.yml` and `pipeline.yml`, read 2026-10-06.*

### 1.2 Build once, then promote

The API almost [builds once and promotes](basics/ideas.md#2-build-once-then-promote). Its image is promoted by its tags, as [the API's path](delivering/api.md#2-tagged-for-its-environment) shows. But [every delivery builds its own image](delivering/api.md#11-every-delivery-builds-its-own-image), so prod runs an image built from the same code as test's, not the very same image.

The website cannot do this at all, because its build writes each environment's text and addresses into the files, as [the website's path](delivering/web.md#1-built-with-its-text-inside) explains.

*Seen, in `pipeline.yml` and the stage files, read 2026-10-06.*

### 1.3 One file, many environments

Ours keeps [one file for many environments](basics/ideas.md#3-one-file-many-environments) fully: dev, test and prod use the same workflow files. A value that differs between them belongs in their settings on GitHub, read as [reading a workflow](basics/reading.md#5-environments-variables-and-secrets) shows.

*Seen, in the stage files, read 2026-10-06.*

### 1.4 Write each stage once

Ours [writes each stage once](basics/ideas.md#4-write-each-stage-once), in its `stage-*.yml` files. `stage-test.yml`, for one, is called by both `pr.yml` and `pipeline.yml`.

![A matrix. Down the side, the five stage files: stage-test, stage-build-api, stage-deploy-api, stage-build-web and stage-deploy-web. Across the top, the three workflows that call them. pr.yml calls stage-test only. pipeline.yml calls all five. publish.yml calls stage-build-web and stage-deploy-web. A note says init, and publish's own first job, are written inside their workflows](.img/callers.svg)\
Which workflow calls which stage. Look here before changing a stage: every mark in its row is a workflow your change will reach.

Our build and deploy stages take an input called `run`. It is our own name, not the `run` of a step. When it is false, the stage's job is skipped. So when the decide step sees that only `api/` changed, the website's stages are called, and show as skipped.

*Seen, in `pr.yml`, `pipeline.yml`, `publish.yml` and the stage files, read 2026-10-06.*

### 1.5 Say what was decided, and why it failed

Ours [says what it decided, and why it failed](basics/ideas.md#5-say-what-was-decided-and-why-it-failed), in most places. The decide step writes a summary at the top of every delivery. Its check of a release's tag prints what was wrong. The API's deploy prints the containers' state and logs before it fails.

When you add a step that can fail, do the same.

*Seen, in `pipeline.yml` and `stage-deploy-api.yml`, read 2026-10-06.*

## 2. Making a change

A pipeline change is ordinary code, made on a branch and merged with a pull request. It pays to know where the change belongs, what it needs, and how to try it safely.

*Reasoned, from the files and from GitHub's documented behaviour.*

### 2.1 Find where the change belongs

Each kind of change has one right place, following [the steps of a delivery](delivering/README.md#1-what-a-run-does): decisions in the decide step, checks in the check stage, and building and deploying in their own stages.

- A decision about what a run does, such as a new folder to watch, belongs in the decide step, the job `init` inside `pipeline.yml`.

- A new check belongs in `stage-test.yml`. It then runs for every pull request, and in each delivery of the part it checks. A republish does not run it.

- How something is built belongs in `stage-build-api.yml` or `stage-build-web.yml`.

- How something is deployed belongs in its deploy stage.

- A new event goes in the `on` of the workflow it should start, and a new choice on a button is a new input to its `workflow_dispatch`. Work that fits no workflow we have needs a new workflow file that calls the stages it needs.

*Seen, in the files, read 2026-10-06.*

### 2.2 Example: adding the website's lint

The website has a lint, `npm run lint`, that looks for mistakes in the code without running it. [No workflow runs it today](checking.md#3-what-it-does-not-catch). Adding it is a good first change, and it changes only one file.

A lint is a check, so it goes in `stage-test.yml`. It is cheaper than the website's build, so it goes before the build, right after the step that installs the website's packages:

```yaml
      - name: Test Web - Install deps
        if: ${{ inputs.run_web_build }}
        run: cd web && npm ci

      - name: Test Web - Lint             # the new step
        if: ${{ inputs.run_web_build }}   # only when the website is checked
        run: cd web && npm run lint       # fails the job on a lint error
```

Each line uses a word from [reading a workflow](basics/reading.md): a step with a `name`, an `if` that reads the stage's input, and a `run`. The picture in [§1.4](#14-write-each-stage-once) shows that this change reaches both `pr.yml` and `pipeline.yml`.

*Seen, in `web/package.json` and `stage-test.yml`, read 2026-10-06.*

#### 2.2.1 Before you add it

Three things are worth knowing first, so the change does not surprise you.

The lint fails the job only on errors. Warnings are printed, but the job still passes.

Nobody knows yet if the website passes its lint. If it does not, the pull request that adds the step will show the errors. Fix them in the same pull request.

The lint is not yet cheapest first. In this file the website's steps come after the API's tests, and after starting the API the website's part needs, so the lint still waits for them. Moving it first would make it faster. That is a second change, kept separate so the first stays small.

*Seen, in `stage-test.yml`, read 2026-10-06. That warnings pass is reasoned from the script. The lint was not run.*

### 2.3 Adding a value or a secret

Values that differ between environments, or must stay secret, are kept on GitHub as each environment's [variables and secrets](basics/reading.md#5-environments-variables-and-secrets), never in the files, as [what a delivery does not change](delivering/README.md#3-what-a-delivery-does-not-change) says. Add a new one in every environment's settings, and a stage reads it by its name. The [infrastructure readme](../../../cdk/README.md#github-actions) names some of what each environment holds, and points to `.env.template` for the rest.

If the value is a setting the API reads, it needs more places, listed in [adding a setting the API needs](delivering/api.md#5-adding-a-setting-the-api-needs).

Never write a secret in a workflow file, or print it in a step, since [GitHub hides only the secret itself](basics/reading.md#5-environments-variables-and-secrets), not a changed form of it.

*Seen, in the stage files and `cdk/README.md`, read 2026-10-06. How GitHub hides secrets is from its documentation, not checked here.*

#### 2.3.1 The list of secrets

Four of the five stage files list the secrets they use under `secrets:` at the top, so a reader can see what a stage needs; `stage-test.yml` uses none. Add a new secret to its stage's list.

A secret missing from the list still arrives: callers pass the secrets kept outside an environment with `secrets: inherit`, and a stage whose job names an environment gets that environment's secrets. `stage-deploy-api.yml` uses `API_AWS_BACKUP_PASSPHRASE` this way, so its list is not complete.

*Seen, in the stage files, read 2026-10-06; the missing secret is open.*

### 2.4 Trying a change safely

A pipeline is hard to test, because it runs on GitHub's machines and deploys to real environments. A change to the check tests itself, and a change to building or deploying is first tried on dev, which is what dev is for.

A change to `pr.yml` or `stage-test.yml` tests itself, because [a pull request is run on a trial merge, and its workflow files are read from that merge](basics/reading.md#1-a-workflow-and-what-starts-it).

A change to `pipeline.yml`, or to a build or deploy stage, is not run until it is merged, and even then a merge delivers only if it changes `api/` or `web/`, so a merge of workflow files alone delivers nothing. After merging, start the run yourself with *Run workflow* on *Deploy* from `main`, mode `both`. It delivers to dev, where a broken delivery costs little. If it breaks, fix it with a new commit. It reaches test and prod only with the next release, since [each run uses its own commit's pipeline](delivering/README.md#16-each-run-uses-its-own-commits-pipeline); a republish is the exception that section names.

You can also try it before merging, by [delivering your branch by hand](delivering/README.md#4-delivering-by-hand). That leaves your branch's code on dev, so tell the team first.

[Two outside tools](basics/ideas.md#1-fail-early-where-it-is-cheap) find some mistakes even before a pull request.

*Reasoned, from GitHub's documented behaviour. Not tried in this repository.*

## 3. Before you merge

Five questions catch most pipeline mistakes before they reach dev:

1. The change is in the right file, by [§2.1](#21-find-where-the-change-belongs).

2. The change is right for every workflow that calls the changed stage, by [the picture](#14-write-each-stage-once).

3. New values are set in all three environments, and new secrets are [listed in their stage](#231-the-list-of-secrets).

4. A step that can fail [says why](#15-say-what-was-decided-and-why-it-failed) in its log.

5. Someone will [watch the first run on dev](#24-trying-a-change-safely) after the merge.

*Reasoned, from the ideas above.*
