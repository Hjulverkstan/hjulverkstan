package se.hjulverkstan.main.feature.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.InvalidDataException;
import se.hjulverkstan.main.shared.ListResponseDto;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public ListResponseDto<CustomerDto> getAllCustomer() {
        List<Customer> customers = customerRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return new ListResponseDto<>(customers.stream().map(CustomerDto::new).toList());
    }

    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Customer"));
        return new CustomerDto(customer);
    }

    @Transactional
    public CustomerDto createCustomer(CustomerDto dto) {
        CustomerUtils.validateDtoBySelf(dto);

        Customer customer = dto.applyToEntity(new Customer());
        customerRepository.save(customer);

        return new CustomerDto(customer);
    }

    @Transactional
    public CustomerDto editCustomer(Long id, CustomerDto dto) {
        CustomerUtils.validateDtoBySelf(dto);

        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Customer"));

        if (customer.isAnonymized()) {
            throw new InvalidDataException("Cannot edit an anonymized customer");
        }

        dto.applyToEntity(customer);
        customerRepository.save(customer);

        return new CustomerDto(customer);
    }

    @Transactional
    public CustomerDto deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Customer"));

        boolean hasTickets = customer.getTickets() != null && !customer.getTickets().isEmpty();

        if (hasTickets && !customer.isAnonymized()) {
            return anonymizeCustomer(customer);
        }

        if (hasTickets) {
            throw new InvalidDataException("Cannot delete an anonymized customer that still has tickets");
        }

        CustomerDto dto = new CustomerDto(customer);
        customerRepository.delete(customer);
        return dto;
    }

    private CustomerDto anonymizeCustomer(Customer customer) {
        if (customer.isAnonymized()) {
            throw new InvalidDataException("Customer is already anonymized");
        }

        customer.setFirstName("Removed");
        customer.setLastName("Customer");
        customer.setPersonalIdentityNumber(null);
        if (customer.getCustomerType() == CustomerType.ORGANIZATION) {
            customer.setOrganizationName("Removed Organization");
        }
        customer.setPhoneNumber(null);
        customer.setEmail(null);
        customer.setComment(null);
        customer.setAnonymized(true);

        customer.getTickets().forEach(ticket -> ticket.setComment(null));

        customerRepository.save(customer);
        return new CustomerDto(customer);
    }
}
