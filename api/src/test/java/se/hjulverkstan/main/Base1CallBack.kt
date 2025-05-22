package se.hjulverkstan.main

import io.kotest.core.spec.style.StringSpec
import io.kotest.extensions.spring.SpringExtension
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.TransactionStatus
import org.springframework.transaction.support.DefaultTransactionDefinition
import org.springframework.transaction.support.TransactionSynchronizationManager
import se.hjulverkstan.main.annotations.IntegrationTest

@IntegrationTest
abstract class Base1CallBack : StringSpec() {

    @Autowired
    lateinit var transactionManager: PlatformTransactionManager

    protected lateinit var txStatus: TransactionStatus

    init {
        extension(SpringExtension)

        beforeTest {
            txStatus = transactionManager.getTransaction(DefaultTransactionDefinition())
        }

        afterTest { (test, result) ->
            if (::txStatus.isInitialized && !txStatus.isCompleted) {
                transactionManager.rollback(txStatus)
                println("Transaction rolled back")
            }
        }
    }
}
