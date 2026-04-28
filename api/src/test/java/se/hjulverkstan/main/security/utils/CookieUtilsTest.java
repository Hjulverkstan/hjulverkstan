package se.hjulverkstan.main.security.utils;
 
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.user.User;
import se.hjulverkstan.main.security.model.CustomUserDetails;
import se.hjulverkstan.main.security.model.ERole;
 
import java.util.List;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
 
@ExtendWith(MockitoExtension.class)
class CookieUtilsTest {
 
    @Mock
    private JwtUtils jwtUtils;
 
    @Mock
    private HttpServletRequest request;
 
    @Mock
    private HttpServletResponse response;
 
    @InjectMocks
    private CookieUtils cookieUtils;
 
    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(cookieUtils, "jwtExpirationMs", 3600000); // 1 hour
        ReflectionTestUtils.setField(cookieUtils, "jwtRefreshExpirationMs", 7200000); // 2 hours
    }
 
    @Test
    void setAuthenticationCookies_WithUser_Success() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        when(user.getUsername()).thenReturn("testuser");
        when(user.getEmail()).thenReturn("test@test.com");
        when(user.getRolesDirectly()).thenReturn(List.of(ERole.ROLE_USER));
        
        Location location = mock(Location.class);
        when(location.getId()).thenReturn(10L);
        when(user.getDefaultLocation()).thenReturn(location);
 
        when(jwtUtils.generateToken(anyString(), anyLong(), anyString(), anyList(), anyLong()))
                .thenReturn("mock-jwt");
 
        cookieUtils.setAuthenticationCookies(response, user, "mock-refresh-jwt");
 
        ArgumentCaptor<String> headerCaptor = ArgumentCaptor.forClass(String.class);
        verify(response, times(2)).addHeader(eq("Set-Cookie"), headerCaptor.capture());
 
        List<String> cookies = headerCaptor.getAllValues();
        
        // Exact Max-Age math: 3600000 / 1000 - 30 = 3600 - 30 = 3570
        assertTrue(cookies.getFirst().contains("accessToken=mock-jwt"));
        assertTrue(cookies.getFirst().contains("HttpOnly"));
        assertTrue(cookies.getFirst().contains("Secure"));
        assertTrue(cookies.get(0).contains("SameSite=Strict"));
        assertTrue(cookies.get(0).contains("Max-Age=3570"));
 
        // Max-Age math for refresh: 7200000 / 1000 - 30 = 7170
        assertTrue(cookies.get(1).contains("refreshToken=mock-refresh-jwt"));
        assertTrue(cookies.get(1).contains("SameSite=Strict"));
        assertTrue(cookies.get(1).contains("Max-Age=7170"));
    }
 
    @Test
    void setAuthenticationCookies_WithUserNoDefaultLocation_Success() {
        User user = mock(User.class);
        when(user.getRolesDirectly()).thenReturn(List.of(ERole.ROLE_USER));
        when(user.getDefaultLocation()).thenReturn(null);
 
        when(jwtUtils.generateToken(any(), any(), any(), any(), isNull()))
                .thenReturn("mock-jwt");
 
        cookieUtils.setAuthenticationCookies(response, user, "mock-refresh-jwt");
 
        verify(jwtUtils).generateToken(any(), any(), any(), any(), isNull());
    }
 
    @Test
    void setAuthenticationCookies_WithPrincipal_Success() {
        CustomUserDetails principal = mock(CustomUserDetails.class);
        when(principal.getAuthoritiesAsRoles()).thenReturn(List.of(ERole.ROLE_USER));
        when(principal.getUsername()).thenReturn("testuser");
 
        when(jwtUtils.generateToken(any(), any(), any(), any(), any()))
                .thenReturn("mock-jwt");
 
        cookieUtils.setAuthenticationCookies(response, principal, "mock-refresh-jwt");
 
        verify(response, times(2)).addHeader(eq("Set-Cookie"), anyString());
    }
 
    @Test
    void applyCookies_WithPipelineRole_UsesSameSiteLax() {
        User user = mock(User.class);
        when(user.getRolesDirectly()).thenReturn(List.of(ERole.ROLE_PIPELINE));
 
        when(jwtUtils.generateToken(any(), any(), any(), any(), any()))
                .thenReturn("mock-jwt");
 
        cookieUtils.setAuthenticationCookies(response, user, "refresh");
 
        ArgumentCaptor<String> headerCaptor = ArgumentCaptor.forClass(String.class);
        verify(response, times(2)).addHeader(eq("Set-Cookie"), headerCaptor.capture());
 
        assertTrue(headerCaptor.getAllValues().getFirst().contains("SameSite=Lax"));
    }
 
    @Test
    void clearAuthenticationCookies_Success() {
        cookieUtils.clearAuthenticationCookies(response);
 
        ArgumentCaptor<String> headerCaptor = ArgumentCaptor.forClass(String.class);
        verify(response, times(2)).addHeader(eq("Set-Cookie"), headerCaptor.capture());
 
        List<String> cookies = headerCaptor.getAllValues();
        assertTrue(cookies.get(0).contains("accessToken=;"));
        assertTrue(cookies.get(0).contains("Max-Age=0"));
        assertTrue(cookies.get(1).contains("refreshToken=;"));
        assertTrue(cookies.get(1).contains("Max-Age=0"));
    }
 
    @Test
    void getTokenFromCookie_WhenCookiesExist_ReturnsValue() {
        Cookie c1 = new Cookie("other", "val1");
        Cookie c2 = new Cookie("testToken", "targetVal");
        when(request.getCookies()).thenReturn(new Cookie[]{c1, c2});
 
        assertEquals("targetVal", cookieUtils.getTokenFromCookie(request, "testToken"));
    }
 
    @Test
    void getTokenFromCookie_WhenCookiesExistButNotTarget_ReturnsNull() {
        Cookie c1 = new Cookie("other", "val1");
        when(request.getCookies()).thenReturn(new Cookie[]{c1});
 
        assertNull(cookieUtils.getTokenFromCookie(request, "testToken"));
    }
 
    @Test
    void getTokenFromCookie_WhenCookiesNull_ReturnsNull() {
        when(request.getCookies()).thenReturn(null);
 
        assertNull(cookieUtils.getTokenFromCookie(request, "testToken"));
    }
}
