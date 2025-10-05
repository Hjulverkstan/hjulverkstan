package se.hjulverkstan.main.feature.user;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class GetAllUserDto {
    private List<UserDto> users;

    public GetAllUserDto(List<User> users) {
        this.users = users.stream().map(UserDto::new).toList();
    }
}
