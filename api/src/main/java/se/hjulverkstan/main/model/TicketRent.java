package se.hjulverkstan.main.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import se.hjulverkstan.Exceptions.UnsupportedTicketStatusException;

import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("RENT")
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class TicketRent extends Ticket {
    private LocalDateTime endDate;

    @Override
    public boolean isValidTicketStatusTransition(TicketStatus newStatus) {
        return newStatus == TicketStatus.READY ||
                newStatus == TicketStatus.IN_PROGRESS ||
                newStatus == TicketStatus.CLOSED;
    }

}
