package se.hjulverkstan.main.feature.ticket;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class GetAllTicketDto {
    private List<TicketDto> tickets;

    public GetAllTicketDto(List<Ticket> tickets) {
        this.tickets = tickets.stream().map(TicketDto::new).toList();
    }
}
