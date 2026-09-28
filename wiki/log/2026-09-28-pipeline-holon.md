# 2026-09-28 — The pipeline holon

A holon on the CI/CD pipeline, [`pipeline/`](../pipeline/README.md), written under [the rule](../the-rule/rule.md) for junior developers: the whole road first, then the API's and the web's paths, then how to read a workflow file. It is its own root, read on the surface with `bun the-rule/poc/surface/surface.ts pipeline` from `wiki/`.

## What was decided

- The holon stands alone in `wiki/pipeline/`, and nothing else in the repository was changed to reach it: `wiki/README.md` does not yet place it. On Eric's instruction.

- The pipeline's own facts stay in the workflow files, the release steps in `GUIDELINES.md` and the environment variables in `cdk/README.md`; the holon links to them rather than copying them. *Lean*, the session's.

- An outline was proposed and approved before the prose, in the order: the road (triggers and environments), one run's four stages, reading a workflow, when a run fails, what is open.

## How it was made

1. **Read** the eight workflows, `GUIDELINES.md`'s release process, `cdk/README.md`, `cdk/lib/app.ts`, `cdk/assets-ec2/docker-compose.yml` and `web/src/server.tsx`. Two claims of the first outline were dropped on reading: that the API image is built once and only promoted (a tag run builds it again), and that the deploy waits for health (it waits only for the containers to start).

2. **Sketched** the road as `pipeline/.img/road.svg` under the sketching skill; `check` found no faults.

3. **Checked** with the surface's `--check`: 20 briefs, no faults; two faces past the 400-character flag were broken.

4. **A fresh head** read the draft with only the rule, and one round followed. It caught three wrong claims: the pipeline's test stage runs only the checks for what is deployed, dev's `version.json` carries `dev` as its version, and publish reads `version.json` from the bucket. It also caught words used before their ground (git tag against Docker tag, docker compose, SSH, `VITE_`, web edit), the API page's face contradicting its §2, and the environment "test" read as the stage. All were fixed; the check is clean again.

## Left open

- Seven mismatches found in the pipeline and what is written about it, recorded in the holon's [§5](../pipeline/README.md#5-what-is-open) and fixed nowhere.

- Every claim is seen in the files, not in a run; none was checked against GitHub's run history or the environments' settings.

## Files

- Added `pipeline/README.md`, `pipeline/api.md`, `pipeline/web.md`, `pipeline/reading.md`, `pipeline/.img/road.svg`, and this entry.
