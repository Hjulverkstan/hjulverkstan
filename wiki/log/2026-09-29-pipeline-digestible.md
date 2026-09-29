# 2026-09-29 — The pipeline holon, made easier to take in

The [pipeline holon](../pipeline/README.md) was reviewed against [the rule](../the-rule/rule.md) and rewritten for its junior reader, with pictures, a story and exercises. On Eric's instruction, after the review found it sound in form and broken in five places.

## What the review found, and what was done

- Words used before their ground in sections a reader may reach by skipping: "docker compose", "compose file", "health check", "CDN" in the entry's failures and open list. Each is now explained where it stands or linked to where it is given.

- The entry's face claimed "nobody deploys by hand, so what runs is what was checked", which its own open list contradicts. The claim is gone; the face says what the pipeline gives a developer.

- A lead-in list, "a few things the picture leaves out", carried the content of the triggers. It is now §3, a brief of its own, one paragraph per event.

- The API's image was defined twice, in the entry and on its page. The entry now only names it.

- The page on reading a workflow taught GitHub Actions with no pointer to its source. It now links GitHub's documentation as a source not brought in.

## What was added

- A story of one change, from a pull request to prod, as the entry's §1, since the road is a chain of causes.

- Five sketches under the sketching skill: the three environments, the jobs of one run, one image with three names, what reaches the API's server, and the web's path. `check` found no faults in any.

- A walkthrough of a green run in the Actions tab, §6, and a checklist for adding a setting the API needs, `api.md` §4. The checklist has five places, not the four the first draft counted: the test stage gives the API's tests their own settings.

- A last section in `reading.md` that reads `pr.yml` whole with the words the page taught, and an exercise on `stage-test.yml`.

## Also changed

- `wiki/README.md` said the rule is not yet tracked in git; it is now a submodule, and the line says so.

## Left open

- The holon is still not placed from `wiki/README.md`, as decided on [2026-09-28](2026-09-28-pipeline-holon.md).

- The walkthrough in §6 is reasoned from how GitHub shows a run, not walked in this repository's Actions tab.

## Files

- Rewrote `pipeline/README.md`, `pipeline/api.md`, `pipeline/web.md`; extended `pipeline/reading.md`.

- Added `pipeline/.img/environments.svg`, `run.svg`, `image-names.svg`, `server.svg`, `web-path.svg`, and this entry.

- Edited `wiki/README.md`.

## The fresh head

A fresh head read the rewrite with only the rule, and one round followed. It caught words still used before their ground (workflow, container, Postgres, S3, YAML, shell, endpoints), test as both a stage and an environment, a caption on the run's jobs that said the web's build waits for nothing, and a release's rebuild left unexplained against the picture of one image's names. All were fixed; the processor and cache paragraph in `api.md` was cut on its advice. Its advice to cut two maintainer notes from the open list was not taken, since the list is their one home; the list now says who they matter to.

## Writing a pipeline

On Eric's request, a page on writing a pipeline was added, [`pipeline/writing.md`](../pipeline/writing.md), placed in the entry's §5 beside reading one: the ideas ours is built on, where a change belongs, a worked example adding the web's lint to the checks, adding a value or secret, how to try a change, and a checklist. It adds the sketch `pipeline/.img/callers.svg`, which workflow calls which stage.

A fresh head read it with only the rule and the files, and one round followed. It caught five claims wrong against the files: a stage file's list of secrets is not complete (`API_AWS_BACKUP_PASSPHRASE` arrives only by `secrets: inherit`), the test stage does not run in `publish.yml`, every release tag rebuilds the API's image and not only the candidate's, a later merge redeploys only what it changed, and the button sends a run to dev only from a branch. It also found that the lint example is not yet cheapest first, which the page now says. All were fixed.

Found on the way, and open: no workflow runs the web's lint today.

## Trimmed, and written for a non-native reader

On Eric's request the holon was rewritten in plain English: short sentences with one idea each, idioms replaced ("the road", "cut a release", "fix forward", "brought in"), one word for one thing. Repetition was cut so each explanation has one home: the Docker image in `api.md`, S3 in `web.md`, the web built from an old API in `web.md` §1. Confidence lines were shortened, with "an agent's reading, not checked against a run" said once per page instead of in every line; that departs from the practice's owner-in-every-line and is Eric's decision. The open list moved out of the entry into its own page, [`pipeline/open.md`](../pipeline/open.md), placed last, and gained one item, the lint not run.

The pages went from about 6,350 words to about 5,600. Most of the gain is in readability; less was cut than first estimated (a third), because plain sentences run longer and the open list kept every item.

A fresh head read it as a B2-level English reader, and one round followed: idioms and unexplained words (rc, EC2, Postgres, container, health-gated) and two inexact claims in `writing.md` were fixed. Git basics such as commit, branch and pull request are left unexplained, since the reader is assumed to know git.
