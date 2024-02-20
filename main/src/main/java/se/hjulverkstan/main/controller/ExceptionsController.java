package se.hjulverkstan.main.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import se.hjulverkstan.Exceptions.ApiError;
import se.hjulverkstan.Exceptions.ApiException;

@ControllerAdvice
public class ExceptionsController {

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> noResourceFoundException(HttpServletRequest req, NoResourceFoundException e) {
        ApiError apiError = new ApiError("route_not_found", String.format("Route %s not found", req.getRequestURI()), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError> noMethodSupportException(HttpServletRequest req, HttpRequestMethodNotSupportedException e) {
        ApiError apiError = new ApiError("not_supported_method", String.format("the method %s for the route %s is not found",req.getMethod(), req.getRequestURI()), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);
    }
    @ExceptionHandler(value = { ApiException.class })
    public ResponseEntity<ApiError> apiExceptionHandler(ApiException e){
        ApiError apiError = new ApiError(e.getCode(), e.getDescription(), e.getStatusCode());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);
    }

    @ExceptionHandler(value = { Exception.class })
    public ResponseEntity<ApiError> generalExeptionGandler(Exception e){

        System.err.println("Internal Error : " + e.getMessage());
        ApiError apiError = new ApiError("internal_error", "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(apiError.getStatus())
                .body(apiError);
    }

}
