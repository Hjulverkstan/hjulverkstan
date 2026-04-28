package se.hjulverkstan.main.feature.ticket;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.InvalidDataException;
import se.hjulverkstan.main.error.exceptions.MissingArgumentException;
import se.hjulverkstan.main.error.exceptions.UnsupportedTicketStatusException;
import se.hjulverkstan.main.error.exceptions.UnsupportedTicketVehiclesException;
import se.hjulverkstan.main.feature.customer.Customer;
import se.hjulverkstan.main.feature.customer.CustomerRepository;
import se.hjulverkstan.main.feature.employee.Employee;
import se.hjulverkstan.main.feature.employee.EmployeeRepository;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.location.LocationRepository;
import se.hjulverkstan.main.feature.notification.Notification;
import se.hjulverkstan.main.feature.notification.NotificationService;
import se.hjulverkstan.main.feature.notification.NotificationStatus;
import se.hjulverkstan.main.feature.vehicle.VehicleRepository;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.feature.vehicle.model.VehicleStatus;
import se.hjulverkstan.main.shared.SecurityUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock private TicketRepository ticketRepository;
    @Mock private LocationRepository locationRepository;
    @Mock private EmployeeRepository employeeRepository;
    @Mock private CustomerRepository customerRepository;
    @Mock private VehicleRepository vehicleRepository;
    @Mock private NotificationService notificationService;

    @InjectMocks private TicketService ticketService;

    private MockedStatic<SecurityUtils> mockedSecurityUtils;
    private Location locationA;
    private Location locationB;

    @BeforeEach
    void setUp() {
        mockedSecurityUtils = mockStatic(SecurityUtils.class);
        
        locationA = new Location();
        ReflectionTestUtils.setField(locationA, "id", 1L);
        locationA.setName("Location A");

        locationB = new Location();
        ReflectionTestUtils.setField(locationB, "id", 2L);
        locationB.setName("Location B");
    }

    @AfterEach
    void tearDown() {
        if (mockedSecurityUtils != null) {
            mockedSecurityUtils.close();
        }
    }

    @Test
    void getTicketById_NotFound_ThrowsException() {
        when(ticketRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> ticketService.getTicketById(999L));
    }

    @Test
    void getTicketById_Success() {
        mockedSecurityUtils.when(SecurityUtils::getCurrentLocationId).thenReturn(1L);
        Ticket t = createBaseTicket(locationA);
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(t));
        
        TicketDto result = ticketService.getTicketById(10L);
        assertNotNull(result);
    }

    @Test
    void getTicketById_LocationJail_Throws404ForCrossLocation() {
        mockedSecurityUtils.when(SecurityUtils::getCurrentLocationId).thenReturn(1L);
        Ticket t1 = new Ticket();
        t1.setLocation(locationB);
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(t1));

        assertThrows(ElementNotFoundException.class, () -> ticketService.getTicketById(10L));
    }

    @Test
    void createTicket_InvalidDto_ThrowsException() {
        TicketDto dto = createMinimalDto();
        dto.setRepairDescription(null);
        assertThrows(MissingArgumentException.class, () -> ticketService.createTicket(dto));
    }

    @Test
    void createTicket_LocationJail_Throws404ForCrossLocationDto() {
        mockedSecurityUtils.when(SecurityUtils::getCurrentLocationId).thenReturn(1L);
        TicketDto dto = createMinimalDto();
        dto.setLocationId(2L); // Different location

        when(locationRepository.findById(2L)).thenReturn(Optional.of(locationB));
        when(customerRepository.findById(any())).thenReturn(Optional.of(new Customer()));
        when(employeeRepository.findById(any())).thenReturn(Optional.of(new Employee()));

        assertThrows(ElementNotFoundException.class, () -> ticketService.createTicket(dto));
    }

    @Test
    void createTicket_CustomerNotFound_ThrowsException() {
        TicketDto dto = createMinimalDto();
        when(locationRepository.findById(any())).thenReturn(Optional.of(locationA));
        when(employeeRepository.findById(any())).thenReturn(Optional.of(new Employee()));
        when(customerRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(ElementNotFoundException.class, () -> ticketService.createTicket(dto));
    }

    @Test
    void createTicket_VehicleMissing_ThrowsException() {
        TicketDto dto = createMinimalDto();
        dto.setVehicleIds(List.of(1L, 2L));
        
        lenient().when(locationRepository.findById(any())).thenReturn(Optional.of(locationA));
        lenient().when(customerRepository.findById(any())).thenReturn(Optional.of(new Customer()));
        lenient().when(employeeRepository.findById(any())).thenReturn(Optional.of(new Employee()));
        when(vehicleRepository.findAllById(any())).thenReturn(List.of(new Vehicle())); // Only 1 found but 2 requested

        assertThrows(ElementNotFoundException.class, () -> ticketService.createTicket(dto));
    }

    @Test
    void createTicket_AnonymizationWall_ThrowsException() {
        Customer anonymized = new Customer();
        anonymized.setAnonymized(true);
        TicketDto dto = createMinimalDto();

        when(customerRepository.findById(any())).thenReturn(Optional.of(anonymized));
        when(locationRepository.findById(any())).thenReturn(Optional.of(locationA));
        when(employeeRepository.findById(any())).thenReturn(Optional.of(new Employee()));

        assertThrows(InvalidDataException.class, () -> ticketService.createTicket(dto));
    }

    @Test
    void createTicket_VehicleLocationIntegrity_ThrowsException() {
        mockedSecurityUtils.when(SecurityUtils::getCurrentLocationId).thenReturn(1L);
        Vehicle vInOtherLoc = new Vehicle();
        vInOtherLoc.setLocation(locationB);
        ReflectionTestUtils.setField(vInOtherLoc, "id", 99L);

        TicketDto dto = createMinimalDto();
        dto.setVehicleIds(List.of(99L));

        when(locationRepository.findById(1L)).thenReturn(Optional.of(locationA));
        when(customerRepository.findById(any())).thenReturn(Optional.of(new Customer()));
        when(employeeRepository.findById(any())).thenReturn(Optional.of(new Employee()));
        when(vehicleRepository.findAllById(any())).thenReturn(List.of(vInOtherLoc));

        assertThrows(UnsupportedTicketVehiclesException.class, () -> ticketService.createTicket(dto));
    }

    @Test
    void editTicket_NotFound_ThrowsException() {
        when(ticketRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> ticketService.editTicket(99L, createMinimalDto()));
    }

    @Test
    void editTicket_LocationJail_Throws404ForCrossLocation() {
        mockedSecurityUtils.when(SecurityUtils::getCurrentLocationId).thenReturn(1L);
        Ticket t = createBaseTicket(locationB);
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(t));

        assertThrows(ElementNotFoundException.class, () -> ticketService.editTicket(10L, createMinimalDto()));
    }


    @Test
    void updateTicketStatus_NotFound_ThrowsException() {
        when(ticketRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> ticketService.updateTicketStatus(99L, new TicketStatusDto()));
    }

    @Test
    void updateTicketStatus_LocationJail_Throws404() {
        mockedSecurityUtils.when(SecurityUtils::getCurrentLocationId).thenReturn(1L);
        Ticket t = createBaseTicket(locationB);
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(t));

        assertThrows(ElementNotFoundException.class, () -> ticketService.updateTicketStatus(10L, new TicketStatusDto()));
    }

    @Test
    void updateTicketStatus_TechnicianGuard_ThrowsException() {
        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.REPAIR);
        ReflectionTestUtils.setField(ticket, "ticketStatus", TicketStatus.IN_PROGRESS);
        ticket.setLocation(locationA);
        ticket.setEmployee(null);

        mockedSecurityUtils.when(SecurityUtils::getCurrentLocationId).thenReturn(1L);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        TicketStatusDto statusDto = new TicketStatusDto(TicketStatus.COMPLETE, null);
        assertThrows(UnsupportedTicketStatusException.class, () -> ticketService.updateTicketStatus(1L, statusDto));
    }

    @Test
    void updateTicketStatus_Complete_TriggersNotification_AndArchivesVehicles() {
        mockedSecurityUtils.when(SecurityUtils::getCurrentLocationId).thenReturn(1L);
        Ticket ticket = createBaseTicket(locationA);
        ticket.setTicketStatus(TicketStatus.IN_PROGRESS);
        ticket.setEmployee(new Employee());
        
        Vehicle v = new Vehicle();
        v.setCustomerOwned(true);
        ticket.setVehicles(List.of(v));

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        
        Notification n = new Notification();
        n.setNotificationStatus(NotificationStatus.ACCEPTED);
        when(notificationService.sendRepairTicketCompleteSms(any())).thenReturn(n);

        TicketStatusDto result = ticketService.updateTicketStatus(1L, new TicketStatusDto(TicketStatus.COMPLETE, null));
        
        assertEquals(NotificationStatus.ACCEPTED, result.getRepairCompleteNotificationStatus());

        ticket.setTicketStatus(TicketStatus.COMPLETE);
        ticketService.updateTicketStatus(1L, new TicketStatusDto(TicketStatus.CLOSED, null));

        assertEquals(VehicleStatus.ARCHIVED, v.getVehicleStatus());
        verify(vehicleRepository, times(2)).saveAll(anyList());
    }

    @Test
    void hardDelete_NotFound_ThrowsException() {
        when(ticketRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> ticketService.hardDeleteTicket(99L));
    }

    @Test
    void hardDelete_LocationJail_Throws404() {
        mockedSecurityUtils.when(SecurityUtils::getCurrentLocationId).thenReturn(1L);
        Ticket t = new Ticket();
        t.setLocation(locationB);
        when(ticketRepository.findById(50L)).thenReturn(Optional.of(t));

        assertThrows(ElementNotFoundException.class, () -> ticketService.hardDeleteTicket(50L));
    }

    @Test
    void hardDelete_Success_UnlinksVehicles() {
        mockedSecurityUtils.when(SecurityUtils::getCurrentLocationId).thenReturn(1L);
        Ticket t = createBaseTicket(locationA);
        Vehicle v = new Vehicle();
        List<Ticket> vt = new ArrayList<>();
        vt.add(t);
        v.setTickets(vt);
        t.setVehicles(List.of(v));
        
        when(ticketRepository.findById(50L)).thenReturn(Optional.of(t));

        ticketService.hardDeleteTicket(50L);
        
        assertTrue(v.getTickets().isEmpty());
        verify(ticketRepository).delete(t);
    }

    @Test
    void softDeleteTicket_Success() {
        Ticket t = new Ticket();
        when(ticketRepository.findById(50L)).thenReturn(Optional.of(t));

        ticketService.softDeleteTicket(50L);

        assertTrue(t.isDeleted());
        verify(ticketRepository).save(t);
    }

    @ParameterizedTest
    @MethodSource("provideStatusTransitions")
    void updateTicketStatus_StateMatrix(TicketStatus from, TicketStatus to, boolean shouldPass) {
        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.REPAIR);
        ReflectionTestUtils.setField(ticket, "ticketStatus", from);
        ticket.setLocation(locationA);
        ticket.setEmployee(new Employee());

        mockedSecurityUtils.when(SecurityUtils::getCurrentLocationId).thenReturn(1L);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        TicketStatusDto statusDto = new TicketStatusDto(to, null);

        if (shouldPass) {
            assertDoesNotThrow(() -> ticketService.updateTicketStatus(1L, statusDto));
            assertEquals(to, ticket.getTicketStatus());
        } else {
            assertThrows(UnsupportedTicketStatusException.class, () -> ticketService.updateTicketStatus(1L, statusDto));
        }
    }

    private static Stream<Arguments> provideStatusTransitions() {
        return Stream.of(
            Arguments.of(null, TicketStatus.READY, true),
            Arguments.of(TicketStatus.READY, TicketStatus.IN_PROGRESS, true),
            Arguments.of(TicketStatus.IN_PROGRESS, TicketStatus.COMPLETE, true),
            Arguments.of(TicketStatus.COMPLETE, TicketStatus.CLOSED, true),
            Arguments.of(TicketStatus.READY, TicketStatus.COMPLETE, true), 
            Arguments.of(TicketStatus.IN_PROGRESS, TicketStatus.READY, false) 
        );
    }

    private Ticket createBaseTicket(Location loc) {
        Ticket t = new Ticket();
        ReflectionTestUtils.setField(t, "id", 10L);
        t.setLocation(loc);
        t.setTicketType(TicketType.REPAIR);
        t.setVehicles(new ArrayList<>());
        t.setNotifications(new ArrayList<>());
        Customer c = new Customer();
        ReflectionTestUtils.setField(c, "id", 100L);
        t.setCustomer(c);
        return t;
    }

    private TicketDto createMinimalDto() {
        TicketDto dto = new TicketDto();
        dto.setCustomerId(100L);
        dto.setTicketType(TicketType.REPAIR);
        dto.setRepairDescription("Fix it");
        dto.setLocationId(1L);
        dto.setVehicleIds(new ArrayList<>());
        dto.setEmployeeId(200L);
        return dto;
    }
}
