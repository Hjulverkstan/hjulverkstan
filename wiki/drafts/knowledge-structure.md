# The knowledge structure

*Draft — the map of the work, held open. Settled points are stated plainly; leans and open questions are marked. Nothing here is binding until it is folded into `README.md`, `AGENTS.md` or `conventions/`. Until GitHub Projects holds this work, the board below is its board. Sources: the intro meetings of 2026-08-17, the working session of 2026-08-18, the client meeting of 2026-08-19 ([transcripts](../transcripts/)), and the sessions since ([log](../log/)) — the team review of 2026-08-21 among them. This draft may itself split into files as sections harden; the study already has its own: [`study.md`](study.md).*

## The aim

One knowledge structure for Hjulverkstan, in the monorepo, uniform and first class for humans and agents alike. The bar for *complete*: an agent could rebuild the front end from the wiki alone. The bar is on the whole tree — what the application does is not enough without the committed architecture that says how it is built and the conventions that say how we build.

The project is larger than the product. Hjulverkstan and Save the Children have a scope of their own, and the goals behind the product are full of knowledge. What the client needs to know and what this open-source repository needs to know cross each other; separated, they would stop compounding. So the structure holds both, and *first class* means first class to every party — which is where the horizon (below) points.

## Principles

*Author's note (Jona, with the team, 2026-08-21): this list is the heart of the work, and it is not settled. It is a grounded starting point we return to iteratively as insight grows. The rungs are a ladder — each uses only what stands below it, so vocabulary builds step by step; words are minted only where folk speech runs out. The principles reach below coding and below any one practice: they aim at the most foundational truths we can state about knowledge, which is close to our nature.*

1. **Every head is bounded.** No reader — human or agent — holds everything at once; a person's comprehension and an agent's context window are one limitation. Every rung above stands on this one.

2. **Knowledge nests.** A unit readable on its own, entered from above, descended into by reference — we call it a *fold*. A fold is a safe space: inside it you understand everything, and what you don't understand is a reference — a thread to pull, not a failure. Because heads are bounded, the fold that spares an agent's window is the same fold that gives a person footing.

3. **What is met first weighs most.** For an agent the start of the window is a tattoo; for a person, so are first impressions. An entry gives purpose first, gates last. *Open:* whether a reading order is one line or a tree — a common core branching by audience and outcome, each branch ending where the knowledge stops serving that outcome.

4. **One fact, one home.** Single source of truth, lifted from the guidelines into knowledge itself: a fact is stated once and referenced from everywhere else. Meetings stay events; the wiki is state; a distilled claim points back to the fold and minute it came from.

5. **Untracked change is drift.** Git gave code one source, tracked change and a principled merge; infrastructure as code gave every other layer of the onion the same. Knowledge living in verbal training, an unwritten workshop or a Teams thread mutates with no record — that is drift. The wiki is the same move applied once more: knowledge as code.

6. **A blank session is the same for everyone.** No agent memory, no private context; the repository is the recipe. A private copy is a second source.

7. **Home follows lifetime.** Some knowledge dies into the code — ticket detail, how-to-build-this; some persists — the client, the users, the decisions, the committed architecture. The registers follow: transcripts are sources, the log is history, drafts are workspace, and the hardened state they all feed is — *open vocabulary; lean* — the **spec**. All of it one structure, folding and pointing the same way.

8. **A claim carries its ground and its status.** Ground: it points at its source — the guidelines themselves were built this way, on other people's writings. Status: unmarked reads settled, so a lean or an open question says so where it stands. An unmarked open question is knowledge failing silently — the same law the guidelines give code.

9. **Questions have an address.** In a structured space, disagreement and non-understanding are welcome because they land somewhere: a newcomer may not follow, but knows which paragraph the question attaches to. That is what a gate buys, and it is the only way an unbuilt structure gets questioned into a grounded one.

10. **Nothing is lost silently.** A meeting, a session, a decision either lands in state or is deliberately left out — and listed. *Lossless* is the practice's word for it.

11. **Written whole, around what it establishes.** Prose is not modular; meaning lives in transitions and in what has already been said. A fold is organised around what it establishes, not the order things happened to be said — and new knowledge is folded in by rewriting the whole, never patched on.

12. **The personal is knowledge, and its speaker owns it.** We are the people doing the commits; how we learn and what we navigate is knowledge too. It is compressed less, distilled only generalised, and its speaker keeps, trims or removes it — a final edit, no justification owed.

13. **Don't run ahead of comprehension.** In reading, in building, in growing: move a little, gain footing, and when a leap is forced without understanding, stop and talk. The client holds the same principle from their side — platform before expansion, quality before quantity.

14. **Knowledge compounds.** *(Open — the word itself is a lean, and this rung has the most left to study and ground in sources.)* Cooperation is what humans do — politically, economically, academically — and it runs on shared knowledge; we accept governance together because we hold goals together, and the goals are usually about generating value. What is harmonious in the shared knowledge compounds harmoniously; what is unseen or unspoken compounds too — as cost, and the learning tends to arrive only after the cost has already turned the course. Sometimes the mistake is never even named; it just becomes the circumstance the organisation lives in. Understanding before acting is cheap; remedy after is not. This is the wide ground under rung 13.

