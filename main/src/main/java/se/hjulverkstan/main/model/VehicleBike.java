package se.hjulverkstan.main.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
//Added the @EqualsAndHashCode annotation because
//otherwise this class wouldn't call the superclass Hash and equal method
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("BIKE")
public class VehicleBike extends Vehicle {
    @Enumerated(EnumType.STRING)
    private BikeType bikeType;
    private int gearCount;
    @Enumerated(EnumType.STRING)
    private BikeSize size;
    @Enumerated(EnumType.STRING)
    private BikeBrakeType brakeType;
}