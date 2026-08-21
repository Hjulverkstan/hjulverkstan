# The knowledge structure

*Draft — the map of the work, held open. Settled points are stated plainly; leans and open questions are marked. Nothing here is binding until it is folded into `README.md`, `AGENTS.md` or `conventions/`. Until GitHub Projects holds this work, this file is its board, kept true to our current understanding. Sources: the intro meetings of 2026-08-17 and the working session of 2026-08-18 ([transcripts](../transcripts/)), and the sessions since ([log](../log/)).*

## The aim

One knowledge structure for Hjulverkstan, in the monorepo, uniform and first class for humans and agents alike. The bar for *complete*: an agent could rebuild the front end from the wiki alone. The bar is on the whole tree — what the application does is not enough without the committed architecture that says how it is built and the conventions that say how we build.

The project is larger than the product. Hjulverkstan and Save the Children have a scope of their own, and the goals behind the product are full of knowledge. What the client needs to know and what this open-source repository needs to know cross each other; separated, they would stop compounding. So the structure holds both, and *first class* means first class to every party — which is where the horizon (below) points.

## Principles

1. **Folds.** Knowledge nests. A directory or file is a closure: readable on its own, entered from above, descended into when work calls for it. A reader — human or agent — navigates without loading everything; the context-window argument and the safe-space argument are the same argument.
2. **Order is a tattoo.** What comes first in a session weighs most, for agents as for humans. The entry states purpose first, technical gates last. Reading order is one property of the structure, not the structure: how files, levels and directories dispose the knowledge, and how they map to each other, is the larger question.
3. **Two kinds of knowledge.** Superseded-by-code (ticket detail, how to build this) versus persistent (client, users, features, behaviours, decisions, the committed architecture). The wiki holds the second; the first stays in Projects, PRs and code.
4. **Sources are not the structure.** Meetings are events; the wiki is state. Transcripts stay as provenance; a distilled claim points back to fold and minute.
5. **Digest; don't sequence.** A fold — or a directory — is organised around what it establishes, not around the order things happened to be said. This is why content is not poured in before the shape exists.
6. **A blank session is the same for everyone.** No agent memory, no private context; the repo is the recipe (`AGENTS.md`).
7. **Openness is marked in place.** An unmarked statement reads as settled.

## The shape

```
README.md            entry: purpose, map, reading order — and nothing else
AGENTS.md            agent-agnostic; the one-memory rule; pointer to README
wiki/
  (above product)    the initiative — Hjulverkstan and Save the Children, the goals behind
                     the product, the scope beyond it; name and placement open
  product/           the application — client, users and roles, features, behaviours,
                     domain, design (Figma links). The user manual falls out of it.
  solutions/         the committed architecture — how the back end works, how the front
                     end works, how things move through the cloud; product/ mapped to code
  conventions/       rulings that apply everywhere — the guidelines, how we work, how we
                     build, how agents behave; how it divides is the disposition's to decide
  lore/              transferable teaching folds — history of the web, IaC, completion
                     models, the harness, how to approach code you don't understand
  drafts/            proposals, explorations, critiques — not binding
  log/               one dated file per entry: essence, files touched, links
  transcripts/       approved sources; the meeting method lives in its README
```

**Above `product/`** is what flows from above — the gap the first meeting named: the initiative, the goals, the reasons why. Little is written yet; the client meeting of 2026-08-19 ([transcript](../transcripts/2026-08-19-client-meeting.md), pending approval) is its first source — and its topical folds are a first sketch of what the fold holds: the initiative and how Save the Children works, what a Hjulverkstan is, the places and partners, the new centre, expansion. *Open:* a directory of its own or the head of `product/`, and its name.

**`solutions/`** is the gap that, once filled, makes the code expendable: the architecture as committed, not as aspired to. Conventions say how we build; solutions say how this is built. Today the two are tangled in the three technical READMEs, which will split between them. *Lean:* the name. *Open:* the boundary against the code — `GUIDELINES.md` already puts references and in-code decisions in the code, and single source of truth holds for knowledge too, so `solutions/` holds what the code cannot say about itself, not a re-description of it.

Rulings behind it, briefly: the GitHub wiki was researched and rejected (no Projects or Figma integration to justify fragmenting); `wiki/` names the wiki-as-code the meetings reached for. `process/`, `decisions/`, `horizon/`, `board/`, `people/` were considered and dropped — process is conventions, decisions are log entries lifted into state files, the future belongs to GitHub Projects, personal content compounds as insight and never as profiles. Directory READMEs only where earned (`transcripts/`, `log/`, and `conventions/` when it fills). Module READMEs become pointers into `conventions/` and `solutions/` once redigested. A practice lives where it is practised, which keeps `conventions/` from bloating.

## Phases

What makes a good knowledge structure is still under study — declared here rather than assumed.

