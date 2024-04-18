package se.hjulverkstan.main.dto.tickets;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import se.hjulverkstan.main.model.TicketRent;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
public class TicketRentDto extends TicketDto {
    private LocalDateTime endDate;
    @NotNull(message = "Ticket status is required")
    private Boolean isOpen;
    public TicketRentDto(TicketRent ticket) {
        super(ticket);
        this.endDate=ticket.getEndDate();
        this.isOpen=ticket.isOpen();
    }
}
