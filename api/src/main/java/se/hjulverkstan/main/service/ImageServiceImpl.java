package se.hjulverkstan.main.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.Exceptions.InternalServerErrorException;
import se.hjulverkstan.main.repository.ImageRepository;

@Service
@Transactional
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;

    public ImageServiceImpl(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @Override
    public void deleteSpecificS3URLFromAllEntities(String fileKey) {
        try {
            imageRepository.deleteSpecificS3URLFromAllEntities(fileKey);
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to delete image URL from database: " + e.getMessage(), e);
        }
    }
}