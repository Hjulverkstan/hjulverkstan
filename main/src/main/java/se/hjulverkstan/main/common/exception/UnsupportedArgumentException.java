package se.hjulverkstan.main.common.exception;

import org.springframework.http.HttpStatus;

public class UnsupportedArgumentException extends ApiException {
    public UnsupportedArgumentException(String argument) {
        super(HttpStatus.BAD_REQUEST.name(),  argument + " is not a valid argument for this operation", HttpStatus.BAD_REQUEST.value());
    }
}
