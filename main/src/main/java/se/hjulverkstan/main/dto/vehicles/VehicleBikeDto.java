package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import se.hjulverkstan.main.model.VehicleBrakeType;
import se.hjulverkstan.main.model.BikeSize;
import se.hjulverkstan.main.model.BikeType;
import se.hjulverkstan.main.model.VehicleBike;

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


    public VehicleBikeDto(VehicleBike vehicleBike) {
        super(vehicleBike);
        this.bikeType = vehicleBike.getBikeType();
        this.gearCount = vehicleBike.getGearCount();
        this.size = vehicleBike.getSize();
        this.brakeType = vehicleBike.getBrakeType();

    }
}