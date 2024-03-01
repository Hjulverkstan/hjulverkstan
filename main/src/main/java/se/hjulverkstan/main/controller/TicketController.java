package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.NewTicketDto;
import se.hjulverkstan.main.dto.TicketDto;
import se.hjulverkstan.main.dto.responses.GetAllTicketDto;
import se.hjulverkstan.main.service.TicketService;

@RestController
@RequestMapping("/ticket")
public class TicketController {
    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }
    @GetMapping()
    public ResponseEntity<GetAllTicketDto> getAllTickets() {
        return new ResponseEntity<>(service.getAllTicket(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> getTicketById(@PathVariable Long id) {
        return new ResponseEntity<>(service.getTicketById(id), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<TicketDto> createTicket(@RequestBody NewTicketDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketDto> editTicket(@PathVariable Long id, @RequestBody TicketDto ticket) {
        return new ResponseEntity<>(service.editTicket(id, ticket), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TicketDto> deleteTicket(@PathVariable Long id) {
        return new ResponseEntity<>(service.deleteTicket(id), HttpStatus.OK);
    }

}
