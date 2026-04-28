package se.hjulverkstan.main.error;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import se.hjulverkstan.main.error.exceptions.ApiException;
import se.hjulverkstan.main.error.exceptions.TokenRefreshException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ExceptionsControllerTest {

    private ExceptionsController controller;

    @BeforeEach
    void setUp() {
        controller = new ExceptionsController();
    }

    private void assertExactResponse(ResponseEntity<ApiError> response, String expectedError, String expectedMessage, HttpStatus expectedStatus) {
        assertNotNull(response);
        assertEquals(expectedStatus.value(), response.getStatusCode().value());
        
        ApiError body = response.getBody();
        assertNotNull(body);
        assertEquals(expectedError, body.getError());
        assertEquals(expectedMessage, body.getMessage());
        assertEquals(expectedStatus.value(), body.getStatus());
    }

    @Test
    void apiExceptionHandler_ReturnsMappedApiException() {
        ApiException ex = new ApiException("custom_code", "Custom error occurred", 418);
        ResponseEntity<ApiError> response = controller.apiExceptionHandler(ex);

        assertExactResponse(response, "custom_code", "Custom error occurred", HttpStatus.I_AM_A_TEAPOT);
    }

    @Test
    void invalidInputException_FormatsFieldErrorsCorrectly() {
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError1 = new FieldError("objectName", "email", "must be a well-formed email address");
        FieldError fieldError2 = new FieldError("objectName", "password", "must not be blank");
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));

        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        when(ex.getBindingResult()).thenReturn(bindingResult);

        ResponseEntity<ApiError> response = controller.invalidInputException(ex);

        String expectedMessage = "field: email, error: must be a well-formed email address; field: password, error: must not be blank";
        assertExactResponse(response, "validation_error", expectedMessage, HttpStatus.BAD_REQUEST);
    }

    @Test
    void noResourceFoundException_FormatsRouteMessage() {
        HttpServletRequest req = mock(HttpServletRequest.class);
        when(req.getRequestURI()).thenReturn("/api/missing");

        NoResourceFoundException ex = mock(NoResourceFoundException.class);
        ResponseEntity<ApiError> response = controller.noResourceFoundException(req, ex);

        assertExactResponse(response, "route_not_found", "Route /api/missing not found", HttpStatus.NOT_FOUND);
    }

    @Test
    void noMethodSupportException_FormatsMethodAndRoute() {
        HttpServletRequest req = mock(HttpServletRequest.class);
        when(req.getMethod()).thenReturn("POST");
        when(req.getRequestURI()).thenReturn("/api/readonly");

        HttpRequestMethodNotSupportedException ex = mock(HttpRequestMethodNotSupportedException.class);
        ResponseEntity<ApiError> response = controller.noMethodSupportException(req, ex);

        assertExactResponse(response, "not_supported_method", "the method POST for the route /api/readonly is not found", HttpStatus.NOT_FOUND);
    }

    @Test
    void generalExceptionHandler_ReturnsGeneric500() {
        Exception ex = new Exception("Something exploded internally");
        ResponseEntity<ApiError> response = controller.generalExceptionHandler(ex);

        assertExactResponse(response, "internal_error", "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    void messageNotReadableException_FormatsInvalidData() {
        HttpMessageNotReadableException ex = new HttpMessageNotReadableException("JSON parse error");
        ResponseEntity<ApiError> response = controller.messageNotReadableException(ex);

        assertExactResponse(response, "bad_request", "The request contains invalid data: JSON parse error", HttpStatus.BAD_REQUEST);
    }

    @Test
    void handleTokenRefreshException_ReturnsForbidden() {
        TokenRefreshException ex = new TokenRefreshException("some-token", "Token expired");
        ResponseEntity<ApiError> response = controller.handleTokenRefreshException(ex);

        assertExactResponse(response, "internal_error", "Failed for [some-token]: Token expired", HttpStatus.FORBIDDEN);
    }

    @Test
    void badRequest_ForBadCredentials_ReturnsBadRequestMapping() {
        BadCredentialsException ex = new BadCredentialsException("Bad creds");
        ResponseEntity<ApiError> response = controller.badRequest(ex);

        assertExactResponse(response, "Invalid credentials", "Bad creds", HttpStatus.BAD_REQUEST);
    }

    @Test
    void handleDataIntegrityViolation_ReturnsFixedMessage() {
        DataIntegrityViolationException ex = new DataIntegrityViolationException("Constraint violation");
        ResponseEntity<ApiError> response = controller.handleDataIntegrityViolation(ex);

        assertExactResponse(response, "data_integrity_error", "Request could not be processed due to data integrity violation.", HttpStatus.BAD_REQUEST);
    }
}
