package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.custom_annotations.FullVehicleFieldValidation;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.model.VehicleStatus;
import se.hjulverkstan.main.model.VehicleType;
import se.hjulverkstan.main.custom_annotations.VehicleValidation;

@Data
@AllArgsConstructor
@NoArgsConstructor
@VehicleValidation
public class NewVehicleDto implements FullVehicleFieldValidation {
    private String regTag;
    @NotNull(message = "Vehicle type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleType vehicleType;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleStatus vehicleStatus;
    private String imageURL;
    private String comment;
    @NotNull(message = "LocationId is required")
    private Long locationId;
    private Boolean isCustomerOwned;


    public NewVehicleDto(Vehicle vehicle) {
        this.regTag = vehicle.getRegTag();
        this.vehicleType = vehicle.getVehicleType();
        this.vehicleStatus = vehicle.getVehicleStatus();
        this.imageURL = vehicle.getImageURL();
        this.comment = vehicle.getComment();
        this.locationId = vehicle.getLocation().getId();
        this.isCustomerOwned = vehicle.isCustomerOwned();
    }


    @Override
    public Boolean getIsCustomerOwned() {
        return this.isCustomerOwned;
    }

    @Override
    public String getRegTag() {
        return this.regTag;
    }

    @Override
    public VehicleStatus getVehicleStatus() {
        return this.vehicleStatus;
    }
}