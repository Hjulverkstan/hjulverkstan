package se.hjulverkstan.main.dto.tickets;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.TicketRepair;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewTicketRepairDto extends NewTicketDto {
    @JsonProperty("repair_description")
    private String repairDescription;
    @JsonProperty("start_date")
    private LocalDateTime startDate;

    public NewTicketRepairDto(TicketRepair ticket) {
        super(ticket);
        this.repairDescription = ticket.getRepairDescription();
        this.startDate = ticket.getStartDate();
    }
}
