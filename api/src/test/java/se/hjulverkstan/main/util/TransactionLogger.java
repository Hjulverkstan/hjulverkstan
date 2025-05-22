package se.hjulverkstan.main.util;

import jakarta.persistence.EntityManager;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.sql.Connection;

public class TransactionLogger {

    public static void printTxInfo(Logger logger, String label, EntityManager entityManager) {
        boolean active = TransactionSynchronizationManager.isActualTransactionActive();

        Connection connection = entityManager
                .unwrap(Session.class)
                .doReturningWork(conn -> conn.unwrap(Connection.class));

        logger.info("{} | TX active: {} | Connection: {}", label, active, connection.hashCode());
    }
}
