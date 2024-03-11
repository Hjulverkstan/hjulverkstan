package se.hjulverkstan.main.dto.tickets;

import lombok.*;
import se.hjulverkstan.main.model.TicketRent;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
public class TicketRentDto extends TicketDto {
    public TicketRentDto(TicketRent ticket) {
        super(ticket);
    }
}
