package se.hjulverkstan.main

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import io.kotest.core.extensions.Extension
import io.kotest.core.spec.style.ShouldSpec
import io.kotest.extensions.spring.SpringExtension
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.*
import se.hjulverkstan.main.annotations.IntegrationTest
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import java.util.*

@IntegrationTest
abstract class BaseShouldSpec : ShouldSpec() {

    @Autowired
    protected lateinit var restTemplate: TestRestTemplate

    @Value("\${saveChild.app.jwtSecret}")
    lateinit var jwtSecret: String

    @Value("\${saveChild.app.jwtExpirationMs}")
    private var jwtExpirationMs: Long = 0L

    override fun extensions(): List<Extension> = listOf(SpringExtension)

    protected fun generateToken(userName: String): String {
        val claims: MutableMap<String, Any> = mutableMapOf()
        return createToken(claims, userName, jwtSecret, jwtExpirationMs)
    }

    private fun createToken(
        claims: Map<String, Any>,
        userName: String,
        jwtSecret: String,
        jwtExpirationMs: Long
    ): String {
        val expiryDateTime = LocalDateTime.now().plus(jwtExpirationMs, ChronoUnit.MILLIS)
        val keyBytes = Decoders.BASE64.decode(jwtSecret)
        val key = Keys.hmacShaKeyFor(keyBytes)

        return Jwts.builder()
            .setClaims(claims)
            .setSubject(userName)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date.from(expiryDateTime.atZone(ZoneId.systemDefault()).toInstant()))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact()
    }

    protected fun createHttpEntityWithAccessToken(token: String): HttpEntity<Void> {
        val headers = HttpHeaders().apply {
            accept = listOf(MediaType.APPLICATION_JSON)
            contentType = MediaType.APPLICATION_JSON
            add(HttpHeaders.COOKIE, "accessToken=$token")
        }
        return HttpEntity(headers)
    }

    protected inline fun <reified T> ResponseEntity<T>.expectBody(): T {
        return this.body ?: error("Expected non-null response body of type ${T::class.simpleName}")
    }

    protected inline fun <reified T> get(url: String, request: HttpEntity<*>): ResponseEntity<T> {
        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            request,
            object : ParameterizedTypeReference<T>() {}
        )
    }

    protected inline fun <reified T> get(url: String, user: String? = null): ResponseEntity<T> {
        val headers = HttpHeaders().apply {
            accept = listOf(MediaType.APPLICATION_JSON)
            contentType = MediaType.APPLICATION_JSON
            if (user != null) {
                val token = generateToken(user)
                add(HttpHeaders.COOKIE, "accessToken=$token")
            }
        }
        val request = HttpEntity<Void>(headers)
        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            request,
            object : ParameterizedTypeReference<T>() {}
        )
    }
}
