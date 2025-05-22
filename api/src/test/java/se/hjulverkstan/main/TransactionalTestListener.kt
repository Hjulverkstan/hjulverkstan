package se.hjulverkstan.main

import io.kotest.core.listeners.TestListener
import io.kotest.core.test.TestCase
import io.kotest.core.test.TestResult
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.TransactionStatus
import org.springframework.transaction.support.DefaultTransactionDefinition


class TransactionalTestListener(
    private val transactionManager: PlatformTransactionManager
) : TestListener {

    private lateinit var txStatus: TransactionStatus

    override suspend fun beforeTest(testCase: TestCase) {
        txStatus = transactionManager.getTransaction(DefaultTransactionDefinition())
    }

    override suspend fun afterTest(testCase: TestCase, result: TestResult) {
        if (::txStatus.isInitialized && !txStatus.isCompleted) {
            transactionManager.rollback(txStatus)
        }
    }
}
