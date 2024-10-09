package se.hjulverkstan.main.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.common.exception.ElementNotFoundException;
import se.hjulverkstan.main.common.exception.TokenRefreshException;
import se.hjulverkstan.main.model.auth.RefreshToken;
import se.hjulverkstan.main.model.user.User;
import se.hjulverkstan.main.repository.RefreshTokenRepository;
import se.hjulverkstan.main.repository.UserRepository;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;


    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    @Value("${saveChild.app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(Long userId) {
        // Delete refresh token before creating a new to avoid duplicate error on consecutive logins.
        deleteByUserId(userId);

        RefreshToken refreshToken = new RefreshToken();
        User user = userRepository.findById(userId).orElseThrow(() -> new ElementNotFoundException("User with id " + userId));
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(LocalDateTime.now().plus(refreshTokenDurationMs, ChronoUnit.MILLIS));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshTokenRepository.flush();
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }

        return token;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ElementNotFoundException("User with id " + userId));
        refreshTokenRepository.deleteByUser(user);
    }
}