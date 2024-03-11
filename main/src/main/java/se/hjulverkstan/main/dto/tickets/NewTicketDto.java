package se.hjulverkstan.main.dto.tickets;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("ticket_type")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private TicketType ticketType;
    @JsonProperty("start_date")
    private LocalDateTime startDate;
    @JsonProperty("end_date")
    private LocalDateTime endDate;
    private String comment;
    @JsonProperty("vehicle_ids")
    private List<Long> vehicleIds;
    @JsonProperty("employee_id")
    private Long employeeId;
    @JsonProperty("customer_id")
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
