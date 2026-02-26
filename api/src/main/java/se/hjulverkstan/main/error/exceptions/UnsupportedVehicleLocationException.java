package se.hjulverkstan.main.error.exceptions;

import org.springframework.http.HttpStatus;

public class UnsupportedVehicleLocationException extends ApiException{
    public UnsupportedVehicleLocationException(String message) {
        super("unsupported_vehicle_location", message, HttpStatus.BAD_REQUEST.value());
    }
}
