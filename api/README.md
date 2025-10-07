![Hjulverkstan header"](https://raw.githubusercontent.com/Hjulverkstan/.github/images/hjulverkstan-banner-api.png)

> Welcome to the back end module of the Hjulverkstan monorepo, here is a [link](../README.md) to the main project readme.

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
- An `applyToEntity()` method that takes an entity and applies the fields from the DTO.

This makes one DTO a complete interface reusable in all service methods. If one DTO contains another, it may take the entities or list of entities and set it itself by reusing the nested DTO's `NestedDto::new` constructor, for instance:

```java
public GetAllVehicleDto (List<Vehicle> vehicles) {
    this.vehicles = vehicles.stream().map(VehicleDto::new).toList();
}
```

The type of DTO's written are not completely dumb, the mappings have some cognitive load:

- There is no class inheritance with union discrimination, all variant of a dto live under the same hood and therefore result in some logic required in the mapping, (e.g. `type == BATCH ? batchCount : null``);
- Some fields are read only `@JsonProperty(...)`, for instance entity ids are only for responses not requests...
- Instead of passing in relations in the construction of DTOs the lazily evaluated getters are used, this is neater, but means that the DTOs may never leave the transaction scope of the service, example:
  ```java
  public TicketDto (Ticket ticket) {
    // Lazily evaluated vehicles through getter, instead of passing vehicles as an argument to the constructor:
    vehicleIds = ticket.getVehicles().stream().map(Vehicle::getId).toList();
  }
  ```

> It is acknowledged that some DDD practitioners most likely prefer more dumb DTOs without mapping, and separate DTOs for read, write and create. With the size of the project and the neatly packed feature based modules the end result has felt clear and practical in trying it out, resulting in lesser amount of classes to reason about, and zero duplication.

However, using this pattern in the `feature/webedit/*` grows a bit in complexity. As each dto has one value that is localised, this value needs to be retrieved in the service layer. Fine, but becomes more intricate for the get all DTOs. An example:

```java
// DTO constructor:
public GetAllStoryDto (List<Story> stories, Function<Story, StoryDto> mapper) {
    this.stories = stories.stream().map(mapper).toList();
}

// Invocation in the service layer:

public GetAllStoryDto getAllStoriesByLang(Language lang, Language fallbackLang) {
    List<Story> stories = storyRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

    return new GetAllStoryDto(stories, story -> new StoryDto(story, getLocalisedValue(story, lang, fallbackLang)));
}

// In contrast to just the "get" service method:

public StoryDto getStoryByLangAndId(Language lang, Long id) {
    Story story = storyRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Story"));

    return new StoryDto(story, getLocalisedValue(story, lang));
}
```

This is done to refrain from adding another mapper class layer as the DTOs hold the mapper domain. To be coherent with the chosen style, perhaps though not a good idea in the long run...

> **GUIDELINES**
> `applyToEntity()` must never use other components such as repositories, relations are handles by the service. For clarity always comment which fields are expected to be set by the service.
> If constructors require more fields than the entity, utilize a mapper function (like in the example above) for the GetAllDto...

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

A service encapsulates a use case. It:

0. Opens a **transactional boundary**.
1. If rule based validation is required, validates on itself first.
2. Loads entity if an edit.
3. Loads context if needed for this transaction (e.g. other entities).
4. If applicable, validates the dto against the loaded context (e.g. other entities).
5. Applies the DTO fields to the entity via `applyToEntity()`.
7. Applies relations if needed as the DTO does not do this.
8. Persists and returns the entity wrapped in a new DTO.

```java
@Transactional
public TicketDto editTicket(Long id, TicketDto dto) {
    // 1. If rule based validation is needed apart from the DTOs bean annotations (lives in an accompanying util):
    TicketUtils.validateDtoBySelf(dto);

    // 2. Loads entity (needed for edit) and always catches element not found:
    Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));
    
    // 3. If required, loads context needed (in this case all other vehicles) and always validates if missing elements:
    List<Vehicle> vehicles = vehicleRepository.findAllById(dto.getVehicleIds());
    ValidationUtils.validateNoMissing(dto.getVehicleIds(), vehicles, Vehicle::getId, Vehicle.class);

    // 4. If required validates the dto against loaded context (again using an accompanying util):
    TicketUtils.validateDtoByContext(dto, vehicles);

    // 5. Use the mapper from the DTO to start mutation of entity:
    dto.applyToEntity(ticket);
    
    // 6. If needed, apply relations using a separate reusable service method and pass in possible loaded context
    applyRelationsFromDto(dto, ticket, vehicles);
    
    // 7. Persist and map back to DTO:
    ticketRepository.save(ticket);
    return new TicketDto(ticket);
}

private void applyRelationsFromDto(TicketDto dto, Ticket ticket, List<Vehicle> vehicles) {
    Employee employee = employeeRepository.findById(dto.getEmployeeId())
            .orElseThrow(() -> new ElementNotFoundException("Employee with id: " + dto.getEmployeeId()));

    ticket.setVehicles(vehicles);
    ticket.setEmployee(employee);
}
```

Having a single DTO per entity creates a **high coherency** between all services methods. Construction from entity and application to entity are defined only once — reducing duplication and keeping the pattern consistent across the codebase.

Important to note here is that there is no custom validation annotations for the DTOs, all custom validation is done by the util. This was an active decision upon writing, based on the size of the project. The opinion is that custom validation annotation takes a larger footprint and are to some degree a more complicated abstraction. The util path, felt at the moment of writing more simple and favourable.

As mentioned, the design patterns of this application are not perfect, but it is the design pattern that we've come up with and implemented so far. **Ideas, contributions and discourse are most welcome**.

>  Relations are applied explicitly, not because of a philosophical stance against cascade operations, but because the `applyToEntity()` method is intentionally simple. Relations exceed its scope, so to stay coherent, we extract that logic into `applyRelationsFromDto` methods.

> **GUIDELINES**
> 1. `@Transaction(readOnly = true)` on service, `@Transaction` on methods that write (e.g. create, edit, delete etc...).
> 2. Non-annotation validation of a DTO is never defined in service, always abstracted into a util class in the same package. Note that we do not create custom validation annotations.
>   - Validation of the DTO against itself in `validateDtoBySelf()`
>   - Validation of the DTO against other values  in `validateDtoByContext()`
> 3. If loading a list of entities from a list of primitives, always use `ValidationUtils.validateNoMissing()` to make sure missing elements are caught and thrown.
> 4. Setting relations is always done in a `applyRelationsFromDto()` method, taking the dto, then the entity, and the loaded entities if required.
> 5. We never load the same data multiple times in a transaction and always load in the service method, not embedded in helpers (e.g. `List<Vehicles>` is needed for validation **and** applying relations, we get it first pass to the respective methods.  

## Sensitivities and Considerations `⚖️`

- The combo of `applyToEntity()` and `applyRelationsFromDto()` are split up, defining them together would unify the domain of mapping. Perhaps DTOs shouldn't map themselves, but a mapper helper would help, or some other fancies (MapStruct?).
- The other combo of dto bean based validation without custom annotations and a util invoked in the service also splits up the domain.
- DTO constructors may touch **lazy relations** and are therefore sensitive and refrained to the transaction boundary.

## Setting up Postman `🧑‍🚀`

With the evident lack of automated tests, doing regression tests with postman is even more important and of course a good utility to have.

Go the url of your local backend or from an environment: /api/v3/api-docs and download + rename to have a json file ending.

With postman, that seems somewhat proprietary you have to have an account to support importing the open api definition. After that choose import as file and pick the download specification. Voilá, all done.

## UML Diagram `🔗`

<div>
    <img src="hjulverkstan-uml-diagram.drawio.svg">
</div>
