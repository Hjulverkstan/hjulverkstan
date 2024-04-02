package se.hjulverkstan.main.service;

import se.hjulverkstan.main.dto.responses.GetAllUserDto;
import se.hjulverkstan.main.dto.user.SignupRequest;
import se.hjulverkstan.main.dto.user.UserDto;
import se.hjulverkstan.main.dto.user.UserResponse;

public interface UserService {

    UserResponse createUser(SignupRequest signUpRequest);

    GetAllUserDto getAllUsers();

    UserDto getUserById(Long id);

    UserResponse updateUser(Long id, SignupRequest userDetail);

    UserDto deleteUser(Long id);
}
