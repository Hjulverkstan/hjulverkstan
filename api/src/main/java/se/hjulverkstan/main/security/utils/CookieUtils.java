package se.hjulverkstan.main.security.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import se.hjulverkstan.main.feature.user.User;
import se.hjulverkstan.main.security.model.CustomUserDetails;
import se.hjulverkstan.main.security.model.ERole;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CookieUtils {
    private final JwtUtils jwtUtils;

    @Value("${saveChild.app.jwtExpirationMs}")
    private Integer jwtExpirationMs;

    @Value("${saveChild.app.jwtRefreshExpirationMs}")
    private Integer jwtRefreshExpirationMs;

    public void setAuthenticationCookies (HttpServletResponse response, User user, String refreshJwt) {
        String jwt = jwtUtils.generateToken(user.getUsername(), user.getId(), user.getEmail(), user.getRolesDirectly());
        applyCookies(response, user.getRolesDirectly(), jwt, refreshJwt);
    }

    public void setAuthenticationCookies (HttpServletResponse response, CustomUserDetails principal, String refreshJwt) {
        List<ERole> roles = principal.getAuthoritiesAsRoles();
        String jwt = jwtUtils.generateToken(principal.getUsername(), principal.getId(), principal.getEmail(), roles);
        applyCookies(response, roles, jwt, refreshJwt);
    }

    private void applyCookies (HttpServletResponse response, List<ERole> roles, String jwt, String refreshJwt) {
        String sameSite = roles.contains(ERole.ROLE_PIPELINE) ? "Lax" : "Strict";

        String accessToken = "accessToken=%s; Path=/; HttpOnly; Secure; SameSite=%s; Max-Age=%d;";
        String refreshToken = "refreshToken=%s; Path=/; HttpOnly; Secure; SameSite=%s; Max-Age=%d;";

        response.addHeader("Set-Cookie", accessToken.formatted(jwt, sameSite, jwtExpirationMs / 1000 - 30));
        response.addHeader("Set-Cookie", refreshToken.formatted(refreshJwt, sameSite, jwtRefreshExpirationMs / 1000 - 30));
    }

    public void clearAuthenticationCookies (HttpServletResponse response) {
        String accessToken = "accessToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0";
        String refreshToken = "refreshToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0";

        response.addHeader("Set-Cookie", accessToken);
        response.addHeader("Set-Cookie", refreshToken);
    }

    public String getTokenFromCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) {
            return null;
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> name.equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }
}
