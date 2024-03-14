package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Ticket;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.model.VehicleStatus;
import se.hjulverkstan.main.model.VehicleType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleDto {
    private Long id;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleType vehicleType;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleStatus vehicleStatus;
    private String imageURL;
    private String comment;
    private List<Long> ticketIds;

    // Meta data
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;

    public VehicleDto(Vehicle vehicle) {
        this(vehicle.getId(),
                vehicle.getVehicleType(),
                vehicle.getVehicleStatus(),
                vehicle.getImageURL(),
                vehicle.getComment(),
                vehicle.getTickets() == null ?
                        new ArrayList<>() :
                        vehicle.getTickets().stream().map(Ticket::getId).collect(Collectors.toList()),
                vehicle.getCreatedAt(),
                vehicle.getUpdatedAt(),
                vehicle.getCreatedBy(),
                vehicle.getUpdatedBy());
    }
}