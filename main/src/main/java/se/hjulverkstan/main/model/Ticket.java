package se.hjulverkstan.main.model;

import jakarta.persistence.*;
import lombok.*;
import se.hjulverkstan.main.model.base.Auditable;
import se.hjulverkstan.Exceptions.UnsupportedTicketStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "ticket_type", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class Ticket extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.PRIVATE)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "ticket_type", insertable = false, updatable = false)
    private TicketType ticketType;

    @Enumerated(EnumType.STRING)
    @Column(name = "ticket_status")
    private TicketStatus ticketStatus;

    private LocalDateTime startDate;
    private String comment;

    @ManyToMany
    @JoinTable(
            name = "ticket_vehicle",
            joinColumns = @JoinColumn(name = "ticket_id"),
            inverseJoinColumns = @JoinColumn(name = "vehicle_id")
    )
    private List<Vehicle> vehicles;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public boolean isValidTicketStatusTransition(TicketStatus newStatus) {
        return true;
    }

    public void setTicketStatus(TicketStatus newStatus) {
        if (isValidTicketStatusTransition(newStatus)) {
            this.ticketStatus = newStatus;
        } else {
            throw new UnsupportedTicketStatusException("Invalid status transition for ticket type: " + this.ticketType);
        }
    }

}
