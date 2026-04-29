package se.hjulverkstan.main.security.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import se.hjulverkstan.main.security.model.CustomUserDetails;
import se.hjulverkstan.main.security.model.ERole;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class JwtUtils {
    @Value("${saveChild.app.jwtSecret}")
    private String jwtSecret;

    @Value("${saveChild.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateToken(String username, Long id, String email, List<ERole> roles, Long locationId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles.stream().map(ERole::name).toList());
        claims.put("id", id);
        claims.put("email", email);
        claims.put("locationId", locationId);

        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String username) {
        LocalDateTime expiryDateTime = LocalDateTime.now().plus(jwtExpirationMs, ChronoUnit.MILLIS);

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date())
                .expiration(Date.from(expiryDateTime.atZone(ZoneId.systemDefault()).toInstant()))
                .signWith(getSignKey())
                .compact();
    }

    public CustomUserDetails extractAsPrincipal(String token) {
        Claims claims = extractAllClaims(token);

        String username = claims.getSubject();
        Long id = claims.get("id", Long.class);
        String email = claims.get("email", String.class);
        Long locationId = claims.get("locationId", Long.class);

        @SuppressWarnings("unchecked")
        List<String> roles = claims.get("roles", List.class);
        List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();

        return new CustomUserDetails(id, username, email, authorities, locationId);
    }

    public boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}