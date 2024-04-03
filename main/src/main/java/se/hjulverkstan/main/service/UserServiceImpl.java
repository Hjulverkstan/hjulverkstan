package se.hjulverkstan.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.AlreadyUsedException;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.responses.GetAllUserDto;
import se.hjulverkstan.main.dto.user.SignupRequest;
import se.hjulverkstan.main.dto.user.UserDto;
import se.hjulverkstan.main.dto.user.UserResponse;
import se.hjulverkstan.main.model.ERole;
import se.hjulverkstan.main.model.Role;
import se.hjulverkstan.main.model.User;
import se.hjulverkstan.main.repository.RoleRepository;
import se.hjulverkstan.main.repository.UserRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService{


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
            throw new AlreadyUsedException("Error: Username is already in use!");
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                if (role.equals("admin")) {
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);
                } else {
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles()).build();
    }



    @Override
    public GetAllUserDto getAllUsers() {
        List<UserDto> userDtoList = new ArrayList<>();
        userRepository.findAll().forEach(user -> {
            UserDto userDto = UserDto.builder()
                    .roles(user.getRoles())
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .email(user.getEmail())
                    .id(user.getId()).build();
            userDtoList.add(userDto);
        });
        GetAllUserDto getAllUserDto = new GetAllUserDto();
        getAllUserDto.setUsers(userDtoList);

        return getAllUserDto;
    }
    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));
        return UserDto.builder().id(user.getId()).username(user.getUsername()).password(user.getPassword())
                .email(user.getEmail()).roles(user.getRoles()).build();
    }

    @Override
    public UserResponse updateUser(Long id, SignupRequest userDetail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));
        user.setUsername(userDetail.getUsername());
        user.setPassword(userDetail.getPassword());
        user.setEmail(userDetail.getEmail());

        Set<String> strRoles = userDetail.getRoles();
        Set<Role> roles = new HashSet<>();

        strRoles.forEach(role -> {
                if (role.equals("admin")) {
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);
                } else {
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                }
            });

        user.setRoles(roles);
        User updateUser = userRepository.save(user);

        return UserResponse.builder()
                .id(updateUser.getId())
                .username(updateUser.getUsername())
                .email(updateUser.getEmail())
                .roles(updateUser.getRoles()).build();
    }

    @Override
    public UserDto deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));
        userRepository.deleteById(id);
        return UserDto.builder().id(user.getId()).username(user.getUsername()).password(user.getPassword())
                .email(user.getEmail()).roles(user.getRoles()).build();
    }
}
