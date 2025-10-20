package se.hjulverkstan.main.feature.vehicle;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.feature.vehicle.model.*;
import se.hjulverkstan.main.shared.auditable.AuditableDto;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class VehicleDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @NotNull(message = "Vehicle type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleType vehicleType;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleStatus vehicleStatus;

    @NotNull(message = "LocationId is required")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long locationId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(contentUsing = ToStringSerializer.class)
    private List<Long> ticketIds;

    @JsonProperty("isCustomerOwned")
    private boolean isCustomerOwned;

    private String imageURL;
    private String comment;

    // vehicleType != BATCH && isCustomerOwned == false
    private String regTag;

    // vehicleType == BIKE
    private Integer gearCount;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BikeType bikeType;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BikeSize size;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleBrakeType brakeType;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private VehicleBrand brand;

    // vehicleType == BATCH
    private Integer batchCount;

    public VehicleDto(Vehicle vehicle) {
        super(vehicle);

        id = vehicle.getId();
        vehicleType = vehicle.getVehicleType();
        vehicleStatus = vehicle.getVehicleStatus();
        imageURL = vehicle.getImageURL();
        comment = vehicle.getComment();
        ticketIds = vehicle.getTickets().stream().map(Ticket::getId).toList();
        isCustomerOwned = vehicle.isCustomerOwned();
        locationId = vehicle.getLocation() == null ? null : vehicle.getLocation().getId();

        regTag = vehicle.getRegTag();
        batchCount = vehicle.getBatchCount();
        gearCount = vehicle.getGearCount();
        bikeType = vehicle.getBikeType();
        size = vehicle.getSize();
        brakeType = vehicle.getBrakeType();
        brand = vehicle.getBrand();
    }

    // VehicleStatus is not settable here (separate endpoint)
    public Vehicle applyToEntity (Vehicle vehicle, Location location) {
        vehicle.setVehicleType(vehicleType);
        vehicle.setImageURL(imageURL);

        vehicle.setCustomerOwned(vehicleType != VehicleType.BATCH && isCustomerOwned);
        vehicle.setRegTag((isCustomerOwned || vehicleType == VehicleType.BATCH) ? null : regTag);
        vehicle.setBatchCount(vehicleType == VehicleType.BATCH ? batchCount : null);
        vehicle.setGearCount(vehicleType == VehicleType.BIKE ? gearCount : null);
        vehicle.setBikeType(vehicleType == VehicleType.BIKE ? bikeType : null);
        vehicle.setSize(vehicleType == VehicleType.BIKE ? size : null);
        vehicle.setBrakeType(vehicleType == VehicleType.BIKE ? brakeType : null);
        vehicle.setBrand(vehicleType == VehicleType.BIKE ? brand : null);

        vehicle.setLocation(location);

        return vehicle;
    }
}