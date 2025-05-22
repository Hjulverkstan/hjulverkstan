package se.hjulverkstan.main.util;

import org.junit.jupiter.api.TestInstance;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import se.hjulverkstan.main.annotations.RepositoryTest;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.UUID;

@RepositoryTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Testcontainers
public abstract class AbstractSchemaIsolatedTest {

    @Container
    private static final PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:15")
                    .withDatabaseName("testdb")
                    .withUsername("test")
                    .withPassword("test")
                    .withReuse(true);

    private static final ThreadLocal<String> schemaName = ThreadLocal.withInitial(() ->
            "schema_" + UUID.randomUUID().toString().replace("-", "")
    );

    static {
        // ✅ Ensure the container is started before we try to read its properties
        postgres.start();
    }

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        String schema = schemaName.get();

        // Create schema manually
        try (Connection conn = DriverManager.getConnection(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
             Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE SCHEMA IF NOT EXISTS " + schema);
        } catch (SQLException e) {
            throw new RuntimeException("Failed to create schema: " + schema, e);
        }

        // Provide dynamic properties
        registry.add("spring.datasource.url", () -> postgres.getJdbcUrl() + "?currentSchema=" + schema);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.properties.hibernate.default_schema", () -> schema);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create");
    }
}

