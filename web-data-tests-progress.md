# Web Data Folder Testing Progress

This file tracks the progress of creating tests for the `web/src/data` folder.

## Batch 1: Core Data Files
- [x] `web/src/data/api.ts`
- [x] `web/src/data/form.ts`
- [x] `web/src/data/queries.ts`
- [ ] `web/src/data/types.ts` (Type-only, no runtime logic)

## Batch 2: Auth Data
- [x] `web/src/data/auth/api.ts`
- [ ] `web/src/data/auth/types.ts` (Type-only)

## Batch 3: Vehicle Data
- [x] `web/src/data/vehicle/api.ts`
- [x] `web/src/data/vehicle/enums.ts` (Static)
- [x] `web/src/data/vehicle/form.ts`
- [x] `web/src/data/vehicle/mutations.ts`
- [x] `web/src/data/vehicle/queries.ts`
- [ ] `web/src/data/vehicle/types.ts` (Type-only)

## Batch 4: Customer & Employee Data
- [x] `web/src/data/customer/api.ts`
- [x] `web/src/data/customer/mutations.ts`
- [x] `web/src/data/customer/queries.ts`
- [x] `web/src/data/customer/form.ts`
- [ ] `web/src/data/customer/types.ts` (Type-only)
- [ ] `web/src/data/customer/enums.ts` (Enum-only)
- [x] `web/src/data/employee/api.ts`
- [x] `web/src/data/employee/mutations.ts`
- [x] `web/src/data/employee/queries.ts`
- [x] `web/src/data/employee/form.ts`
- [ ] `web/src/data/employee/types.ts` (Type-only)

## Batch 5: image + site
- [x] `web/src/data/image/api.ts`
- [x] `web/src/data/image/mutations.ts`
- [x] `web/src/data/site/api.ts`

## Batch 6: location
- [x] `web/src/data/location/api.ts`
- [x] `web/src/data/location/mutations.ts`
- [x] `web/src/data/location/queries.ts`
- [x] `web/src/data/location/form.ts`
- [ ] `web/src/data/location/types.ts` (Type-only)
- [ ] `web/src/data/location/enums.ts` (Enum-only)

## Batch 7: ticket
- [x] `web/src/data/ticket/api.ts`
- [x] `web/src/data/ticket/mutations.ts`
- [x] `web/src/data/ticket/queries.ts`
- [x] `web/src/data/ticket/form.ts`
- [ ] `web/src/data/ticket/types.ts` (Type-only)
- [ ] `web/src/data/ticket/enums.ts` (Enum-only)

## Batch 8: user
- [x] `web/src/data/user/api.ts`
- [x] `web/src/data/user/mutations.ts`
- [x] `web/src/data/user/queries.ts`
- [x] `web/src/data/user/form.ts`
- [ ] `web/src/data/user/types.ts` (Type-only)
- [ ] `web/src/data/user/enums.ts` (Enum-only)

## Batch 9: webedit
- [ ] `web/src/data/webedit/api.ts`
- [ ] `web/src/data/webedit/queries.ts`
- [ ] `web/src/data/webedit/shop/api.ts`
- [ ] `web/src/data/webedit/shop/mutations.ts`
- [ ] `web/src/data/webedit/shop/queries.ts`
- [ ] `web/src/data/webedit/shop/form.ts`
- [ ] `web/src/data/webedit/shop/utils.ts`
- [ ] `web/src/data/webedit/story/api.ts`
- [ ] `web/src/data/webedit/story/mutations.ts`
- [ ] `web/src/data/webedit/story/queries.ts`
- [ ] `web/src/data/webedit/story/form.ts`
- [ ] `web/src/data/webedit/text/api.ts`
- [ ] `web/src/data/webedit/text/mutations.ts`
- [ ] `web/src/data/webedit/text/queries.ts`
- [ ] `web/src/data/webedit/text/form.ts`

