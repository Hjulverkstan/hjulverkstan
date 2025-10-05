package se.hjulverkstan.main.feature.image;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import se.hjulverkstan.main.shared.S3Service;

@RestController
@RequestMapping("v1/api/image")
@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
@RequiredArgsConstructor
public class ImageController {
    private final S3Service s3Service;
    private final ImageService imageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ImageUploadResponse uploadImage(@RequestParam("file") MultipartFile file) {
        String imageURL = s3Service.uploadFile(file);
        return new ImageUploadResponse(imageURL);
    }

    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteImage(@RequestParam("imageURL") String imageURL) {
        String fileKey = s3Service.extractKeyFromURL(imageURL);

        s3Service.deleteFileByKey(fileKey);
        imageService.deleteSpecificS3URLFromAllEntities(fileKey);
    }
}