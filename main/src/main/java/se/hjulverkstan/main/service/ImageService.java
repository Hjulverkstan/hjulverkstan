package se.hjulverkstan.main.service;

public interface ImageService {
    void deleteSpecificS3URLFromAllEntities(String fileKey);
}
