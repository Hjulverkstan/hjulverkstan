package se.hjulverkstan.main.common.exception;

import org.springframework.http.HttpStatus;

public class UnsupportedVehicleTypeException extends ApiException {
    public UnsupportedVehicleTypeException(String message) {
        super("unsupported_vehicle_type", message, HttpStatus.BAD_REQUEST.value());
    }
}
