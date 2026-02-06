package se.hjulverkstan.main.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import se.hjulverkstan.main.jobs.S3OrphanFileCleanup;
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

    @Value("${hjulverkstan.aws.access-key}")
    private String accessKey;

    @Value("${hjulverkstan.aws.secret-key}")
    private String secretKey;

    @Value("${hjulverkstan.aws.region}")
    private String region;

    @Value("${hjulverkstan.aws-sns.delivery-iam-arn}")
    private String deliveryIamArn;

    @Bean
    public StaticCredentialsProvider awsCredentialsProvider() {
        return StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey));
    }

    @Bean
    public S3Client s3Client(StaticCredentialsProvider creds) {
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(creds)
                .httpClient(UrlConnectionHttpClient.builder().build())
                .build();
    }

    @Bean
    public SnsClient snsClient(StaticCredentialsProvider creds) {
        if (deliveryIamArn.isEmpty()) logger.error("No delivery IAM ARN configured – delivery logs will not work");

        SnsClient client = SnsClient.builder()
                .region(Region.of(region))
                .credentialsProvider(creds)
                .httpClient(UrlConnectionHttpClient.builder().build())
                .build();

        // Global SMS delivery status configuration (not topic-specific)
        Map<String, String> attributes = Map.of(
                "DeliveryStatusSuccessSamplingRate", "100",
                "DeliveryStatusFailureSamplingRate", "100",
                "DeliveryStatusIAMRole", deliveryIamArn
        );

        client.setSMSAttributes(SetSmsAttributesRequest.builder()
                .attributes(attributes)
                .build());

        return client;
    }
}

