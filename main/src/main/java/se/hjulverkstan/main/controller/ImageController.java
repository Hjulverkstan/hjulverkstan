package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import se.hjulverkstan.main.dto.ImageUploadResponse;
import se.hjulverkstan.main.service.ImageService;
import se.hjulverkstan.main.service.S3Service;

@RestController
@RequestMapping("/v1/image")
@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
public class ImageController {

    private final S3Service s3Service;
    private final ImageService imageService;

    public ImageController(S3Service s3Service, ImageService imageService) {
        this.s3Service = s3Service;
        this.imageService = imageService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        return new ResponseEntity<>(s3Service.uploadFile(file), HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public HttpStatus deleteImage(@RequestParam("imageURL") String imageURL) {
        String fileKey = s3Service.extractKeyFromURL(imageURL);
        s3Service.deleteFileByKey(fileKey);
        imageService.deleteSpecificS3URLFromAllEntities(fileKey);
        return HttpStatus.OK;
    }
}