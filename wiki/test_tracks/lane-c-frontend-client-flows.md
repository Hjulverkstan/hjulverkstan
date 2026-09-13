# Lane C: Frontend Client Flows & UI Components

*Owner: Frontend-leaning team member (clarity-seeking, user-experience advocate, interactive UI specialist).*

## Mission
You turn the user stories into robust, bulletproof client-side experiences. You guarantee that UI forms, validation messages, action guards, and interactive status flows protect the user from mistakes before requests ever hit the wire.

---

## Strict Implementation Order

```
1. Client Integration Tests (React Page/Flow Integration with MSW)
   └── 2. Consumer Contract Tests (Zod Schemas & API Contract Verification)
       └── 3. Isolated Component Tests (RTL / Vitest for Dialogs & Controls)
           └── 4. Client Unit Tests (Pure Form Validation, Math, & Reducers)
```

---

### Step 1: Client Integration Tests (MSW + React Router / Page Level)

Test full page workflows inside Vitest using Mock Service Worker (MSW) to mock HTTP endpoints:

* **US-0 — Smoke: Login to Inventory Page**
  * `InventoryPage.test.tsx`: Authenticated user loads the page; verifies vehicle list renders with status tags.
* **US-1 — Repair Ticket Flow**
  * `CreateRepairTicketFlow.test.tsx`: Open create modal $\rightarrow$ select `REPAIR` $\rightarrow$ fill description $\rightarrow$ submit $\rightarrow$ assert success toast and list refresh.
* **US-2 — Rental Ticket Flow**
  * `CreateRentalTicketFlow.test.tsx`: Open create modal $\rightarrow$ select `RENT` $\rightarrow$ pick return date $\rightarrow$ submit $\rightarrow$ verify bike badge flips to `UNAVAILABLE`.
* **US-3 — Customer Deletion Flow**
  * `CustomerManagementFlow.test.tsx`: Delete customer with history $\rightarrow$ verify UI updates to display `"Removed Customer"` with PII fields blanked out.
* **US-4 — Inventory Filtering Flow**
  * `InventoryFilterFlow.test.tsx`: Select "UNAVAILABLE" filter chip $\rightarrow$ list updates to show only matching vehicles $\rightarrow$ count badges recalculate.

---

### Step 2: Consumer Contract Tests (Zod & API Schema Validation)

* **Form & API Schema Validation**:
  * Verify frontend Zod validation schemas against backend OpenAPI contracts provided by Lane B.
  * Test that unexpected backend response payloads (e.g., missing status field) trigger graceful error fallbacks instead of white-screening the UI.

---

### Step 3: Isolated Component Tests (React Testing Library / Vitest)

Test UI components in isolation with mock props and event callbacks:

* **`CreateTicketDialog.test.tsx` (US-1, US-2)**:
  * Selecting `REPAIR`: disables submit when description is empty.
  * Selecting `RENT`: marks return date field mandatory; hides or disables customer-owned bikes from vehicle picker.
  * Initial status is fixed to `READY` and cannot be altered by user.
* **`TicketStatusControl.test.tsx` (US-1, US-2)**:
  * For `REPAIR`: renders transitions `READY → IN_PROGRESS → COMPLETE → CLOSED`.
  * For `RENT`: excludes `COMPLETE` (only shows `READY`, `IN_PROGRESS`, `CLOSED`).
* **`DeleteCustomerDialog.test.tsx` (US-3)**:
  * When customer has active tickets: renders blocker message and disables confirm button.
  * When customer has closed tickets: renders GDPR anonymization notice.
* **`InventoryFilterBar.test.tsx` & `CardVehicle.test.tsx` (US-4, US-0)**:
  * Clicking status chips triggers `onFilterChange` callback with active filters.
  * Status badges render correct styling for `AVAILABLE`, `UNAVAILABLE`, and `BROKEN`.

---

### Step 4: Pure Client Unit Tests (Fast & Cheap)

Test pure functions with zero DOM or network dependencies:

* **Zod Form Validators (US-1, US-2)**:
  * `validateRepairForm({ description: "" })` $\rightarrow$ returns error.
  * `validateRentalForm({ endDate: null })` $\rightarrow$ returns error.
* **Filter & Aggregation Predicates (US-4)**:
  * `filterVehicles(vehicles, { status: ['AVAILABLE'], locationId: 1 })` $\rightarrow$ returns exact subset.
  * `calculateVehicleCounts(vehicles)` $\rightarrow$ returns `{ AVAILABLE: 4, UNAVAILABLE: 2, BROKEN: 1 }`.
* **Date Helpers (US-2)**:
  * Date comparison logic ensuring rental `endDate` is in the future.

---

### Collaboration & Learning Points

* **Pair with Lane B**: Consume MSW handlers generated from OpenAPI contracts to write client tests without waiting for backend changes.
* **Pair with Lane A**: Validate that frontend form error messages align with backend constraint exceptions.
