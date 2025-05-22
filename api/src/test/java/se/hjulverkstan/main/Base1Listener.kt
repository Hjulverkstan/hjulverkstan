package se.hjulverkstan.main

import io.kotest.core.spec.style.StringSpec
import io.kotest.extensions.spring.SpringExtension
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.PlatformTransactionManager
import se.hjulverkstan.main.annotations.IntegrationTest

@IntegrationTest
abstract class Base1Listener : StringSpec() {

    @Autowired
    lateinit var transactionManager: PlatformTransactionManager

    init {
        extension(SpringExtension)
        listener(TransactionalTestListener(transactionManager))
    }
}
