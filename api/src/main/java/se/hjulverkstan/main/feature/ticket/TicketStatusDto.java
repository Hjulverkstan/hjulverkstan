package se.hjulverkstan.main.feature.ticket;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketStatusDto {

    @NotNull(message = "Status is required")
    private TicketStatus ticketStatus;
}