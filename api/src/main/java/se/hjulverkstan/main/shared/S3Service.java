package se.hjulverkstan.main.shared;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import se.hjulverkstan.main.error.exceptions.*;
import se.hjulverkstan.main.feature.image.ImageUploadResponse;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class S3Service {
    private final AmazonS3 amazonS3;
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif");
    private static final Tika TIKA = new Tika();

    @Value("${hjulverkstan.aws-s3.bucket-name}")
    private String bucketName;

    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
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

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        try (InputStream inputStream = file.getInputStream()) {
            PutObjectRequest putRequest = new PutObjectRequest(bucketName, uniqueFileName, inputStream, metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead);
            amazonS3.putObject(putRequest);

            return amazonS3.getUrl(bucketName, uniqueFileName).toString();
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
            DeleteObjectRequest deleteRequest = new DeleteObjectRequest(bucketName, key);
            amazonS3.deleteObject(deleteRequest);
        } catch (Exception e) {
            throw new S3DeleteException("Error deleting file from S3: " + e.getMessage());
        }
    }

    public void deleteFilesByKeys(List<String> keys) {
        try {
            DeleteObjectsRequest deleteObjectsRequest = new DeleteObjectsRequest(bucketName).withKeys(keys.toArray(new String[0]));
            amazonS3.deleteObjects(deleteObjectsRequest);
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
        ListObjectsV2Request request = new ListObjectsV2Request().withBucketName(bucketName);
        ListObjectsV2Result result = amazonS3.listObjectsV2(request);

        return result.getObjectSummaries().stream()
                .map(S3ObjectSummary::getKey)
                .collect(Collectors.toList());
    }
}
