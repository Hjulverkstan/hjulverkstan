package se.hjulverkstan.main.feature.employee;

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
class EmployeeControllerTest {

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private EmployeeController employeeController;

    @Test
    @DisplayName("getAllEmployees delegates to service")
    void getAllEmployees_DelegatesToService() {
        ListResponseDto<EmployeeDto> expected = new ListResponseDto<>(Collections.emptyList());
        when(employeeService.getAllEmployees()).thenReturn(expected);

        ListResponseDto<EmployeeDto> result = employeeController.getAllEmployees();

        assertSame(expected, result);
        verify(employeeService).getAllEmployees();
    }

    @Test
    @DisplayName("getEmployeeById delegates to service with correct id")
    void getEmployeeById_DelegatesToService() {
        EmployeeDto expected = new EmployeeDto();
        when(employeeService.getEmployeeById(5L)).thenReturn(expected);

        EmployeeDto result = employeeController.getEmployeeById(5L);

        assertSame(expected, result);
        verify(employeeService).getEmployeeById(5L);
    }

    @Test
    @DisplayName("createEmployee delegates to service and has @ResponseStatus(CREATED)")
    void createEmployee_DelegatesToService_AndHasCreatedStatus() throws NoSuchMethodException {
        EmployeeDto dto = new EmployeeDto();
        EmployeeDto expected = new EmployeeDto();
        when(employeeService.createEmployee(dto)).thenReturn(expected);

        EmployeeDto result = employeeController.createEmployee(dto);

        assertSame(expected, result);
        verify(employeeService).createEmployee(dto);

        Method method = EmployeeController.class.getMethod("createEmployee", EmployeeDto.class);
        ResponseStatus annotation = method.getAnnotation(ResponseStatus.class);
        assertNotNull(annotation, "@ResponseStatus must be present on createEmployee");
        assertEquals(HttpStatus.CREATED, annotation.value());
    }

    @Test
    @DisplayName("editEmployee delegates to service with id and dto")
    void editEmployee_DelegatesToService() {
        EmployeeDto dto = new EmployeeDto();
        EmployeeDto expected = new EmployeeDto();
        when(employeeService.editEmployee(1L, dto)).thenReturn(expected);

        EmployeeDto result = employeeController.editEmployee(1L, dto);

        assertSame(expected, result);
        verify(employeeService).editEmployee(1L, dto);
    }

    @Test
    @DisplayName("deleteEmployee delegates to service with correct id")
    void deleteEmployee_DelegatesToService() {
        EmployeeDto expected = new EmployeeDto();
        when(employeeService.hardDeleteEmployee(1L)).thenReturn(expected);

        EmployeeDto result = employeeController.deleteEmployee(1L);

        assertSame(expected, result);
        verify(employeeService).hardDeleteEmployee(1L);
    }
}
