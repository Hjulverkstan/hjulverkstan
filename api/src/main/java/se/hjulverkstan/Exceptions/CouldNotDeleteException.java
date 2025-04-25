package se.hjulverkstan.Exceptions;

import org.springframework.http.HttpStatus;

public class CouldNotDeleteException extends ApiException {
    public CouldNotDeleteException(String message) {
        super("could_not_delete", message, HttpStatus.BAD_REQUEST.value());
    }
}
