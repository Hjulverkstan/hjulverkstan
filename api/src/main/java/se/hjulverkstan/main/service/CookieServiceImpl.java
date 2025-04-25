package se.hjulverkstan.main.service;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.TokenRefreshException;
import se.hjulverkstan.main.dto.auth.UserDetails;
import se.hjulverkstan.main.model.ERole;
import se.hjulverkstan.main.model.RefreshToken;
import se.hjulverkstan.main.model.Role;
import se.hjulverkstan.main.model.User;
import se.hjulverkstan.main.security.jwt.JwtUtils;

import java.util.*;

@Service
public class CookieServiceImpl implements CookieService {
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;

    @Value("${saveChild.app.jwtExpirationMs}")
    private int jwtExpirationMs;
    @Value("${saveChild.app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    public CookieServiceImpl(JwtUtils jwtUtils, RefreshTokenService refreshTokenService) {
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
    }

    //Roles in UserDetails is List<String>
    public String determineSameSite(List<String> roles) {
        return roles.contains("ROLE_PIPELINE") ? "Lax" : "Strict";
    }
    //Roles in User is Set<Roles>
    public String determineSameSite(Set<Role> roles) {
        return roles.stream()
                .map(Role::getName)
                .anyMatch(role -> role == ERole.ROLE_PIPELINE)
                ? "Lax" : "Strict";
    }

    public void createAuthenticationCookies(HttpServletResponse response, UserDetails userDetails) {
        String jwt = jwtUtils.generateToken(userDetails.getUsername());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
        String sameSite = determineSameSite(userDetails.getRoles());
        setJwtCookie(response, jwt, sameSite);
        setRefreshCookie(response, refreshToken.getToken(), sameSite);
    }

    public void refreshToken(HttpServletResponse response, String requestRefreshToken) {
        RefreshToken currRefreshToken = refreshTokenService.findByToken(requestRefreshToken)
                .orElseThrow(() -> new TokenRefreshException(
                        requestRefreshToken, "Refresh token is not in database!")
                );
        refreshTokenService.verifyExpiration(currRefreshToken);
        User user = currRefreshToken.getUser();
        String jwt = jwtUtils.generateToken(user.getUsername());
        RefreshToken nextRefreshToken = refreshTokenService.createRefreshToken(user.getId());
        String sameSite = determineSameSite(user.getRoles());
        setJwtCookie(response, jwt, sameSite);
        setRefreshCookie(response, nextRefreshToken.getToken(),sameSite);
    }

    private void setJwtCookie(HttpServletResponse response, String token, String sameSite) {
        String cookie = "accessToken=" + token
                + "; Path=/"
                + "; HttpOnly"
                + "; Secure"
                + "; SameSite=" + sameSite
                + "; Max-Age=" + (jwtExpirationMs / 1000 - 30);
        response.addHeader("Set-Cookie", cookie);
    }

    private void setRefreshCookie(HttpServletResponse response, String token, String sameSite) {
        String cookie = "refreshToken=" + token
                + "; Path=/"
                + "; HttpOnly"
                + "; Secure"
                + "; SameSite=" + sameSite
                + "; Max-Age=" + (refreshTokenDurationMs.intValue() / 1000 - 30);
        response.addHeader("Set-Cookie", cookie);
    }

    public void clearAuthenticationCookies(HttpServletResponse response) {
        clearCookie(response, "accessToken", "/");
        clearCookie(response, "refreshToken", "/v1/api/auth");
    }

    private void clearCookie(HttpServletResponse response, String name, String path) {
        String cookie = name + "=; Path=" + path + "; HttpOnly; Secure; SameSite=Strict; Max-Age=0";
        response.addHeader("Set-Cookie", cookie);
    }
}