## Batch 10: translations + warning
- [ ] `web/src/data/translations/index.ts` (Type-only re-export)
- [ ] `web/src/data/warning/types.ts` (Type-only)
- [ ] `web/src/data/warning/enums.ts` (Static enum data)

---
## Summary of Work
| Batch | Files Tested | Iterations | Corrections | Intervention Level | Status |
|-------|--------------|------------|-------------|--------------------|--------|
| 1 | api.ts, form.ts, queries.ts | 3 | Fixed AxiosError instanceof check | Low | Done |
| 2 | auth/api.ts | 2 | Missing request object in AxiosError mocks | Low | Done |
| 3 | vehicle/api, form, queries, mutations | 6 | TSX renaming, mock call indexing, Aggregated hook expectations | Medium | Done |
| 4 | customer/api, mutations, queries, form; employee/api, mutations, queries, form | 2 | Unused imports removed, AggregatedCustomer type cast for `.age` | Low | Done |
| 5 | image/api, mutations; site/api | 1 | Mocked both `./api` and `@data/image/api` paths for alias resolution safety | Low | Done |
| 6 | location/api, mutations, queries, form | 1 | vehicleCount cast via `as any` (same pattern as AggregatedCustomer) | Low | Done |
| 7 | ticket/api, mutations, queries, form | 1 | Mocked `../customer/api` for cross-domain invalidation; `useTicketsAggregatedQ` skipped (depends on `useAggregatedQueries` internals) | Low | Done |
| 8 | user/api, mutations, queries, form | 1 | No issues; `Mode` enum imported directly from `@components/DataForm` without mocking | Low | Done |

---
## Session Log

### Session 1 — Gemini Flex
- Batches 1–3 completed. See summary table above.
- Batch 4 partially started: customer (all 4 files), employee/api, employee/form.

### Session 2 — Claude (Sonnet 4.6) — 2026-05-05

**Context gathered:**
- Read `testing-guidelines.md` — AAA pattern, Phase 1→2→3→4 protocol, `@testing-library/user-event` only, no `fireEvent`, no `container.querySelector`, Vitest + RTL stack.
- Read `web/GUIDELINES.md` — React architecture (dumb components, hooks, Three Layer Cake, context components).
- Full read of `web/src/` file tree and all data layer source files.
- Read all existing test files (Batches 1–3) to understand established patterns.

**Batch 4 Plan — proposed 2026-05-05, approved & executed 2026-05-05:**

*customer/mutations.test.tsx — fix & complete (4 cases)*
- Fix wrong import: `useDeleteCustomerM` → `useHardDeleteCustomerM`
- `useCreateCustomerM` invalidates list + single query on success
- `useEditCustomerM` invalidates list + single query on success
- `useHardDeleteCustomerM` invalidates list only on success
- `useSoftDeleteCustomerM` invalidates list only on success

*customer/form.test.ts — fix & complete (7 cases)*
- Fix phone numbers to use `+46xxxxxxxxx` format throughout
- `initCustomer` defaults to `CustomerType.PERSON`
- Valid PERSON (firstName, phoneNumber `+46701234567`) passes
- Valid ORG (firstName, phoneNumber, organizationName) passes
- ORG without `organizationName` fails
- Invalid email (non-empty, non-valid) fails
- Invalid phone format fails
- Invalid Swedish PIN fails

*customer/queries.test.tsx — fix & complete (8 cases)*
- Fix `calculateAge` assertions to be date-independent (use `differenceInYears` logic, not hardcoded numbers)
- `calculateAge` returns correct age for a valid PIN
- `calculateAge(null)` and `calculateAge(undefined)` return `undefined`
- `useCustomersQ` augments each customer with `age`
- `useCustomerQ` enabled when id truthy, disabled when falsy
- `useCustomersAsEnumsQ` label for `PERSON` is `"firstName lastName | phone"`
- `useCustomersAsEnumsQ` label for `ORG` is `"orgName | phone"`
- `useCustomersAsEnumsQ` with `withOrgPerson: true` adds contact person to ORG label
- `useCustomersAsEnumsQ` with `excludeAnonymized: true` filters out anonymized customers

