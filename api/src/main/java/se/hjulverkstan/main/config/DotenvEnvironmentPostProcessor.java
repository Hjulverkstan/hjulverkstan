package se.hjulverkstan.main.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;

import java.nio.file.Paths;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String projectRootPath = Paths.get("").toAbsolutePath().toString()
                .replace("\\api", "")
                .replace("/api", "");

        Dotenv dotenv = Dotenv.configure()
                .directory(projectRootPath)
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        dotenv.entries()
                .stream()
                .filter(entry -> entry.getKey().startsWith("API"))
                .forEach(entry -> {
                    System.setProperty(entry.getKey(), entry.getValue());
                    System.out.println("Found environment variable: " + entry.getKey() + "=" + entry.getValue());
                });
    }
}