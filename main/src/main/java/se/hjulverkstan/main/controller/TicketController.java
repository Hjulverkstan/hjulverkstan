package se.hjulverkstan.main.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.responses.GetAllTicketDto;
import se.hjulverkstan.main.dto.tickets.*;
import se.hjulverkstan.main.service.TicketService;

@RestController
@RequestMapping("v1/ticket")
@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
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
    public ResponseEntity<TicketDto> createTicketRental(@Valid @RequestBody NewTicketRentDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PostMapping("/repair")
    public ResponseEntity<TicketDto> createTicketRepair(@Valid @RequestBody NewTicketRepairDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PostMapping("/donate")
    public ResponseEntity<TicketDto> createTicketDonate(@Valid @RequestBody NewTicketDonateDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PostMapping("/receive")
    public ResponseEntity<TicketDto> createTicketReceive(@Valid @RequestBody NewTicketReceiveDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PutMapping("/rent/{id}")
    public ResponseEntity<TicketDto> editTicketRent(@PathVariable Long id, @Valid @RequestBody EditTicketRentDto ticket) {
        return new ResponseEntity<>(service.editTicket(id, ticket), HttpStatus.OK);
    }

    @PutMapping("/repair/{id}")
    public ResponseEntity<TicketDto> editTicketRepair(@PathVariable Long id, @Valid @RequestBody EditTicketRepairDto ticket) {
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