*employee/api.test.ts — fix & complete (6 cases)*
- Add missing `createSoftDeleteEmployee` test → deletes to `/employee/{id}` (no `/purge`)
- All other 5 existing cases kept

*employee/mutations.test.ts — write from scratch (4 cases)*
- `useCreateEmployeeM` invalidates list + single on success
- `useEditEmployeeM` invalidates list + single on success
- `useDeleteEmployeeM` invalidates list only on success
- `useSoftDeleteEmployeeM` invalidates list only on success

*employee/queries.test.ts — write from scratch (4 cases)*
- `useEmployeesQ` calls the api factory
- `useEmployeeQ` enabled when id truthy, disabled when falsy
- `useEmployeesAsEnumsQ` label is `"firstName lastName"`, value is `employee.id`
- `useEmployeesAsEnumsQ` custom `dataKey` is applied to each result

*employee/form.test.ts — fix & complete (5 cases)*
- Fix phone numbers to `+46xxxxxxxxx` format
- `initEmployee` is an empty object
- Valid employee (all fields) passes
- Missing `firstName` fails
- Invalid email fails with `'The email is not a valid email address'`
- Optional PIN: invalid format fails when provided

---

**Batch 5 Plan — proposed 2026-05-05, approved & executed 2026-05-05:**

*image/api.ts (2 cases)*
- `createUploadImage` — appends file to FormData, posts to `/image/upload`, returns `res.data.imageURL` (not full `res.data`)
- `createDeleteImage` — deletes to `/image/delete?imageURL=<encoded>` with URL-encoded imageURL

*image/mutations.ts (4 cases)*
- `useUploadImageM` — spreads api factory, no onSuccess
- `useDeleteImageM` — spreads api factory, no onSuccess
- `useDeleteAndSetVehicleImage` — skips delete when no imageURL, calls deleteImage then editVehicle; invalidates vehicle list on success
- `useUploadAndSetVehicleImage` — calls uploadImage to get imageURL, then editVehicle with new imageURL; invalidates vehicle list on success

*site/api.ts (3 cases)*
- `createGetPublicVehiclesByLocation` — queryKey `['/site/vehicle', 'location', locationId]`, fetches `GET /site/vehicle/location/{locationId}`, returns `content`
- `createGetPublicVehiclesByLocation` with `undefined` locationId — queryKey includes undefined, endpoint called with undefined segment
- `createGetPublicVehicleById` — queryKey `['/site/vehicle', id]`, fetches `GET /site/vehicle/{id}`, returns full object

---

**Batch 6 Plan — proposed 2026-05-05, approved & executed 2026-05-05:**

*location/api.ts (6 cases)*
- `createGetLocations` — queryKey `['/location']`, returns `content`
- `createGetLocation({ id })` — queryKey `['/location', id]`, fetches single location
- `createCreateLocation` — posts to `/location`, returns `res.data`
- `createEditLocation` — puts to `/location/{id}` with body minus id (id stripped)
- `createDeleteLocation` — deletes to `/location/{id}/hard`
- `createSoftDeleteLocation` — deletes to `/location/{id}` (no `/hard`)

*location/mutations.ts (4 cases)*
- `useCreateLocationM` — invalidates list + single on success
- `useEditLocationM` — invalidates list + single on success
- `useDeleteLocationM` — invalidates list only on success
- `useSoftDeleteLocationM` — invalidates list only on success

*location/queries.ts (5 cases)*
- `useLocationsQ` — `select` augments each location with `vehicleCount = vehicleIds.length`
- `useLocationsQ` — `vehicleCount` defaults to 0 when `vehicleIds` is empty
- `useLocationQ` — enabled when id truthy, not fetching when id empty
- `useLocationsAsEnumsQ` — maps to `label = location.name`, `value = location.id`
- `useLocationsAsEnumsQ` with `allowedTypes` — filters to only matching locationType

