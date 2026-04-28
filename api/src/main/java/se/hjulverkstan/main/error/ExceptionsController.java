package se.hjulverkstan.main.error;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import se.hjulverkstan.main.error.exceptions.ApiException;
import se.hjulverkstan.main.error.exceptions.TokenRefreshException;
import se.hjulverkstan.main.shared.ResponseUtils;

import java.util.List;

@ControllerAdvice
@Slf4j
public class ExceptionsController {

    @ExceptionHandler(value = { ApiException.class })
    public ResponseEntity<ApiError> apiExceptionHandler(ApiException e){
        ResponseEntity<ApiError> response = ResponseUtils.error(e.getCode(), e.getDescription(), HttpStatus.valueOf(e.getStatusCode()));
        log.error(response.getBody().toString(), e);
        return response;
    }

    @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    public ResponseEntity<ApiError> invalidInputException(MethodArgumentNotValidException e){
        List<String> errors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError -> String.format("field: %s, error: %s",
                        fieldError.getField(),
                        fieldError.getDefaultMessage()))
                .toList();

        ResponseEntity<ApiError> response = ResponseUtils.error("validation_error", String.join("; ", errors), HttpStatus.BAD_REQUEST);
        log.error(response.getBody().toString(), e);
        return response;
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> noResourceFoundException(HttpServletRequest req, NoResourceFoundException e) {
        String message = String.format("Route %s not found", req.getRequestURI());
        ResponseEntity<ApiError> response = ResponseUtils.error("route_not_found", message, HttpStatus.NOT_FOUND);
        log.error(response.getBody().toString(), e);
        return response;
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError> noMethodSupportException(HttpServletRequest req, HttpRequestMethodNotSupportedException e) {
        String message = String.format("the method %s for the route %s is not found", req.getMethod(), req.getRequestURI());
        ResponseEntity<ApiError> response = ResponseUtils.error("not_supported_method", message, HttpStatus.NOT_FOUND);
        log.error(response.getBody().toString(), e);
        return response;
    }

    @ExceptionHandler(value = { Exception.class })
    public ResponseEntity<ApiError> generalExceptionHandler(Exception e){
        ResponseEntity<ApiError> response = ResponseUtils.error("internal_error", "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        log.error(response.getBody().toString(), e);
        return response;
    }

    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> messageNotReadableException(HttpMessageNotReadableException e) {
        String message = String.format("The request contains invalid data: %s", e.getMessage());
        ResponseEntity<ApiError> response = ResponseUtils.error("bad_request", message, HttpStatus.BAD_REQUEST);
        log.error(response.getBody().toString(), e);
        return response;
    }

    @ExceptionHandler(value = TokenRefreshException.class)
    public ResponseEntity<ApiError> handleTokenRefreshException(TokenRefreshException e) {
        ResponseEntity<ApiError> response = ResponseUtils.error("internal_error", e.getMessage(), HttpStatus.FORBIDDEN);
        log.error(response.getBody().toString(), e);
        return response;
    }

    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<ApiError> badRequest(Exception e) {
        ResponseEntity<ApiError> response = ResponseUtils.error("Invalid credentials", e.getMessage(), HttpStatus.BAD_REQUEST);
        log.error(response.getBody().toString(), e);
        return response;
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        String message = "Request could not be processed due to data integrity violation.";
        ResponseEntity<ApiError> response = ResponseUtils.error("data_integrity_error", message, HttpStatus.BAD_REQUEST);
        log.error(response.getBody().toString(), e);
        return response;
    }
}
