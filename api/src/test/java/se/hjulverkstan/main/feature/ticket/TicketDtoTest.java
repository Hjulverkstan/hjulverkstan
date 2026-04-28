package se.hjulverkstan.main.feature.ticket;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import se.hjulverkstan.main.feature.customer.Customer;
import se.hjulverkstan.main.feature.employee.Employee;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TicketDtoTest {

    @Test
    void constructor_NullProperties_HandlesGracefully() {
        Ticket ticket = new Ticket();
        // and nothing else
        
        TicketDto dto = new TicketDto(ticket);
        
        assertNull(dto.getCustomerId());
        assertNull(dto.getEmployeeId());
        assertNull(dto.getLocationId());
        assertTrue(dto.getVehicleIds().isEmpty());
    }

    @Test
    void constructor_FullProperties_MapsCorrectly() {
        Ticket ticket = new Ticket();
        ticket.setTicketType(TicketType.REPAIR);
        ticket.setTicketStatus(TicketStatus.IN_PROGRESS);
        ticket.setRepairDescription("Broken");
        ticket.setComment("Note");
        
        Customer c = new Customer();
        ReflectionTestUtils.setField(c, "id", 1L);
        ticket.setCustomer(c);
        
        Location l = new Location();
        ReflectionTestUtils.setField(l, "id", 2L);
        ticket.setLocation(l);
        
        Employee e = new Employee();
        ReflectionTestUtils.setField(e, "id", 3L);
        ticket.setEmployee(e);
        
        Vehicle v = new Vehicle();
        ReflectionTestUtils.setField(v, "id", 4L);
        ticket.setVehicles(List.of(v));

        TicketDto dto = new TicketDto(ticket);

        assertEquals(TicketType.REPAIR, dto.getTicketType());
        assertEquals(TicketStatus.IN_PROGRESS, dto.getTicketStatus());
        assertEquals(1L, dto.getCustomerId());
        assertEquals(2L, dto.getLocationId());
        assertEquals(3L, dto.getEmployeeId());
        assertEquals(1, dto.getVehicleIds().size());
        assertEquals(4L, dto.getVehicleIds().getFirst());
    }

    @Test
    void applyToEntity_MapsFieldsCorrectly() {
        TicketDto dto = new TicketDto();
        dto.setTicketType(TicketType.RENT);
        dto.setStartDate(LocalDate.now());
        dto.setEndDate(LocalDate.now().plusDays(1));
        dto.setComment("Rent comment");

        Ticket ticket = new Ticket();
        Customer c = new Customer();
        Location l = new Location();
        Employee e = new Employee();
        List<Vehicle> vs = new ArrayList<>();

        dto.applyToEntity(ticket, vs, l, e, c);

        assertEquals(TicketType.RENT, ticket.getTicketType());
        assertEquals(dto.getStartDate(), ticket.getStartDate());
        assertEquals(dto.getEndDate(), ticket.getEndDate());
        assertEquals("Rent comment", ticket.getComment());
        assertEquals(TicketStatus.READY, ticket.getTicketStatus());
        assertSame(c, ticket.getCustomer());
        assertSame(l, ticket.getLocation());
        assertSame(e, ticket.getEmployee());
        assertSame(vs, ticket.getVehicles());
    }

    @Test
    void applyToEntity_RepairType_SetsDescription() {
        TicketDto dto = new TicketDto();
        dto.setTicketType(TicketType.REPAIR);
        dto.setRepairDescription("Fix chain");

        Ticket ticket = new Ticket();
        dto.applyToEntity(ticket, new ArrayList<>(), new Location(), null, new Customer());

        assertEquals("Fix chain", ticket.getRepairDescription());
        assertNull(ticket.getStartDate());
        assertNull(ticket.getEndDate());
    }
}
