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
public class TicketDto {
    private Long id;
    @JsonProperty("ticket_type")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private TicketType ticketType;
    @JsonProperty("is_open")
    private boolean isOpen;
    @JsonProperty("vehicle_ids")
    private List<Long> vehicleIds;
    @JsonProperty("employee_id")
    private Long employeeId;
    @JsonProperty("customer_id")
    private Long customerId;
    private String comment;

    // Metadata
    @JsonProperty("created_by")
    private Long createdBy;
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    @JsonProperty("updated_by")
    private Long updatedBy;
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;


    public TicketDto(Ticket ticket) {
        this(ticket.getId(),
                ticket.getTicketType(),
                ticket.isOpen(),
                ticket.getVehicles().stream().map(Vehicle::getId).collect(Collectors.toList()),
                ticket.getEmployee().getId(),
                ticket.getCustomer().getId(),
                ticket.getComment(),
                ticket.getCreatedBy(),
                ticket.getCreatedAt(),
                ticket.getUpdatedBy(),
                ticket.getUpdatedAt()
        );
    }
}
