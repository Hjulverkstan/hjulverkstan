package se.hjulverkstan.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import se.hjulverkstan.main.annotations.RepositoryTest;
import se.hjulverkstan.main.security.services.AuthService;

@RepositoryTest
@Import(AuthService.class)
public class AuthServiceIT {

    @Autowired
    private AuthService authService;

}
