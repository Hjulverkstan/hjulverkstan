package se.hjulverkstan.main.dto.tickets;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
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
public class NewTicketDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @NotNull(message = "Ticket type is required")
    private TicketType ticketType;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String comment;

    @NotNull(message = "List of vehicles is required")
    private List<Long> vehicleIds;

    @NotNull(message = "Employee is required")
    private Long employeeId;

    @NotNull(message = "Customer is required")
    private Long customerId;


    public NewTicketDto(Ticket ticket) {
        this(ticket.getTicketType(),
                ticket.getStartDate(),
                ticket.getEndDate(),
                ticket.getComment(),
                ticket.getVehicles().stream().map(Vehicle::getId).collect(Collectors.toList()),
                ticket.getEmployee().getId(),
                ticket.getCustomer().getId()
        );
    }
}
