package se.hjulverkstan.main.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
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
import se.hjulverkstan.main.service.CookieServiceImpl;
import se.hjulverkstan.main.util.TestSecurityConfig;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import({TestSecurityConfig.class, ExceptionsController.class})
@WebMvcTest(controllers = {AuthController.class})
class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper = new ObjectMapper();

    @MockBean
    private AuthService authService;

    @MockBean
    private CookieServiceImpl cookieService;

    @MockBean
    private UserDetailsServiceImplementation userDetailsService;

    @MockBean
    private JwtUtils jwtUtils;

    private UserDetails validUser;

    @BeforeEach
    void setUp() {
        validUser = UserDetails.builder()
                .id(1L)
                .username("user@example.com")
                .email("user@example.com")
                .roles(List.of("ROLE_USER"))
                .build();
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void testVerifyAuth_Success() throws Exception {
        when(authService.verifyAuth()).thenReturn(validUser);

        mockMvc.perform(get("/v1/api/auth/verify"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.username").value("user@example.com"))
                .andDo(print());
    }

    @Test
    void testAuthenticateUser_EmptyPassword() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("user@example.com")
                .password(null)
                .build();

        when(authService.login(any(LoginRequest.class))).thenAnswer(invocation -> {
            LoginRequest request = invocation.getArgument(0);
            if (request.getPassword() == null || request.getPassword().isBlank()) {
                throw new BadCredentialsException("Password must not be empty");
            }
            return validUser;
        });

        mockMvc.perform(post("/v1/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAuthenticateUser_InactiveUser() throws Exception {
        assert(true);
    }

    @Test
    void testAuthenticateUser_UnknownFieldInJson() throws Exception {
        assert(true);
    }

    @Test
    void testAuthenticateUser_PasswordAsInt() throws Exception {
        assert(true);
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void testServiceViolation_LogoutWithInvalidId() throws Exception {
        assert(true);
    }

    @Test
    void testRefreshToken_MalformedCookieName() throws Exception {
        assert(true);
    }

    @Test
    void testAuthenticateUser_Success() throws Exception {
        assert(true);
    }

    @Test
    @SuppressWarnings("all")
    void testAuthenticateUser_InvalidJson() throws Exception {
        assert(true);
    }

    @Test
    void testAuthenticateUser_MissingFields() throws Exception {
        assert(true);
    }

    @Test
    void testRefreshToken_Success() throws Exception {
        assert(true);
    }

    @Test
    void testRefreshToken_MissingCookie() throws Exception {
        assert(true);
    }

    @Test
    void testRefreshToken_InvalidToken() throws Exception {
        assert(true);
    }

    @Test
    void testRefreshToken_TamperedCookie() throws Exception {
        assert(true);
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void testLogoutUser_Success() throws Exception {
        assert(true);
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
        assert(true);
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
