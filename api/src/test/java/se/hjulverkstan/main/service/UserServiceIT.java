package se.hjulverkstan.main.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;
import se.hjulverkstan.Exceptions.AlreadyUsedException;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.annotations.RepositoryTest;
import se.hjulverkstan.main.base.BaseJpaTest;
import se.hjulverkstan.main.dto.responses.GetAllUserDto;
import se.hjulverkstan.main.dto.user.SignupRequest;
import se.hjulverkstan.main.dto.user.UserDto;
import se.hjulverkstan.main.model.ERole;
import se.hjulverkstan.main.model.User;
import se.hjulverkstan.main.repository.UserRepository;
import se.hjulverkstan.main.util.TestWebSecurityConfig;

import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@RepositoryTest
@Import({UserServiceImpl.class, TestWebSecurityConfig.class})
@Sql(scripts = {
        "classpath:script/roles_missing.sql",
        "classpath:script/user.sql",
        "classpath:script/user_roles.sql",
})
public class UserServiceIT extends BaseJpaTest {

    @Autowired
    private UserService service;

    @Autowired
    private UserRepository userRepository;

    private static final Long USER_EXIST_ID = 1L;
    private static final Long USER_NOT_EXIST_ID = 999L;
    private static final String ROLE_NOT_FOUND = "Role Not Found";
    private static final String USER_NOT_FOUND = "User Not Found";

   /* // createUser happy path test
    @Test
    @DisplayName("Create user - happy path")
    void createUser_shouldPersistUser_whenRequiredDataProvided() {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newTestUser");
        signupRequest.setEmail("newtest@example.com");
        signupRequest.setPassword("Password123!");

        // Act

        // Assert
        assertThat(service.createUser(signupRequest))
                .isNotNull()
                .extracting(UserDto::getUsername)
                .isEqualTo("newTestUser");

        // Verify the user is in the database
        assertThat(userRepository.findByUsername("newTestUser"))
                .isPresent()
                .get()
                .extracting(User::getEmail)
                .isEqualTo("newtest@example.com");
    }

    // createUser happy path test but with non required data
    @Test
    @DisplayName("Create user - happy path")
    void createUser_shouldPersistUser_whenFullDataProvided() {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newTestUser");
        signupRequest.setEmail("newtest@example.com");
        signupRequest.setPassword("Password123!");
        signupRequest.setRoles(Set.of(ERole.ROLE_USER));

        // Act

        // Assert
        assertThat(service.createUser(signupRequest))
                .isNotNull()
                .extracting(UserDto::getUsername)
                .isEqualTo("newTestUser");

        // Verify the user is in the database
        assertThat(userRepository.findByUsername("newTestUser"))
                .isPresent()
                .get()
                .extracting(User::getEmail)
                .isEqualTo("newtest@example.com");
    }*/

    static Stream<Arguments> signupRequests() {
        SignupRequest minimal = new SignupRequest();
        minimal.setUsername("newTestUser");
        minimal.setEmail("newtest@example.com");
        minimal.setPassword("Password123!");

        SignupRequest withRoles = new SignupRequest();
        withRoles.setUsername("newTestUser");
        withRoles.setEmail("newtest@example.com");
        withRoles.setPassword("Password123!");
        withRoles.setRoles(Set.of(ERole.ROLE_USER));

        return Stream.of(
                Arguments.of("minimal required data", minimal),
                Arguments.of("full data with roles", withRoles)
        );
    }

    @ParameterizedTest(name = "Create user - {0}")
    @MethodSource("signupRequests")
    @DisplayName("createUser() should persist user when minimal data is provided, and createUser() should persist user when full data is provided")
    void createUser_shouldPersistUser_whenValidSignupRequestProvided(String label, SignupRequest signupRequest) {
        // Act
        UserDto result = service.createUser(signupRequest);

        // Assert
        assertThat(result)
                .isNotNull()
                .extracting(UserDto::getUsername)
                .isEqualTo("newTestUser");

        assertThat(userRepository.findByUsername("newTestUser"))
                .isPresent()
                .get()
                .extracting(User::getEmail)
                .isEqualTo("newtest@example.com");
    }


    // createUser error path test if possible, email exists
    @Test
    @DisplayName("createUser() should throw AlreadyUsedException when username already exists")
    void createUser_shouldThrowOrReject_whenUsernameExists() {
        // Arrange

        // Act

        // Assert
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("admin"); // Using existing username
        signupRequest.setEmail("new.email@example.com");
        signupRequest.setPassword("Password123!");

        // Act & Assert
        assertThatThrownBy(() -> service.createUser(signupRequest))
                .isInstanceOf(AlreadyUsedException.class)
                .hasMessageContaining("Error: Username is already in use!");
    }

