---
under: the rule
kind: brief
---

# Reading a workflow

Every claim about a pipeline can be checked in its workflow files, so you never have to take a page like this one on its word. A workflow file says when it runs, which jobs it runs, in what order, and on what conditions. It is written in YAML, a simple format of names, colons and indentation, and about a dozen words are enough to read all of Hjulverkstan's. This page teaches them one at a time, on our own files, since those are the ones you will open.

The words are GitHub Actions' own, and only the ones our files use are here. The rest is in [GitHub Actions' documentation](https://docs.github.com/en/actions), which these pages have not covered.

*An agent's reading of our files, not checked against GitHub's documentation.*

## 1. A workflow, and what starts it

A workflow is one YAML file in `.github/workflows/`. Its `name` is what the Actions tab shows. `on` lists the events that start it. This is the top of `pipeline.yml`:

```yaml
on:
  push:
    branches: [main]
    tags:
      - "v*-rc.*"
      - "v*"
  workflow_dispatch:
    inputs:
      mode: ...
```

A push to `main`, or a tag that starts with `v`, starts it. `workflow_dispatch` adds a *Run workflow* button to the Actions tab. `inputs` are the choices the button gives, here which parts to deploy. `pr.yml` is started by `pull_request`, and `publish.yml` only by its button. A pull request runs the workflows from its own branch, so a change to a workflow that a pull request starts is tried in that same pull request.

*Seen, in the three files.*

## 2. Jobs and steps

A workflow has jobs, and a job has steps. Each job gets its own new machine, set by `runs-on`. All of ours use `ubuntu-latest`, a machine running Linux. The steps run on that machine one after another.

A step does one of two things:

- `run` runs shell commands, the ones you would type in a terminal, such as `cd web && npm ci`.

- `uses` runs an action, a ready-made step that someone has published. `with` gives it its settings. `actions/checkout` downloads the repository to the machine. Almost every job starts with it, because a new machine is empty.

A job can also start `services` beside it: containers it can talk to. A [container](README.md#4-from-code-to-a-running-program) is a running copy of a Docker image. `stage-test.yml` starts a Postgres database this way, so the API's tests have a real database.

*Seen, in every file.*

## 3. Order, conditions, and passing values

Jobs run at the same time unless told otherwise. `needs` makes a job wait for other jobs to succeed. This is how `pipeline.yml` makes its stages: `test` needs `init`, `build-api` needs `test`, and so on.

`if` skips a job or a step unless its condition is true. The condition is written inside `${{ }}`, and GitHub fills it in before the step runs.

Each job has its own machine, so jobs pass values to each other as outputs. `init` writes its decisions to the file `$GITHUB_OUTPUT` and lists them under `outputs`. Later jobs read them like this:

```yaml
if: ${{ needs.init.outputs.deploy_api == 'true' }}
```

Files are passed differently, as an artifact: one job uploads it, another downloads it. This is how the web's built files reach its deploy.

*Seen, in `pipeline.yml`, `stage-build-web.yml` and `stage-deploy-web.yml`.*

## 4. Reusable workflows: the stage files

A workflow with `workflow_call` is not started by an event. Another workflow calls it, as one of its jobs. Every `stage-*.yml` file works this way, so each stage is written once and used in several places. For example, `stage-test.yml` is used by both `pr.yml` and `pipeline.yml`.

The caller names the file with `uses`, and gives its inputs with `with`. The stage file lists the inputs and secrets it takes. `secrets: inherit` in the caller passes all of its secrets.

*Seen, in `pipeline.yml` and the stage files.*

## 5. Environments, variables and secrets

One workflow deploys to three environments by reading different values for each. A job that names an `environment` reads that environment's settings. They are stored on GitHub, in the repository's settings under *Environments*, not in the code.

- Variables, read as `${{ vars.NAME }}`, are settings anyone may see, such as the API's address.

- Secrets, read as `${{ secrets.NAME }}`, are passwords and keys. GitHub hides them in logs, though not a changed version of one, such as half of it, and nobody can read one after it is saved.

*Seen, in the stage files. How GitHub hides secrets is from its documentation, not checked here.*

## 6. A whole file

`pr.yml` is our shortest workflow, and it uses only words from this page. Here it is, with the section for each line:

```yaml
name: PR checks                # the name in the Actions tab, §1
on:
  pull_request:                # started by every pull request, §1
jobs:
  test:                        # one job, called test, §2
    name: Test
    uses: ./.github/workflows/stage-test.yml   # the job is a stage file, §4
    with:
      run_api_tests: true      # the stage's inputs: run both checks, §4
      run_web_build: true
    secrets: inherit           # pass all secrets, §4
```

So a pull request runs one job, and that job is `stage-test.yml` with both checks turned on.

To practise, open `stage-test.yml` and find the database it starts, and the steps that are skipped when `run_web_build` is false. Hint: look for `services`, and for an `if` that names the input.

*Seen, in `pr.yml` and `stage-test.yml`.*
