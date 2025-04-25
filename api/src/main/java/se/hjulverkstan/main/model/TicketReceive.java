package se.hjulverkstan.main.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import se.hjulverkstan.Exceptions.UnsupportedTicketStatusException;

@Entity
@DiscriminatorValue("RECEIVE")
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class TicketReceive extends Ticket {

    @Override
    public boolean isValidTicketStatusTransition(TicketStatus newStatus) {
        return newStatus == null;
    }

}
