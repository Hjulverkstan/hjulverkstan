package se.hjulverkstan.main.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import se.hjulverkstan.main.dto.tickets.EditTicketDto;
import se.hjulverkstan.main.dto.tickets.NewTicketDto;
import se.hjulverkstan.main.dto.tickets.TicketDto;
import se.hjulverkstan.main.dto.tickets.ValidTicket;
import se.hjulverkstan.main.model.TicketType;

/**
 * The Custom valition logic will stay on the model side, called from the @Valid annotations in the Controller
 * We can maintain this validator class easily and it follows good practice of bean validation, if any more constraints were to be added later
 * it will be clear on what class it will apply and for which type of ticket.
 */
public class TicketValidator implements ConstraintValidator<ValidTicket, Object> {

    @Override
    public boolean isValid(Object dto, ConstraintValidatorContext context) {
          switch (dto) {
              case TicketDto ticketDto -> {
                  return validateTicketDto(ticketDto, context);
              }     case NewTicketDto newTicketDto -> {
                  return validateNewTicketDto(newTicketDto, context);
              }     case EditTicketDto editTicketDto -> {
                  return ValidateEditTicketDto(editTicketDto, context);
              }   default -> {
              }
          }
        return true;
    }

    public boolean validateTicketDto(TicketDto dto, ConstraintValidatorContext context) {
        boolean isValid = true;
        TicketType type = dto.getTicketType();

        
        isValid = validateRepairDesc(type, dto.getRepairDescription(), context, isValid);
        
        if (type == TicketType.RECEIVE || type == TicketType.DONATE) {
            if (dto.getTicketStatus() != null) {
                String message = "Status must be null for " + type.name().toLowerCase() + " tickets";
                addConstraintViolation(context, "ticketStatus", message);
                isValid = false;
            }
        }
        return isValid;
    }

    
    public boolean validateNewTicketDto(NewTicketDto dto, ConstraintValidatorContext context) {
        boolean isValid = true;
        TicketType type = dto.getTicketType();

        isValid = validateRepairDesc(type, dto.getRepairDescription(), context, isValid);
        // NewTicketDto doesn't have ticketStatus, so no need to check for it, and this method could be useful to add more validation in the future
        return isValid;
    }

    public boolean ValidateEditTicketDto(EditTicketDto dto, ConstraintValidatorContext context) {
        boolean isValid = true;
        TicketType type = dto.getTicketType();

        isValid = validateRepairDesc(type, dto.getRepairDescription(), context, isValid);

        return isValid;
    }

    private boolean validateRepairDesc(TicketType type, String repariDescritption, ConstraintValidatorContext context, boolean isValid) {
        if (type == TicketType.REPAIR) {
            if (repariDescritption == null || repariDescritption.isEmpty()) {
                addConstraintViolation(context, "repairDescription", "Repair description is required");
                isValid = false;
            }
        }
        return isValid;
    }

    private void addConstraintViolation(ConstraintValidatorContext context, String field, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(field)
                .addConstraintViolation();
    }

}