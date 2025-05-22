package se.hjulverkstan.main

import io.kotest.core.spec.IsolationMode
import io.kotest.core.spec.style.StringSpec
import io.kotest.extensions.spring.SpringExtension
import io.kotest.matchers.shouldBe
import jakarta.persistence.EntityManagerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Bean
import org.springframework.core.io.ClassPathResource
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.datasource.DataSourceUtils
import org.springframework.jdbc.datasource.init.ScriptUtils
import org.springframework.orm.jpa.JpaTransactionManager
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.TransactionDefinition
import org.springframework.transaction.TransactionStatus
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.interceptor.TransactionAspectSupport
import org.springframework.transaction.support.DefaultTransactionDefinition
import org.springframework.transaction.support.TransactionSynchronizationManager
import se.hjulverkstan.main.annotations.IntegrationTest
import se.hjulverkstan.main.extensions.TransactionalSqlScriptListener
import se.hjulverkstan.main.repository.LocationRepository
import java.util.Date

class KotlinTest2 : Base2() {

    @Autowired
    lateinit var locationRepository: LocationRepository

    @Autowired
    lateinit var testService: TestService

    init {
        "1st should find user inserted by @Sql" {
            var list = locationRepository.findAll();
            list.size shouldBe 3

            testService.createLocation();

            list = locationRepository.findAll();
            list.size shouldBe 4
            println("thread id: ${Thread.currentThread().name}, transaction active: ${TransactionSynchronizationManager.isActualTransactionActive()}")
        }

        "2nd should find user inserted by @Sql" {
            var list = locationRepository.findAll();
            list.size shouldBe 3

            testService.createLocation();

            list = locationRepository.findAll();
            list.size shouldBe 4
            println("thread id: ${Thread.currentThread().name}, transaction active: ${TransactionSynchronizationManager.isActualTransactionActive()}")
        }

        "3rd should find user inserted by @Sql" {
            var list = locationRepository.findAll();
            list.size shouldBe 3

            testService.createLocation();

            list = locationRepository.findAll();
            list.size shouldBe 4
            println("thread id: ${Thread.currentThread().name}, transaction active: ${TransactionSynchronizationManager.isActualTransactionActive()}")
        }
    }
}