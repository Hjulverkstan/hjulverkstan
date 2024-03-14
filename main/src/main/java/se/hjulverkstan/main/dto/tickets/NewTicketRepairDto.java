package se.hjulverkstan.main.dto.tickets;

import lombok.*;
import se.hjulverkstan.main.model.TicketRepair;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class NewTicketRepairDto extends NewTicketDto {
    private String repairDescription;


    public NewTicketRepairDto(TicketRepair ticket) {
        super(ticket);
        this.repairDescription = ticket.getRepairDescription();
    }
}
