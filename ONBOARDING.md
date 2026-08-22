# Onboarding `🧭`

> The fastest path from *"cloned the repo"* to *"I understand how a change flows through this codebase and I'm ready to make a real one."*
>
> This document is the synthesis of what every intern told us they wished they'd known **before** they started. Read it once top-to-bottom before your first task, then keep it as a reference. It points at real files, so you can always click through and see the thing for yourself.
>
> **If you only read two things:**
> 1. [The Data Flow](#the-data-flow-) — how one request travels from the browser to the database and back.
> 2. [Your First Task](#your-first-task-) — a real, end-to-end change you can make in your first day.

---

## Table of contents `📖`

  * [Table of contents `📖`](#table-of-contents-)
  * [0. Before you start `🚦`](#0-before-you-start-)
  * [1. The big picture `🗺️`](#1-the-big-picture-)
  * [2. The Data Flow `🔁`](#2-the-data-flow-)
    * [A request, end to end](#a-request-end-to-end)
    * [The frontend layers](#the-frontend-layers)
    * [The backend layers](#the-backend-layers)
  * [3. Where things live `📁`](#3-where-things-live-)
  * [4. The mental models `🧠`](#4-the-mental-models-)
    * [SSG vs CSR — the two halves of the web app](#ssg-vs-csr)
    * [Enums are value descriptors, not TypeScript enums](#enums)
    * [DataForm & DataTable — the heavy lifters](#dataform--datatable)
    * [The backend DTO pattern](#the-backend-dto-pattern)
    * [Localization](#localization)
  * [5. Your First Task `🏁`](#5-your-first-task-)
  * [6. Before you write X, check for Y `🔍`](#6-before-you-write-x-check-for-y-)
  * [7. Common pitfalls (from past interns) `⚠️`](#7-common-pitfalls-from-past-interns-)
  * [8. How to work here `🤝`](#8-how-to-work-here-)
  * [9. Where to get unstuck `🆘`](#9-where-to-get-unstuck-)

---

## 0. Before you start `🚦`

You don't need to understand the whole stack before you begin. You need to be able to run it and to know where a change lands. Do these in order:

1. **Read the [Getting Started Checklist](/README.md#getting-started-)** in the main README. It's the official entry point.
2. **Set up the environment** with [SETUP.md](/SETUP.md). When you're done you should be able to:
   - Run the backend: `cd api && ./mvn spring-boot:run -Dspring-boot.run.profiles=dev`
   - Run the frontend: `cd web && npm run dev` → open `http://localhost:5173`
   - Log into the Portal with `admin` / `password`.
3. **Read this document** (the one you're in).
4. **Do [Your First Task](#5-your-first-task-).**

> **The single most valuable habit from every past intern:** before you write any code for a task, trace one existing example of the *same kind* of change through the whole stack. Open the files, follow the data, and only then write yours. This takes 20–30 minutes and saves hours of guessing.

---

## 1. The big picture `🗺️`

Hjulverkstan is one monorepo with three modules:

| Module | Path | What it is | Stack |
|---|---|---|---|
| **`api`** | `api/` | The backend. All data, business rules, auth. | Java 21, Spring Boot, Postgres, AWS (S3, SNS) |
| **`web`** | `web/` | The frontend. Two apps in one React codebase. | React, TypeScript, Vite, TanStack Query, Tailwind, Zod |
| **`cdk`** | `cdk/` | Infrastructure as code + the deployment target. | AWS CDK (TypeScript), Docker, EC2 |

The `web` module contains **two distinct applications** that share code:

- **The public website** — a marketing site for Hjulverkstan. It's **statically generated (SSG)** and served from S3 + CloudFront. Its content is edited *inside* the Portal (see "WebEdit" below) and published by triggering a rebuild.
- **The Portal** — the internal app employees use to run the workshop. It's a traditional **client-side rendered (CSR)** SPA. This is where most of the day-to-day work happens.

The Portal is split into three "sub apps":

- **Shop** — daily operations: `Inventory` (vehicles), `Tickets`, `Customers`.
- **Admin** — `Employees`, `Users` (logins), `Locations`.
- **WebEdit** — edit the public website's content (Shops, Stories, Text) in multiple languages.

> **Why no Next.js?** The public site is SSG, but we deliberately built it with the raw React SSR API + Vite instead of a framework. The reasoning (framework volatility, simplicity) is documented in [web/README.md → Background & Motivation](/web/README.md#background--motivation-). Don't "fix" this — it's an intentional, documented decision.

---

## 2. The Data Flow `🔁`

This is the thing every intern said they wished they'd traced first. **Follow one request all the way down and back up.** Once you've done it once, the codebase stops being a maze.

### A request, end to end

Take a concrete example: **the Portal loads the list of vehicles (Inventory).**

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. VIEW LAYER (React component)                                       │
│    web/src/root/Portal/PortalShopInventory/index.tsx                  │
│    Renders the table. Consumes state from a hook. No logic.           │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ calls
┌──────────────────────────────▼───────────────────────────────────────┐
│ 2. HOOKS LAYER                                                        │
│    web/src/data/vehicle/queries.ts                                   │
│    useVehiclesQ() → wraps the API layer in TanStack Query.           │
│    Handles loading/error, caching, and any data transformation.      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ calls
┌──────────────────────────────▼───────────────────────────────────────┐
│ 3. API LAYER (frontend)                                              │
│    web/src/data/vehicle/api.ts                                       │
│    createGetVehicles() → an Axios request + a unique cache key.      │
│    Returns a raw request config; knows nothing about React.          │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTP  GET /vehicle
                               │ (base URL from VITE_API_SLUG, proxied
                               │  to :8080 in dev)
┌──────────────────────────────▼───────────────────────────────────────┐
│ 4. CONTROLLER (backend)                                              │
│    api/.../feature/vehicle/VehicleController.java                    │
│    Parses the request, delegates to the service. No business logic.  │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ calls
┌──────────────────────────────▼───────────────────────────────────────┐
│ 5. SERVICE (backend)                                                 │
│    api/.../feature/vehicle/VehicleService.java                       │
│    The business logic. Opens a transaction, loads, validates,        │
│    persists. The only place domain rules live.                       │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ calls
┌──────────────────────────────▼───────────────────────────────────────┐
│ 6. REPOSITORY + ENTITY (backend)                                     │
│    api/.../feature/vehicle/VehicleRepository.java                    │
│    api/.../feature/vehicle/model/Vehicle.java                        │
│    Spring Data JPA → Postgres.                                       │
└──────────────────────────────────────────────────────────────────────┘
```

The response travels back up the same chain: **Postgres → Repository → Service → Controller → (JSON) → api.ts → queries.ts → the component re-renders.**

**The key idea:** each layer only talks to the layer directly below it. A component never makes an HTTP call. A service never touches a repository's sibling. A DTO never reaches the database. When you know which layer you're in, you know exactly what you're allowed to do.

### The frontend layers

The `web` app is a "three-layer cake" (full explanation in [web/README.md → Three Layer Cake](/web/README.md#three-layer-cake-)):

| Layer | Where | Job |
|---|---|---|
| **View** | `web/src/root/...` and `web/src/components/` | Compose the component tree. Consume hooks. Stay free of logic. |
| **Hooks** | `web/src/data/<feature>/queries.ts` & `mutations.ts`, plus `web/src/hooks/` | Server state via TanStack Query, navigation via React Router, and data transformation/aggregation. |
| **API** | `web/src/data/<feature>/api.ts` | Axios requests + cache keys + TS types. Framework-agnostic. |

**Why split data into `web/src/data/<feature>/`?** Because for a given feature you touch files in many places, and grouping them by feature keeps them together. Each feature directory has a predictable shape:

```
web/src/data/vehicle/
  api.ts        # API layer: Axios requests + cache keys
  types.ts      # TypeScript types for this feature's data
  enums.ts      # Value descriptors (see [Enums](#enums))
  form.ts       # Zod schema + init values for create/edit forms
  queries.ts    # TanStack Query hooks (reads)
  mutations.ts  # TanStack Query hooks (writes)
```

Every feature (`vehicle`, `ticket`, `customer`, `employee`, `location`, `site`, `webedit`, `user`, `image`) follows this exact shape. **When you don't know where something is, look for the feature directory.**

### The backend layers

The `api` app is a feature-based, layered Spring Boot app (full explanation in [api/README.md → How We Do It](/api/README.md#how-we-do-it-)):

```
api/src/main/java/se/hjulverkstan/main/
  feature/
    vehicle/
      VehicleController.java   # I/O + delegation only
      VehicleService.java      # business logic, transactions
      VehicleRepository.java   # Spring Data JPA
      VehicleDto.java          # one DTO per entity, both directions
      VehicleUtils.java        # programmatic validation (bySelf / byContext)
      model/
        Vehicle.java           # the JPA entity
  shared/                      # cross-feature helpers (S3, validation, specs, ...)
  security/                    # auth, JWT, roles
  config/                      # Spring configuration
```

The **service method pattern** is the thing to internalize on the backend. Every create/edit/delete method follows the same 7 steps (see the worked example in [api/README.md → Services](/api/README.md#services-)):

```
0. Open a transaction
1. Validate the DTO against itself (if there are rules)
2. Load the entity (for edits)
3. Load context (other entities this transaction needs)
4. Validate the DTO against that context
5. Apply fields to the entity (dto.applyToEntity(...))
6. Persist
7. Construct the response DTO
```

If you read one service method slowly and map each line to those 7 steps, you've learned the backend.

---

## 3. Where things live `📁`

A quick map so you stop searching. **Click any path and read it** — the code is the best documentation.

### Frontend (`web/src/`)

| You want to... | Look in |
|---|---|
| Find a page/route | `web/src/root/` — one folder per route, e.g. `PortalShopInventory/`, `PortalShopTickets/` |
| See how routes are assembled | `web/src/root/index.tsx` |
| Change a feature's data behavior | `web/src/data/<feature>/` (api / queries / mutations / types / enums / form) |
| Add or change a form field | `web/src/data/<feature>/form.ts` (Zod schema) + the route's `...Fields.tsx` |
| Find a shared UI component | `web/src/components/` (and `components/shadcn/` for the shadcn primitives) |
| Find the "heavy lifter" table | `web/src/components/DataTable/` |
| Find the "heavy lifter" form | `web/src/components/DataForm/` |
| Find a reusable hook | `web/src/hooks/` |
| Find the HTTP client + endpoints | `web/src/data/api.ts` (the `endpoints` map is your API route table) |
| Find the SSG build/dev logic | `web/scripts/build.js` and `web/scripts/dev.js` |
| Find the client/server entry points | `web/src/client.tsx` and `web/src/server.tsx` |

### Backend (`api/src/main/java/se/hjulverkstan/main/`)

| You want to... | Look in |
|---|---|
| Find an endpoint | `feature/<feature>/<Feature>Controller.java` |
| Change business logic | `feature/<feature>/<Feature>Service.java` |
| Find the database table mapping | `feature/<feature>/model/<Entity>.java` |
| Find the request/response shape | `feature/<feature>/<Feature>Dto.java` |
| Add/fix a validation rule | `feature/<feature>/<Feature>Utils.java` |
| Touch auth / roles | `security/` |
| Touch S3 / SNS / shared helpers | `shared/` |
| Find app config | `src/main/resources/application.yml` |

### Infrastructure (`cdk/`)

| You want to... | Look in |
|---|---|
| See the AWS architecture | `cdk/README.md` (has the UML diagram) + `cdk/aws.drawio.svg` |
| See the stacks | `cdk/lib/` |
| See the deploy scripts | `cdk/assets-ec2/` (docker-compose, backups, ...) |
| See CI/CD | `.github/workflows/` (the `stage-*.yml` files are the building blocks) |

---

## 4. The mental models `🧠`

These are the concepts that, once clicked, make everything else click.

### SSG vs CSR

- **Public website = SSG.** At *build time* we render each route's HTML and bundle the WebEdit content (for each language) into the static files. Served from S3 + CloudFront. Editing content in WebEdit doesn't change the live site until someone **publishes**, which triggers a rebuild + redeploy. (Full walkthrough: [web/README.md → SSG Strategy](/web/README.md#ssg-strategy-).)
- **Portal = CSR.** Rendered in the browser on load. This is where TanStack Query does its main job, because all data is fetched live.

> If a task is "change how the public site looks/loads," think **build time**. If it's "change how the Portal behaves," think **browser time**. They're different code paths sharing components.

### Enums

In this codebase `enums.ts` files are **not** TypeScript enums. They're **type-safe value descriptors** — structured objects that carry a value *and* its UI representation (label, translation key, icon, badge variant, filter metadata). The same definition drives logic, labels, icons, and filters.

Two kinds:
- **Local enums** — defined in the frontend, for UI elements. Translated via `useTranslateRawEnums`.
- **Backend enums** — fetched via queries, for filters/selects where available values depend on data.

Two lookup helpers (in `web/src/utils/enums.ts`):
- `findEnum` — for local enums. **Throws** if missing (catches logic errors).
- `findEnumSafe` — for backend enums. **Logs and falls back** to a `?` badge (a missing backend value shouldn't crash the UI).

Full detail: [web/README.md → Enums.ts](/web/README.md#enumsts).

### DataForm & DataTable

These are the two "heavy lifter" component systems. Both use React context with a consistent pattern: **the provider holds the business logic and state; the children are pure presentation.**

- **`DataForm`** (`web/src/components/DataForm/`) — renders a full Create/Read/Update panel for an entity. You supply the declarative field definitions (in a route's `...Fields.tsx`) and it handles the create/edit/read state machine for you.
- **`DataTable`** (`web/src/components/DataTable/`) — data-driven tables with faceted filtering, search, etc.

> Because of these, **adding a field to an entity is mostly about data, not about wiring up forms and tables by hand.** That's why [Your First Task](#5-your-first-task-) is so tractable.

### The backend DTO pattern

**One DTO per entity, handling both directions** (entity → DTO and DTO → entity), for both create and edit. Each DTO has:
- A constructor `(Entity)` that builds the DTO.
- An `applyToEntity(Entity, ...relations)` that writes DTO fields onto the entity.

The rules that matter (from [api/README.md → DTOs](/api/README.md#dtos-)):
- `applyToEntity()` **must never** call repositories or services — relations it needs are passed in as arguments from the service.
- Validation is **programmatic**, in a `<Feature>Utils` class (`validateDtoBySelf` / `validateDtoByContext`), not via custom annotations.
- Controllers return DTOs directly with `@ResponseStatus` (no `ResponseEntity`).

### Localization

The public site is multi-language. Generic UI text is localized in source; **content** (stories, shops, text) is stored per-language in the backend and edited in WebEdit. The current language is derived from the URL. If you're touching WebEdit or the public site, read the localization sections in [web/README.md](/web/README.md#localization-routing-) and [api/README.md](/api/README.md) before you start — the "localized content" path (e.g. `Story.bodyText`) is handled specially and is the most common source of subtle bugs.

---

## 5. Your First Task `🏁`

> **Goal:** add a new optional field to a Vehicle, end to end. This is small enough to finish in a day, but it touches every layer, so completing it means you've now touched the whole stack.

Let's add a **`warrantyUntil`** (optional `date`) field to a Vehicle.

### Step 1 — Backend: the entity
`api/src/main/java/se/hjulverkstan/main/feature/vehicle/model/Vehicle.java`
Add the field + getter/setter (and a JPA column). This is the source of truth.

### Step 2 — Backend: the DTO
`api/src/main/java/se/hjulverkstan/main/feature/vehicle/VehicleDto.java`
- In the `VehicleDto(Vehicle)` constructor, read it off the entity.
- In `applyToEntity(...)`, write it onto the entity.
- If it's response-only, mark it read-only with `@JsonProperty(access = READ_ONLY)`.

### Step 3 — Backend: validation (only if there are rules)
`api/src/main/java/se/hjulverkstan/main/feature/vehicle/VehicleUtils.java`
If the field has a rule (e.g. "must be in the future"), add it to `validateDtoBySelf`. If it's a plain optional date, skip this.

> **Check the controller** (`VehicleController.java`) — you likely don't need to change it; it just passes the DTO through.

### Step 4 — Frontend: the type
`web/src/data/vehicle/types.ts`
Add `warrantyUntil?: string;` to the `Vehicle` interface.

### Step 5 — Frontend: the form schema
`web/src/data/vehicle/form.ts`
Add it to the Zod schema (`vehicleBaseZ` or the type-specific schema) and, if needed, to `initVehicle` (remember: arrays init to `[]`, not `undefined`).

### Step 6 — Frontend: the field UI
`web/src/root/Portal/PortalShopInventory/ShopInventoryFields.tsx`
Add the field to the `DataForm` using the existing field components. This is where you'll see the pattern — copy how a neighboring optional field is declared.

### Step 7 — Run it and verify
- Restart the backend, restart the frontend.
- In the Portal → Inventory, create a vehicle with the new field and edit one.
- Confirm it round-trips: create → read → edit → save.

### Step 8 — Commit it properly
Follow the [Git Strategy in GUIDELINES.md](/GUIDELINES.md#git-strategy-): a single-purpose commit, conventional-commit first line (`feat(api): ...` / `feat(web): ...`), a body explaining *what/why/how*, and `Solves #<issue>` if there is one. Rebase onto `main`, self-review every line, then open the PR.

> **You just did a full-stack change.** Next time, the same 8 steps apply — only the files differ. That's the whole game.

---

## 6. Before you write X, check for Y `🔍`

Past interns repeatedly reinvented things that already exist. Before you write new code, look for the existing piece:

| You're about to... | Check for |
|---|---|
| Write a new HTTP call | `web/src/data/api.ts` `endpoints` map + the feature's `api.ts` — reuse the `instance` and `createErrorHandler` |
| Write a new query hook | The feature's `queries.ts` — there's likely a `useXxxQ` already, or a `useAggregatedQueries` to compose |
| Write a new form field | `web/src/components/DataForm/` and the route's `...Fields.tsx` — use the existing field components |
| Write a new table column/filter | `web/src/components/DataTable/` and the route's `useColumns.tsx` |
| Write a new validation rule (backend) | The feature's `<Feature>Utils` — `validateDtoBySelf` / `validateDtoByContext` |
| Write a new enum/label | The feature's `enums.ts` — it's a value descriptor, add to it rather than hardcoding a label |
| Write a new error handler | `web/src/data/api.ts` `createErrorHandler` — don't hand-roll a `.catch` |
| Write a new utility | `web/src/utils/` first — "ask if a function already exists before writing a new one" is the #1 intern lesson |
| Use a raw Tailwind color (`red-500`) | The centralized theme classes — CSS is centralized in this project, use the existing `className`s |
| Add a new backend endpoint | The feature's controller + the 7-step service pattern — don't put logic in the controller |

---

## 7. Common pitfalls (from past interns) `⚠️`

These are real, recurring mistakes. Each one is a "don't do this":

- **Don't assume you must understand the whole stack first.** Start coding, look up what you don't know, and it starts to make sense. The codebase is large but well-structured — you'll find your way faster than you think.
- **Don't skip the data-flow trace.** Trace one existing example of your change before writing yours. This is the single highest-value habit.
- **Don't hardcode labels or colors.** Labels come from `enums.ts` + translations; colors come from the centralized theme.
- **Don't forget the init values.** In `form.ts`, arrays must init to `[]`, not `undefined`, or create forms break.
- **Don't let `applyToEntity()` reach for repositories/services.** Pass relations in as arguments from the service. (This has caused real "couldn't save" bugs before.)
- **Don't confuse the two web apps.** Public site = SSG (build-time). Portal = CSR (browser-time). A change to one may not affect the other.
- **Don't hand-roll error handling or HTTP.** Use `createErrorHandler` and the shared `instance`.
- **Don't write a utility that exists.** Check `web/src/utils/` and `api/.../shared/` first.
- **Don't rush the PR.** Self-review every line and test locally before asking someone else to.

---

## 8. How to work here `🤝`

- **Trunk-based development.** One branch (`main`). Small, self-contained commits that never break the system. Deploy to test/prod is done by **tags**, not branches.
- **Conventional commits.** `type(scope): Description` — e.g. `feat(web): ...`, `fix(api): ...`. Scopes are `web`, `api`, `cdk`. See the full rules in [GUIDELINES.md → Git Strategy](/GUIDELINES.md#git-strategy-).
- **Always rebase** onto `main` before opening a PR.
- **Self-review first.** Go through every line of your commits before anyone else does.
- **Take ownership of your task.** Understand it deeply, ask questions, and be ready to defend your solution in review.
- **Match the existing style.** Linting + Prettier are wired to a pre-commit hook (see [SETUP.md](/SETUP.md)). The [Principles in GUIDELINES.md](/GUIDELINES.md#principles-) — simplicity, coherence, declarative over imperative, data over logic — are the north star. When in doubt, follow the pattern of the code you're next to.

---

## 9. Where to get unstuck `🆘`

- **The docs are the first stop.** [web/README.md](/web/README.md) (frontend architecture), [api/README.md](/api/README.md) (backend patterns), [cdk/README.md](/cdk/README.md) (infra), [GUIDELINES.md](/GUIDELINES.md) (principles + git + release), [SETUP.md](/SETUP.md) (running locally).
- **Read the code of a similar feature.** The features are consistent — if you can find one that's close to what you're doing, mimic it.
- **GitHub Discussions** — the project is open source and contributions/questions are welcome.
- **The tech lead** — for anything architectural or when you're genuinely stuck, reach out (see the [Contribution section in the README](/README.md#contribution-welcome-)).

> **Last word from the interns:** *"The internship is an insanely valuable time to actually learn stuff. Don't be afraid to dive into the codebase, even if you don't understand everything at first."* You'll learn more here than in almost any other project — go build something.
