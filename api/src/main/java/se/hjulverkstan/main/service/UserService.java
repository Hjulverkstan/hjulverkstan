package se.hjulverkstan.main.service;

import se.hjulverkstan.main.dto.responses.GetAllUserDto;
import se.hjulverkstan.main.dto.user.SignupRequest;
import se.hjulverkstan.main.dto.user.UpdateUserRequest;
import se.hjulverkstan.main.dto.user.UserDto;
import se.hjulverkstan.main.dto.user.UserResponse;

public interface UserService {

    UserDto createUser(SignupRequest signUpRequest);

    GetAllUserDto getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UpdateUserRequest user);

    UserResponse deleteUser(Long id);
}
