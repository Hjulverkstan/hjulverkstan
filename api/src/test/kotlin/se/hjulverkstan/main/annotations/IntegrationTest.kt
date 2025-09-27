package se.hjulverkstan.main.annotations

import org.junit.jupiter.api.TestInstance
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles;
import se.hjulverkstan.main.MainApplication;
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.annotation.Transactional

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = [MainApplication::class]
)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles(profiles = ["test"])
@AutoConfigureWebTestClient
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
annotation class IntegrationTest