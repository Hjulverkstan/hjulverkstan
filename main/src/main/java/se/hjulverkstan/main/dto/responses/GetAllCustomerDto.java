package se.hjulverkstan.main.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.dto.CustomerDto;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllCustomerDto {
    private List<CustomerDto> customers;
}
