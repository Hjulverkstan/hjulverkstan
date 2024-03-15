package se.hjulverkstan.main.model;

import jakarta.persistence.*;
import lombok.Data;
import se.hjulverkstan.main.model.base.Auditable;

import java.util.List;

@Entity
@Data
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "vehicle_type", discriminatorType = DiscriminatorType.STRING)
public class Vehicle extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", insertable = false, updatable = false)
    private VehicleType vehicleType;
    @Enumerated(EnumType.STRING)
    private VehicleStatus vehicleStatus;
    private String imageURL;
    private String comment;
    @ManyToMany(mappedBy = "vehicles")
    private List<Ticket> tickets;

    // Meta data
    private Long createdBy;
    private Long updatedBy;
}