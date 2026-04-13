package se.hjulverkstan.main.feature.customer;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.shared.ListResponseDto;

@RestController
@RequestMapping("v1/api/customer")
@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping()
    public ListResponseDto<CustomerDto> getAllCustomers(){
        return customerService.getAllCustomer();
    }

    @GetMapping("/{id}")
    public CustomerDto getCustomerById(@PathVariable Long id){
        return customerService.getCustomerById(id);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerDto createCustomer(@Valid @RequestBody CustomerDto dto){
        return customerService.createCustomer(dto);
    }

    @PutMapping("/{id}")
    public CustomerDto editCustomer(@PathVariable Long id, @Valid @RequestBody CustomerDto dto){
        return customerService.editCustomer(id, dto);
    }

    @DeleteMapping("/{id}/purge")
    public CustomerDto deleteCustomer(@PathVariable Long id){
        return customerService.deleteCustomer(id);
    }

    @DeleteMapping("/{id}")
    public CustomerDto softDeleteCustomer(@PathVariable Long id){
        return customerService.softDeleteCustomer(id);
    }
}
