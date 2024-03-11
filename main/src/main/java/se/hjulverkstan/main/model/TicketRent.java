package se.hjulverkstan.main.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@DiscriminatorValue("RENT")
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class TicketRent extends Ticket {
}
