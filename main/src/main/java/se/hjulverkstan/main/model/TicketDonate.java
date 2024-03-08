package se.hjulverkstan.main.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("DONATE")
@Data
public class TicketDonate extends Ticket {
    private String donatedBy;
    private LocalDateTime donationDate;
}
