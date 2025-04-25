package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import se.hjulverkstan.main.model.StrollerType;
import se.hjulverkstan.main.model.VehicleStroller;

@Setter
@Getter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class EditVehicleStrollerDto extends EditVehicleDto {
    @NotNull(message = "Stroller type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private StrollerType strollerType;

    public EditVehicleStrollerDto(VehicleStroller vehicleStroller) {
        super(vehicleStroller);
        this.strollerType = vehicleStroller.getStrollerType();

    }
}