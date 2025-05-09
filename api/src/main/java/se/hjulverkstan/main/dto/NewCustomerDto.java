package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.CustomerType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewCustomerDto {
    @NotNull(message = "Customer type is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private CustomerType customerType;

    @NotBlank(message = "Customer first name is required")
    private String firstName;

    @NotBlank(message = "Customer last name is required")
    private String lastName;

    @Pattern(
            regexp = "^\\d{8}-\\d{4}$",
            message = "Personal Identity Number must be in the format YYYYMMDD-XXXX"
    )
    private String personalIdentityNumber;

    private String organizationName;

    @NotBlank(message = "Customer phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Customer email is required")
    private String email;

    private String comment;
}
