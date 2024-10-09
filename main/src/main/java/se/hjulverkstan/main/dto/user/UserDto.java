package se.hjulverkstan.main.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.user.ERole;

import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private Long id;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    transient private String password;

    @NotNull(message = "Roles is required, set empty array for no roles")
    private Set<ERole> roles = new HashSet<>();
}
