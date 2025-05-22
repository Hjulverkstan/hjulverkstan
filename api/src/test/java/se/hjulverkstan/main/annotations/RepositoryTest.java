package se.hjulverkstan.main.annotations;

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import se.hjulverkstan.main.util.SchemaPerTestInitializer;
import se.hjulverkstan.main.util.TestJpaConfig;

import java.lang.annotation.*;

import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles({"test", "postgres"})
//@Sql(scripts = "classpath:clean.sql", executionPhase = AFTER_TEST_CLASS)
@Import(TestJpaConfig.class)
// @DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
// @ContextConfiguration(initializers = SchemaPerTestInitializer.class)
public @interface RepositoryTest {
}