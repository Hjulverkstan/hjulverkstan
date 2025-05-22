package se.hjulverkstan.main.util;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.support.TestPropertySourceUtils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.UUID;

public class SchemaPerTestInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    public static final String SCHEMA_PROPERTY_KEY = "dynamic.schema.name";

    @Override
    public void initialize(ConfigurableApplicationContext context) {
        String schemaName = "schema_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);

        // Inject the schema into Spring's Environment
        TestPropertySourceUtils.addInlinedPropertiesToEnvironment(
                context,
                "spring.datasource.url=jdbc:tc:postgresql:17.5-alpine:///testdb?currentSchema=" + schemaName,
                "spring.jpa.properties.hibernate.default_schema=" + schemaName,
                SCHEMA_PROPERTY_KEY + "=" + schemaName
        );

        // Create schema before Hibernate or scripts run
        try (Connection conn = DriverManager.getConnection("jdbc:tc:postgresql:17.5-alpine:///testdb")) {
            try (Statement stmt = conn.createStatement()) {
                stmt.execute("CREATE SCHEMA IF NOT EXISTS " + schemaName);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to create schema: " + schemaName, e);
        }
    }
}
