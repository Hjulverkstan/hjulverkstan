package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import se.hjulverkstan.main.model.ScooterType;
import se.hjulverkstan.main.model.VehicleBrakeType;
import se.hjulverkstan.main.model.VehicleScooter;

@Setter
@Getter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class NewVehicleScooterDto extends NewVehicleDto {
    @NotNull(message = "The field 'isFoldable' should not be null")
    private Boolean isFoldable;
    @NotNull(message = "Brake type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleBrakeType brakeType;
    @NotNull(message = "Scooter type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private ScooterType scooterType;

    public NewVehicleScooterDto(VehicleScooter vehicleScooter) {
        super(vehicleScooter);
        this.isFoldable = vehicleScooter.isFoldable();
        this.brakeType = vehicleScooter.getBrakeType();
        this.scooterType = vehicleScooter.getScooterType();
    }

}