package se.hjulverkstan.main.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.NewTicketDto;
import se.hjulverkstan.main.dto.TicketDto;
import se.hjulverkstan.main.dto.responses.GetAllTicketDto;
import se.hjulverkstan.main.model.Customer;
import se.hjulverkstan.main.model.Employee;
import se.hjulverkstan.main.model.Ticket;
import se.hjulverkstan.main.repository.CustomerRepository;
import se.hjulverkstan.main.repository.EmployeeRepository;
import se.hjulverkstan.main.repository.TicketRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    public static final String ELEMENT_NAME = "Ticket";

    @Autowired
    public TicketServiceImpl(
            TicketRepository ticketRepository,
            EmployeeRepository employeeRepository,
            CustomerRepository customerRepository) {
        this.ticketRepository = ticketRepository;
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public GetAllTicketDto getAllTicket() {
        List<Ticket> tickets = ticketRepository.findAll();
        List<TicketDto> responseList = new ArrayList<>();

        for (Ticket ticket : tickets) {
            responseList.add(new TicketDto(ticket));
        }
        return new GetAllTicketDto(responseList);
    }

    @Override
    public TicketDto getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        return new TicketDto(ticket);
    }

    @Override
    public TicketDto deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));
        // TODO: remove ticket from vehicle

        Customer customer = ticket.getCustomer();
        customer.getTickets().remove(ticket);

        Employee employee = ticket.getEmployee();
        employee.getTickets().remove(ticket);

        ticketRepository.delete(ticket);
        return new TicketDto(ticket);
    }

    @Override
    public TicketDto editTicket(Long id, TicketDto ticket) {
        Ticket selectedTicket = ticketRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        selectedTicket.setTicketType(ticket.getTicketType());
        //TODO: set ticket.vehicles

        updateTicketEmployee(selectedTicket, ticket.getEmployeeId());
        updateTicketCustomer(selectedTicket, ticket.getCustomerId());

        selectedTicket.setStartDate(ticket.getStartDate());
        selectedTicket.setEndDate(ticket.getEndDate());
        selectedTicket.setComment(ticket.getComment());

        ticketRepository.save(selectedTicket);
        return ticket;
    }

    @Override
    public TicketDto createTicket(NewTicketDto newTicket) {
        Ticket ticket = new Ticket();
        ticket.setTicketType(newTicket.getTicketType());
        // TODO: implement vehicle dependecies
        // ticket.setVehicles();
        ticket.setStartDate(newTicket.getStartDate());
        ticket.setEndDate(newTicket.getEndDate());
        ticket.setComment(newTicket.getComment());

        Employee employee = employeeRepository.findById(newTicket.getEmployeeId())
                .orElseThrow(() -> new ElementNotFoundException("Employee"));
        Customer customer = customerRepository.findById(newTicket.getCustomerId())
                .orElseThrow(() -> new ElementNotFoundException("Customer"));

        employee.getTickets().add(ticket);
        ticket.setEmployee(employee);

        customer.getTickets().add(ticket);
        ticket.setCustomer(customer);


        ticketRepository.save(ticket);
        return new TicketDto(ticket);
    }

    private void updateTicketCustomer(Ticket ticket, Long newCustomerId) {
        Customer newCustomer = customerRepository.findById(newCustomerId)
                .orElseThrow(() -> new ElementNotFoundException("New Customer"));
        Customer oldCustomer = customerRepository.findById(ticket.getCustomer().getId())
                .orElseThrow(() -> new ElementNotFoundException("Old Customer"));
        if (oldCustomer.equals(newCustomer)) {
            return; // No need to update if the old and new customers are the same.
        }

        oldCustomer.getTickets().remove(ticket);
        newCustomer.getTickets().add(ticket);
        ticket.setCustomer(newCustomer);
    }

    private void updateTicketEmployee(Ticket ticket, Long newEmployeeId) {
        Employee newEmployee = employeeRepository.findById(newEmployeeId)
                .orElseThrow(() -> new ElementNotFoundException("New Employee"));
        Employee oldEmployee = employeeRepository.findById(ticket.getEmployee().getId())
                .orElseThrow(() -> new ElementNotFoundException("Old Employee"));
        if (oldEmployee.equals(newEmployee)) {
            return; // No need to update if the old and new customers are the same.
        }

        oldEmployee.getTickets().remove(ticket);
        newEmployee.getTickets().add(ticket);
        ticket.setEmployee(newEmployee);
    }
}
