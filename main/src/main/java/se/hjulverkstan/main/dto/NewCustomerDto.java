package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @NotBlank(message = "Customer last_name is required")
    @JsonProperty("last_name")
    private String lastName;

    @NotBlank(message = "Customer phone_number is required")
    @JsonProperty("phone_number")
    private String phoneNumber;

    @NotBlank(message = "Customer email is required")
    private String email;

    private String comment;
}
