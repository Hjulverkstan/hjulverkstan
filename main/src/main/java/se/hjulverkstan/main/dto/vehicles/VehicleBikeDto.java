package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import se.hjulverkstan.main.model.vehicle.VehicleBrakeType;
import se.hjulverkstan.main.model.vehicle.BikeSize;
import se.hjulverkstan.main.model.vehicle.BikeType;
import se.hjulverkstan.main.model.vehicle.VehicleBike;
import se.hjulverkstan.main.model.vehicle.VehicleBrand;

@Setter
@Getter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class VehicleBikeDto extends VehicleDto {

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
    @NotNull(message = "Brand is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleBrand brand;


    public VehicleBikeDto(VehicleBike vehicleBike) {
        super(vehicleBike);
        this.bikeType = vehicleBike.getBikeType();
        this.gearCount = vehicleBike.getGearCount();
        this.size = vehicleBike.getSize();
        this.brakeType = vehicleBike.getBrakeType();
        this.brand = vehicleBike.getBrand();

    }
}