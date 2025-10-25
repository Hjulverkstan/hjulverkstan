![Hjulverkstan header"](https://raw.githubusercontent.com/Hjulverkstan/.github/images/hjulverkstan-banner-api.png)

> Welcome to the back end module of the Hjulverkstan monorepo, here is a [link](../README.md) to the main project readme.

## Table of contents `📖`

  * [Table of contents `📖`](#table-of-contents-)
  * [Acknowledged Best Practices `🏛️`](#acknowledged-best-practices-)
    * [Domain-Driven and Layered Design `🧩`](#domain-driven-and-layered-design-)
    * [Validation and Invariants `🛡️`](#validation-and-invariants-)
    * [Mapping between DTOs and Entities `📮`](#mapping-between-dtos-and-entities-)
    * [Error and Exception Handling `⚠️`](#error-and-exception-handling-)
  * [How We Do It `🛠️`](#how-we-do-it-)
    * [Packages `📦`](#packages-)
    * [DTOs `📨`](#dtos-)
    * [Controllers `🧭`](#controllers-)
    * [Services `⚙️`](#services-)
  * [Sensitivities and Considerations `⚖️`](#sensitivities-and-considerations-)
  * [Notes](#notes)
    * [Filtering](#filtering)
  * [Setting up Postman `🧑‍🚀`](#setting-up-postman-)
  * [UML Diagram `🔗`](#uml-diagram-)

## Acknowledged Best Practices `🏛️`

Before defining our own conventions, it’s important to ground them in what most experienced Java developers would consider best practice for Spring Boot applications. The common understanding can be summarized as follows:

### Domain-Driven and Layered Design `🧩`

The application follows a layered architecture in the spirit of **Domain-Driven Design** (DDD):

- Controllers handle I/O and validation of incoming data.
- Services express business use cases and orchestrate domain logic.
- Repositories abstract persistence.

This separation improves cohesion and testability, following the **Single Responsibility Principle** from **SOLID**.
 
### Validation and Invariants `🛡️`

Validation occurs where the context is known:

- DTOs carry declarative validation via Bean Validation annotations.
- Services enforce domain-level rules and cross-entity consistency.
 
This division aligns with **Separation of Concerns** and avoids duplication across layers.
 
### Mapping between DTOs and Entities `📮`

Clear and predictable mapping between transport objects and domain entities supports maintainability.
 
Manual mapping through dedicated methods (e.g. applyToEntity, constructors, or factory methods) is acceptable, however should be abstracted from DTOs if too complex. More purist DDD values would state that the DTOs not contain mappings at all and should only declare fields. Using a mapper library such as *MapStruct* or defining a separate mapping utility is therefore also a common best practice.

Regardless of path, a common ground is that mappings are **explicit**, **traceable**, and **consistent**.


### Error and Exception Handling `⚠️`
Consistent handling of business rule violations and validation errors via structured exceptions (`@ControllerAdvice`, custom exception hierarchies) provides predictable API behavior and adheres to **Fail Fast** principles.

---

If one disagrees with these premises, then we reason from different fundamentals. Contributions are welcome to make sure this section stays true to common standards and gives a fair representation..

Clarifying common ground helps as we dive deeper into *how we do it*.

## How We Do It `🛠️`

The intention behind the patterns and decisions of our project is grounded in the Best Practices mentioned, however our [GUIDELINES](../GUIDELINES.md)), generic values on software development take a strong precedence. The most essential value of which is **clarity**, the marriage of **simplicity** and **coherence**.

> The current state of the application code and the reflections of it, in **this section is a result of a refactor** (over a weekend in October 2025) giving a more thought trough design pattern. It is a step on the way, a definite upgrade, but not final. This coming presentation takes that into account, and **welcomes all form of input and contributions**.

Below we describe how we apply them in practice.

### Packages `📦`

**DDD**, **Clean Architecture** and *Spring* documentation seem to lean towards a **Layered Architecture**. In the exersice of revamping and refactoring this application, a feature based structure was applied and the result has been very subjectively pleasing. This also resonates with the feature based structuring done in the [front end](../web/README.md). Check it out 🌸.

### DTOs `📨`

We use **one DTO per entity**, handling both directions: **entity → DTO** and **DTO → entity**, regardless of create or edit. Each DTO defines:

- A `Constructor()` taking the entity and applying it to the DTO.
  ```java
  Public TicketDto (Ticket ticket) {
      ticketType = ticket.getTicketType();
      // etc
  }
   ```
- An `applyToEntity()` method that takes the entity and applies the fields from the DTO.
  ```java
  public Ticket applyToEntity(Ticket ticket) {
      ticket.setTicketType(ticketType);
      // etc
  }
  ```

The type of DTO's written are not completely dumb, their mappings have some cognitive load:

- There is no class inheritance with union discrimination, all variants of the dto live under the same hood and therefore result in some logic required in the mapping, (e.g. `type == BATCH ? batchCount : null`);
- Some fields are read only `@JsonProperty(...)`, for instance entity ids are only for responses not requests...
- The mapping, i.e. the construction of the dto and applying its field to the entity, is not always static instruction. There may be the need for accessing relations, or use heavier services to aggregate values. Here are the four examples that cover these cases (further examples in services section):
  - For already accessible and simple relational aggregation the lazily evaluated getters on the entity is used, this is neater, but means that the DTOs may never leave the transaction scope of the service, example:
  ```java
  public TicketDto (Ticket ticket) {
    // Lazily evaluated vehicles through getter, instead of passing vehicles as an argument to the constructor:
    // No need to do this in the service and pass as argument.
    vehicleIds = ticket.getVehicles().stream().map(Vehicle::getId).toList();
  }
  ```
  - For aggregations that require more than an inline lazy getter expression, such as using a static util or actual components such as services, are handled outside the DTO and passed as argument. This is needed in for instance the web edit packages:
  ```java
  // localisedBodyText requires varous layers of business logic to aggregate and is passed in from the service instead:
  public StoryDto (Story story, JsonNode localisedBodyText) {
    // ...
    bodyText = localisedBodyText;
  }
  ```
  - When applying to entity it often occurs that relations needs to be set, these are passed from the service layer (they need to be accessed from repositories):
  ```java
  public Ticket applyToEntity (Ticket ticket, List<Vehicle> vehicles, Employee employee, Customer customer) {
        // ...
        ticket.setVehicles(vehicles);
        ticket.setEmployee(employee);
        ticket.setCustomer(customer); 
  }
  ```
  - When applying to entities it is possible though that the relational update is not settable by the `applyToEntity()` method, one such case, is again, localization. In the example of `Story`, `bodyText` is stored in localized content for each language and requires more advanced care: If null value, remove existing localized content, if new value update existing localized content, if no existing entry and value add localized content – this type of relational work is simply not possible to take and assign as an argument and has to be done completely outside of the DTO.

> It is acknowledged that some DDD practitioners most likely prefer more dumb DTOs without mapping, and separate DTOs for read, write and create. With the size of the project and the neatly packed feature based modules the end result has felt clear and practical in trying it out, resulting in lesser amount of classes to reason about, and zero duplication.

> **GUIDELINES**
> `applyToEntity()` must never use other components such as repositories or services, fields of such requirements are passed as arguments. 
> DTO's may not use helpers and of course not components such as repositories or services, it is acceptable however to inline lazily get a relation for a simple task such as `ticket.getVehicles().stream().map(Vehicle::getId).toList()` but if more complex should be handled externally, and therefore passed as argument instead.

### Controllers `🧭`

Controllers only handle request parsing, response formatting, and delegation. They never perform mapping or validation beyond basic annotations.

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public VehicleDto createDto(@Valid @RequestBody VehicleDto dto) {
    return vehicleService.getAllVehicles(dto);
}
```

No additional logic lives here — no repositories, no utilities. This keeps controllers minimal and testable.

> **GUIDELINES**
> Note that we return DTOs directly (instead of ResponseEntity), minimizing footprint. Together with `@ResponseStatus()` we can create compliant REST interface without ResponseEntity:
> - Get, Get all and Edit are of status **200** which is already default status if no error thrown, controller method can be as neat as possible.
> - Create are of status **201** – `@ResponseStatus(HttpStatus.CREATED)`
> - Delete doesn't return anything (controller/service method of type void) and are of status **204** – `@ResponseStatus(HttpStatus.NO_CONTENT)`

### Services `⚙️`

Just like with DTOs and controllers our services have a strong coherence and a clear design pattern. Let's look at the responsibilities of our service methods and the clear protocol/pattern they implement :

0. Opens a **transactional boundary**.
1. If rule based validation is required, validates on itself first.
2. Loads entity if an edit.
3. Loads context if needed for this transaction (e.g. other entities).
4. If applicable, validates the dto against the loaded context (e.g. other entities).
5. Applies required fields to entity.
6. Persists
7. Construct the DTO.

```java
@Transactional
public TicketDto editTicket(Long id, TicketDto dto) {
    // 1. If rule based validation is needed apart from the DTOs bean annotations (lives in an accompanying util):
    TicketUtils.validateDtoBySelf(dto);

    // 2. Loads entity (needed for edit) and always catches element not found:
    Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));
    
    // 3. If required, loads context needed (in this case all other vehicles) and always validates if missing elements:
    List<Vehicle> vehicles = vehicleRepository.findAllById(dto.getVehicleIds());
    ValidationUtils.validateNoMissing(dto.getVehicleIds(), vehicles, Vehicle::getId, Vehicle.class); // We have a helper for this

    // 4. If required, validates the dto against loaded context (again using an accompanying util):
    TicketUtils.validateDtoByContext(dto, vehicles);

    // 5. Apply fields to entity - dto.applyToEntity also needs employee and is therefore move to a reused this.applyToEntity();
    applyToEntity(vehicle, dto, vehicles);
    
    // 6. Persist
    ticketRepository.save(ticket);
    
    // 7. Construct DTO
    return new TicketDto(ticket);
}

// This is therefore reused for both create and edit.
private void applyToEntity(Ticket ticket, TicketDto dto, List<Vehicle> vehicles) {
    Employee employee = employeeRepository.findById(dto.getEmployeeId())
            .orElseThrow(() -> new ElementNotFoundException("Employee with id: " + dto.getEmployeeId()));

    dto.applyToEntity(ticket, vehicles, employee);
}
```

Another example from web edit:

```java
// Here there is not as much validation logic involved, applyToEntity and toDto is different though:
@Transactional
public StoryDto editStoryByLang(Language lang, Long id, StoryDto dto) {
    // 2. Loads entity
    Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));

    // 5. Apply fields to entity
    applyToEntity(story, dto, lang);
    
    // 6. Persist
    storyRepository.save(story);
    
    // 7. Construct DTO using common service method to encapsulate the suage of localisation service
    return toDto(story, lang, null);
}

// Here we see that dto.applyToEntity() cant handle the updating of localized content as an argument but has to be
// handled separately, having the applyToEntity() method in the service creates a clear boundary and purpose, reused
// both by edit and create.
private void applyToEntity (Story story, StoryDto dto, Language lang) {
    dto.applyToEntity(story);

    localisationService.upsertRichText(
            story,
            lang,
            dto.getBodyText(),
            FieldName.BODY_TEXT,
            lc -> lc.setStory(story)
    );
}

// Since we need to use the localization service when creating the DTO the pattern of a common toDto() method is a
// valuable encapsulation, again creating a clear coundary and purpose, to be reused by all dto based service methods:
// get, get all, create and edit.
private StoryDto toDto (Story story, Language lang, @Nullable Language fallbackLang) {
    JsonNode bodyText = localisationService.getRichText(story, FieldName.BODY_TEXT, lang, fallbackLang);
    return new StoryDto(story, bodyText);
}
```

Having a single DTO per entity creates a **high coherency** between all services methods. Construction from entity and application to entity are defined only once — reducing duplication and keeping the pattern consistent across the codebase.

Important to note here is that there is no custom validation annotations for the DTOs, all custom validation is done by the util. This was an active decision upon writing, based on the size of the project. The opinion is that custom validation annotations takes a larger footprint and are to some degree a more complicated abstraction. The util approach, felt at the moment of writing more simple and favourable.

As mentioned, the design patterns of this application are not perfect, but it is the design pattern that we've come up with and implemented so far. **Ideas, contributions and discourse are most welcome** – that's the beauty of this project we may improve it as much as we wish.

> **GUIDELINES**
> 1. `@Transaction(readOnly = true)` on service, `@Transaction` on methods that write (e.g. create, edit, delete etc...).
> 2. Programatic validation of the DTOs (not *jakarta validation constraints* but manual validation) is never defined in service, always abstracted into a util class in the same package. Note that we do not create custom validation annotations.
>   - Validation of the DTO against itself in `validateDtoBySelf()`
>   - Validation of the DTO against other values  in `validateDtoByContext()`
> 3. If loading a list of entities from a list of primitives, always use `ValidationUtils.validateNoMissing()` to make sure missing elements are caught and thrown.
> 4. If the DTOs applyToEntity() requires more args than the entity itself, its invocation should be wrapped in a reusable `this.applyToEntity()` thus encapsulating the retrieving of relations and aggregated values from the create / edit methods. 
> 5. In the example above, the creation of the DTO is very simple, if however the construction of the DTO requires multiple arguments just like the `dto.applyToEntity()` may, move this to a `this.toDto()`, thus encapsulating the retrieving of relations and aggregated value from the service methods
> 6. We never load the same data multiple times in a transaction and always load in the service method, not embedded in helpers (e.g. `List<Vehicles>` is needed for validation **and** applying to entity, we therefore get it first, and pass to the respective methods.

## Sensitivities and Considerations `⚖️`

- Creating such a rigid design pattern for the services is not entirely favourable – it's acknowledged that if, a design pattern is not clearly defined by a framework or actual tooling but simply based on how manual implementation is to be done, the pattern is harder to follow. This refers to the guidelines of creating applyToEntity() an toDto() methods on the services, and how a util is used for validation is also entierly up to manual implementation as there is no tooling or framework to enforce a pattern. Is this actually common – to have such rigid guidelines in spring application? Is it enjoyed by developers or seen as hassle?

## Notes

### Filtering

 Vehicle contains an endpoint `/search` for server side filtering and a response for a faceted filter UI. This was done to explore how minimal a fully fledged faceted filtering could be implemented in the backend. The motivation was that the faceted filtering logic in the front end is a bit complex as it resides inside the scope of the React tree and would be nicer to have lower down in the application stack. Another motivation was also that some time down the line as datasets grow, the need for server side filtering and pagination would be required.

It does have a bit of dependencies, including the added `/shared/specs`, `/shared/FilterUtils`, `/shared/FilterResponseDto` (and other dtos for it), added filter support in `/shared/autiable` and the three filter files under `feature/vehicle`: `VehicleFilterDto`, `VehicleFilterCountDto` and `VehicleFilter`, ultimately all of this is dead code at the moment as the transition to server side filtering from the front end side would be an invested not prioritised.

At least there is a foundation there that works, and can be used if the day comes, and thruthfully was mostly motivated by a dare, after reading up on how filtering is done in Spring. Cant it be a low footprint developer experience and still remain simple at it's core? The biased conclusion of the author of the code is, *quite nice*...

## Setting up Postman `🧑‍🚀`

With the evident lack of automated tests, doing regression tests with postman is even more important and of course a good utility to have.

Go the url of your local backend or from an environment: /api/v3/api-docs and download + rename to have a json file ending.

With postman, that seems somewhat proprietary you have to have an account to support importing the open api definition. After that choose import as file and pick the download specification. Voilá, all done.

## UML Diagram `🔗`

<div>
    <img src="hjulverkstan-uml-diagram.drawio.svg">
</div>
