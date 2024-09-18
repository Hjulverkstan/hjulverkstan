package se.hjulverkstan.main.service;

import se.hjulverkstan.main.dto.responses.GetAllTicketDto;
import se.hjulverkstan.main.dto.tickets.NewTicketDto;
import se.hjulverkstan.main.dto.tickets.TicketDto;
import se.hjulverkstan.main.dto.tickets.TicketStatusDto;

public interface TicketService {
    GetAllTicketDto getAllTicket();

    TicketDto getTicketById(Long id);

    TicketDto deleteTicket(Long id);

    TicketDto editTicket(Long id, TicketDto ticket);

    TicketDto createTicket(NewTicketDto newTicket);

    TicketDto updateTicketStatus(Long id, TicketStatusDto ticketStatusDto);
}
