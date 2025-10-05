package se.hjulverkstan.main.shared;

import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;

import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

public class ValidationUtils {

    /**
     * Validates that all requested IDs exist in the provided entities list.
     *
     * This is useful when you have a list of IDs from a request and want to ensure
     * that all corresponding entities exist in the database.
     *
     * <pre>
     * Example usage:
     *
     * List<Long> requestedVehicleIds = List.of(1L, 2L, 3L);
     * List<Vehicle> vehicles = vehicleRepository.findAllById(requestedVehicleIds);
     *
     * ValidationUtils.validateNoMissing(requestedVehicleIds, vehicles, Vehicle::getId, Vehicle.class);
     * </pre>
     *
     * This will throw an ElementNotFoundException if any of the IDs are missing.
     *
     * @param <T> The entity type
     * @param <ID> The ID type
     * @param requestedIds List of IDs that are expected
     * @param entities List of entities fetched from the database
     * @param idMapper Function to extract the ID from an entity
     * @param entityClass Class of the entity, used in exception message
     * @throws ElementNotFoundException if any requested ID does not exist
     */
    public static <T, ID> void validateNoMissing(
            List<ID> requestedIds,
            List<T> entities,
            Function<T, ID> idMapper,
            Class<T> entityClass
    ) {
        Set<ID> foundIds = entities.stream()
                .map(idMapper)
                .collect(Collectors.toSet());

        List<ID> missingIds = requestedIds.stream()
                .filter(id -> !foundIds.contains(id))
                .toList();

        if (!missingIds.isEmpty()) {
            throw new ElementNotFoundException(
                    entityClass.getSimpleName() + " not found for IDs: " + missingIds
            );
        }
    }
}