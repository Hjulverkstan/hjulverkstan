package se.hjulverkstan.main.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.security.model.CustomUserDetails;
import se.hjulverkstan.main.security.model.ERole;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthSuccessResponse {
    private Long id;
    private String username;
    private String email;
    private List<ERole> roles;

    public AuthSuccessResponse(CustomUserDetails principal) {
        this.id = principal.getId();
        this.username = principal.getUsername();
        this.email = principal.getEmail();
        this.roles = principal.getAuthoritiesAsRoles();
    }
}