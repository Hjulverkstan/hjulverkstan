package se.hjulverkstan.main.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import se.hjulverkstan.main.dto.auth.LoginRequest;
import se.hjulverkstan.main.dto.auth.UserDetails;
import se.hjulverkstan.main.security.jwt.JwtUtils;
import se.hjulverkstan.main.security.services.AuthService;
import se.hjulverkstan.main.security.services.UserDetailsServiceImplementation;
import se.hjulverkstan.main.service.CookieService;
import se.hjulverkstan.Exceptions.TokenRefreshException;

import jakarta.servlet.http.Cookie;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class)
class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper = new ObjectMapper();

    @MockBean
    private AuthService authService;

    @MockBean
    private CookieService cookieService;

    @MockBean
    private UserDetailsServiceImplementation userDetailsService;

    @MockBean
    private JwtUtils jwtUtils;

    @Test
    @WithMockUser(roles = {"USER"})
    void testVerifyAuth_Success() throws Exception {
        UserDetails userDetails = UserDetails.builder()
                .id(1L)
                .username("user@example.com")
                .email("user@example.com")
                .roles(List.of("ROLE_USER"))
                .build();
        when(authService.verifyAuth()).thenReturn(userDetails);

        mockMvc.perform(get("/v1/auth/verify"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.username").value("user@example.com"));
    }

    @Test
    void testAuthenticateUser_EmptyPassword() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("user@example.com")
                .password("") // or null?
                .build();

        mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAuthenticateUser_InactiveUser() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("inactive@example.com")
                .password("password")
                .build();
        when(authService.login(any(LoginRequest.class))).thenThrow(new RuntimeException("Account is inactive"));

        mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.description").value("Internal server error"));
    }

    @Test
    void testAuthenticateUser_UnknownFieldInJson() throws Exception {
        String json = "{\"email\": \"user@example.com\", \"password\": \"password\", \"unexpected\": \"value\"}";

        mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAuthenticateUser_PasswordAsInt() throws Exception {
        String json = "{\"email\": \"user@example.com\", \"password\": 123456}";

        mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("bad_request"));
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void testServiceViolation_LogoutWithInvalidId() throws Exception {
        doThrow(new RuntimeException("Invalid user ID"))
                .when(authService).signOut(999L);

        mockMvc.perform(post("/v1/auth/signout/999"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.description").value("Internal server error"));
    }

    @Test
    void testRefreshToken_MalformedCookieName() throws Exception {
        Cookie malformedCookie = new Cookie("refresh_Token", "somevalue");

        mockMvc.perform(get("/v1/auth/refreshtoken")
                        .cookie(malformedCookie))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAuthenticateUser_Success() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("user@example.com")
                .password("password")
                .build();

        UserDetails userDetails = UserDetails.builder()
                .id(1L)
                .username("user@example.com")
                .email("user@example.com")
                .roles(List.of("ROLE_USER"))
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(userDetails);

        mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@example.com"));
    }

    @Test
    @SuppressWarnings("all")
    void testAuthenticateUser_InvalidJson() throws Exception {
        mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("INVALID_JSON"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("bad_request"));
    }

    @Test
    void testAuthenticateUser_MissingFields() throws Exception {
        String json = "{\"email\":\"\"}";

        mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.description").exists());
    }

    @Test
    void testRefreshToken_Success() throws Exception {
        Cookie refreshToken = new Cookie("refreshToken", "valid-token");

        doNothing().when(cookieService).refreshToken(any(), eq("valid-token"));

        mockMvc.perform(get("/v1/auth/refreshtoken")
                        .cookie(refreshToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Refresh successful"));
    }

    @Test
    void testRefreshToken_MissingCookie() throws Exception {
        mockMvc.perform(get("/v1/auth/refreshtoken"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cookies are empty or null"));
    }

    @Test
    void testRefreshToken_InvalidToken() throws Exception {
        Cookie refreshToken = new Cookie("refreshToken", "invalid-token");
        doThrow(new TokenRefreshException("invalid-token", "Invalid or expired token")).when(cookieService).refreshToken(any(), eq("invalid-token"));

        mockMvc.perform(get("/v1/auth/refreshtoken")
                        .cookie(refreshToken))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.description").value("Invalid or expired token"));
    }

    @Test
    void testRefreshToken_TamperedCookie() throws Exception {
        Cookie tamperedCookie = new Cookie("refreshToken", "tampered!@#");
        doThrow(new TokenRefreshException("tampered!@#", "Tampered token"))
                .when(cookieService).refreshToken(any(), eq("tampered!@#"));

        mockMvc.perform(get("/v1/auth/refreshtoken")
                        .cookie(tamperedCookie))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.description").value("Tampered token"));
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void testLogoutUser_Success() throws Exception {
        when(authService.signOut(1L)).thenReturn(new se.hjulverkstan.main.dto.MessageResponse("Signed out successfully"));
        doNothing().when(cookieService).clearAuthenticationCookies(any());

        mockMvc.perform(post("/v1/auth/signout/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Signed out successfully"));
    }

    @Test
    void testVerifyAuth_Unauthenticated() throws Exception {
        mockMvc.perform(get("/v1/auth/verify"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void testLogin_CsrfMissing() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("user@example.com")
                .password("password")
                .build();

        mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testRefreshToken_MissingHeader() throws Exception {
        Cookie refreshToken = new Cookie("refreshToken", "valid-token");
        doNothing().when(cookieService).refreshToken(any(), eq("valid-token"));

        mockMvc.perform(get("/v1/auth/refreshtoken")
                        .cookie(refreshToken)
                        .header("X-Custom-Header", ""))
                .andExpect(status().isOk());
    }

    @Test
    @WithAnonymousUser
    void testAnonymousUser_TryingToLogout_ShouldBeForbidden() throws Exception {
        mockMvc.perform(post("/v1/auth/signout/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithAnonymousUser
    void testAnonymousUser_VerifyAuth_ShouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/v1/auth/verify"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testJwtManipulation_ShouldReturnUnauthorized() throws Exception {
        Cookie jwt = new Cookie("jwt", "manipulated-token");

        mockMvc.perform(get("/v1/auth/verify")
                        .cookie(jwt))
                .andExpect(status().isUnauthorized());
    }

}
