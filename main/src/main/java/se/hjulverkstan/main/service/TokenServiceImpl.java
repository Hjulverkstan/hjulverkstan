package se.hjulverkstan.main.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.TokenRefreshException;
import se.hjulverkstan.main.dto.auth.UserDetails;
import se.hjulverkstan.main.model.RefreshToken;
import se.hjulverkstan.main.security.jwt.JwtUtils;

import java.util.HashMap;
import java.util.Map;

@Service
public class TokenServiceImpl implements TokenService {
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;

    public TokenServiceImpl(JwtUtils jwtUtils, RefreshTokenService refreshTokenService) {
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
    }

    public void createAuthenticationCookies(HttpServletResponse response, UserDetails userDetails) {
        String jwt = jwtUtils.generateToken(userDetails.getUsername());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        setJwtCookie(response, jwt);
        setRefreshCookie(response, refreshToken.getToken());
    }

    public void refreshToken(HttpServletResponse response, String requestRefreshToken) {
        Map<String, String> refreshedTokens = refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String jwt = jwtUtils.generateToken(user.getUsername());
                    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

                    Map<String, String> tokens = new HashMap<>();
                    tokens.put("accessToken", jwt);
                    tokens.put("refreshToken", refreshToken.getToken());
                    return tokens;
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token is not in database!"));

        setJwtCookie(response, refreshedTokens.get("accessToken"));
        setRefreshCookie(response, refreshedTokens.get("refreshToken"));
    }

    private void setJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("accessToken", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setSecure(true);
        response.addCookie(cookie);
    }

    private void setRefreshCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("refreshToken", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/v1/auth/refreshtoken");
        cookie.setSecure(true);
        response.addCookie(cookie);
    }

    public void clearAuthenticationCookies(HttpServletResponse response) {
        clearCookie(response, "accessToken");
        clearCookie(response, "refreshToken");

    }

    private void clearCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setSecure(true);
        response.addCookie(cookie);
    }
}
