package se.hjulverkstan.main.dto.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.*;

@Data
//Added the @EqualsAndHashCode annotation because
//otherwise this class wouldn't call the superclass Hash and equal method
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class NewVehicleBikeDto extends NewVehicleDto {
    @JsonProperty("bike_type")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BikeType bikeType;
    @JsonProperty("gear_count")
    private int gearCount;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BikeSize size;
    @JsonProperty("brake_type")
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