package se.hjulverkstan.main.dto.tickets;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.TicketRent;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketRentDto extends TicketDto {
    @JsonProperty("start_date")
    private LocalDateTime startDate;
    @JsonProperty("end_date")
    private LocalDateTime endDate;

    public TicketRentDto(TicketRent ticket) {
        super(ticket);
        this.startDate = ticket.getStartDate();
        this.endDate = ticket.getEndDate();
    }
}
