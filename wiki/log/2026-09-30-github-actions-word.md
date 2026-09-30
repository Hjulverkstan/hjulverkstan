# 2026-09-30 — GitHub Actions given as a word

Reading the pipeline holon, Sanna found that it never says what the pipeline is built with. GitHub Actions was named only in passing, first in [`reading.md`](../pipeline/reading.md) as a link to its documentation, and its parts, the Actions tab, workflow files and `.github/workflows/`, were never tied together as one tool.

## What changed

- [`basics.md`](../pipeline/basics.md) §3, "The words", gives GitHub Actions as a word of its own, right after GitHub: GitHub's service for running pipelines, written as workflow files in `.github/workflows/` and run on GitHub's own machines when something happens in the repository. Sanna's decision on the placement, agreed with Eric, whose holon it is; the wording is the session's.

- The GitHub word now ends at the site where the code is kept, so the Actions tab is said once, under GitHub Actions.

- [`reading.md`](../pipeline/reading.md) stays as it is, naming GitHub Actions as a link to its documentation. A reader who reaches it has either read the basics or skipped them knowing pipelines, and the page itself says what a workflow file is. Sanna's decision.

## Left open

- Where the pipeline entry should state, as a plain fact, that the pipeline is built with GitHub Actions. A developer needs that fact rather than an explanation, and the word in `basics.md` explains the tool without saying Hjulverkstan uses it. The intro was ruled out, since it gives the why for every reader, staff included. Two places were weighed: the first sentence of §2 "Watching a run", where a developer first opens the Actions tab, or a sentence of its own on the entry right after the basics card and before the three jobs, so it is read whichever job is opened first. *Held open*, Sanna's call.

## Files

- Edited `pipeline/basics.md`; added this entry.
