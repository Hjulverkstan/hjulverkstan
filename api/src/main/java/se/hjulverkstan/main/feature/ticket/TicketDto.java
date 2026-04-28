package se.hjulverkstan.main.feature.ticket;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.feature.customer.Customer;
import se.hjulverkstan.main.feature.employee.Employee;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.notification.Notification;
import se.hjulverkstan.main.feature.notification.NotificationStatus;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.shared.auditable.AuditableDto;

import java.time.LocalDate;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class TicketDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @NotNull(message = "Ticket type is required")
    private TicketType ticketType;

    // Not settable through create or edit
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private TicketStatus ticketStatus;

    private LocalDate startDate; // Used when type = rent
    private LocalDate endDate; // Used when type = rent
    private String repairDescription; // Used when type = repair
    private String comment;
    private boolean deleted;

    @NotNull(message = "List of vehicles is required")
    @JsonSerialize(contentUsing = ToStringSerializer.class)
    private List<Long> vehicleIds;

    @NotNull(message = "Location is required")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long locationId;

    @NotNull(message = "Employee is required")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long employeeId;

    @NotNull(message = "Customer is required")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long customerId;

    // From latest notification if present in the notification log
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private NotificationStatus repairCompleteNotificationStatus;

    public TicketDto (Ticket ticket) {
        super(ticket);

        id = ticket.getId();
        ticketType = ticket.getTicketType();
        ticketStatus = ticket.getTicketStatus();
        startDate = ticket.getStartDate();
        endDate = ticket.getEndDate();
        repairDescription = ticket.getRepairDescription();
        comment = ticket.getComment();
        vehicleIds = ticket.getVehicles() != null ? ticket.getVehicles().stream().map(Vehicle::getId).toList() : List.of();
        locationId = ticket.getLocation() != null ? ticket.getLocation().getId() : null;
        employeeId = ticket.getEmployee() != null ? ticket.getEmployee().getId() : null;
        customerId = ticket.getCustomer() != null ? ticket.getCustomer().getId() : null;
        deleted = ticket.isDeleted();

        repairCompleteNotificationStatus = ticket.getNotifications().stream()
                .findFirst()
                .map(Notification::getNotificationStatus)
                .orElse(null);
    }

    public Ticket applyToEntity (Ticket ticket, List<Vehicle> vehicles, Location location, Employee employee, Customer customer) {
        ticket.setTicketType(ticketType);
        ticket.setStartDate(ticketType == TicketType.RENT ? startDate : null);
        ticket.setEndDate(ticketType == TicketType.RENT ? endDate : null);
        ticket.setRepairDescription(ticketType == TicketType.REPAIR ? repairDescription : null);
        ticket.setComment(comment);
        ticket.setDeleted(deleted);

        ticket.setVehicles(vehicles);
        ticket.setLocation(location);
        ticket.setEmployee(employee);
        ticket.setCustomer(customer);

        // Set to initial status if of type rent or repair as the status is not choosable upon creation
        boolean statusMandatory = ticketType == TicketType.REPAIR || ticketType == TicketType.RENT;
        if (ticket.getTicketStatus() == null && statusMandatory) {
            ticket.setTicketStatus(TicketStatus.READY);
        }

        return ticket;
    }
}
