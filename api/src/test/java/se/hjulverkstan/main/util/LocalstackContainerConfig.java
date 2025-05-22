package se.hjulverkstan.main.util;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.testcontainers.containers.localstack.LocalStackContainer;
import org.testcontainers.utility.DockerImageName;

import static org.testcontainers.containers.localstack.LocalStackContainer.Service.S3;

@TestConfiguration
@Profile("test")
public class LocalstackContainerConfig {

    private static final DockerImageName LOCALSTACK_IMAGE = DockerImageName.parse("localstack/localstack:3.7.2");
    private LocalStackContainer localStackContainer;

    @Value("${hjulverkstan.aws-s3.bucket-name:test-bucket}")
    private String bucketName;

    @PostConstruct
    public void startLocalStack() {
        // Start LocalStack container
        localStackContainer = new LocalStackContainer(LOCALSTACK_IMAGE)
                .withServices(S3);
        localStackContainer.start();
    }

    @PreDestroy
    public void stopLocalStack() {
        if (localStackContainer != null && localStackContainer.isRunning()) {
            localStackContainer.stop();
        }
    }

    @Bean
    public AmazonS3 amazonS3() {
        // Wait for localStackContainer to be initialized
        if (localStackContainer == null || !localStackContainer.isRunning()) {
            throw new IllegalStateException("LocalStack container is not running");
        }

        AmazonS3 amazonS3 = AmazonS3ClientBuilder
                .standard()
                .withEndpointConfiguration(
                        new AwsClientBuilder.EndpointConfiguration(
                                localStackContainer.getEndpointOverride(S3).toString(),
                                localStackContainer.getRegion()
                        )
                )
                .withCredentials(
                        new AWSStaticCredentialsProvider(
                                new BasicAWSCredentials(
                                        localStackContainer.getAccessKey(),
                                        localStackContainer.getSecretKey()
                                )
                        )
                )
                .withPathStyleAccessEnabled(true)  // Required for Localstack
                .build();

        // Create the bucket using the S3 client
        if (!amazonS3.doesBucketExistV2(bucketName)) {
            amazonS3.createBucket(bucketName);
        }

        return amazonS3;
    }
}