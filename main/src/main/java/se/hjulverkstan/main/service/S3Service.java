package se.hjulverkstan.main.service;

import org.springframework.web.multipart.MultipartFile;
import se.hjulverkstan.main.dto.ImageUploadResponse;

public interface S3Service {

    ImageUploadResponse uploadFile(MultipartFile file);

    void deleteFileByKey(String key);

    String extractKeyFromURL(String URL);

}