15. **Beauty is comprehension.** Beautiful code is in the eye of the beholder: one sees it as beautiful because one understands why it is. Much of a developer's friction — rulings not agreed with, refactors denied, stakeholders unfathomed — is knowledge that never travelled; where the why travels with the work, the work can be beautiful to every party. That is core to this structure's purpose.

## The shape — a hypothesis

*Nothing in this section is ruled or settled. It holds ideas that make sense and are appreciated — that is all they are; we are at the beginning of studying how a knowledge structure is done. Even markdown in this repository is the near-term vehicle, not a given end form — though for the near future, markdown it is.*

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
                     build, how agents behave
  lore/              transferable teaching folds — history of the web, IaC, completion
                     models, the harness, how to approach code you don't understand
  drafts/            proposals, explorations, critiques — not binding
  log/               one dated file per entry: essence, files touched, links
  transcripts/       approved sources; the meeting method lives in its README
```

**Above `product/`** is what flows from above — the gap the first meeting named: the initiative, the goals, the reasons why. The client meeting of 2026-08-19 is its first source, and its topical folds a first sketch of what the fold holds. **`solutions/`** would be the gap that, once filled, makes the code expendable: the architecture as committed, not as aspired to — holding what the code cannot say about itself, not a re-description of it (single source of truth holds for knowledge too). Both hypothetical, names included.

What already stands, distinct from the hypothesis: the GitHub wiki was researched and rejected (no Projects or Figma integration to justify fragmenting) — `wiki/` lives in the monorepo; `transcripts/`, `log/` and `drafts/` exist and carry their practices; directory READMEs only where earned. `process/`, `decisions/`, `horizon/`, `board/`, `people/` were considered and dropped — process is conventions, decisions are log entries lifted into state, the future belongs to a board, personal content compounds as insight and never as profiles.

## The study

What makes a good knowledge structure is still under study — declared rather than assumed, and what we are doing is niche enough that tasting the wider well grounds us. Two studies, run together, both **open to every member** — creative freedom is the rule, and the space for questions, findings and files of one's own is [`study.md`](study.md):

**Outward — how do others do it?** Not only knowledge structure: the question opens onto the human mind. How are things presented engagingly; how do stories carry comprehension; how do encyclopedias ground claims; what does spec-based development actually name. Proposed areas and the questions the principles stand with are seeded in `study.md` — all of it marked very open.

**Inward — what do we hold?** Mapping the breadth of our own knowledge: the sources (transcripts, the repo's markdown, Projects, Figma, the Teams chat, the verbal), and the outcomes we want from the structure — with the roles and audiences each outcome implies. A width we do not yet comprehend; kept unsettled. Reflection on the outward study happens against this map: what does a finding mean *for us*.

## From here

No grand plan past the study — we will stand on different insight then. The goals that steer meanwhile:

- **The client starts using the product** — the highest delivery goal. The product is built and not in use, and onboarding is itself a process of knowledge: meetings, workshops, an exchange in both directions, since our understanding of how they work is also lacking. The knowledge structure is not a strict prerequisite for this, but it is the preferred path — preferably we meet, collect, understand, and hand them understanding that helps them onboard.
- **We start fresh.** Nothing of the solution we have is ruled; with no knowledge structure around it, the code is treated as an artifact. We approach this as the beginning of a project that happens to come with a product ready to use. It may be the product fits what we learn together and is used as it stands; more likely the insight compounds into new plans for where development time goes.

Where we are: four meetings through the method, approval pending; principles grounded 2026-08-21; the study opening.

## The board

*Tasks with the insight behind them, one line each. Openness already marked in place above is not restated here.*

- **Approval of the four transcripts** — peer review in the PR; the client meeting first.
- **Ingest the client meeting** once approved — first content for the fold above product; its plan items (education days, admin access for Samir, the next meeting) feed the client goal above.
- **The study** — questions and findings into [`study.md`](study.md); free exploration. First outward pass done: [`chart.md`](chart.md), eleven territories with eight proposals to the ladder.
- **The code** — [`code.md`](code.md), brought in 2026-08-25 from the sister project OpenLight, where our ladder and chart were inputs. It proposes to replace the fifteen rungs with two values, eight facts and six principles, plus a method, tests with named runners, and an open list. *Proposed there, binding on nothing here* — the team works it over, and whether it supersedes this draft's principles is ours to rule.
- **Map what we hold** — the inward study's first act.
- **Jona** — proposal to the client for the coming meetings and goals.
- After a disposition exists: root `README.md` becomes purpose and entry only; `GUIDELINES.md` and the three technical READMEs redistribute.
- Not ruled, parked: where transcripts live (this public repo vs a separate one); the wiki's language (English) against a Swedish client; Figma as a linkable source of design truth; whether working sessions are transcribed (lean: yes, under the working-session rule); the ball (see `transcripts/README.md`).
