package se.hjulverkstan.main.feature.notification;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import se.hjulverkstan.main.feature.customer.Customer;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.shared.SNSService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private SNSService snsService;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    private static final String COMPLETE_TEMPLATE = "Hej %s!\nDin cykel är redo att hämtas på Hjulverkstan i %s";

    private Ticket ticket;
    private Customer customer;
    private Location location;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(notificationService, "ticketCompleteSmsTemplate", COMPLETE_TEMPLATE);

        customer = new Customer();
        customer.setFirstName("Johan");
        customer.setPhoneNumber("+46701234567");

        location = new Location();
        location.setName("Hjulverkstan Götgatan");

        ticket = new Ticket();
        ReflectionTestUtils.setField(ticket, "id", 100L);
        ticket.setCustomer(customer);
        ticket.setLocation(location);
    }

    @Test
    @DisplayName("Complete SMS Success")
    void sendRepairTicketCompleteSms_Success() {
        when(snsService.sendSms(anyString(), anyString())).thenReturn("msg-1");

        Notification result = notificationService.sendRepairTicketCompleteSms(ticket);

        assertEquals(NotificationStatus.ACCEPTED, result.getNotificationStatus());
        assertEquals(NotificationType.REPAIR_COMPLETED, result.getNotificationType());
        assertTrue(result.getMessage().contains("Johan"));
        assertTrue(result.getMessage().contains("Götgatan"));
        verify(notificationRepository).save(result);
    }

    @Test
    @DisplayName("Failure persists FAILED notification")
    void sendSms_Failure() {
        when(snsService.sendSms(anyString(), anyString())).thenThrow(new RuntimeException("API Down"));

        Notification result = notificationService.sendRepairTicketCompleteSms(ticket);

        assertEquals(NotificationStatus.FAILED, result.getNotificationStatus());
        assertNull(result.getSnsMessageId());
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    @DisplayName("Captured notification data verification")
    void verifyNotificationDataMapping() {
        when(snsService.sendSms(anyString(), anyString())).thenReturn("sns-id");

        notificationService.sendRepairTicketCompleteSms(ticket);

        ArgumentCaptor<Notification> captor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository).save(captor.capture());
        
        Notification saved = captor.getValue();
        assertEquals(customer.getPhoneNumber(), saved.getPhoneNumber());
        assertEquals(ticket, saved.getTicket());
        assertEquals("sns-id", saved.getSnsMessageId());
    }
}
