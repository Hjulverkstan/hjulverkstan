package se.hjulverkstan.main.feature.ticket;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/api/ticket")
@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;

    @GetMapping()
    public GetAllTicketDto getAllTickets() {
        return ticketService.getAllTicket();
    }

    @GetMapping("/{id}")
    public TicketDto getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public TicketDto createTicket(@Valid @RequestBody TicketDto dto) {
        return ticketService.createTicket(dto);
    }

    @PutMapping("/{id}")
    public TicketDto editTicket(@PathVariable Long id, @Valid @RequestBody TicketDto dto) {
        return ticketService.editTicket(id, dto);
    }

    @PutMapping("/{id}/status")
    public TicketDto updateTicketStatus(@PathVariable Long id, @Valid @RequestBody TicketStatusDto body) {
        return ticketService.updateTicketStatus(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
    }
}
