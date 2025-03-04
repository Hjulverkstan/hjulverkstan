package se.hjulverkstan.main.service;

import org.springframework.web.multipart.MultipartFile;
import se.hjulverkstan.main.dto.ImageUploadResponse;

public interface S3Service {

    ImageUploadResponse uploadFile(MultipartFile file);

    String extractKeyFromURL(String url);
    void deleteFileByKey(String key);

}
