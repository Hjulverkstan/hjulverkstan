package se.hjulverkstan.main.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.sns.SnsClient;

@Configuration
public class AwsConfig {

    @Value("${hjulverkstan.aws-s3.region}")
    private String region;

    @Bean
    public S3Client s3Client() {
        return S3Client.builder().region(Region.of(region)).build();
    }

    @Bean
    public SnsClient snsClient() {
        return SnsClient.builder().region(Region.of(region)).build();
    }
}

