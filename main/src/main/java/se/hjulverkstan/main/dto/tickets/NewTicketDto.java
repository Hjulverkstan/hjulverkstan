package se.hjulverkstan.main.dto.tickets;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Ticket;
import se.hjulverkstan.main.model.TicketType;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewTicketDto {
    @JsonProperty("ticket_type")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private TicketType ticketType;
    @JsonProperty("vehicle_ids")
    private List<Long> vehicleIds;
    @JsonProperty("employee_id")
    private Long employeeId;
    @JsonProperty("customer_id")
    private Long customerId;
    private String comment;

    public NewTicketDto(Ticket ticket) {
        this(ticket.getTicketType(),
                // TODO: replace empty list with stream when vehicles done
                /*ticket.getVehicles().stream().map(vehicle -> vehicle.getId()).collect(Collectors.toList()),*/
                new ArrayList<>(),
                ticket.getEmployee().getId(),
                ticket.getCustomer().getId(),
                ticket.getComment()
        );
    }
}
