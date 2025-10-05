package se.hjulverkstan.main.feature.vehicle;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.vehicle.model.VehicleStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleStatusDto {
    @NotNull(message = "New status is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleStatus vehicleStatus;
}
