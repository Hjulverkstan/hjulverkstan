package se.hjulverkstan.main.dto.tickets;

import lombok.*;
import se.hjulverkstan.main.model.ticket.TicketRent;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TicketRentDto extends TicketDto {
    private LocalDateTime endDate;

    public TicketRentDto(TicketRent ticket) {
        super(ticket);
        this.endDate=ticket.getEndDate();
    }
}
