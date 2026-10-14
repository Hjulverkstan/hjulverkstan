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
import se.hjulverkstan.main.feature.notification.NotificationService;
import se.hjulverkstan.main.feature.vehicle.VehicleRepository;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.shared.ListResponseDto;
import se.hjulverkstan.main.shared.SecurityUtils;
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
    private final NotificationService notificationService;

    public ListResponseDto<TicketDto> getAllTicket() {
        List<Ticket> tickets = ticketRepository.findAllByDeletedFalse(Sort.by(Sort.Direction.DESC, "createdAt"));
        return new ListResponseDto<>(tickets.stream().map(TicketDto::new).toList());
    }

    public TicketDto getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));
        verifyLocation(ticket);
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

        // Location Jail: verify the ticket matches user's preferred location if not set specifically
        verifyLocation(ticket);

        ticketRepository.save(ticket);

        TicketUtils.updateVehiclesByTicketType(vehicles, ticket);
        vehicleRepository.saveAll(vehicles);

        return new TicketDto(ticket);
    }

    @Transactional
    public TicketDto editTicket(Long id, TicketDto dto) {
        TicketUtils.validateDtoBySelf(dto);

        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));
        verifyLocation(ticket);

        List<Vehicle> vehicles = vehicleRepository.findAllById(dto.getVehicleIds());
        ValidationUtils.validateNoMissing(dto.getVehicleIds(), vehicles, Vehicle::getId, Vehicle.class);
        TicketUtils.validateDtoByContext(dto, vehicles);

        Long oldEmployeeId = ticket.getEmployee() != null ? ticket.getEmployee().getId() : null;

        this.applyToEntity(ticket, dto, vehicles);
        ticketRepository.save(ticket);

        return new TicketDto(ticket);
    }

    @Transactional
    public TicketStatusDto updateTicketStatus(Long id, TicketStatusDto dto) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));
        verifyLocation(ticket);

        TicketUtils.validateTicketStatusChange(ticket, dto.getTicketStatus());

        ticket.setTicketStatus(dto.getTicketStatus());
        ticketRepository.save(ticket);

        List<Vehicle> vehicles = ticket.getVehicles();
        TicketUtils.updateVehiclesByTicketStatus(vehicles, ticket);
        vehicleRepository.saveAll(vehicles);

        if (dto.getTicketStatus() == TicketStatus.COMPLETE && !vehicles.isEmpty()) {
            var notif = notificationService.sendRepairTicketCompleteSms(ticket);
            dto.setRepairCompleteNotificationStatus(notif.getNotificationStatus());
        }

        return dto;
    }

    @Transactional
    public void softDeleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));

        ticket.setDeleted(true);
        ticketRepository.save(ticket);
    }

    @Transactional
    public void hardDeleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Ticket"));
        verifyLocation(ticket);

        ticket.getVehicles().forEach(vehicle -> vehicle.getTickets().remove(ticket));
        ticketRepository.delete(ticket);
    }

    private void verifyLocation(Ticket ticket) {
        Long userLocationId = SecurityUtils.getCurrentLocationId();
        if (userLocationId != null && !userLocationId.equals(ticket.getLocation().getId())) {
            throw new ElementNotFoundException("Ticket"); // 404 for cross-location
        }
    }

    private void applyToEntity(Ticket ticket, TicketDto dto, List<Vehicle> vehicles) {
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new ElementNotFoundException("Location with id: " + dto.getLocationId()));

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ElementNotFoundException("Employee with id: " + dto.getEmployeeId()));

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ElementNotFoundException("Customer with id: " + dto.getCustomerId()));

        // Integrity Guards
        TicketUtils.validateResourceIntegrity(customer, vehicles, location, employee);

        dto.applyToEntity(ticket, vehicles, location, employee, customer);
    }
}
