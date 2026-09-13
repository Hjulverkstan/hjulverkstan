# Lane A: Backend Domain & State Engine

*Owner: Backend-leaning team member (methodical, deep-focus, domain correctness).*

## Mission
You own backend correctness and state integrity. Your goal is to guarantee that every business rule in the user stories is enforced in the database, transactions behave atomically, and pure state transitions are 100% covered.

---

## Strict Implementation Order

```
1. Integration Tests (Testcontainers + Spring Boot)
   └── 2. Provider Contract Verification (Spring REST / Stubs)
       └── 3. Slice / Controller Component Tests (@WebMvcTest)
           └── 4. Domain Unit Tests (Pure functions & state rules)
```

---

### Step 1: Integration Tests (Service Boundary & Database State)

Build integration tests using Spring Boot and `PostgreSQLContainer` in [api/src/test/java](api/src/test/java).

* **US-0 — Smoke & Workshop Isolation**
  * `VehicleServiceIT.getVehiclesForWorkshop`: Seed vehicles across multiple workshops; verify filtering by location ID returns only relevant vehicles with their persisted status.
* **US-1 — Repair Ticket Lifecycle**
  * `TicketServiceIT.createRepairTicket_locksShopBike`: Creating a `REPAIR` ticket with shop-owned vehicle persists status as `READY` and flips vehicle status to `UNAVAILABLE` in the database.
  * `TicketServiceIT.createRepairTicket_customerBike_retainsStatus`: Customer-owned bike status remains untouched upon ticket creation.
  * `TicketServiceIT.createRepairTicket_locationMismatch_fails`: Vehicle location $\neq$ ticket location throws validation error and rolls back the transaction.
  * `TicketServiceIT.updateTicketStatus_completeTriggersSms`: Advancing status to `COMPLETE` executes `NotificationService.sendRepairTicketCompleteSms`.
* **US-2 — Rental Ticket Lifecycle**
  * `TicketServiceIT.createRentalTicket_persistsWithEndDate`: Creating a `RENT` ticket persists valid `endDate`.
  * `TicketServiceIT.createRentalTicket_customerBike_rejected`: Attempting rental on customer bike fails with domain violation.
  * `TicketServiceIT.updateRentalStatus_inProgressLocksBike`: Setting rental to `IN_PROGRESS` locks shop vehicle to `UNAVAILABLE`.
* **US-3 — Customer Deletion & Anonymization**
  * `CustomerServiceIT.deleteCustomer_withTickets_anonymizesPii`: Deleting a customer with tickets renames them to `"Removed Customer"` and clears personal identity number, phone, email, and comments on both customer and ticket entities.
  * `CustomerServiceIT.softDeleteCustomer_activeTickets_blocked`: Attempting to delete/soft-delete a customer with open tickets (`READY`, `IN_PROGRESS`) throws exception.
* **US-4 — Inventory Queries**
  * `VehicleRepositoryIT.filterAndCount`: Verifies SQL queries filtering by status and location return the expected records and aggregate counts.

---

### Step 2: Contract Tests (Provider Verification & External Stubs)

* **Spring Provider Contract / Schema Verification**:
  * Verify that API controller responses match the OpenAPI contract published with Lane B.
  * Ensure status enums (`READY`, `IN_PROGRESS`, `COMPLETE`, `CLOSED`) and validation error shapes strictly match schema definitions.
* **External SNS Gateway Stub Verification**:
  * Verify payload sent to AWS SNS matches required phone number format (E.164) and message template.

---

### Step 3: Component / Controller Slice Tests (`@WebMvcTest`)

Test controllers in isolation with mocked service layers to verify HTTP status codes, security filters, and request parsing:

* `TicketControllerTest`:
  * Validates HTTP 400 Bad Request when mandatory fields are missing (e.g., `REPAIR` missing description, `RENT` missing `endDate`).
  * Validates HTTP 200 OK and response shape on valid status update.
* `CustomerControllerTest`:
  * Validates HTTP 409 Conflict when deleting a customer with active tickets.
  * Validates HTTP 403 / 401 when unauthorized.

---

### Step 4: Unit Tests (Pure Domain Logic & State Transitions)

Fast, deterministic tests without Spring context or database:

* **`TicketUtils` (Validation & Rules)**:
  * `validateDtoBySelf`: `REPAIR` without description fails; `RENT` without `endDate` fails.
  * `validateDtoByContext`: Mismatched location IDs fail; `RENT` with `isCustomerOwned == true` fails.
  * `isValidTicketStatusByType`: Verify allowed transition graph for each ticket type (e.g. `REPAIR` allows `COMPLETE`, `RENT` forbids `COMPLETE`).
  * `updateVehiclesByTicketType` & `updateVehiclesByTicketStatus`: Verify pure state mapping output.
* **`CustomerService` Anonymization Logic**:
  * Anonymizer pure function: verifies all PII fields are mapped to `null` and name is sanitized.

---

## Collaboration & Learning Points

* **Pair with Lane B**: Define the OpenAPI contract for `POST /api/tickets` and `PUT /api/tickets/{id}/status`.
* **Pair with Lane C**: Align on error response formats (e.g., active ticket deletion conflict messages) so the frontend displays exact error toasts.
