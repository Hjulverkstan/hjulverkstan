package se.hjulverkstan.main.feature.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import se.hjulverkstan.main.security.model.ERole;
import se.hjulverkstan.main.security.model.Role;
import se.hjulverkstan.main.shared.auditable.AuditableDto;

import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class UserDto extends AuditableDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Password is required")
    @Size(min = 3, max = 120)
    transient private String password;

    @NotNull(message = "Roles is required, set empty array for no roles")
    private List<ERole> roles = new ArrayList<>();

    public UserDto(User user) {
        super(user);

        id = user.getId();
        username = user.getUsername();
        password = user.getPassword();
        email = user.getEmail();
        roles = user.getRolesDirectly();
    }

    // Roles should be set on service level
    public User applyToEntity (User user, List<Role> roles, String password) {
       user.setUsername(username);
       user.setEmail(email);

       user.setRoles(roles);
       if (password != null) user.setPassword(password);

       return user;
    }
}
