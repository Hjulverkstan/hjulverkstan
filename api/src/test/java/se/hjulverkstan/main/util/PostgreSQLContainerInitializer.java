package se.hjulverkstan.main.util;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.*;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import se.hjulverkstan.main.annotations.RepositoryTest;

@Slf4j
@Testcontainers
@RepositoryTest
@ActiveProfiles("postgres") // Keep this
//@DirtiesContext // Keep this to ensure context cleanup
public abstract class PostgreSQLContainerInitializer {

    @Container
    public static final PostgreSQLContainer<?> POSTGRES_CONTAINER = new PostgreSQLContainer<>("postgres:15.2")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass")
            .withReuse(true);

    @DynamicPropertySource
    public static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES_CONTAINER::getUsername);
        registry.add("spring.datasource.password", POSTGRES_CONTAINER::getPassword);
        registry.add("spring.datasource.driver-class-name", POSTGRES_CONTAINER::getDriverClassName);
    }

}

/*@Slf4j
@Testcontainers
public abstract class PostgreSQLContainerInitializer {

    @Container
    public static final PostgreSQLContainer<?> POSTGRES_CONTAINER = new PostgreSQLContainer<>("postgres:15.2")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass")
            .withReuse(true);

    @DynamicPropertySource
    public static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES_CONTAINER::getUsername);
        registry.add("spring.datasource.password", POSTGRES_CONTAINER::getPassword);
        registry.add("spring.datasource.driver-class-name", POSTGRES_CONTAINER::getDriverClassName);
    }

}*/

/*
@Slf4j
public class PostgreSQLContainerInitializer implements BeforeAllCallback, ExtensionContext.Store.CloseableResource {
*/



    /*private static PostgreSQLContainer<?> POSTGRES_CONTAINER =
            new PostgreSQLContainer<>("postgres:15.2");

    @Override
    public void beforeAll(ExtensionContext context) throws Exception {
        log.info("PostgreSQL Testcontainer initializer started.");

        if (POSTGRES_CONTAINER == null) {
            POSTGRES_CONTAINER = new PostgreSQLContainer<>("postgres:15")
                    .withDatabaseName("testdb")
                    .withUsername("user")
                    .withPassword("pass");
            POSTGRES_CONTAINER.start();

            // Set system properties so Spring or your app can pick them up
            System.setProperty("spring.datasource.url", POSTGRES_CONTAINER.getJdbcUrl());
            System.setProperty("spring.datasource.username", POSTGRES_CONTAINER.getUsername());
            System.setProperty("spring.datasource.password", POSTGRES_CONTAINER.getPassword());

            // Register this instance for shutdown after all tests
            context.getRoot().getStore(ExtensionContext.Namespace.GLOBAL).put("POSTGRES_CONTAINER", this);

            log.info("PostgreSQL Testcontainer started.");
            log.info("JDBC URL: {}", POSTGRES_CONTAINER.getJdbcUrl());
            log.info("Username: {}", POSTGRES_CONTAINER.getUsername());
            log.info("Driver: {}", POSTGRES_CONTAINER.getDriverClassName());
        }
    }*/

    /*@Override
    public void close() throws Throwable {
        if (POSTGRES_CONTAINER != null) {
            POSTGRES_CONTAINER.stop();
            POSTGRES_CONTAINER = null;
        }
    }*/


/*
@Slf4j
public class PostgreSQLContainerInitializer implements BeforeAllCallback, ExtensionContext.Store.CloseableResource {
*/



    /*private static PostgreSQLContainer<?> POSTGRES_CONTAINER =
            new PostgreSQLContainer<>("postgres:15.2");

    @Override
    public void beforeAll(ExtensionContext context) throws Exception {
        log.info("PostgreSQL Testcontainer initializer started.");

        if (POSTGRES_CONTAINER == null) {
            POSTGRES_CONTAINER = new PostgreSQLContainer<>("postgres:15")
                    .withDatabaseName("testdb")
                    .withUsername("user")
                    .withPassword("pass");
            POSTGRES_CONTAINER.start();

            // Set system properties so Spring or your app can pick them up
            System.setProperty("spring.datasource.url", POSTGRES_CONTAINER.getJdbcUrl());
            System.setProperty("spring.datasource.username", POSTGRES_CONTAINER.getUsername());
            System.setProperty("spring.datasource.password", POSTGRES_CONTAINER.getPassword());

            // Register this instance for shutdown after all tests
            context.getRoot().getStore(ExtensionContext.Namespace.GLOBAL).put("POSTGRES_CONTAINER", this);

            log.info("PostgreSQL Testcontainer started.");
            log.info("JDBC URL: {}", POSTGRES_CONTAINER.getJdbcUrl());
            log.info("Username: {}", POSTGRES_CONTAINER.getUsername());
            log.info("Driver: {}", POSTGRES_CONTAINER.getDriverClassName());
        }
    }*/

    /*@Override
    public void close() throws Throwable {
        if (POSTGRES_CONTAINER != null) {
            POSTGRES_CONTAINER.stop();
            POSTGRES_CONTAINER = null;
        }
    }*/
