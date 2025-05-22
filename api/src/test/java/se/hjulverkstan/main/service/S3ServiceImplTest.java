package se.hjulverkstan.main.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.testcontainers.containers.localstack.LocalStackContainer;
import org.testcontainers.utility.DockerImageName;
import se.hjulverkstan.Exceptions.*;
import se.hjulverkstan.main.dto.ImageUploadResponse;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.testcontainers.containers.localstack.LocalStackContainer.Service.S3;

class S3ServiceImplTest {

    private S3ServiceImpl s3Service;
    private static LocalStackContainer localStack;
    private static AmazonS3 amazonS3;
    private static final String BUCKET_NAME = "test-bucket";
    private static final String TEST_IMAGE_NAME = "test-image.jpg";
    private static final String TEST_IMAGE_CONTENT = "test image content";
    private static final String TEST_IMAGE_TYPE = "image/jpeg";

    @BeforeAll
    static void setupLocalStack() {
        localStack = new LocalStackContainer(DockerImageName.parse("localstack/localstack:2.3"))
                .withServices(S3);
        localStack.start();

        amazonS3 = AmazonS3ClientBuilder
                .standard()
                .withEndpointConfiguration(
                        new AwsClientBuilder.EndpointConfiguration(
                                localStack.getEndpointOverride(S3).toString(),
                                localStack.getRegion()
                        )
                )
                .withCredentials(
                        new AWSStaticCredentialsProvider(
                                new BasicAWSCredentials(localStack.getAccessKey(), localStack.getSecretKey())
                        )
                )
                .enablePathStyleAccess()
                .build();

        // Create test bucket
        amazonS3.createBucket(BUCKET_NAME);
    }

    @AfterAll
    static void tearDown() {
        if (localStack != null) {
            localStack.stop();
        }
    }

    @BeforeEach
    void setUp() {
        s3Service = new S3ServiceImpl(amazonS3);
        ReflectionTestUtils.setField(s3Service, "bucketName", BUCKET_NAME);

        // Clean up any existing objects in the bucket
        amazonS3.listObjects(BUCKET_NAME).getObjectSummaries().forEach(obj ->
                amazonS3.deleteObject(BUCKET_NAME, obj.getKey())
        );
    }

    @Test
    void uploadFile_ValidImage_ShouldSucceed() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                TEST_IMAGE_NAME,
                TEST_IMAGE_TYPE,
                TEST_IMAGE_CONTENT.getBytes()
        );

        // Act
        ImageUploadResponse response = s3Service.uploadFile(file);

        // Assert
        assertNotNull(response);
        assertTrue(response.getImageURL().contains(BUCKET_NAME));
        assertTrue(amazonS3.doesObjectExist(BUCKET_NAME,
                s3Service.extractKeyFromURL(response.getImageURL())));
    }

    @Test
    void uploadFile_EmptyFile_ShouldThrowException() {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file",
                "",
                TEST_IMAGE_TYPE,
                new byte[0]
        );

        // Act & Assert
        assertThrows(FileEmptyException.class, () -> s3Service.uploadFile(emptyFile));
    }

    @Test
    void uploadFile_UnsupportedFileType_ShouldThrowException() {
        // Arrange
        MockMultipartFile textFile = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "test content".getBytes()
        );

        // Act & Assert
        assertThrows(UnsupportedFileTypeException.class, () -> s3Service.uploadFile(textFile));
    }

    @Test
    void uploadFile_FileTooLarge_ShouldThrowException() {
        // Arrange
        byte[] largeContent = new byte[6 * 1024 * 1024]; // 6MB
        MockMultipartFile largeFile = new MockMultipartFile(
                "file",
                TEST_IMAGE_NAME,
                TEST_IMAGE_TYPE,
                largeContent
        );

        // Act & Assert
        assertThrows(FileTooLargeException.class, () -> s3Service.uploadFile(largeFile));
    }

    @Test
    void deleteFileByKey_ValidKey_ShouldSucceed() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                TEST_IMAGE_NAME,
                TEST_IMAGE_TYPE,
                TEST_IMAGE_CONTENT.getBytes()
        );
        ImageUploadResponse response = s3Service.uploadFile(file);
        String fileKey = s3Service.extractKeyFromURL(response.getImageURL());

        // Act
        s3Service.deleteFileByKey(fileKey);

        // Assert
        assertFalse(amazonS3.doesObjectExist(BUCKET_NAME, fileKey));
    }

    @Test
    void extractKeyFromURL_ValidURL_ShouldReturnKey() {
        // Arrange
        String url = "https://test-bucket.s3.amazonaws.com/test-uuid.jpg";
        String expectedKey = "test-uuid.jpg";

        // Act
        String actualKey = s3Service.extractKeyFromURL(url);

        // Assert
        assertEquals(expectedKey, actualKey);
    }

    @Test
    void extractKeyFromURL_URLWithQueryParams_ShouldReturnKey() {
        // Arrange
        String url = "https://test-bucket.s3.amazonaws.com/test-uuid.jpg?param=value";
        String expectedKey = "test-uuid.jpg";

        // Act
        String actualKey = s3Service.extractKeyFromURL(url);

        // Assert
        assertEquals(expectedKey, actualKey);
    }
}
