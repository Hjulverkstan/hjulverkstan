package se.hjulverkstan.main.config;

import com.amazonaws.auth.AWSCredentials;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;
import com.amazonaws.services.sns.model.SetTopicAttributesRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class AwsConfig {

    @Value("${hjulverkstan.aws.access-key}")
    private String accessKey;

    @Value("${hjulverkstan.aws.secret-key}")
    private String secretKey;

    @Value("${hjulverkstan.aws.region}")
    private String region;

    @Value("${hjulverkstan.aws-s3.bucket-name}")
    private String bucketName;

    @Value("${hjulverkstan.aws-sns.delivery-iam-arn}")
    private String deliveryIamArn;

    @Value("${hjulverkstan.aws-sns.topic-arn}")
    private String topicArn;

    @Bean
    public AWSCredentials awsCredentials() {
        return new BasicAWSCredentials(accessKey, secretKey);
    }

    @Bean
    public AmazonS3 amazonS3(AWSCredentials credentials) {
        return AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region)
                .build();
    }

    @Bean
    public AmazonSNS amazonSNS(AWSCredentials credentials) {
        AmazonSNS snsClient = AmazonSNSClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region)
                .build();

        Map<String, String> attributes = Map.of(
                "DeliveryStatusSuccessSamplingRate", "100",
                "DeliveryStatusFailureSamplingRate", "100",
                "DeliveryStatusIAMRole", deliveryIamArn
        );

        attributes.forEach((key, value) -> {
            snsClient.setTopicAttributes(new SetTopicAttributesRequest()
                    .withTopicArn(topicArn)
                    .withAttributeName(key)
                    .withAttributeValue(value));
        });

        return snsClient;
    }
}

