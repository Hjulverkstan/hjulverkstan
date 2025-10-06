package se.hjulverkstan.main.feature.customer;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class GetAllCustomerDto {
    private List<CustomerDto> customers;

    public GetAllCustomerDto (List<Customer> customers) {
        this.customers = customers.stream().map(CustomerDto::new).toList();
    }
}
