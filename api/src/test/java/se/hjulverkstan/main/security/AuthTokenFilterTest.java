package se.hjulverkstan.main.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import se.hjulverkstan.main.security.model.CustomUserDetails;
import se.hjulverkstan.main.security.services.CustomUserDetailsService;
import se.hjulverkstan.main.security.utils.CookieUtils;
import se.hjulverkstan.main.security.utils.JwtUtils;

import java.io.IOException;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthTokenFilterTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private CookieUtils cookieUtils;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    private MockedStatic<SecurityContextHolder> mockedSecurityContextHolder;

    @BeforeEach
    void setUp() {
        mockedSecurityContextHolder = mockStatic(SecurityContextHolder.class);
        mockedSecurityContextHolder.when(SecurityContextHolder::getContext).thenReturn(securityContext);
    }

    @AfterEach
    void tearDown() {
        mockedSecurityContextHolder.close();
    }

    @Test
    @DisplayName("Should authenticate user and continue chain when valid token is provided")
    void shouldAuthenticateUser_whenValidTokenProvided() throws ServletException, IOException {
        // Arrange
        String token = "valid-token";
        CustomUserDetails userFromToken = mock(CustomUserDetails.class);
        CustomUserDetails userFromDb = mock(CustomUserDetails.class);
        
        when(cookieUtils.getTokenFromCookie(request, "accessToken")).thenReturn(token);
        when(jwtUtils.validateToken(token)).thenReturn(true);
        when(jwtUtils.extractAsPrincipal(token)).thenReturn(userFromToken);
        when(userFromToken.getUsername()).thenReturn("testuser");
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userFromDb);
        when(userFromDb.getAuthorities()).thenReturn(Collections.emptyList());

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(securityContext, times(1)).setAuthentication(any(UsernamePasswordAuthenticationToken.class));
        verify(filterChain, times(1)).doFilter(request, response);
        verify(cookieUtils, never()).clearAuthenticationCookies(any());
    }

    @Test
    @DisplayName("Should skip authentication and continue chain when token is missing")
    void shouldSkipAuthentication_whenTokenIsMissing() throws ServletException, IOException {
        // Arrange
        when(cookieUtils.getTokenFromCookie(request, "accessToken")).thenReturn(null);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verifyNoInteractions(jwtUtils, userDetailsService);
        verify(securityContext, never()).setAuthentication(any());
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    @DisplayName("Should clear context and continue chain when token is invalid")
    void shouldClearContext_whenTokenIsInvalid() throws ServletException, IOException {
        // Arrange
        String token = "invalid-token";
        when(cookieUtils.getTokenFromCookie(request, "accessToken")).thenReturn(token);
        when(jwtUtils.validateToken(token)).thenReturn(false);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        mockedSecurityContextHolder.verify(SecurityContextHolder::clearContext, times(1));
        verify(cookieUtils, times(1)).clearAuthenticationCookies(response);
        verify(securityContext, never()).setAuthentication(any());
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    @DisplayName("Should clear context and continue chain when exception occurs in auth logic")
    void shouldClearContext_whenExceptionOccurs() throws ServletException, IOException {
        // Arrange
        String token = "valid-token";
        when(cookieUtils.getTokenFromCookie(request, "accessToken")).thenReturn(token);
        when(jwtUtils.validateToken(token)).thenReturn(true);
        when(jwtUtils.extractAsPrincipal(token)).thenThrow(new RuntimeException("Extraction failed"));

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        mockedSecurityContextHolder.verify(SecurityContextHolder::clearContext, times(1));
        verify(cookieUtils, times(1)).clearAuthenticationCookies(response);
        verify(securityContext, never()).setAuthentication(any());
        verify(filterChain, times(1)).doFilter(request, response);
    }
}
