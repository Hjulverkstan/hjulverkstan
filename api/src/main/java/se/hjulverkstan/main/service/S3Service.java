package se.hjulverkstan.main.service;

import org.springframework.web.multipart.MultipartFile;
import se.hjulverkstan.main.dto.ImageUploadResponse;

import java.util.List;

public interface S3Service {
    ImageUploadResponse uploadFile(MultipartFile file);

    String extractKeyFromURL(String url);
    void deleteFileByKey(String key);
    void deleteFilesByKeys(List<String> keys);

    List<String> getAllImageKeys();
}
