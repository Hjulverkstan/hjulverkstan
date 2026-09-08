# 2026-08-24 — The portal's core, spec-first; and the finding it surfaced

Session extracting the portal's core from the client meeting of 2026-08-19 into user stories, and proposing how the first intern team is organised around testing it. Cross-read the transcript against the current code in `api/` — the ticket, vehicle and customer service paths — so each acceptance criterion points at the code that implements it today.

**Added:** `product/user-stories.md` — the first seed of the `product/` fold. Five stories (US-0 smoke, US-1 repair lifecycle, US-2 rental lifecycle, US-3 customer PII on delete, US-4 inventory list), each with acceptance criteria and a three-lane mapping. Written spec-first: the story is the oracle the tests are written against, not a description of what the code does. Two criteria flagged [Open] — the availability question and the SMS trigger — pending client confirmation.

**Added:** `drafts/testing-approach.md` — the proposal, not a ruling. The reframe (the E2E test is the oracle, not the net); the three layers as three jobs (E2E validates the objective, integration is the net, unit only for pure logic); the three lanes mapped onto the three interns' strengths, each with a named mission; the day-0 / day-1 / ongoing cadence.

**Finding surfaced by the spec-first pass:** mapping US-1/US-2 to the code, no path sets a vehicle back to AVAILABLE when its ticket CLOSES — the ticket logic only sets UNAVAILABLE (create / in-progress) or null / ARCHIVED (close). So a closed repair or rental leaves the bike UNAVAILABLE until a manual edit. A regression test mined from the code would have encoded and protected that; the spec-first E2E, written from "when the repair is done the bike is available again," is the one that fails and names it. Flagged [Open] as a client-confirmation question, not a verdict — the Portal UI is not visible from the code, and a compensating step may exist. It lines up with the client's recollection that "there were bugs with the tickets — everything was solved" (· 27:20).

**Left open:** the two [Open] criteria (availability, SMS trigger) for the follow-up meeting already planned for early next week; the testing ruling's move into `conventions/` once confirmed; the `product/` disposition, which these stories seed but do not settle. The transcript is pending approval, so both files are drafts derived from a not-yet-approved source.

**Files:** `wiki/product/user-stories.md` · `wiki/drafts/testing-approach.md` · this entry. Nothing committed.
