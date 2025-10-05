package se.hjulverkstan.main.error.exceptions;

import org.springframework.http.HttpStatus;

public class DataViolationException extends ApiException{
    public DataViolationException(String reason) {
        super(HttpStatus.BAD_REQUEST.name(), "Request violates data integrity: " + reason, HttpStatus.BAD_REQUEST.value());
    }
}
