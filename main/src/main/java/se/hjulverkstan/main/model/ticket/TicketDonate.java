package se.hjulverkstan.main.model.ticket;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@DiscriminatorValue("DONATE")
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class TicketDonate extends Ticket {

    @Override
    public boolean isValidTicketStatusTransition(TicketStatus newStatus) {
        return newStatus == null;
    }

    @Override
    public void setTicketStatus(TicketStatus newStatus) {
        if (isValidTicketStatusTransition(newStatus)) {
            super.setTicketStatus(newStatus);
        } else {
            throw new IllegalStateException("TicketDonate cannot have any status other than null");
        }
    }
}
