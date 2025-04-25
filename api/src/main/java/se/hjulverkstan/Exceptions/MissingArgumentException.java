package se.hjulverkstan.Exceptions;

import org.springframework.http.HttpStatus;

public class MissingArgumentException extends ApiException{
        public MissingArgumentException(String argument) {
            super(HttpStatus.BAD_REQUEST.name(),  argument + " is required for this operation", HttpStatus.BAD_REQUEST.value());
        }
}
