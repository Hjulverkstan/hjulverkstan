package se.hjulverkstan.Exceptions;

import org.springframework.http.HttpStatus;

public class UnsupportedVehicleTypeException extends ApiException {
    public UnsupportedVehicleTypeException(String message) {
        super("unsupported_vehicle_type", message, HttpStatus.BAD_REQUEST.value());
    }
}
