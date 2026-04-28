package se.hjulverkstan.main.feature.vehicle;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import se.hjulverkstan.main.error.exceptions.AlreadyUsedException;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.MissingArgumentException;
import se.hjulverkstan.main.error.exceptions.UnsupportedVehicleLocationException;
import se.hjulverkstan.main.error.exceptions.UnsupportedVehicleStatusException;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.location.LocationRepository;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.feature.ticket.TicketRepository;
import se.hjulverkstan.main.feature.vehicle.model.*;
import se.hjulverkstan.main.shared.FilteredResponseDto;
import se.hjulverkstan.main.shared.ListResponseDto;

import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private VehicleService vehicleService;

    private Location testLocation;

    @BeforeEach
    void setUp() {
        testLocation = new Location();
        ReflectionTestUtils.setField(testLocation, "id", 100L);
    }

    // ─── GET & SEARCH METHODS ───────────────────────────────────────────────

    @Test
    void getAllVehicles_ReturnsDtosSorted() {
        Vehicle v = new Vehicle();
        v.setId(1L);
        v.setTickets(new ArrayList<>());
        when(vehicleRepository.findAllByDeletedFalse(any(Sort.class))).thenReturn(List.of(v));

        ListResponseDto<VehicleDto> result = vehicleService.getAllVehicles();
        
        assertEquals(1, result.getContent().size());
        assertEquals(1L, result.getContent().getFirst().getId());
        verify(vehicleRepository).findAllByDeletedFalse(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Test
    void getVehicleById_Success() {
        Vehicle v = new Vehicle();
        v.setId(5L);
        v.setTickets(new ArrayList<>());
        when(vehicleRepository.findById(5L)).thenReturn(Optional.of(v));

        VehicleDto result = vehicleService.getVehicleById(5L);
        assertEquals(5L, result.getId());
    }

    @Test
    void getVehicleById_NotFound_ThrowsException() {
        when(vehicleRepository.findById(9L)).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> vehicleService.getVehicleById(9L));
    }

    @Test
    void searchVehicles_ReturnsFilteredDtos() {
        Vehicle v = new Vehicle();
        v.setId(10L);
        v.setTickets(new ArrayList<>());
        when(vehicleRepository.findAllByDeletedFalse(any(Specification.class), any(Sort.class))).thenReturn(List.of(v));

        VehicleFilterDto filterDto = new VehicleFilterDto();
        FilteredResponseDto<VehicleDto, VehicleFilterCountsDto> response = vehicleService.searchVehicles(filterDto);

        assertNotNull(response.getContent());
        assertNotNull(response.getFilter());
        assertEquals(1, response.getContent().size());
    }

    // ─── VALIDATION GAUNTLET (VehicleUtils Integration) ─────────────────────

    @Test
    void createVehicle_CustomerOwnedInvalidStatus_ThrowsException() {
        VehicleDto dto = new VehicleDto();
        dto.setCustomerOwned(true);
        dto.setVehicleStatus(VehicleStatus.AVAILABLE); // Invalid, must be ARCHIVED or null

        assertThrows(UnsupportedVehicleStatusException.class, () -> vehicleService.createVehicle(dto));
        verifyNoInteractions(vehicleRepository);
    }

    @Test
    void createVehicle_MissingRegTag_ThrowsMissingArgumentException() {
        VehicleDto dto = new VehicleDto();
        dto.setCustomerOwned(false);
        dto.setVehicleType(VehicleType.OTHER);
        dto.setRegTag(null);

        assertThrows(MissingArgumentException.class, () -> vehicleService.createVehicle(dto));
    }

    @Test
    void createVehicle_MissingBikeFields_Sequentially_ThrowsMissingArgumentException() {
        VehicleDto dto = new VehicleDto();
        dto.setCustomerOwned(false);
        dto.setVehicleType(VehicleType.BIKE);
        dto.setRegTag("RRR111");

        MissingArgumentException ex = assertThrows(MissingArgumentException.class, () -> vehicleService.createVehicle(dto));
        assertTrue(ex.getMessage().contains("bikeType"));
        dto.setBikeType(BikeType.ELECTRIC);

        ex = assertThrows(MissingArgumentException.class, () -> vehicleService.createVehicle(dto));
        assertTrue(ex.getMessage().contains("gearCount"));
        dto.setGearCount(7);

        ex = assertThrows(MissingArgumentException.class, () -> vehicleService.createVehicle(dto));
        assertTrue(ex.getMessage().contains("size"));
        dto.setSize(BikeSize.LARGE);

        ex = assertThrows(MissingArgumentException.class, () -> vehicleService.createVehicle(dto));
        assertTrue(ex.getMessage().contains("brakeType"));
        dto.setBrakeType(VehicleBrakeType.DISC);

        ex = assertThrows(MissingArgumentException.class, () -> vehicleService.createVehicle(dto));
        assertTrue(ex.getMessage().contains("brand"));
        dto.setBrand(VehicleBrand.SJOSALA);
    }

    @Test
    void createVehicle_MissingBatchCount_ThrowsMissingArgumentException() {
        VehicleDto dto = new VehicleDto();
        dto.setCustomerOwned(false);
        dto.setVehicleType(VehicleType.BATCH);
        
        assertThrows(MissingArgumentException.class, () -> vehicleService.createVehicle(dto));
    }

    @Test
    void editVehicle_MissingRegTag_ThrowsException() {
        VehicleDto dto = new VehicleDto();
        dto.setCustomerOwned(false);
        dto.setVehicleType(VehicleType.OTHER);
        dto.setRegTag(null);
        assertThrows(MissingArgumentException.class, () -> vehicleService.editVehicle(1L, dto));
    }

    @Test
    void createVehicle_LocationNotFound_ThrowsException() {
        VehicleDto dto = new VehicleDto();
        dto.setVehicleType(VehicleType.OTHER);
        dto.setRegTag("ABC");
        dto.setLocationId(999L);
        when(locationRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> vehicleService.createVehicle(dto));
    }

    @Test
    void createVehicle_DuplicateRegTag_ThrowsAlreadyUsedException() {
        VehicleDto dto = new VehicleDto();
        dto.setCustomerOwned(false);
        dto.setVehicleType(VehicleType.OTHER);
        dto.setRegTag("ABC-123");

        Vehicle existing = new Vehicle();
        existing.setId(99L);
        when(vehicleRepository.findByRegTag("ABC-123")).thenReturn(Optional.of(existing));

        assertThrows(AlreadyUsedException.class, () -> vehicleService.createVehicle(dto));
    }

    @Test
    void editVehicle_VehicleNotFound_ThrowsException() {
        VehicleDto dto = new VehicleDto();
        dto.setVehicleType(VehicleType.OTHER);
        dto.setRegTag("VALID");
        when(vehicleRepository.findById(999L)).thenReturn(Optional.empty());
        ElementNotFoundException ex = assertThrows(ElementNotFoundException.class, () -> vehicleService.editVehicle(999L, dto));
        assertTrue(ex.getMessage().contains("Vehicle"));
    }

    @Test
    void editVehicleStatus_VehicleNotFound_ThrowsException() {
        VehicleStatusDto dto = new VehicleStatusDto(VehicleStatus.ARCHIVED);
        when(vehicleRepository.findById(999L)).thenReturn(Optional.empty());
        ElementNotFoundException ex = assertThrows(ElementNotFoundException.class, () -> vehicleService.editVehicleStatus(999L, dto));
        assertTrue(ex.getMessage().contains("Vehicle"));
    }

    @Test
    void deleteVehicle_VehicleNotFound_ThrowsException() {
        when(vehicleRepository.findById(999L)).thenReturn(Optional.empty());
        ElementNotFoundException ex = assertThrows(ElementNotFoundException.class, () -> vehicleService.hardDeleteVehicle(999L));
        assertTrue(ex.getMessage().contains("Vehicle"));
    }

    @Test
    void editVehicle_WithOpenTicketsAndMovedLocation_ThrowsException() {
        VehicleDto dto = new VehicleDto();
        dto.setId(1L);
        dto.setCustomerOwned(true);
        dto.setLocationId(200L); // Moving to location 200

        Vehicle existingVehicle = new Vehicle();
        existingVehicle.setId(1L);
        
        Ticket openTicket = new Ticket();
        ReflectionTestUtils.setField(openTicket, "ticketStatus", se.hjulverkstan.main.feature.ticket.TicketStatus.IN_PROGRESS);
        Location ticketLocation = new Location();
        ReflectionTestUtils.setField(ticketLocation, "id", 100L); // Ticket is at location 100
        openTicket.setLocation(ticketLocation);

        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(existingVehicle));
        when(ticketRepository.findByVehicles(List.of(existingVehicle))).thenReturn(List.of(openTicket));

        assertThrows(UnsupportedVehicleLocationException.class, () -> vehicleService.editVehicle(1L, dto));
    }

    @Test
    void editVehicle_WithOpenTicketsSameLocation_Success() {
        VehicleDto dto = new VehicleDto();
        dto.setCustomerOwned(false);
        dto.setVehicleType(VehicleType.OTHER);
        dto.setRegTag("DEF 456");
        dto.setLocationId(100L); // Location remains 100

        Vehicle existingVehicle = new Vehicle();
        existingVehicle.setId(10L);
        existingVehicle.setVehicleType(VehicleType.OTHER);
        existingVehicle.setLocation(testLocation); // Also 100
        
        Ticket openTicket = new Ticket();
        ReflectionTestUtils.setField(openTicket, "ticketStatus", se.hjulverkstan.main.feature.ticket.TicketStatus.IN_PROGRESS);
        openTicket.setLocation(testLocation); // Ticket at 100
        existingVehicle.getTickets().add(openTicket);

        when(vehicleRepository.findById(10L)).thenReturn(Optional.of(existingVehicle));
        when(locationRepository.findById(100L)).thenReturn(Optional.of(testLocation));
        
        Vehicle mockSaved = new Vehicle();
        ReflectionTestUtils.setField(mockSaved, "id", 10L);
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(mockSaved);

        VehicleDto result = vehicleService.editVehicle(10L, dto);
        assertNotNull(result);
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void editVehicleStatus_WithOpenTickets_ThrowsException() {
        Vehicle existingVehicle = new Vehicle();
        existingVehicle.setId(2L);
        existingVehicle.setCustomerOwned(false);
        
        Ticket openTicket = new Ticket();
        ReflectionTestUtils.setField(openTicket, "ticketStatus", se.hjulverkstan.main.feature.ticket.TicketStatus.IN_PROGRESS);
        existingVehicle.getTickets().add(openTicket);

        when(vehicleRepository.findById(2L)).thenReturn(Optional.of(existingVehicle));

        VehicleStatusDto statusDto = new VehicleStatusDto(VehicleStatus.UNAVAILABLE);
        
        assertThrows(UnsupportedVehicleStatusException.class, () -> vehicleService.editVehicleStatus(2L, statusDto));
    }

    @Test
    void editVehicleStatus_CustomerOwnedInvalidStatus_ThrowsException() {
        Vehicle existingVehicle = new Vehicle();
        existingVehicle.setId(3L);
        existingVehicle.setCustomerOwned(true);
        
        when(vehicleRepository.findById(3L)).thenReturn(Optional.of(existingVehicle));

        VehicleStatusDto statusDto = new VehicleStatusDto(VehicleStatus.AVAILABLE); // Invalid for customer
        
        assertThrows(UnsupportedVehicleStatusException.class, () -> vehicleService.editVehicleStatus(3L, statusDto));
    }

    // ─── MAPPING GAUNTLET ───────────────────────────────────────────────────

    @Test
    void createVehicle_Success_Bike_MappingsAreCorrect() {
        VehicleDto dto = new VehicleDto();
        dto.setVehicleType(VehicleType.BIKE);
        dto.setCustomerOwned(false);
        dto.setRegTag(" BIK 01  "); // test trimming logic if DTO setter used it, but let's test mapping
        dto.setFrameNumber(" F F F ");
        dto.setBikeType(BikeType.ELECTRIC);
        dto.setGearCount(7);
        dto.setSize(BikeSize.LARGE);
        dto.setBrakeType(VehicleBrakeType.DISC);
        dto.setBrand(VehicleBrand.SJOSALA);
        dto.setLocationId(100L);
        dto.setImageURL("image.png");

        when(locationRepository.findById(100L)).thenReturn(Optional.of(testLocation));

        Vehicle mockSaved = new Vehicle();
        ReflectionTestUtils.setField(mockSaved, "id", 1000L);
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(mockSaved);

        VehicleDto result = vehicleService.createVehicle(dto);
        assertNotNull(result);

        ArgumentCaptor<Vehicle> captor = ArgumentCaptor.forClass(Vehicle.class);
        verify(vehicleRepository).save(captor.capture());
        Vehicle mapped = captor.getValue();

        assertEquals(VehicleType.BIKE, mapped.getVehicleType());
        assertFalse(mapped.isCustomerOwned());
        assertEquals("BIK 01", mapped.getRegTag()); // Setter trims and uppercases
        assertEquals("F F F", mapped.getFrameNumber());
        assertEquals(BikeType.ELECTRIC, mapped.getBikeType());
        assertEquals(7, mapped.getGearCount());
        assertEquals(BikeSize.LARGE, mapped.getSize());
        assertEquals(VehicleBrakeType.DISC, mapped.getBrakeType());
        assertEquals(VehicleBrand.SJOSALA, mapped.getBrand());
        assertEquals("image.png", mapped.getImageURL());
        assertEquals(testLocation, mapped.getLocation());
        assertNull(mapped.getBatchCount()); // BIKE cannot have batchCount
    }

    @Test
    void editVehicle_Success_Batch_MappingsAreCorrect() {
        VehicleDto dto = new VehicleDto();
        dto.setVehicleType(VehicleType.BATCH);
        dto.setCustomerOwned(false);
        dto.setBatchCount(10);
        dto.setLocationId(100L);

        Vehicle existing = new Vehicle();
        existing.setId(50L);
        
        when(vehicleRepository.findById(50L)).thenReturn(Optional.of(existing));
        when(ticketRepository.findByVehicles(List.of(existing))).thenReturn(new ArrayList<>());
        when(locationRepository.findById(100L)).thenReturn(Optional.of(testLocation));

        Vehicle mockSaved = new Vehicle();
        ReflectionTestUtils.setField(mockSaved, "id", 50L);
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(mockSaved);

        VehicleDto result = vehicleService.editVehicle(50L, dto);
        assertNotNull(result);

        ArgumentCaptor<Vehicle> captor = ArgumentCaptor.forClass(Vehicle.class);
        verify(vehicleRepository).save(captor.capture());
        Vehicle mapped = captor.getValue();

        assertEquals(VehicleType.BATCH, mapped.getVehicleType());
        assertEquals(10, mapped.getBatchCount());
        assertNull(mapped.getRegTag()); // BATCH strips regtag
        assertNull(mapped.getBikeType()); // BATCH strips bike specifics
    }

    @Test
    void editVehicleStatus_Success() {
        Vehicle existingVehicle = new Vehicle();
        existingVehicle.setId(8L);
        existingVehicle.setVehicleStatus(VehicleStatus.AVAILABLE);
        when(vehicleRepository.findById(8L)).thenReturn(Optional.of(existingVehicle));

        VehicleStatusDto statusDto = new VehicleStatusDto(VehicleStatus.ARCHIVED);

        Vehicle mockSaved = existingVehicle;
        when(vehicleRepository.save(any())).thenReturn(mockSaved);
        
        VehicleDto result = vehicleService.editVehicleStatus(8L, statusDto);
        assertNotNull(result);

        ArgumentCaptor<Vehicle> captor = ArgumentCaptor.forClass(Vehicle.class);
        verify(vehicleRepository).save(captor.capture());
        assertEquals(VehicleStatus.ARCHIVED, captor.getValue().getVehicleStatus());
    }

    // ─── RELATIONAL CLEANUP ─────────────────────────────────────────────────

    @Test
    void deleteVehicle_Success_OrphansFromTickets() {
        Vehicle existing = new Vehicle();
        existing.setId(77L);

        Ticket t1 = new Ticket();
        t1.setId(1L);
        t1.setVehicles(new ArrayList<>(List.of(existing)));
        ReflectionTestUtils.setField(t1, "ticketStatus", se.hjulverkstan.main.feature.ticket.TicketStatus.CLOSED);

        when(vehicleRepository.findById(77L)).thenReturn(Optional.of(existing));

        vehicleService.hardDeleteVehicle(77L);

        verify(vehicleRepository).delete(existing);
    }
}
