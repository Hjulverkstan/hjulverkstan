package se.hjulverkstan.main.extensions

import io.kotest.core.listeners.TestListener
import io.kotest.core.test.TestCase
import io.kotest.core.test.TestResult
import org.springframework.core.io.ClassPathResource
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.datasource.DataSourceUtils
import org.springframework.jdbc.datasource.init.ScriptUtils
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.TransactionDefinition
import org.springframework.transaction.TransactionStatus
import org.springframework.transaction.support.DefaultTransactionDefinition

class TransactionalSqlScriptListener(
    private val jdbcTemplate: JdbcTemplate,
    private val transactionManager: PlatformTransactionManager
) : TestListener {

    private lateinit var txStatus: TransactionStatus

    override suspend fun beforeTest(testCase: TestCase) {
        val def = DefaultTransactionDefinition().apply {
            propagationBehavior = TransactionDefinition.PROPAGATION_REQUIRED
        }

        txStatus = transactionManager.getTransaction(def)

        val conn = DataSourceUtils.getConnection(jdbcTemplate.dataSource!!)
        try {
            ScriptUtils.executeSqlScript(conn, ClassPathResource("script/location.sql"))
        } finally {
            DataSourceUtils.releaseConnection(conn, jdbcTemplate.dataSource!!)
        }
    }

    override suspend fun afterTest(testCase: TestCase, result: TestResult) {
        if (::txStatus.isInitialized && !txStatus.isCompleted) {
            transactionManager.rollback(txStatus)
        }
    }
}