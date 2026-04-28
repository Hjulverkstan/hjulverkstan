package se.hjulverkstan.main.feature.ticket;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.lang.reflect.Method;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketControllerTest {

    @Mock
    private TicketService ticketService;

    @InjectMocks
    private TicketController ticketController;

    @Test
    @DisplayName("Should return all tickets from service")
    void shouldReturnAllTickets() {
        // Arrange
        ListResponseDto<TicketDto> expected = new ListResponseDto<>(Collections.emptyList());
        when(ticketService.getAllTicket()).thenReturn(expected);

        // Act
        ListResponseDto<TicketDto> result = ticketController.getAllTickets();

        // Assert
        assertSame(expected, result);
        verify(ticketService, times(1)).getAllTicket();
    }

    @Test
    @DisplayName("Should return ticket by ID from service")
    void shouldReturnTicketById() {
        // Arrange
        TicketDto expected = new TicketDto();
        when(ticketService.getTicketById(1L)).thenReturn(expected);

        // Act
        TicketDto result = ticketController.getTicketById(1L);

        // Assert
        assertSame(expected, result);
        verify(ticketService, times(1)).getTicketById(1L);
    }

    @Test
    @DisplayName("Should create ticket and have CREATED status annotation")
    void shouldCreateTicket() throws NoSuchMethodException {
        // Arrange
        TicketDto dto = new TicketDto();
        TicketDto expected = new TicketDto();
        when(ticketService.createTicket(dto)).thenReturn(expected);

        // Act
        TicketDto result = ticketController.createTicket(dto);

        // Assert
        assertSame(expected, result);
        verify(ticketService, times(1)).createTicket(dto);

        // Reflection to kill @ResponseStatus mutation
        Method method = TicketController.class.getMethod("createTicket", TicketDto.class);
        ResponseStatus annotation = method.getAnnotation(ResponseStatus.class);
        assertNotNull(annotation, "@ResponseStatus annotation should be present on createTicket");
        assertEquals(HttpStatus.CREATED, annotation.value());
    }

    @Test
    @DisplayName("Should edit ticket via service")
    void shouldEditTicket() {
        // Arrange
        TicketDto dto = new TicketDto();
        TicketDto expected = new TicketDto();
        when(ticketService.editTicket(1L, dto)).thenReturn(expected);

        // Act
        TicketDto result = ticketController.editTicket(1L, dto);

        // Assert
        assertSame(expected, result);
        verify(ticketService, times(1)).editTicket(1L, dto);
    }

    @Test
    @DisplayName("Should update ticket status via service")
    void shouldUpdateTicketStatus() {
        // Arrange
        TicketStatusDto body = new TicketStatusDto();
        TicketStatusDto expected = new TicketStatusDto();
        when(ticketService.updateTicketStatus(1L, body)).thenReturn(expected);

        // Act
        TicketStatusDto result = ticketController.updateTicketStatus(1L, body);

        // Assert
        assertSame(expected, result);
        verify(ticketService, times(1)).updateTicketStatus(1L, body);
    }

    @Test
    @DisplayName("Should soft delete ticket and have NO_CONTENT status annotation")
    void shouldSoftDeleteTicket() throws NoSuchMethodException {
        // Act
        ticketController.softDeleteTicket(1L);

        // Assert
        verify(ticketService, times(1)).softDeleteTicket(1L);

        // Reflection to kill @ResponseStatus mutation
        Method method = TicketController.class.getMethod("softDeleteTicket", Long.class);
        ResponseStatus annotation = method.getAnnotation(ResponseStatus.class);
        assertNotNull(annotation, "@ResponseStatus annotation should be present on softDeleteTicket");
        assertEquals(HttpStatus.NO_CONTENT, annotation.value());
    }

    @Test
    @DisplayName("Should hard delete ticket and have NO_CONTENT status annotation")
    void shouldHardDeleteTicket() throws NoSuchMethodException {
        // Act
        ticketController.hardDelete(1L);

        // Assert
        verify(ticketService, times(1)).hardDeleteTicket(1L);

        // Reflection to kill @ResponseStatus mutation
        Method method = TicketController.class.getMethod("hardDelete", Long.class);
        ResponseStatus annotation = method.getAnnotation(ResponseStatus.class);
        assertNotNull(annotation, "@ResponseStatus annotation should be present on hardDelete");
        assertEquals(HttpStatus.NO_CONTENT, annotation.value());
    }
}
