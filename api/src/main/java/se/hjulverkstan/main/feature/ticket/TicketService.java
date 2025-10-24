package se.hjulverkstan.main.feature.ticket;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.feature.customer.Customer;
import se.hjulverkstan.main.feature.customer.CustomerRepository;
import se.hjulverkstan.main.feature.employee.Employee;
import se.hjulverkstan.main.feature.employee.EmployeeRepository;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.location.LocationRepository;
import se.hjulverkstan.main.feature.vehicle.VehicleRepository;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.shared.ListResponseDto;
import se.hjulverkstan.main.shared.ValidationUtils;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final LocationRepository locationRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;

    public ListResponseDto<TicketDto> getAllTicket() {
        List<Ticket> tickets = ticketRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return new ListResponseDto<>(tickets.stream().map(TicketDto::new).toList());
    }

    public TicketDto getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));
        return new TicketDto(ticket);
    }

    @Transactional
    public TicketDto createTicket(TicketDto dto) {
        TicketUtils.validateDtoBySelf(dto);

        List<Vehicle> vehicles = vehicleRepository.findAllById(dto.getVehicleIds());

        ValidationUtils.validateNoMissing(dto.getVehicleIds(), vehicles, Vehicle::getId, Vehicle.class);
        TicketUtils.validateDtoByContext(dto, vehicles);

        Ticket ticket = new Ticket();
        this.applyToEntity(ticket, dto, vehicles);
        ticketRepository.save(ticket);

        TicketUtils.updateVehiclesByTicketType(vehicles, ticket);
        vehicleRepository.saveAll(vehicles);

        return new TicketDto(ticket);
    }

    @Transactional
    public TicketDto editTicket(Long id, TicketDto dto) {
        TicketUtils.validateDtoBySelf(dto);

        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));
        List<Vehicle> vehicles = vehicleRepository.findAllById(dto.getVehicleIds());

        ValidationUtils.validateNoMissing(dto.getVehicleIds(), vehicles, Vehicle::getId, Vehicle.class);
        TicketUtils.validateDtoByContext(dto, vehicles);

        this.applyToEntity(ticket, dto, vehicles);
        ticketRepository.save(ticket);

        return new TicketDto(ticket);
    }

    @Transactional
    public TicketDto updateTicketStatus(Long id, TicketStatusDto dto) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));

        TicketUtils.validateTicketStatusByType(dto.getTicketStatus(), ticket.getTicketType());

        ticket.setTicketStatus(dto.getTicketStatus());
        ticketRepository.save(ticket);

        List<Vehicle> vehicles = ticket.getVehicles();
        TicketUtils.updateVehiclesByTicketStatus(vehicles, ticket);
        vehicleRepository.saveAll(vehicles);

        return new TicketDto(ticket);
    }

    @Transactional
    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));

        // We don't cascade remove – but the relation in the many-to-many needs to be cleared.
        ticket.getVehicles().forEach(vehicle -> vehicle.getTickets().remove(ticket));

        ticketRepository.delete(ticket);
    }

    private void applyToEntity(Ticket ticket, TicketDto dto, List<Vehicle> vehicles) {
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new ElementNotFoundException("Location with id: " + dto.getEmployeeId()));

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ElementNotFoundException("Employee with id: " + dto.getEmployeeId()));

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ElementNotFoundException("Customer with id: " + dto.getCustomerId()));

        dto.applyToEntity(ticket, vehicles, location, employee, customer);
    }
}
