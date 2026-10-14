package se.hjulverkstan.main.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import se.hjulverkstan.main.error.exceptions.TokenRefreshException;
import se.hjulverkstan.main.feature.user.User;
import se.hjulverkstan.main.security.dto.AuthSuccessResponse;
import se.hjulverkstan.main.security.dto.LoginRequest;
import se.hjulverkstan.main.security.model.CustomUserDetails;
import se.hjulverkstan.main.security.model.ERole;
import se.hjulverkstan.main.security.model.RefreshToken;
import se.hjulverkstan.main.security.services.RefreshTokenService;
import se.hjulverkstan.main.security.utils.CookieUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private CookieUtils cookieUtils;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private AuthController authController;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private CustomUserDetails mockPrincipal(Long id) {
        CustomUserDetails principal = mock(CustomUserDetails.class);
        when(principal.getId()).thenReturn(id);
        when(principal.getUsername()).thenReturn("testuser");
        when(principal.getEmail()).thenReturn("test@test.com");
        when(principal.getAuthoritiesAsRoles()).thenReturn(List.of(ERole.ROLE_USER));
        return principal;
    }

    private void setSecurityContext(Authentication auth) {
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);
    }

    // ─── POST /login ──────────────────────────────────────────────────────────

    @Test
    void authenticateUser_Success_ReturnsPrincipalAndSetsCookies() {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("testuser")
                .password("password")
                .build();

        CustomUserDetails principal = mockPrincipal(1L);
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        RefreshToken refreshToken = mock(RefreshToken.class);
        when(refreshToken.getToken()).thenReturn("refresh-jwt");
        when(refreshTokenService.createRefreshToken(1L)).thenReturn(refreshToken);

        AuthSuccessResponse result = authController.authenticateUser(loginRequest, response);

        verify(cookieUtils).setAuthenticationCookies(response, principal, "refresh-jwt");
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals(authentication, SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void authenticateUser_BadCredentials_PropagatesException() {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("bad")
                .password("creds")
                .build();
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class,
                () -> authController.authenticateUser(loginRequest, response));
        verify(cookieUtils, never()).setAuthenticationCookies(any(HttpServletResponse.class), any(CustomUserDetails.class), anyString());
        verify(cookieUtils, never()).setAuthenticationCookies(any(HttpServletResponse.class), any(User.class), anyString());
    }

    // ─── GET /refresh ─────────────────────────────────────────────────────────

    @Test
    void refreshToken_Success_SetsNewCookies() {
        when(cookieUtils.getTokenFromCookie(request, "refreshToken")).thenReturn("old-jwt");

        User user = mock(User.class);
        when(user.getId()).thenReturn(2L);

        RefreshToken oldToken = mock(RefreshToken.class);
        when(oldToken.getToken()).thenReturn("old-jwt");
        when(oldToken.getUser()).thenReturn(user);
        when(refreshTokenService.verifyExpiration("old-jwt")).thenReturn(oldToken);

        RefreshToken newToken = mock(RefreshToken.class);
        when(newToken.getToken()).thenReturn("new-jwt");
        when(refreshTokenService.createRefreshToken(2L)).thenReturn(newToken);

        authController.refreshToken(request, response);

        verify(cookieUtils).setAuthenticationCookies(response, user, "new-jwt");
    }

    @Test
    void refreshToken_ExpiredToken_PropagatesException() {
        when(cookieUtils.getTokenFromCookie(request, "refreshToken")).thenReturn("expired-jwt");
        when(refreshTokenService.verifyExpiration("expired-jwt"))
                .thenThrow(new TokenRefreshException("expired-jwt", "Expired"));

        assertThrows(TokenRefreshException.class,
                () -> authController.refreshToken(request, response));
        verify(cookieUtils, never()).setAuthenticationCookies(any(HttpServletResponse.class), any(User.class), anyString());
    }

    // ─── POST /logout — Triple-Guard Matrix ──────────────────────────────────

    @Test
    void logoutUser_AuthenticatedNonAnonymousUser_DeletesTokenAndClearsCookies() {
        CustomUserDetails principal = mockPrincipal(3L);
        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(principal);
        setSecurityContext(authentication);

        authController.logoutUser(response);

        verify(refreshTokenService).deleteByUserId(3L);
        verify(cookieUtils).clearAuthenticationCookies(response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void logoutUser_NullAuthentication_OnlyClearsCookies() {
        setSecurityContext(null);

        authController.logoutUser(response);

        verify(refreshTokenService, never()).deleteByUserId(any());
        verify(cookieUtils).clearAuthenticationCookies(response);
    }

    @Test
    void logoutUser_NotAuthenticatedUser_OnlyClearsCookies() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(false);
        setSecurityContext(authentication);

        authController.logoutUser(response);

        verify(refreshTokenService, never()).deleteByUserId(any());
        verify(cookieUtils).clearAuthenticationCookies(response);
    }

    @Test
    void logoutUser_AnonymousAuthentication_OnlyClearsCookies() {
        AnonymousAuthenticationToken anonAuth = mock(AnonymousAuthenticationToken.class);
        when(anonAuth.isAuthenticated()).thenReturn(true);
        setSecurityContext(anonAuth);

        authController.logoutUser(response);

        verify(refreshTokenService, never()).deleteByUserId(any());
        verify(cookieUtils).clearAuthenticationCookies(response);
    }

    // ─── GET /verify — Triple-Guard Matrix ───────────────────────────────────

    @Test
    void verifyAuth_AuthenticatedNonAnonymousUser_Returns200WithBody() {
        CustomUserDetails principal = mockPrincipal(4L);
        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(principal);
        setSecurityContext(authentication);

        ResponseEntity<?> result = authController.verifyAuth();

        assertEquals(HttpStatus.OK.value(), result.getStatusCode().value());
        assertNotNull(result.getBody());
        assertInstanceOf(AuthSuccessResponse.class, result.getBody());
        assertEquals("testuser", ((AuthSuccessResponse) result.getBody()).getUsername());
    }

    @Test
    void verifyAuth_NullAuthentication_Returns401() {
        setSecurityContext(null);

        ResponseEntity<?> result = authController.verifyAuth();

        assertEquals(HttpStatus.UNAUTHORIZED.value(), result.getStatusCode().value());
    }

    @Test
    void verifyAuth_AnonymousAuthentication_Returns401() {
        AnonymousAuthenticationToken anonAuth = mock(AnonymousAuthenticationToken.class);
        when(anonAuth.isAuthenticated()).thenReturn(true);
        setSecurityContext(anonAuth);

        ResponseEntity<?> result = authController.verifyAuth();

        assertEquals(HttpStatus.UNAUTHORIZED.value(), result.getStatusCode().value());
    }
}
