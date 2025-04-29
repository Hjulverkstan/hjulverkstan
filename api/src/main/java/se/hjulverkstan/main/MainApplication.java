package se.hjulverkstan.main;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import se.hjulverkstan.main.config.DotenvApplicationContextInitializer;

@SpringBootApplication
public class MainApplication {
	public static void main(String[] args) {
		SpringApplication application = new SpringApplication(MainApplication.class);

		application.addInitializers(new DotenvApplicationContextInitializer());
		application.run(args);
	}
}
