package se.hjulverkstan.main.custom_annotations;

import se.hjulverkstan.main.model.VehicleStatus;

public interface VehicleFieldValidation {
    Boolean getIsCustomerOwned();

    String getRegTag();

    VehicleStatus getVehicleStatus();
}
