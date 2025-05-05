package se.hjulverkstan.main.container;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import se.hjulverkstan.main.config.AwsS3Config;
import se.hjulverkstan.main.dto.auth.LoginRequest;
import se.hjulverkstan.main.dto.auth.UserDetails;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Slf4j
// @TestProfile
class AuthControllerITH2 {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        /**
         * Seed the database with data from a SQL file, kind of how we do it in api [main].
         */
    }

    @AfterEach
    void tearDown() {

    }

    private String getBaseUrl() {
        return "http://localhost:" + port + "/v1/api/auth";
    }

    @Test
    void verifyAuth_shouldReturnUserDetails_whenAuthenticated() {
        String jsonRequest = """
        {
            "username": "christopher",
            "password": "password"
        }
        """;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // Important for @RequestBody to work

        HttpEntity<String> request = new HttpEntity<>(jsonRequest, headers);

        ResponseEntity<UserDetails> loginResponse = restTemplate.postForEntity(
                getBaseUrl() + "/login",
                request,
                UserDetails.class
        );

        log.debug(loginResponse.getStatusCode().toString());
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // 2. Get JWT from the "accessToken" cookie
        List<String> cookies = loginResponse.getHeaders().get(HttpHeaders.SET_COOKIE);
        log.debug(cookies != null ? cookies.toString() : "Cookies are null");
        assertThat(cookies).isNotEmpty();

        // Find the access token
        String accessTokenCookie = cookies.stream()
                .filter(c -> c.startsWith("accessToken"))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("accessToken cookie not found"));

        String cookieHeader = accessTokenCookie.split(";")[0]; // e.g. "accessToken=eyJhbGciOi..."

        // 3. Use token in cookie for verify request
        HttpHeaders headersResponse = new HttpHeaders();
        headers.add(HttpHeaders.COOKIE, cookieHeader);

        HttpEntity<Void> verifyRequest = new HttpEntity<>(headers);

        ResponseEntity<UserDetails> verifyResponse = restTemplate.exchange(
                getBaseUrl() + "/verify",
                HttpMethod.GET,
                verifyRequest,
                UserDetails.class
        );

        assertThat(verifyResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        UserDetails verifiedUser = verifyResponse.getBody();
        assertThat(verifiedUser).isNotNull();
        assertThat(verifiedUser.getEmail()).isEqualTo("user@example.com");
    }
}
