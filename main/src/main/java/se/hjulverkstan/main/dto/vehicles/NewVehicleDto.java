package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.vehicle.SingleVehicleGroup;
import se.hjulverkstan.main.model.vehicle.Vehicle;
import se.hjulverkstan.main.model.vehicle.VehicleStatus;
import se.hjulverkstan.main.model.vehicle.VehicleType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewVehicleDto {
    @NotBlank(message = "Regtag is required", groups = SingleVehicleGroup.class)
    private String regTag;
    @NotNull(message = "Vehicle type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleType vehicleType;
    @NotNull(message = "Vehiclestatus is required", groups = SingleVehicleGroup.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleStatus vehicleStatus;
    private String imageURL;
    private String comment;
    @NotNull(message = "LocationId is required")
    private Long locationId;


    public NewVehicleDto(Vehicle vehicle) {
        this.regTag = vehicle.getRegTag();
        this.vehicleType = vehicle.getVehicleType();
        this.vehicleStatus = vehicle.getVehicleStatus();
        this.imageURL = vehicle.getImageURL();
        this.comment = vehicle.getComment();
        this.locationId = vehicle.getLocation().getId();
    }
}