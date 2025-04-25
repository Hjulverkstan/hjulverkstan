package se.hjulverkstan.Exceptions;

import org.springframework.http.HttpStatus;

public class FileEmptyException extends ApiException {
    public FileEmptyException(String message) {
        super("file_empty_or_missing", message, HttpStatus.BAD_REQUEST.value());
    }
}
