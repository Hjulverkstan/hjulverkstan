package se.hjulverkstan.main.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.auth.LoginRequest;
import se.hjulverkstan.main.dto.auth.TokenRefreshRequest;
import se.hjulverkstan.main.security.services.AuthService;

@RestController
@RequestMapping("v1/auth")
public class AuthController {


    AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/signout/{id}")
    public ResponseEntity<?> logoutUser(@PathVariable Long id) {
        return ResponseEntity.ok(authService.signOut(id));
    }
}
