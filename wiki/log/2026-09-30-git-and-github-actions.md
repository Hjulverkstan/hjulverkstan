# 2026-09-30 — Git and GitHub Actions given as words

Reading the pipeline holon, Sanna found two tools it stands on but never gives. It never says what the pipeline is built with: GitHub Actions was named only in passing, first in [`reading.md`](../pipeline/reading.md) as a link to its documentation, and its parts, the Actions tab, workflow files and `.github/workflows/`, were never tied together as one tool. And it never names git, though the entry sends a reader to the basics with "If pipelines, git or GitHub are new to you, begin with the basics", and the words commit, branch, merge and tag are all git's.

## What changed

- [`basics.md`](../pipeline/basics.md) §3, "The words", gives Git right after Code, since the words after it stand on it, and gives repository inside it.

- It gives GitHub Actions right after GitHub: GitHub's service for running pipelines, written as workflow files in `.github/workflows/` and run on GitHub's own machines when something happens in the repository.

- The GitHub word now reads "the site where the repository is kept", and the Actions tab is said once, under GitHub Actions. So git, GitHub and GitHub Actions read in order: the history, where it is kept, and what runs from it.

- Sanna's decisions on the placement; GitHub Actions agreed with Eric, whose holon it is. The wording is the session's.

- [`reading.md`](../pipeline/reading.md) stays as it is, naming GitHub Actions as a link to its documentation. A reader who reaches it has either read the basics or skipped them knowing pipelines, and the page itself says what a workflow file is. Sanna's decision.

## How much the basics should hold

A word earns its place in the list when the pipeline's pages use it, since a word the knowledge carries is given before it is used. Git and repository pass: the entry gives `git tag` commands, `api.md` sets a git tag against a Docker tag, and repository is used by the GitHub Actions word. Each word stays a line or two, so the list does not grow into a tutorial. *Reasoned, in the session.*

## Left open

- Where the pipeline entry should state, as a plain fact, that the pipeline is built with GitHub Actions. A developer needs that fact rather than an explanation, and the word in `basics.md` explains the tool without saying Hjulverkstan uses it. The intro was ruled out, since it gives the why for every reader, staff included. Two places were weighed: the first sentence of §2 "Watching a run", where a developer first opens the Actions tab, or a sentence of its own on the entry right after the basics card and before the three jobs, so it is read whichever job is opened first. *Held open*, Sanna's call.

- Whom the basics are for is not said in the page. The likeliest readers are developers new to pipelines, such as interns, and anyone curious; someone who has never programmed likely stops at the entry's intro. *Held open*, for the team.

## Files

- Edited `pipeline/basics.md`; added this entry.
