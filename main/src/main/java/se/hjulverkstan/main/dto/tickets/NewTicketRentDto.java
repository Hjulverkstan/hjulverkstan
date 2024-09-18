package se.hjulverkstan.main.dto.tickets;

import lombok.*;
import se.hjulverkstan.main.model.TicketRent;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class NewTicketRentDto extends NewTicketDto {
    private LocalDateTime endDate;

    public NewTicketRentDto(TicketRent ticket) {
        super(ticket);
        this.endDate=ticket.getEndDate();
    }

}
