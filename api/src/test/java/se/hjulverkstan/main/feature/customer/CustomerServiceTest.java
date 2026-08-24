package se.hjulverkstan.main.feature.customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.test.util.ReflectionTestUtils;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.InvalidDataException;
import se.hjulverkstan.main.error.exceptions.MissingArgumentException;
import se.hjulverkstan.main.feature.ticket.Ticket;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    private CustomerDto personDto;
    private CustomerDto orgDto;

    @BeforeEach
    void setUp() {
        personDto = new CustomerDto();
        personDto.setCustomerType(CustomerType.PERSON);
        personDto.setFirstName("John");
        personDto.setLastName("Doe");
        personDto.setEmail("john@example.com");
        personDto.setPhoneNumber("123-456789");
        personDto.setPersonalIdentityNumber("19900101-1234");
        personDto.setComment("Regular customer");

        orgDto = new CustomerDto();
        orgDto.setCustomerType(CustomerType.ORGANIZATION);
        orgDto.setFirstName("Acme");
        orgDto.setOrganizationName("Acme Corp");
        orgDto.setEmail("info@acme.com");
        orgDto.setPhoneNumber("987-654321");
        orgDto.setPersonalIdentityNumber("556677-8899");
    }

    @Test
    void getAllCustomer_ReturnsMappedDtos() {
        Customer c1 = new Customer();
        c1.setFirstName("A");
        c1.setLastName("B");
        c1.setTickets(new ArrayList<>());
        when(customerRepository.findAllByDeletedFalse(any(Sort.class))).thenReturn(List.of(c1));

        ListResponseDto<CustomerDto> result = customerService.getAllCustomer();

        assertEquals(1, result.getContent().size());
        assertEquals("A", result.getContent().get(0).getFirstName());
    }

    @Test
    void getCustomerById_Success() {
        Customer customer = new Customer();
        ReflectionTestUtils.setField(customer, "id", 1L);
        customer.setFirstName("Target");
        customer.setTickets(new ArrayList<>());
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        CustomerDto result = customerService.getCustomerById(1L);
        assertEquals("Target", result.getFirstName());
        assertEquals(1L, result.getId());
    }

    @Test
    void getCustomerById_NotFound_ThrowsException() {
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> customerService.getCustomerById(99L));
    }

    @Test
    void validation_MissingType_ThrowsException() {
        personDto.setCustomerType(null);
        assertThrows(MissingArgumentException.class, () -> customerService.createCustomer(personDto));
    }

    @Test
    void validation_MissingFirstName_ThrowsException() {
        personDto.setFirstName("");
        assertThrows(MissingArgumentException.class, () -> customerService.createCustomer(personDto));
    }

    @Test
    void validation_MissingPhone_ThrowsException() {
        personDto.setPhoneNumber(null);
        assertThrows(MissingArgumentException.class, () -> customerService.createCustomer(personDto));
    }

    @Test
    void validation_MissingEmail_ThrowsException() {
        personDto.setEmail("   ");
        assertThrows(InvalidDataException.class, () -> customerService.createCustomer(personDto));
    }

    @Test
    void validation_InvalidEmail_ThrowsException() {
        personDto.setEmail("not-an-email");
        assertThrows(InvalidDataException.class, () -> customerService.createCustomer(personDto));
    }

    @Test
    void validation_MissingOrgName_ThrowsException() {
        orgDto.setOrganizationName("");
        assertThrows(MissingArgumentException.class, () -> customerService.createCustomer(orgDto));
    }

    @Test
    void validation_NullPin_Success() {
        personDto.setPersonalIdentityNumber(null);
        when(customerRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        CustomerDto result = customerService.createCustomer(personDto);

        verify(customerRepository).save(any());
        assertNotNull(result);
    }

    @Test
    void validation_InvalidPin_ThrowsException() {
        personDto.setPersonalIdentityNumber("12345");
        assertThrows(InvalidDataException.class, () -> customerService.createCustomer(personDto));
    }


    @Test
    void createCustomer_Success_FullMapping() {
        when(customerRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        CustomerDto result = customerService.createCustomer(personDto);

        ArgumentCaptor<Customer> captor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(captor.capture());
        Customer saved = captor.getValue();

        assertEquals("John", saved.getFirstName());
        assertEquals("Doe", saved.getLastName());
        assertEquals("john@example.com", saved.getEmail());
        assertEquals("123-456789", saved.getPhoneNumber());
        assertEquals("19900101-1234", saved.getPersonalIdentityNumber());
        assertEquals("Regular customer", saved.getComment());
        assertEquals(CustomerType.PERSON, saved.getCustomerType());

        assertNotNull(result);
        assertEquals("John", result.getFirstName());
    }

    @Test
    void createCustomer_Organization_Success() {
        when(customerRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        customerService.createCustomer(orgDto);

        ArgumentCaptor<Customer> captor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(captor.capture());
        Customer saved = captor.getValue();

        assertEquals("Acme Corp", saved.getOrganizationName());
        assertEquals(CustomerType.ORGANIZATION, saved.getCustomerType());
    }

    @Test
    void editCustomer_NotFound_ThrowsException() {
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> customerService.editCustomer(1L, personDto));
    }

    @Test
    void editCustomer_ValidationFailure_ThrowsException() {
        personDto.setPhoneNumber("");
        assertThrows(MissingArgumentException.class, () -> customerService.editCustomer(1L, personDto));
    }

    @Test
    void editCustomer_Success_ReturnsDto() {
        Customer existing = new Customer();
        ReflectionTestUtils.setField(existing, "id", 1L);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(customerRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        CustomerDto result = customerService.editCustomer(1L, personDto);

        verify(customerRepository).save(existing);
        assertNotNull(result);
        assertEquals("John", result.getFirstName());
    }

    @Test
    void editCustomer_Organization_Success() {
        Customer existing = new Customer();
        ReflectionTestUtils.setField(existing, "id", 2L);
        when(customerRepository.findById(2L)).thenReturn(Optional.of(existing));
        when(customerRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        customerService.editCustomer(2L, orgDto);

        ArgumentCaptor<Customer> captor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(captor.capture());
        Customer saved = captor.getValue();

        assertEquals("Acme Corp", saved.getOrganizationName());
        assertEquals(CustomerType.ORGANIZATION, saved.getCustomerType());
    }

    @Test
    void editCustomer_IdenticalUser_Success() {
        Customer existing = new Customer();
        ReflectionTestUtils.setField(existing, "id", 1L);
        existing.setEmail("john@example.com");
        existing.setPersonalIdentityNumber("19900101-1234");

        when(customerRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(customerRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        customerService.editCustomer(1L, personDto);
        verify(customerRepository).save(existing);
    }

    @Test
    void deleteCustomer_NotFound_ThrowsException() {
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ElementNotFoundException.class, () -> customerService.deleteCustomer(99L));
    }

    @Test
    void deleteCustomer_NoTickets_HardDelete() {
        Customer customer = new Customer();
        customer.setTickets(new ArrayList<>());
        when(customerRepository.findById(10L)).thenReturn(Optional.of(customer));

        CustomerDto result = customerService.deleteCustomer(10L);

        verify(customerRepository).delete(customer);
        assertNotNull(result);
    }

    @Test
    void deleteCustomer_WithTickets_TriggersAnonymization() {
        Customer customer = new Customer();
        ReflectionTestUtils.setField(customer, "id", 5L);
        customer.setFirstName("Secret");
        customer.setLastName("Identity");
        customer.setPhoneNumber("555-PRIV");
        customer.setEmail("secret@pii.com");
        customer.setPersonalIdentityNumber("19800101-1234");
        customer.setComment("Top secret note");
        customer.setCustomerType(CustomerType.PERSON);
        customer.setTickets(new ArrayList<>());

        Ticket ticket = new Ticket();
        ticket.setComment("Sensitive Info");
        ticket.setRepairDescription("Broken wheel");
        customer.getTickets().add(ticket);

        when(customerRepository.findById(5L)).thenReturn(Optional.of(customer));
        when(customerRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        CustomerDto result = customerService.deleteCustomer(5L);

        assertTrue(result.isAnonymized());
        assertEquals("Removed", customer.getFirstName());
        assertEquals("Customer", customer.getLastName());
        assertNull(customer.getPersonalIdentityNumber());
        assertNull(customer.getPhoneNumber());
        assertNull(customer.getEmail());
        assertNull(customer.getComment());
        assertNull(ticket.getComment());
        assertEquals("Broken wheel", ticket.getRepairDescription());

        verify(customerRepository).save(customer);
    }

    @Test
    void anonymize_Organization_ClearsOrgName() {
        Customer customer = new Customer();
        ReflectionTestUtils.setField(customer, "id", 10L);
        customer.setCustomerType(CustomerType.ORGANIZATION);
        customer.setOrganizationName("Acme Corp");
        customer.setTickets(new ArrayList<>());

        Ticket ticket = new Ticket();
        customer.getTickets().add(ticket);

        when(customerRepository.findById(10L)).thenReturn(Optional.of(customer));
        when(customerRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        customerService.deleteCustomer(10L);

        assertEquals("Removed Organization", customer.getOrganizationName());
    }
}