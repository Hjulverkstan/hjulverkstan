package se.hjulverkstan.Exceptions;

import org.springframework.http.HttpStatus;

public class UnsupportedFileTypeException extends ApiException {
    public UnsupportedFileTypeException(String message) {
        super("unsupported_image_file_type", message, HttpStatus.BAD_REQUEST.value());
    }
}
