package se.hjulverkstan.main.dto.tickets;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import se.hjulverkstan.main.model.TicketRepair;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TicketRepairDto extends TicketDto {
    @JsonProperty("repair_description")
    private String repairDescription;

    public TicketRepairDto(TicketRepair ticket) {
        super(ticket);
        this.repairDescription = ticket.getRepairDescription();
    }
}
