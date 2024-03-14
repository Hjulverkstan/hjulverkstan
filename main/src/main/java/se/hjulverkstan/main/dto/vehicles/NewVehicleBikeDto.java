package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.BikeBrakeType;
import se.hjulverkstan.main.model.BikeSize;
import se.hjulverkstan.main.model.BikeType;
import se.hjulverkstan.main.model.VehicleBike;

@Data
//Added the @EqualsAndHashCode annotation because
//otherwise this class wouldn't call the superclass Hash and equal method
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class NewVehicleBikeDto extends NewVehicleDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BikeType bikeType;
    private int gearCount;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BikeSize size;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BikeBrakeType brakeType;

    public NewVehicleBikeDto(VehicleBike vehicle) {
        super(vehicle);
        this.bikeType = vehicle.getBikeType();
        this.gearCount = vehicle.getGearCount();
        this.size = vehicle.getSize();
        this.brakeType = vehicle.getBrakeType();
    }
}