package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.custom_annotations.BaseVehicleFieldValidation;
import se.hjulverkstan.main.custom_annotations.VehicleValidation;
import se.hjulverkstan.main.model.Ticket;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.model.VehicleType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@VehicleValidation
public class EditVehicleDto implements BaseVehicleFieldValidation {
    private Long id;

    private String regTag;
    @NotNull(message = "Vehicle type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleType vehicleType;
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

    public EditVehicleDto(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.regTag = vehicle.getRegTag();
        this.vehicleType = vehicle.getVehicleType();
        this.imageURL = vehicle.getImageURL();
        this.comment = vehicle.getComment();
        this.ticketIds = vehicle.getTickets().stream().map(Ticket::getId).collect(Collectors.toList());
        this.locationId = vehicle.getLocation().getId();
        this.createdAt = vehicle.getCreatedAt();
        this.updatedAt = vehicle.getUpdatedAt();
        this.createdBy = vehicle.getCreatedBy();
        this.updatedBy = vehicle.getUpdatedBy();
    }


    @Override
    public String getRegTag() {
        return this.regTag;
    }

}
