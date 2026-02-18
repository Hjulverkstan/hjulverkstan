package se.hjulverkstan.main.feature.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.shared.SNSService;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class NotificationService {
    @Value("${sms.templates.ticketComplete}")
    private String ticketCompleteSmsTemplate;

    private final SNSService snsService;
    private final NotificationRepository notificationRepository;

    public Notification sendRepairTicketCompleteSms(Ticket ticket) {
        String msg = ticketCompleteSmsTemplate.formatted(
                ticket.getCustomer().getFirstName(),
                ticket.getLocation().getName()
        );

        Notification notif = new Notification();

        notif.setNotificationType(NotificationType.REPAIR_COMPLETED);
        notif.setTicket(ticket);
        notif.setPhoneNumber(ticket.getCustomer().getPhoneNumber());
        notif.setMessage(msg);

        try {
            String messageId = snsService.sendSms(notif.getPhoneNumber(), notif.getMessage());

            notif.setSnsMessageId(messageId);

            notif.setNotificationStatus(NotificationStatus.ACCEPTED);
        } catch (Exception e) {
            notif.setNotificationStatus(NotificationStatus.FAILED);
        }

        notificationRepository.save(notif);

        return notif;
    }
}
