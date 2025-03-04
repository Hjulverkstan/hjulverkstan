package se.hjulverkstan.main.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.Exceptions.UnsupportedTicketVehiclesException;
import se.hjulverkstan.main.dto.responses.GetAllTicketDto;
import se.hjulverkstan.main.dto.tickets.EditTicketDto;
import se.hjulverkstan.main.dto.tickets.NewTicketDto;
import se.hjulverkstan.main.dto.tickets.TicketDto;
import se.hjulverkstan.main.dto.tickets.TicketStatusDto;
import se.hjulverkstan.main.model.Customer;
import se.hjulverkstan.main.model.Employee;
import se.hjulverkstan.main.model.Ticket;
import se.hjulverkstan.main.model.TicketStatus;
import se.hjulverkstan.main.model.TicketType;
import se.hjulverkstan.main.model.Vehicle;
import se.hjulverkstan.main.model.VehicleStatus;
import se.hjulverkstan.main.repository.CustomerRepository;
import se.hjulverkstan.main.repository.EmployeeRepository;
import se.hjulverkstan.main.repository.TicketRepository;
import se.hjulverkstan.main.repository.VehicleRepository;

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
        if (editTicketDto.getTicketType() == TicketType.REPAIR && selectedTicket.getTicketType() == TicketType.REPAIR) {
            selectedTicket.setRepairDescription(editTicketDto.getRepairDescription());
            selectedTicket.setEndDate(editTicketDto.getEndDate());

        } else if (editTicketDto.getTicketType() == TicketType.RENT && selectedTicket.getTicketType()==TicketType.RENT) {
            selectedTicket.setEndDate(editTicketDto.getEndDate());
        }

        // General Ticket attributes
        selectedTicket.setStartDate(editTicketDto.getStartDate());
        selectedTicket.setComment(editTicketDto.getComment());

        List<Vehicle> vehicles = getTicketVehicleList(editTicketDto.getVehicleIds());
        selectedTicket.setVehicles(vehicles);
        vehicles.forEach(vehicle -> {
            if (!vehicle.getTickets().contains(selectedTicket)) vehicle.getTickets().add(selectedTicket);
        });

        if (selectedTicket.getTicketType() == TicketType.RENT) {
            if(vehicles.stream().anyMatch(Vehicle::isCustomerOwned)){
                throw new UnsupportedTicketVehiclesException("Customer Owned Vehicles cannot be selected for Rental Tickets!");
            }
            vehicleRepository.saveAll(vehicles);
        }


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
        Ticket ticket = new Ticket();

        //Sub-ticket attributes
        // Handling each Tickets types directly from the attribute instead of instances
        if (newTicket.getTicketType() == TicketType.REPAIR && ticket.getTicketType() == TicketType.REPAIR) {
            ticket.setRepairDescription(newTicket.getRepairDescription());
            ticket.setTicketStatus(TicketStatus.READY);
            ticket.setStartDate(newTicket.getStartDate());
            ticket.setEndDate(newTicket.getEndDate());
        } else if (newTicket.getTicketType() == TicketType.RENT && ticket.getTicketType() == TicketType.RENT) {
            ticket.setEndDate(newTicket.getEndDate());
            ticket.setTicketStatus(TicketStatus.READY);
            ticket.setStartDate(newTicket.getStartDate());
        } else if (newTicket.getTicketType() == TicketType.DONATE && ticket.getTicketType() == TicketType.DONATE) {
            ticket.setTicketStatus(null);
            ticket.setStartDate(null);
        } else if (newTicket.getTicketType() == TicketType.RECEIVE && ticket.getTicketType() == TicketType.RECEIVE) {
            ticket.setTicketStatus(null);
            ticket.setStartDate(null);
        }
       //merged the two parts for more readability

        // General Ticket attributes
        ticket.setTicketType(newTicket.getTicketType());
        ticket.setComment(newTicket.getComment());

        List<Vehicle> vehicles = getTicketVehicleList(newTicket.getVehicleIds());
        ticket.setVehicles(vehicles);


        vehicles.forEach(vehicle -> {
            if (!vehicle.getTickets().contains(ticket)) vehicle.getTickets().add(ticket);
        });

        if (ticket.getTicketType() == TicketType.RENT) {
            if(vehicles.stream().anyMatch(Vehicle::isCustomerOwned)){
                throw new UnsupportedTicketVehiclesException("Customer Owned Vehicles cannot be selected for Rental Tickets!");
            }
            vehicleRepository.saveAll(vehicles);
        }


        Employee employee = getTicketEmployee(newTicket.getEmployeeId());
        employee.getTickets().add(ticket);
        ticket.setEmployee(employee);

        Customer customer = getTicketCustomer(newTicket.getCustomerId());
        customer.getTickets().add(ticket);
        ticket.setCustomer(customer);

        // Update vehicle status to UNAVAILABLE if it's a repair ticket, not closed and not customer owned
        if (ticket.getTicketType() == TicketType.REPAIR && ticket.getTicketStatus() != TicketStatus.CLOSED) {
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
        boolean isRepairTicket = ticket.getTicketType() == TicketType.REPAIR;
        boolean isRentTicket = ticket.getTicketType() == TicketType.RENT;

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

    // In the end The createSpecificTicketType has become not needed at all
    /**
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
    */

    private TicketDto convertToDto(Ticket ticket) {
        return new TicketDto(ticket);
    }

}
