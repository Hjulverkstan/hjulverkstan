package se.hjulverkstan.main.feature.ticket;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import se.hjulverkstan.main.feature.customer.Customer;
import se.hjulverkstan.main.feature.employee.Employee;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.shared.Auditable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "ticket_type", discriminatorType = DiscriminatorType.STRING)
@Data
@EqualsAndHashCode(callSuper = true)
public class Ticket extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "ticket_type", insertable = false, updatable = false)
    private TicketType ticketType;

    @Enumerated(EnumType.STRING)
    @Column(name = "ticket_status")
    private TicketStatus ticketStatus;

    private LocalDate startDate;
    private LocalDate endDate; // Used when type = rent
    private String repairDescription; // Used when type = repair
    private String comment;
    private LocalDateTime statusUpdatedAt;

    @ManyToMany
    @JoinTable(
            name = "ticket_vehicle",
            joinColumns = @JoinColumn(name = "ticket_id"),
            inverseJoinColumns = @JoinColumn(name = "vehicle_id")
    )
    private List<Vehicle> vehicles = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public void setTicketStatus(TicketStatus ticketStatus) {
        TicketUtils.validateTicketStatusByType(ticketStatus, ticketType);
        this.ticketStatus = ticketStatus;
        statusUpdatedAt = LocalDateTime.now();
    }

    public boolean isOpen() {
        return ticketStatus != null && ticketStatus != TicketStatus.CLOSED;
    }
}