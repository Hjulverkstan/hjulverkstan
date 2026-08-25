# The chart — the planet around us

*Draft, very open. A first survey of the country our questions already live in: eleven territories, tasted in one pass on 2026-08-23 by a fleet of agents working in parallel — one per territory, each briefed with the fifteen-rung ladder and told to hunt contradictions rather than confirmations. Nothing here is ruled. It is a chart in the navigator's sense: enough coastline to steer by, drawn fast, with soundings someone else will have to take again. It belongs to [`study.md`](study.md) as the outward half's first return, and it reads against [`knowledge-structure.md`](knowledge-structure.md).*

*__Status of the ground.__ Every source below is as the fleet returned it — gathered in one pass, **not yet followed by a human head**. Treat each link as a lead, not as ground, until someone has read it. Two claims are already flagged as things not to cite; there are likely more.*

## What the survey found

Eleven territories were asked the same question and eight of them answered it the same way. That convergence, not any single territory, is what the chart is for.

### The ladder's most-contradicted rung is *one fact, one home*

Four territories that share no lineage push against rung 4 in the same direction. Diátaxis sorts documentation by reader need — tutorial, how-to, reference, explanation — and holds that the four must never be blended in one page; the same fact therefore appears in four forms, because the *need*, not the fact, owns the page. Wikipedia's summary style has the parent hold a précis and the child hold the depth, both stating the facts, and names the bill it accepts: synchronization must be maintained. Luhmann filed one concept at two addresses on purpose. Bruner's spiral curriculum requires the same material at increasing depth or the reader never climbs — under a strict rung 4 the shallow encounter has no legal home, gets deleted, and the wiki reads correctly while teaching nothing.

One territory defends the rung harder than we do. Cognitive load theory's **redundancy effect** finds that repeating information in a second form measurably *hurts* learning — though Sweller's own 2019 retrospective gates that effect on high element interactivity; where interactivity is low, redundancy and split-attention effects vanish. So the science does not simply back the spiral either. The disagreement is real and lives inside the evidence, not between us and it.

Two reconciliations came back independently and are worth more than the quarrel. From pedagogy: redundancy **across levels** is spiral, redundancy **within** a level is drift — which turns rung 4 into a rule with an axis rather than a flat prohibition. From the slip-box: one home is a claim about **authorship**, not about **reachability** — one fold owns the fact, many paths reach it. Knuth's is the sharpest of the three: where a fact must appear twice, the second copy should be **derived**, not adjudicated. Tangle it, don't retype it.

### *Written whole* is a human rung being asked to do a machine's job

Rung 11 comes under fire from the one direction we cannot argue with, which is measurement. Chroma's 2025 context-rot work reports that models do **better on shuffled haystacks than on logically structured ones** — coherent narrative flow, the very thing "written whole" and "beauty is comprehension" optimise for, interferes with extraction. Every spec-driven tool that actually works bets the other way too: Tessl enforces one spec per code file, Kiro loads a fold only when you touch a matching path. Wikipedia's maintenance templates are patching *on purpose*, made safe by the fact that the tag is dated, machine-readable, and enters a queue. And Nygard is categorical in the opposite direction from us: an accepted decision record is **never** edited, because rewriting destroys the history that makes the decision legible.

None of this kills rung 11. It scopes it. The rung is right for the fold that carries current state and wrong for the registers whose value *is* their history — the log, and decisions if we ever keep them separately. Those are append-and-supersede.

### Rung 1's equation holds in direction and breaks in quantity

The ground floor — a person's comprehension and an agent's context window are one limitation — survives, but not as an equation.

On the human side, Miller's seven is rhetorical; Cowan's 2001 reconsideration puts the uncontaminated limit at about **four chunks**. Chunking is the only escape, and Chase and Simon's chess result shows what chunking is: masters out-recall novices on real board positions and lose the advantage entirely on random ones. Expertise is stored structure, not larger memory.

On the agent side the shape of the limit is different. Degradation is not graceful: eighteen frontier models degrade at *every* increment of length, well below their stated limits, and RULER finds only about half of models claiming 32k actually hold up at 32k. Position matters in a way it does not for a person — the lost-in-the-middle curve is **U-shaped**, strong at head and tail, weak in between.

And three asymmetries break the analogy outright. An agent re-reads for free and has perfect recall of what is in the window; a person forgets and cannot re-read the room. A person chunks; a token budget does not — which raises the sharpest question the fleet returned: *is a fold header the agent's only chunking mechanism, rather than a convenience?* A person has apprenticeship; an agent has none.

The useful restatement: both readers are bounded, bounded differently, and what they share is not capacity but **retrieval cost**. Rung 2 serves both without amendment — a fold *is* progressive disclosure, and the reason it beats one long file is that degradation is driven by length. Rung 3 partly forks: for an agent, "purpose first, gates last" turns out to be accidentally optimal because it front-loads *and* tail-loads, and the real instruction is that the middle of a long file is where claims go to die.

