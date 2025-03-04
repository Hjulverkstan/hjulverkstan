package se.hjulverkstan.Exceptions;

import org.springframework.http.HttpStatus;

public class S3DeleteException extends ApiException {
    public S3DeleteException(String message) {
        super("s3_delete_error", message, HttpStatus.SERVICE_UNAVAILABLE.value());
    }
}
