package se.hjulverkstan.main.model.vehicle;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Setter
@Getter
@ToString
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("BATCH")
public class VehicleBatch extends Vehicle {
    private int batchCount;
}