package se.hjulverkstan.main.dto.user;

import lombok.*;
import se.hjulverkstan.main.model.ERole;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Set<ERole> roles;

    // Meta data
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;
}