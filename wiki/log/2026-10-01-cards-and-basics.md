# 2026-10-01 — Cards that say what they give, and the basics laid by the gradient

On Eric's feedback that a fresh reader could not tell which card belonged to which paragraph, the pipeline's cards were set apart, and each card now leads with what reading it gives. *Pipelines in general* was reordered so its biggest understanding comes first and each section stands only on those before it. Only `wiki/pipeline/` was changed.

## What was decided

- A divider, a markdown `---`, stands after every card that has another card's paragraph after it, in the entry and in the basics' §5.2. Eric's choice, after a heading per job was tried and reverted. The proper fix, a card set closer to its paragraph than to the next, lives in the surface's CSS in the rule and is the rule author's to take; it was not proposed yet.

- Every placed file's first paragraph, which is all its card shows, gives the page's biggest understanding in plain words and ends with what reading on gives. Eric's direction, after a first try with one-line openings read as too short. The ten faces now run 410 to 531 characters, past the practice's flag of 400, and are left there for that reason.

- The entry's lead-ins no longer say what opening a card tells you, since the card now says it, and "tested by machines" became "tested automatically".

- The basics: §2 *CI and CD* in plain words, §3 *How a change travels* and §4 *From code to a running program* in prose instead of one list of words, and §5 *Pipelines on GitHub* gathering GitHub Actions, watching a run and the two cards. Eric's approval of the outline. Each word is in bold where it is given.

- Later the same day, on reading the practice's §3.1–3.3 together: the paragraph before a card says only where the card stands and why it comes here, and the card gives its own why and what. Eric's direction, after two tries at a summary above each card were reverted, since a summary there copies the card. The placements of checking, delivering, republishing and reading a workflow were rewritten to that, the copied sentence under the ideas' placement went, and the "Read on for…" lists left the cards, since §4.1 forbids a map of the parts to come. *Changing our pipeline* got a sentence of its own for its what. The entry names the basics as *Pipelines in general*.

## Moved, and given one home

- The word list `#3-the-words` is gone. Every link to it, and to the old `#4-watching-a-run`, now points at the section that gives the word: §3, §4, §5 or §5.1.

## The fresh head

A fresh head read the rule and the reordered basics cold. From it: §2.1 no longer leans on §3's words, semantic versioning says which number grows for what, an environment is tied to the servers of §1, and watching a run says the boxes are jobs holding steps. Left as they were: one confidence line per section, which the practice asks for, and the everyday words release, version and run.

## Left open

- The surface's check does not flag a card link that has fallen into the paragraph above it; it only shows as fewer briefs traced. Worth telling the rule's author.

- The new card faces have not been read by a fresh head.

- The rule's submodule was pulled to `3883710`, past what the branch records, and the move is not committed.

- Three card faces stay past the flag of 400, each with its reason: *Reading a workflow* (455) was never changed, *Changing our pipeline* (437) needs its new what, and *What is open* (410) is its list of mismatches.

## How it was checked

The surface's `--check` from `wiki/` traced 224 briefs from `README.md` with no faults. Every link into the basics was checked against its anchor.

## Files

- Edited `pipeline/README.md`, `pipeline/basics/README.md`, `pipeline/basics/reading.md`, `pipeline/basics/ideas.md`, `pipeline/check.md`, `pipeline/deliver.md`, `pipeline/publish.md`, `pipeline/writing.md`, `pipeline/open.md`, `pipeline/api.md`, `pipeline/web.md`.

- Added this entry.
