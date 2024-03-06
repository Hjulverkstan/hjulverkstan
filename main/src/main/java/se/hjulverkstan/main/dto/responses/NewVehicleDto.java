package se.hjulverkstan.main.dto.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewVehicleDto {
    @NotNull
    @JsonProperty("vehicle_type")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleType vehicleType;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @JsonProperty("vehicle_status")
    private VehicleStatus vehicleStatus;
    @JsonProperty("image_url")
    private String imageURL;
    private String comment;

    public NewVehicleDto(Vehicle vehicle) {
        this.vehicleType = vehicle.getVehicleType();
        this.vehicleStatus = vehicle.getVehicleStatus();
        this.imageURL = vehicle.getImageURL();
        this.comment = vehicle.getComment();
    }
}