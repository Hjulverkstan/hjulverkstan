package se.hjulverkstan.main.common.exception;

import org.springframework.http.HttpStatus;

public class UnsupportedBikeTypeException extends ApiException {
    public UnsupportedBikeTypeException(String message) {
        super("unsupported_bike_type", message, HttpStatus.BAD_REQUEST.value());
    }
}
