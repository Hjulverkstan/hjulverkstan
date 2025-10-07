package se.hjulverkstan.main.feature.user;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.AlreadyUsedException;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.security.model.Role;
import se.hjulverkstan.main.security.repository.RoleRepository;
import se.hjulverkstan.main.shared.ListResponseDto;
import se.hjulverkstan.main.shared.ValidationUtils;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;

    public ListResponseDto<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return new ListResponseDto<>(users.stream().map(UserDto::new).toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("User"));
        return new UserDto(user);
    }

    @Transactional
    public UserDto createUser(UserDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new AlreadyUsedException("Error: Username is already in use!");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new AlreadyUsedException("Error: Email is already in use!");
        }

        User user = dto.applyToEntity(new User(), encoder);
        applyRelationsFromDto(user, dto);
        userRepository.save(user);

        return new UserDto(user);
    }

    @Transactional
    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("User"));

        dto.applyToEntity(user, encoder);
        applyRelationsFromDto(user, dto);

        userRepository.save(user);
        return new UserDto(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("User"));
        userRepository.delete(user);
    }

    private void applyRelationsFromDto (User user, UserDto dto) {
        List<Role> roles = roleRepository.findAllByNameIn(dto.getRoles());
        ValidationUtils.validateNoMissing(dto.getRoles(), roles, Role::getName, Role.class);

        user.setRoles(roles);
    }
}
