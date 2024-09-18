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
public class EditTicketRentDto extends EditTicketDto {
    private LocalDateTime endDate;

    public EditTicketRentDto(TicketRent ticket) {
        super(ticket);
        this.endDate=ticket.getEndDate();
    }
}
