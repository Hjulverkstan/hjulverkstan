# The knowledge structure

*Draft — the map of the work, held open. Settled points are stated plainly; leans and open questions are marked. Nothing here is binding until it is folded into `README.md`, `AGENTS.md` or `conventions/`. Sources: the intro meetings of 2026-08-17 ([transcripts](../transcripts/)) and the sessions of 2026-08-18 ([log](../log/)).*

## The aim

One knowledge structure for Hjulverkstan, in the monorepo, uniform and first class for humans and agents alike. The bar for *complete*: an agent could rebuild the front end from the wiki alone. The bar is on the whole tree — what the application does is not enough without the conventions that say how we build.

## Principles

1. **Folds.** Knowledge nests. A directory or file is a closure: readable on its own, entered from above, descended into when work calls for it. A reader — human or agent — navigates without loading everything; the context-window argument and the safe-space argument are the same argument.
2. **Order is a tattoo.** What comes first in a session weighs most, for agents as for humans. The entry states purpose first, technical gates last. Reading order is one property of the structure, not the structure: how files, levels and directories dispose the knowledge, and how they map to each other, is the larger question.
3. **Two kinds of knowledge.** Superseded-by-code (ticket detail, how to build this) versus persistent (client, users, features, behaviours, decisions). The wiki holds the second; the first stays in Projects, PRs and code.
4. **Sources are not the structure.** Meetings are events; the wiki is state. Transcripts stay as provenance; a distilled claim points back to fold and minute.
5. **Digest; don't sequence.** A fold — or a directory — is organised around what it establishes, not around the order things happened to be said. This is why content is not poured in before the shape exists.
6. **A blank session is the same for everyone.** No agent memory, no private context; the repo is the recipe (`AGENTS.md`).
7. **Openness is marked in place.** An unmarked statement reads as settled.

## The shape

```
README.md            entry: purpose, map, reading order — and nothing else
AGENTS.md            agent-agnostic; the one-memory rule; pointer to README
wiki/
  product/           the application — client, users and roles, features, behaviours,
                     domain, design (Figma links). The user manual falls out of it.
  conventions/       rulings that apply everywhere — the guidelines, how we work, how we
                     build, how agents behave; how it divides is the disposition's to decide
  lore/              transferable teaching folds — history of the web, IaC, completion
                     models, the harness, how to approach code you don't understand
  drafts/            proposals, explorations, critiques — not binding
  log/               one dated file per entry: essence, files touched, links
  transcripts/       approved sources; the meeting method lives in its README
```

Rulings behind it, briefly: the GitHub wiki was researched and rejected (no Projects or Figma integration to justify fragmenting); `wiki/` names the wiki-as-code the meetings reached for. `process/`, `decisions/`, `horizon/`, `board/`, `people/` were considered and dropped — process is conventions, decisions are log entries lifted into state files, the future belongs to GitHub Projects, personal content compounds as insight and never as profiles. Directory READMEs only where earned (`transcripts/`, `log/`, and `conventions/` when it fills). Module READMEs become pointers into `conventions/` once redigested. A practice lives where it is practised, which keeps `conventions/` from bloating.

## Phases

What makes a good knowledge structure is still under study — declared here rather than assumed.

1. **Study.** Understand what makes a good knowledge structure: how top-down (purpose, goals, what invites) and bottom-up (the technical gates) meet; spec-based development (named on record, unresearched); reference structures; how the two kinds of knowledge and the two registers (knowledge / personal) live together; what levels, directories and cross-references buy. Researched and pondered, but tested against the conventions we already have. Output: understanding — principles, marked settled or open. Not a proposal.
2. **Draft the disposition.** A hypothetical structure of `product/`, `conventions/`, `lore/`: which files, what each holds, how they map to reading order and to each other. Two streams feed it at once — the study, and the knowledge we actually hold: the transcripts, the repo's markdown (root README, `GUIDELINES.md`, the three technical READMEs), Projects, Figma. Drafting the disposition and digesting what we have are one act: files cannot be disposed without knowing what goes in them, and knowledge cannot be placed without a disposition. Drafted, not committed; no full prose in `conventions/`; iterated as understanding grows. The `product/` part of the draft doubles as the agenda for the product meeting.
3. **Commit.** Write the structure and move the knowledge in — transcripts, repo markdown, the product meeting, and Projects, Figma, Teams-chat feedback as they become reachable. `lore/` can go early; its folds are self-contained and its place is settled.
4. **Purify.** Against the bar; iterate.

Where we are: two meetings as sources (written and checked; approval pending); phases 1 and 2 open, and they run together.

## Open threads

Each can be picked up in its own session; none blocks a meeting on the product gap.

- **Study** (phase 1) — read spec-based development and a few public knowledge structures; test against our guidelines; write the principles into a drafts file, settled and open marked. Done when we can say what good looks like and why.
- **Draft the disposition** (phase 2, with the study) — files, contents, mappings for `product/`, `conventions/`, `lore/`, drafted from what the transcripts and the repo's markdown actually hold. Done when an intern can walk it and say what is missing, and every piece of knowledge we have has a place or a named gap.
- **Third meeting through the method** — `.vtt` into `transcripts/.raw/`, steps 0–6, including the independent check of the clean that the intro transcripts never had.
- **Approval of the intro transcripts** — Shudong and the interns review their lines; Mauricio confirms the three room voices marked `[?]`; decide the mechanism (PR review vs in-file checklist).
- **Projects sync** — a local script saving GitHub Projects as purified JSON, gitignored, run by practice at bootstrap; its convention written when it exists.
- **Root README** (after the disposition) — becomes purpose and entry only; its sections go where the disposition says.
- **Technical docs and `GUIDELINES.md`** (after the disposition) — into `conventions/`; module READMEs become pointers. *Open:* `SETUP.md` is procedure, not ruling — placed when this happens.
- **Figma** — designs are truth (tokens, typography, rounding); whether design values can be linked or consumed directly is unexplored.

## Held open

- How personal knowledge is used in the structure (transcripts keep it less compressed meanwhile).
- The language of the wiki (English) against a Swedish client and product.
