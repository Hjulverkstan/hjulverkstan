package se.hjulverkstan.main.dto.tickets;

import lombok.*;
import se.hjulverkstan.main.model.TicketReceive;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
public class NewTicketReceiveDto extends NewTicketDto {
    public NewTicketReceiveDto(TicketReceive ticket) {
        super(ticket);
    }
}
