# 2026-10-09 — Publishing the wiki joins the pipeline holon

The workflow `pages.yml`, which publishes the wiki on GitHub Pages, is now described in `pipeline/README.md`, as §4, *The wiki is published as a web page*. It was written on `feature/wiki-pages`, beside the workflow, while the rest of the pipeline holon's work stays on `feature/pipeline-holon-test`.

## What was decided, in session

- The section stands in the pipeline's entry, after *Edits to the site show after a republish*, and has no file of its own, since nothing would stand beneath it. *Changing the pipeline itself* becomes §5 and stays last; nothing linked to its old number.

- The opening keeps the pipeline as the software's road, and gains one sentence saying that one more part publishes the wiki and has nothing to do with the software. Widening the opening, or keeping the section off the page, were weighed and not chosen.

- Only the pipeline's entry changes. The other pages of the holon stay true: `pages.yml` calls none of the stage files.

- §4 says that the wiki's links to the rest of the repository, eight of them, such as the pipeline's to `GUIDELINES.md`, lead nowhere on the published page for now, as asked in session.

## Rounds

Four fresh heads read it: two the first draft, one cold and one against the workflow and the surface's code, one the second draft, and one the whole holon with §4 in it. What they changed:

- **The check does not stop the publish.** The surface's `--check` prints its warnings and ends without failing, so the run publishes and shows green. A link to a missing file is not even warned of; a link to a heading that is not there is, so that is the section's example.

- **A directive was written as a fact.** "Whoever changes the wiki reads that log" became the fact behind it: the log is the only place such a problem shows.

- **Words before their ground.** "Workflow" and `main` were not given in the page's prose, and are no longer used in it; the wiki is introduced as the place that holds the page.

- **Its name on GitHub.** As its siblings do, §4 now names the workflow as the Actions tab shows it, *Pages*, and links the tab, which also grounds "the run's log". §5 now says it stands on the software's three parts, not on all the parts above it.

The last read left only words.

Files touched: `wiki/pipeline/README.md`, and this entry.

## Left open

1. **It has never run.** Where the page will be, and whether GitHub is set to publish from the workflow, are known only after its first run on `main`. §4's confidence line is updated then.

2. **The links out of the wiki getting pages of their own in it** is a lean, with no plan or date.

3. **The check does not warn of a link to a missing file.** That is the rule's tool, not this wiki's; it is noted here and not raised there.
