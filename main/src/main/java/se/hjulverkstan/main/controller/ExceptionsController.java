package se.hjulverkstan.main.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import se.hjulverkstan.Exceptions.ApiError;
import se.hjulverkstan.Exceptions.ApiException;
import se.hjulverkstan.Exceptions.TokenRefreshException;

import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
@Slf4j
public class ExceptionsController {

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> noResourceFoundException(HttpServletRequest req, NoResourceFoundException e) {
        String message = String.format("Route %s not found", req.getRequestURI());
        log.error(message);
        ApiError apiError = new ApiError("route_not_found", message, HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError> noMethodSupportException(HttpServletRequest req, HttpRequestMethodNotSupportedException e) {
        String message = String.format("the method %s for the route %s is not found",req.getMethod(), req.getRequestURI());
        log.error(message);
        ApiError apiError = new ApiError("not_supported_method", message, HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);
    }
    @ExceptionHandler(value = { ApiException.class })
    public ResponseEntity<ApiError> apiExceptionHandler(ApiException e){
        ApiError apiError = new ApiError(e.getCode(), e.getDescription(), e.getStatusCode());
        log.error(apiError.toString());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);
    }

    @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    public ResponseEntity<ApiError> invalidInputException(MethodArgumentNotValidException e){
        List<String> errors = new ArrayList<>();
        e.getBindingResult().getAllErrors().forEach((error)->{
            errors.add(String.format("field: %s, errors: %s", ((FieldError) error).getField(),error.getDefaultMessage()));
        });
        ApiError apiError = new ApiError(e.getBody().getTitle(), errors.toString(), e.getStatusCode().value());
        return ResponseEntity.status(apiError.getStatus()).body(apiError);
    }

    @ExceptionHandler(value = { Exception.class })
    public ResponseEntity<ApiError> generalExceptionHandler(Exception e){

        System.err.println("Internal Error : " + e.getMessage());
        ApiError apiError = new ApiError("internal_error", "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);
    }

    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiError> MessageNotReadableExceptiion(HttpMessageNotReadableException ex, WebRequest request) {
        String message = String.format("The request contains invalid data: %s", ex.getMessage());
        ApiError apiError = new ApiError("bad_request", message, HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);
    }

    @ExceptionHandler(value = TokenRefreshException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<ApiError> handleTokenRefreshException(TokenRefreshException ex, WebRequest request) {
        ApiError apiError = new ApiError("internal_error",  ex.getMessage(),  HttpStatus.FORBIDDEN.value());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);

    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<ApiError> badRequest(HttpServletRequest req, Exception ex) {

        ApiError apiError = new ApiError("Invalid credentials",  ex.getMessage(),  HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);
    }
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(DataIntegrityViolationException ex, HttpServletRequest request) {
        log.error("Data Integrity Violation: " + ex.getMessage());
        String message = "Request could not be processed due to data integrity violation. ";
        ApiError apiError = new ApiError("data_integrity_error", message, HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);
    }

}
