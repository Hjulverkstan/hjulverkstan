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

import java.util.List;

@ControllerAdvice
@Slf4j
public class ExceptionsController {
    @ExceptionHandler(value = { ApiException.class })
    public ResponseEntity<ApiError> apiExceptionHandler(ApiException e){
        ApiError apiError = new ApiError(e.getCode(), e.getDescription(), e.getStatusCode());

        log.error(apiError.toString(), e);
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
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

        ApiError apiError = new ApiError("validation_error", String.join("; ", errors), HttpStatus.BAD_REQUEST.value());

        log.error(apiError.toString(), e);
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> noResourceFoundException(HttpServletRequest req, NoResourceFoundException e) {
        String message = String.format("Route %s not found", req.getRequestURI());
        ApiError apiError = new ApiError("route_not_found", message, HttpStatus.NOT_FOUND.value());

        log.error(apiError.toString(), e);
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError> noMethodSupportException(HttpServletRequest req, HttpRequestMethodNotSupportedException e) {
        String message = String.format("the method %s for the route %s is not found",req.getMethod(), req.getRequestURI());
        ApiError apiError = new ApiError("not_supported_method", message, HttpStatus.NOT_FOUND.value());

        log.error(apiError.toString(), e);
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }

    @ExceptionHandler(value = { Exception.class })
    public ResponseEntity<ApiError> generalExceptionHandler(Exception e){
        System.err.println("Internal Error : " + e.getMessage());
        ApiError apiError = new ApiError("internal_error", "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR.value());

        log.error(apiError.toString(), e);
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }

    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> MessageNotReadableExceptiion(HttpMessageNotReadableException e) {
        String message = String.format("The request contains invalid data: %s", e.getMessage());
        ApiError apiError = new ApiError("bad_request", message, HttpStatus.BAD_REQUEST.value());

        log.error(apiError.toString(), e);
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }

    @ExceptionHandler(value = TokenRefreshException.class)
    public ResponseEntity<ApiError> handleTokenRefreshException(TokenRefreshException e) {
        ApiError apiError = new ApiError("internal_error",  e.getMessage(),  HttpStatus.FORBIDDEN.value());

        log.error(apiError.toString(), e);
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }

    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<ApiError> badRequest(Exception e) {
        ApiError apiError = new ApiError("Invalid credentials",  e.getMessage(),  HttpStatus.BAD_REQUEST.value());

        log.error(apiError.toString(), e);
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        String message = "Request could not be processed due to data integrity violation.";
        ApiError apiError = new ApiError("data_integrity_error", message, HttpStatus.BAD_REQUEST.value());

        log.error(apiError.toString(), e);
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }
}
