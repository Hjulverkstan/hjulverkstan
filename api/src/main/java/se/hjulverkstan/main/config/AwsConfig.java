package se.hjulverkstan.main.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.SetSmsAttributesRequest;

import java.util.Map;

@Configuration
public class AwsConfig {
    private static final Logger logger = LoggerFactory.getLogger(AwsConfig.class);

    @Value("${hjulverkstan.aws.access-key:test}")
    private String accessKey;

    @Value("${hjulverkstan.aws.secret-key:test}")
    private String secretKey;

    @Value("${hjulverkstan.aws.region:eu-north-1}")
    private String region;

    private Region getEffectiveRegion() {
        if (region == null || region.isBlank()) {
            return Region.EU_NORTH_1;
        }
        return Region.of(region);
    }

    @Bean
    public StaticCredentialsProvider awsCredentialsProvider() {
        String effectiveAccessKey = (accessKey == null || accessKey.isBlank() ? "test" : accessKey);
        String effectiveSecretKey = (secretKey == null || secretKey.isBlank() ? "test" : secretKey);

        return StaticCredentialsProvider.create(AwsBasicCredentials.create(effectiveAccessKey, effectiveSecretKey));
    }

    @Bean
    public S3Client s3Client(StaticCredentialsProvider creds) {
        return S3Client.builder()
                .region(getEffectiveRegion())
                .credentialsProvider(creds)
                .httpClient(UrlConnectionHttpClient.builder().build())
                .build();
    }

    @Bean
    public SnsClient snsClient(StaticCredentialsProvider creds) {
        SnsClient client = SnsClient.builder()
                .region(getEffectiveRegion())
                .credentialsProvider(creds)
                .httpClient(UrlConnectionHttpClient.builder().build())
                .build();

        if ("test".equals(accessKey)) {
            logger.info("Using test keys, skipping configuration");
            return client;
        }

        // Global SMS delivery status configuration (not topic-specific)
        try {
            Map<String, String> attributes = Map.of(
                    "DeliveryStatusSuccessSamplingRate", "100",
                    "DeliveryStatusFailureSamplingRate", "100"
            );

            client.setSMSAttributes(SetSmsAttributesRequest.builder()
                    .attributes(attributes)
                    .build());
        } catch (Exception e) {
            logger.warn("Not able to set SMS-attributes {}", e.getMessage());
        }

        return client;
    }
}

