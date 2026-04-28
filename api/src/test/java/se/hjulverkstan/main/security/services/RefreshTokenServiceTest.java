package se.hjulverkstan.main.security.services;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.TokenRefreshException;
import se.hjulverkstan.main.feature.user.User;
import se.hjulverkstan.main.feature.user.UserRepository;
import se.hjulverkstan.main.security.model.RefreshToken;
import se.hjulverkstan.main.security.repository.RefreshTokenRepository;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private MockedStatic<LocalDateTime> mockedLocalDateTime;
    private final LocalDateTime FIXED_NOW = LocalDateTime.of(2026, 1, 1, 12, 0, 0, 0);
    private final Long DURATION_MS = 60000L; // 60 seconds

    @BeforeEach
    void setUp() {
        // Inject the @Value field
        ReflectionTestUtils.setField(refreshTokenService, "refreshTokenDurationMs", DURATION_MS);
        
        // Freeze time
        mockedLocalDateTime = mockStatic(LocalDateTime.class, CALLS_REAL_METHODS);
        mockedLocalDateTime.when(LocalDateTime::now).thenReturn(FIXED_NOW);
    }

    @AfterEach
    void tearDown() {
        mockedLocalDateTime.close();
    }

    // ─── findByToken ────────────────────────────────────────────────────────

    @Test
    void findByToken_DelegatesToRepository() {
        RefreshToken token = new RefreshToken();
        when(refreshTokenRepository.findByToken("my-token")).thenReturn(Optional.of(token));

        Optional<RefreshToken> result = refreshTokenService.findByToken("my-token");

        assertTrue(result.isPresent());
        assertSame(token, result.get());
        verify(refreshTokenRepository).findByToken("my-token");
    }

    // ─── deleteByUserId ─────────────────────────────────────────────────────

    @Test
    void deleteByUserId_DelegatesToRepository() {
        refreshTokenService.deleteByUserId(15L);
        verify(refreshTokenRepository).deleteByUser_Id(15L);
    }

    // ─── createRefreshToken ─────────────────────────────────────────────────

    @Test
    void createRefreshToken_Success_DeletesOldAndSavesNewWithCorrectExpiry() {
        User user = new User();
        user.setId(7L);
        when(userRepository.findById(7L)).thenReturn(Optional.of(user));

        RefreshToken mockSavedToken = new RefreshToken();
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(mockSavedToken);

        RefreshToken result = refreshTokenService.createRefreshToken(7L);

        // Verify old token deleted
        verify(refreshTokenRepository).deleteByUser_Id(7L);

        // Verify save and flush
        verify(refreshTokenRepository).flush();
        ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(captor.capture());

        RefreshToken captured = captor.getValue();
        assertSame(user, captured.getUser());
        assertNotNull(captured.getToken());
        
        // Assert expiry is EXACTLY FIXED_NOW + DURATION_MS
        LocalDateTime expectedExpiry = FIXED_NOW.plusNanos(DURATION_MS * 1_000_000);
        assertEquals(expectedExpiry, captured.getExpiryDate());

        assertSame(mockSavedToken, result);
    }

    @Test
    void createRefreshToken_UserNotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        ElementNotFoundException ex = assertThrows(ElementNotFoundException.class, 
            () -> refreshTokenService.createRefreshToken(99L));
        assertTrue(ex.getMessage().contains("User with id 99"));

        verify(refreshTokenRepository, never()).deleteByUser_Id(anyLong());
        verify(refreshTokenRepository, never()).save(any());
    }

    // ─── verifyExpiration boundary drill ────────────────────────────────────

    @Test
    void verifyExpiration_NotFound_ThrowsException() {
        when(refreshTokenRepository.findByToken("invalid")).thenReturn(Optional.empty());

        TokenRefreshException ex = assertThrows(TokenRefreshException.class, 
            () -> refreshTokenService.verifyExpiration("invalid"));
        assertTrue(ex.getMessage().contains("Failed for [invalid]"));
        assertTrue(ex.getMessage().contains("Refresh token is not in database!"));
    }

    @Test
    void verifyExpiration_ValidToken_1MsAfterExpiry_ReturnsToken() {
        RefreshToken token = new RefreshToken();
        token.setToken("valid-token");
        // token expires 1 millisecond into the future
        token.setExpiryDate(FIXED_NOW.plusNanos(1_000_000));
        when(refreshTokenRepository.findByToken("valid-token")).thenReturn(Optional.of(token));

        RefreshToken result = refreshTokenService.verifyExpiration("valid-token");

        assertSame(token, result);
        verify(refreshTokenRepository, never()).delete(any());
    }

    @Test
    void verifyExpiration_ValidToken_ExactlyAtExpiry_ReturnsToken() {
        RefreshToken token = new RefreshToken();
        token.setToken("exact-token");
        // token expires exactly now
        token.setExpiryDate(FIXED_NOW);
        when(refreshTokenRepository.findByToken("exact-token")).thenReturn(Optional.of(token));

        RefreshToken result = refreshTokenService.verifyExpiration("exact-token");

        assertSame(token, result);
        verify(refreshTokenRepository, never()).delete(any());
    }

    @Test
    void verifyExpiration_ExpiredToken_1MsBeforeExpiry_DeletesAndThrows() {
        RefreshToken token = new RefreshToken();
        token.setToken("expired-token");
        // token expired 1 millisecond ago
        token.setExpiryDate(FIXED_NOW.minusNanos(1_000_000));
        when(refreshTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(token));

        TokenRefreshException ex = assertThrows(TokenRefreshException.class, 
            () -> refreshTokenService.verifyExpiration("expired-token"));
        assertTrue(ex.getMessage().contains("Refresh token was expired"));

        verify(refreshTokenRepository).delete(token);
    }
}
