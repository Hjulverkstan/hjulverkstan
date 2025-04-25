package se.hjulverkstan.Exceptions;

import org.springframework.http.HttpStatus;

public class FileProcessingException extends ApiException {
    public FileProcessingException(String message, HttpStatus status) {
        super("file_processing_error", message, status.value());
    }

    public FileProcessingException(String message) {
        super("file_processing_error", message, HttpStatus.INTERNAL_SERVER_ERROR.value());
    }
}