### Nesting is not free, and there are numbers

The question the study asked — how deep can knowledge nest before navigation costs more than it saves — has forty years of menu research behind it, and the answer is shallower than we would guess. Miller's 1981 study of 64 targets across 64¹, 8², 4³ and 2⁶ found search time a U-curve **minimised at two levels of eight**. Kiger replicated it in 1984; Larson and Czerwinski found in 1998 that 16×32 and 32×16 beat 8×8×8, so depth hurts even at three levels. What modulates it is not shape but **scent**: hierarchies of identical shape performed differently purely on the quality of their top-level labels.

That gives us a number to hold: two levels, at most three, breadth over depth, and every index entry judged by whether a reader can pick the right child from the label alone. It also warns rung 2 — nesting is a cost the fold must earn, for a person traversing directories and for an agent burning turns doing the same.

### Everything that scaled has a closed status vocabulary and someone working the queue

Rung 8 says a claim carries its ground and its status, and we currently mark status in prose — *Open*, *Lean*, *Held open*. Every surviving practice closes the set instead. ADRs run Proposed / Accepted / Superseded-by-*id*, with the superseded record kept. RFC 2119 fixes MUST and SHOULD. EARS fixes `WHEN <trigger>, the <system> SHALL <response>`. Wikipedia's markers carry a date and auto-file the page into a tracking category. The point is not ceremony; it is that a closed set is **listable by a script** and prose is not — drift becomes countable rather than felt.

The other half of that lesson is harsher. Wikipedia's machinery only works because people work the backlog, and the backlog is 604,000-plus pages carrying at least one *citation needed*. The 1990s knowledge-repository wave died of exactly this — stale, write-only, unread. A marker with no owner is a promise to nobody.

### The ladder has no rung for enforcement, and this is the gap the chart is loudest about

Our bar is that an agent could rebuild the front end from the wiki alone. Nobody runs that test. The spec-driven territory returns the same hole from three directions: the spec has no compiler; Böckeler found agents generating duplicate classes *while* the spec documented the existing ones; and docs-in-repo does not force updates, since code and doc diverge happily inside a single commit range. Drift needs a check, not a location — rung 5 currently names the location.

Two cheap checks came back worth taking seriously. One is mechanical: an `analyze`-style pass that cross-checks folds for contradictions and orphaned references before a merge, plus link-checking on `wiki/**`. The other is the bar itself, run as an exercise rather than held as an aspiration — hand a blank agent one bounded, real task with only the wiki, and see what happens. The tacit territory arrives at the same instrument from the opposite tradition and calls it legitimate peripheral participation.

### The first thing a newcomer meets is a task, not a document

Steinmacher's barrier taxonomy for open-source newcomers finds the dominant barriers are *finding a way to start* and *getting a response* — not missing documentation. Response latency predicts newcomer success better than issue content does. Google Summer of Code and Outreachy exist because written knowledge plateaus and a mentor supplies the rest.

This contradicts rung 6 from the human side, and the tacit lineage contradicts it from the theoretical one: SECI's socialization mode — tacit to tacit, by shared work — contains no document at all. Human onboarding is *deliberately* unequal: buddies, mentors, staged ladders. Agents genuinely start blank; people do not, and writing as though they did over-serves the agent and under-serves the mechanic in Backa. Rung 6 is a rule about **agents and private context**, which is what it was minted for; it should not be read as a claim about how people learn.

### Rung 14 can be grounded, and one of its likely citations should be retired

The rung we marked as needing the most grounding turns out to have solid ground available — just not where the folklore points. **Absorptive capacity** (Cohen and Levinthal, 1990) is literal compounding: what an organisation can recognise, assimilate and exploit next is a function of the related knowledge it already holds. **Romer's 1990** treatment of knowledge as a non-rival good with increasing returns is the economic half — it is the argument for writing a thing once, in the open, where its return scales with readership rather than with effort.

What must *not* be cited: the 1:10:100 defect-cost ratio and the "100x in production" figure attributed to an *IBM Systems Sciences Institute* study. Bossavit traced it and there is no such published research — a leprechaun, repeated into fact. Boehm's cost-of-change curve replicates in direction but not in shape or steepness. NIST's $59.5B and the CHAOS percentages are rhetoric; Eveleens and Verhoef took the latter apart in 2010.

That bites our current wording. *"Understanding before acting is cheap; remedy after is not"* reads as a 1:10:100 echo, and the honest replacement is Cunningham's own framing of the debt metaphor he minted — debt is **deferred consolidation**, first-time code written with immature understanding, and *"every minute spent on not-quite-right code counts as interest on that debt."* The strongest claim available to rung 14 is about **capacity**, not about ratios.

## The territories

