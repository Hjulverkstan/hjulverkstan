package se.hjulverkstan.main.error.exceptions;

import org.springframework.http.HttpStatus;

public class FileContentMismatchException extends ApiException{
    public FileContentMismatchException(String message) {
        super("file_content_mismatch", message, HttpStatus.BAD_REQUEST.value());
    }
}
