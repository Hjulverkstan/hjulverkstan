package se.hjulverkstan.main
import io.kotest.core.spec.style.StringSpec
import io.kotest.extensions.spring.SpringExtension
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.TransactionStatus
import org.springframework.transaction.support.DefaultTransactionDefinition
import org.springframework.transaction.support.TransactionSynchronizationManager
import se.hjulverkstan.main.annotations.IntegrationTest
import se.hjulverkstan.main.repository.LocationRepository

@Sql("classpath:script/location.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS) // Run SQL before each test
class KotlinTest1: Base1CallBack() {

    @Autowired
    lateinit var locationRepository: LocationRepository;

    @Autowired
    lateinit var testService: TestService;

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