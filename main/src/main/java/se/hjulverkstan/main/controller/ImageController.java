package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import se.hjulverkstan.main.dto.ImageUploadResponse;
import se.hjulverkstan.main.service.S3Service;

@RestController
@RequestMapping("/v1/image")
public class ImageController {

    private final S3Service s3Service;

    public ImageController(S3Service s3service) {
        this.s3Service = s3service;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        return new ResponseEntity<>(s3Service.uploadFile(file), HttpStatus.OK);
    }
}