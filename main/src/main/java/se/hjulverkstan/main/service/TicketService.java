package se.hjulverkstan.main.service;

import se.hjulverkstan.main.dto.NewTicketDto;
import se.hjulverkstan.main.dto.TicketDto;
import se.hjulverkstan.main.dto.responses.GetAllTicketDto;

public interface TicketService {
    public GetAllTicketDto getAllTicket();
    public TicketDto getTicketById(Long id);
    public TicketDto deleteTicket(Long id);
    public TicketDto editTicket(Long id, TicketDto ticket);
    public TicketDto createTicket(NewTicketDto newTicket);
}
