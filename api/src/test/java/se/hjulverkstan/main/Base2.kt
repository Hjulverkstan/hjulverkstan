package se.hjulverkstan.main

import io.kotest.core.spec.style.StringSpec
import io.kotest.extensions.spring.SpringExtension
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.transaction.PlatformTransactionManager
import se.hjulverkstan.main.annotations.IntegrationTest
import se.hjulverkstan.main.extensions.TransactionalSqlScriptListener

@IntegrationTest
abstract class Base2 : StringSpec() {

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var transactionManager: PlatformTransactionManager

    init {
        extension(SpringExtension) // ensures Spring injects @Autowired properties

        beforeSpec {
            listener(TransactionalSqlScriptListener(jdbcTemplate, transactionManager))
        }
    }
}

