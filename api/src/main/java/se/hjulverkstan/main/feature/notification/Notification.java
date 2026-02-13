package se.hjulverkstan.main.feature.notification;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.lang.Nullable;
import se.hjulverkstan.main.feature.customer.Customer;
import se.hjulverkstan.main.feature.employee.Employee;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.feature.ticket.TicketStatus;
import se.hjulverkstan.main.feature.ticket.TicketType;
import se.hjulverkstan.main.feature.ticket.TicketUtils;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.shared.auditable.Auditable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @Enumerated(EnumType.STRING)
    private NotificationStatus notificationStatus;

    @ManyToOne
    @Nullable
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    private String snsMessageId;
    private String phoneNumber;
    private String message;
    private LocalDate createdAt;

    public Notification() {
        this.createdAt = LocalDate.now();
    }
}