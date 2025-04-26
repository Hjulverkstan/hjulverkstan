package se.hjulverkstan.main.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;

import java.nio.file.Paths;

public class DotenvApplicationContextInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    /**
     * The point of this context initializer is to add support for loading environment variables from a file. This
     * because except for running a springboot runner in IntelliJ Ultimate or running maven/.jar from bash with an .env
     * file sourced, the application will not find the environment variables. How do you configure maven in intellij to
     * use environment variables from a file? Not possible!
     *
     * Enter the use of Dotenv. We read all environment variables included those declared by the projects .env file,
     * filters based on the prefix "API_" and then adds them before the spring context starts. This way, as long .env
     * file is populated in the project root, all instances of running the application, install, test etc work as
     * intended.
     *
     * It seems a bit unorthodox in Java but the value of decoupling environment related values from the application and
     * unifying the approach across backend/frontend and production and local development is not lacking in other
     * programming languages, especially in the days of containerization.
     *
     * @param applicationContext
     */
    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        String projectRootPath = Paths.get("").toAbsolutePath().toString()
                .replace("\\api", "")
                .replace("/api", "");

        System.out.println("Importing env vars from path: " + projectRootPath);

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