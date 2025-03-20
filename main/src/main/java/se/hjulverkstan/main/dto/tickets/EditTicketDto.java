package se.hjulverkstan.main.dto.tickets;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Ticket;
import se.hjulverkstan.main.model.TicketType;
import se.hjulverkstan.main.model.Vehicle;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ValidTicket
public class EditTicketDto {
    //Adding this might be also adding changes to the frontend I am not going to make as a the time
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @NotNull(message = "Ticket type is required")
    private TicketType ticketType;

    private Long id;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    private String comment;

    @NotNull(message = "List of vehicles is required")
    private List<Long> vehicleIds;

    @NotNull(message = "Employee is required")
    private Long employeeId;

    @NotNull(message = "Customer is required")
    private Long customerId;

    // Metadata
    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;

     // for rent and repair tickets
     private LocalDateTime endDate;
     private String repairDescription;

    public EditTicketDto(Ticket ticket) {
        this(ticket.getTicketType(),
                ticket.getId(),
                ticket.getStartDate(),
                ticket.getComment(),
                ticket.getVehicles().stream().map(Vehicle::getId).collect(Collectors.toList()),
                ticket.getEmployee().getId(),
                ticket.getCustomer().getId(),
                ticket.getCreatedBy(),
                ticket.getCreatedAt(),
                ticket.getUpdatedBy(),
                ticket.getUpdatedAt(),
                ticket.getEndDate(),
                ticket.getRepairDescription()
        );
    }
}