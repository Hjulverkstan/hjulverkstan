package se.hjulverkstan.main.service;

import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.AlreadyUsedException;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.responses.GetAllUserDto;
import se.hjulverkstan.main.dto.user.SignupRequest;
import se.hjulverkstan.main.dto.user.UserDto;
import se.hjulverkstan.main.model.Role;
import se.hjulverkstan.main.model.User;
import se.hjulverkstan.main.repository.RoleRepository;
import se.hjulverkstan.main.repository.UserRepository;

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
    public UserDto createUser(SignupRequest signUpRequest) {

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

        return new UserDto(user);
    }

    @Override
    public GetAllUserDto getAllUsers() {
        List<UserDto> responseList = userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(UserDto::new)
                .collect(Collectors.toList());

        return new GetAllUserDto(responseList);
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        return new UserDto(user);
    }

    @Override
    public UserDto updateUser(Long id, SignupRequest userDetail) {
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

        return new UserDto(updateUser);
    }

    @Override
    public UserDto deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));
        userRepository.deleteById(id);

        return new UserDto(user);
    }
}
