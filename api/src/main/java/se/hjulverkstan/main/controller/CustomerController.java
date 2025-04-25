package se.hjulverkstan.main.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.CustomerDto;
import se.hjulverkstan.main.dto.NewCustomerDto;
import se.hjulverkstan.main.dto.responses.GetAllCustomerDto;
import se.hjulverkstan.main.service.CustomerService;

@RestController
@RequestMapping("v1/api/customer")
@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService){
        this.customerService = customerService;
    }

    @GetMapping()
    public ResponseEntity<GetAllCustomerDto> getAllCustomers(){
        return new ResponseEntity<>(customerService.getAllCustomer(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id){
        return new ResponseEntity<>(customerService.getCustomerById(id), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<CustomerDto> createCustomer(@Valid @RequestBody NewCustomerDto newCustomer){
        return new ResponseEntity<>(customerService.createCustomer(newCustomer), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> editCustomer(@PathVariable Long id, @Valid @RequestBody CustomerDto customer){
        return new ResponseEntity<>(customerService.editCustomer(id, customer), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<CustomerDto> deleteCustomer(@PathVariable Long id){
        return new ResponseEntity<>(customerService.deleteCustomer(id), HttpStatus.OK);
    }
}
