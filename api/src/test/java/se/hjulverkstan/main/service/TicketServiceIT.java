package se.hjulverkstan.main.service;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.Exceptions.UnsupportedTicketStatusException;
import se.hjulverkstan.Exceptions.UnsupportedTicketVehiclesException;
import se.hjulverkstan.main.annotations.RepositoryTest;
import se.hjulverkstan.main.base.BaseJpaTest;
import se.hjulverkstan.main.dto.responses.GetAllTicketDto;
import se.hjulverkstan.main.dto.tickets.*;
import se.hjulverkstan.main.model.*;
import se.hjulverkstan.main.repository.TicketRepository;
import se.hjulverkstan.main.repository.VehicleRepository;
import se.hjulverkstan.main.util.TestWebSecurityConfig;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.LongStream;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static se.hjulverkstan.main.service.TicketServiceImpl.ELEMENT_NAME;


@RepositoryTest
@Import(TicketServiceImpl.class)
@Sql(scripts = {
        "classpath:script/location.sql",
        "classpath:script/vehicle.sql",
        "classpath:script/employee.sql",
        "classpath:script/customer.sql",
        "classpath:script/ticket.sql",
        "classpath:script/ticket_vehicle.sql"
})
public class TicketServiceIT extends BaseJpaTest {

    private static final Long TICKET_NONEXISTENT_ID = 999L;
    private static final String TICKET_DOES_NOT_EXIST_MESSAGE = ELEMENT_NAME + " Not Found";

