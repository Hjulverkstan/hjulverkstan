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
public class VehicleStrollerDto extends VehicleDto {
    @NotNull(message = "Stroller type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private StrollerType strollerType;

    public VehicleStrollerDto(VehicleStroller vehicleStroller) {
        super(vehicleStroller);
        this.strollerType = vehicleStroller.getStrollerType();

    }
}