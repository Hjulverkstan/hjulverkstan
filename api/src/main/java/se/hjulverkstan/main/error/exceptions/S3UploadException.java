package se.hjulverkstan.main.error.exceptions;

import org.springframework.http.HttpStatus;

public class S3UploadException extends ApiException {
    public S3UploadException(String message) {
        super("s3_upload_error", message, HttpStatus.SERVICE_UNAVAILABLE.value());
    }
}

