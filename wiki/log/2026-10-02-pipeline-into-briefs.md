# 2026-10-02 — The pipeline's entry is broken into briefs

On feedback that the pipeline's entry was too long, and read as one brief, its dividers became headings, each a brief of its own. Emelie set the shape: the entry gives what a reader absolutely needs to know, each card's face says what is gained by going deeper, and the technical detail stands beneath, in the card's page. The state before is kept on the local branch `snapshot/wiki-2026-10-02`. Only `wiki/pipeline/` was changed.

## What was decided

- `pipeline/README.md` now has a top brief and five numbered sections: *Three copies of the system*, *Every pull request is checked*, *A merge reaches dev, a release reaches the workshops*, *Text edits show after a republish* and *When you work with it yourself*. Each of the last four places one card. Emelie's shape, from the agent's outline.

- The headings name what the reader needs to know, not the card's title. The first names were the titles, and the surface's check flagged each as a heading that earns nothing, under the practice's §3.2 and §3.3. The agent's naming.

- The jobs table moved up into the top brief, so the three jobs are seen together before they are taken one by one.

- *Three copies* is a brief of its own again, so its confidence line stands back in it. This supersedes the fold into the closing line earlier the same day, recorded in [the entry of 2026-10-01](2026-10-01-pipeline-in-practice.md), which was right only while the entry had no headings.

- The faces of `check.md`, `deliver.md` and `publish.md` now say what the reader gains by entering, in the reader's terms and not as a list of the sections. What they held beyond that moved into the first section it belongs to: the two questions, CI and the workflow names into `check.md` §1; CD, step by step and `pipeline.yml` into `deliver.md` §1; `publish.yml`, started by hand and "changes no code" into `publish.md` §2. No section was renumbered, so every link into them holds.

## Left open

- The new structure itself is *held open*. Emelie has not decided whether it stays, and wants the way back kept at hand, under *Reverting* below.

- §5's face and the face of `in-practice/README.md` name the same two moments, a failed run and changing the pipeline. Some overlap is what this shape asks, the need-to-know above and the gain beneath, but whether this much is too much is unread.

- `in-practice/README.md` still uses dividers between its placements. It was given only a light touch, as the outline proposed, and whether its placements become headings in the same way is not decided.

- No fresh head has read the new entry and faces cold.

## Reverting

The branch `snapshot/wiki-2026-10-02` holds all of `wiki/` as it stood before this restructure, with the fixes of the same morning to the 2026-10-01 entry's findings already applied. It exists only on Emelie's machine and is not pushed. From the repository's root, this puts `wiki/` back as it was, both the files and what is staged:

```
git restore --source=snapshot/wiki-2026-10-02 --staged --worktree -- wiki
```

Files added since the snapshot, this entry among them, are left in place by it, and are removed by hand. To see what would change first:

```
git diff snapshot/wiki-2026-10-02 -- wiki
```

Once the structure is decided, the branch can go with `git branch -D snapshot/wiki-2026-10-02`.

## How it was checked

The surface's `--check` from `wiki/` traced 232 briefs from `README.md` with no faults, once the headings were renamed.

## Files

- Edited `pipeline/README.md`, `pipeline/check.md`, `pipeline/deliver.md`, `pipeline/publish.md`, and added this entry.
