---
under: the rule
kind: brief
---

# Reading a workflow

A workflow file says when it runs, and then what jobs run, in what order, on what conditions. Each part is a handful of words of YAML, and once they are known every file in `.github/workflows/` reads plainly. They are taught here in the order they stand on each other, each on one of our own files.

*Seen, in `.github/workflows/`; the words are GitHub Actions' own, described from its behaviour as these files use it, an agent's reading.*

## 1. A workflow, and what starts it

A workflow is one YAML file in `.github/workflows/`. Its `name` is what the Actions tab shows, and `on` lists the events that start it. This is the top of `pipeline.yml`:

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

A push to `main` or of a tag starting with `v` starts it. `workflow_dispatch` adds a *Run workflow* button to the Actions tab, and `inputs` are the choices the button offers, here which modules to deploy. `pr.yml` is started by `pull_request`, and `publish.yml` only by the button.

*Seen, in the three files; an agent's reading.*

## 2. Jobs and steps

A workflow is made of jobs, and a job of steps. Each job gets a fresh machine of its own, named by `runs-on`, `ubuntu-latest` in all of ours, and its steps run on it one after another.

A step does one of two things. `run` runs shell commands, as `cd web && npm ci`. `uses` runs an action, a ready-made step someone published, and `with` gives it its settings. `actions/checkout` fetches the repository onto the machine, which is why almost every job starts with it: a fresh machine holds nothing.

A job can also start `services` beside it, containers it can talk to. `stage-test.yml` starts a Postgres database that way, so the API's tests have a real database and throw it away after.

*Seen, in every file, and the service in `stage-test.yml`; an agent's reading.*

## 3. Order, conditions and what jobs hand each other

Jobs run at the same time unless they say otherwise. `needs` says a job waits for others to succeed, and it is how `pipeline.yml` makes its stages: `test` needs `init`, `build-api` needs `test`, and so on. `build-web` and `deploy-api` need different things, so they run side by side.

`if` skips a job or a step unless its condition holds. The condition is an expression in `${{ }}`, which GitHub fills in before the step runs.

Because each job has its own machine, a job hands values on as outputs. `init` works out its decisions in a shell step and writes them to the file `$GITHUB_OUTPUT`, declares them under `outputs`, and every later job reads them:

```yaml
if: ${{ needs.init.outputs.deploy_api == 'true' }}
```

Files are handed on differently, as an artifact uploaded by one job and downloaded by another, which is how the web's built files reach its deploy.

*Seen, in `pipeline.yml`, `stage-build-web.yml` and `stage-deploy-web.yml`; an agent's reading.*

## 4. Reusable workflows: the stage files

A workflow started by `workflow_call` is not started by an event but by another workflow, as a job. Every `stage-*.yml` file is one. They let one stage be written once and used in several places: `stage-test.yml` is the test stage of both `pr.yml` and `pipeline.yml`, and `stage-build-web.yml` serves both `pipeline.yml` and `publish.yml`.

The caller names the file with `uses` and gives its `inputs` with `with`. The stage file declares which inputs and secrets it takes, and `secrets: inherit` in the caller passes it all of the caller's secrets.

Our build and deploy stage files take an input named `run`, a name of ours that has nothing to do with the `run` of a step. They skip their job when it is false, which is how a push that changed only `api/` still walks the whole road but builds and deploys the API alone.

*Seen, in `pipeline.yml` and the stage files; an agent's reading.*

## 5. Environments, variables and secrets

One workflow deploys to three environments by reading different values in each. A job that names an `environment` reads that environment's settings, kept in the repository's settings on GitHub under *Environments*, not in the code.

- **Variables**, read as `${{ vars.NAME }}`, are settings that may be seen, such as a bucket's name or the API's address.

- **Secrets**, read as `${{ secrets.NAME }}`, are passwords and keys. GitHub hides them in every log, and nobody can read one back once it is saved.

Which names each environment needs is listed in the [infrastructure readme](../../cdk/README.md#github-actions).

*Seen, in the stage files and `cdk/README.md`; an agent's reading.*
