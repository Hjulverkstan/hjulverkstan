package se.hjulverkstan.main;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import se.hjulverkstan.main.config.DotenvApplicationContextInitializer;

@SpringBootTest
@ContextConfiguration(initializers = DotenvApplicationContextInitializer.class)
class MainApplicationTests {
	@Test
	void contextLoads() {
	}

}
