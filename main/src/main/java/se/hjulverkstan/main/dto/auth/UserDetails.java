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
public class UserDetails {
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
}