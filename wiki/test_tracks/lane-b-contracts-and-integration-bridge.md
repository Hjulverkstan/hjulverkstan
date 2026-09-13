# Lane B: Contracts, Integration Bridge & Harness

*Owner: Cross-cutting team member (tooling, fast-feedback, architecture connectors).*

## Mission
You are the integration bridge. You connect the frontend and backend worlds, establish contract safety nets so neither side breaks the other, maintain the integration test harness, and wire the suites into CI.

---

## Strict Implementation Order

```
1. Integration Harness & Cross-Boundary Tests (Testcontainers + WireMock)
   └── 2. Contract Tests (OpenAPI Schemas / Consumer-Provider Verification)
       └── 3. Gateway & API Client Component Tests (Mock Client Adapters)
           └── 4. Unit Tests (Payload Mappers, DTO Serializers, Query Builders)
```

---

### Step 1: Integration Harness & Cross-Boundary Tests

* **Shared Testcontainers & Service Harness**:
  * Stand up and maintain the shared PostgreSQL container and WireMock/LocalStack container setup for API and E2E integration test runs.
* **US-1 / External Gateway Integration**:
  * `NotificationServiceWireMockIT`: Full wire test of `SNSService` sending messages to a local WireMock/LocalStack AWS SNS mock endpoint; assert correct HTTP request headers, authorization, and XML/JSON payload structure.
* **Database Migration & Seed Verification**:
  * Verify Liquibase/Flyway/SQL migrations execute cleanly from scratch on a clean container and populate initial test locations.

---

### Step 2: Contract Tests (The API Safety Net)

* **Frontend $\longleftrightarrow$ Backend OpenAPI Contracts**:
  * Maintain the OpenAPI/Swagger contract definitions for all endpoints touched in US-0 through US-4.
  * **US-1 / US-2 Contracts**: Formalize ticket creation schemas (`POST /api/tickets`), verifying field requirements (`description` for `REPAIR`, `endDate` for `RENT`, status locked on create).
  * **US-3 Contract**: Formalize customer deletion response schema (`DELETE /api/customers/{id}`).
  * **US-4 Contract**: Formalize inventory filter query params (`GET /api/vehicles?status=...&locationId=...`) and aggregate response envelope.
* **AWS SNS Provider Contract**:
  * Contract test ensuring mock responses and error codes (e.g., rate limits, invalid phone numbers) reflect actual AWS SNS behavior.

---

### Step 3: API Client & Gateway Component Tests

* **Frontend API Client Adapters**:
  * Test React API client layer using MSW (Mock Service Worker) to ensure frontend HTTP clients handle:
    * 400 validation error payloads correctly.
    * 409 conflict errors on active customer deletion.
    * Network timeout and retry logic.
* **Backend Gateway Components**:
  * Test `SNSService` error handling when AWS SNS is unreachable or returns a 500 error, verifying application logs without crashing user transactions.

---

### Step 4: Unit Tests (Serialization, Mapping & Helpers)

* **DTO Serialization & Deserialization**:
  * Jackson/JSON serialization tests for polymorphic ticket types and status enums.
  * Timezone and ISO-8601 date-string parsing for ticket creation and `endDate`.
* **URL & Query Param Builders**:
  * Test pure query string builder functions that convert frontend filter state to URL query parameters (`status=AVAILABLE,BROKEN&locationId=2`).

---

## Collaboration & Learning Points

* **Pair with Lane A**: Help Lane A run Testcontainers seamlessly in local environments and configure database test fixtures.
* **Pair with Lane C**: Deliver typed API contracts or MSW mock handlers so Lane C can build component tests without waiting for a live backend.
* **CI Ownership**: Wire all four test layers into GitHub Actions, ensuring integration tests run in under 2 minutes and unit tests run in seconds.
