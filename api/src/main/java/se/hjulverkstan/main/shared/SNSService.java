package se.hjulverkstan.main.shared;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.PublishResponse;

@Service
@RequiredArgsConstructor
public class SNSService {
    private final SnsClient snsClient;

    public String sendSms(String phoneNumber, String message) {
        if (!phoneNumber.matches("^\\+46\\d{7,12}$")) {
            throw new RuntimeException("Invalid phone number: must start with +46 and contain only digits");
        }

        PublishResponse res = snsClient.publish(PublishRequest.builder()
                .phoneNumber(phoneNumber)
                .message(message)
                .build());

        System.out.println("Message sent to: " + phoneNumber + " | Message ID: " + res.messageId());
        return res.messageId();
    }
}