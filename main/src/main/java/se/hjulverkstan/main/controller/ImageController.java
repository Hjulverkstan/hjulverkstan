package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import se.hjulverkstan.main.dto.ImageDeleteResponse;
import se.hjulverkstan.main.dto.ImageUploadResponse;
import se.hjulverkstan.main.repository.ImageRepository;
import se.hjulverkstan.main.service.S3Service;

@RestController
@RequestMapping("/v1/image")
public class ImageController {

    private final S3Service s3Service;
    private final ImageRepository imageRepository;

    public ImageController(S3Service s3service, ImageRepository imageRepository) {
        this.s3Service = s3service;
        this.imageRepository = imageRepository;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        return new ResponseEntity<>(s3Service.uploadFile(file), HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ImageDeleteResponse> deleteImage(@RequestParam("imageURL") String imageURL) {
        try {
            String fileKey = s3Service.extractKeyFromURL(imageURL);
            s3Service.deleteFileByKey(fileKey);
            return new ResponseEntity<>(new ImageDeleteResponse("Image deleted successfully."), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ImageDeleteResponse("Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}