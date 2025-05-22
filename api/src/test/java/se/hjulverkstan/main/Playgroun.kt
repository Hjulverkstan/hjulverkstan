package se.hjulverkstan.main

import io.kotest.core.spec.IsolationMode
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.DefaultResourceLoader
import org.springframework.http.HttpStatus
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.transaction.TestTransaction
import org.springframework.transaction.annotation.Transactional
import se.hjulverkstan.main.annotations.IntegrationTest
import se.hjulverkstan.main.dto.vehicles.VehicleDto

@IntegrationTest
@Transactional
@Rollback
// @Isolate
open class Playgroun : BaseStringSpec() {

    override fun isolationMode() = IsolationMode.InstancePerTest

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    fun loadSqlScripts() {
        val scripts = listOf(
            "classpath:script/roles.sql",
            "classpath:script/user.sql",
            "classpath:script/user_roles.sql",
            "classpath:script/location.sql",
            "classpath:script/vehicle.sql"
        )

        val loader = DefaultResourceLoader()
        for (script in scripts) {
            val sql = loader.getResource(script).inputStream.bufferedReader().use { it.readText() }
            jdbcTemplate.execute(sql)
        }
    }

    private fun runTestDataScripts() {
        val scripts = listOf(
            "classpath:script/roles.sql",
            "classpath:script/user.sql",
            "classpath:script/user_roles.sql",
            "classpath:script/location.sql",
            "classpath:script/vehicle.sql"
        )

        val loader = DefaultResourceLoader()
        scripts.forEach { path ->
            val resource = loader.getResource(path)
            val sql = resource.inputStream.bufferedReader().use { it.readText() }
            jdbcTemplate.execute(sql)
        }
    }

    init {
        beforeEach {
            if (!TestTransaction.isActive()) {
                TestTransaction.start()
            }
            loadSqlScripts()
        }

        afterEach {
            if (TestTransaction.isActive()) {
                TestTransaction.flagForRollback()
                TestTransaction.end()
            }
        }

        "should return 200 OK and correct vehicle when getting vehicle by ID = 1" {
            val response = get<VehicleDto>("$BASE_URL$VALID_ID", USER_NAME)

            response.statusCode shouldBe HttpStatus.OK

            val vehicle = response.expectBody()

            vehicle.id shouldBe 1L
            vehicle.regTag shouldBe "ABC123"
            vehicle.vehicleType.name shouldBe "BIKE"
            vehicle.vehicleStatus.name shouldBe "UNAVAILABLE"
            vehicle.imageURL shouldBe "image_url_1.jpg"
            vehicle.comment shouldBe null
            vehicle.isCustomerOwned shouldBe true
            vehicle.locationId shouldBe 1L
            vehicle.ticketIds shouldNotBe null
        }

        "should return 404 NOT FOUND when getting vehicle by non-existing ID" {
            val response = get<VehicleDto>("$BASE_URL$INVALID_ID", USER_NAME)

            response.statusCode shouldBe HttpStatus.NOT_FOUND
        }

        "should return 401 UNAUTHORIZED when accessing without token" {
            val response = get<VehicleDto>("$BASE_URL$VALID_ID")

            response.statusCode shouldBe HttpStatus.UNAUTHORIZED
        }
    }

    companion object {
        const val BASE_URL = "/v1/api/vehicle/"
        const val USER_NAME = "christopher"
        const val VALID_ID = 1
        const val INVALID_ID = 999
    }
}
