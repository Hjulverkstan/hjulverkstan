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
public class VehicleBikeDto extends VehicleDto {

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


    public VehicleBikeDto(VehicleBike vehicleBike) {
        super(vehicleBike);
        this.bikeType = vehicleBike.getBikeType();
        this.gearCount = vehicleBike.getGearCount();
        this.size = vehicleBike.getSize();
        this.brakeType = vehicleBike.getBrakeType();

    }
}