package se.hjulverkstan.main.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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
    public TicketDto editTicket(Long id, EditTicketDto editTicketDto) {
        Ticket selectedTicket = ticketRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        // Sub-ticket attributes
        if (editTicketDto instanceof EditTicketRepairDto repairDto && selectedTicket instanceof TicketRepair ticketRepair) {
            ticketRepair.setRepairDescription(repairDto.getRepairDescription());
            ticketRepair.setEndDate(repairDto.getEndDate());

        } else if (editTicketDto instanceof EditTicketRentDto rentDto && selectedTicket instanceof TicketRent ticketRent) {
            ticketRent.setEndDate(rentDto.getEndDate());
        }

        // General Ticket attributes
        selectedTicket.setStartDate(editTicketDto.getStartDate());
        selectedTicket.setComment(editTicketDto.getComment());

        List<Vehicle> vehicles = getTicketVehicleList(editTicketDto.getVehicleIds());
        selectedTicket.setVehicles(vehicles);
        vehicles.forEach(vehicle -> {
            if (!vehicle.getTickets().contains(selectedTicket)) vehicle.getTickets().add(selectedTicket);
        });

        Employee newEmployee = getTicketEmployee(editTicketDto.getEmployeeId());
        Employee oldEmployee = selectedTicket.getEmployee();
        if (!oldEmployee.equals(newEmployee)) {
            oldEmployee.getTickets().remove(selectedTicket);
            newEmployee.getTickets().add(selectedTicket);
            selectedTicket.setEmployee(newEmployee);
        }

        Customer newCustomer = getTicketCustomer(editTicketDto.getCustomerId());
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
        } else if (newTicket instanceof NewTicketReceiveDto && ticket instanceof TicketReceive) {
            ticket.setTicketStatus(null);
        }

        if (newTicket instanceof NewTicketDonateDto && ticket instanceof TicketDonate) {
            ticket.setStartDate(null);
        } else if (newTicket instanceof NewTicketReceiveDto && ticket instanceof TicketReceive) {
            ticket.setStartDate(null);
        } else {
            ticket.setStartDate(newTicket.getStartDate());
        }

        // General Ticket attributes
        ticket.setTicketType(newTicket.getTicketType());
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

        // Update vehicle status to UNAVAILABLE if it's a repair ticket, not closed and not customer owned
        if (ticket instanceof TicketRepair && ticket.getTicketStatus() != TicketStatus.CLOSED) {
            for (Vehicle vehicle : vehicles) {
                if (vehicle.getVehicleStatus() == VehicleStatus.AVAILABLE && !vehicle.isCustomerOwned()) {
                    vehicle.setVehicleStatus(VehicleStatus.UNAVAILABLE);
                    vehicleRepository.save(vehicle);
                }
            }
        }

        ticketRepository.save(ticket);
        return convertToDto(ticket);
    }

    @Override
    public TicketDto updateTicketStatus(Long id, TicketStatusDto ticketStatusDto) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("Ticket with id " + id + " not found"));

                /*
        TODO: Implement proper validation strategy
         Not sure what pattern we should be using here.
         Ways that validation could be done:
         - Define separate DTOs for every ticket type and using instance of the ticket from the db apply validation
           using the dto.
         - Rewrite the validation logic in this service
         - Reuse the validation methods from the entity layer
        */

        TicketStatus newStatus = ticketStatusDto.getTicketStatus();
        boolean isRepairTicket = ticket instanceof TicketRepair;
        boolean isRentTicket = ticket instanceof TicketRent;

        List<Vehicle> vehicles = ticket.getVehicles();

        for (Vehicle vehicle : vehicles) {
            if (vehicle.isCustomerOwned()) {
                if (newStatus == TicketStatus.CLOSED) {
                    vehicle.setVehicleStatus(VehicleStatus.ARCHIVED);
                } else {
                    vehicle.setVehicleStatus(null);
                }
                vehicleRepository.save(vehicle);
            } else {
                if (isRentTicket) {
                    if (newStatus == TicketStatus.IN_PROGRESS) {
                        if (vehicle.getVehicleStatus() == VehicleStatus.AVAILABLE) {
                            vehicle.setVehicleStatus(VehicleStatus.UNAVAILABLE);
                            vehicleRepository.save(vehicle);
                        }
                    }
                } else if (isRepairTicket) {
                        if (vehicle.getVehicleStatus() == VehicleStatus.AVAILABLE) {
                            vehicle.setVehicleStatus(VehicleStatus.UNAVAILABLE);
                            vehicleRepository.save(vehicle);
                        }
                }
            }
        }

        ticket.setTicketStatus(newStatus);
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
        } else if (newTicket instanceof NewTicketReceiveDto) {
            return new TicketReceive();
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
        } else if (ticket instanceof TicketReceive) {
            return new TicketReceiveDto((TicketReceive) ticket);
        }
        return new TicketDto(ticket);
    }

}
