package se.hjulverkstan.main.custom_annotations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import se.hjulverkstan.main.dto.vehicles.NewVehiclebatchDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class VehicleFieldValidator implements ConstraintValidator<VehicleValidation, VehicleFieldValidation> {

    private static final Logger logger = LoggerFactory.getLogger(VehicleFieldValidator.class);

    @Override
    public void initialize(VehicleValidation constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(VehicleFieldValidation vehicleFieldvalidation, ConstraintValidatorContext context) {

        try {
            Boolean isBatch = vehicleFieldvalidation instanceof NewVehiclebatchDto;
            Boolean isCustomerOwned = vehicleFieldvalidation.getIsCustomerOwned();

            context.disableDefaultConstraintViolation();

            if (isBatch) {
                return true;
            }

            // Validate isCustomerOwned
            if (isCustomerOwned == null) {
                context.buildConstraintViolationWithTemplate("isCustomerOwned is required for non-batch vehicles")
                        .addPropertyNode("isCustomerOwned")
                        .addConstraintViolation();
                return false;
            }

            // Validate regTag if isCustomerOwned is false
            if (!isCustomerOwned && (vehicleFieldvalidation.getRegTag() == null || vehicleFieldvalidation.getRegTag().isBlank())) {
                context.buildConstraintViolationWithTemplate("RegTag is required for non-customer and non-batch vehicles")
                        .addPropertyNode("regTag")
                        .addConstraintViolation();
                return false;
            }

            // Validate vehicleStatus if isCustomerOwned is false
            if (!isCustomerOwned && vehicleFieldvalidation.getVehicleStatus() == null) {
                context.buildConstraintViolationWithTemplate("Vehicle status is required for non-customer and non-batch vehicles")
                        .addPropertyNode("vehicleStatus")
                        .addConstraintViolation();
                return false;
            }

            return true;
        } catch (Exception e) {
            logger.error("Validation error in VehicleFieldValidator.java: {}", e.getMessage(), e);
            return false;
        }

    }
}