Eleven folds, each as the fleet returned it, trimmed. What a territory says that the section above already carries is not repeated here.

### Spec-driven development

A 2025–26 family of practices where a written spec, not code, is the durable artifact an agent works from. Kiro fixes a triad per feature — `requirements.md` (user stories plus EARS acceptance criteria), `design.md`, `tasks.md`, each task traced to a numbered requirement — under a steering layer (`product.md`, `tech.md`, `structure.md`) whose front matter declares its inclusion mode: `always`, `fileMatch` with a glob, `manual`, or `auto`. GitHub's Spec Kit runs nine commands — constitution, specify, clarify, plan, checklist, tasks, analyze, implement, converge — of which `clarify` forces questions before planning and `analyze` cross-checks spec against plan against tasks for drift. The lineage runs back through formal specification, RFC 2119, EARS (Rolls-Royce, RE'09) and Nygard's ADRs.

**Says to the ladder.** Sharpens rung 7: SDD splits hardened state into *three* lifetimes — requirements change with the customer, design with the architecture, tasks die on merge — which suggests our single word *spec* is under-resolved, and that a task list must not share a fold with a spec. Contradicts rung 11 by betting on mechanical scoping rather than prose coherence to stay inside a window. Contradicts rung 3 at the requirement level: EARS is deliberately *gate-first*, because the aerospace failure mode is a reader acting on a requirement without its precondition. Our ordering rule may be right for entries and wrong for testable claims.

**Steal.** Front-matter inclusion modes on each fold, making "which fold does an agent load when" machine-readable. EARS grammar for any wiki claim that is testable. The ADR status set as a closed vocabulary with ids, which gives rung 9 an address scheme for free. An `analyze`-style consistency pass before merge.

**Costs.** Eberhardt measured Spec Kit producing 2,577 lines of markdown and 689 lines of code in 33 minutes plus **3.5 hours of review**, against 8 minutes and 24 minutes of review for iterative prompting — roughly tenfold. Böckeler found neither Kiro nor Spec Kit has a size dial: a simple bug fix became four user stories and sixteen acceptance criteria; a 3–5 point story generated eight files. A volunteer-staffed project cannot absorb that, and a wiki that mandates a triad per change will strangle small contributions. Spec rot is the named, unsolved failure.