*location/form.ts (4 cases)*
- `initLocation` — has `vehicleIds: []`
- Valid SHOP (locationType, name, address) passes
- Valid STORAGE (locationType, name, address) passes
- Missing `name` fails

---

**Batch 7 Plan — proposed 2026-05-05, approved & executed 2026-05-05:**

*ticket/api.ts (7 cases)*
- `createGetTickets`, `createGetTicket({ id })` — standard list/single pattern
- `createCreateTicket` — posts to `/ticket`
- `createEditTicket` — puts to `/ticket/{id}` with body minus id
- `createUpdateTicketStatus` — puts to `/ticket/{id}/status` with only `{ ticketStatus }` (not full body)
- `createDeleteTicket` — deletes to `/ticket/{id}/hard`
- `createSoftDeleteTicket` — deletes to `/ticket/{id}`

*ticket/mutations.ts (5 cases)*
- `useCreateTicketM` — invalidates tickets list + single on success
- `useEditTicketM` — invalidates tickets list + single on success
- `useSoftDeleteTicketM` — invalidates tickets list AND customers list (cross-domain invalidation)
- `useDeleteTicketM` — same cross-domain invalidation as soft delete
- `useUpdateTicketStatusM` — receives `(data, vars)`, uses `vars.id` to invalidate list + single

*ticket/queries.ts (3 cases)*
- `useTicketsQ` with no ticketIds — returns all tickets unfiltered
- `useTicketsQ` with `ticketIds` — filters to only matching ids
- `useTicketQ` — enabled when id truthy, not fetching when id empty
- Note: `useTicketsAggregatedQ` skipped — depends on `useAggregatedQueries` hook internals; too complex to isolate

*ticket/form.ts (6 cases)*
- `initTicket()` — defaults to `TicketType.REPAIR`, empty `vehicleIds`, undefined `locationId`
- `initTicket('loc1', ['v1'])` — sets `locationId` and `vehicleIds`
- Valid REPAIR ticket (vehicleIds, employeeId, customerId, repairDescription) passes
- Valid RENT ticket (vehicleIds, employeeId, customerId, startDate, endDate) passes
- REPAIR ticket missing `repairDescription` fails
- RENT ticket missing `startDate` fails
- Base ticket missing `vehicleIds` (empty array) fails with "At least one vehicle is required"

---

**Batch 8 Plan — proposed 2026-05-05, approved & executed 2026-05-05:**

*user/api.ts (6 cases)*
- `createGetUsers`, `createGetUser({ id })` — standard pattern
- `createCreateUser` — posts to `/user`
- `createEditUser` — puts to `/user/{id}` with body minus id
- `createSoftDeleteUser` — deletes to `/user/{id}` (no `/hard`)
- `createDeleteUser` — deletes to `/user/{id}/hard`

*user/mutations.ts (4 cases)*
- `useCreateUserM` — invalidates list + single on success
- `useEditUserM` — invalidates list + single on success
- `useSoftDeleteUserM` — invalidates list only on success
- `useDeleteUserM` — invalidates list only on success

*user/queries.ts (2 cases)*
- `useUsersQ` — calls the api factory
- `useUserQ` — enabled when id truthy, not fetching when id empty

*user/form.ts (7 cases)*
- `initUser` — has `roles: []`
- `createUserZ(Mode.CREATE)` — valid user (lowercase username, valid email, password ≥ 3, matching passwordrepeat) passes
- `createUserZ(Mode.CREATE)` — mismatched passwords fails with `'Passwords must match'`
- `createUserZ(Mode.CREATE)` — username with uppercase or special chars fails
- `createUserZ(Mode.CREATE)` — empty roles array fails
- `createUserZ(Mode.EDIT)` — valid user without password passes (password optional in edit mode)
- `createUserZ(Mode.CREATE)` — password under 3 characters fails

