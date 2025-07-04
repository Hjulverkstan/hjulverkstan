package se.hjulverkstan.main.base

import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import io.kotest.core.listeners.TestListener
import io.kotest.core.spec.style.FunSpec
import io.kotest.core.test.TestCase
import io.kotest.core.test.TestResult
import io.kotest.extensions.spring.SpringExtension
import io.kotest.extensions.testcontainers.perProject
import io.kotest.extensions.testcontainers.perSpec
import io.kotest.extensions.testcontainers.perTest
import io.restassured.RestAssured
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.context.annotation.Import
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.TransactionStatus
import org.springframework.transaction.support.DefaultTransactionDefinition
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.containers.localstack.LocalStackContainer
import org.testcontainers.containers.wait.strategy.Wait
import org.testcontainers.junit.jupiter.Testcontainers
import org.testcontainers.utility.DockerImageName
import se.hjulverkstan.main.annotations.IntegrationTest

@IntegrationTest
@Testcontainers
abstract class BaseSpec : FunSpec() {

    @Autowired
    lateinit var transactionManager: PlatformTransactionManager

    @LocalServerPort
    protected var port: Int = 0

    private lateinit var txStatus: TransactionStatus

    override fun extensions() = listOf(
        TransactionRollbackListener()
    )

    inner class TransactionRollbackListener : TestListener {

        override suspend fun beforeTest(testCase: TestCase) {
            val def = DefaultTransactionDefinition()
            txStatus = transactionManager.getTransaction(def)
        }

        override suspend fun afterTest(testCase: TestCase, result: TestResult) {
            if (::txStatus.isInitialized && !txStatus.isCompleted) {
                transactionManager.rollback(txStatus)
                println("Rolled back test-level transaction")
            }
        }
    }

    protected val container by lazy {
        PostgreSQLContainer("postgres:16.1").apply {
            start()
        }
    }

    init {
        System.setProperty("spring.datasource.url", container.jdbcUrl)
        System.setProperty("spring.datasource.username", container.username)
        System.setProperty("spring.datasource.password", container.password)
    }

    override suspend fun beforeSpec(spec: io.kotest.core.spec.Spec) {
        RestAssured.port = port
        RestAssured.baseURI = "http://localhost"
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails()
    }

    override suspend fun afterSpec(spec: io.kotest.core.spec.Spec) {
        RestAssured.reset()
    }

    protected fun loginAndGetToken(username: String, password: String): String {
        return given()
            .contentType(ContentType.JSON)
            .body(mapOf("username" to username, "password" to password))
            .post("/v1/api/auth/login")
            .then()
            .statusCode(200)
            .extract()
            .cookie("accessToken")
    }
}