package se.hjulverkstan.main.security.utils;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import se.hjulverkstan.main.security.model.CustomUserDetails;
import se.hjulverkstan.main.security.model.ERole;

import java.security.Key;
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

    public String generateToken(String username, Long id, String email, List<ERole> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles.stream().map(ERole::name).toList());
        claims.put("id", id);
        claims.put("email", email);

        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String username) {
        LocalDateTime expiryDateTime = LocalDateTime.now().plus(jwtExpirationMs, ChronoUnit.MILLIS);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(Date.from(expiryDateTime.atZone(ZoneId.systemDefault()).toInstant()))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public CustomUserDetails extractAsPrincipal (String token) {
        String username = extractClaim(token, Claims::getSubject);
        Long id = extractClaim(token, claims -> claims.get("id", Long.class));
        String email = extractClaim(token, claims -> claims.get("email", String.class));

        List<String> roles = extractClaim(token, claims -> claims.get("roles", List.class));
        List<SimpleGrantedAuthority> authorities = roles.stream().map(SimpleGrantedAuthority::new).toList();

        return new CustomUserDetails(id, username, email, authorities);
    }

    public boolean validateToken(String token) {
        return !isTokenExpired(token) && isTokenSignatureValid(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private boolean isTokenSignatureValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
