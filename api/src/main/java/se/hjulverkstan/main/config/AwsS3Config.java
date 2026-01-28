package se.hjulverkstan.main.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsS3Config {

    @Value("${hjulverkstan.aws-s3.access-key:dummy}")
    private String accessKey;

    @Value("${hjulverkstan.aws-s3.secret-key:dummy}")
    private String secretKey;

    @Value("${hjulverkstan.aws-s3.region:eu-north-1}")
    private String region;

    @Bean
    public S3Client s3Client() {
        String finalRegion = (region == null || region.trim().isEmpty()) ? "eu-north-1" : region;

        String finalAccessKey = (accessKey == null || accessKey.trim().isEmpty()) ? "dummy-access" : accessKey;

        String finalSecretKey = (secretKey == null || secretKey.trim().isEmpty()) ? "dummy-secret" : secretKey;

        return S3Client.builder()
                .region(Region.of(finalRegion))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(finalAccessKey, finalSecretKey)
                ))
                .httpClientBuilder(ApacheHttpClient.builder())
                .build();
    }
}

