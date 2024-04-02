package se.hjulverkstan.main.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.CustomerDto;
import se.hjulverkstan.main.dto.NewCustomerDto;
import se.hjulverkstan.main.dto.responses.GetAllCustomerDto;
import se.hjulverkstan.main.model.Customer;
import se.hjulverkstan.main.repository.CustomerRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    public static String ELEMENT_NAME = "Customer";

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public GetAllCustomerDto getAllCustomer() {
        List<Customer> customers = customerRepository.findAll();
        List<CustomerDto> responseList = new ArrayList<>();

        for (Customer customer : customers) {
            responseList.add(new CustomerDto(customer));
        }
        return new GetAllCustomerDto(responseList);
    }

    @Override
    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        return new CustomerDto(customer);
    }

    @Override
    public CustomerDto deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        customerRepository.delete(customer);
        return new CustomerDto(customer);
    }

    @Override
    public CustomerDto editCustomer(Long id, CustomerDto customer) {
        Customer selectedCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException(ELEMENT_NAME));

        selectedCustomer.setName(customer.getName());
        selectedCustomer.setLastName(customer.getLastName());
        selectedCustomer.setPhoneNumber(customer.getPhoneNumber());
        selectedCustomer.setEmail(customer.getEmail());
        selectedCustomer.setComment(customer.getComment());

        customerRepository.save(selectedCustomer);
        return new CustomerDto(selectedCustomer);
    }

    @Override
    public CustomerDto createCustomer(NewCustomerDto newCustomer) {
        Customer customer = new Customer();
        customer.setName(newCustomer.getName());
        customer.setLastName(newCustomer.getLastName());
        customer.setPhoneNumber(newCustomer.getPhoneNumber());
        customer.setEmail(newCustomer.getEmail());
        // Set an empty list for ticketIds
        customer.setTickets(new ArrayList<>());
        customer.setComment(newCustomer.getComment());

        customerRepository.save(customer);
        return new CustomerDto(customer);
    }
}
