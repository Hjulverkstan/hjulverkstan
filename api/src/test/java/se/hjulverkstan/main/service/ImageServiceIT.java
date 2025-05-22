package se.hjulverkstan.main.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import se.hjulverkstan.main.annotations.RepositoryTest;

@RepositoryTest
@Import(ImageServiceImpl.class)
public class ImageServiceIT {

    @Autowired
    private ImageService imageService;

}
