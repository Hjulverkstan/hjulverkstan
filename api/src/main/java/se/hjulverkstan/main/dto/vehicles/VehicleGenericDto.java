package se.hjulverkstan.main.dto.vehicles;

import lombok.*;
import se.hjulverkstan.main.model.VehicleGeneric;

@ToString
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@NoArgsConstructor
public class VehicleGenericDto extends VehicleDto {
    public VehicleGenericDto(VehicleGeneric vehicleGeneric){
        super(vehicleGeneric);
    }
}
