package se.hjulverkstan.main.dto.tickets;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Ticket;
import se.hjulverkstan.main.model.TicketType;
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
    private TicketType ticketType;
    private boolean isOpen;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String comment;

    private List<Long> vehicleIds;
    private Long employeeId;
    private Long customerId;

    // Metadata
    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;

    public TicketDto(Ticket ticket) {
        this(ticket.getId(),
                ticket.getTicketType(),
                ticket.isOpen(),
                ticket.getStartDate(),
                ticket.getEndDate(),
                ticket.getComment(),
                ticket.getVehicles().stream().map(Vehicle::getId).collect(Collectors.toList()),
                ticket.getEmployee().getId(),
                ticket.getCustomer().getId(),
                ticket.getCreatedBy(),
                ticket.getCreatedAt(),
                ticket.getUpdatedBy(),
                ticket.getUpdatedAt()
        );
    }
}