    // createUser error path test if possible, username exitss
    @Test
    @DisplayName("createUser() should throw AlreadyUsedException when email already exists")
    void createUser_shouldThrowOrReject_whenEmailExists() {
        // Arrange
        String existingEmail = "admin@example.com";

        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newUniqueUser");
        signupRequest.setEmail(existingEmail); // Using existing email
        signupRequest.setPassword("Password123!");

        // Act & Assert
        assertThatThrownBy(() -> service.createUser(signupRequest))
                .isInstanceOf(AlreadyUsedException.class)
                .hasMessageContaining("Error: Email is already in use!");
    }

    // createUser error path test if possible, role does not exist, is it possible?
    @Test
    @DisplayName("createUser() should throw when role does not exist")
    void createUser_shouldThrowOrReject_whenRoleDoesNotExist() {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("roleTestUser");
        signupRequest.setEmail("roletest@example.com");
        signupRequest.setPassword("Password123!");
        signupRequest.setRoles(Set.of(ERole.ROLE_PIPELINE));

        // Act

        // Assert

        // Act & Assert
        assertThatThrownBy(() -> service.createUser(signupRequest))
                .hasMessageContaining(ROLE_NOT_FOUND);
    }

    // getAllUsers happy path test
    @Test
    @DisplayName("getAllUsers() should return all users")
    void getAllUsers_shouldReturnListOfUsers_whenUsersExist() {
        // Arrange
        String[] expectedUsernames = {"admin", "user", "christopher"};

        // Act
        GetAllUserDto getAllUserDto = service.getAllUsers();

        // Assert
        assertThat(getAllUserDto.getUsers())
                .isNotNull()
                .isNotEmpty()
                .hasSize(expectedUsernames.length)
                .extracting(UserDto::getUsername)
                .containsExactlyInAnyOrder(expectedUsernames);
    }

    //getUserById happy path test
    @Test
    @DisplayName("getUserById() should return user when ID exists")
    void getUserById_shouldReturnUser_whenIdIsValid() {
        // Arrange

        // Act

        // Assert
        assertThat(service.getUserById(USER_EXIST_ID))
                .isNotNull()
                .extracting(UserDto::getId, UserDto::getUsername, UserDto::getEmail)
                .containsExactly(USER_EXIST_ID, "christopher", "admin@example.com");
    }

    // getUserById error path, user does not exist
    @Test
    @DisplayName("getUserById() should throw ElementNotFoundException when user does not exist")
    void getUserById_shouldThrow_whenUserDoesNotExist() {
        // Arrange

        // Act & Assert
        assertThatThrownBy(() -> service.getUserById(USER_NOT_EXIST_ID))
                .isInstanceOf(ElementNotFoundException.class)
                .hasMessageContaining(USER_NOT_FOUND);
    }

    /*// updateUser happy path test
    @Test
    @DisplayName("Update user - happy path")
    void updateUser_shouldUpdateUser_whenValidDataAndUserExists() {
        // Arrange
        Long userId = 1L;

        // Verify the user exists before update
        assertThat(userRepository.findById(userId))
                .isPresent()
                .get()
                .extracting(User::getUsername, User::getEmail)
                .containsExactly("christopher", "admin@example.com");

        SignupRequest updateRequest = new SignupRequest();
        updateRequest.setUsername("christopher_updated");
        updateRequest.setEmail("updated@example.com");
        updateRequest.setPassword("NewPassword123!");
        // updateRequest.setRoles(Set.of(ERole.ROLE_USER));

        // Act

        // Assert
        assertThat(service.updateUser(userId, updateRequest))
                .isNotNull()
                .extracting(UserDto::getId, UserDto::getUsername, UserDto::getEmail)
                .containsExactly(userId, "christopher_updated", "updated@example.com");

        // Verify the database was updated
        assertThat(userRepository.findById(userId))
                .isPresent()
                .get()
                .extracting(User::getUsername, User::getEmail)
                .containsExactly("christopher_updated", "updated@example.com");
    }

    // updateUser happy path test
    @Test
    @DisplayName("Update user - happy path")
    void updateUser_shouldUpdateUser_whenAllDataAndUserExists() {
        // Arrange
        Long userId = 1L;

        // Verify the user exists before update
        assertThat(userRepository.findById(userId))
                .isPresent()
                .get()
                .extracting(User::getUsername, User::getEmail)
                .containsExactly("christopher", "admin@example.com");

        SignupRequest updateRequest = new SignupRequest();
        updateRequest.setUsername("christopher_updated");
        updateRequest.setEmail("updated@example.com");
        updateRequest.setPassword("NewPassword123!");
        updateRequest.setRoles(Set.of(ERole.ROLE_USER));

        // Act

        // Assert
        assertThat(service.updateUser(userId, updateRequest))
                .isNotNull()
                .extracting(UserDto::getId, UserDto::getUsername, UserDto::getEmail)
                .containsExactly(userId, "christopher_updated", "updated@example.com");

        // Verify the database was updated
        assertThat(userRepository.findById(userId))
                .isPresent()
                .get()
                .extracting(User::getUsername, User::getEmail)
                .containsExactly("christopher_updated", "updated@example.com");
    }*/