    @Autowired
    private TicketService ticketService;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Test
    @DisplayName("getAllTickets() should return all tickets")
    void testGetAllTickets_shouldReturnAllTickets() {
        // given
        List<Long> expectedIds = LongStream.rangeClosed(1, 8).boxed().toList();

        // when
        List<TicketDto> result = ticketService.getAllTicket().getTickets();

        // then
        assertThat(result)
                .hasSize(expectedIds.size())
                .isSortedAccordingTo((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .extracting(TicketDto::getId)
                .containsExactlyInAnyOrderElementsOf(expectedIds);

    }

    @ParameterizedTest(name = "Ticket ID {0} should return {1}")
    @DisplayName("getTicketById() should return ticket when it exists")
    @MethodSource("provideTicketIdsAndExpectedTypes")
    void testGetTicketById_shouldReturnTicket_whenExists(Long id, Class<? extends TicketDto> expectedType) {
        // when
        TicketDto result = ticketService.getTicketById(id);

        // then
        assertThat(result)
                .isNotNull()
                .isInstanceOf(expectedType)
                .extracting(TicketDto::getId)
                .isEqualTo(id);
    }

    @Test
    @DisplayName("getTicketById() should throw when ticket does not exist")
    void testGetTicketById_shouldThrow_whenNotExists() {
        assertThatThrownBy(() -> ticketService.getTicketById(TICKET_NONEXISTENT_ID))
                .isInstanceOf(ElementNotFoundException.class)
                .hasMessage(TICKET_DOES_NOT_EXIST_MESSAGE);
    }

    @ParameterizedTest(name = "Deleting Ticket ID {0} should return {1} and remove it from the database")
    @MethodSource("provideTicketIdsAndExpectedTypes")
    @DisplayName("deleteTicket() should delete ticket when it exists")
    void testDeleteTicket_shouldDelete_whenExists(Long id, Class<? extends TicketDto> expectedType) {
        // Precondition: ensure ticket exists
        assertThat(ticketRepository.existsById(id))
                .as("Precondition: Ticket ID %s should exist", id)
                .isTrue();

        // when
        TicketDto result = ticketService.deleteTicket(id);

        // then
        assertThat(result)
                .isNotNull()
                .isInstanceOf(expectedType)
                .extracting(TicketDto::getId)
                .isEqualTo(id);

        // Postcheck: ensure ticket is no longer in the repository
        assertThat(ticketRepository.existsById(id))
                .as("Postcondition: Ticket ID %s should no longer exist", id)
                .isFalse();
    }

    @Test
    @DisplayName("deleteTicket() should throw when ticket does not exist")
    void testDeleteTicket_shouldThrow_whenNotExists() {
        assertThatThrownBy(() -> ticketService.deleteTicket(TICKET_NONEXISTENT_ID))
                .isInstanceOf(ElementNotFoundException.class)
                .hasMessage(TICKET_DOES_NOT_EXIST_MESSAGE);
    }

    @ParameterizedTest(name = "Editing Ticket ID {0} should return {1}")
    @MethodSource("provideTicketEditArguments")
    @DisplayName("editTicket() should update ticket when valid data is provided")
    void testEditTicket_shouldUpdate_whenValidData(Long ticketId, EditTicketDto editDto, Class<? extends TicketDto> expectedType) {
        // when
        TicketDto result = ticketService.editTicket(ticketId, editDto);

        // then
        assertThat(result)
                .isNotNull()
                .isInstanceOf(expectedType)
                .extracting(TicketDto::getId)
                .isEqualTo(ticketId);

        // post-check: verify comment was persisted
        assertThat(ticketRepository.findById(ticketId))
                .as("Updated ticket should be present")
                .isPresent()
                .get()
                .extracting(Ticket::getComment)
                .isEqualTo(editDto.getComment());

    }

    @ParameterizedTest
    @MethodSource("provideInvalidVehicleEditArguments")
    @DisplayName("editTicket() should throw for invalid vehicle usage")
    void testEditTicket_shouldThrowForInvalidVehicleUsage(Long id, EditTicketDto dto, String expectedMessage) {
        assertThatThrownBy(() -> ticketService.editTicket(id, dto))
                .isInstanceOf(UnsupportedTicketVehiclesException.class)
                .hasMessageContaining(expectedMessage);
    }

    @Test
    @DisplayName("editTicket() should throw when ticket does not exist")
    void testEditTicket_shouldThrow_whenNotExists() {
        assertThatThrownBy(() -> ticketService.editTicket(TICKET_NONEXISTENT_ID, new EditTicketDto()))
                .isInstanceOf(ElementNotFoundException.class)
                .hasMessage(TICKET_DOES_NOT_EXIST_MESSAGE);
    }

    @ParameterizedTest
    @MethodSource("provideValidTicketDtos")
    @DisplayName("createTicket() should persist ticket with minimum fields")
    void testCreateTicket_shouldPersistForEachType(NewTicketDto newTicketDto, Class<? extends Ticket> expectedEntityType) {
        // when
        TicketDto result = ticketService.createTicket(newTicketDto);

        // then
        assertThat(result)
                .isNotNull()
                .isInstanceOf(TicketDto.class)
                .extracting(TicketDto::getTicketType)
                .isEqualTo(newTicketDto.getTicketType());

        Ticket persisted = ticketRepository.findById(result.getId())
                .orElseThrow(() -> new AssertionError("Ticket was not saved"));

        assertThat(persisted)
                .isInstanceOf(expectedEntityType)
                .extracting(Ticket::getCustomer, Ticket::getEmployee)
                .doesNotContainNull();
    }

    // The logic of the method will never allow the second throw clause to be reached. Logic needs to be fixed.
    @ParameterizedTest
    @MethodSource("provideInvalidTickets")
    @DisplayName("createTicket() should throw for unsupported vehicle combinations")
    void testCreateTicket_shouldThrowForInvalidVehicleCombinations(NewTicketDto dto, String expectedMessage) {
        assertThatThrownBy(() -> ticketService.createTicket(dto))
                .isInstanceOf(UnsupportedTicketVehiclesException.class)
                .hasMessageContaining(expectedMessage);
    }

    @Test
    @DisplayName("createTicket() should mark non-customer vehicle UNAVAILABLE for REPAIR")
    void testCreateTicket_shouldMarkVehicleUnavailable_forRepair() {
        Long vehicleId = 3L;

        NewTicketRepairDto dto = buildRepairTicket(vehicleId, 1L, 2L);
        dto.setComment("Status test");

        ticketService.createTicket(dto);

        Vehicle updated = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new AssertionError("Vehicle not updated"));

        assertThat(updated.getVehicleStatus()).isEqualTo(VehicleStatus.UNAVAILABLE);
    }

    @ParameterizedTest
    @MethodSource("provideDtoWithNullifiedStartDate")
    @DisplayName("createTicket() should nullify startDate for RECEIVE and DONATE types")
    void testCreateTicket_shouldNullifyStartDate(NewTicketDto dto) {
        TicketDto result = ticketService.createTicket(dto);
        Ticket persisted = ticketRepository.findById(result.getId())
                .orElseThrow(() -> new AssertionError("Ticket was not saved"));

        assertThat(persisted.getStartDate()).isNull();
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("provideValidTicketStatusUpdateCases")
    @DisplayName("updateTicketStatus() should update status when valid")
    void testUpdateTicketStatus_shouldUpdate_whenValid(String description, Long ticketId, TicketStatus newStatus, VehicleStatus expectedVehicleStatus) {
        // given
        TicketStatusDto dto = new TicketStatusDto();
        dto.setTicketStatus(newStatus);

        // when
        TicketDto result = ticketService.updateTicketStatus(ticketId, dto);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getTicketStatus()).isEqualTo(newStatus);

        // post-check: ticket and vehicles are updated
        Ticket updatedTicket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new AssertionError("Updated ticket not found"));
        assertThat(updatedTicket.getTicketStatus()).isEqualTo(newStatus);

        for (Vehicle v : updatedTicket.getVehicles()) {
            if (!v.isCustomerOwned()) {
                if (expectedVehicleStatus != null) {
                    assertThat(v.getVehicleStatus()).isEqualTo(expectedVehicleStatus);
                }
            } else {
                if (newStatus == TicketStatus.CLOSED) {
                    assertThat(v.getVehicleStatus()).isEqualTo(VehicleStatus.ARCHIVED);
                } else {
                    assertThat(v.getVehicleStatus()).isNull();
                }
            }
        }
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("provideInvalidTicketStatusUpdateCases")
    @DisplayName("updateTicketStatus() should throw status when invalid")
    void testUpdateTicketStatus_shouldThrow_whenInvalidTransition(String description, Long ticketId, TicketStatus newStatus, String expectedMessage) {
        assertThatThrownBy(() -> ticketService.updateTicketStatus(ticketId, new TicketStatusDto(newStatus)))
                .isInstanceOf(UnsupportedTicketStatusException.class)
                .hasMessageContaining(expectedMessage);
    }

    // Forced assertion failure, unsure if should follow earlier error message or not
    @Test
    @DisplayName("updateTicketStatus() should throw when ticket does not exist")
    void testUpdateTicketStatus_shouldThrow_whenNotExists() {
        assertThatThrownBy(() -> ticketService.updateTicketStatus(TICKET_NONEXISTENT_ID, new TicketStatusDto()))
                .isInstanceOf(ElementNotFoundException.class)
                .hasMessage(TICKET_DOES_NOT_EXIST_MESSAGE);
    }

    // --- Factories ---

    private static Stream<Arguments> provideTicketIdsAndExpectedTypes() {
        return Stream.of(
                Arguments.of(1L, TicketRepairDto.class),
                Arguments.of(2L, TicketRentDto.class),
                Arguments.of(6L, TicketDonateDto.class),
                Arguments.of(8L, TicketReceiveDto.class)
        );
    }

    private static Stream<Arguments> provideTicketEditArguments() {
        return Stream.of(
                Arguments.of(1L, createEditDto(1L, 2L, 1L, List.of(1L)), TicketRepairDto.class),
                Arguments.of(2L, createEditDto(2L, 1L, 2L, List.of(3L)), TicketRentDto.class),
                Arguments.of(6L, createEditDto(6L, 1L, 3L, List.of(4L)), TicketDonateDto.class),
                Arguments.of(8L, createEditDto(8L, 2L, 3L, List.of(8L)), TicketReceiveDto.class)
        );
    }

    private static Stream<Arguments> provideInvalidVehicleEditArguments() {
        return Stream.of(
                Arguments.of(2L, createEditDto(2L, 1L, 2L, List.of(1L)), "Customer Owned Vehicles cannot be selected for Rental or Donate Tickets!"),
                Arguments.of(6L, createEditDto(6L, 1L, 3L, List.of(2L)), "Customer Owned Vehicles cannot be selected for Rental or Donate Tickets!"),
                Arguments.of(1L, createEditDto(1L, 2L, 1L, List.of(1L, 12L)), "Cannot select both Customer Owned and Non Customer Owned Vehicles!")
        );
    }

    private static Stream<Arguments> provideInvalidTickets() {
        return Stream.of(
                Arguments.of(buildRentTicket(1L, 1L, 2L), "Customer Owned Vehicles cannot be selected for Rental or Donate Tickets!"),
                Arguments.of(buildDonateTicketWithMixedOwnership(List.of(1L, 3L), 1L, 2L), "Cannot select both Customer Owned and Non Customer Owned Vehicles!")
        );
    }

    private static Stream<Arguments> provideDtoWithNullifiedStartDate() {
        return Stream.of(
                Arguments.of(buildDonateTicket(3L, 1L, 2L)),
                Arguments.of(buildReceiveTicket(3L, 1L, 2L))
        );
    }

    private static Stream<Arguments> provideValidTicketDtos() {
        return Stream.of(
                Arguments.of(buildRepairTicket(3L, 1L, 2L), TicketRepair.class),
                Arguments.of(buildRentTicket(3L, 1L, 2L), TicketRent.class),
                Arguments.of(buildDonateTicket(3L, 1L, 2L), TicketDonate.class),
                Arguments.of(buildReceiveTicket(3L, 1L, 2L), TicketReceive.class)
        );
    }

    private static Stream<Arguments> provideValidTicketStatusUpdateCases() {
        return Stream.of(
                Arguments.of("Repair ticket (non-customer vehicle) to IN_PROGRESS", 1L, TicketStatus.IN_PROGRESS, VehicleStatus.UNAVAILABLE),
                Arguments.of("Rent ticket (non-customer vehicle) to IN_PROGRESS", 2L, TicketStatus.IN_PROGRESS, VehicleStatus.UNAVAILABLE)
        );
    }

    private static Stream<Arguments> provideInvalidTicketStatusUpdateCases() {
        return Stream.of(
                Arguments.of("Donate ticket (customer-owned vehicle) to CLOSED", 6L, TicketStatus.CLOSED, "Invalid status transition for ticket type: DONATE"),
                Arguments.of("Receive ticket (customer-owned vehicle) to READY", 8L, TicketStatus.READY, "Invalid status transition for ticket type: RECEIVE")
        );
    }

    // --- Helper methods ---

    private static EditTicketDto createEditDto(Long id, Long employeeId, Long customerId, List<Long> vehicleIds) {
        EditTicketDto dto = new EditTicketDto();
        dto.setStartDate(LocalDateTime.of(2025, 1, 1, 12, 0));
        dto.setComment("Updated comment");
        dto.setVehicleIds(vehicleIds);
        dto.setEmployeeId(employeeId);
        dto.setCustomerId(customerId);
        return dto;
    }

    private static NewTicketRepairDto buildRepairTicket(Long vehicleId, Long employeeId, Long customerId) {
        NewTicketRepairDto dto = new NewTicketRepairDto();
        dto.setTicketType(TicketType.REPAIR);
        dto.setStartDate(LocalDateTime.now());
        dto.setComment("Repair ticket");
        dto.setVehicleIds(List.of(vehicleId));
        dto.setEmployeeId(employeeId);
        dto.setCustomerId(customerId);
        dto.setEndDate(LocalDateTime.now().plusDays(1));
        dto.setRepairDescription("Fix brakes");
        return dto;
    }

    private static NewTicketRentDto buildRentTicket(Long vehicleId, Long employeeId, Long customerId) {
        NewTicketRentDto dto = new NewTicketRentDto();
        dto.setTicketType(TicketType.RENT);
        dto.setStartDate(LocalDateTime.now());
        dto.setComment("Rent ticket");
        dto.setVehicleIds(List.of(vehicleId));
        dto.setEmployeeId(employeeId);
        dto.setCustomerId(customerId);
        dto.setEndDate(LocalDateTime.now().plusDays(2));
        return dto;
    }

    private static NewTicketDonateDto buildDonateTicket(Long vehicleId, Long employeeId, Long customerId) {
        NewTicketDonateDto dto = new NewTicketDonateDto();
        dto.setTicketType(TicketType.DONATE);
        dto.setComment("Donate ticket");
        dto.setVehicleIds(List.of(vehicleId));
        dto.setEmployeeId(employeeId);
        dto.setCustomerId(customerId);
        return dto;
    }

    private static NewTicketReceiveDto buildReceiveTicket(Long vehicleId, Long employeeId, Long customerId) {
        NewTicketReceiveDto dto = new NewTicketReceiveDto();
        dto.setTicketType(TicketType.RECEIVE);
        dto.setComment("Receive ticket");
        dto.setVehicleIds(List.of(vehicleId));
        dto.setEmployeeId(employeeId);
        dto.setCustomerId(customerId);
        return dto;
    }

    private static NewTicketDonateDto buildDonateTicketWithMixedOwnership(List<Long> vehicleIds, Long employeeId, Long customerId) {
        NewTicketDonateDto dto = new NewTicketDonateDto();
        dto.setTicketType(TicketType.DONATE);
        dto.setComment("Mixed ownership");
        dto.setVehicleIds(vehicleIds);
        dto.setEmployeeId(employeeId);
        dto.setCustomerId(customerId);
        return dto;
    }
}
