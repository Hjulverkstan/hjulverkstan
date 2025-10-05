package se.hjulverkstan.main.error.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidDataException extends ApiException {
    public InvalidDataException(String message) {
        super(HttpStatus.BAD_REQUEST.name(), "Invalid or missing data: " + message, HttpStatus.BAD_REQUEST.value());
    }
}
