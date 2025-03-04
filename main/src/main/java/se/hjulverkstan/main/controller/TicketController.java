package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import se.hjulverkstan.main.dto.responses.GetAllTicketDto;
import se.hjulverkstan.main.dto.tickets.EditTicketDto;
import se.hjulverkstan.main.dto.tickets.NewTicketDto;
import se.hjulverkstan.main.dto.tickets.TicketDto;
import se.hjulverkstan.main.dto.tickets.TicketStatusDto;
import se.hjulverkstan.main.service.TicketService;

@RestController
@RequestMapping("v1/ticket")
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

    @PostMapping("/rent")
    public ResponseEntity<TicketDto> createTicketRental(@Valid @RequestBody NewTicketDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PostMapping("/repair")
    public ResponseEntity<TicketDto> createTicketRepair(@Valid @RequestBody NewTicketDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PostMapping("/donate")
    public ResponseEntity<TicketDto> createTicketDonate(@Valid @RequestBody NewTicketDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PostMapping("/receive")
    public ResponseEntity<TicketDto> createTicketReceive(@Valid @RequestBody NewTicketDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PutMapping("/rent/{id}")
    public ResponseEntity<TicketDto> editTicketRent(@PathVariable Long id, @Valid @RequestBody EditTicketDto ticket) {
        return new ResponseEntity<>(service.editTicket(id, ticket), HttpStatus.OK);
    }

    @PutMapping("/repair/{id}")
    public ResponseEntity<TicketDto> editTicketRepair(@PathVariable Long id, @Valid @RequestBody EditTicketDto ticket) {
        return new ResponseEntity<>(service.editTicket(id, ticket), HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TicketDto> updateTicketStatus(@PathVariable Long id, @Valid @RequestBody TicketStatusDto body) {
        return new ResponseEntity<>(service.updateTicketStatus(id, body), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TicketDto> deleteTicket(@PathVariable Long id) {
        return new ResponseEntity<>(service.deleteTicket(id), HttpStatus.OK);
    }

}
