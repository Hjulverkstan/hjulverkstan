package se.hjulverkstan.main.dto.tickets;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import se.hjulverkstan.main.model.TicketRepair;

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
    @NotNull(message = "Ticket status is required")
    private Boolean isOpen;

    public TicketRepairDto(TicketRepair ticket) {
        super(ticket);
        this.repairDescription = ticket.getRepairDescription();
        this.endDate = ticket.getEndDate();
        this.isOpen = ticket.isOpen();
    }
}
