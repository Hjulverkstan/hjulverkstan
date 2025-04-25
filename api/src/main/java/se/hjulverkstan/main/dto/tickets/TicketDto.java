package se.hjulverkstan.main.dto.tickets;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Ticket;
import se.hjulverkstan.main.model.TicketType;
import se.hjulverkstan.main.model.TicketStatus;
import se.hjulverkstan.main.model.Vehicle;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDto {
    private Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @NotNull(message = "Ticket type is required")
    private TicketType ticketType;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    private String comment;

    @NotNull(message = "List of vehicles is required")
    private List<Long> vehicleIds;

    @NotNull(message = "Employee is required")
    private Long employeeId;

    @NotNull(message = "Customer is required")
    private Long customerId;

    private TicketStatus ticketStatus;

    // Metadata
    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;
    private LocalDateTime statusUpdatedAt;

    public TicketDto(Ticket ticket) {
        this(ticket.getId(),
                ticket.getTicketType(),
                ticket.getStartDate(),
                ticket.getComment(),
                ticket.getVehicles().stream().map(Vehicle::getId).collect(Collectors.toList()),
                ticket.getEmployee().getId(),
                ticket.getCustomer().getId(),
                ticket.getTicketStatus(),
                ticket.getCreatedBy(),
                ticket.getCreatedAt(),
                ticket.getUpdatedBy(),
                ticket.getUpdatedAt(),
                ticket.getStatusUpdatedAt()
                );
    }
}
