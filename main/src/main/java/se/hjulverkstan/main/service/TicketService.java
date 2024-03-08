package se.hjulverkstan.main.service;

import se.hjulverkstan.main.dto.responses.GetAllTicketDto;
import se.hjulverkstan.main.dto.tickets.NewTicketDto;
import se.hjulverkstan.main.dto.tickets.TicketDto;

public interface TicketService {
    GetAllTicketDto getAllTicket();

    TicketDto getTicketById(Long id);

    TicketDto deleteTicket(Long id);

    TicketDto editTicket(Long id, TicketDto ticket);

    TicketDto createTicket(NewTicketDto newTicket);
}
