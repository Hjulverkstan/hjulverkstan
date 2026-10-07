# 2026-10-06 — Pipelines in general moves into the new pipeline holon

The first point [left open on 2026-10-05](2026-10-05-pipeline-next.md#left-open) is answered: *Pipelines in general* belongs to the new holon. It stands as a card in the opening of `pipeline-next/README.md`, where it was already linked, and its files now live in `pipeline-next/basics/`. It was then reread beneath the new opening and amended. Nothing is committed.

## What was decided, in session

- *Pipelines in general* is part of the new pipeline holon, as a card in its opening. A sibling of the pipeline, or a body standing apart, were weighed and not chosen.

- Its files move with it, into a folder of their own, `basics/`, beside the new holon's own pages.

- The link from `basics/ideas.md` into the old holon is left as it is. Whether how ours follows the ideas has a place in this holon is under discussion.

- The wiki's entry now places `pipeline-next/` as *The pipeline*, and links the old `pipeline/` in its prose. The old holon stays until what only it holds has moved: *Changing our pipeline*, which is kept and wants a place in the new holon, and the drawings, which are kept and redrawn where that helps a reader. The walk-through of one change in the old `deliver.md` is not carried over.

## The move

The folder was moved whole with `git mv`, its two images included. Every link into and out of it was rewritten, and the surface's check traced the whole wiki without a broken link or placement.

- The new holon's links to *Pipelines in general* are now local, `basics/…` and `../basics/…`.

- Its own links to our pipeline point at the new holon: CI at `checking.md`, CD at `delivering/README.md`.

- The old holon `pipeline/` is otherwise untouched, but its links into *Pipelines in general* now reach across, to `../pipeline-next/basics/`. Its entry still places it as a card, so it stands in both holons for now, one file in two places.

## The reread

*Pipelines in general* was read again as a reader arriving from the new opening, and its claims about our files were checked against `.github/workflows/`; they held. What changed:

- **Its face.** It said nothing in it was special to Hjulverkstan, which *Reading a workflow* is, and the new holon's deeper pages link into it. The face now says the page is general, and that its last section is where the general meets ours.

- **One name.** The new opening called it "the general guide" before its card; it now uses the title.

- **How a pull request is run.** *Reading a workflow* said a pull request runs the workflows from its own branch, and `checking.md` that it runs as if merged. Checked against [GitHub's documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request): it runs on a trial merge into the branch it targets, and the workflow files are read from that merge. Both pages now say so in the same words. `checking.md` adds when the merge is made, that a later change to the target branch does not run it again, and that a pull request with a conflict is not run at all; it got a paragraph of its own, to keep the face short.

- **Dates.** Every confidence line now carries one: the claims seen in the workflow files, read 2026-10-06; the reasoned and common ones, written 2026-10-01.

- **A face split.** *Reading a workflow*'s face, 455 characters, was split after its second sentence.

## What moved from the old holon

The old holon held two things the new one lacked, and both were carried over the same day, on the author's go.

- **Changing our pipeline** is now `pipeline-next/changing.md`, placed as §4 of the top page, *Changing the pipeline itself*, since it stands on all three parts and is read step by step by the developer about to change the pipeline. It stays out of *Pipelines in general*, which is kept general. Its facts were checked against the workflow files again. What the new holon already said elsewhere is linked rather than repeated: adding a setting the API needs, delivering a branch by hand, and where the settings are kept. Its claim that a pull request runs the workflows from its own branch was corrected to the trial merge. `basics/ideas.md` now links to it, which answers what was left open above.

- **The drawings.** Six were kept as they were and copied beside the pages that show them: the environments, the three parts (its header now reads *the part*), the tags, the image's names, the server, and which workflow calls which stage. Four were redrawn under the rule's sketching skill, since their wording or their point no longer matched: what starts a run and where it goes, in the new pages' step names; the order of one delivery, now with all three effects §1.4 names; the website's path, now with the images in their own store; and a republish, now started by a developer with *Publish (web)*.

## The old holon removed

On the author's go, `pipeline/` was deleted whole, once a last comparison found nothing in it left out of the new holon except what was chosen to go: the walkthrough of one change in `deliver.md`, and a note on the project README's roadmap, which belongs in that README. The warning never to write a secret in a workflow file was added to `changing.md` §2.3, so it covers every secret and not only the API's. Git keeps the holon as of commit `7624c06`. What changed in it after that commit was never committed and is gone: `in-practice/README.md` and `in-practice/failing.md` whole, and the later edits to the other pages.

## Renamed

With the old holon gone, `pipeline-next/` was renamed `pipeline/`. Every path in this entry above names the folder as it was then.

Last, `changing.md` §1, *The ideas, in ours*, became *The ideas our pipeline follows*, on the team's finding that "ours" left the reader asking ours what. Its first sentence now says the ideas are a good pipeline's, and where they are given, before the section uses them; "behind" was weighed and not chosen, since the pipeline's authors never wrote its ideas down.

## Left open

1. **The trial merge was not tried in this repository**, only read from GitHub's documentation, and both pages say so.

2. **The new top page's face**, 421 characters, is still past the flag.

## Files touched

- Moved `pipeline/basics/` → `pipeline-next/basics/`: `README.md`, `reading.md`, `ideas.md`, `.img/by-hand.svg`, `.img/branch.svg`.

- Links rewritten in `pipeline-next/README.md`, `checking.md`, `republishing.md`, `delivering/README.md`, `delivering/api.md`, `basics/README.md`, `basics/ideas.md`, and in the old `pipeline/README.md`, `api.md`, `check.md`, `deliver.md`, `publish.md`, `in-practice/failing.md`, `in-practice/writing.md`.

- Amended in the reread: `pipeline-next/README.md`, `checking.md`, `basics/README.md`, `basics/reading.md`, `basics/ideas.md`.

- Added `pipeline-next/changing.md`, `pipeline-next/.img/` (`environments.svg`, `jobs.svg`, `publish.svg`, `callers.svg`) and `pipeline-next/delivering/.img/` (`road.svg`, `run.svg`, `web-path.svg`, `tags.svg`, `image-names.svg`, `server.svg`). Drawings placed in the new holon's `README.md`, `delivering/README.md`, `delivering/api.md`, `delivering/web.md`, `republishing.md` and `changing.md`.

- `wiki/README.md`: its open line, then its card, which now places `pipeline-next/README.md`, then the line on the earlier version.

- Deleted `pipeline/` whole, then renamed `pipeline-next/` to `pipeline/`.

- This entry. Older log entries keep their old paths, as history.
