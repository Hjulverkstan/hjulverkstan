package se.hjulverkstan.main.service.webedit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import se.hjulverkstan.main.annotations.RepositoryTest;

@RepositoryTest
@Import(LocalisationService.class)
public class LocalisationServiceIT {

    @Autowired
    private LocalisationService localisationService;
}
