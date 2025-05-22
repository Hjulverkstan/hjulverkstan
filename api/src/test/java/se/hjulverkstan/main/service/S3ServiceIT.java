package se.hjulverkstan.main.service;


import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.*;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.testcontainers.containers.localstack.LocalStackContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;
import se.hjulverkstan.main.dto.ImageUploadResponse;
import se.hjulverkstan.main.util.AbstractSchemaIsolatedTest;
import se.hjulverkstan.main.util.LocalstackContainerConfig;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.testcontainers.containers.localstack.LocalStackContainer.Service.S3;

@SpringBootTest
@ActiveProfiles("test")
@Import(LocalstackContainerConfig.class)
public class S3ServiceIT {

    @Autowired
    private AmazonS3 amazonS3;

    @Autowired
    private S3Service s3Service;

    private MockMultipartFile file;

    @BeforeEach
    void setup() {
        // Create a test file before each test
        file = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                "dummy image content".getBytes(StandardCharsets.UTF_8)
        );

        // Ensure the bucket exists before each test
        if (!amazonS3.doesBucketExistV2(BUCKET_NAME)) {
            amazonS3.createBucket(BUCKET_NAME);
        }
    }

    private static final DockerImageName LOCALSTACK_IMAGE = DockerImageName.parse("localstack/localstack:3.7.2");
    private static final String BUCKET_NAME = "test-bucket";

    @Container
    static LocalStackContainer localstack = new LocalStackContainer(LOCALSTACK_IMAGE)
            .withServices(S3);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("hjulverkstan.aws-s3.bucket-name", () -> BUCKET_NAME);
        registry.add("spring.cloud.aws.region.static", localstack::getRegion);
        registry.add("spring.cloud.aws.credentials.access-key", localstack::getAccessKey);
        registry.add("spring.cloud.aws.credentials.secret-key", localstack::getSecretKey);
        registry.add("spring.cloud.aws.s3.endpoint", () -> localstack.getEndpointOverride(S3).toString());
    }

    @BeforeAll
    static void setupLocalStack() throws IOException, InterruptedException {
        localstack.execInContainer("awslocal", "s3", "mb", "s3://" + BUCKET_NAME);
        localstack.start();
    }

    @Test
    void uploadFile_shouldStoreFileAndReturnPublicUrl() {
        ImageUploadResponse response = s3Service.uploadFile(file);

        assertThat(response).isNotNull();
        assertThat(response.getImageURL()).contains(BUCKET_NAME);

        String key = s3Service.extractKeyFromURL(response.getImageURL());
        assertThat(amazonS3.doesObjectExist(BUCKET_NAME, key)).isTrue();
    }

    @Test
    void deleteFile_shouldRemoveFileFromS3() {
        ImageUploadResponse response = s3Service.uploadFile(file);
        String key = s3Service.extractKeyFromURL(response.getImageURL());

        assertThat(amazonS3.doesObjectExist(BUCKET_NAME, key)).isTrue();

        s3Service.deleteFileByKey(key);
        assertThat(amazonS3.doesObjectExist(BUCKET_NAME, key)).isFalse();
    }

    public class LocalStackS3Utils {

        public static void createBucket(LocalStackContainer container, String bucketName) throws IOException, InterruptedException {
            container.execInContainer(String.valueOf(container), "awslocal", "s3api", "create-bucket", "--bucket", bucketName);
        }

        public static void deleteBucket(LocalStackContainer container, String bucketName) throws IOException, InterruptedException {
            container.execInContainer(String.valueOf(container), "awslocal", "s3api", "delete-bucket", "--bucket", bucketName);
        }

        public static void deleteObject(LocalStackContainer container, String bucketName, String objectKey) throws IOException, InterruptedException {
            container.execInContainer(String.valueOf(container), "awslocal", "s3api", "delete-object", "--bucket", bucketName, "--key", objectKey);
        }
    }
}
