package se.hjulverkstan.main.dto.vehicles;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import se.hjulverkstan.main.model.vehicle.VehicleBatch;

@Setter
@Getter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class VehicleBatchDto extends VehicleDto {
    @NotNull(message = "Number of vehicles in batch is required")
    private Integer batchCount;

    public VehicleBatchDto(VehicleBatch vehicleBatch) {
        super(vehicleBatch);
        this.batchCount = vehicleBatch.getBatchCount();
    }
}