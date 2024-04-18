package se.hjulverkstan.main.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("REPAIR")
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class TicketRepair extends Ticket {
    private String repairDescription;
    private LocalDateTime endDate;
    private boolean isOpen;
}
