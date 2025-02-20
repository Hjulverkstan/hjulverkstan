package se.hjulverkstan.Exceptions;

import org.springframework.http.HttpStatus;

public class UnsupportedTicketVehiclesException extends ApiException {
    public UnsupportedTicketVehiclesException(String message) {
        super("unsupported_ticket_vehicles", message, HttpStatus.BAD_REQUEST.value());
    }
}
