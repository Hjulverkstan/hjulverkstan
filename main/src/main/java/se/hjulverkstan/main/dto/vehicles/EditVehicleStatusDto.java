package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.model.VehicleStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditVehicleStatusDto {
    @NotNull(message = "New status is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleStatus newStatus;

    public EditVehicleStatusDto(Vehicle vehicle) {
        this.newStatus = vehicle.getVehicleStatus();
    }

}
