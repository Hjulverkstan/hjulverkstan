package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleDto {
    private Long id;

    @NotBlank(message = "Regtag is required", groups = SingleVehicleGroup.class)
    private String regTag;
    @NotNull(message = "Vehicle type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleType vehicleType;
    @NotNull(message = "Vehiclestatus is required", groups = SingleVehicleGroup.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleStatus vehicleStatus;
    private String imageURL;
    private String comment;
    private List<Long> ticketIds;
    @NotNull(message = "LocationId is required")
    private Long locationId;


    // Meta data
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;

    public VehicleDto(Vehicle vehicle) {
        this(vehicle.getId(),
                vehicle.getRegTag(),
                vehicle.getVehicleType(),
                vehicle.getVehicleStatus(),
                vehicle.getImageURL(),
                vehicle.getComment(),
                vehicle.getTickets().stream().map(Ticket::getId).collect(Collectors.toList()),
                vehicle.getLocation().getId(),
                vehicle.getCreatedAt(),
                vehicle.getUpdatedAt(),
                vehicle.getCreatedBy(),
                vehicle.getUpdatedBy());
    }
}