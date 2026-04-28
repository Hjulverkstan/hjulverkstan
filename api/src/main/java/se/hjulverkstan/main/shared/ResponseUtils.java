package se.hjulverkstan.main.shared;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.hjulverkstan.main.error.ApiError;

/**
 * Centralized factory for building typed {@link ResponseEntity} responses.
 * Ensures consistent HTTP status codes and {@link ApiError} payload structure
 * across all API endpoints.
 */
public class ResponseUtils {

    private ResponseUtils() {
        // Utility class — no instantiation
    }

    /**
     * Returns a 200 OK response with the given body.
     */
    public static <T> ResponseEntity<T> ok(T body) {
        return ResponseEntity.ok(body);
    }

    /**
     * Returns a 201 Created response with the given body.
     */
    public static <T> ResponseEntity<T> created(T body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    /**
     * Returns a 204 No Content response with no body.
     */
    public static ResponseEntity<Void> noContent() {
        return ResponseEntity.noContent().build();
    }

    /**
     * Returns an error response with the given HTTP status, error code, and message.
     */
    public static ResponseEntity<ApiError> error(String error, String message, HttpStatus status) {
        ApiError apiError = new ApiError(error, message, status.value());
        return ResponseEntity.status(status).body(apiError);
    }
}
