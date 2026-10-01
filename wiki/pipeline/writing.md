---
under: the rule
kind: brief
---

# Changing our pipeline

Every change on its way to the workshops passes through our pipeline, so a mistake in the pipeline itself can stop every delivery, or let a broken one through. A change to it is normal code, made on a branch and merged with a pull request, but it takes more care. What keeps it safe is knowing where in ours each kind of change belongs, where ours falls short of a good pipeline's ideas, and how to try a change before it reaches anyone.

It uses the words from [reading a workflow](basics/reading.md), and the ideas from [what a good pipeline is built on](basics/ideas.md).

*An agent's reading of our files. Our pipeline's authors have not written its ideas down.*

## 1. The ideas, in ours

Ours follows each of the five ideas, though not all of them fully, and where it falls short is where a change needs the most care.

*Seen, in the files.*

### 1.1 Fail early, where it is cheap

Ours [fails early](basics/ideas.md#1-fail-early-where-it-is-cheap) in three places. The pull request runs the checks before anything is merged. In a run, test comes before build. And when [init](deliver.md#31-init-decides-what-to-deploy) finds that nothing changed, the rest of the run is skipped.

*Seen, in `pr.yml` and `pipeline.yml`.*

### 1.2 Build once, then promote

The API almost [builds once and promotes](basics/ideas.md#2-build-once-then-promote). Its image is promoted by renaming, as [the API's path](api.md#2-promoted-by-renaming) shows. But every release tag builds the image again from its commit. So prod runs an image built from the same code as test's, not the very same image.

The web cannot do this at all, because its build writes each environment's addresses and content into the files. [The web's path](web.md) explains why.

*Seen, in `pipeline.yml` and the stage files.*

### 1.3 One file, many environments

Ours keeps [one file for many environments](basics/ideas.md#3-one-file-many-environments) fully: dev, test and prod use the same workflow files. A value that differs between them belongs in their settings on GitHub, read as [reading a workflow](basics/reading.md#5-environments-variables-and-secrets) shows.

*Seen, in the stage files.*

### 1.4 Write each stage once

Ours [writes each stage once](basics/ideas.md#4-write-each-stage-once), in its `stage-*.yml` files. `stage-test.yml`, for one, is called by both `pr.yml` and `pipeline.yml`.

![A matrix. Down the side, the five stage files: stage-test, stage-build-api, stage-deploy-api, stage-build-web and stage-deploy-web. Across the top, the three workflows that call them. pr.yml calls stage-test only. pipeline.yml calls all five. publish.yml calls stage-build-web and stage-deploy-web. A note says init, and publish's own first job, are written inside their workflows](.img/callers.svg)\
Which workflow calls which stage. Look here before changing a stage: every mark in its row is a workflow your change will reach.

Our build and deploy stages take an input called `run`. It is our own name, not the `run` of a step. When it is false, the stage skips its job. So when init sees that only `api/` changed, the web's stages run but do nothing.

*Seen, in `pr.yml`, `pipeline.yml`, `publish.yml` and the stage files.*

### 1.5 Say what was decided, and why it failed

Ours [says what it decided, and why it failed](basics/ideas.md#5-say-what-was-decided-and-why-it-failed), in three places. Init writes a summary at the top of every run. Its check of a release tag prints what it expected and what it got. The API's deploy prints the containers' state and logs before it fails.

When you add a step that can fail, do the same.

*Seen, in `pipeline.yml` and `stage-deploy-api.yml`.*

## 2. Making a change

A pipeline change is normal code, made on a branch and merged with a pull request. It pays to know where the change belongs, what it needs, and how to try it safely.

*Reasoned, from the files and from GitHub's documented behaviour.*

### 2.1 Find where the change belongs

Each kind of change has one right place, following the stages of [a run](deliver.md#3-inside-one-run): decisions in init, checks in the test stage, and building and deploying in their own stages.

- A decision about what a run does, such as a new folder to watch, belongs in init, inside `pipeline.yml`.

- A new check belongs in `stage-test.yml`. It then runs for every pull request, and in each `pipeline.yml` run that deploys the part it checks. `publish.yml` does not run it.

- How something is built belongs in `stage-build-api.yml` or `stage-build-web.yml`.

- How something is deployed belongs in its deploy stage.

- A new event or button needs a new workflow file that calls the stages it needs.

*Seen, in the files as they are today.*

### 2.2 Example: adding the web's lint

The web has a lint, `npm run lint`, that looks for mistakes in the code without running it. No workflow runs it today. Adding it is a good first change, and it changes only one file.

A lint is a check, so it goes in `stage-test.yml`. It is cheaper than the web's build, so it goes before the build, right after the step that installs the web's packages:

```yaml
      - name: Test Web - Install deps
        if: ${{ inputs.run_web_build }}
        run: cd web && npm ci

      - name: Test Web - Lint             # the new step
        if: ${{ inputs.run_web_build }}   # only when the web is checked
        run: cd web && npm run lint       # fails the job on a lint error
```

Each line uses a word from [reading a workflow](basics/reading.md): a step with a `name`, an `if` that reads the stage's input, and a `run`. The picture in [§1.4](#14-write-each-stage-once) shows that this change reaches both `pr.yml` and `pipeline.yml`.

*Seen, in `web/package.json` and `stage-test.yml`.*

#### 2.2.1 Before you add it

Three things are worth knowing first, so the change does not surprise you.

The lint fails the job only on errors. Warnings are printed, but the job still passes.

Nobody knows yet if the web passes its lint. If it does not, the pull request that adds the step will show the errors. Fix them in the same pull request.

The lint is not yet cheapest first. In this file the web's steps come after the API's, so the lint still waits for them. Moving the web's steps first would make it faster. That is a second change, kept separate so the first stays small.

*Seen, in `stage-test.yml`. That warnings pass is reasoned from the script. The lint was not run.*

### 2.3 Adding a value or a secret

Values that differ between environments, or must stay secret, are kept on GitHub and never in the files. Add a new value in each environment's settings: as a variable if anyone may see it, and as a secret if not. A stage reads it by its name. The [infrastructure readme](../../cdk/README.md#github-actions) lists the names each environment needs.

Never write a secret in a workflow file, or print it in a step, since [GitHub hides only the secret itself](basics/reading.md#5-environments-variables-and-secrets).

If the value is a setting the API reads, more places are needed. [The API's path](api.md#4-adding-a-setting-the-api-needs) lists them.

*Seen, in the stage files and `cdk/README.md`.*

#### 2.3.1 The list of secrets

Most stage files list the secrets they use under `secrets:` at the top, so a reader can see what a stage needs. Add new secrets to it.

A secret missing from the list still arrives, because callers pass all secrets with `secrets: inherit`. `stage-deploy-api.yml` uses `API_AWS_BACKUP_PASSPHRASE` this way, so its list is not complete.

*Seen, in the stage files.*

### 2.4 Trying a change safely

A pipeline is hard to test, because it runs on GitHub's machines and deploys to real environments. A change to the checks tests itself, and a change to building or deploying is first tried on dev, which is what dev is for.

A change to `pr.yml` or `stage-test.yml` tests itself, because [a pull request runs the workflows from its own branch](basics/reading.md#1-a-workflow-and-what-starts-it).

A change to `pipeline.yml`, or to a build or deploy stage, first runs when it is merged, and deploys to dev, where a broken deploy costs little. Watch the run after merging. If it breaks, fix it with a new commit.

[Two outside tools](basics/ideas.md#1-fail-early-where-it-is-cheap) find some mistakes even before a pull request.

*Reasoned, from GitHub's documented behaviour. Not tried in this repository.*

#### 2.4.1 Running from a branch

You can try a change before merging with the *Run workflow* button, choosing your branch, but it leaves your code on dev.

It deploys your branch to dev, and dev keeps your unmerged code until a later run replaces it. A later merge only [redeploys what it changed](deliver.md#31-init-decides-what-to-deploy). So if the next merge only changes `web/`, your branch's API stays on dev. Tell the team before you do this.

*Reasoned, from how init handles a run from a branch. Not tried.*


## 3. Before you merge

Five questions catch most pipeline mistakes before they reach dev:

1. The change is in the right file, by [§2.1](#21-find-where-the-change-belongs).

2. The change is right for every workflow that calls the changed stage, by [the picture](#14-write-each-stage-once).

3. New values are set in all three environments, and new secrets are [listed in their stage](#231-the-list-of-secrets).

4. A step that can fail [says why](#15-say-what-was-decided-and-why-it-failed) in its log.

5. Someone will [watch the first run on dev](#24-trying-a-change-safely) after the merge.

*Reasoned, from the ideas above.*
