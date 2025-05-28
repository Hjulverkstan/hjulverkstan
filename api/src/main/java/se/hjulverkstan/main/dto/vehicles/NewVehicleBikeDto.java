package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import se.hjulverkstan.main.model.VehicleBrakeType;
import se.hjulverkstan.main.model.BikeSize;
import se.hjulverkstan.main.model.BikeType;
import se.hjulverkstan.main.model.VehicleBike;
import se.hjulverkstan.main.model.VehicleBrand;

@Setter
@Getter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class NewVehicleBikeDto extends NewVehicleDto {
    @NotNull(message = "Bike type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BikeType bikeType;
    @NotNull(message = "Number of gears are required")
    private Integer gearCount;
    @NotNull(message = "Size is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BikeSize size;
    @NotNull(message = "Brake type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleBrakeType brakeType;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleBrand brand;

    public NewVehicleBikeDto(VehicleBike vehicle) {
        super(vehicle);
        this.bikeType = vehicle.getBikeType();
        this.gearCount = vehicle.getGearCount();
        this.size = vehicle.getSize();
        this.brakeType = vehicle.getBrakeType();
        this.brand = vehicle.getBrand();
    }
}