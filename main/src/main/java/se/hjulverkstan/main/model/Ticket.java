package se.hjulverkstan.main.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import se.hjulverkstan.Exceptions.UnsupportedTicketStatusException;
import se.hjulverkstan.main.model.base.Auditable;

@Entity
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
    private LocalDateTime statusUpdatedAt;
    private LocalDateTime endDate;
    private String repairDescription;

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
            this.statusUpdatedAt = LocalDateTime.now();
        } else {
            throw new UnsupportedTicketStatusException("Invalid status transition for ticket type: " + this.ticketType);
        }
    }

    public boolean isOpen() {
        return this.ticketStatus != null && this.ticketStatus != TicketStatus.CLOSED;
    }

}
