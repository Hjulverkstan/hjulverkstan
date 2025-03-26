package se.hjulverkstan.main.service;

import se.hjulverkstan.main.dto.responses.GetAllUserDto;
import se.hjulverkstan.main.dto.user.SignupRequest;
import se.hjulverkstan.main.dto.user.UserDto;

public interface UserService {

    UserDto createUser(SignupRequest signUpRequest);

    GetAllUserDto getAllUsers();

    UserDto getUserById(Long id);

    UserDto updateUser(Long id, SignupRequest userDetail);

    UserDto deleteUser(Long id);
}
