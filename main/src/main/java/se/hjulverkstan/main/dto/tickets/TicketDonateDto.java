package se.hjulverkstan.main.dto.tickets;

import jakarta.validation.constraints.Null;
import lombok.*;
import se.hjulverkstan.main.model.ticket.TicketDonate;
import se.hjulverkstan.main.model.ticket.TicketStatus;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
public class TicketDonateDto extends TicketDto {

    @Null(message = "Status must be null for donate tickets")
    private TicketStatus ticketStatus;

    public TicketDonateDto(TicketDonate ticket) {
        super(ticket);
    }
}
