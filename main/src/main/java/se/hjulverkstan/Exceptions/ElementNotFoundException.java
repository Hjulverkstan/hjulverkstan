package se.hjulverkstan.Exceptions;

import org.springframework.http.HttpStatus;

public class ElementNotFoundException extends ApiException {
    public ElementNotFoundException(String element) {
        super(HttpStatus.NOT_FOUND.name(),  element + " Not Found", HttpStatus.NOT_FOUND.value());
    }
}
