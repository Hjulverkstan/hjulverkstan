package se.hjulverkstan.main.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.Exceptions.UnsupportedTicketStatusException;
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
        List<Ticket> tickets = ticketRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
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
        ticket.getVehicles().forEach(vehicle -> {
            vehicle.getTickets().remove(ticket);
        });

        if (ticket.getCustomer() != null) {
            Customer customer = ticket.getCustomer();
            customer.getTickets().remove(ticket);
        }

        if (ticket.getEmployee() != null) {
            Employee employee = ticket.getEmployee();
            employee.getTickets().remove(ticket);
        }

        ticketRepository.delete(ticket);
        return convertToDto(ticket);
    }

    @Override
    public TicketDto editTicket(Long id, TicketDto ticketDto) {
        Ticket selectedTicket = ticketRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        // Sub-ticket attributes
        if (ticketDto instanceof TicketRepairDto repairDto && selectedTicket instanceof TicketRepair ticketRepair) {
            ticketRepair.setRepairDescription(repairDto.getRepairDescription());
            ticketRepair.setEndDate(repairDto.getEndDate());

        } else if (ticketDto instanceof TicketRentDto rentDto && selectedTicket instanceof TicketRent ticketRent) {
            ticketRent.setEndDate(rentDto.getEndDate());
        }

        // General Ticket attributes
        selectedTicket.setStartDate(ticketDto.getStartDate());
        selectedTicket.setComment(ticketDto.getComment());

        List<Vehicle> vehicles = getTicketVehicleList(ticketDto.getVehicleIds());
        selectedTicket.setVehicles(vehicles);
        vehicles.forEach(vehicle -> {
            if (!vehicle.getTickets().contains(selectedTicket)) vehicle.getTickets().add(selectedTicket);
        });

        Employee newEmployee = getTicketEmployee(ticketDto.getEmployeeId());
        Employee oldEmployee = selectedTicket.getEmployee();
        if (!oldEmployee.equals(newEmployee)) {
            oldEmployee.getTickets().remove(selectedTicket);
            newEmployee.getTickets().add(selectedTicket);
            selectedTicket.setEmployee(newEmployee);
        }

        Customer newCustomer = getTicketCustomer(ticketDto.getCustomerId());
        Customer oldCustomer = selectedTicket.getCustomer();
        if (!oldCustomer.equals(newCustomer)) {
            oldCustomer.getTickets().remove(selectedTicket);
            newCustomer.getTickets().add(selectedTicket);
            selectedTicket.setCustomer(newCustomer);
        }

        ticketRepository.save(selectedTicket);
        return convertToDto(selectedTicket);
    }

    @Override
    public TicketDto createTicket(NewTicketDto newTicket) {
        // Handles different ticket types. Accepts loan, repair & donate tickets.
        Ticket ticket = createSpecificTicketType(newTicket);

        //Sub-ticket attributes
        if (newTicket instanceof NewTicketRepairDto repairDto && ticket instanceof TicketRepair ticketRepair) {
            ticketRepair.setRepairDescription(repairDto.getRepairDescription());
            ticketRepair.setTicketStatus(TicketStatus.READY);
            ticketRepair.setEndDate(repairDto.getEndDate());
        } else if (newTicket instanceof NewTicketRentDto rentDto && ticket instanceof TicketRent ticketRent) {
            ticketRent.setEndDate(rentDto.getEndDate());
            ticketRent.setTicketStatus(TicketStatus.READY);
        } else if (newTicket instanceof NewTicketDonateDto && ticket instanceof TicketDonate) {
            ticket.setTicketStatus(null);
        }

        // General Ticket attributes
        ticket.setTicketType(newTicket.getTicketType());
        ticket.setStartDate(newTicket.getStartDate());
        ticket.setComment(newTicket.getComment());

        List<Vehicle> vehicles = getTicketVehicleList(newTicket.getVehicleIds());
        ticket.setVehicles(vehicles);
        vehicles.forEach(vehicle -> {
            if (!vehicle.getTickets().contains(ticket)) vehicle.getTickets().add(ticket);
        });

        Employee employee = getTicketEmployee(newTicket.getEmployeeId());
        employee.getTickets().add(ticket);
        ticket.setEmployee(employee);

        Customer customer = getTicketCustomer(newTicket.getCustomerId());
        customer.getTickets().add(ticket);
        ticket.setCustomer(customer);

        ticketRepository.save(ticket);
        return convertToDto(ticket);
    }

    @Override
    public TicketDto updateTicketStatus(Long id, TicketStatusDto ticketStatusDto) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("Ticket with id " + id + " not found"));

        if (ticket instanceof TicketRepair) {
            if (!ticket.isValidTicketStatusTransition(ticketStatusDto.getTicketStatus())) {
                throw new UnsupportedTicketStatusException("Invalid status transition for TicketRepair");
            }
        } else if (ticket instanceof TicketRent) {
            if (!ticket.isValidTicketStatusTransition(ticketStatusDto.getTicketStatus())) {
                throw new UnsupportedTicketStatusException("Invalid status transition for TicketRent");
            }
        } else if (ticket instanceof TicketDonate) {
            if (ticketStatusDto.getTicketStatus() != null) {
                throw new UnsupportedTicketStatusException("TicketDonate cannot have any status other than null");
            }
        }

        ticket.setTicketStatus(ticketStatusDto.getTicketStatus());
        ticketRepository.save(ticket);

        return convertToDto(ticket);
    }

    private Customer getTicketCustomer(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ElementNotFoundException("Customer with id: " + customerId));
    }

    private Employee getTicketEmployee(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ElementNotFoundException("Employee with id: " + employeeId));
    }

    private List<Vehicle> getTicketVehicleList(List<Long> vehicleIds) {
        return vehicleIds.stream()
                .map(vehicleId -> vehicleRepository.findById(vehicleId)
                        .orElseThrow(() -> new ElementNotFoundException("Vehicle with id " + vehicleId)))
                .collect(Collectors.toList());
    }

    private Ticket createSpecificTicketType(NewTicketDto newTicket) {
        if (newTicket instanceof NewTicketRentDto) {
            return new TicketRent();
        } else if (newTicket instanceof NewTicketRepairDto) {
            return new TicketRepair();
        } else if (newTicket instanceof NewTicketDonateDto) {
            return new TicketDonate();
        }
        throw new UnsupportedTicketTypeException("Unsupported ticket type provided");
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

}
