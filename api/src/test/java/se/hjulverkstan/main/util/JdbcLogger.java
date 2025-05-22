package se.hjulverkstan.main.util;

import org.slf4j.Logger;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class JdbcLogger {

    private final Logger logger;
    private final DataSource dataSource;

    public JdbcLogger(Logger logger, DataSource dataSource) {
        this.logger = logger;
        this.dataSource = dataSource;
    }

    public String logJdbcUrl() {
        try (Connection conn = dataSource.getConnection()) {
            String jdbcUrl = conn.getMetaData().getURL();
            logger.info("PostgreSQL Testcontainers JDBC URL: {}", jdbcUrl);
            return jdbcUrl;
        } catch (SQLException e) {
            logger.error("Failed to retrieve JDBC URL", e);
            throw new RuntimeException("Could not read JDBC URL", e);
        }
    }
}