---

**Batch 9 Plan — proposed 2026-05-05, approved & executed 2026-05-05:**

*Key pattern:* All webedit sub-domains use a `lang` param in every queryKey, query params, and mutation. This is unique to webedit vs all previous batches.

*webedit/api.ts (3 cases)*
- `getAllWebEditEntitiesByLang({ fallbackLang: 'en' })` — direct fn (not factory), calls GET `/web-edit/get-all` with `{ params: { fallbackLang } }`, returns `res.data.entities`
- `getAllWebEditEntitiesByLang` with optional `baseURL` — passes baseURL to instance config
- `createGetLangCount({ entity })` — queryKey `[count, entity]`, fetches `GET /web-edit/count/{entity}`

*webedit/queries.ts (1 case)*
- `useLangCountQ({ entity })` — calls `createGetLangCount` with entity

*webedit/shop/api.ts (6 cases)*
- `createGetShops({ lang })` — queryKey includes lang, sends `{ params: { lang } }`, returns content
- `createGetShop({ id, lang })` — queryKey `[shop, id, lang]`, sends lang as query param
- `createCreateShop` — posts with body (lang stripped to params, NOT body)
- `createEditShop` — puts to `/shop/{id}` stripping BOTH id AND lang from body
- `createDeleteShop` — deletes `/shop/{id}/hard` with lang as query param
- `createSoftDeleteShop` — deletes `/shop/{id}` with lang as query param

*webedit/shop/mutations.ts (4 cases)*
- `useCreateShopM` — `onSuccess({ id }, { lang })` invalidates list + single (both include lang in queryKey)
- `useEditShopM` — same as create
- `useDeleteShopM` — `onSuccess(_, { lang })` invalidates list only
- `useSoftDeleteShopM` — same as delete

*webedit/shop/queries.ts (2 cases)*
- `useShopsQ({ lang })` — calls api factory with lang
- `useShopQ({ id, lang })` — enabled when id truthy

*webedit/shop/form.ts (4 cases)*
- `initShop` — has `hasTemporaryHours: true` and `openHours: {}`
- `createShopZ()` — `hasTemporaryHours: true` passes with no openHours (flag bypasses requirement)
- `createShopZ()` — `hasTemporaryHours: false` with valid openHours entry passes
- `createShopZ()` — `hasTemporaryHours: false` with empty openHours fails with message

*webedit/shop/utils.ts (4 cases — pure function `isShopOpen`)*
- Returns `true` when current time is within open hours for that day
- Returns `false` when current time is outside open hours
- Returns `false` for null/undefined openHours
- Returns `false` for invalid time format string

*webedit/story/api.ts (6 cases)* — mirrors shop API pattern
*webedit/story/mutations.ts (4 cases)* — note: story delete + softDelete BOTH invalidate list AND single (unlike shop where delete only invalidates list)
*webedit/story/queries.ts (2 cases)*
*webedit/story/form.ts (3 cases)*
- `initStory` — empty object
- `createStoryZ()` — valid story (title + slug) passes
- `createStoryZ()` — missing title fails; missing slug fails

*webedit/text/api.ts (4 cases)* — no create factory; text entities already exist
- `createGetTexts({ lang })`, `createGetText({ id, lang })`, `createEditText`, `createDeleteText` (deletes for a lang only, not the entity)

*webedit/text/mutations.ts (2 cases)*
- `useEditTextM` — invalidates list + single
- `useDeleteTextM` — invalidates list + single (same as edit — delete removes a lang translation, not the entity)

*webedit/text/queries.ts (2 cases)*
*webedit/text/form.ts (2 cases)*
- `createTextZ()` — valid `{ value: 'some text' }` passes
- `createTextZ()` — missing `value` key fails
