package se.hjulverkstan.main.dto.tickets;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.ticket.TicketStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketStatusDto {

    @NotNull(message = "Status is required")
    private TicketStatus ticketStatus;
}
