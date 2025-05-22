package se.hjulverkstan.main

import io.kotest.core.spec.style.AnnotationSpec
import io.kotest.extensions.spring.SpringExtension
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.support.TransactionSynchronizationManager
import se.hjulverkstan.main.annotations.IntegrationTest
import se.hjulverkstan.main.repository.LocationRepository

@Sql("classpath:script/location.sql")
@IntegrationTest
@Transactional
open class KotlinTest3 : AnnotationSpec() {

    @Autowired
    lateinit var testService: TestService;

    @Autowired
    lateinit var locationRepository: LocationRepository;

    @Test
    fun `first test`() {
        var list = locationRepository.findAll();
        list.size shouldBe 3

        testService.createLocation();

        list = locationRepository.findAll();
        list.size shouldBe 4
    }

    @Test
    fun `second test`() {
        var list = locationRepository.findAll();
        list.size shouldBe 3

        testService.createLocation();

        list = locationRepository.findAll();
        list.size shouldBe 4
    }

    @Test
    fun `third test`() {
        var list = locationRepository.findAll();
        list.size shouldBe 3

        testService.createLocation();

        list = locationRepository.findAll();
        list.size shouldBe 4
    }

    override fun extensions() = listOf(SpringExtension)
}