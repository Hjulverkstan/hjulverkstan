package se.hjulverkstan.main.service.user;

import se.hjulverkstan.main.dto.user.CustomerDto;
import se.hjulverkstan.main.dto.user.NewCustomerDto;
import se.hjulverkstan.main.dto.responses.GetAllCustomerDto;

public interface CustomerService {
    GetAllCustomerDto getAllCustomer();
    CustomerDto getCustomerById(Long id);

    CustomerDto deleteCustomer(Long id);

    CustomerDto editCustomer(Long id, CustomerDto customer);
    CustomerDto createCustomer(NewCustomerDto newCustomer);

}
