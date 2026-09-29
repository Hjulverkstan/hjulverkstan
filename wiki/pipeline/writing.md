---
under: the rule
kind: brief
---

# Writing a pipeline

Writing a pipeline is less about YAML than about two choices: what should fail first, and where each value comes from. Our pipeline is built on a few ideas that answer these. If you know them, you know where a change belongs and how to make it safely.

This page gives the ideas first, then how to change our pipeline, with an example. It uses the words from [reading a workflow](reading.md).

*An agent's reading of our files. The ideas are common practice, but our pipeline's authors have not written them down, and no outside source was checked.*

## 1. The ideas ours is built on

Every job in a pipeline can fail. Each idea below makes failure cheaper, earlier, or easier to understand.

*Reasoned, from the files.*

### 1.1 Fail early, where it is cheap

A mistake costs less the sooner it is found. In a pull request it costs one more push. On dev it costs a fix and a wait. In prod it can cost the workshops a working day. So checks run as early as possible, the cheapest first.

Ours does this in three places. The pull request runs the checks before anything is merged. In a run, test comes before build. And when init finds that nothing changed, the rest of the run is skipped.

*Seen, in `pr.yml` and `pipeline.yml`.*

### 1.2 Build once, then promote

Prod should get exactly what was tried on test. The safest way is to build once, then move that same result forward by renaming it. This is called promoting.

The API almost does this. Its image is promoted by renaming, as [the API's path](api.md#2-promoted-by-renaming) shows. But every release tag builds the image again from its commit. So prod runs an image built from the same code as test's, not the very same image.

The web cannot do this at all, because its build writes each environment's addresses and content into the files. [The web's path](web.md) explains why.

*Seen, in `pipeline.yml` and the stage files.*

### 1.3 One file, many environments

Dev, test and prod use the same workflow files. What differs is stored in each environment's variables and secrets on GitHub, never in the files. So a fix to the pipeline reaches all three environments at once.

A value that differs between environments belongs there, read as [reading a workflow](reading.md#5-environments-variables-and-secrets) shows.

*Seen, in the stage files.*

### 1.4 Write each stage once

A stage used in two places is written once, as a reusable workflow, and both places call it. Then the checks in a pull request and in a deploy can never become different, because they are the same file.

![A matrix. Down the side, the five stage files: stage-test, stage-build-api, stage-deploy-api, stage-build-web and stage-deploy-web. Across the top, the three workflows that call them. pr.yml calls stage-test only. pipeline.yml calls all five. publish.yml calls stage-build-web and stage-deploy-web. A note says init, and publish's own first job, are written inside their workflows](.img/callers.svg)\
Which workflow calls which stage. Look here before changing a stage: every mark in its row is a workflow your change will reach.

*Seen, in `pr.yml`, `pipeline.yml` and `publish.yml`.*

### 1.5 Say what was decided, and why it failed

Nobody watches a pipeline while it runs, so it must write down what it decided and why it stopped. Init writes a summary at the top of every run. Its check of a release tag prints what it expected and what it got. The API's deploy prints the containers' state and logs before it fails.

When you add a step that can fail, do the same. Print what was wrong, in words a developer understands, before the step exits.

*Seen, in `pipeline.yml` and `stage-deploy-api.yml`.*

## 2. Changing our pipeline

A pipeline change is normal code: make it on a branch, and merge it with a pull request. Two things are different: finding the right file, and testing the change safely.

*Reasoned, from the files and from GitHub's documented behaviour.*

### 2.1 Find where the change belongs

Each kind of change has one right place, following the stages of [a run](README.md#4-inside-one-run):

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

Each line uses a word from [reading a workflow](reading.md): a step with a `name`, an `if` that reads the stage's input, and a `run`. The picture in [§1.4](#14-write-each-stage-once) shows that this change reaches both `pr.yml` and `pipeline.yml`.

In this file, the web's steps come after the API's steps, so the lint still waits for them. Moving the web's steps first would make it faster. That is a second change, kept separate so the first stays small. The lint fails only on errors. Warnings are printed, but the job still passes.

Nobody knows yet if the web passes its lint. If it does not, the pull request that adds the step will show the errors. Fix them in the same pull request.

*Seen, in `web/package.json` and `stage-test.yml`. That warnings pass is reasoned from the script. The lint was not run.*

### 2.3 Adding a value or a secret

Add a new value on GitHub, in each environment's settings. Make it a variable if anyone may see it, and a secret if not. A stage reads it by its name.

Most stage files list the secrets they use under `secrets:` at the top. But a secret missing from the list still arrives. This is because callers pass all secrets with `secrets: inherit`. `stage-deploy-api.yml` uses `API_AWS_BACKUP_PASSPHRASE` this way. But the list tells a reader what the stage needs, so add new secrets to it.

Never write a secret in a workflow file, or print it in a step. GitHub hides known secrets in logs, but not a changed version of one, such as half of it.

If the value is a setting the API reads, more places are needed. [The API's path](api.md#4-adding-a-setting-the-api-needs) lists them.

*Seen, in the stage files. How GitHub hides secrets is from its documentation, not checked here.*

### 2.4 Trying a change safely

A pipeline is hard to test, because it runs on GitHub's machines and deploys to real environments. How you can test a change depends on the file.

A change to `pr.yml` or `stage-test.yml` tests itself. A pull request runs the workflows from its own branch, so your pull request runs your change.

A change to `pipeline.yml`, or to a build or deploy stage, first runs when it is merged, and deploys to dev. That is what dev is for: a broken deploy there costs little. Watch the run after merging. If it breaks, fix it with a new commit.

You can also test before merging with the *Run workflow* button, choosing your branch. It deploys your branch to dev. Dev then keeps your unmerged code until a later run replaces it. A later merge only redeploys what it changed. So if the next merge only changes `web/`, your branch's API stays on dev. Tell the team before you do this.

Two outside tools can help, though these pages have not covered them: [actionlint](https://github.com/rhysd/actionlint) finds mistakes in a workflow file without running it, and [act](https://github.com/nektos/act) runs a workflow on your own machine.

*Reasoned, from GitHub's documented behaviour and from how init handles a run from a branch. Not tried in this repository.*

## 3. Before you merge

Check these before merging a pipeline change:

1. The change is in the right file, by [§2.1](#21-find-where-the-change-belongs).

2. The change is right for every workflow that calls the changed stage, by [the picture](#14-write-each-stage-once).

3. New values are set in all three environments, and new secrets are listed in their stage.

4. A step that can fail says why in its log.

5. Someone will watch the first run on dev after the merge.

*Reasoned, from the ideas above.*