**Ground.** [Böckeler, *Understanding Spec-Driven Development*](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) · [Eberhardt, *Putting Spec Kit Through Its Paces*](https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html) · [Kiro steering](https://kiro.dev/docs/steering/) and [specs](https://kiro.dev/docs/specs/) · [Spec Kit reference](https://github.github.com/spec-kit/reference/overview.html) · [Mavin, EARS](https://alistairmavin.com/ears/) · [Nygard, *Documenting Architecture Decisions*](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions.html) · [Brooker, *SDD isn't Waterfall*](https://brooker.co.za/blog/2026/04/09/waterfall-vs-spec.html).

**Open.** Does *written whole* survive the wiki growing past what one rewrite can hold — is there a size ceiling we have not found? And if our bar is rebuild-from-the-wiki, what is the cheap recurring test, and who runs it given that every session starts blank?

### Docs-as-code and documentation systems

Diátaxis sorts every page by two questions — action or cognition, acquisition or application — into tutorial, how-to, reference, explanation, and forbids blending them: "a clinical manual that conflated education with practice… would be a literally deadly document." It insists on being used iteratively, never as a plan: pick one paragraph, one change, publish immediately. GitLab's handbook is the scale case — roughly 605,000 words and 2,000+ pages, public, edited by merge request, handbook-first ("document the solution first, *then* announce"), with the submitter/approver split doing the governing. Shape Up is the opposite pole: one bounded pitch with five fixed slots — Problem, Appetite, Solution, Rabbit holes, No-gos — and no backlog at all.

**Says to the ladder.** Contradicts rungs 2 and 3 together: our fold, "readable on its own, purpose first, gates last," is a page blending explanation, how-to and reference — a Diátaxis violation by construction. Either we defend that or a fold becomes a small directory of typed files behind one entry. Contradicts rungs 9 and 10 from Shape Up's side, where ideas that nobody re-raises are allowed to die and that is called a feature. Sharpens rung 11: "small steps, publish immediately" is rung 11 at low cost. And GitLab is rung 1's cautionary tale — 2,000 pages forced a split into Handbook and Company Handbook, because single-source-of-truth scales past any single head.

**Steal.** Link-checking and a prose linter as blocking CI on `wiki/**`, with `CODEOWNERS` over it. Freshness derived from `git log -1 --format=%cs` at build rather than hand-typed. The compass as a review question on every page: which of the four is this, and does it drift? Shape Up's five slots as the fixed template for `drafts/`.

**Costs.** GitLab's exhaustiveness turns comprehension into search. Docs-in-repo does not force updates. An unruled linter becomes noise reviewers learn to skip.

**Ground.** [Diátaxis](https://diataxis.fr/) · [the compass](https://diataxis.fr/compass/) · [how to use it](https://diataxis.fr/how-to-use-diataxis/) · [tutorials vs how-to](https://diataxis.fr/tutorials-how-to/) · [GitLab handbook-first](https://handbook.gitlab.com/handbook/company/culture/all-remote/handbook-first/) · [the handbook by numbers](https://about.gitlab.com/blog/the-gitlab-handbook-by-numbers/) · [Shape Up, *Write the Pitch*](https://basecamp.com/shapeup/1.5-chapter-06).

**Open.** If a fold must be one readable unit and Diátaxis says one page cannot serve four needs, does the fold become a directory of four typed files with an entry — and does "purpose first" then live only in that entry?

### Encyclopedic practice

Wikipedia governs some seven million articles written by strangers with no editorial hierarchy, using written policy in place of trust. Verifiability puts the burden on whoever adds material, satisfied by one inline citation that *directly supports* the contribution. No original research bans A + B ⇒ C even when A and B are each sourced. Status is marked in the text, dated, and auto-filed into a tracking category. Summary style pushes depth into a child that is "a complete encyclopedic article in its own right," with a split trigger around 50 kB of readable prose. The lead must stand alone and explicitly must not "hint at startling facts without describing them." Quality is graded on the talk page — stub, start, C, B, GA, A, FA — and the distribution is its own lesson: 4.0M stubs, 2.9M start, 52,669 GA, 9,191 FA.

**Says to the ladder.** Sharpens rung 2 with a rule we lack: the child must link **back up** and restate enough context to stand alone — entry from above is not sufficient, the fold must know its parent. Contradicts rung 4 (above). Sharpens rung 8 with a warning: the 2012 RfC deliberately removed "verifiability, not truth" from the policy's first sentence after it was weaponised to defend sourced falsehoods. Ground is a floor, never a substitute for being right. Sharpens rung 9 — the talk page is a *sibling of the article*, one per page, not a central tracker. Address means adjacency.

**Steal.** Dated status markers a script can list. A `main:` pointer at the top of a fold's section and a required up-link in the child. A lead rule: every page opens with a paragraph that stands alone, no teasing. A maturity grade in front matter, self-assigned, upgraded only by review.

**Costs.** The backlog is the cost — 604,000+ pages tagged, ~58,500 articles entirely unreferenced when the June 2025 drive began, ending at 49,028. Active English editors peaked around 2007 and roughly halved by 2013, with quality-control friction implicated. At our scale, take two markers, not twenty.

**Ground.** [WP:V](https://en.wikipedia.org/wiki/Wikipedia:Verifiability) · [the 2012 RfC](https://en.wikipedia.org/wiki/Wikipedia:Verifiability/2012_RfC) · [WP:NOR](https://en.wikipedia.org/wiki/Wikipedia:No_original_research) · [WP:SUMMARY](https://en.wikipedia.org/wiki/Wikipedia:Summary_style) · [content assessment](https://en.wikipedia.org/wiki/Wikipedia:Content_assessment) · [MOS:LEAD](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Lead_section) · [the 2025 backlog drive](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_Unreferenced_articles/Backlog_drives/June_2025).

**Open.** Maintenance tags work only because someone works the queue. Who works ours — and if the answer is "an agent, each session," does that dissolve Wikipedia's failure mode or merely move it?

### Zettelkasten and linked notes

Luhmann's roughly 90,000 slips over forty years, entered not through a table of contents but through a **keyword register** — "truly just a map for his Zettelkasten to find a useful entrance." Folgezettel ids (`21/3d7a6`) branch *beside* a note rather than after it, so a new branch never renumbers its neighbours. Ahrens fixes atomicity — one idea per note, in your own words, on the argument that if you cannot summarise it concisely you do not understand it — and reframes the filing question from "under which topic do I store this" to "in which context will I want to stumble on it again." Matuschak adds density: links are made by hand because finding them forces re-reading, so the linking *is* the review pass.

**Says to the ladder.** Contradicts the whole top-down frame: an up-front hierarchy "prematurely constrains what may emerge," and categories that want to exist stay invisible because content is already sorted. The counter-move is not to abandon the tree but to let a region stay unsorted until a map of it is *earned*. Sharpens rung 11: the Folgezettel id is a mechanism that makes appending safe — their "branch beside it" and our "rewrite the fold" are two answers to the same problem, growth without breaking neighbours. Confirms rung 3 by its own failure: a network resists reading order, which is exactly why a stranger cannot be onboarded into someone else's slip-box.

**Steal.** A keyword register kept separate from the fold tree — term to addresses, many per term. Cheap, greppable, and it restores many-path access without duplicating a fact. Immutable fold addresses, so links and log entries survive restructuring. The in-your-own-words gate as an admission test (rung 13). Explicit stubs: "it's very freeing to be able to link to a stub" — a named, empty fold is a legal, visible unknown.

**Costs.** The collector's fallacy — "to know about something isn't the same as knowing something"; a wiki can grow while comprehension does not. Graph views stop being useful past a few hundred notes; don't build one. Shared slip-boxes have a poor record, working only for teams already fluent in the content — the opposite of a blank session.

**Ground.** [Matuschak, *Prefer associative ontologies to hierarchical taxonomies*](https://notes.andymatuschak.org/Prefer_associative_ontologies_to_hierarchical_taxonomies) · [*Evergreen notes should be densely linked*](https://notes.andymatuschak.org/Evergreen_notes_should_be_densely_linked) · [*No, Luhmann Was Not About Folgezettel*](https://zettelkasten.de/posts/luhmann-folgezettel-truth/) · [Niklas Luhmann-Archiv](https://niklas-luhmann-archiv.de/bestand/zettelkasten/tutorial) · [*The Collector's Fallacy*](https://zettelkasten.de/posts/collectors-fallacy/) · [Maps of Content](https://obsidian.rocks/maps-of-content-effortless-organization-for-notes/).

**Open.** Is there a place where a region should be allowed to stay unsorted until its shape shows — and what marks a fold as *not yet placed* without violating rung 8?

### Storytelling and pedagogy

The empirical study of how a bounded head takes on knowledge. An **advance organizer** — a short passage that is *more abstract* than the material, read before it — raised retention by roughly half a standard deviation in Ausubel's 1960 experiment; a summary at the same grain does nothing. **Scaffolding** names six tutor functions, with *fading* as the learner gains competence. **Worked examples** cut learning time about sixfold and errors to about a fifth, but the gain did not survive modest variation in the test problems. **Narrative beats expository text** at Hedges *g* = 0.55 overall, 0.72 for memory, across 78 samples and 33,078 participants. Minto's SCQA — situation, complication, question, answer — puts the answer at the top node and makes everything below it visible support. Loewenstein's information-gap account says curiosity fires on a *salient* gap, which makes naming what you don't know a device rather than an apology.

**Says to the ladder.** Contradicts rung 4 (above). Contradicts rung 3's *single* order: the expertise-reversal effect shows guidance that helps a novice actively degrades an expert's performance, as redundancy — so there is no one correct entry order, there is one per expertise level, and a returning reader is a different reader. Sharpens rung 15 with a number: story form is a measured half-SD comprehension gain that an encyclopedic register throws away.

**Steal.** Open every fold with an Ausubel organizer — more abstract than the body, never a table of contents. SCQA for entries. An explicit level axis — orientation, working, reference — orthogonal to rung 4, letting a fact appear once per level: redundancy across levels is spiral, within a level is drift. Open hard folds by naming the gap, which doubles as rung 9's address.

**Costs.** Do not fork prose into novice and expert versions; expertise reversal is real but audience-forked text multiplies exactly the drift surface rung 5 exists to prevent — fade with ordering and skippability instead. Narrativising a spec costs precision, because story gains come partly from causal inference, which is the ambiguity an agent rebuilding a front end cannot afford. Keep story in entries and rationale; keep gates expository. And an example-heavy wiki teaches the example, not the rule.

**Ground.** [Ausubel 1960](https://www.scirp.org/reference/referencespapers?referenceid=1055694) · [Wood, Bruner & Ross 1976](https://acamh.onlinelibrary.wiley.com/doi/10.1111/j.1469-7610.1976.tb00381.x) · [Mar et al. 2021 meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC8219577/) · [Kalyuga et al. 2003, expertise reversal](https://www.tandfonline.com/doi/abs/10.1207/S15326985EP3801_4) · [Sweller & Cooper 1985](https://www.tandfonline.com/doi/abs/10.1207/s1532690xci0201_3) · [Loewenstein 1994](https://www.scirp.org/reference/referencespapers?referenceid=2828034) · [Bruner, *The Process of Education*](https://www.academia.edu/143602365/Bruner_JS_The_Process_of_Education_1960_1977).

**Open.** Is the wiki a curriculum or a reference? Rungs 4 and 11 answer *reference*; rungs 3 and 15 answer *curriculum*. The level axis is a truce, not a resolution — do we want it to teach, or only to specify?

### Literate programming and the boundary against code

Knuth's 1984 inversion: "Instead of imagining that our main task is to instruct a computer what to do, let us concentrate rather on explaining to human beings what we want a computer to do." One WEB source is the truth; `TANGLE` extracts the compilable program and `WEAVE` the typeset document, so code and prose cannot desync — duplication is impossible by construction rather than by discipline. Essentially nobody adopted it. Parnas and Clements' 1986 answer to the same problem is a boundary drawn by **work product**: the requirements document "should contain everything you need to know to write software that is acceptable to the customer, **and no more**," every statement valid for all acceptable products, none depending on an implementation decision — plus a **Likely Changes** section, because "programmers should not have to decide which changes are most likely." Nygard's ADR fixes five headings, monotonic never-reused numbers, and immutability by supersession. Ousterhout supplies the local rule: comments describe what is *not* obvious from the code, and *Comment Repeats Code* is the named smell.

**Says to the ladder.** Answers the study's boundary question crisply: **prose owns why and forces; code owns what and how; prose restating what code says is a defect, not redundancy.** Reframes rung 4 — the question is not which single place holds a fact but whether the second copy can be *derived*. Contradicts rung 11 at the decision layer, where rewriting destroys the legibility it is meant to protect. Sharpens rung 3 with Parnas's "fake it": presenting a design as if rationally derived is honest, not deceptive — the entry is a reference document, not the story of how we got there.

**Steal.** Nygard's ADRs verbatim. A **Likely Changes** section in each spec fold, so an agent need not guess what to make flexible. The tangle discipline where cheap — generate route tables, env vars, component props and API shapes from code rather than hand-writing them. The "and no more" test as a fold's acceptance criterion.

**Costs.** Do not attempt literate programming proper; it died of parallel maintenance and dead output. Notebooks are the cautionary descendant — of 1.4M GitHub notebooks studied, about 24% executed without error and about 4% reproduced their outputs. Narrative plus code without enforced execution rots as fast as comments.

**Ground.** [Knuth, *Literate Programming* (1984)](https://www.cs.tufts.edu/~nr/cs257/archive/literate-programming/01-knuth-lp.pdf) · [Parnas & Clements, *How and Why to Fake It*](https://users.ece.utexas.edu/~perry/education/SE-Intro/fakeit.pdf) · [Nygard, ADRs](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions.html) · [Akkartik, *Knuth is doing it wrong*](http://akkartik.name/post/literate-programming) · [Pimentel et al., MSR 2019](https://dblp.org/rec/conf/msr/PimentelMBF19.html).

**Open.** Which wiki facts are *derivable* from the repo? Every one that is should be tangled rather than written — but a generated fold needs a home, and generated folds break "written whole." And if ADRs are append-and-supersede while spec folds are rewritten whole, what carries a decision's why into the rewritten spec — a reference, or a restatement that will drift?

### Tacit and explicit knowledge

Polanyi's "we can know more than we can tell" (1966) — you recognise a face among a thousand and cannot say how. Nonaka and Takeuchi's SECI spiral built a discipline on converting tacit to explicit; its socialization mode, tacit to tacit through shared work, contains **no document**. The critics are the interesting half: Gourlay (2006) found none of the four modes survive empirical scrutiny in a way simpler explanations don't cover, and Tsoukas argues the dichotomy misreads Polanyi — tacit knowledge "cannot be captured, translated, or converted, but only displayed, manifested, in what we do," so the move is not conversion but re-punctuating distinctions through instructive talk. Hansen, Nohria and Tierney's 1999 finding is the practical one: pick codification or personalization at roughly 80/20; straddling both is the documented failure mode.

**Says to the ladder.** Contradicts rungs 5 and 10 at their root. Both assume all knowledge *can* be tracked; if a residue provably cannot, forcing it into prose does not preserve it — it destroys it and leaves a confident, wrong page. Losing tacit knowledge silently may be the condition rather than a bug. Sharpens rung 8: a claim should carry whether it is even the kind of thing writing can hold — which generalises rung 12 from feelings to *skill*. Confirms rung 11 against rung 5: prose is not modular precisely because it externalises a whole judgment, and patching is the codification instinct leaking back in.

**Steal.** A short register per area of what is deliberately **not** written and who holds it — names, not prose — making the unwritten addressable without pretending to capture it. Hansen's 80/20 declared in the wiki's own entry, so the boundary is a decision rather than an omission. Treat transcripts as socialization traces rather than ore to be mined dry — a recording of two people working is displayed tacit knowledge, and it belongs precisely because it resists summary.

**Costs.** The 1990s repository wave died of staleness and write-only usage; a wiki whose completeness bar is "rebuild everything" has that wave's exact shape. The write/read asymmetry pays only where read-count is high, and at a small volunteer workshop some folds will never be read enough to repay writing them. Don't import the SECI spiral as a process — it is weakly supported.

**Ground.** [Polanyi's paradox](https://en.wikipedia.org/wiki/Polanyi%27s_paradox) · [Tsoukas, *Do we really understand tacit knowledge?*](https://www.academia.edu/81204355/Do_we_really_understand_tacit_knowledge) · [Gourlay 2006](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-6486.2006.00637.x) · [SECI overview](https://ascnhighered.org/ASCN/change_theories/collection/seci.html) · [Lave & Wenger, communities of practice](https://infed.org/dir/welcome/jean-lave-etienne-wenger-and-communities-of-practice/) · [Hansen et al., HBR 1999](https://pubmed.ncbi.nlm.nih.gov/10387767/).

**Open.** What is our test for "this cannot be written"? Without one, rung 5 will quietly absorb every judgment call into confident, unfalsifiable prose.

### How agents read

Context engineering treats the window as a budget, and the repo not as a document to be read through but as a retrieval surface entered at a named point, descended into on demand, discarded per session. `AGENTS.md` was formalised across vendors in August 2025 and the community rule is short and imperative — tens of lines, command-first, a line added only when the agent got it wrong twice. Anthropic's framing is progressive disclosure and just-in-time retrieval: ship **identifiers**, not contents, and let the agent load at runtime; compact, take structured notes outside the window, and delegate exploration to sub-agents whose searching never enters the lead context.

**Says to the ladder.** Confirms rung 2 mechanically — a fold *is* progressive disclosure, and it beats one long file because degradation is length-driven. Sharpens and half-contradicts rung 3 (the U-curve, above). Contradicts rungs 11 and 15 with the shuffled-haystack result. Loosens rung 1's equation (above). And it puts a crack in rung 6: compaction and memory tools make a session non-blank in practice, and compaction is lossy in a way that quietly violates rung 10 — a compacted session cannot honestly claim nothing was lost.

**Steal.** A root `AGENTS.md` that is a **map of folds** — paths plus one clause each — and never content. Front-load and tail-load every entry: purpose in the opening lines, gates in the closing ones, exposition in the middle where the model reads worst. Stable heading anchors and greppable claim markers, so a question has a retrievable address. Delegate wiki-wide sweeps to sub-agents and keep the searching out of the main context.

**Costs.** Skip `llms.txt` — no major provider consumes it. Do not optimise prose for shuffled-haystack retrieval; it would wreck it for people.

**Ground.** [Liu et al., *Lost in the Middle* (TACL 2024)](https://cs.stanford.edu/~nfliu/papers/lost-in-the-middle.arxiv2023.pdf) · [Chroma, *Context Rot* (2025)](https://www.trychroma.com/research/context-rot) · [Anthropic, *Effective context engineering for AI agents*](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [*Writing effective tools for agents*](https://www.anthropic.com/engineering/writing-tools-for-agents) · [RULER (Hsieh et al., COLM 2024)](https://arxiv.org/html/2404.06654v1) · [agents.md](https://agents.md/).

**Open.** If narrative coherence measurably hurts agent extraction, does a fold need two renderings — prose for people, a flattened claim list for agents — and does that break rung 4?

### Bounded heads

Covered above as a finding; the territory's own shape is the numbers. Cowan's ~4 chunks against Miller's rhetorical seven. Chunking as stored structure, not capacity. Cognitive load split into intrinsic, extraneous and germane, with extraneous load stealing capacity from intrinsic and intrinsic unchangeable without changing the material — which is an argument for splitting a fold by **element interactivity**, keeping in one place what must be understood together. And the depth-breadth numbers: two levels of eight as the measured optimum, breadth beating depth even at three levels, with label scent doing more work than shape.

**Costs and cautions.** Drop "7±2" as a justification for anything — it is the canonical abused number, as is Dunbar's 150, whose confidence intervals span roughly 16 to 109 and support no cognitive limit. Do not infer per-page item counts from working-memory capacity: menus of 32 outperform menus of 8 where scent is good. Breadth assumes a scannable index; without one it degrades into linear search.

**Ground.** [Cowan 2001](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/44023F1147D4A1D44BDC0AD226838496/S0140525X01003922a.pdf/the-magical-number-4-in-short-term-memory-a-reconsideration-of-mental-storage-capacity.pdf) · [Miller 1981, depth/breadth](https://journals.sagepub.com/doi/10.1177/107118138102500179) · [Larson & Czerwinski, CHI '98](https://dl.acm.org/doi/10.1145/274644.274649) · [Sweller et al. 2019](https://link.springer.com/article/10.1007/s10648-019-09465-5) · [Lindenfors et al. 2021 on Dunbar's number](https://pmc.ncbi.nlm.nih.gov/articles/PMC8103230/). Chase & Simon 1973 is cited from memory and *unverified* — check before quoting.

**Open.** Does an agent chunk at all, or is its only analogue the summary we write for it — making fold headers the chunking mechanism rather than a convenience? And does the redundancy effect apply to agents, who may benefit from restatement; if not, do people and agents want incompatible wikis?

### Onboarding in the wild

Covered above as a finding. The mechanics worth keeping: Kubernetes as the worked example of a routing entry — `CONTRIBUTING.md` to a contributor guide to SIG-specific docs, with roles encoded in machine-readable `OWNERS` files — a small entry doc that **dispatches and never explains**. Curated first tasks work only when paired with a person: task recommendation alone was found insufficient, and median time to a first expert comment sits around eight and a half hours in the largest study the fleet found. Corporate practice measures the ramp — time to first commit, time to tenth — and pairs a buddy with it.

**Steal.** A `first-tasks/` fold of five to eight bounded, pre-scoped jobs with a named owner and an expected diff. A routing entry that dispatches. Machine-readable ownership per fold, giving rung 9 a real address. And measure it: time to first merged change, for the next human and the next agent.

**Costs.** Don't import contributor tiers — fifteen rungs plus a role ladder is ceremony for a team this size. And don't assume the wiki serves the mechanics: their onboarding is demonstration and task cards, in Swedish, and it is a different artifact.

**Ground.** [Steinmacher et al., barriers faced by newcomers](https://www.ime.usp.br/~gerosa/papers/Steinmacher2014_Chapter_BarriersFacedByNewcomersToOpen.pdf) · [the IST systematic review](https://www.sciencedirect.com/science/article/abs/pii/S0950584914002390) · [*Is it Enough to Recommend Tasks to Newcomers?* (ICSE 2023)](https://dl.acm.org/doi/abs/10.1109/ICSE48619.2023.00064) · [GSoC motivations and contributions](https://arxiv.org/pdf/1910.05798).

**Open.** Can one corpus serve a blank agent, which needs exhaustive, and a tired person, who needs a route — or does that force a thin routing layer over a thick `wiki/`? And what is our first task, with whom on the hook to answer within a day?

### Compounding

Covered above as a finding, and it is the territory where the chart most changes what the ladder should *say*. The solid ground is absorptive capacity and non-rivalry; the contested ground is Boehm's curve in shape; the folklore is 1:10:100 and the IBM Systems Sciences Institute study that does not exist. Fowler's debt quadrant — deliberate against inadvertent, prudent against reckless — offers a ready-made status vocabulary for knowledge gaps: a deliberate, prudent gap is fine if it is logged; the inadvertent, reckless kind is the sort that compounds.

**Ground.** [Cunningham, OOPSLA '92](http://c2.com/doc/oopsla92.html) · [Fowler, *Technical Debt Quadrant*](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html) · [Bossavit, *The Leprechauns of Software Engineering*](https://leanpub.com/leprechauns) · [Eveleens & Verhoef, *The Rise and Fall of the Chaos Report Figures*](https://www.cs.vu.nl/~x/the_rise_and_fall_of_the_chaos_report_figures.pdf) · [Cohen & Levinthal 1990](https://eric.ed.gov/?id=EJ406851). Romer 1990 and DeChurch & Mesmer-Magnus 2010 were named but not fetched — *unverified*.

**Open.** Does compounding hold the same way for an agent reader — is its absorptive capacity also bounded by prior shared context, or does retrieval flatten it? And can rung 14 be stated with no cost-ratio implication at all and still bite?

## What the chart asks of the ladder

Proposals, none of them ruled, in the order the evidence pushes hardest:

1. **Rung 4 gains an axis.** One fact, one home — where "home" means authorship, not reachability, and where redundancy across levels of depth is spiral rather than drift. Any second copy that can be *derived* should be, not written.
2. **Rung 11 gains a scope.** Written whole applies to the fold carrying current state. Registers whose value is history are append-and-supersede, and a decision record is never rewritten.
3. **Rung 8 closes its vocabulary.** Fixed status words with dates, listable by a script, rather than free prose — and a status for *this is judgment, held by a person, ask them*.
4. **Rung 1 loses the equation.** Both readers are bounded, differently; what they share is retrieval cost, not capacity. Say that, and let rung 3 fork where the evidence forks.
5. **Rung 6 states what it was minted for** — agents and private context — and stops implying that people start blank, which onboarding and the tacit lineage both deny.
6. **Rung 14 is regrounded** on absorptive capacity and non-rivalry, reworded away from any 1:10:100 echo, with the leprechaun named so nobody cites it later.
7. **A rung, or something below the ladder, for enforcement.** Every practice that scaled had a check or a queue. Ours is currently a bar nobody runs.
8. **A depth budget:** two levels, three at most, breadth over depth, entries judged by scent.

## Left out

Named so nothing is dropped silently. The fleet did not visit: design systems and Figma as a source of truth; localisation and what a Swedish-reading client does to an English wiki; API documentation standards (OpenAPI, JSDoc, Javadoc) as the derived-documentation case; teaching materials for the mechanics in their own register; the economics of who pays for documentation in a pro-bono project; and the vehicle question — whether markdown in a repo is the end form. Each is a fold someone can take.

Every territory was tasted by one head in one pass, briefed by us, which means the chart carries our framing into its own findings. A second pass by a differently-briefed head would be the honest check, and has not been run.
