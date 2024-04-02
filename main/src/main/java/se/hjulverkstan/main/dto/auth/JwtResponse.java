package se.hjulverkstan.main.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtResponse {

    private String token;
    private String type = "Bearer";
    private String refreshToken;
    private Long id;
    private String username;
    private String email;
    private List<String> roles;

    public JwtResponse(String accessToken, String refreshToken, Long id, String username, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.refreshToken = refreshToken;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}