package se.hjulverkstan.main.endpoint

import io.restassured.module.kotlin.extensions.Extract
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.springframework.context.annotation.Import
import org.testcontainers.containers.PostgreSQLContainer
import se.hjulverkstan.main.annotations.InsertData
import se.hjulverkstan.main.base.BaseSpec
import se.hjulverkstan.main.data.factory.ImageEndpointFactory as IF
import se.hjulverkstan.main.util.LocalStackS3TestConfig


@InsertData(
    scripts = [
        "classpath:script/roles.sql",
        "classpath:script/user.sql",
        "classpath:script/user_roles.sql"
    ]
)
@Import(LocalStackS3TestConfig::class)
class ImageEndpointSpec : BaseSpec() {

    private lateinit var accessToken: String

    init {

        beforeSpec {

            accessToken = loginAndGetToken("christopher", "password")

        }

        context("POST /v1/api/image/upload") {

            test("given invalid file type txt, when trying to upload, should return 400") {

                Given {
                    cookie("accessToken", accessToken)
                    multiPart(
                        "file",
                        "this is a plain text file",
                        "notes.txt".toByteArray(),
                        "text/plain"
                    )
                } When {
                    post("${BASE_URL}upload")
                } Then {
                    statusCode(400)
                }
            }

            test("given png format, when trying to upload without auth, should return 401") {

                Given {
                    multiPart(
                        "file",
                        IMAGE_NAME,
                        IF.generateFakePngImage(),
                        "image/png"
                    )
                } When {
                    post("${BASE_URL}upload")
                } Then {
                    statusCode(401)
                }
            }

            test("given gif format, when trying to upload without auth, should return 401") {

                Given {
                    cookie("accessToken", accessToken)
                    multiPart(
                        "file",
                        IMAGE_NAME,
                        IF.generateFakeGifImage(),
                        "image/gif"
                    )
                } When {
                    post("${BASE_URL}upload")
                } Then {
                    statusCode(200)
                }
            }

            test("given gif format, when trying to upload with auth, should return 200") {

                Given {
                    cookie("accessToken", accessToken)
                    multiPart(
                        "file",
                        IMAGE_NAME,
                        IF.generateFakePngImage(),
                        "image/png"
                    )
                } When {
                    post("${BASE_URL}upload")
                } Then {
                    statusCode(200)
                }
            }

        }

        context("DELETE /v1/api/image/delete") {

            test("Verify that deleting non existing image returns 404") {
                Given {
                    cookie("accessToken", accessToken)
                    contentType("application/json")
                } When {
                    delete("${BASE_URL}delete?imageURL=${INVALID_IMAGE_URL}")
                } Then {
                    statusCode(404)
                }
            }

            test("verify that uploading an image returns 200, and then deleting it returns 200") {

                val uploadedImageUrl: String =
                Given {
                    cookie("accessToken", accessToken)
                    multiPart(
                        "file",
                        IMAGE_NAME,
                        IF.generateHugeFakePngImage(),
                        "image/png"
                    )
                } When {
                    post("${BASE_URL}upload")
                } Then {
                    statusCode(200)
                } Extract {
                    path("imageURL")
                }

                Given {
                    cookie("accessToken", accessToken)
                } When {
                    delete("${BASE_URL}delete?imageURL=${uploadedImageUrl}")
                } Then {
                    statusCode(200)
                }
            }
        }
    }

    companion object {
        const val BASE_URL = "/v1/api/image/"
        const val IMAGE_NAME = "test-image"
        const val INVALID_IMAGE_URL = "Ranfd02jgm40grgowd.png"
    }
}