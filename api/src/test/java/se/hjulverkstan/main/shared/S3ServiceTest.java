package se.hjulverkstan.main.shared;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;
import se.hjulverkstan.main.error.exceptions.*;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class S3ServiceTest {

    @Mock
    private S3Client s3Client;

    @InjectMocks
    private S3Service s3Service;

    private static final String BUCKET = "test-bucket";
    private static final byte[] VALID_PNG = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0};

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(s3Service, "bucketName", BUCKET);
    }

    @Test
    @DisplayName("Should upload valid PNG file successfully")
    void shouldUploadFile_Successfully() {
        // Arrange
        String originalName = "my.photo.png";
        MockMultipartFile file = new MockMultipartFile("file", originalName, "image/png", VALID_PNG);

        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class))).thenReturn(PutObjectResponse.builder().build());

        // Act
        String result = s3Service.uploadFile(file);

        // Assert
        assertNotNull(result);
        assertTrue(result.endsWith(".png"));
        
        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(requestCaptor.capture(), any(RequestBody.class));
        
        PutObjectRequest captured = requestCaptor.getValue();
        assertEquals(BUCKET, captured.bucket());
        assertTrue(captured.key().startsWith("images/"));
        assertTrue(captured.key().endsWith(".png"));
        assertEquals("image/png", captured.contentType());
    }

    @Test
    @DisplayName("Spoofing: Should throw ContentMismatch when PNG extension has text content")
    void shouldThrowContentMismatch_whenSpoofed() {
        // Arrange
        byte[] fakeContent = "<?php echo 'malicious'; ?>".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "image.png", "image/png", fakeContent);

        // Act & Assert
        assertThrows(FileContentMismatchException.class, () -> s3Service.uploadFile(file));
        verify(s3Client, never()).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }

    @Test
    @DisplayName("Boundary: Should accept file of exactly 10MB")
    void shouldAcceptFile_exactly10MB() {
        // Arrange
        byte[] largeContent = new byte[10 * 1024 * 1024];
        System.arraycopy(VALID_PNG, 0, largeContent, 0, VALID_PNG.length);
        MockMultipartFile file = new MockMultipartFile("file", "large.png", "image/png", largeContent);

        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class))).thenReturn(PutObjectResponse.builder().build());

        // Act & Assert
        assertDoesNotThrow(() -> s3Service.uploadFile(file));
    }

    @Test
    @DisplayName("Boundary: Should reject file of 10MB + 1 byte")
    void shouldRejectFile_justOver10MB() {
        // Arrange
        byte[] tooLargeContent = new byte[10 * 1024 * 1024 + 1];
        MockMultipartFile file = new MockMultipartFile("file", "toobig.png", "image/png", tooLargeContent);

        // Act & Assert
        assertThrows(FileTooLargeException.class, () -> s3Service.uploadFile(file));
    }

    @Test
    @DisplayName("Validation: Should throw FileEmpty when file is null or empty")
    void shouldThrowFileEmpty_whenEmpty() {
        assertThrows(FileEmptyException.class, () -> s3Service.uploadFile(null));
        assertThrows(FileEmptyException.class, () -> s3Service.uploadFile(new MockMultipartFile("file", new byte[0])));
    }

    @Test
    @DisplayName("Validation: Should throw UnsupportedFileType for PDFs")
    void shouldThrowUnsupportedFileType_whenInvalidMime() {
        MockMultipartFile file = new MockMultipartFile("file", "doc.pdf", "application/pdf", new byte[]{1,2,3});
        assertThrows(UnsupportedFileTypeException.class, () -> s3Service.uploadFile(file));
    }

    @Test
    @DisplayName("Naming: Should handle filenames with multiple dots")
    void shouldPreserveExtension_withMultipleDots() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile("file", "archive.old.v1.jpg", "image/jpeg", VALID_PNG);
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class))).thenReturn(PutObjectResponse.builder().build());

        // Act
        String result = s3Service.uploadFile(file);

        // Assert
        assertTrue(result.endsWith(".jpg"));
    }

    @Test
    @DisplayName("Delete: Should call s3Client for single file deletion")
    void shouldDeleteSingleFile() {
        // Act
        s3Service.deleteFileByKey("images/my-key.png");

        // Assert
        ArgumentCaptor<DeleteObjectRequest> captor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(captor.capture());
        assertEquals(BUCKET, captor.getValue().bucket());
        assertEquals("images/my-key.png", captor.getValue().key());
    }

    @Test
    @DisplayName("Bulk Delete: Should call s3Client with multiple identifiers")
    void shouldDeleteMultipleFiles() {
        // Arrange
        List<String> keys = Arrays.asList("k1", "k2");

        // Act
        s3Service.deleteFilesByKeys(keys);

        // Assert
        ArgumentCaptor<DeleteObjectsRequest> captor = ArgumentCaptor.forClass(DeleteObjectsRequest.class);
        verify(s3Client).deleteObjects(captor.capture());
        
        DeleteObjectsRequest request = captor.getValue();
        assertEquals(BUCKET, request.bucket());
        assertEquals(2, request.delete().objects().size());
        assertEquals("k1", request.delete().objects().get(0).key());
        assertEquals("k2", request.delete().objects().get(1).key());
    }

    @Test
    @DisplayName("Retrieval: Should return all image keys from bucket")
    void shouldReturnAllKeys() {
        // Arrange
        S3Object obj1 = S3Object.builder().key("img1.png").build();
        S3Object obj2 = S3Object.builder().key("img2.jpg").build();
        ListObjectsV2Response response = ListObjectsV2Response.builder()
                .contents(Arrays.asList(obj1, obj2))
                .build();
        
        when(s3Client.listObjectsV2(any(ListObjectsV2Request.class))).thenReturn(response);

        // Act
        List<String> result = s3Service.getAllImageKeys();

        // Assert
        assertEquals(2, result.size());
        assertTrue(result.contains("img1.png"));
        assertTrue(result.contains("img2.jpg"));
    }

    @Test
    @DisplayName("Error Handling: Should wrap IO fail in FileProcessingException during validation")
    void shouldWrapIOException_Validation() throws IOException {
        // Arrange
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(false);
        when(file.getSize()).thenReturn(100L);
        when(file.getContentType()).thenReturn("image/png");
        when(file.getInputStream()).thenThrow(new IOException("Disk Failure during validation"));

        // Act & Assert
        assertThrows(FileProcessingException.class, () -> s3Service.uploadFile(file));
    }

    @Test
    @DisplayName("Error Handling: Should wrap IOException in uploadFile (second stream call for body)")
    void shouldWrapIOException_InUploadBody() throws IOException {
        // Arrange
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(false);
        when(file.getSize()).thenReturn(100L);
        when(file.getContentType()).thenReturn("image/png");
        when(file.getOriginalFilename()).thenReturn("test.png");
        
        // First call for validation succeeds, second call for upload core logic fails
        when(file.getInputStream())
            .thenReturn(new java.io.ByteArrayInputStream(VALID_PNG))
            .thenThrow(new IOException("Body stream fail"));

        // Act & Assert
        assertThrows(FileProcessingException.class, () -> s3Service.uploadFile(file));
    }

    @Test
    @DisplayName("Error Handling: Should wrap SdkClientException in S3UploadException")
    void shouldWrapS3UploadException() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile("file", "img.png", "image/png", VALID_PNG);
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class))).thenThrow(SdkClientException.builder().message("AWS Fail").build());

        // Act & Assert
        assertThrows(S3UploadException.class, () -> s3Service.uploadFile(file));
    }

    @Test
    @DisplayName("Error Handling: Should wrap generic exception in S3DeleteException")
    void shouldWrapS3DeleteException() {
        // Arrange
        doThrow(new RuntimeException("Crash")).when(s3Client).deleteObject(any(DeleteObjectRequest.class));

        // Act & Assert
        assertThrows(S3DeleteException.class, () -> s3Service.deleteFileByKey("key"));
    }

    @Test
    @DisplayName("Error Handling: Should wrap generic exception in S3DeleteException for bulk delete")
    void shouldWrapS3DeleteException_Bulk() {
        // Arrange
        doThrow(new RuntimeException("Crash")).when(s3Client).deleteObjects(any(DeleteObjectsRequest.class));

        // Act & Assert
        assertThrows(S3DeleteException.class, () -> s3Service.deleteFilesByKeys(Arrays.asList("k1")));
    }
}
