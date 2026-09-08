# The portal's core, as user stories

*An early seed of the `product/` fold — the acceptance spec for the portal's heart, written spec-first: the user story is the oracle the tests are written against. Source: the client meeting of 2026-08-19 ([transcript](../transcripts/), pending approval), cross-read against the current code in `api/`. Business intent points to the transcript's fold and minute; behaviour points to the code that implements it today.*

*Status: draft. Extracted, not yet confirmed by the client — two criteria are flagged [Open] below and need a word from Chiaco or Samir before they read as settled. Nothing here is binding until the client confirms it and it is folded into the `product/` disposition.*

## Why this is written as stories

The client's stated focus is the portal's adoption: *"the most important part is still to get the instructors to use the portal… a really good tool for the mechanics' efficiency"* (· 41:02). The heart of the portal is tickets — *"a ticket connects inventory, employee and customer"* (· 28:50). So the spec is written around the ticket lifecycle and the customer data that hangs off it, because that is what an instructor actually does.

Writing it as user stories, with acceptance criteria, is deliberate. A test written from *what the code does today* encodes whatever shipped — which may be off-track. A test written from *what the user needs* is the spec: it proves the system does the right thing, and where it does not, it names the gap. The stories below are that spec. They double as the user manual's skeleton, which is what `product/` is for.

The client also said, of the last look: *"there were bugs with the tickets — everything was solved"* (· 27:20). These criteria are the thing that verifies whether it is actually solved.

## US-0 — Smoke: an instructor can get in and see the workshop

> *As an instructor, I can log in and see the vehicles in my workshop, so I know what is on the bench.*

- **AC-0.1** — A valid user logs in and the Inventory list loads.
- **AC-0.2** — The list shows each vehicle with its current status.

*Lanes:* C writes the first E2E — this is the day-one green. A: none yet. B: this is the harness proof.

## US-1 — Repair ticket lifecycle (the core)

> *As an instructor, when a bike comes in for repair I create a repair ticket, and the bike is marked out of circulation until the repair is done.*

- **AC-1.1** — A REPAIR ticket **requires** a repair description. *(code: `TicketUtils.validateDtoBySelf`)*
- **AC-1.2** — All vehicles on the ticket must be at the **same location** as the ticket. *(code: `TicketUtils.validateDtoByContext`)*
- **AC-1.3** — On create, a **shop-owned** (not customer-owned) bike flips to **UNAVAILABLE**. *(code: `TicketUtils.updateVehiclesByTicketType`)*
- **AC-1.4** — A new repair ticket starts at **READY**; the status is not choosable on create. *(code: `TicketDto.applyToEntity`, `statusMandatory`)*
- **AC-1.5** — A repair's status flows **READY → IN_PROGRESS → COMPLETE → CLOSED**. *(code: `TicketUtils.isValidTicketStatusByType`)*
- **AC-1.6** — When a repair reaches **COMPLETE**, the customer gets an **SMS**. *(code: `TicketService.updateTicketStatus` → `NotificationService.sendRepairTicketCompleteSms`)*

*Lanes:* C drives create → advance status → verify the SMS. A writes the integration test on `TicketService.createTicket` / `updateTicketStatus`, asserting the vehicle status and the SMS. B wires it into CI and runs it.

## US-2 — Rental ticket lifecycle

> *As an instructor, when I rent out a bike I create a rental ticket with a return date, and the bike is unavailable while it is out.*

- **AC-2.1** — A RENT ticket **requires** an end date. *(code: `TicketUtils.validateDtoBySelf`)*
- **AC-2.2** — A RENT (or DONATE) ticket **cannot** use a customer-owned bike. *(code: `TicketUtils.validateDtoByContext`)*
- **AC-2.3** — A new rental starts at **READY**; its valid statuses are **READY / IN_PROGRESS / CLOSED** (no COMPLETE). *(code: `TicketUtils.isValidTicketStatusByType`)*
- **AC-2.4** — When a rental is **IN_PROGRESS**, the shop bike is **UNAVAILABLE**. *(code: `TicketUtils.updateVehiclesByTicketStatus`)*

*Lanes:* C creates a rental, sets it IN_PROGRESS, verifies the bike is unavailable. A writes the integration test on the same. B wires and runs.

## US-3 — Customer deletion protects personal data

> *As an admin, when I delete a customer who has tickets, their personal data is anonymized so their history stays but their identity does not.*

- **AC-3.1** — Deleting a customer **with tickets** anonymizes them: name → "Removed Customer", and the personal data (personal identity number, phone, email, comment) is cleared — on the customer and on their tickets. *(code: `CustomerService.anonymizeCustomer`)*
- **AC-3.2** — An **anonymized** customer **cannot be edited** or deleted again. *(code: `CustomerService.editCustomer` / `deleteCustomer` guards)*
- **AC-3.3** — A customer with **active** tickets **cannot be soft-deleted**. *(code: `CustomerService.softDeleteCustomer`)*

*Lanes:* C deletes a customer in the Admin portal and verifies the anonymized record. A writes the integration test on `CustomerService.deleteCustomer`, asserting the PII is nulled. B wires and runs.

## US-4 — The inventory list an instructor actually uses

> *As an instructor, I can see all the bikes and filter by status and location, so I can find what I am working on.*

- **AC-4.1** — The Inventory list loads with vehicles and their status.
- **AC-4.2** — The list filters by status (AVAILABLE / UNAVAILABLE / BROKEN) and by location; the counts reflect the filter.

*Lanes:* C writes the filter E2E. A: lighter — the list endpoint. B wires and runs.

## Suggested order for the first week

US-0 (day one) → US-1 (the heart; where the client's "bugs with the tickets" most likely live) → US-3 (self-contained; a clean end-to-end for one owner) → US-2 → US-4.

## Open

Two criteria are inferred from the code and the transcript, not stated by the client. They need confirmation before the spec is settled — and both belong on the agenda of the follow-up meeting already planned for early next week.

- **The availability question.** AC-1.3 and AC-2.4 set a bike to UNAVAILABLE on create / in-progress, but nothing in the code sets it back to AVAILABLE when the ticket CLOSES. *Open:* when a repair or rental closes, should the bike automatically return to AVAILABLE, or is that a manual step the instructor takes? This is a genuine product question, and its answer decides whether the finding in [`drafts/testing-approach.md`](../drafts/testing-approach.md) is a bug or intended behaviour. It is the first question to put to the client.
- **The SMS trigger.** AC-1.6 fires the SMS at COMPLETE. *Open:* confirm the trigger point (COMPLETE vs CLOSED) matches what was told to the mechanics.

*Provenance note:* the transcript is pending approval, so these stories are a draft derived from a not-yet-approved source, and are flagged for client confirmation regardless. They are not published knowledge until both are true.
