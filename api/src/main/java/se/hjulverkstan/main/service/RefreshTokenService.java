package se.hjulverkstan.main.service;

import se.hjulverkstan.main.model.RefreshToken;
import java.util.Optional;

public interface RefreshTokenService {
    Optional<RefreshToken> findByToken(String token);

    RefreshToken createRefreshToken(Long userId);

    RefreshToken verifyExpiration(RefreshToken token);

    void deleteByUserId(Long userId);
}
