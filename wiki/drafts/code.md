# The code

*Brought into hjulverkstan 2026-08-25 from **OpenLight** ([`Cwejman/OpenLight`](https://github.com/Cwejman/OpenLight)), where it was written and where it is being worked out; this copy is for the team to work over. It is **not ours yet and binds nothing** — `wiki/drafts/` never does — and it is not the ladder's replacement unless we rule it so: it proposes to supersede [`knowledge-structure.md`](knowledge-structure.md)'s fifteen rungs with two values, eight facts and six principles, and folds three of [`chart.md`](chart.md)'s corrections. The text below is the author's, unaltered; only its references have been rewritten — the arc's records (the derivations, the survey, the opening) live in OpenLight and are linked there. Its own status line, which speaks for OpenLight and not for us, follows.*

*Status: proposed — research, not law. This is the knowledge arc's candidate result (2026-08-24), written by the steward and awaiting the author's ratification; on ratification it supersedes the search recorded in [`conventions.md`](https://github.com/Cwejman/OpenLight/blob/main/%40md/conventions.md) *Knowledge structure*. Its grounds — the derivations, the survey, the sister study — are introduced in the aim below and listed under *Grounds* at the end.*

---

## The aim

An organisation usually learns of its mistake only after the cost has turned the course — sometimes the mistake is never named at all; it just becomes the circumstance everyone lives in. The same failure, small: a spec tree its own author finds fatiguing to read; a working session whose context only grows, so that what was understood at one point cannot be returned to or stood on from another. Each of these is knowledge failing to travel — and understanding that does not arrive comes back later as cost.

Under all of it sits one wall. Nobody holds everything: a person's memory runs out, and a model's context window does — the same limitation in two currencies. Call either one a **head**. This code is what follows from taking that wall seriously.

The systems where independent work *did* build on other work share one shape — small pieces that stand on their own, one shared medium, one simple way to join: Unix's programs joined by text and pipe, the web's pages joined by the link. For knowledge, the piece is the **fold** — a stretch of writing a head can take in on its own — and the join is the **reference** — a link that lets one fold stand on another. Both carry more duties than the plain words suggest; the principles below load them. The code is what makes this shape actually carry understanding: so it lands in a bounded head, draws the reader onward, and becomes floor for the next one — person and model alike, without giving up precision where law is what's written.

**Where this stands.** The code is being worked out inside **OpenLight** (working name *night*): a project building a system — its **substrate** — in which knowledge will live as typed, linked data rather than as files; the project's own markdown spec tree is both the study vehicle and the measured failure case (its [`README.md`](https://github.com/Cwejman/OpenLight/blob/main/README.md) is the one entry so far written by this code, and reads as its exemplar). A sister study runs in **hjulverkstan**, a volunteer project whose wiki pursues the same question; its *ladder* — fifteen candidate principles, in [`knowledge-structure.md`](knowledge-structure.md) — and its *chart* — a survey of the surrounding practices, from documentation systems to how models read, in [`chart.md`](chart.md) — are inputs here, cited as leads. The code itself is prior to any vehicle: markdown is the study form, the substrate the destination.

**In one sentence:** write knowledge as folds that stand on their own, each opening with why it exists and leaving even an early-stopping reader with something they can use; join folds only by references that say, before you follow them, what is there and how settled it is; give every fact one home and every claim its status in place; and let the reader's goal, never the subject's dependencies, order every reading.

**Three readings of this document** — a *reading* being a published path through folds for one goal. To judge whether the code is right — the ratification read — read through *The principles* and stop; you will be able to argue with every rule here. To write under the code, add *The method* and *The tests*; you will be able to produce a fold and check it. To continue the search, take *Open* and *Grounds*. The middle sections — composition, entry, descent — are how folds form a whole; descend into them as far as your purpose needs.

## The frame

Knowledge comes in four layers, told apart by what can argue with each: a **value**, which nothing sits beneath; a **principle** — a value made checkable; a **mechanism**, which does the work; a **method** — Tuesday's practice. Going up, the layers grow more stable; going down, they grow in volume. What compounds is what holds still, so the core — the value and principle layers — is the smallest part and is written first. And the four layers are also the order in which any undertaking is understood: first what it is for, then what must hold, then how, then what to do. That is why a knowledge structure done right reads like the natural approach to its own project — and why the same rule serves whoever is reading and whoever is acting: gain footing before the next step, and when a leap is forced without understanding, stop.

**A principle is a value meeting a fact.** A value alone is silent — it says nothing about what to do until it meets a constraint of the world. So every principle below carries its trace, written `V1×6,8`: the value, times the numbered facts it meets; a `·` separates independent derivations of the same rule. Disputing a principle means denying its value or denying its fact; there is no third way in.

**Goal and outcome.** A reader opens a repository *for* something — to judge it, to build on it, to fix one thing. That aim is their **goal**: a value pointed at a situation, the reader's side. What a fold leaves them able to do is its **outcome** — the fold's side of the same vector, and a fold's "why" is just its outcome stated to the reader. Navigation is the match between the two. Audience follows from outcome — the audience of a reading is whoever wants what it delivers — so a structure branches by outcome, never by demographic. And the core serves every outcome at once, which is exactly why it holds still and sits first.

## The values

- **V1 — Understanding reaches the head that acts.** Knowledge is for action; a result that lands in another head becomes floor, and compounding is this value iterated across heads and time. A bored reader, a walled program, a lost era of composition are one failure: a head not reached.

- **V2 — Nothing is claimed beyond what is held.** Truth with its warrant reachable — about the world, and about the writing's own state. Independent of V1: a falsehood travels perfectly well. Being checkable is what makes knowledge safe to stand on; a source is a floor, never a substitute for being right; and one discovered overclaim costs the reader's trust in everything else.

## The facts

Constraints of the world, not choices; each earns its place by yielding something no other fact yields.

1. **Every head is bounded — differently.** A person forgets and cannot re-read a conversation; a session re-reads freely but degrades as its window fills. What they share is not capacity but the cost of finding things again — so one structure can serve both, built to the tighter bound in each dimension.

2. **The writer's head is bounded too** — so the rules must be checkable one fold at a time, or they will not be checked.

3. **Knowledge changes at uneven rates** — purpose slowest, practice fastest.

4. **Readers arrive aimed, and differently** — each with their own goal, wanting their own endpoint.

5. **A returning reader is a different reader** — holds more, wants less, and needs to see what changed.

6. **Attention is spent before its return is known.** You pay for a read before you know whether it was worth it, so reading is a chain of stop-or-continue decisions, each taken half-blind. (This is the sense *pay* carries below: a fold pays when it was worth the attention it cost.)

7. **Dependency order is not motivation order.** X may be definable only after Y while being the only reason anyone cares about Y — the program is why the primitive matters, yet the primitive must be defined first.

8. **Any fold may be a reader's first.** A fresh session holds nothing, a tired person little — and what is met first frames everything met after.

Six familiar virtues turn out to be values meeting these facts, not values of their own — recorded so the two-value set is auditable: compounding is V1 iterated; engagement is V1 meeting bounded heads (1); the reader's sovereignty, V1 meeting aimed readers (4); brevity, V1 meeting spent attention (6); the core's stability, V1 meeting uneven change (3); self-application, V2 turned on this document.

## The principles

Six. Each principle's check is the fold's unit test, run by its writer at ship; a fold ships when every check passes or the exception is written into the fold itself.

**1 — The reader's order governs, at every scale.** `V1×6,8 · V1×3`
Our own substrate spec defines its first primitive at line 5 and says what the system *is* at line 369 — a reader carries unmotivated machinery for four hundred lines. The rule against that: why before how, from the entry down to the sentence. The stop-or-continue decision needs purpose first, and purpose is the durable part — often all the reader takes away. The opening is *more abstract* than the body — an orientation, never a summary at the body's own grain. When the subject's dependency order fights this (fact 7), the dependency never gets to reorder the reader: dispatch it in one line and reference its home. At small scale the why is a single sentence — which is what keeps this rule from becoming preamble.
*Check:* a reader of only the opening holds a true, coarse account of what this is for, and can decide to stop.

**2 — The fold.** `V1×1,8`
This project's README can be read alone and trusted: nothing in it presumes the specs were read, and what it doesn't explain, it links. That is a fold — one why with its whole body, readable on its own. Inside it, everything is understood; what is not understood is a reference — a thread to pull, not a failure. (This is why bounded heads need folds at all: a context cannot be refactored, so comprehension can only grow bite by bite.) In the markdown vehicle **a fold is a file**; its sections are body, not folds of their own — and the test is referencing: a section you would point to from outside is a fold wanting its own file. Split a fold when its body serves two reasons to exist — the tree splits *what the components are* from *why they look as they do* into two files — never on length alone. The floor: anything smaller than one disputable claim is a fragment; there is nothing to question, so nothing to stand on. And a fold never starts mid-world: it opens with a line placing it — what it belongs to, linked, with enough said that the fold still reads alone (the line above this document's title is its own).
*Check:* cold-open — a head with no prior context reads only this fold and can state its claim, its assumptions, and what they would argue with. Naming a missing assumption passes; silent confusion fails.

**3 — The reference.** `V1×1,6`
"See chapter 7" makes you travel to find out whether the travel was worth it. A reference under this code carries, at the point where it stands, what the travel buys: what is there, what you will be able to do with it, and how settled it is — so the decision to descend is taken *before* the cost, not after. In markdown this needs no syntax: the sentence around the link is the carrier, and a bare link whose sentence already says these things is the pattern. The promise is stated as an outcome ("how boundaries are enforced"), never a topic ("more on boundaries") — a goal can be matched against an outcome, only guessed against a topic. The reference is the *one* kind of join — a medium compounds only when every join's two ends are the same kind of thing (whether the join should carry a type is contested; see *Open*) — and it joins whole folds: a middle you could address separately was really its own fold. And it is removable: the sentence holding it reads complete without it, so understanding a fold never requires leaving it. References are followed to go deeper or to apply — not to comprehend.
*Check:* delete every destination; this fold's prose still reads, and its claim is still complete and disputable.

**4 — One home, many paths.** `V2×3`
State a rule in three files and it soon becomes three rules — copies drift. So every fact is authoritative in exactly one fold: home means authorship, not reachability. Everywhere else it appears as a marked restatement pointing home, and a copy that can be derived is generated, never retyped. The axis that makes this a rule rather than a prohibition: restating a thing more coarsely at a higher level is how teaching works — the entry says roughly what the law says exactly; two folds at the *same* level both owning it is drift. Distilled state points back to the event it came from. And the same rule runs across media: prose owns why and forces; code owns what and how; prose restating what the code already says is a defect, not thoroughness.
*Check:* every claim's home is nameable; every restatement links; nothing written that could be derived.

**5 — Status is part of the writing.** `V2×3,5`
An unmarked exploration, read by a later session as law, is how a guess calcifies into a rule. So every claim is grounded in place, referenced, or marked open — no third option — using a closed set of marks (this vehicle's working set, itself proposed: unmarked = **settled** · **proposed** · **lean** · **open** · **superseded by …**, each dated when written), closed so a script can list them and drift can be counted rather than felt. Unmarked reads settled; but a claim inherits the doubt of the weakest thing it stands on unless it says why not, and inheritance wins. The field's coarse status is carried by *where* a fold lives — its register, defined under *Composition*: spec is law, research is evidence-bound, sketches are open, logs are records. Records are events: a meeting, a ruling, a review lands in the state, is absorbed, and retires — state is rewritten, never patched, and superseded work is marked in place, never deleted. Nothing is lost silently: what is deliberately left out is listed, because a claim of coverage is judged by its omissions.
*Check:* sample the claims — each one classifiable; standing at any reference, you know what you are about to get.

**6 — Every stopping point pays.** `V1×1,6`
The README ends its reading order with "stop where your purpose is served." Generalised: any prefix of any reading — any published path through the folds — is true and usable; every stopping point leaves the reader with something they can act on. A fold that exists only to set up other folds is not a fold; merge or delete it. Endings are designed, not accidental: a reading rightly ends when the goal is served, the declared endpoint is reached, or nothing on offer matches the goal anymore — and a published reading is short enough to hold in mind as a list. A reader who leaves exhausted or lost found a structure defect, not a personal one.
*Check:* truncate at every boundary; what remains is correct and worth what it cost.

**The commitment:** this code is a fold of the field it governs — same medium, its own rules applied to itself, revised the same way — because a rule is only tested where it is applied. Its checks are run for real: a cold-open by a head with no project context is part of shipping it, and the runs are recorded in the arc ([`opening.md`](https://github.com/Cwejman/OpenLight/blob/main/%40md/spec/research/knowledge/opening.md) — the first run failed, and this revision is what fixing it produced).

---

## The composition

*The mechanism layer: how folds form a whole. The **field** is that whole — every fold and reference together.*

Hierarchy — directories, nesting — is a filing aid laid over the field, never the structure itself. It is the accepted compromise: a bounded head needs somewhere to stand, so a tree is paid for even though knowledge itself is a web of relations — and dissolving that compromise is precisely what the project's substrate exists to do. Filing stays shallow, breadth over depth, every label judged by whether a reader picks the right child from the label alone (the measured bounds — two levels, three at most — are leads from the chart, not law). One tracked medium: knowledge living in verbal habit or a chat thread mutates with no record — that is drift. A blank session is the same for everyone; a private copy is a second source.

**Registers.** The field is partitioned by what argues with each part: **spec** — law, argued by ratification (the author's word, in this project) · **research** — structured but uncommitted, argued by evidence · **sketch** — held open, argued by anyone · **log and transcript** — records: facts of what happened, binding on nothing. Two different questions are being answered here, and they are different axes: *how binding* a thing is — its **force** — is carried by which register it lives in, for free; *how sure* it is — its **confidence** — is the in-place mark of principle 5. A log entry shows why they must be separate: fully settled as fact, binding on nothing. Two hazards, named: moving a fold silently changes what its address asserts (stable addresses are the proposed answer); and *superseded* is a lifecycle state, not a confidence — superseded folds stay addressable.

**At the entry** live two things that are not folds. The **readings**: the published paths, each an outcome with its endpoint. The **frontier**: the index of the open questions, so "not decided" can be told from "not written" without searching the whole field — and it has an owner, because a marker nobody works is a promise to nobody. Two proposed mechanisms beside them: a keyword index (term → the folds that touch it), giving one-home facts many paths in; and a machine mirror of the map — paths plus one clause each, never content — as the agent's entry.

**Wholeness is reachability**: every live fold sits on some published reading from the entry, or it is dead, or the map is wrong.

## The entry — the aim

The entry — the one fold every reader meets, the README in this vehicle — holds what an actor must understand first: the value of the whole, pointed at its situation. It does four things and no more: states the why in its strongest *true* form; says what the thing is, minimally, unsettledness included; publishes the readings, each outcome with its endpoint; and is itself a fold — one head-load, assuming nothing, introducing every word it uses. It is complete about exactly two things, the why and the map; everything else lives below. And it is a reference document, not the story of how the thing was found. Its two forces — inviting from above, everything in place from below — meet in a proposed resolution: **the why is prose, the map is a list**; the newcomer reads through, the returner skips to the list, neither pays for the other. The entry is written last and rewritten whenever the whole moves. Sub-entries exist, reached from the entry — and any fold that orders its outgoing threads has become one, and must declare itself.

## The descent

The descent is how a reading actually unfolds: the reader's goal meets the entry's outcomes, picks a reading, and moves down the same four layers the code itself descends — why, what must hold, how, practice — to whatever depth the goal requires. Breadth before depth on first contact: the frame is set at the top, and a reader who dives before the frame is set mis-frames everything after; returning readers jump straight in. The pull onward is structural, not stylistic: a fold closes by naming the question it opened but did not answer — a summary returns the reader to where they were; a named question moves them. Keep the felt and the narrative in entries and rationale; keep laws and testable claims expository — story buys retention with an ambiguity that a head rebuilding from the text cannot afford. Goals refine as the reader learns, so readings are suggestions over a uniform join; re-aiming costs nothing.

The returning reader comes to look up, not to read: names titled by the question they answer, the answer near the top, change legible — status, the supersession trail, what moved since. And what helps a novice slows an expert (guidance reread is drag), so the remedy is never two versions of the prose — forked prose multiplies drift — but ordering and skippability: the expert skips what the novice reads.

**Both heads, one artifact — a claim under test.** The human is drawn by engagement — the pull of the named question; the machine selects by what a reference declares — promise and status read without the destination. Both are served by the same reference. Held against the claim, from the chart's leads: measured results where narrative coherence *hurt* machine extraction, and the finding that the middle of a long file is where claims die (put weight at the front and the tail). First among the opens.

## The method

*The practice layer. Steps ordered so the cheapest failure comes first; writing order is not reading order — this is principle 1 turned on the writer.*

1. Name the question, in the reader's words. Two questions, two folds.

2. Name the outcome and its reader. Two exits, two folds.

3. State the answer in one sentence — or write an **open fold** (a stub that honestly says what is not yet known) and stop; never write around a hole.

4. Write the why: the situation where lacking this answer costs something — felt, concrete, and shorter than the answer it motivates.

5. List the load-bearing claims, loosely, each marked held / believed / open. Loose deliberately: compress the list too far and you have already written the piece — the prose that follows only transcribes it, and comes out dead. (The compression finding; one session of evidence, the method's weakest step.)

6. Choose the entry angle explicitly, and vary it across folds — that is where the variance lives.

7. Write once, whole, with the claim list out of view, in the reader's order. Mint a word only where folk speech runs out.

8. Place the references — promise and status in the surrounding sentence — then read the fold as if all of them were deleted; whatever breaks was a dependency dressed as an offer.

9. Close with the question it opened; if a reading completes here, say so.

10. Run the six checks; set its status and place — register, marks, dates; supersede in place.

**Maintenance.** New knowledge is worked in by rewriting the fold whole — prose is not modular; meaning lives in transitions — scoped by register: state is rewritten, records append and supersede, and a record is never rewritten. A spec fold may carry its likely changes, so no later head guesses what to keep flexible. Map the outcomes actually wanted of the structure before publishing the readings. And when the author corrects your wording, record the correction as a standing rule, not a one-time fix; three earned so far: honesty beats rhetoric · the felt beats the abstract · lingo kills grace.

## The tests

The unit tests are the six checks, writer-run at ship. At review, the whole-level suite — each named with its runner, its moment, and the failure family it catches (fatigue · the unanswerable question · understanding that does not land):

- **Transfer** — after a reading, decide a case the text does not cover, correctly. The acting test, and the real bar: a fresh head, one real bounded task, the structure alone. *Run by a fresh session, at each review milestone. Catches: not landed.*

- **Teach-back** — restate the takeaway from memory to a third person; what cannot be restated will not travel. *Run by any reader, at review. Catches: not landed.*

- **Question inventory** — every real reader question has a fold and a path to it, or becomes one — open folds included. *Kept by the steward continuously, worked at review. Catches: the unanswerable question.*

- **Single-answer audit** — one settled place per question; duplicates are references; contradictions ruled or demoted. *A delegated sweep, at review. Catches: the unanswerable question, fatigue.*

- **Return test** — a prior reader finds a specific answer in one hop and sees what changed since. *Every return is a run; failures are filed as defects. Catches: the unanswerable question.*

- **Reachability** — every live fold on some published reading. *A script or sweep, at every review. Catches: dead knowledge.*

**The verdict:** a senior reader finishes with no unanswerable questions — disagreement is permitted residue; a fresh session bootstraps and can be trusted; the author reads without fatigue and stays engaged.

**Enforcement is part of the structure.** A test unrun is a bar, not a check — which is why each test above names its runner and moment, and the frontier its owner. Two cautions: an example-heavy fold teaches the example, not the rule; and growth is not comprehension — a structure can grow while understanding does not.

## Open

Roughly in order of bite:

- **The one-artifact claim** vs the context-rot evidence — whether folds need a derived claim-list twin for machine readers.

- **Fractality**: that every fold opens why-first is convergently derived; whether the full four-layer ring recurs at every scale is a function of fold size, unproven. With it, whether testable claims are the principled gate-first exception.

- **The method is unproven by a second head**; the prose-then-list entry resolution is proposed (its forces' meeting was honestly "not yet known"); reader-order-over-dependency-order has one production artifact — the README.

- **The fold–file identity** holds for markdown; what the fold's grain becomes in the substrate — where sections are addressable — reopens it.

- **Readings**: published only at entries and declared sub-entries, or more freely; how branching readings end per outcome; how many readings before the map itself exceeds a head.

- **Restatement economics** — standing alone buys reader ease with maintenance cost; unsettled at scale.

- **Status**: whether the working mark set is right; the register count; which ground governs the partition (what-argues-with-it vs how-long-it-lives); a mark for *judgment held by a person — ask them*.

- **Typed references** (grounds / depends / next / open) — a reason selected on is a join kind in effect; the burden sits on typing. Backlinks stay underivable in markdown.

- **What writing cannot hold** — a register of the deliberately unwritten with a named holder; the codify-or-personalize boundary declared; transcripts as traces of work, not ore. With it, the writing-cost bound: the code prices only the reader's side.

- **Whether a fold blending explanation, reference, and instruction must split** into typed files behind one entry — the strongest outside challenge to the fold.

- **The human reader is not blank** — mentors and response latency, not documentation, dominate onboarding; what of that is this code's to hold.

- **Fold size**: only the split test is derivable; the lean stands that the human bound is tighter and serves both. Unsorted regions, comprehension metrics, maturity grades — practice-level, open.

## Grounds

The full arguments compressed above live in the arc's records: two derivations produced blind from the thesis alone, which converged — [`derivation-structure.md`](https://github.com/Cwejman/OpenLight/blob/main/%40md/spec/research/knowledge/derivation-structure.md) from the structure's side, [`derivation-reader.md`](https://github.com/Cwejman/OpenLight/blob/main/%40md/spec/research/knowledge/derivation-reader.md) from the reader's — and the survey of how the spec tree opens today, [`tree-survey.md`](https://github.com/Cwejman/OpenLight/blob/main/%40md/spec/research/knowledge/tree-survey.md); the thesis and the arc's history are [`opening.md`](https://github.com/Cwejman/OpenLight/blob/main/%40md/spec/research/knowledge/opening.md). The hjulverkstan ladder and chart cross-pollinate this code — neither project is the other's authority — and the chart's caveats transfer whole: its sources are one-pass leads no human has followed, gathered under our own framing. Three of its corrections are folded here: the person-and-model bound is *not* an equation (bounded differently; the shared thing is retrieval cost); the cost-of-late-understanding claim is kept only in its grounded form (absorptive capacity, knowledge as a non-rival good, debt as deferred consolidation) — **the famous 1:10:100 cost ratio and the "IBM Systems Sciences Institute" study behind it are folklore; do not cite them**; and status vocabularies survive only closed, dated, and owned. Evidence as it stands: the README as the one production entry written by the code; design.md and horizon.md as native precedents; the tree-survey as the measured failure; the compression finding as the one method result; and one cold-open run of this document itself, recorded in the arc. Not folded, knowingly: the ladder's personal-knowledge rung and hjulverkstan's client-side matters; the chart's tool-level steals (linters, inclusion modes, requirement grammars); the medium's derived requirements (substrate.md's subject); the chart's unvisited territories.
