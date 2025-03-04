package se.hjulverkstan.main.dto.tickets;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.Exceptions.InvalidDataException;
import se.hjulverkstan.main.model.Ticket;
import se.hjulverkstan.main.model.TicketType;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.util.TicketUtils;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewTicketDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @NotNull(message = "Ticket type is required")
    private TicketType ticketType;

    private LocalDateTime startDate;

    private String comment;

    @NotNull(message = "List of vehicles is required")
    private List<Long> vehicleIds;

    @NotNull(message = "Employee is required")
    private Long employeeId;

    @NotNull(message = "Customer is required")
    private Long customerId;

    // for rent and repair tickets
    private LocalDateTime endDate;
    private String repairDescription;


    public NewTicketDto(Ticket ticket) {
        this(ticket.getTicketType(),
                ticket.getTicketType() == TicketType.DONATE || ticket.getTicketType() == TicketType.RECEIVE
                        ? null
                        : ticket.getStartDate(),
                ticket.getComment(),
                ticket.getVehicles().stream().map(Vehicle::getId).collect(Collectors.toList()),
                ticket.getEmployee().getId(),
                ticket.getCustomer().getId(),
                ticket.getEndDate(),
                ticket.getRepairDescription()
        );
        String error = TicketUtils.ValidateTicket(ticket);
            if (error != null) {
                throw new InvalidDataException(error);
            }
    }
}