    static Stream<Arguments> updateUserRequests() {
        SignupRequest baseRequest = new SignupRequest();
        baseRequest.setUsername("christopher_updated");
        baseRequest.setEmail("updated@example.com");
        baseRequest.setPassword("NewPassword123!");

        SignupRequest withRoles = new SignupRequest();
        withRoles.setUsername("christopher_updated");
        withRoles.setEmail("updated@example.com");
        withRoles.setPassword("NewPassword123!");
        withRoles.setRoles(Set.of(ERole.ROLE_USER));

        return Stream.of(
                Arguments.of("without roles", baseRequest),
                Arguments.of("with roles", withRoles)
        );
    }

    @ParameterizedTest(name = "Update user - happy path ({0})")
    @MethodSource("updateUserRequests")
    @DisplayName("updateUser() should update user when valid data is provided without roles, updateUser() should update user when valid data is provided with roles")
    void updateUser_shouldUpdateUser_whenValidRequest(String label, SignupRequest updateRequest) {
        // Arrange

        assertThat(userRepository.findById(USER_EXIST_ID))
                .isPresent()
                .get()
                .extracting(User::getUsername, User::getEmail)
                .containsExactly("christopher", "admin@example.com");

        // Act & Assert
        assertThat(service.updateUser(USER_EXIST_ID, updateRequest))
                .isNotNull()
                .extracting(UserDto::getId, UserDto::getUsername, UserDto::getEmail)
                .containsExactly(USER_EXIST_ID, "christopher_updated", "updated@example.com");

        assertThat(userRepository.findById(USER_EXIST_ID))
                .isPresent()
                .get()
                .extracting(User::getUsername, User::getEmail)
                .containsExactly("christopher_updated", "updated@example.com");
    }

    // updateUser error path, user does not exist
    @Test
    @DisplayName("updateUser() should throw ElementNotFoundException when user does not exist")
    void updateUser_shouldThrow_whenUserDoesNotExist() {
        // Arrange
        SignupRequest updateRequest = new SignupRequest();
        updateRequest.setUsername("doesnt_matter");
        updateRequest.setEmail("doesntmatter@example.com");
        updateRequest.setPassword("Password123!");

        // Act & Assert
        assertThatThrownBy(() -> service.updateUser(USER_NOT_EXIST_ID, updateRequest))
                .isInstanceOf(ElementNotFoundException.class)
                .hasMessageContaining(USER_NOT_FOUND);
    }

    // updateUser error path, invalid data if possbile
    @Test
    @DisplayName("updateUser() should throw when role does not exist")
    void updateUser_shouldRejectUpdate_whenInvalidDataProvided() {
        // Arrange
        SignupRequest updateRequest = new SignupRequest();
        updateRequest.setUsername("christopher_updated");
        updateRequest.setEmail("updated@example.com");
        updateRequest.setPassword("NewPassword123!");
        updateRequest.setRoles(Set.of(ERole.ROLE_PIPELINE));

        // Act

        // Assert
        assertThatThrownBy(() -> service.updateUser(USER_EXIST_ID, updateRequest))
                .hasMessageContaining(ROLE_NOT_FOUND);
    }

    // deleteUser happy path test
    @Test
    @DisplayName("deleteUser() should delete user when user exists")
    void deleteUser_shouldRemoveUser_whenUserExists() {
        // Arrange

        // Verify user exists before deletion
        assertThat(userRepository.findById(USER_EXIST_ID)).isPresent();

        // Act

        // Assert
        assertThat(service.deleteUser(USER_EXIST_ID))
                .isNotNull()
                .extracting(UserDto::getId, UserDto::getUsername)
                .containsExactly(USER_EXIST_ID, "christopher");

        // Verify the user no longer exists in the database
        assertThat(userRepository.findById(USER_EXIST_ID)).isEmpty();
    }

    // deleteUser error path, user does not exist
    @Test
    @DisplayName("deleteUser() should throw ElementNotFoundException when user does not exist")
    void deleteUser_shouldThrow_whenUserDoesNotExist() {
        // Arrange

        // Act & Assert
        assertThatThrownBy(() -> service.deleteUser(USER_NOT_EXIST_ID))
                .isInstanceOf(ElementNotFoundException.class)
                .hasMessageContaining("User Not Found");
    }


}
