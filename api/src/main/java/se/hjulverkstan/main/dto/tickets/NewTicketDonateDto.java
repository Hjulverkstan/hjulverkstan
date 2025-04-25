package se.hjulverkstan.main.dto.tickets;

import lombok.*;
import se.hjulverkstan.main.model.TicketDonate;

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
