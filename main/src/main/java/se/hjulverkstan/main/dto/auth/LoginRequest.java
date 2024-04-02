package se.hjulverkstan.main.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginRequest {

    @NotBlank
    private String username;
    @NotBlank
    private String password;
}
