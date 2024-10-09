package se.hjulverkstan.main.model.vehicle;

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
@DiscriminatorValue("BIKE")
public class VehicleBike extends Vehicle {
    @Enumerated(EnumType.STRING)
    private BikeType bikeType;
    private int gearCount;
    @Enumerated(EnumType.STRING)
    private BikeSize size;
    @Enumerated(EnumType.STRING)
    private VehicleBrakeType brakeType;
    @Enumerated(EnumType.STRING)
    private VehicleBrand brand;
}