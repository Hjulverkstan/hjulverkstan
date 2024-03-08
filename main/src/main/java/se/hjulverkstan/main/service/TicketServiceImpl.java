package se.hjulverkstan.main.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.Exceptions.UnsupportedTicketTypeException;
import se.hjulverkstan.main.dto.responses.GetAllTicketDto;
import se.hjulverkstan.main.dto.tickets.*;
import se.hjulverkstan.main.model.*;
import se.hjulverkstan.main.repository.CustomerRepository;
import se.hjulverkstan.main.repository.EmployeeRepository;
import se.hjulverkstan.main.repository.TicketRepository;
import se.hjulverkstan.main.repository.VehicleRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;
    public static final String ELEMENT_NAME = "Ticket";

    @Autowired
    public TicketServiceImpl(
            TicketRepository ticketRepository,
            EmployeeRepository employeeRepository,
            CustomerRepository customerRepository,
            VehicleRepository vehicleRepository) {
        this.ticketRepository = ticketRepository;
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public GetAllTicketDto getAllTicket() {
        List<Ticket> tickets = ticketRepository.findAll();
        List<TicketDto> responseList = new ArrayList<>();

        for (Ticket ticket : tickets) {
            responseList.add(convertToDto(ticket));
        }
        return new GetAllTicketDto(responseList);
    }

    @Override
    public TicketDto getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        return convertToDto(ticket);
    }

    @Override
    public TicketDto deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));
        // TODO: Decide if needed, maybe we don't want to delete tickets?
        ticket.getVehicles().stream().forEach(vehicle -> {
            if (vehicle.getTickets().contains(ticket)) {
                vehicle.getTickets().remove(ticket);
                vehicleRepository.save(vehicle);
            }
        });

        if (ticket.getCustomer() != null) {
            Customer customer = ticket.getCustomer();
            customer.getTickets().remove(ticket);
            customerRepository.save(customer);
        }

        if (ticket.getEmployee() != null) {
            Employee employee = ticket.getEmployee();
            employee.getTickets().remove(ticket);
            employeeRepository.save(employee);
        }

        ticketRepository.delete(ticket);
        return convertToDto(ticket);
    }

    @Override
    public TicketDto editTicket(Long id, TicketDto ticket) {
        Ticket selectedTicket = ticketRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        // Handles different ticket types. Accepts loan, repair & donate tickets.
        updateSpecificTicketAttributes(ticket, selectedTicket);

        // General Ticket attributes
        selectedTicket.setTicketType(ticket.getTicketType());
        selectedTicket.setOpen(ticket.isOpen());

        updateTicketEmployee(selectedTicket, ticket.getEmployeeId());
        updateTicketCustomer(selectedTicket, ticket.getCustomerId());
        selectedTicket.setComment(ticket.getComment());

        ticketRepository.save(selectedTicket);
        return convertToDto(selectedTicket);
    }

    @Override
    public TicketDto createTicket(NewTicketDto newTicket) {
        // Handles different ticket types. Accepts loan, repair & donate tickets.
        Ticket ticket = createSpecificTicketType(newTicket);

        // General Ticket attributes
        ticket.setTicketType(newTicket.getTicketType());
        ticket.setOpen(true);
        ticket.setComment(newTicket.getComment());

        handleVehicles(ticket, newTicket);
        handleCustomerAndEmployee(ticket, newTicket.getEmployeeId(), newTicket.getCustomerId());

        ticketRepository.save(ticket);
        return convertToDto(ticket);
    }

    private void handleVehicles(Ticket ticket, NewTicketDto ticketDto) {
        // Get vehicles from vehicleIds
        List<Vehicle> vehicles = ticketDto.getVehicleIds().stream()
                .map(vehicleId -> vehicleRepository.findById(vehicleId)
                        .orElseThrow(() -> new ElementNotFoundException("Vehicle with id " + vehicleId)))
                .collect(Collectors.toList());

        // Set vehicles on ticket
        ticket.setVehicles(vehicles);
        // Set ticket on vehicles
        vehicles.stream().forEach(vehicle -> vehicle.getTickets().add(ticket));
    }

    private static void updateSpecificTicketAttributes(TicketDto ticket, Ticket selectedTicket) {
        if (ticket instanceof TicketRentDto rentDto && selectedTicket instanceof TicketRent ticketRent) {
            ticketRent.setStartDate(rentDto.getStartDate());
            ticketRent.setEndDate(rentDto.getEndDate());
        } else if (ticket instanceof TicketRepairDto repairDto && selectedTicket instanceof TicketRepair ticketRepair) {
            ticketRepair.setStartDate(repairDto.getStartDate());
            ticketRepair.setRepairDescription(repairDto.getRepairDescription());
        } else if (ticket instanceof TicketDonateDto donateDto && selectedTicket instanceof TicketDonate ticketDonate) {
            ticketDonate.setDonatedBy(donateDto.getDonatedBy());
            ticketDonate.setDonationDate(donateDto.getDonataionDate());
        } else {
            throw new UnsupportedTicketTypeException("Mismatch between the type of the selected ticket and the DTO provided");
        }
    }

    private Ticket createSpecificTicketType(NewTicketDto newTicket) {
        if (newTicket instanceof NewTicketRentDto rentDto) {
            TicketRent ticketRent = new TicketRent();
            ticketRent.setStartDate(rentDto.getStartDate());
            ticketRent.setEndDate(rentDto.getEndDate());

            return ticketRent;
        } else if (newTicket instanceof NewTicketRepairDto repairDto) {
            TicketRepair ticketRepair = new TicketRepair();
            ticketRepair.setRepairDescription(repairDto.getRepairDescription());
            ticketRepair.setStartDate(repairDto.getStartDate());

            return ticketRepair;
        } else if (newTicket instanceof NewTicketDonateDto donateDto) {
            TicketDonate ticketDonate = new TicketDonate();
            ticketDonate.setDonatedBy(donateDto.getDonatedBy());
            ticketDonate.setDonationDate(donateDto.getDonationDate());

            return ticketDonate;
        }
        throw new UnsupportedTicketTypeException("Unsupported ticket type provided");
    }

    private void handleCustomerAndEmployee(Ticket ticket, Long employeeId, Long customerId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ElementNotFoundException("Employee"));
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ElementNotFoundException("Customer"));

        employee.getTickets().add(ticket);
        ticket.setEmployee(employee);

        customer.getTickets().add(ticket);
        ticket.setCustomer(customer);
    }

    private TicketDto convertToDto(Ticket ticket) {
        if (ticket instanceof TicketRent) {
            return new TicketRentDto((TicketRent) ticket);
        } else if (ticket instanceof TicketRepair) {
            return new TicketRepairDto((TicketRepair) ticket);
        } else if (ticket instanceof TicketDonate) {
            return new TicketDonateDto((TicketDonate) ticket);
        }
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
