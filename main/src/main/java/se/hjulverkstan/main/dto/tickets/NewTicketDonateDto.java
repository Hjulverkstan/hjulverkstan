package se.hjulverkstan.main.dto.tickets;

import lombok.*;
import se.hjulverkstan.main.model.ticket.TicketDonate;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
public class NewTicketDonateDto extends NewTicketDto {
    public NewTicketDonateDto(TicketDonate ticket) {
        super(ticket);
    }
}
