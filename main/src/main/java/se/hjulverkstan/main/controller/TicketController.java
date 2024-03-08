package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.responses.GetAllTicketDto;
import se.hjulverkstan.main.dto.tickets.*;
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

    @PostMapping("/rent")
    public ResponseEntity<TicketDto> createTicketRental(@RequestBody NewTicketRentDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PostMapping("/repair")
    public ResponseEntity<TicketDto> createTicketRepair(@RequestBody NewTicketRepairDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PostMapping("/donate")
    public ResponseEntity<TicketDto> createTicketDonate(@RequestBody NewTicketDonateDto newTicket) {
        return new ResponseEntity<>(service.createTicket(newTicket), HttpStatus.OK);
    }

    @PutMapping("/rent/{id}")
    public ResponseEntity<TicketDto> editTicketRent(@PathVariable Long id, @RequestBody TicketRentDto ticket) {
        return new ResponseEntity<>(service.editTicket(id, ticket), HttpStatus.OK);
    }

    @PutMapping("/repair/{id}")
    public ResponseEntity<TicketDto> editTicketRepair(@PathVariable Long id, @RequestBody TicketRepairDto ticket) {
        return new ResponseEntity<>(service.editTicket(id, ticket), HttpStatus.OK);
    }

    @PutMapping("/donate/{id}")
    public ResponseEntity<TicketDto> editTicketDonate(@PathVariable Long id, @RequestBody TicketDonateDto ticket) {
        return new ResponseEntity<>(service.editTicket(id, ticket), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TicketDto> deleteTicket(@PathVariable Long id) {
        return new ResponseEntity<>(service.deleteTicket(id), HttpStatus.OK);
    }

}
