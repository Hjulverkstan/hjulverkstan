package se.hjulverkstan.main.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Entity
@Setter
@Getter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("SCOOTER")
public class VehicleScooter extends Vehicle {

    private boolean isFoldable;
    @Enumerated(EnumType.STRING)
    private VehicleBrakeType brakeType;
    @Enumerated(EnumType.STRING)
    private ScooterType scooterType;

}
