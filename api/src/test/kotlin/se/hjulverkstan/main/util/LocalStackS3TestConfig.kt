package se.hjulverkstan.main.util

import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import jakarta.annotation.PostConstruct
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.localstack.LocalStackContainer
import org.testcontainers.utility.DockerImageName

@TestConfiguration
open class LocalStackS3TestConfig {

    companion object {
        private val localStack = LocalStackContainer(DockerImageName.parse("localstack/localstack:3.7.2"))
            .withServices(LocalStackContainer.Service.S3)

        init {
            // ✅ Ensures LocalStack is started BEFORE anything else in this class
            localStack.start()

            val endpoint = localStack.getEndpointOverride(LocalStackContainer.Service.S3).toString()
            val region = localStack.region
            val accessKey = localStack.accessKey
            val secretKey = localStack.secretKey

            println("🧪 LocalStack started:")
            println("   S3 endpoint = $endpoint")
            println("   region      = $region")
            println("   accessKey   = $accessKey")
            println("   secretKey   = $secretKey")
        }

        @JvmStatic
        @DynamicPropertySource
        fun registerProperties(registry: DynamicPropertyRegistry) {
            val endpoint = localStack.getEndpointOverride(LocalStackContainer.Service.S3).toString()
            val region = localStack.region
            val accessKey = localStack.accessKey
            val secretKey = localStack.secretKey

            registry.add("hjulverkstan.aws-s3.access-key") { accessKey }
            registry.add("hjulverkstan.aws-s3.secret-key") { secretKey }
            registry.add("hjulverkstan.aws-s3.region") { region }
            registry.add("hjulverkstan.aws-s3.bucket-name") { "test-bucket" }
            registry.add("hjulverkstan.aws-s3.endpoint") { endpoint }

            // Optional Spring Cloud AWS props
            registry.add("cloud.aws.region.static") { region }
            registry.add("cloud.aws.credentials.access-key") { accessKey }
            registry.add("cloud.aws.credentials.secret-key") { secretKey }
            registry.add("cloud.aws.s3.endpoint") { endpoint }
        }
    }

    @PostConstruct
    fun createTestBucket() {
        val client = AmazonS3ClientBuilder.standard()
            .withEndpointConfiguration(
                AwsClientBuilder.EndpointConfiguration(
                    localStack.getEndpointOverride(LocalStackContainer.Service.S3).toString(),
                    localStack.region
                )
            )
            .withCredentials(
                AWSStaticCredentialsProvider(
                    BasicAWSCredentials(localStack.accessKey, localStack.secretKey)
                )
            )
            .withPathStyleAccessEnabled(true)
            .build()

        if (!client.doesBucketExistV2("test-bucket")) {
            client.createBucket("test-bucket")
            println("✅ Created test S3 bucket: test-bucket")
        }
    }

    @Bean
    @Primary
    open fun localstackAmazonS3(): AmazonS3 {
        return AmazonS3ClientBuilder.standard()
            .withEndpointConfiguration(
                AwsClientBuilder.EndpointConfiguration(
                    localStack.getEndpointOverride(LocalStackContainer.Service.S3).toString(),
                    localStack.region
                )
            )
            .withCredentials(
                AWSStaticCredentialsProvider(
                    BasicAWSCredentials(localStack.accessKey, localStack.secretKey)
                )
            )
            .withPathStyleAccessEnabled(true)
            .build()
    }
}