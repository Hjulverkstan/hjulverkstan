package se.hjulverkstan.main.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import se.hjulverkstan.main.security.model.CustomUserDetails;
import se.hjulverkstan.main.security.services.CustomUserDetailsService;
import se.hjulverkstan.main.security.utils.CookieUtils;
import se.hjulverkstan.main.security.utils.JwtUtils;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final CookieUtils cookieUtils;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request,
                                    @NotNull HttpServletResponse response,
                                    @NotNull FilterChain filterChain) throws ServletException, IOException {

        String token = cookieUtils.getTokenFromCookie(request, "accessToken");

        if (token != null) {
            try {
                if (jwtUtils.validateToken(token)) {
                    CustomUserDetails principal = jwtUtils.extractAsPrincipal(token);

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            principal.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    cookieUtils.clearAuthenticationCookies(response);
                    SecurityContextHolder.clearContext();
                }
            } catch (Exception e) {
                cookieUtils.clearAuthenticationCookies(response);
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
