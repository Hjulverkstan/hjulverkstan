package se.hjulverkstan.main.dto.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.VehicleStatus;
import se.hjulverkstan.main.model.VehicleType;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewVehicleDto {

    @JsonProperty("vehicle_type")
    private VehicleType vehicleType;
    private VehicleStatus status;
    @JsonProperty("link_to_image")
    private String linkToImg;
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
    @JsonProperty("created_by")
    private String createdBy;
    private String comment;
}