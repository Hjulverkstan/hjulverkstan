package se.hjulverkstan.main.feature.image;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.InternalServerErrorException;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final ImageRepository imageRepository;

    @Transactional
    public void deleteSpecificS3URLFromAllEntities(String fileKey) {
        try {
            imageRepository.deleteSpecificS3URLFromAllEntities(fileKey);
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to delete image URL from database: " + e.getMessage(), e);
        }
    }
}