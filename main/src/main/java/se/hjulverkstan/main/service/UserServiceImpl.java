package se.hjulverkstan.main.service;

import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.AlreadyUsedException;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.responses.GetAllUserDto;
import se.hjulverkstan.main.dto.user.SignupRequest;
import se.hjulverkstan.main.dto.user.UserResponse;
import se.hjulverkstan.main.model.Role;
import se.hjulverkstan.main.model.User;
import se.hjulverkstan.main.repository.RoleRepository;
import se.hjulverkstan.main.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
    }


    public static String ELEMENT_NAME = "User";

    @Override
    public UserResponse createUser(SignupRequest signUpRequest) {

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new AlreadyUsedException("Error: Username is already in use!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new AlreadyUsedException("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = signUpRequest.getRoles().stream().map(eRole -> roleRepository
                .findByName(eRole)
                .orElseThrow(() -> new ElementNotFoundException("Role"))
        ).collect(Collectors.toSet());

        user.setRoles(roles);
        userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .build();
    }


    @Override
    public GetAllUserDto getAllUsers() {
        List<UserResponse> userDtoList = new ArrayList<>();
        userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .forEach(user -> {
                    UserResponse userResponse = UserResponse.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                            .createdAt(user.getCreatedAt())
                            .updatedAt(user.getUpdatedAt())
                            .build();
                    userDtoList.add(userResponse);
                });
        GetAllUserDto getAllUserDto = new GetAllUserDto();
        getAllUserDto.setUsers(userDtoList);

        return getAllUserDto;
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .build();
    }

    @Override
    public UserResponse updateUser(Long id, SignupRequest userDetail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));
        user.setUsername(userDetail.getUsername());
        user.setPassword(userDetail.getPassword());
        user.setEmail(userDetail.getEmail());

        Set<Role> roles = userDetail.getRoles().stream().map(eRole -> roleRepository
                .findByName(eRole)
                .orElseThrow(() -> new ElementNotFoundException("Role"))
        ).collect(Collectors.toSet());

        user.setRoles(roles);
        User updateUser = userRepository.save(user);

        return UserResponse.builder()
                .id(updateUser.getId())
                .username(updateUser.getUsername())
                .email(updateUser.getEmail())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .build();
    }

    @Override
    public UserResponse deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));
        userRepository.deleteById(id);
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .build();
    }
}
