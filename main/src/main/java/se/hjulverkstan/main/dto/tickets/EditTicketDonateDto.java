package se.hjulverkstan.main.dto.tickets;

import lombok.*;
import se.hjulverkstan.main.model.TicketDonate;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
public class EditTicketDonateDto extends EditTicketDto {

    public EditTicketDonateDto(TicketDonate ticket) {
        super(ticket);
    }
}