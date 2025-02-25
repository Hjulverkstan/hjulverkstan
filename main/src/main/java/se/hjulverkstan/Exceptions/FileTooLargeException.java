package se.hjulverkstan.Exceptions;

import org.springframework.http.HttpStatus;

public class FileTooLargeException extends ApiException{
    public FileTooLargeException(String message) {
        super("file_too_large", message, HttpStatus.BAD_REQUEST.value());
    }
}
