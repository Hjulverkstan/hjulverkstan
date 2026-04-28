package se.hjulverkstan.main.security.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import se.hjulverkstan.main.security.model.CustomUserDetails;
import se.hjulverkstan.main.security.model.ERole;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        String validSecret = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1";
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", validSecret);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000); // 1 hour
    }

    @Test
    @DisplayName("Should generate and correctly extract exact custom user details mappings")
    void shouldGenerateAndExtractToken_preservingAllClaimsCorrectly() {
        // Arrange
        String username = "testuser";
        Long id = 42L;
        String email = "test@example.com";
        List<ERole> roles = List.of(ERole.ROLE_ADMIN);
        Long locationId = 7L;

        // Act
        String token = jwtUtils.generateToken(username, id, email, roles, locationId);
        CustomUserDetails userDetails = jwtUtils.extractAsPrincipal(token);

        // Assert
        assertNotNull(token);
        assertNotNull(userDetails);
        
        assertEquals(id, userDetails.getId());
        assertEquals(username, userDetails.getUsername());
        assertEquals(email, userDetails.getEmail());
        assertEquals(locationId, userDetails.getLocationId());
        
        // Assert deep exact match for roles
        assertEquals(1, userDetails.getAuthorities().size());
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(ERole.ROLE_ADMIN.name())));
        
        assertTrue(jwtUtils.validateToken(token));
    }

    @Test
    @DisplayName("Should cleanly return false when validation encounters an expired token")
    void shouldHandleExpiredTokens_basedOnCurrentLogic() {
        // Arrange
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", -1000); // Expiration in the past
        String token = jwtUtils.generateToken("user", 1L, "email@email.com", List.of(ERole.ROLE_ADMIN), 1L);

        // Act
        boolean isValid = jwtUtils.validateToken(token);

        // Assert
        assertFalse(isValid, "Token should be correctly rejected as expired (false)");
    }

    @Test
    @DisplayName("Should return false when token signature is functionally flawless but forged")
    void shouldReturnFalse_whenSignatureIsForged() {
        // Arrange
        String forgedSecret = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1FORGEDFORGEDFORGED";
        byte[] keyBytes = Decoders.BASE64.decode(forgedSecret);
        Key forgedKey = Keys.hmacShaKeyFor(keyBytes);

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", 1L);
        claims.put("email", "fake@example.com");
        claims.put("roles", List.of(ERole.ROLE_ADMIN.name()));

        String forgedToken = Jwts.builder()
                .setClaims(claims)
                .setSubject("fakeuser")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 3600000))
                .signWith(forgedKey, SignatureAlgorithm.HS256)
                .compact();

        // Act
        boolean isValid = jwtUtils.validateToken(forgedToken);

        // Assert
        assertFalse(isValid, "Forged token signature should invalidate the payload");
    }

    @Test
    @DisplayName("Should return false when processing totally malformed structures")
    void shouldReturnFalse_whenTokenIsMalformed() {
        // Arrange
        String malformedToken = "not.a.real.jwt";

        // Act
        boolean isValid = jwtUtils.validateToken(malformedToken);

        // Assert
        assertFalse(isValid, "Malformed string should return false without crashing");
    }
    
    @Test
    @DisplayName("Should return false when token acts as null")
    void shouldReturnFalse_whenTokenIsNull() {
        // Act
        boolean isValid = jwtUtils.validateToken(null);

        // Assert
        assertFalse(isValid, "Null token should safely return false");
    }
}
