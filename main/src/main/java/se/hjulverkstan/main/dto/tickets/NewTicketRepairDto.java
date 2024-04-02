package se.hjulverkstan.main.dto.tickets;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import se.hjulverkstan.main.model.TicketRepair;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class NewTicketRepairDto extends NewTicketDto {
    @NotBlank(message = "Repair description is required")
    private String repairDescription;


    public NewTicketRepairDto(TicketRepair ticket) {
        super(ticket);
        this.repairDescription = ticket.getRepairDescription();
    }
}
