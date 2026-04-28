package se.hjulverkstan.main.feature.customer;

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
class CustomerControllerTest {

    @Mock
    private CustomerService customerService;

    @InjectMocks
    private CustomerController customerController;

    @Test
    @DisplayName("getAllCustomers delegates to service")
    void getAllCustomers_DelegatesToService() {
        ListResponseDto<CustomerDto> expected = new ListResponseDto<>(Collections.emptyList());
        when(customerService.getAllCustomer()).thenReturn(expected);

        ListResponseDto<CustomerDto> result = customerController.getAllCustomers();

        assertSame(expected, result);
        verify(customerService).getAllCustomer();
    }

    @Test
    @DisplayName("getCustomerById delegates to service with correct id")
    void getCustomerById_DelegatesToService() {
        CustomerDto expected = new CustomerDto();
        when(customerService.getCustomerById(42L)).thenReturn(expected);

        CustomerDto result = customerController.getCustomerById(42L);

        assertSame(expected, result);
        verify(customerService).getCustomerById(42L);
    }

    @Test
    @DisplayName("createCustomer delegates to service and has @ResponseStatus(CREATED)")
    void createCustomer_DelegatesToService_AndHasCreatedStatus() throws NoSuchMethodException {
        CustomerDto dto = new CustomerDto();
        CustomerDto expected = new CustomerDto();
        when(customerService.createCustomer(dto)).thenReturn(expected);

        CustomerDto result = customerController.createCustomer(dto);

        assertSame(expected, result);
        verify(customerService).createCustomer(dto);

        Method method = CustomerController.class.getMethod("createCustomer", CustomerDto.class);
        ResponseStatus annotation = method.getAnnotation(ResponseStatus.class);
        assertNotNull(annotation, "@ResponseStatus must be present on createCustomer");
        assertEquals(HttpStatus.CREATED, annotation.value());
    }

    @Test
    @DisplayName("editCustomer delegates to service with id and dto")
    void editCustomer_DelegatesToService() {
        CustomerDto dto = new CustomerDto();
        CustomerDto expected = new CustomerDto();
        when(customerService.editCustomer(1L, dto)).thenReturn(expected);

        CustomerDto result = customerController.editCustomer(1L, dto);

        assertSame(expected, result);
        verify(customerService).editCustomer(1L, dto);
    }

    @Test
    @DisplayName("deleteCustomer delegates to service with correct id")
    void deleteCustomer_DelegatesToService() {
        CustomerDto expected = new CustomerDto();
        when(customerService.deleteCustomer(1L)).thenReturn(expected);

        CustomerDto result = customerController.deleteCustomer(1L);

        assertSame(expected, result);
        verify(customerService).deleteCustomer(1L);
    }
}
