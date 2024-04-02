package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.model.VehicleStatus;
import se.hjulverkstan.main.model.VehicleType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewVehicleDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleType vehicleType;
    @NotNull(message = "Vehiclestatus is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleStatus vehicleStatus;
    private String imageURL;
    private String comment;

    public NewVehicleDto(Vehicle vehicle) {
        this.vehicleType = vehicle.getVehicleType();
        this.vehicleStatus = vehicle.getVehicleStatus();
        this.imageURL = vehicle.getImageURL();
        this.comment = vehicle.getComment();
    }
}