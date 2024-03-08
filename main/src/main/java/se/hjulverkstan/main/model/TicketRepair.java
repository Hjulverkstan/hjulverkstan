package se.hjulverkstan.main.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("REPAIR")
@Data
public class TicketRepair extends Ticket {
    private String repairDescription;
    private LocalDateTime startDate;
}
