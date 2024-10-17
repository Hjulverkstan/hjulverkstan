package se.hjulverkstan.main.dto.vehicles;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.custom_annotations.VehicleFieldValidation;
import se.hjulverkstan.main.custom_annotations.VehicleValidation;
import se.hjulverkstan.main.model.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@VehicleValidation
public class VehicleDto implements VehicleFieldValidation {
    private Long id;

    private String regTag;
    @NotNull(message = "Vehicle type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleType vehicleType;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleStatus vehicleStatus;
    private String imageURL;
    private String comment;
    private List<Long> ticketIds;
    @NotNull(message = "LocationId is required")
    private Long locationId;
    private Boolean isCustomerOwned;


    // Meta data
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;

    public VehicleDto(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.regTag = vehicle.getRegTag();
        this.vehicleType = vehicle.getVehicleType();
        this.vehicleStatus = vehicle.getVehicleStatus();
        this.imageURL = vehicle.getImageURL();
        this.comment = vehicle.getComment();
        this.ticketIds = vehicle.getTickets().stream().map(Ticket::getId).collect(Collectors.toList());
        this.isCustomerOwned = vehicle.isCustomerOwned();
        this.locationId = vehicle.getLocation().getId();
        this.createdAt = vehicle.getCreatedAt();
        this.updatedAt = vehicle.getUpdatedAt();
        this.createdBy = vehicle.getCreatedBy();
        this.updatedBy = vehicle.getUpdatedBy();
    }

    @Override
    public Boolean getIsCustomerOwned() {
        return this.isCustomerOwned;
    }

    @Override
    public String getRegTag() {
        return this.regTag;
    }

    @Override
    public VehicleStatus getVehicleStatus() {
        return this.vehicleStatus;
    }
}