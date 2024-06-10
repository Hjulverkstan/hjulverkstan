package se.hjulverkstan.main.service;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.Exceptions.MissingArgumentException;
import se.hjulverkstan.main.dto.CustomerDto;
import se.hjulverkstan.main.dto.NewCustomerDto;
import se.hjulverkstan.main.dto.responses.GetAllCustomerDto;
import se.hjulverkstan.main.model.Customer;
import se.hjulverkstan.main.model.CustomerType;
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
        List<Customer> customers = customerRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
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

        selectedCustomer.setCustomerType(customer.getCustomerType());
        selectedCustomer.setFirstName(customer.getFirstName());
        selectedCustomer.setLastName(customer.getLastName());
        selectedCustomer.setPersonalIdentityNumber(customer.getPersonalIdentityNumber());

        // Requires orgName if customer is an organization
        if (selectedCustomer.getCustomerType().equals(CustomerType.ORGANIZATION) && customer.getOrganizationName() == null) {
            throw new MissingArgumentException("Organization name");
        }
        selectedCustomer.setOrganizationName(customer.getOrganizationName());
        selectedCustomer.setPhoneNumber(customer.getPhoneNumber());
        selectedCustomer.setEmail(customer.getEmail());
        selectedCustomer.setAddress(customer.getAddress());
        selectedCustomer.setComment(customer.getComment());

        customerRepository.save(selectedCustomer);
        return new CustomerDto(selectedCustomer);
    }

    @Override
    public CustomerDto createCustomer(NewCustomerDto newCustomer) {
        Customer customer = new Customer();
        customer.setCustomerType(newCustomer.getCustomerType());
        customer.setFirstName(newCustomer.getFirstName());
        customer.setLastName(newCustomer.getLastName());
        customer.setPersonalIdentityNumber(newCustomer.getPersonalIdentityNumber());

        // Requires orgName if customer is an organization
        if (customer.getCustomerType().equals(CustomerType.ORGANIZATION) && newCustomer.getOrganizationName() == null) {
            throw new MissingArgumentException("Organization name");
        }
        customer.setOrganizationName(newCustomer.getOrganizationName());
        customer.setPhoneNumber(newCustomer.getPhoneNumber());
        customer.setEmail(newCustomer.getEmail());
        customer.setAddress(newCustomer.getAddress());
        customer.setTickets(new ArrayList<>());
        customer.setComment(newCustomer.getComment());

        customerRepository.save(customer);
        return new CustomerDto(customer);
    }
}
