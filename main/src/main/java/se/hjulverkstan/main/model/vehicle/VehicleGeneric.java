package se.hjulverkstan.main.model.vehicle;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@ToString
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("GENERIC")
public class VehicleGeneric extends Vehicle {
}