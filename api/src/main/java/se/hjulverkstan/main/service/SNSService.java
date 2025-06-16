package se.hjulverkstan.main.service;

import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.PublishResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SNSService {
    private final AmazonSNS amazonSNS;

    @Autowired
    public SNSService(AmazonSNS amazonSNS) {
        this.amazonSNS = amazonSNS;
    }

    public void sendSms(String phoneNumber, String message) {
        if (!phoneNumber.matches("^\\+46\\d{7,12}$")) {
            throw new RuntimeException("Invalid phone number: must start with +46 and contain only digits");
        }

        PublishRequest request = new PublishRequest()
                .withMessage(message)
                .withPhoneNumber(phoneNumber);

        PublishResult result = amazonSNS.publish(request);
        System.out.println("Message ID: " + result.getMessageId());
    }
}
