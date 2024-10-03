package se.hjulverkstan.main.common.exception;

import org.springframework.http.HttpStatus;

public class UnsupportedTicketTypeException extends ApiException {
    public UnsupportedTicketTypeException(String message) {
        super("unsupported_ticket_type", message, HttpStatus.BAD_REQUEST.value());
    }
}
