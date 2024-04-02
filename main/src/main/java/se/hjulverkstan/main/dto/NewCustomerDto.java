package se.hjulverkstan.main.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewCustomerDto {

    @NotBlank(message = "Customer name is required")
    private String name;

    @NotBlank(message = "Customer last name is required")
    private String lastName;

    @NotBlank(message = "Customer phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Customer email is required")
    private String email;

    private String comment;
}
