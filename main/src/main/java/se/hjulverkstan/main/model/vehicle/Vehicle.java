package se.hjulverkstan.main.model.vehicle;

import jakarta.persistence.*;
import lombok.Data;
import se.hjulverkstan.main.model.location.Location;
import se.hjulverkstan.main.model.ticket.Ticket;
import se.hjulverkstan.main.model.base.Auditable;

import java.util.List;

@Entity
@Data
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "vehicle_class", discriminatorType = DiscriminatorType.STRING)
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
    private String imageURL;
    private String comment;
    @ManyToMany(mappedBy = "vehicles")
    private List<Ticket> tickets;
    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;
}