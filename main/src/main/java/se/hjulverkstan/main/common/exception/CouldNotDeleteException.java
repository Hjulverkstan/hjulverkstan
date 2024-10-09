package se.hjulverkstan.main.common.exception;

import org.springframework.http.HttpStatus;

public class CouldNotDeleteException extends ApiException {
    public CouldNotDeleteException(String message) {
        super("could_not_delete", message, HttpStatus.BAD_REQUEST.value());
    }
}
