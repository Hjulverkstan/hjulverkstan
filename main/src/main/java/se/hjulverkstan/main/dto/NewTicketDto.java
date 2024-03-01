package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.TicketType;

import java.time.LocalDateTime;
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

    @JsonProperty("start_date")
    private LocalDateTime startDate;

    @JsonProperty("end_date")
    private LocalDateTime endDate;

    private String comment;
}
