package se.hjulverkstan.main.dto.tickets;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import se.hjulverkstan.main.model.TicketRepair;
import se.hjulverkstan.main.model.TicketStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class EditTicketRepairDto extends EditTicketDto {
    @NotBlank(message = "Repair description is required")
    private String repairDescription;
    private LocalDateTime endDate;

    public EditTicketRepairDto(TicketRepair ticket) {
        super(ticket);
        this.repairDescription = ticket.getRepairDescription();
        this.endDate = ticket.getEndDate();

    }
}