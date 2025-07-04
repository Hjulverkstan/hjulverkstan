package se.hjulverkstan.main.endpoint

import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.*
import se.hjulverkstan.main.annotations.InsertData
import se.hjulverkstan.main.base.BaseSpec
import se.hjulverkstan.main.data.BikeType
import se.hjulverkstan.main.data.StrollerType
import se.hjulverkstan.main.data.VehicleStatus
import se.hjulverkstan.main.data.VehicleType
import se.hjulverkstan.main.data.factory.VehicleEndpointFactory as VF


@InsertData(
    scripts = [
        "classpath:script/roles.sql",
        "classpath:script/user.sql",
        "classpath:script/user_roles.sql",
        "classpath:script/location.sql",
        "classpath:script/vehicle.sql"
    ]
)
class VehicleEndpointSpec : BaseSpec() {

    private lateinit var accessToken: String

    init {

        beforeSpec {

            accessToken = loginAndGetToken("christopher", "password")

        }

        context("GET /v1/api/vehicle/{id}") {

            test("Verify that GET vehicle by ID returns correct vehicle data") {

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    get("$BASE_URL_AND$VALID_ID")
                } Then {
                    statusCode(200)
                    body("id", equalTo(1))
                    body("regTag", equalTo("ABC123"))
                    body("vehicleType", equalTo(VehicleType.BIKE.name))
                    body("vehicleStatus", equalTo(VehicleStatus.UNAVAILABLE.name))
                    body("imageURL", equalTo("image_url_1.jpg"))
                    body("comment", nullValue())
                    body("isCustomerOwned", equalTo(true))
                    body("locationId", equalTo(1))
                    body("ticketIds", notNullValue())
                }
            }

            test("Verify that using invalid vehicle ID returns 404 when sending GET Vehicle by id request") {

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    get("$BASE_URL_AND$INVALID_ID")
                } Then {
                    statusCode(404)
                }
            }
        }

        context("PUT /v1/api/vehicle/{id}") {

            test("Verify that a valid PUT request to edit vehicle returns 200 with updated vehicle data") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.validEditVehicle())
                } When {
                    put("$BASE_URL_AND$VALID_ID")
                } Then {
                    statusCode(200)
                }

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    get("$BASE_URL_AND$VALID_ID")
                } Then {
                    statusCode(200)
                    body("id", equalTo(VALID_ID.toInt()))
                    body("regTag", equalTo("EDITED123"))
                    body("vehicleType", equalTo("BIKE"))
                    body("imageURL", equalTo("edited_image.jpg"))
                    body("comment", equalTo("Updated by test"))
                    body("locationId", equalTo(1))
                }
            }

            test("Verify that an invalid PUT request to edit vehicle returns 400 BAD REQUEST") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.invalidEditVehicle())
                } When {
                    put("$BASE_URL_AND$VALID_ID")
                } Then {
                    statusCode(400)
                }
            }
        }

        context("DELETE /v1/api/vehicle/{id}") {

            test("Verify that a valid DELETE request returns 200 with correctly deleted vehicle info") {

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    delete("$BASE_URL_AND$VALID_ID")
                } Then {
                    statusCode(200)
                    body("id", equalTo(1))
                    body("regTag", equalTo("ABC123"))
                    body("vehicleType", equalTo("BIKE"))
                    body("vehicleStatus", equalTo("UNAVAILABLE"))
                    body("imageURL", equalTo("image_url_1.jpg"))
                    body("comment", nullValue())
                    body("ticketIds", notNullValue())
                    body("locationId", equalTo(1))
                    body("isCustomerOwned", equalTo(true))
                }

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    get("$BASE_URL_AND$VALID_ID")
                } Then {
                    statusCode(404)
                }

            }

            // Verify delete by smae id once per data/endpoint
            test("Verify that using invalid vehicle ID returns 404 when sending DELETE Vehicle by id request") {

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    delete("$BASE_URL_AND$INVALID_ID")
                } Then {
                    statusCode(404)
                }
            }
        }

        context("PUT /v1/api/vehicle/{id}/status") {

            test("verify that a valid PUT request to update vehicle status returns 200 with updated status") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.validEditVehicleStatus())
                } When {
                    put("${BASE_URL_AND}3/status")
                } Then {
                    statusCode(200)
                }

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    get("${BASE_URL_AND}3")
                } Then {
                    statusCode(200)
                    body("id", equalTo(3))
                    body("vehicleStatus", equalTo(VehicleStatus.ARCHIVED.name))
                }
            }

            test("Verify that invalid status state change request returns 400 BAD REQUEST") {

                Given {
                    contentType("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.validEditVehicleStatus())
                } When {
                    put("${BASE_URL_AND}2/status")
                } Then {
                    statusCode(400)
                }
            }
        }

        context("PUT /v1/api/vehicle/stroller/{id}") {

            test("Verify that a valid PUT request to edit stroller vehicle returns 200 with updated stroller data") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.validEditStroller())
                } When {
                    put("${BASE_URL_AND}stroller/$VALID_ID")
                } Then {
                    statusCode(200)
                }

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    get("${BASE_URL_AND}1")
                } Then {
                    statusCode(200)
                    body("id", equalTo(VALID_ID))
                    body("regTag", equalTo("STR123"))
                    body("vehicleType", equalTo(VehicleType.STROLLER.name))
                    body("strollerType", equalTo(StrollerType.DOUBLE.name))
                    body("locationId", equalTo(1))
                }

            }

            test("Verify that a PUT request to edit invalid stroller id returns 404 NOT FOUND") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.validEditStroller())
                } When {
                    put("${BASE_URL_AND}stroller/$INVALID_ID")
                } Then {
                    statusCode(404)
                }
            }
        }

        context("PUT /v1/api/vehicle/bike/{id}") {

            test("Verify that mandatory fields in a PUT request to edit bike returns 200 with updated bike data") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.validBikeEdit())
                } When {
                    put("${BASE_URL_AND}/bike/$VALID_ID")
                } Then {
                    statusCode(200)
                }

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    get("$BASE_URL_AND$VALID_ID")
                } Then {
                    statusCode(200)
                    body("id", equalTo(VALID_ID))
                    body("regTag", equalTo("BIKE123"))
                    body("vehicleType", equalTo(VehicleType.BIKE.name))
                    body("bikeType", equalTo(BikeType.ROAD.name))
                    body("locationId", equalTo(1))
                }
            }

            test("Verify that a missing mandatory field in a PUT request to edit bike returns 400 BAD REQUEST") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.invalidBikeEdit())
                } When {
                    put("${BASE_URL_AND}bike/$VALID_ID")
                } Then {
                    statusCode(400)
                }
            }
        }

        context("PUT /v1/api/vehicle/batch/{id}") {

            test("Verify that minimum mandatory fields in PUT request to edit batch returns 200") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.validBatchEdit())
                } When {
                    put("${BASE_URL_AND}batch/$VALID_ID")
                } Then {
                    statusCode(200)
                }

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    get("$BASE_URL_AND$VALID_ID")
                } Then {
                    statusCode(200)
                    body("id", equalTo(VALID_ID))
                    body("vehicleType", equalTo(VehicleType.BATCH.name))
                    body("locationId", equalTo(1))
                    body("batchCount", equalTo(5))
                }
            }

            test("Verify that a missing mandatory field in a PUT request to edit batch returns 400 BAD REQUEST") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.invalidBatchEdit())
                } When {
                    put("${BASE_URL_AND}batch/$VALID_ID")
                } Then {
                    statusCode(400)
                }
            }
        }

        context("GET /v1/api/vehicle") {

            test("Verify that a valid GET request returns all vehicles with expected fields") {

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    get(BASE_URL)
                } Then {
                    statusCode(200)
                    body("vehicles", hasSize<Int>(greaterThan(0)))
                    body("vehicles", everyItem(hasKey("vehicleType")))
                    body("vehicles", everyItem(hasKey("locationId")))
                }
            }

            test("Verify that an unauthorized GET request returns 401 UNAUTHORIZED") {

                Given {
                    this
                } When {
                    get(BASE_URL)
                } Then {
                    statusCode(401)
                }
            }
        }

        context("POST /v1/api/vehicle") {

           test("Verify that a valid mandatory fields for vehicle creation request returns 200 with correct vehicle data") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.validVehicle())
                } When {
                    post(BASE_URL)
                } Then {
                    statusCode(200)
                    body("id", greaterThan(17))
                    body("regTag", equalTo("GENERIC123"))
                    body("vehicleType", equalTo(VehicleType.BIKE.name))
                    body("vehicleStatus", equalTo(VehicleStatus.AVAILABLE.name))
                    body("locationId", equalTo(1))
                    body("isCustomerOwned", equalTo(false))
                    body("imageURL", equalTo("image_new_generic.jpg"))
                    body("comment", equalTo("Test vehicle creation"))
                }
            }

            test("Verify that a request without required fields returns 400 BAD REQUEST") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.invalidVehicle())
                } When {
                    post(BASE_URL)
                } Then {
                    statusCode(400)
                }
            }

            test("[SHOWCASE] Verify that a request with minimum plus additional non required fields should return 200 SUCCESS and correct vehicle") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.actualValidVehicle())
                } When {
                    post(BASE_URL)
                } Then {
                    statusCode(200)
                    body("id", greaterThan(17))
                    body("regTag", equalTo("REGTAG123"))
                    body("vehicleType", equalTo(VehicleType.BIKE.name))
                    body("vehicleStatus", equalTo(VehicleStatus.AVAILABLE.name))
                    body("locationId", equalTo(1))
                    body("isCustomerOwned", equalTo(false))
                }
            }
        }

        context("POST /v1/api/vehicle/stroller") {

            test("Verify that mandatory fields in a POST request to create stroller returns 200 with created stroller data") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.validStroller())
                } When {
                    post("${BASE_URL_AND}stroller")
                } Then {
                    statusCode(200)
                    body("id", greaterThan(17))
                    body("vehicleType", equalTo(VehicleType.STROLLER.name))
                    body("strollerType", equalTo(StrollerType.DOUBLE.name))
                    body("locationId", equalTo(1))
                }
            }

            test("[SHOWCASE] Verify a actual required stroller creation request should return 200 SUCCESS and created stroller") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.actualValidStroller())
                } When {
                    post("${BASE_URL_AND}stroller")
                } Then {
                    statusCode(200)
                    body("id", greaterThan(17))
                    body("vehicleType", equalTo(VehicleType.STROLLER.name))
                    body("strollerType", equalTo(StrollerType.SINGLE.name))
                    body("locationId", equalTo(1))
                }
            }

            test("Verify that an invalid POST request for stroller creation returns 400 BAD REQUEST") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.invalidStroller())
                } When {
                    post("${BASE_URL_AND}stroller")
                } Then {
                    statusCode(400)
                }
            }
        }

        context("POST /v1/api/vehicle/bike") {

            test("Verify that mandatory fields in a POST request to create bike returns 200 with created bike data") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.validBike())
                } When {
                    post("${BASE_URL_AND}bike")
                } Then {
                    statusCode(200)
                    body("id", greaterThan(17))
                    body("vehicleType", equalTo(VehicleType.BIKE.name))
                    body("bikeType", equalTo(BikeType.BMX.name))
                    body("locationId", equalTo(1))
                }
            }

            test("Verify that invalid bike locationId in a POST request to create bike returns 400 BAD REQUEST") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.invalidBike())
                } When {
                    post("${BASE_URL_AND}bike")
                } Then {
                    statusCode(400)
                }
            }

            test("Verify that a POST request with already taken regTag returns 400 BAD REQUEST") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.invalidTakenRegTagBike())
                } When {
                    post("${BASE_URL_AND}bike")
                } Then {
                    statusCode(400)
                }
            }

        }

        context("POST /v1/api/vehicle/batch") {

            test("Verify that mandatory fields in a POST request to create batch returns 200 with created batch data") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.validBatch())
                } When {
                    post("${BASE_URL_AND}batch")
                } Then {
                    statusCode(200)
                    body("id", greaterThan(17))
                    body("vehicleType", equalTo(VehicleType.BATCH.name))
                    body("locationId", equalTo(1))
                    body("batchCount", equalTo(5))
                }
            }

            test("Verify that an invalid POST request for batch creation returns 400 BAD REQUEST") {

                Given {
                    contentType("application/json")
                    accept("application/json")
                    cookie("accessToken", accessToken)
                    body(VF.invalidBatch())
                } When {
                    post("${BASE_URL_AND}batch")
                } Then {
                    statusCode(400)
                }
            }

        }

    }

    companion object {
        const val BASE_URL = "/v1/api/vehicle"
        const val BASE_URL_AND = "$BASE_URL/"
        const val VALID_ID = 1L
        const val INVALID_ID = 999L
    }
}