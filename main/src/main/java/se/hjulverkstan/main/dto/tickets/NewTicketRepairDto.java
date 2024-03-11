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
public class NewTicketRepairDto extends NewTicketDto {
    @JsonProperty("repair_description")
    private String repairDescription;


    public NewTicketRepairDto(TicketRepair ticket) {
        super(ticket);
        this.repairDescription = ticket.getRepairDescription();
    }
}
