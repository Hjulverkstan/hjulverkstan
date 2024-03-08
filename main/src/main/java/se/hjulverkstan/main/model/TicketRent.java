package se.hjulverkstan.main.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("RENT")
@Data
public class TicketRent extends Ticket {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
