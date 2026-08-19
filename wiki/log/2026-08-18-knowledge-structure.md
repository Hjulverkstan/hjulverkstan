# 2026-08-18 — The knowledge structure takes shape

Sessions two and three, in dialog with Jona, bootstrapped on the two intro transcripts. What was decided is state, in [`drafts/knowledge-structure.md`](../drafts/knowledge-structure.md), [`AGENTS.md`](../../AGENTS.md) and [`transcripts/README.md`](../transcripts/README.md); this entry holds only what those don't.

**Ruled:** the GitHub wiki is out; the structure lives in the monorepo as `wiki/` (was `md/`). Root `README.md` is the entry, `AGENTS.md` the agent-agnostic bootstrap with the one-memory rule. Directories `product/ conventions/ lore/ drafts/ log/ transcripts/`. Log: one file per entry, knowledge-structure scope, essence only. Work moved to `feature/knowledge-structure` off `main`; old test-branch wip deleted.

**Insight worth keeping:** the transcript method converged only once two rules were explicit — the checker flags *knowledge, not wording*, and the writer *digests the fold rather than sequencing the speech*. Without the first, a suspicious checker flags tone and the rewrite restores wording (part 1 swung 60% → 87% of the clean before the rule); without the second, sentences tighten but the fold still walks the speaker's path (part 2 at 69% until rewritten whole to 55%). Both rules are in the README now. Second insight: the same lesson applies one level up — content is not poured into `conventions/` before its disposition exists; and the disposition cannot be drafted without the content in view. Study of what makes a good structure, and drafting the disposition from what we actually hold, run together; hence the declared phases.

**Adopted from Jona's `night` project:** README as reading-order entry, *a question is not a work order*, *mark openness in place*, `drafts/` as the unruled workspace, the memory pointer pattern.

**Left open:** see *Open threads* and *Held open* in the draft — approval of the intro transcripts and its mechanism, the Projects sync, Figma, the study phase.

**Files:** `AGENTS.md`, `README.md` (Knowledge section), `.gitignore` · `wiki/drafts/knowledge-structure.md` · `wiki/transcripts/README.md`, `mishearings.md`, `2026-08-17-intro-pt1.md`, `-pt2.md` (written and checked; `.raw/` gitignored holds cleans and reports) · `wiki/log/README.md`, this entry, `2026-08-18-intro-transcripts.md`.
