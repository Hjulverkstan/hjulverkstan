package se.hjulverkstan.main.dto.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleDto {
    private Long id;
    @NotNull
    @JsonProperty("vehicle_type")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleType vehicleType;
    @JsonProperty("vehicle_status")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleStatus vehicleStatus;
    @JsonProperty("image_url")
    private String imageURL;
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
    @JsonProperty("created_by")
    private Long createdBy;
    @JsonProperty("updated_by")
    private Long updatedBy;
    private String comment;

    public VehicleDto(Vehicle vehicle) {
        this(vehicle.getId(),
                vehicle.getVehicleType(),
                vehicle.getVehicleStatus(),
                vehicle.getImageURL(),
                vehicle.getCreatedAt(),
                vehicle.getUpdatedAt(),
                vehicle.getCreatedBy(),
                vehicle.getUpdatedBy(),
                vehicle.getComment());
    }
}