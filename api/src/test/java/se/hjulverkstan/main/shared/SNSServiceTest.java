package se.hjulverkstan.main.shared;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.PublishResponse;
import software.amazon.awssdk.services.sns.model.SnsException;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SNSServiceTest {

    @Mock
    private SnsClient snsClient;

    @InjectMocks
    private SNSService snsService;

    @Test
    @DisplayName("Should send SMS successfully and return message ID")
    void shouldSendSmsSuccessfully() {
        // Arrange
        String phone = "+46701234567";
        String message = "Hej Johan!";
        String messageId = "msg-123";

        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        PrintStream originalOut = System.out;
        System.setOut(new PrintStream(outContent));

        try {
            PublishResponse response = PublishResponse.builder().messageId(messageId).build();
            when(snsClient.publish(any(PublishRequest.class))).thenReturn(response);

            // Act
            String result = snsService.sendSms(phone, message);

            // Assert
            assertEquals(messageId, result);
            assertTrue(outContent.toString().contains("Message ID: " + messageId));
            
            // Deep Capture Verification to kill builder mutations
            ArgumentCaptor<PublishRequest> captor = ArgumentCaptor.forClass(PublishRequest.class);
            verify(snsClient).publish(captor.capture());
            
            PublishRequest captured = captor.getValue();
            assertEquals(phone, captured.phoneNumber());
            assertEquals(message, captured.message());
        } finally {
            System.setOut(originalOut);
        }
    }

    @Test
    @DisplayName("Boundary: Should accept exactly 7 digits after +46")
    void shouldAcceptLowerBoundary_7Digits() {
        String phone = "+461234567";
        when(snsClient.publish(any(PublishRequest.class))).thenReturn(PublishResponse.builder().messageId("id").build());
        
        assertDoesNotThrow(() -> snsService.sendSms(phone, "msg"));
    }

    @Test
    @DisplayName("Boundary: Should accept exactly 12 digits after +46")
    void shouldAcceptUpperBoundary_12Digits() {
        String phone = "+46123456789012";
        when(snsClient.publish(any(PublishRequest.class))).thenReturn(PublishResponse.builder().messageId("id").build());
        
        assertDoesNotThrow(() -> snsService.sendSms(phone, "msg"));
    }

    @Test
    @DisplayName("Boundary: Should reject 6 digits (too short)")
    void shouldRejectBelowBoundary_6Digits() {
        String phone = "+46123456";
        RuntimeException ex = assertThrows(RuntimeException.class, () -> snsService.sendSms(phone, "msg"));
        assertTrue(ex.getMessage().contains("Invalid phone number"));
    }

    @Test
    @DisplayName("Boundary: Should reject 13 digits (too long)")
    void shouldRejectAboveBoundary_13Digits() {
        String phone = "+461234567890123";
        RuntimeException ex = assertThrows(RuntimeException.class, () -> snsService.sendSms(phone, "msg"));
        assertTrue(ex.getMessage().contains("Invalid phone number"));
    }

    @Test
    @DisplayName("Validation: Should reject wrong prefix (+47)")
    void shouldRejectWrongPrefix() {
        String phone = "+47701234567";
        assertThrows(RuntimeException.class, () -> snsService.sendSms(phone, "msg"));
    }

    @Test
    @DisplayName("Validation: Should reject letters in phone number")
    void shouldRejectAlphanumeric() {
        String phone = "+4670123456A";
        assertThrows(RuntimeException.class, () -> snsService.sendSms(phone, "msg"));
    }

    @Test
    @DisplayName("Validation: Should reject number without plus prefix")
    void shouldRejectNoPlusPrefix() {
        String phone = "46701234567";
        assertThrows(RuntimeException.class, () -> snsService.sendSms(phone, "msg"));
    }

    @Test
    @DisplayName("Error Handling: Should propagate SnsException from client")
    void shouldPropagateSnsException() {
        // Arrange
        when(snsClient.publish(any(PublishRequest.class))).thenThrow(SnsException.builder().message("AWS Error").build());

        // Act & Assert
        SnsException ex = assertThrows(SnsException.class, () -> snsService.sendSms("+46701234567", "msg"));
        assertEquals("AWS Error", ex.getMessage());
    }
}
