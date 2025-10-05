package se.hjulverkstan.main.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.feature.user.User;
import se.hjulverkstan.main.security.dto.LoginRequest;
import se.hjulverkstan.main.security.dto.AuthSuccessResponse;
import se.hjulverkstan.main.security.model.CustomUserDetails;
import se.hjulverkstan.main.security.services.RefreshTokenService;
import se.hjulverkstan.main.security.utils.CookieUtils;

@RestController
@RequestMapping("v1/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final CookieUtils cookieUtils;

    @PostMapping("/login")
    public AuthSuccessResponse authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String refreshJwt = refreshTokenService.createRefreshToken(principal.getId()).getToken();

        cookieUtils.setAuthenticationCookies(response, principal, refreshJwt);

        return new AuthSuccessResponse(principal);
    }

    @GetMapping("/refresh")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String currRefreshJwt = cookieUtils.getTokenFromCookie(request, "refreshToken");
        User user = refreshTokenService.verifyExpiration(currRefreshJwt).getUser();
        String refreshJwt = refreshTokenService.createRefreshToken(user.getId()).getToken();

        cookieUtils.setAuthenticationCookies(response, user, refreshJwt);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logoutUser(HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
            && !(authentication instanceof AnonymousAuthenticationToken)) {

            CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
            refreshTokenService.deleteByUserId(principal.getId());
        }

        cookieUtils.clearAuthenticationCookies(response);
        SecurityContextHolder.clearContext();
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)) {

            CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok(new AuthSuccessResponse(principal));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
