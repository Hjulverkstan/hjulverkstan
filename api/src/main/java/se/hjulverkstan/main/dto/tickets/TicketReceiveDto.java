package se.hjulverkstan.main.dto.tickets;

import jakarta.validation.constraints.Null;
import lombok.*;
import se.hjulverkstan.main.model.TicketReceive;
import se.hjulverkstan.main.model.TicketStatus;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
public class TicketReceiveDto extends TicketDto {

    @Null(message = "Status must be null for receive tickets")
    private TicketStatus ticketStatus;

    public TicketReceiveDto(TicketReceive ticket) {
        super(ticket);
    }
}
