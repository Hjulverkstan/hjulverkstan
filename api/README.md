![Hjulverkstan header"](https://raw.githubusercontent.com/Hjulverkstan/.github/images/hjulverkstan-banner-api.png)

> Welcome to the back end module of the Hjulverkstan monorepo, here is a [link](../README.md) to the main project readme.



## Acknowledged Best Practices

Before defining our own conventions, it’s important to ground them in what most experienced Java developers would consider best practice for Spring Boot applications. The common understanding can be summarized as follows:

### Domain-Driven and Layered Design

The application follows a layered architecture in the spirit of *Domain-Driven Design* (DDD):

- Controllers handle I/O and validation of incoming data.
- Services express business use cases and orchestrate domain logic.
- Repositories abstract persistence.

This separation improves cohesion and testability, following the *Single Responsibility Principle* from *SOLID*.
 
### Validation and Invariants

Validation occurs where the context is known:

- DTOs carry declarative validation via Bean Validation annotations.
- Services enforce domain-level rules and cross-entity consistency.
 
This division aligns with Separation of Concerns and avoids duplication across layers.
 
### Mapping between DTOs and Entities

Clear and predictable mapping between transport objects and domain entities supports maintainability.
 
Manual mapping through dedicated methods (e.g. applyToEntity, constructors, or factory methods) is acceptable, however should be abstracted from DTOs if too complex. More purist DDD values however, would state that the DTOs not contain mappings at all. Usage a mapper library such as MapStruct or defining a separate mapping utility is therefore also a common best practice.

The essential practice, of common ground, is that mappings are **explicit**, **traceable**, and **consistent**.

### Transactional and Persistence Boundaries

Services typically define transactional boundaries, reflecting the *DDD* concept of *Application Services coordinating Aggregates*. This ensures that persistence logic and lazy loading are confined within controlled transactional scopes.

### Error and Exception Handling
Consistent handling of business rule violations and validation errors via structured exceptions (`@ControllerAdvice? , custom exception hierarchies) provides predictable API behavior and adheres to *Fail Fast* principles.

---

If one disagrees with these premises, then we reason from different fundamentals. Contributions are welcome to make sure this section statys true to common standards, what would a jury of java developers say?

Clarifying common ground helps as we dive deeper into *how we do it*.

## How We Do It

The intention behind the patterns and decisions of our project is grounded in the Best Practices mentioned, however our [GUIDELINES](../GUIDELINES.md)), non-language values on software development take a strong precedence. The most essential value of which is **clarity**, the marriage of **simplicity** and **coherence**.

Below we describe how we apply them in practice.

> Hi, my name is Jona and have over a weekend refactored this backend, to best of my ability in the alloted time, of a weekend. Applying some ownership and care was quite due. Java and Spring are not my most proficient crafts but working with it at work for some time has been a surprisingly rewarding experience. The how we do it is not perfect, but a definite upgrade, if you feel compelled to take the application further, you are most welcome and appreciated.

### Packages

**DDD**, **Clean Architecture** and Spring documentation seem to lean towards a *Layered Architecture*. In the exersice of revamping this application a feature based structure was applied and the result has been very pleasing and resulted in more efficient navigation. This also resonated with the feature based structuring done in the [front end](../web/README.md)

### DTOs

We use **one DTO per entity**, handling both directions: entity → DTO and DTO → entity, regardless of create or edit. Each DTO defines:

- A constructor taking the entity and applying it to the DTO.
- An `applyToEntity` method that take an entity and applies the fields from the DTO.

This keeps DTOs a complete interface reusable in all service methods. If one DTO contains another, it may take the entities or list of entities and set it itself by reusing the `DTO::new` constructor, for instance:

```java
public GetAllVehicleDto (List<Vehicle> vehicles) {
    this.vehicles = vehicles.stream().map(VehicleDto::new).toList();
}
```

The type of DTO's written are not completely dumb, the mappings have some cognitive load:

- There are no inherited variants with union discrimination, all variant of a dto live under the same hood and therefore result in some logic required in the mapping.
- Instead of passing in relations in the construction of DTOs the lazily evaluated getters are used, this is neater, but means that the DTOs may never leave the transaction scope of the service.

> It is acknowledged that some DDD practitioners most likely prefer more dumb DTOs without mapping, and separate DTOs for read, write and create. With the size of the project and the neatly packed feature based modules the end result has felt clear and practical in trying it out.
> 
> However, using this pattern in the `feature/webedit/*` modules becomes more complex because of localization and the dto start to feel quite business owning. Perhaps you would like to explore a better solution?

> **GUIDELINES**
> `applyToEntity()` must never use other components such as repositories, relations are handles by the service. For clarity always comment which fields are expected to be set by the service.

### Controllers

Controllers only handle request parsing, response formatting, and delegation. They never perform mapping or validation beyond basic annotations.

```java
@PostMapping
public GetAllVehiclesDto getAllVehicles() {
    return vehicleService.getAllVehicles();
}
```

No additional logic lives here — no repositories, no utilities. This keeps controllers minimal and testable.

> **GUIDELINES**
> Note that we return DTOs directly (instead of ResponseEntity), together `@ResponseStatus()` we can create compliant REST interface:
> - Get, Get all and Edit are of status **200** which is already default status if no error thrown, controller method can be as neat as possible.
> - Create are of status **201** – `@ResponseStatus(HttpStatus.CREATED)`
> - Delete doesn't return anything (controller/service method of type void) and are of status **204** – `@ResponseStatus(HttpStatus.NO_CONTENT)`

### Services

A service encapsulates a use case. It:

0. Opens a **transactional boundary**.
1. If business logic validation is required, validates on itself first.
2. Loads entity if an edit.
3. Loads context if needed for this transaction (for instance other entities).
4. If applicable, validates the dto against the loaded context.
5. Applies the DTO fields to the entity via `applyToEntity()`.
7. Applies relations if needed as the DTO does not do this.
8. Persists and returns the entity wrapped in a new DTO.


```java
@Transactional
public TicketDto editTicket(Long id, TicketDto dto) {
    // 1. If validation apart from the DTOs bean annotations are required:
    TicketUtils.validateDtoBySelf(dto);

    // 2. Loads entity and always catches element not found:
    Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));
    
    // 3. If required loads context needed:
    List<Vehicle> vehicles = vehicleRepository.findAllById(dto.getVehicleIds());
    ValidationUtils.validateNoMissing(dto.getVehicleIds(), vehicles, Vehicle::getId, Vehicle.class);

    // 4. If required validates the dto against loaded context.
    TicketUtils.validateDtoByContext(dto, vehicles);

    // 5. Use the mapper from the DTO
    dto.applyToEntity(ticket);
    
    // 6. If needed, apply relations using service defined method and pass in possible loaded context
    applyRelationsFromDto(dto, ticket, vehicles);
    
    // 7. Persist and map back to DTO
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

Having a single DTO per entity creates a **high coherency** between all methods and services. Construction from entity and application to entity are defined only once — reducing duplication and keeping the pattern consistent across the codebase.

As mentioned, it is not perfect, but it is the design pattern that we've come up with and implemented so far. **Ideas and contributions are most welcome**.

>  Relations are applied explicitly, not because of a philosophical stance against cascade operations, but because the `applyToEntity` method is intentionally simple. Relations exceed its scope, so to stay coherent, we extract that logic into `applyRelationsFromDto` methods.

> **GUIDELINES**
> 1. `@Transaction(readOnly = true)` on service, `@Transaction` methods that write (e.g. create, edit, delete etc.).
> 2. Business logic validation of a DTO is never defined in service, always abstracted into a util class in the same package.
     >   2.1. Validation of the DTO against itself in `validateDtoBySelf()`
     >   2.2. Validation of the DTO against other values  in `validateDtoByContext()`
> 3. If loading a list of entities from a list of primitives, always use `ValidationUtils.validateNoMissing()` to make sure missing elements are caught and thrown.
> 4. Setting relations is always done in a `applyRelationsFromDto()` method, taking the dto, then the entity, and the loaded entities if required.
> 5. We never load the same data multiple time in a transaction and always load in the service method, not embedded in helpers. If say, `List<Vehicles>` is needed for validation and applying relations, we get it first and then pass down the line.  

## Sensitivities and Considerations

- The combo of `applyToEntity()` and `applyRelationsFromDto()` are split up, defining them together would unify the domain of mapping. Perhaps DTOs shouldn't map themselves, but a mapper helper would help or some other fancies.
- Web edit's DTO's are a bit too intelligent for their own good. Would another approach to mapping help here?
- DTO constructors may touch **lazy relations** and are therefore sensitive and refrained to the transaction boundary.

## UML Diagram

<div>
    <img src="hjulverkstan-uml-diagram.drawio.svg">
</div>
