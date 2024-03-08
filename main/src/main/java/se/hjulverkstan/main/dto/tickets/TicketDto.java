package se.hjulverkstan.main.dto.tickets;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.Ticket;
import se.hjulverkstan.main.model.TicketType;

import java.time.LocalDateTime;

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
    //TODO: implement when vehicles available
  /*  @JsonProperty("vehicle_ids")
    private List<Long> vehicleIds;*/
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
                /*ticket.getVehicles().stream().map(vehicle -> vehicle.getId()).collect(Collectors.toList()),*/
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
