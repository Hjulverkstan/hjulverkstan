package se.hjulverkstan.main.shared;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.hjulverkstan.main.error.ApiError;

import static org.junit.jupiter.api.Assertions.*;

class ResponseUtilsTest {

    // ─── ok() ────────────────────────────────────────────────────────────────

    @Test
    void ok_WithBody_ReturnsStatus200AndBody() {
        String body = "hello";
        ResponseEntity<String> response = ResponseUtils.ok(body);

        assertEquals(HttpStatus.OK.value(), response.getStatusCode().value());
        assertEquals("hello", response.getBody());
    }

    @Test
    void ok_WithNullBody_Returns200AndNullBody() {
        ResponseEntity<Object> response = ResponseUtils.ok(null);

        assertEquals(HttpStatus.OK.value(), response.getStatusCode().value());
        assertNull(response.getBody());
    }

    @Test
    void ok_WithObjectBody_ReturnsBodyIntact() {
        ApiError apiError = new ApiError("err", "msg", 400);
        ResponseEntity<ApiError> response = ResponseUtils.ok(apiError);

        assertEquals(HttpStatus.OK.value(), response.getStatusCode().value());
        assertSame(apiError, response.getBody());
    }

    // ─── created() ───────────────────────────────────────────────────────────

    @Test
    void created_WithBody_ReturnsStatus201AndBody() {
        String body = "created";
        ResponseEntity<String> response = ResponseUtils.created(body);

        assertEquals(HttpStatus.CREATED.value(), response.getStatusCode().value());
        assertEquals("created", response.getBody());
    }

    @Test
    void created_WithNullBody_Returns201AndNullBody() {
        ResponseEntity<Object> response = ResponseUtils.created(null);

        assertEquals(HttpStatus.CREATED.value(), response.getStatusCode().value());
        assertNull(response.getBody());
    }

    // ─── noContent() ─────────────────────────────────────────────────────────

    @Test
    void noContent_Returns204AndNoBody() {
        ResponseEntity<Void> response = ResponseUtils.noContent();

        assertEquals(HttpStatus.NO_CONTENT.value(), response.getStatusCode().value());
        assertNull(response.getBody());
    }

    // ─── error() ─────────────────────────────────────────────────────────────

    @Test
    void error_WithValidArgs_ReturnsCorrectStatusAndPayload() {
        ResponseEntity<ApiError> response = ResponseUtils.error("not_found", "Resource not found", HttpStatus.NOT_FOUND);

        assertEquals(HttpStatus.NOT_FOUND.value(), response.getStatusCode().value());

        ApiError body = response.getBody();
        assertNotNull(body);
        assertEquals("not_found", body.getError());
        assertEquals("Resource not found", body.getMessage());
        assertEquals(HttpStatus.NOT_FOUND.value(), body.getStatus());
    }

    @Test
    void error_WithBadRequest_ReturnsStatus400AndBody() {
        ResponseEntity<ApiError> response = ResponseUtils.error("bad_request", "Invalid input", HttpStatus.BAD_REQUEST);

        assertEquals(HttpStatus.BAD_REQUEST.value(), response.getStatusCode().value());

        ApiError body = response.getBody();
        assertNotNull(body);
        assertEquals("bad_request", body.getError());
        assertEquals("Invalid input", body.getMessage());
        assertEquals(400, body.getStatus());
    }

    @Test
    void error_WithInternalServerError_ReturnsStatus500() {
        ResponseEntity<ApiError> response = ResponseUtils.error("internal_error", "Server blew up", HttpStatus.INTERNAL_SERVER_ERROR);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCode().value());
        assertEquals(500, response.getBody().getStatus());
    }

    @Test
    void error_WithNullErrorAndMessage_DoesNotCrashAndReturnsValidBody() {
        ResponseEntity<ApiError> response = ResponseUtils.error(null, null, HttpStatus.BAD_REQUEST);

        assertEquals(HttpStatus.BAD_REQUEST.value(), response.getStatusCode().value());

        ApiError body = response.getBody();
        assertNotNull(body);
        assertNull(body.getError());
        assertNull(body.getMessage());
        assertEquals(400, body.getStatus());
    }

    @Test
    void error_StatusCodeIsMappedToApiErrorStatus_Precisely() {
        ResponseEntity<ApiError> r401 = ResponseUtils.error("unauth", "Unauthorized", HttpStatus.UNAUTHORIZED);
        ResponseEntity<ApiError> r403 = ResponseUtils.error("forbidden", "Forbidden", HttpStatus.FORBIDDEN);

        // Kills mutants that swap 401 ↔ 403
        assertEquals(401, r401.getBody().getStatus());
        assertEquals(403, r403.getBody().getStatus());
        assertNotEquals(r401.getBody().getStatus(), r403.getBody().getStatus());
    }
}
