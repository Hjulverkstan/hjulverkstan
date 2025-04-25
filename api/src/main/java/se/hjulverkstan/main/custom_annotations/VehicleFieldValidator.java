package se.hjulverkstan.main.custom_annotations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import se.hjulverkstan.main.dto.vehicles.EditVehicleBatchDto;
import se.hjulverkstan.main.dto.vehicles.NewVehiclebatchDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class VehicleFieldValidator implements ConstraintValidator<VehicleValidation, BaseVehicleFieldValidation> {

    private static final Logger logger = LoggerFactory.getLogger(VehicleFieldValidator.class);

    @Override
    public void initialize(VehicleValidation constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(BaseVehicleFieldValidation vehicleFieldValidation, ConstraintValidatorContext context) {

        try {

            boolean isBatch = vehicleFieldValidation instanceof NewVehiclebatchDto || vehicleFieldValidation instanceof EditVehicleBatchDto;
            boolean isFullValidation = vehicleFieldValidation instanceof FullVehicleFieldValidation;

            context.disableDefaultConstraintViolation();

            if (isBatch) {
                return true; // Skip validation for batch creation
            }

            // Validate fields specific to FullVehicleFieldValidation
            if (isFullValidation) {

                FullVehicleFieldValidation fullValidation = (FullVehicleFieldValidation) vehicleFieldValidation;
                Boolean isCustomerOwned = fullValidation.getIsCustomerOwned();

                // Validate isCustomerOwned
                if (isCustomerOwned == null) {
                    context.buildConstraintViolationWithTemplate("isCustomerOwned is required for non-batch vehicles.")
                            .addPropertyNode("isCustomerOwned")
                            .addConstraintViolation();
                    return false;
                }

                // Validate regTag for all DTOs
                if (!isCustomerOwned) {
                    if (vehicleFieldValidation.getRegTag() == null || vehicleFieldValidation.getRegTag().isBlank()) {
                        context.buildConstraintViolationWithTemplate("RegTag is required.")
                                .addPropertyNode("regTag")
                                .addConstraintViolation();
                        return false;
                    }
                }

                // Validate vehicleStatus if isCustomerOwned is false
                if (!isCustomerOwned && fullValidation.getVehicleStatus() == null) {
                    context.buildConstraintViolationWithTemplate("Vehicle status is required for non-customer and non-batch vehicles.")
                            .addPropertyNode("vehicleStatus")
                            .addConstraintViolation();
                    return false;
                }
            }

            return true;
        } catch (Exception e) {
            logger.error("Validation error in VehicleFieldValidator.java: {}", e.getMessage(), e);
            return false;
        }
    }
}
