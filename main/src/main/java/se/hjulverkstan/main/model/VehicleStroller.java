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
@DiscriminatorValue(("STROLLER"))
public class VehicleStroller extends Vehicle {
    private boolean isFoldable;
    private boolean hasStorageBasket;
    @Enumerated(EnumType.STRING)
    private StrollerType strollerType;
}