1. **Study.** Understand what makes a good knowledge structure: how top-down (purpose, goals, what invites) and bottom-up (the technical gates) meet; spec-based development (named on record, unresearched); reference structures; how the two kinds of knowledge and the two registers (knowledge / personal) live together; what levels, directories and cross-references buy. Researched and pondered, but tested against the conventions we already have. Output: understanding — principles, marked settled or open. Not a proposal.
2. **Draft the disposition.** A hypothetical structure of the fold above product, `product/`, `solutions/`, `conventions/`, `lore/`: which files, what each holds, how they map to reading order and to each other. Two streams feed it at once — the study, and the knowledge we actually hold: the transcripts, the repo's markdown (root README, `GUIDELINES.md`, the three technical READMEs), Projects, Figma. Drafting the disposition and digesting what we have are one act: files cannot be disposed without knowing what goes in them, and knowledge cannot be placed without a disposition. Drafted, not committed; no full prose in `conventions/`; iterated as understanding grows. The `product/` part of the draft doubles as the agenda for the product meeting.
3. **Commit.** Write the structure and move the knowledge in — transcripts, repo markdown, the product meeting, and Projects, Figma, Teams-chat feedback as they become reachable. `lore/` can go early; its folds are self-contained and its place is settled.
4. **Purify.** Against the bar; iterate.

Where we are: four meetings through the method (written and checked; approval pending) — the client meeting of 2026-08-19 among them, the first source above product; a small fourth meeting that day was not recorded, nothing lost; phases 1 and 2 open, and they run together.

## Horizon

Not committed; named so the near decisions don't close it off. First class to every party means, down the line, a structure the client can read and share — first class for the tech-illiterate — and possibly one that is technically integrated: learning material for employees in the portal app is the same knowledge the developers and the agents need, and interfacing it from several sides means something more evolved than markdown in this repository. Nothing is designed for that yet; what is decided now should not prevent it.

## Open threads

Each can be picked up in its own session; none blocks a meeting on the product gap.

- **Study** (phase 1) — read spec-based development and a few public knowledge structures; test against our guidelines; write the principles into a drafts file, settled and open marked. Done when we can say what good looks like and why.
- **Draft the disposition** (phase 2, with the study) — files, contents, mappings for the fold above product, `product/`, `solutions/`, `conventions/`, `lore/`, drafted from what the transcripts and the repo's markdown actually hold. Done when an intern can walk it and say what is missing, and every piece of knowledge we have has a place or a named gap.
- ~~**The meetings of 2026-08-19**~~ — the client meeting is through the method ([log](../log/2026-08-19-client-meeting-transcript.md)); the other, small, was not recorded. Next: its approval, then distilling it into the fold above product and into `product/`.
- **Ingest the client meeting** (after approval) — the first act of phase 3 for the fold above product: its topical folds into state files, claims pointing back to fold and minute; the plan it produced (adoption first, education days, admin access, the next meeting) into the board. Open: whether the fold above product is drafted from this transcript alone or waits for the product meeting.
- ~~**Third meeting through the method**~~ — done 2026-08-19 ([log](../log/2026-08-19-intro-pt3-transcript.md)): steps 0–5 run, including the independent check of the clean; step 6 pending. It ruled the working-session rule into `transcripts/README.md`.
- **Approval of the transcripts** — Shudong and the interns review their lines; Mauricio confirms the room voices marked `[?]` in parts 2 and 3; decide the mechanism (PR review vs in-file checklist) — *Lean:* PR review, tried first on the client meeting ([log](../log/2026-08-19-client-meeting-transcript.md)).
- **Projects sync** — a local script saving GitHub Projects as purified JSON, gitignored, run by practice at bootstrap; its convention written when it exists.
- **Root README** (after the disposition) — becomes purpose and entry only; its sections go where the disposition says.
- **Technical docs and `GUIDELINES.md`** (after the disposition) — `GUIDELINES.md` into `conventions/`; the three module READMEs split between `conventions/` and `solutions/` and become pointers. *Open:* `SETUP.md` is procedure, not ruling — placed when this happens.
- **Figma** — designs are truth (tokens, typography, rounding); whether design values can be linked or consumed directly is unexplored.

## Held open

- How personal knowledge is used in the structure (transcripts keep it less compressed meanwhile).
- The language of the wiki (English) against a Swedish client and product — sharper once the structure is meant to reach the client.
- **Where transcripts live.** Mauricio's position in the third meeting (transcript pending approval; his lines are inferred `[?]`): internal conversation does not belong in this public repo — a separate repo for transcripts, the resulting knowledge in the project. Current practice answers part of it (`.raw/` gitignored; nothing published before every voice approves; personal passages by others than their owner written unattributed) but the transcripts themselves are still headed for the public repo. Against splitting stands the compounding argument in *The aim*. Not ruled.
- **Whether working sessions are transcribed at all.** The third meeting was one; it yielded reasoning worth keeping (how to process transcripts, the public-domain question, the critique of the first proposed structure) at a little under half the clean's length. Lean: yes, under the working-session rule; but Jona asked in the meeting itself whether it needed saving.
- **The ball.** Proposed in the third meeting; Jona's lean since is that it may not be needed — see *Open* in `transcripts/README.md`.
