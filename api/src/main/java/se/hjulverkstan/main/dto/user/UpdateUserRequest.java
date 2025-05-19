package se.hjulverkstan.main.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import se.hjulverkstan.main.model.ERole;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UpdateUserRequest {
    private Long id;

    @NotBlank
    @Size(min = 3, max = 30)
    private String username;

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    @Size(min = 3, max = 120)
    private String password;

    private Set<ERole> roles;
}
