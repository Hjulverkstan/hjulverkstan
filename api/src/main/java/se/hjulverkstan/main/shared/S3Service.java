package se.hjulverkstan.main.shared;

import org.springframework.beans.factory.annotation.Autowired;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import se.hjulverkstan.main.error.exceptions.*;
import software.amazon.awssdk.services.s3.model.*;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class S3Service {
    private final S3Client s3Client ;
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif");
    private static final Tika TIKA = new Tika();

    @Value("${hjulverkstan.aws-s3.bucket-name}")
    private String bucketName;

    @Autowired
    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Uploads a file to S3 and returns a public URL for the uploaded image.
     *
     * @param file the image file to upload
     * @return The public URL
     */
    public String uploadFile(MultipartFile file) {
        validateFile(file);

        String uniqueFileName = generateUniqueFileName(file);

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(uniqueFileName)
                    .contentType(file.getContentType())
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return String.format("https://%s.s3.amazonaws.com/%s", bucketName, uniqueFileName);
        } catch (IOException e) {
            throw new FileProcessingException("Error processing file: " + e.getMessage());
        } catch (SdkClientException e) {
            throw new S3UploadException("Failed to upload file to S3: " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileEmptyException("File is empty or missing");
        }

        long maxFileSize = 10 * 1024 * 1024; // 5 MB
        if (file.getSize() > maxFileSize) {
            throw new FileTooLargeException("File size exceeds the maximum allowed limit (10 MB)");
        }

        String fileMimeType = file.getContentType();
        if (fileMimeType == null || !ALLOWED_MIME_TYPES.contains(fileMimeType)) {
            throw new UnsupportedFileTypeException("Unsupported file type: " + fileMimeType);
        }

        try (InputStream is = new BufferedInputStream(file.getInputStream())) {
            String detectedType = TIKA.detect(is);
            if (!ALLOWED_MIME_TYPES.contains(detectedType)) {
                throw new FileContentMismatchException("File content does not match allowed types. Detected: " + detectedType);
            }
        } catch (IOException e) {
            throw new FileProcessingException("Failed to read file for validation: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private String generateUniqueFileName(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + extension;
    }

    public String extractKeyFromURL(String URL) {
        String keyWithParams = URL.substring(URL.lastIndexOf("/") + 1);
        int queryIndex = keyWithParams.indexOf("?");
        String fileKey = queryIndex != -1 ? keyWithParams.substring(0, queryIndex) : keyWithParams;
        return fileKey;
    }

    public void deleteFileByKey(String key) {
        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                            .bucket(bucketName)
                                    .key(key).build();
            s3Client.deleteObject(deleteRequest);
        } catch (Exception e) {
            throw new S3DeleteException("Error deleting file from S3: " + e.getMessage());
        }
    }

    public void deleteFilesByKeys(List<String> keys) {
        try {

            List<ObjectIdentifier> identifiers = keys.stream()
                    .map(key -> ObjectIdentifier.builder().key(key).build())
                    .collect(Collectors.toList());

            DeleteObjectsRequest deleteRequest = DeleteObjectsRequest
                    .builder()
                    .bucket(bucketName)
                    .delete(Delete.builder().objects(identifiers).build())
                    .build();
            s3Client.deleteObjects(deleteRequest);
        } catch (Exception e) {
            throw new S3DeleteException("Error deleting files from S3: " + e.getMessage());
        }
    }

    /**
     * Retrieves all imageKeys (file names) stored in the S3 bucket.
     *
     * This method sends a request to list all objects in the specified S3 bucket
     * and extracts their unique file keys. These keys represent the stored files
     * without the full S3 URL.
     *
     * @return A List of Strings containing the file keys of all objects in the bucket.
     */
    public List<String> getAllImageKeys() {
        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build();

        ListObjectsV2Response result = s3Client.listObjectsV2(request);

        return result.contents().stream()
                .map(S3Object::key)
                .collect(Collectors.toList());
    }
}
