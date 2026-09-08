# Testing approach: spec-first, three lanes

*A draft — explored, not binding. Proposes how the portal is tested and how the first intern team is organised around it. It grows out of the user stories in [`product/user-stories.md`](../product/user-stories.md) and the client meeting of 2026-08-19 ([transcript](../transcripts/), pending approval). Nothing here is a ruling until it is folded into `conventions/`.*

## The reframe: the E2E test is the oracle, not the net

The instinct for a codebase with no tests is to build a regression net — encode what the code does today so it is not broken. That protects *stability*, but it optimises for the wrong objective here. A regression test mined from the current code encodes whatever shipped, and whatever shipped may be off-track from what the client needs. The test would be green while the behaviour is wrong, and CI would proudly protect the drift.

The client's own words set the objective higher than stability: the portal "went live, everything is ready" but "the client has yet to adopt it," and "last time they looked there were bugs with the tickets" (· 02:48, 27:20). The thing to prove is not "the system is stable" but "the system does what an instructor actually needs" — and where it does not, to name the gap. That is a spec, and it is written as user stories before any test.

So the layers are not one net of increasing granularity. They are three layers with three different jobs:

| Layer | Job | For this project |
|---|---|---|
| **E2E (user story)** | Validate the *business objective*; expose off-track behaviour | A small set of golden paths — one per user story. This is the thing that tells whether the current build is *correct*, not just *stable*. |
| **Integration (service boundary)** | Fast, stable regression protection where the risk concentrates | Testcontainers + Spring, calling the service methods directly. This is the *net* — it carries the day-to-day CI load. |
| **Unit (pure logic only)** | Edge cases the integration layer cannot cheaply isolate | `TicketUtils` status rules, DTO `applyToEntity` mapping, the Zod schemas. Pure functions, cheap to test, easy to get subtly wrong. |

The principle that keeps it from over-testing: **test at the highest level that gives the confidence you need, and go lower only for what the higher level cannot cover.** If an integration test already exercises a function in context, do not also unit-test it in isolation unless it has gnarly edge cases. That is what prevents the trap of five hundred green unit tests while the system still does not do what the user wants.

*Lean:* the E2E set stays small — golden paths only, one per story. E2E is the most expensive, slowest and most brittle layer; if the first one is flaky or CI takes twenty minutes, the next team deletes it and the project is worse off than with no tests. The integration layer carries the regression volume so the E2E stays fast enough to run on every PR.

## The three lanes are the team

The three test layers map almost exactly onto the three interns' strengths, which is the organising move: hand each lane to the intern whose temperament makes it easy, and give each a named mission. Nobody fights their nature, and each owns a domain.

| Lane | Owner | Mission | Why it fits |
|---|---|---|---|
| **Integration** — Testcontainers + Spring, calling the service methods directly | the backend-leaning intern (introvert, calm) | *"I am the person who guarantees the backend does what it says."* | Bounded, deep-focus, methodical. A well-defined problem to sink into and become the authority on. Quiet ownership, no spotlight. |
| **E2E golden paths** — Playwright driving the Portal through a real story | the frontend-leaning intern (wants clarity, uneasy with uncertainty) | *"I turn each user story into a test that proves the user can do it."* | The user story *is* the clarity. They are not guessing or inventing — they transcribe a *given* acceptance criterion into a test. Spec-first removes exactly the uncertainty they cannot tolerate. They learn React by driving it from tests — exploration with a rail. |
| **The harness + the off-track hunt** — wire Playwright + Testcontainers to run together, CI, then run the E2E suite against the current build to find what is actually broken | the intern with no preference (ADHD strengths) | *"I find where the system does not do what the client needs."* | No preference → the cross-cutting role that touches everything. Varied (tooling, both stacks, CI), fast-feedback (tests flip green, bugs surface), and a quest with a tangible prize: a ranked list of what is off-track. A mission, not a chore. |

What makes it feel like a high-performing team rather than three people doing chores:

- **Everyone owns a domain.** The backend-correctness person, the user-story person, the scout. Ownership is what converts a task into pride.
- **One shared enemy.** Not "write some tests" — *"prove the system does what the client needs, and find where it does not."* The transcript supplies the enemy: the client has not adopted the portal, and there were bugs with the tickets. That is a real thing to go find.
- **An early win on day one.** Day one is not "build the whole suite." Day one is: stand up the harness and get one trivial E2E test green — "log in, see the inventory list." A green test in the first day is worth more than any pep talk for a team this green. Momentum is the whole game.

## The cadence

- **Day 0** — the user stories and acceptance criteria exist (the spec). Everyone reads them. *Nothing is built until this is written* — it is the artifact that removes the frontend intern's uncertainty and gives the hunt a target.
- **Day 1** — harness + first trivial E2E green (the cross-cutting intern leads, the others help).
- **Day 2 onward** — each story flows through the three lanes: the frontend intern writes the E2E, the backend intern writes the integration test for the same story, the cross-cutting intern wires it into CI and runs it. The backend and frontend interns **pair on the first story** — same story, both layers — which is onboarding in action and is how a team forms. The cross-cutting intern roams and pairs with whoever is stuck.
- **Ongoing** — whatever E2E test fails against the current build becomes the next day's task, ranked by business value. The team is always working on real problems the client cares about.

*Lean:* a shared board (stories on top, the three lanes as columns), a visible "green wall" showing suite status, a short daily sync (what is green / red / blocked), and one demo a day — even if it is only "here is the test that now passes." A day that ends without something shown is a day the team felt like a chore.

## The finding that proves the point

Mapping the repair and rental stories to the code, every place a vehicle's status is set to AVAILABLE was traced. There are none. The ticket logic only ever sets UNAVAILABLE (on create / in-progress) or null / ARCHIVED (on close). So:

> **When a repair or rental ticket is CLOSED, the bike does not return to AVAILABLE — it stays UNAVAILABLE until someone manually edits the vehicle's status** (the only other path, `VehicleService.editVehicleStatus`).

A regression test mined from the current code would have encoded "close a ticket → vehicle is UNAVAILABLE" and CI would have protected it — green while off-track. The spec-first E2E, written from the obvious expectation "when the repair is done, the bike is available again," is the one that *fails* and surfaces this as a real backlog item.

*Open — strength of the claim:* the Portal UI is not visible from the code, so it is possible a compensating step exists (for example, the close flow in the UI also calling `editVehicleStatus`). This is therefore a **flag for the client to confirm, not a verdict** — and it is the first question on the acceptance-criteria check. It lines up with the client's own recollection that "there were bugs with the tickets — everything was solved" (· 27:20): the hunt is precisely the thing that verifies whether it is actually solved.

## The precondition

The stories are grounded in the transcript, but a couple of acceptance criteria are inferred from the code and the transcript, not stated by the client. The E2E oracle is only as good as the acceptance criteria behind it; if the team invents the user story, the hunt runs against an assumption of what the client wants — the same calcification, one level up. So the criteria must come from the client. Two are flagged [Open] in [`product/user-stories.md`](../product/user-stories.md) — the availability question and the SMS trigger — and both belong on the agenda of the follow-up meeting already planned for early next week. The door is open: Samir is the admin / education person, Daniel the mechanical person, and a meeting is already booked.

## Where this lands in the structure

- The **user stories and acceptance criteria** belong in the `product/` fold — the user manual falls out of it, per the draft's aim.
- The **testing ruling** — "E2E for golden paths, integration at the service boundary, unit only for pure logic" — belongs in `conventions/`, once confirmed.
- This file is the *draft* that holds the proposal until both are true.
