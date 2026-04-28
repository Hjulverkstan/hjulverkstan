package se.hjulverkstan.main.shared;
 
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.MissingArgumentException;
import se.hjulverkstan.main.error.exceptions.UnsupportedArgumentException;
import se.hjulverkstan.main.error.exceptions.InvalidDataException;
 
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
 
public class ValidationUtils {
 
    /**
     * Validates that a string is not null and not blank (not empty or only whitespace).
     * @param value The string to validate
     * @param fieldName The name of the field (used in exception message)
     * @throws MissingArgumentException if string is null or blank
     */
    public static void validateNotBlank(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new MissingArgumentException(fieldName);
        }
    }
 
    /**
     * Validates that an object is not null.
     * @param value The object to validate
     * @param fieldName The name of the field (used in exception message)
     * @throws MissingArgumentException if object is null
     */
    public static void validateNotNull(Object value, String fieldName) {
        if (value == null) {
            throw new MissingArgumentException(fieldName);
        }
    }
 
    /**
     * Validates that a numeric value is positive (greater than 0).
     * @param value The value to validate
     * @param fieldName The name of the field (used in exception message)
     * @throws UnsupportedArgumentException if value is null or <= 0
     */
    public static void validatePositive(Long value, String fieldName) {
        if (value == null || value <= 0) {
            throw new UnsupportedArgumentException(fieldName + " must be positive");
        }
    }
 
    /**
     * Validates that all requested IDs exist in the provided entities list.
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
        if (requestedIds == null || requestedIds.isEmpty()) {
            return;
        }
 
        Set<ID> foundIds = entities == null ? Set.of() : entities.stream()
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

    /**
     * Validates that a string matches a regex pattern.
     */
    public static void validatePattern(String value, String regex, String fieldName) {
        if (value != null && !value.matches(regex)) {
            throw new InvalidDataException(fieldName + " has invalid format");
        }
    }

    /**
     * Validates that a string matches a basic email pattern.
     */
    public static void validateEmail(String email, String fieldName) {
        if (email != null && !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new InvalidDataException(fieldName + " must be a valid email address");
        }
    }
}