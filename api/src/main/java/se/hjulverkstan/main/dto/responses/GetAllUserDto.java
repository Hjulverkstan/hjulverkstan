package se.hjulverkstan.main.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.dto.user.UserDto;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllUserDto {
    private List<UserDto> users;
}
