package se.hjulverkstan.main.dto.vehicles;

import lombok.*;
import se.hjulverkstan.main.model.VehicleGeneric;

@ToString
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@NoArgsConstructor
public class EditVehicleGenericDto extends EditVehicleDto {
    public EditVehicleGenericDto(VehicleGeneric vehicleGeneric){
        super(vehicleGeneric);
    }
}
