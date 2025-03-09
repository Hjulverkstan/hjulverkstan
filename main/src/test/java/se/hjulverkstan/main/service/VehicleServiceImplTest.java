package se.hjulverkstan.main.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import se.hjulverkstan.Exceptions.AlreadyUsedException;
import se.hjulverkstan.Exceptions.UnsupportedVehicleStatusException;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.responses.GetAllVehicleDto;
import se.hjulverkstan.main.dto.vehicles.*;
import se.hjulverkstan.main.model.*;
import se.hjulverkstan.main.repository.LocationRepository;
import se.hjulverkstan.main.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

@ExtendWith(MockitoExtension.class)
public class VehicleServiceImplTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    // Test that createVehicle succeeds with valid input
    @Test
    void createVehicle_successful() {
        NewVehicleBikeDto newVehicle = new NewVehicleBikeDto();
        newVehicle.setRegTag("XYZ123");
        newVehicle.setVehicleType(VehicleType.BIKE);
        newVehicle.setVehicleStatus(VehicleStatus.AVAILABLE);
        newVehicle.setImageURL("http://example.com/bike.png");
        newVehicle.setComment("Test bike");
        newVehicle.setLocationId(1L);
        newVehicle.setIsCustomerOwned(false);
        newVehicle.setBikeType(BikeType.MOUNTAINBIKE);
        newVehicle.setGearCount(21);
        newVehicle.setSize(BikeSize.MEDIUM);
        newVehicle.setBrakeType(VehicleBrakeType.DISC);
        newVehicle.setBrand(VehicleBrand.MONARK);

        Location location = new Location();
        ReflectionTestUtils.setField(location, "id", 1L);
        location.setName("Main Depot");
        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));
        when(vehicleRepository.findByRegTag("XYZ123")).thenReturn(Optional.empty());

        VehicleDto result = vehicleService.createVehicle(newVehicle);

        assertNotNull(result);
        assertEquals("XYZ123", result.getRegTag());
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    // Test that createVehicle throws AlreadyUsedException for duplicate regTag
    @Test
    void createVehicle_throwsAlreadyUsedException() {
        NewVehicleBikeDto newVehicle = new NewVehicleBikeDto();
        newVehicle.setRegTag("DUPLICATE");
        newVehicle.setVehicleType(VehicleType.BIKE);
        newVehicle.setVehicleStatus(VehicleStatus.AVAILABLE);
        newVehicle.setLocationId(1L);
        newVehicle.setIsCustomerOwned(false);
        newVehicle.setBikeType(BikeType.ROAD);
        newVehicle.setGearCount(18);
        newVehicle.setSize(BikeSize.SMALL);
        newVehicle.setBrakeType(VehicleBrakeType.CALIPER);
        newVehicle.setBrand(VehicleBrand.SKEPPSHULT);

        when(vehicleRepository.findByRegTag("DUPLICATE")).thenReturn(Optional.of(new Vehicle()));

        assertThrows(AlreadyUsedException.class, () -> vehicleService.createVehicle(newVehicle));
    }

    // Test that getAllVehicles returns a list of vehicles
    @Test
    void getAllVehicles_returnsVehicles() {
        VehicleBike vehicleBike = new VehicleBike();
        ReflectionTestUtils.setField(vehicleBike, "id", 100L);
        vehicleBike.setRegTag("B123");
        vehicleBike.setVehicleType(VehicleType.BIKE);
        vehicleBike.setVehicleStatus(VehicleStatus.AVAILABLE);
        Location location = new Location();
        ReflectionTestUtils.setField(location, "id", 1L);
        vehicleBike.setLocation(location);
        vehicleBike.setTickets(new ArrayList<>());

        List<Vehicle> vehicleList = List.of(vehicleBike);
        when(vehicleRepository.findAll(any(Sort.class))).thenReturn(vehicleList);

        GetAllVehicleDto result = vehicleService.getAllVehicles();

        assertNotNull(result);
        assertFalse(result.getVehicles().isEmpty());
        assertEquals("B123", result.getVehicles().get(0).getRegTag());
    }

    // Test that getVehicleById returns the correct vehicle
    @Test
    void getVehicleById_returnsVehicle() {
        VehicleBike vehicleBike = new VehicleBike();
        ReflectionTestUtils.setField(vehicleBike, "id", 101L);
        vehicleBike.setRegTag("B101");
        vehicleBike.setVehicleType(VehicleType.BIKE);
        vehicleBike.setVehicleStatus(VehicleStatus.AVAILABLE);
        Location location = new Location();
        ReflectionTestUtils.setField(location, "id", 1L);
        vehicleBike.setLocation(location);
        vehicleBike.setTickets(new ArrayList<>());
        when(vehicleRepository.findById(101L)).thenReturn(Optional.of(vehicleBike));

        VehicleDto dto = vehicleService.getVehicleById(101L);
        assertNotNull(dto);
        assertEquals("B101", dto.getRegTag());
    }

    // Test that deleteVehicle successfully deletes a vehicle
    @Test
    void deleteVehicle_successful() {
        VehicleBike vehicleBike = new VehicleBike();
        ReflectionTestUtils.setField(vehicleBike, "id", 102L);
        vehicleBike.setRegTag("B102");
        vehicleBike.setVehicleType(VehicleType.BIKE);
        vehicleBike.setVehicleStatus(VehicleStatus.AVAILABLE);
        Location location = new Location();
        ReflectionTestUtils.setField(location, "id", 1L);
        vehicleBike.setLocation(location);
        vehicleBike.setTickets(new ArrayList<>());
        when(vehicleRepository.findById(102L)).thenReturn(Optional.of(vehicleBike));

        VehicleDto dto = vehicleService.deleteVehicle(102L);
        assertNotNull(dto);
        assertEquals("B102", dto.getRegTag());
        verify(vehicleRepository).delete(vehicleBike);
    }

    // Test that editVehicle updates a vehicle with new data
    @Test
    void editVehicle_successful() {
        VehicleBike vehicleBike = new VehicleBike();
        ReflectionTestUtils.setField(vehicleBike, "id", 103L);
        vehicleBike.setRegTag("B103");
        vehicleBike.setVehicleType(VehicleType.BIKE);
        vehicleBike.setVehicleStatus(VehicleStatus.AVAILABLE);
        Location location = new Location();
        ReflectionTestUtils.setField(location, "id", 1L);
        vehicleBike.setLocation(location);
        vehicleBike.setTickets(new ArrayList<>());
        when(vehicleRepository.findById(103L)).thenReturn(Optional.of(vehicleBike));

        EditVehicleBikeDto editDto = new EditVehicleBikeDto();
        editDto.setRegTag("B103-EDIT");
        editDto.setVehicleType(VehicleType.BIKE);
        editDto.setImageURL("http://example.com/edit.png");
        editDto.setComment("Edited comment");
        editDto.setLocationId(1L);
        editDto.setBikeType(BikeType.ROAD);
        editDto.setGearCount(18);
        editDto.setSize(BikeSize.SMALL);
        editDto.setBrakeType(VehicleBrakeType.CALIPER);
        editDto.setBrand(VehicleBrand.SKEPPSHULT);

        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));
        when(vehicleRepository.findByRegTag("B103-EDIT")).thenReturn(Optional.empty());

        EditVehicleDto resultDto = vehicleService.editVehicle(103L, editDto);

        assertNotNull(resultDto);
        assertEquals("B103-EDIT", resultDto.getRegTag());
        assertEquals("Edited comment", resultDto.getComment());
        verify(vehicleRepository).save(vehicleBike);
    }

    // Test that editVehicleStatus successfully updates vehicle status
    @Test
    void editVehicleStatus_successful() {
        VehicleBike vehicleBike = new VehicleBike();
        ReflectionTestUtils.setField(vehicleBike, "id", 104L);
        vehicleBike.setRegTag("B104");
        vehicleBike.setVehicleType(VehicleType.BIKE);
        vehicleBike.setVehicleStatus(VehicleStatus.AVAILABLE);
        Location location = new Location();
        ReflectionTestUtils.setField(location, "id", 1L);
        vehicleBike.setLocation(location);
        vehicleBike.setTickets(new ArrayList<>());
        when(vehicleRepository.findById(104L)).thenReturn(Optional.of(vehicleBike));

        EditVehicleStatusDto statusDto = new EditVehicleStatusDto();
        statusDto.setNewStatus(VehicleStatus.BROKEN);

        VehicleDto dto = vehicleService.editVehicleStatus(104L, statusDto);
        assertNotNull(dto);
        assertEquals(VehicleStatus.BROKEN, dto.getVehicleStatus());
        verify(vehicleRepository).save(vehicleBike);
    }

    // Test that editVehicleStatus throws an exception when a ticket is in progress
    @Test
    void editVehicleStatus_throwsUnsupportedVehicleStatusException_whenTicketInProgress() {
        VehicleBike vehicleBike = new VehicleBike();
        ReflectionTestUtils.setField(vehicleBike, "id", 105L);
        vehicleBike.setRegTag("B105");
        vehicleBike.setVehicleType(VehicleType.BIKE);
        vehicleBike.setVehicleStatus(VehicleStatus.AVAILABLE);
        Location location = new Location();
        ReflectionTestUtils.setField(location, "id", 1L);
        vehicleBike.setLocation(location);

        Ticket openTicket = new Ticket();
        ReflectionTestUtils.setField(openTicket, "ticketStatus", TicketStatus.IN_PROGRESS);
        vehicleBike.setTickets(List.of(openTicket));

        when(vehicleRepository.findById(105L)).thenReturn(Optional.of(vehicleBike));

        EditVehicleStatusDto statusDto = new EditVehicleStatusDto();
        statusDto.setNewStatus(VehicleStatus.BROKEN);

        assertThrows(UnsupportedVehicleStatusException.class,
                () -> vehicleService.editVehicleStatus(105L, statusDto));
    }

    // Test that createVehicle throws ElementNotFoundException when location is not found
    @Test
    void createVehicle_locationNotFound_throwsElementNotFoundException() {
        NewVehicleBikeDto newVehicle = new NewVehicleBikeDto();
        newVehicle.setRegTag("XYZ999");
        newVehicle.setVehicleType(VehicleType.BIKE);
        newVehicle.setVehicleStatus(VehicleStatus.AVAILABLE);
        newVehicle.setLocationId(99L);
        newVehicle.setIsCustomerOwned(false);
        newVehicle.setBikeType(BikeType.MOUNTAINBIKE);
        newVehicle.setGearCount(21);
        newVehicle.setSize(BikeSize.MEDIUM);
        newVehicle.setBrakeType(VehicleBrakeType.DISC);
        newVehicle.setBrand(VehicleBrand.MONARK);

        when(locationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ElementNotFoundException.class, () -> vehicleService.createVehicle(newVehicle));
    }

    // Test that editVehicle throws ElementNotFoundException when new location is not found
    @Test
    void editVehicle_locationNotFound_throwsElementNotFoundException() {
        VehicleBike vehicleBike = new VehicleBike();
        ReflectionTestUtils.setField(vehicleBike, "id", 200L);
        vehicleBike.setRegTag("B200");
        vehicleBike.setVehicleType(VehicleType.BIKE);
        vehicleBike.setVehicleStatus(VehicleStatus.AVAILABLE);
        Location oldLocation = new Location();
        ReflectionTestUtils.setField(oldLocation, "id", 1L);
        vehicleBike.setLocation(oldLocation);
        vehicleBike.setTickets(new ArrayList<>());
        when(vehicleRepository.findById(200L)).thenReturn(Optional.of(vehicleBike));

        EditVehicleBikeDto editDto = new EditVehicleBikeDto();
        editDto.setRegTag("B200-EDIT");
        editDto.setVehicleType(VehicleType.BIKE);
        editDto.setImageURL("http://example.com/edit.png");
        editDto.setComment("Edit test");
        editDto.setLocationId(99L);
        editDto.setBikeType(BikeType.ROAD);
        editDto.setGearCount(18);
        editDto.setSize(BikeSize.SMALL);
        editDto.setBrakeType(VehicleBrakeType.CALIPER);
        editDto.setBrand(VehicleBrand.SKEPPSHULT);

        when(locationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ElementNotFoundException.class, () -> vehicleService.editVehicle(200L, editDto));
    }

    // Test that getVehicleById throws ElementNotFoundException when vehicle is not found
    @Test
    void getVehicleById_vehicleNotFound_throwsElementNotFoundException() {
        when(vehicleRepository.findById(300L)).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> vehicleService.getVehicleById(300L));
    }

    // Test that deleteVehicle throws ElementNotFoundException when vehicle is not found
    @Test
    void deleteVehicle_vehicleNotFound_throwsElementNotFoundException() {
        when(vehicleRepository.findById(400L)).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> vehicleService.deleteVehicle(400L));
    }

    // Test that editVehicle throws AlreadyUsedException when new regTag conflicts with another vehicle
    @Test
    void editVehicle_regTagConflict_throwsAlreadyUsedException() {
        VehicleBike vehicleBike = new VehicleBike();
        ReflectionTestUtils.setField(vehicleBike, "id", 500L);
        vehicleBike.setRegTag("B500");
        vehicleBike.setVehicleType(VehicleType.BIKE);
        vehicleBike.setVehicleStatus(VehicleStatus.AVAILABLE);
        Location location = new Location();
        ReflectionTestUtils.setField(location, "id", 1L);
        vehicleBike.setLocation(location);
        vehicleBike.setTickets(new ArrayList<>());
        when(vehicleRepository.findById(500L)).thenReturn(Optional.of(vehicleBike));

        Vehicle anotherVehicle = new Vehicle();
        ReflectionTestUtils.setField(anotherVehicle, "id", 501L);
        anotherVehicle.setRegTag("B500-NEW");
        when(vehicleRepository.findByRegTag("B500-NEW")).thenReturn(Optional.of(anotherVehicle));

        EditVehicleBikeDto editDto = new EditVehicleBikeDto();
        editDto.setRegTag("B500-NEW");
        editDto.setVehicleType(VehicleType.BIKE);
        editDto.setImageURL("http://example.com/edit.png");
        editDto.setComment("RegTag conflict test");
        editDto.setLocationId(1L);
        editDto.setBikeType(BikeType.ROAD);
        editDto.setGearCount(18);
        editDto.setSize(BikeSize.SMALL);
        editDto.setBrakeType(VehicleBrakeType.CALIPER);
        editDto.setBrand(VehicleBrand.SKEPPSHULT);

        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));

        assertThrows(AlreadyUsedException.class, () -> vehicleService.editVehicle(500L, editDto));
    }

    // Test that createVehicle throws UnsupportedVehicleStatusException for customer-owned vehicle with invalid status
    @Test
    void createVehicle_customerOwnedVehicle_invalidStatus_throwsUnsupportedVehicleStatusException() {
        NewVehicleBikeDto newVehicle = new NewVehicleBikeDto();
        newVehicle.setRegTag(null);
        newVehicle.setVehicleType(VehicleType.BIKE);
        newVehicle.setVehicleStatus(VehicleStatus.AVAILABLE); // Invalid for customer-owned
        newVehicle.setLocationId(1L);
        newVehicle.setIsCustomerOwned(true);
        newVehicle.setBikeType(BikeType.MOUNTAINBIKE);
        newVehicle.setGearCount(21);
        newVehicle.setSize(BikeSize.MEDIUM);
        newVehicle.setBrakeType(VehicleBrakeType.DISC);
        newVehicle.setBrand(VehicleBrand.MONARK);

        Location location = new Location();
        ReflectionTestUtils.setField(location, "id", 1L);
        location.setName("Main Depot");
        // Mark as lenient so that unused stubbing doesn't cause error.
        lenient().when(locationRepository.findById(1L)).thenReturn(Optional.of(location));

        assertThrows(UnsupportedVehicleStatusException.class, () -> vehicleService.createVehicle(newVehicle));
    }

    // Test custom validation logic on NewVehicleDto using a Validator
    @Test
    void validateNewVehicleDto_customValidation() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();

        NewVehicleBikeDto newVehicle = new NewVehicleBikeDto();
        newVehicle.setVehicleType(VehicleType.BIKE);
        newVehicle.setVehicleStatus(VehicleStatus.AVAILABLE);
        newVehicle.setLocationId(1L);
        newVehicle.setIsCustomerOwned(false);
        newVehicle.setBikeType(BikeType.MOUNTAINBIKE);
        newVehicle.setGearCount(21);
        newVehicle.setSize(BikeSize.MEDIUM);
        newVehicle.setBrakeType(VehicleBrakeType.DISC);
        newVehicle.setBrand(VehicleBrand.MONARK);
        // Note: regTag is not set, which should trigger validation errors

        var violations = validator.validate(newVehicle);
        assertFalse(violations.isEmpty());
    }
}
