# The code

*From **OpenLight** ([`Cwejman/OpenLight`](https://github.com/Cwejman/OpenLight)), Jona's own project, where the code is being worked out and where this is the current draft as of 2026-08-28. It replaces the far longer version brought in on the 25th — that one is superseded whole, and the [log entry](../log/2026-08-25-code-brought-in.md) for it stands as the record. Binding on nothing here; `wiki/drafts/` never is. The text is the author's, unaltered — including the closing link to "the first proof", which points at a document not yet written: the code has not been worked in anger anywhere, and that is the gap this repository is in a position to fill.*

The code is a set of working rules for how knowledge is written and arranged so that it reaches whoever needs it next. This document states its core — why it exists, one limit, two primitives, two laws — and names what is still open.

---

## Why there is a code

Something is understood, and it does not reach whoever needs it next. That is the failure this document exists to end, and it is seldom seen for what it is. A team discovers its mistake a year after making it; by then the damage has shaped everything, and the mistake is not even called a mistake any more — it has become how things are. You open your own notes and have to rebuild the thinking they were supposed to hold. A long working session decides again, differently, what it already decided an hour ago. A newcomer finishes the documentation and turns to the web for the twenty things it assumed. The cost is real every time, but it lands later and elsewhere, cut off from its cause — which is why the walls that produce it, between people, between roles, between programs, pass for the way things are.

The opposite is also one thing at every scale. Knowledge is made of connection: a thing you learn is worth more joined to what you already know, and worth more again when someone else can stand on it. Connected knowledge compounds — each piece becomes ground for the next. But connection does not happen by itself. The pieces need a shape that lets them meet, and this document's whole job is to describe that shape.

It is easiest to see in something built. A finished product stands on its requirements, which stand on goals, which stand on a background. The solution behind it stands on a view of what a good system is — and on those same goals and that same background, which is why this is a web and not a chain. The product itself is written down and broken open the same way, so the web reaches all the way to what runs. Held whole, this is what a grounded environment means: a new idea, or a new person, arrives onto ground instead of into a pile. And things do not need to be complex to be understood, because place follows reach: the connections that matter to everything sit at the centre and carry the comprehension, while each complexity is folded in toward the edge, reachable from wherever it matters.

And the knowledge of an undertaking is more than its documentation. The plans and the backlog, the decisions, the meetings and their transcripts, the record each working session leaves behind — all the scaffolding that gives the work its direction and its transparency — is knowledge too, and belongs in the same space, joined the same way.

The point of the code is that whoever comes to that space — person or AI — comes as a first-class citizen of it. And this needs no new technology. Plain files in folders, tracked in version control, are enough to hold the structure, and the AI harnesses that already exist are its natural match: a fresh session holds nothing, so a session started against the structure becomes what it reads — reliably, and differently for different work, the engineer's embodiment or the planner's, on the same ground. The difference people blame on models is mostly a difference in ground.

The code is that shape, written as working rules. This document states it.

## The limit

Nobody can hold everything. A person forgets; an AI model's context window fills up and degrades as it fills. Better tools can widen what is held and cheapen the reaching, but they do not change how understanding works: you hold what matters, and the rest is reached when needed, already commonly known, or learnt when its time comes. The whole code follows from taking this seriously: knowledge is written to be understood in parts and passed on in parts, never asking anyone to carry the whole.

## The fold and the link

Wherever independent work has built on other work, the same shape appears: small pieces that stand alone, one shared medium, one simple join. Unix had programs, joined by pipes. The traditional web has pages, joined by links. For knowledge, the piece is here called a **fold**, and the join is a **link**.

A fold is a piece of writing that stands on its own. Everything it uses, it explains or links out, and following the link is optional. The name is meant exactly. Work is linear while it happens — a conversation, a working session, a train of thought runs like a strip of paper. Now and then it has to leave its thread to cover new ground, and while the ground is being covered there is no fold yet, only more paper. But once it is covered, what the thread actually needed is a fraction of what was crossed: the conclusion. So the stretch is folded — from where the dive began to where the conclusion landed — and the paper reads on with the conclusion meeting the exact point where the thread left off. The detail is not gone; it is pleated inside, opened by whoever needs it. That folded stretch is a fold — which is why a fold is defined by standing alone, not by size: it holds one whole dive, so you split one when it is doing two different jobs, not when it gets long, and it can be a whole file or a section inside one.

A link is the one way folds join, and it is an offer, never a missing piece: the fold reads complete without it, and the sentence around it says what following it gives.

> *"Fold" is the name held for now. What it names is really a virtual space among linked spaces — the paper analogy does not fully map to the phenomenon the code enables — and a better name may come as the work goes on.*

## The two laws

Everything else the code asks comes down to two laws. Laws, not advice: each states a condition, and where it fails, knowledge stops compounding. Compounding has two sides — every piece is first something a reader arrives at, and after that, ground that others stand on. One law for each.

**Law 1 — Nothing arrives before its ground.** Understanding is built in the reader's order: every meaning is given before it is used, purpose comes before machinery, and every stopping point leaves the reader whole.

Prose that runs ahead of itself turns reading into algebra — the text speaks of X before giving X, and the reader now carries K, L and M about an unknown. This is why a fold opens with what it is for, and why the sentence around a link says what following it gives, so the decision to open it is never blind. And where the subject truly forces the other order, the debt is declared in a line: borrowing is allowed, silent borrowing is not.

**Law 2 — The ground stays true.** Whatever is stood on must hold for whoever stands on it next: every fact keeps exactly one home, and every claim carries its confidence.

Copies are how ground rots — three copies of a rule quietly become three rules — so a fact is stated properly once and pointed at from everywhere else. Confidence is part of the writing, never a feeling the reader is left to sense: an unmarked guess, read a year later, becomes law without anyone deciding. And settled never means forever ruled — every piece rests on pieces that can move, and a new piece can arrive and change what the old ones meant, so "settled" means settled for now, given what it stands on.

## Open

What the code does not yet know, it says.

- **The cold opening.** This document's own first sentence arrives before saying what it is about. The debt is one sentence, held by a reader who holds nothing else yet — but is that craft, or a small breach of law 1? Whether readers meet it as taste or as friction is something we want to find out, not rule on.

- **The shape in practice.** How folds compose into a whole: what division and depth actually work, what the entry of a structure looks like, and whether parts of it carry entries of their own. Nothing real has been built under the code yet, and these are answers to be observed, not prescribed. The observing starts in [the first proof](), which works the code in the simplest medium there is — plain files in folders.
