package se.hjulverkstan.main.feature.location;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.shared.auditable.Auditable;
import se.hjulverkstan.main.feature.webedit.shop.Shop;

import java.util.List;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class Location extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.PRIVATE)
    private Long id;
    private String address;
    private String name;
    @Enumerated(EnumType.STRING)
    private LocationType locationType;
    private String comment;
    @OneToMany(mappedBy = "location")
    private List<Vehicle> vehicles;
    @OneToOne(mappedBy = "location")
    private Shop shop;
}