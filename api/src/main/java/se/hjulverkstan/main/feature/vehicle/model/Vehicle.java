package se.hjulverkstan.main.feature.vehicle.model;

import jakarta.persistence.*;
import lombok.Data;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.shared.auditable.Auditable;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Vehicle extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String regTag;

    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    private VehicleStatus vehicleStatus;

    @ManyToMany(mappedBy = "vehicles")
    private List<Ticket> tickets = new ArrayList<>(); // Prevent possible NPE

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    private String imageURL;
    private String comment;
    private boolean isCustomerOwned;

    // vehicleType == BATCH
    private Integer batchCount;

    // vehicleTYPE == BIKE
    @Enumerated(EnumType.STRING)
    private BikeType bikeType;
    private Integer gearCount;
    @Enumerated(EnumType.STRING)
    private BikeSize size;
    @Enumerated(EnumType.STRING)
    private VehicleBrakeType brakeType;
    @Enumerated(EnumType.STRING)
    private VehicleBrand brand;
}