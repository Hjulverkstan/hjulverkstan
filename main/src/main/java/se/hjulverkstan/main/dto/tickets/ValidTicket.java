package se.hjulverkstan.main.dto.tickets;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import se.hjulverkstan.main.validator.TicketValidator;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TicketValidator.class)
public @interface ValidTicket {
    String message() default "Invalid ticket data";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}