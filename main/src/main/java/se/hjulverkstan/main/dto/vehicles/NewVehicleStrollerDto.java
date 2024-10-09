package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import se.hjulverkstan.main.model.vehicle.StrollerType;
import se.hjulverkstan.main.model.vehicle.VehicleStroller;

@Setter
@Getter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class NewVehicleStrollerDto extends NewVehicleDto {
    @NotNull(message = "Stroller type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private StrollerType strollerType;

    //This constructor may or may not be needed. If not, remove!
    public NewVehicleStrollerDto(VehicleStroller vehicleStroller) {
        super(vehicleStroller);
        this.strollerType = vehicleStroller.getStrollerType();
    }
}