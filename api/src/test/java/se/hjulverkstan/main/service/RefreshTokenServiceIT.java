package se.hjulverkstan.main.service;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;
import se.hjulverkstan.main.annotations.RepositoryTest;
import se.hjulverkstan.main.model.RefreshToken;
import se.hjulverkstan.main.repository.RefreshTokenRepository;
import se.hjulverkstan.main.util.TestClockConfig;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@RepositoryTest
@Import({RefreshTokenService.class, TestClockConfig.class})
@Sql(scripts = {
        "classpath:script/user.sql",
        "classpath:script/refresh_token.sql"
})
@Slf4j
public class RefreshTokenServiceIT {

    private static final LocalDateTime FIXED_NOW = LocalDateTime.of(2025, 6, 3, 12, 0);

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    // @SpyBean
    // Clock clock;

    @Test
    void makeSure_clockIsSetup_correctly() {
        // This test ensures that the clock is set up correctly for the tests
        LocalDateTime now = LocalDateTime.now();
        assertThat(now).isEqualTo(FIXED_NOW);
    }

    /*@Test
    @DisplayName("verifyExpiration() should return token when not expired")
    void verifyExpiration_shouldReturnToken_whenNotExpired() {
        // Arrange
        long userId = 1L;
        LocalDateTime expectedExpiry = FIXED_NOW.plus(refreshTokenService.refreshTokenDurationMs, ChronoUnit.MILLIS);

        // Act
        RefreshToken result = refreshTokenService.createRefreshToken(userId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getUser().getId()).isEqualTo(userId);
        assertThat(result.getToken()).isNotBlank();
        assertThat(result.getExpiryDate()).isEqualTo(expectedExpiry);

        // Also verify it was saved
        assertThat(refreshTokenRepository.findByToken(result.getToken()))
                .as("Refresh token should be saved and retrievable by token")
                .isPresent();

    }*/

    @Test
    @DisplayName("verifyExpiration() should throw and delete token when expired")
    void verifyExpiration_shouldThrowAndDelete_whenExpired() {
        // TODO: Setup a token that is expired
    }

    @Test
    @DisplayName("deleteByUserId() should delete token when user exists")
    void deleteByUserId_shouldDelete_whenUserExists() {
        // TODO: Persist user and token, then delete
    }

    @Test
    @DisplayName("deleteByUserId() should throw when user does not exist")
    void deleteByUserId_shouldThrow_whenUserNotFound() {
        // TODO: Delete using non-existing userId
    }

    @Test
    @DisplayName("createRefreshToken() should create token for valid user")
    void createRefreshToken_shouldCreate_whenUserExists() {
        // TODO: Persist user, call createRefreshToken
    }

    @Test
    @DisplayName("createRefreshToken() should delete old token before creating new")
    void createRefreshToken_shouldReplaceOldToken() {
        // TODO: Save user and initial token, then create new one and verify replacement
    }

    @Test
    @DisplayName("createRefreshToken() should throw when user does not exist")
    void createRefreshToken_shouldThrow_whenUserNotFound() {
        // TODO: Pass invalid userId
    }

    @Test
    @DisplayName("findByToken() should return token when exists")
    void findByToken_shouldReturn_whenTokenExists() {
        // TODO: Save a token, then find it
    }

    @Test
    @DisplayName("findByToken() should return empty when not found")
    void findByToken_shouldReturnEmpty_whenNotFound() {
        // TODO: Lookup token that does not exist
    }
}
