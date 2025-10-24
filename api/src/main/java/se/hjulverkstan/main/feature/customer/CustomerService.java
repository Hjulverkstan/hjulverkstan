package se.hjulverkstan.main.feature.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.main.error.exceptions.CouldNotDeleteException;
import se.hjulverkstan.main.error.exceptions.ElementNotFoundException;
import se.hjulverkstan.main.error.exceptions.MissingArgumentException;
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
        dto.applyToEntity(customer);
        customerRepository.save(customer);

        return new CustomerDto(customer);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ElementNotFoundException("Customer"));

        if (customer.getTickets() != null && !customer.getTickets().isEmpty()) {
            throw new CouldNotDeleteException("Can't delete employees with tickets!");
        }

        customerRepository.delete(customer);
    }
}
