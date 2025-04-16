package se.hjulverkstan.main.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.Exceptions.MissingArgumentException;
import se.hjulverkstan.Exceptions.TokenRefreshException;
import se.hjulverkstan.main.dto.MessageResponse;
import se.hjulverkstan.main.dto.auth.LoginRequest;
import se.hjulverkstan.main.dto.auth.UserDetails;
import se.hjulverkstan.main.security.services.AuthService;
import se.hjulverkstan.main.service.CookieService;
import se.hjulverkstan.main.service.CookieServiceImpl;

import java.util.Arrays;


@RestController
@RequestMapping("v1/auth")
public class AuthController {

    AuthService authService;
    CookieService cookieService;

    public AuthController(AuthService authService, CookieServiceImpl cookieService) {
        this.authService = authService;
        this.cookieService = cookieService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse httpServletResponse) {
        UserDetails userDetails = authService.login(loginRequest);
        cookieService.createAuthenticationCookies(httpServletResponse, userDetails);

        return ResponseEntity.ok(userDetails);
    }

    @GetMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;

        if (request.getCookies() != null)
            refreshToken = Arrays.stream(request.getCookies())
                    .filter(cookie -> "refreshToken".equals(cookie.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElseThrow(() -> new MissingArgumentException("Refresh token"));
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Cookies are empty or null"));

        try {
            cookieService.refreshToken(response, refreshToken);

            return ResponseEntity.ok(new MessageResponse("Refresh successful"));
        } catch (TokenRefreshException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Unable to refresh token"));
        }
    }

    @PostMapping("/signout/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<?> logoutUser(@PathVariable Long id, HttpServletResponse response) {
        MessageResponse messageResponse = authService.signOut(id);
        cookieService.clearAuthenticationCookies(response);

        return ResponseEntity.ok(messageResponse);
    }

    @GetMapping("/verify")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<?> verifyAuth() {
        try {
            UserDetails userDetails = authService.verifyAuth();
            return ResponseEntity.ok(userDetails);
        } catch (InsufficientAuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        }
    }
}
