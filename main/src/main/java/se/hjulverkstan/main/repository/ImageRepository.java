package se.hjulverkstan.main.repository;

import java.util.List;

public interface ImageRepository {
    void deleteSpecificS3URLFromAllEntities(String fileKey);
    List<String> getAllUsedS3URLs();
}
