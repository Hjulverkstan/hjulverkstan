package se.hjulverkstan.main.dto.tickets;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import se.hjulverkstan.main.model.ticket.TicketRepair;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TicketRepairDto extends TicketDto {
    @NotBlank(message = "Repair description is required")
    private String repairDescription;
    private LocalDateTime endDate;

    public TicketRepairDto(TicketRepair ticket) {
        super(ticket);
        this.repairDescription = ticket.getRepairDescription();
        this.endDate = ticket.getEndDate();

    }
}
