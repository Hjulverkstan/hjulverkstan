package se.hjulverkstan.main.feature.user;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.lang.reflect.Method;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @Test
    @DisplayName("getAllUsers delegates to service")
    void getAllUsers_DelegatesToService() {
        ListResponseDto<UserDto> expected = new ListResponseDto<>(Collections.emptyList());
        when(userService.getAllUsers()).thenReturn(expected);

        ListResponseDto<UserDto> result = userController.getAllUsers();

        assertSame(expected, result);
        verify(userService).getAllUsers();
    }

    @Test
    @DisplayName("getUserById delegates to service with correct id")
    void getUserById_DelegatesToService() {
        UserDto expected = new UserDto();
        when(userService.getUserById(1L)).thenReturn(expected);

        UserDto result = userController.getUserById(1L);

        assertSame(expected, result);
        verify(userService).getUserById(1L);
    }

    @Test
    @DisplayName("createUser delegates to service and has @ResponseStatus(CREATED)")
    void createUser_DelegatesToService_AndHasCreatedStatus() throws NoSuchMethodException {
        UserDto dto = new UserDto();
        UserDto expected = new UserDto();
        when(userService.createUser(dto)).thenReturn(expected);

        UserDto result = userController.createUser(dto);

        assertSame(expected, result);
        verify(userService).createUser(dto);

        Method method = UserController.class.getMethod("createUser", UserDto.class);
        ResponseStatus annotation = method.getAnnotation(ResponseStatus.class);
        assertNotNull(annotation, "@ResponseStatus must be present on createUser");
        assertEquals(HttpStatus.CREATED, annotation.value());
    }

    @Test
    @DisplayName("updateUser delegates to service with id and dto")
    void updateUser_DelegatesToService() {
        UserDto dto = new UserDto();
        UserDto expected = new UserDto();
        when(userService.updateUser(1L, dto)).thenReturn(expected);

        UserDto result = userController.updateUser(1L, dto);

        assertSame(expected, result);
        verify(userService).updateUser(1L, dto);
    }

    @Test
    @DisplayName("deleteUser delegates to service and has @ResponseStatus(NO_CONTENT)")
    void deleteUser_DelegatesToService_AndHasNoContentStatus() throws NoSuchMethodException {
        userController.hardDeleteUser(1L);

        verify(userService).hardDeleteUser(1L);

        Method method = UserController.class.getMethod("hardDeleteUser", Long.class);
        ResponseStatus annotation = method.getAnnotation(ResponseStatus.class);
        assertNotNull(annotation, "@ResponseStatus must be present on deleteUser");
        assertEquals(HttpStatus.NO_CONTENT, annotation.value());
    }
}
