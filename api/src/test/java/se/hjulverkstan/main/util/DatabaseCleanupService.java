package se.hjulverkstan.main.util;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Table;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.test.context.TestConfiguration;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
// @TestConfiguration
public class DatabaseCleanupService {

    private final EntityManager entityManager;
    private List<String> tableNames;

    public DatabaseCleanupService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @PostConstruct
    public void init() {
        tableNames = entityManager.getMetamodel().getEntities().stream()
                .filter(entityType -> entityType.getJavaType().isAnnotationPresent(Table.class))
                .map(entityType -> {
                    Table table = entityType.getJavaType().getAnnotation(Table.class);
                    return table.name();
                })
                .collect(Collectors.toList());

        log.info("Detected tables for truncation: {}", tableNames);
    }

    @Transactional
    public void truncate() {
        entityManager.flush();
        entityManager.clear();

        if (tableNames == null || tableNames.isEmpty()) {
            throw new IllegalStateException("No table names found. Check entity annotations or metamodel.");
        }

        log.info("Disabling FK checks...");
        entityManager.createNativeQuery("SET session_replication_role = replica").executeUpdate();

        for (String tableName : tableNames) {
            try {
                log.debug("Truncating table: {}", tableName);
                entityManager.createNativeQuery("TRUNCATE TABLE " + tableName + " CASCADE").executeUpdate();
            } catch (Exception e) {
                log.warn("Failed to truncate table: {}", tableName, e);
            }
        }

        log.info("Re-enabling FK checks...");
        entityManager.createNativeQuery("SET session_replication_role = DEFAULT").executeUpdate();
    }
}