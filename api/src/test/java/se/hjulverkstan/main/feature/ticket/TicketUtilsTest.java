package se.hjulverkstan.main.feature.ticket;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import se.hjulverkstan.main.error.exceptions.InvalidDataException;
import se.hjulverkstan.main.error.exceptions.UnsupportedTicketVehiclesException;
import se.hjulverkstan.main.feature.customer.Customer;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.vehicle.model.Vehicle;
import se.hjulverkstan.main.feature.vehicle.model.VehicleStatus;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TicketUtilsTest {

    @Test
    void validateResourceIntegrity_AnonymizedCustomer_ThrowsException() {
        Customer c = new Customer();
        c.setAnonymized(true);
        assertThrows(InvalidDataException.class, () -> 
            TicketUtils.validateResourceIntegrity(c, List.of(), new Location(), null));
    }

    @Test
    void validateResourceIntegrity_CrossLocationVehicle_ThrowsException() {
        Location loc1 = new Location();
        ReflectionTestUtils.setField(loc1, "id", 1L);
        
        Location loc2 = new Location();
        ReflectionTestUtils.setField(loc2, "id", 2L);

        Vehicle v = new Vehicle();
        v.setRegTag("ABC-123");
        v.setLocation(loc2);

        Customer c = new Customer();
        c.setAnonymized(false);

        assertThrows(UnsupportedTicketVehiclesException.class, () -> 
            TicketUtils.validateResourceIntegrity(c, List.of(v), loc1, null));
    }

    @Test
    void updateVehiclesByTicketStatus_Closed_ArchivesCustomerOwned() {
        Vehicle v = new Vehicle();
        v.setCustomerOwned(true);
        v.setVehicleStatus(null);
        
        Ticket t = new Ticket();
        t.setTicketType(TicketType.REPAIR);
        t.setTicketStatus(TicketStatus.CLOSED);
        
        TicketUtils.updateVehiclesByTicketStatus(List.of(v), t);
        
        assertEquals(VehicleStatus.ARCHIVED, v.getVehicleStatus());
    }

    @Test
    void updateVehiclesByTicketStatus_RepairInProgress_SetsUnavailable() {
        Vehicle v = new Vehicle();
        v.setCustomerOwned(false);
        v.setVehicleStatus(VehicleStatus.AVAILABLE);
        
        Ticket t = new Ticket();
        t.setTicketType(TicketType.REPAIR);
        t.setTicketStatus(TicketStatus.IN_PROGRESS);
        
        TicketUtils.updateVehiclesByTicketStatus(List.of(v), t);
        
        assertEquals(VehicleStatus.UNAVAILABLE, v.getVehicleStatus());
    }

    @Test
    void updateVehiclesByTicketType_RepairReady_SetsUnavailable() {
        Vehicle v = new Vehicle();
        v.setCustomerOwned(false);
        v.setVehicleStatus(VehicleStatus.AVAILABLE);
        
        Ticket t = new Ticket();
        t.setTicketType(TicketType.REPAIR);
        t.setTicketStatus(TicketStatus.READY);
        
        TicketUtils.updateVehiclesByTicketType(List.of(v), t);
        
        assertEquals(VehicleStatus.UNAVAILABLE, v.getVehicleStatus());
    }
}
