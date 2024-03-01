package se.hjulverkstan.main.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.CustomerDto;
import se.hjulverkstan.main.dto.NewCustomerDto;
import se.hjulverkstan.main.dto.responses.GetAllCustomerDto;
import se.hjulverkstan.main.model.Customer;
import se.hjulverkstan.main.repository.CustomerRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService{
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
            responseList.add(new CustomerDto(customer)
            );
        }
        return  new GetAllCustomerDto(responseList);
    }

    @Override
    public CustomerDto getCustomerById(Long id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if(customerOpt.isEmpty()){
            //Throw Exception
            throw new ElementNotFoundException(ELEMENT_NAME);
        }
        return new CustomerDto(customerOpt.get());
    }

    @Override
    public CustomerDto deleteCustomer(Long id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if(customerOpt.isEmpty()){
            //Throw Exception
            throw new ElementNotFoundException(ELEMENT_NAME);
        }
        customerRepository.delete(customerOpt.get());
        return new CustomerDto(customerOpt.get());
    }
    @Transactional
    @Override
    public CustomerDto editCustomer(Long id, CustomerDto customer) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if(customerOpt.isEmpty()){
            //Throw Exception
            throw new ElementNotFoundException(ELEMENT_NAME);
        }
        Customer selectedCustomer = customerOpt.get();
        if(customer.getName() != null)
        {
            selectedCustomer.setName(customer.getName());
        }
        if(customer.getLastName() != null)
        {
            selectedCustomer.setLastName(customer.getLastName());
        }
        if(customer.getEmail()!= null){
            selectedCustomer.setEmail(customer.getEmail());
        }
        if(customer.getPhoneNumber()!= null){
            selectedCustomer.setPhoneNumber(customer.getPhoneNumber());
        }
        selectedCustomer.setUpdatedAtt(LocalDateTime.now());
        customerRepository.save(selectedCustomer);
        return  new CustomerDto(selectedCustomer);
    }

    @Override
    public CustomerDto createCustomer(NewCustomerDto newCustomer) {
        Customer customer = new Customer();
        customer.setName(newCustomer.getName());
        customer.setEmail(newCustomer.getEmail());
        customer.setLastName(newCustomer.getLastName());
        customer.setPhoneNumber(newCustomer.getPhoneNumber());
        customer.setCreatedAtt(LocalDateTime.now());
        customer.setUpdatedAtt(LocalDateTime.now());
        customerRepository.save(customer);
        return new CustomerDto(customer);
    }
}
