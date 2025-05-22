package se.hjulverkstan.main
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import org.springframework.http.*
import org.springframework.test.context.jdbc.Sql
import se.hjulverkstan.main.dto.vehicles.VehicleDto

@Sql(
    scripts = [
        "classpath:script/roles.sql",
        "classpath:script/user.sql",
        "classpath:script/user_roles.sql",
        "classpath:script/location.sql",
        "classpath:script/vehicle.sql"
    ]
)
class VehicleControllerStringSpec : FinalBaseString() {

    init {

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

